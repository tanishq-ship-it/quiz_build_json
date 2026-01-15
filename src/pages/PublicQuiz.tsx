import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Moon, Sun } from "lucide-react";
import Lottie from "lottie-react";
import ScreenRouter, { type ScreenData } from "../services/ScreenRouter";
import qtLogo from "../assests/qt.svg";
import sandyLoading from "../assests/Sandy Loading.json";
import {
  getQuiz,
  createQuizResponse,
  appendQuizScreenResponse,
  type ScreenResponseItem,
} from "../services/api";

type InputMode = "single" | "array" | "config";

const DEFAULT_SCREEN: ScreenData = {
  id: "welcome",
  content: [
    {
      type: "heading",
      content: "Quiz Preview",
      fontSize: 24,
    },
    {
      type: "text",
      content: "This will play all screens you have added to this quiz.",
      align: "center",
      color: "#555",
    },
  ],
};

const DEFAULT_SCREENS: ScreenData[] = [DEFAULT_SCREEN];

const PLACEHOLDERS: Record<string, string> = {
  "{{image}}": qtLogo,
  "{{logo}}": qtLogo,
  "{{hero}}": qtLogo,
};

const validateScreen = (value: unknown, context?: string): ScreenData => {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray((value as { content?: unknown[] }).content) ||
    typeof (value as { id?: unknown }).id !== "string"
  ) {
    const prefix = context ? `${context}: ` : "";
    throw new Error(
      `${prefix}Each screen must look like {"id": "screen-id", "content": [...]}.`,
    );
  }

  return value as ScreenData;
};

const normalizeScreensInput = (parsed: unknown): { screens: ScreenData[]; mode: InputMode } => {
  // Case 1: Top-level array of screens
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      throw new Error("Screens array cannot be empty.");
    }

    const screens = parsed.map((item, index) => validateScreen(item, `Item ${index + 1}`));

    return { screens, mode: "array" };
  }

  // Case 2: Config object with `screens` array
  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { screens?: unknown[] }).screens)
  ) {
    const { screens: rawScreens } = parsed as { screens: unknown[] };

    if (rawScreens.length === 0) {
      throw new Error("Config.screens array cannot be empty.");
    }

    const screens = rawScreens.map((item, index) =>
      validateScreen(item, `screens[${index}]`),
    );

    return { screens, mode: "config" };
  }

  // Case 3: Single screen object
  const screen = validateScreen(parsed);
  return { screens: [screen], mode: "single" };
};

const PublicQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId?: string }>();

  const [screens, setScreens] = useState<ScreenData[]>(DEFAULT_SCREENS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [quizResponseId, setQuizResponseId] = useState<string | null>(null);
  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(0);
  const [currentScreenId, setCurrentScreenId] = useState<string | null>(null);
  const [screenEnteredAt, setScreenEnteredAt] = useState<number | null>(null);
  const responsesByIndexRef = useRef<Record<number, unknown>>({});

  const getInitialIndexFromHash = (availableScreens: ScreenData[]): number => {
    if (typeof window === "undefined") return 0;
    const raw = window.location.hash ?? "";
    const trimmed = raw.startsWith("#") ? raw.slice(1) : raw;
    if (!trimmed) return 0;
    const hashId = (() => {
      try {
        return decodeURIComponent(trimmed);
      } catch {
        return trimmed;
      }
    })();
    const idx = availableScreens.findIndex((s) => s.id === hashId);
    return idx >= 0 ? idx : 0;
  };

  useEffect(() => {
    if (!quizId) {
      setError("Missing quiz id.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);

        setQuizResponseId(null);
        setCurrentScreenIndex(0);
        setCurrentScreenId(null);
        setScreenEnteredAt(null);
        responsesByIndexRef.current = {};

        const quiz = await getQuiz(quizId);
        const rawContent = quiz.content ?? DEFAULT_SCREENS;

        if (cancelled) return;

        // Only allow playing when the quiz is live and not soft-deleted
        const quizIsLive = quiz.live && !quiz.deletion;
        setIsLive(quizIsLive);

        try {
          const { screens: parsedScreens } = normalizeScreensInput(rawContent);
          setScreens(parsedScreens);

          if (quizIsLive) {
            try {
              const quizResponse = await createQuizResponse(quiz.id);
              if (!cancelled) {
                const initialIndex = getInitialIndexFromHash(parsedScreens);
                setQuizResponseId(quizResponse.id);
                setCurrentScreenIndex(initialIndex);
                setCurrentScreenId(parsedScreens[initialIndex]?.id ?? null);
                setScreenEnteredAt(Date.now());
              }
            } catch {
              // If creating a response fails, we still allow viewing the quiz
              // eslint-disable-next-line no-console
              console.error("Failed to create quiz response");
            }
          }
        } catch (parseError) {
          const message =
            parseError instanceof Error ? parseError.message : "Invalid quiz content.";
          setError(message);
          setScreens(DEFAULT_SCREENS);
        }
      } catch {
        if (cancelled) return;
        setError("Failed to load quiz.");
        setScreens(DEFAULT_SCREENS);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const appendCurrentScreenIfNeeded = async (): Promise<void> => {
    if (!quizResponseId || screenEnteredAt == null || currentScreenId == null) {
      return;
    }

    const now = Date.now();
    const baseResponse = responsesByIndexRef.current[currentScreenIndex] ?? null;

    const screenItem: ScreenResponseItem = {
      screenId: currentScreenId,
      index: currentScreenIndex,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response: baseResponse as any,
      timeTakenMs: now - screenEnteredAt,
      enteredAt: new Date(screenEnteredAt).toISOString(),
      exitedAt: new Date(now).toISOString(),
    };

    try {
      await appendQuizScreenResponse(quizResponseId, screenItem);
    } catch {
      // eslint-disable-next-line no-console
      console.error("Failed to append screen response");
    }
  };

  const handleScreenChange = (index: number, screenId: string): void => {
    void appendCurrentScreenIfNeeded();
    setCurrentScreenIndex(index);
    setCurrentScreenId(screenId);
    setScreenEnteredAt(Date.now());
  };

  const handleComplete = (): void => {
    void appendCurrentScreenIfNeeded();
  };

  const handleScreenResponse = (params: {
    index: number;
    screenId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: any;
  }): void => {
    const previous = (responsesByIndexRef.current[params.index] ?? {}) as Record<string, unknown>;
    const merged = {
      ...previous,
      ...(params.response as Record<string, unknown>),
    };
    responsesByIndexRef.current[params.index] = merged;
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`quiz-play min-h-screen w-full ${
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      } relative`}
    >
      {/* Theme toggle */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-slate-800"
        aria-label="Toggle theme"
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      {/* Main content: ScreenRouter full-page */}
      <div className="w-full h-screen flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading quiz screens...
          </div>
        ) : error ? (
          <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
            {error}
          </div>
        ) : isLive ? (
          <ScreenRouter
            config={{
              screens,
              placeholders: PLACEHOLDERS,
              hashHistory: "push",
              onScreenChange: handleScreenChange,
              onComplete: handleComplete,
              onScreenResponse: handleScreenResponse,
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-center px-6 py-8 rounded-xl bg-slate-50 border border-slate-200 max-w-sm">
            <div className="w-40 h-40">
              <Lottie animationData={sandyLoading} loop autoplay />
            </div>
            <span className="text-sm font-medium text-slate-900">
              This quiz is not live yet
            </span>
            <p className="text-xs text-slate-600">
              The creator is still working on this quiz. Please check back later once it&apos;s
              published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicQuiz;


