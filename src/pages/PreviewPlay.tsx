import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ScreenRouter, { type ScreenData } from "../services/ScreenRouter";
import qtLogo from "../assests/qt.svg";
import { getQuiz } from "../services/api";

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

const getStartScreenIdFromHash = (): string | null => {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash ?? "";
  const trimmed = raw.startsWith("#") ? raw.slice(1) : raw;
  if (!trimmed) return null;
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
};

const rotateScreensFromIndex = (list: ScreenData[], startIndex: number): ScreenData[] => {
  if (startIndex <= 0 || startIndex >= list.length) return list;
  return [...list.slice(startIndex), ...list.slice(0, startIndex)];
};

const PreviewPlay: React.FC = () => {
  const { quizId } = useParams<{ quizId?: string }>();

  const [screens, setScreens] = useState<ScreenData[]>(DEFAULT_SCREENS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        const quiz = await getQuiz(quizId);
        const rawContent = quiz.content ?? DEFAULT_SCREENS;

        if (cancelled) return;

        try {
          const { screens: parsedScreens } = normalizeScreensInput(rawContent);
          const startScreenId = getStartScreenIdFromHash();
          if (!startScreenId) {
            setScreens(parsedScreens);
            return;
          }

          const startIndex = parsedScreens.findIndex((screen) => screen.id === startScreenId);
          setScreens(startIndex >= 0 ? rotateScreensFromIndex(parsedScreens, startIndex) : parsedScreens);
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

  return (
    <div
      className="min-h-screen w-full bg-white text-slate-900 relative"
    >
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
        ) : (
          <ScreenRouter
            config={{
              screens,
              placeholders: PLACEHOLDERS,
              hashHistory: "push",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewPlay;



