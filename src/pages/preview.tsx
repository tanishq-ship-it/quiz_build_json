import React, { useEffect, useRef, useState } from "react";
import { Moon, Play, Plus, Sun, Zap } from "lucide-react";
import { useParams } from "react-router-dom";
import ScreenRouter, { type ScreenData } from "../services/ScreenRouter";
import qtLogo from "../assests/qt.svg";
import { getQuiz } from "../services/api";

type InputMode = "single" | "array" | "config";

const DEFAULT_SCREEN: ScreenData = {
  id: "welcome",
  content: [
    {
      type: "heading",
      content: "JSON Preview",
      fontSize: 24,
    },
    {
      type: "text",
      content: "Edit the JSON on the left to change this preview.",
      align: "center",
      color: "#555",
    },
    {
      type: "button",
      text: "Next",
    },
  ],
};

const DEFAULT_SCREENS: ScreenData[] = [DEFAULT_SCREEN];

const DEFAULT_JSON = JSON.stringify(DEFAULT_SCREEN, null, 2);

const PLACEHOLDERS: Record<string, string> = {
  "{{image}}": qtLogo,
  "{{logo}}": qtLogo,
  "{{hero}}": qtLogo,
};

const MIN_PANEL_WIDTH = 30;
const MAX_PANEL_WIDTH = 70;

const Preview: React.FC = () => {
  const { quizId } = useParams<{ quizId?: string }>();
  const [rawJson, setRawJson] = useState<string>(DEFAULT_JSON);
  const [parsedScreens, setParsedScreens] = useState<ScreenData[]>(DEFAULT_SCREENS);
  const [inputMode, setInputMode] = useState<InputMode>("single");
  const [error, setError] = useState<string | null>(null);
  const [editorWidth, setEditorWidth] = useState<number>(40);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("light");
  const [globalTheme, setGlobalTheme] = useState<"dark" | "light">("light");

  const splitContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  useEffect(() => {
    if (!quizId) return;

    let cancelled = false;

    const loadQuiz = async () => {
      try {
        const quiz = await getQuiz(quizId);
        const content = quiz.content ?? DEFAULT_SCREEN;

        const jsonValue = JSON.stringify(content, null, 2);

        if (cancelled) return;

        setRawJson(jsonValue);

        try {
          const { screens, mode } = normalizeScreensInput(content);
          setParsedScreens(screens);
          setInputMode(mode);
          setError(null);
        } catch (parseError) {
          const message =
            parseError instanceof Error ? parseError.message : "Invalid quiz content";
          setError(message);
        }
      } catch {
        if (cancelled) return;
        // If loading fails, keep the local default JSON/preview
      }
    };

    void loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const handleJsonChange = (value: string) => {
    setRawJson(value);

    try {
      const parsed = JSON.parse(value);
      const { screens, mode } = normalizeScreensInput(parsed);
      setParsedScreens(screens);
      setInputMode(mode);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setError(message);
    }
  };

  const handleResetExample = () => {
    setRawJson(DEFAULT_JSON);
    setParsedScreens(DEFAULT_SCREENS);
    setInputMode("single");
    setError(null);
  };

  const calculateWidthFromClientX = (clientX: number) => {
    const container = splitContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const rawPercent = (relativeX / rect.width) * 100;
    const clamped = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, rawPercent));
    setEditorWidth(clamped);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      calculateWidthFromClientX(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        calculateWidthFromClientX(event.touches[0].clientX);
      }
    };

    const stopDragging = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopDragging);
    window.addEventListener("touchcancel", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
      window.removeEventListener("touchcancel", stopDragging);
    };
  }, [isDragging]);

  const isDark = globalTheme === "dark";

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-[#020617] via-[#020617] to-[#0b1120]"
          : "bg-gradient-to-br from-[#f9fafb] via-[#eef2ff] to-[#e0f2fe]"
      }`}
    >
      {/* Background glow + subtle texture */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-400/35 blur-3xl" />
        <div className="absolute -bottom-40 -right-16 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Global theme toggle - top right */}
      <button
        type="button"
        onClick={() => setGlobalTheme(isDark ? "light" : "dark")}
        className={`fixed top-5 right-5 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
          isDark
            ? "bg-purple-800/80 border border-purple-300/40 text-slate-100 hover:bg-purple-900/80 shadow-sm shadow-purple-950/60 backdrop-blur-xl"
            : "bg-purple-50 border border-purple-200 text-slate-600 hover:bg-purple-100 hover:text-slate-900 shadow-sm shadow-purple-200/80 backdrop-blur-xl"
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </button>

      <main className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-6 md:py-8 flex flex-col gap-6">
        {/* Header */}
        <header
          className={`flex items-center justify-between transition-all duration-700 ease-out ${
            hasMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark
                  ? "bg-white/10 border border-white/15 backdrop-blur-xl shadow-sm shadow-sky-500/30"
                  : "bg-white/70 border border-white/80 backdrop-blur-xl shadow-sm shadow-sky-500/20"
              }`}
            >
              <Zap className={isDark ? "w-4 h-4 text-sky-300" : "w-4 h-4 text-sky-600"} />
            </div>
            <h1
              className={`text-base font-inter-semibold tracking-[-0.01em] ${
                isDark ? "text-slate-50" : "text-slate-900"
              }`}
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              Screen Preview
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`hidden md:flex items-center gap-2 text-[11px] tracking-wide uppercase rounded-full px-2.5 py-1 ${
                isDark
                  ? "bg-white/5 text-white/50 border border-white/10"
                  : "bg-white/70 text-sky-800/70 border border-white/80 shadow-sm shadow-sky-500/20 backdrop-blur-md"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? "bg-emerald-400/80" : "bg-emerald-500/70"
                } animate-pulse`}
              />
              Live
            </span>
          </div>
        </header>

        {/* Split layout */}
        <section
          ref={splitContainerRef}
          className={`flex flex-col md:flex-row items-stretch gap-0 rounded-2xl overflow-hidden transition-all duration-500 ${
            isDark
              ? "bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.9)]"
              : "bg-white/70 border border-white/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.16)]"
          }`}
          style={{ minHeight: "calc(100vh - 140px)" }}
        >
          {/* Left: JSON editor */}
          <div
            className={`flex flex-col transition-all duration-300 ${
              isDark ? "border-r border-white/10 bg-slate-950/30" : "border-r border-white/40 bg-white/40 backdrop-blur-xl"
            }`}
            style={{ flexBasis: `${editorWidth}%` }}
          >
            <div
              className={`flex items-center justify-between px-5 py-4 ${
                isDark ? "border-b border-white/5 bg-slate-950/40" : "border-b border-white/70 bg-white/60 backdrop-blur-xl"
              }`}
            >
              <span
                className={`text-xs font-medium tracking-wide ${
                  isDark ? "text-slate-300/80" : "text-slate-500/85"
                }`}
              >
                EDITOR
              </span>
              <button
                type="button"
                className={`inline-flex items-center justify-center h-7 px-3 rounded-md text-[11px] font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-white/5 text-slate-100 border border-white/15 hover:bg-white/10"
                    : "bg-purple-50 text-purple-800 border border-purple-100 shadow-sm shadow-purple-100/70 hover:bg-purple-100"
                }`}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add
              </button>
            </div>

            <div className="relative flex-1 p-4">
              
              <textarea
                className={`w-full h-full font-mono text-[13px] leading-[1.7] rounded-xl p-4 resize-none transition-all duration-300 focus:outline-none ${
                  isDark
                    ? "bg-black/40 text-white/80 placeholder-white/20 border border-white/[0.04] focus:border-white/[0.1]"
                    : "bg-white/80 text-slate-800 placeholder-slate-400 border border-sky-100 shadow-[0_18px_65px_rgba(15,23,42,0.08)] focus:border-sky-400/80 focus:ring-2 focus:ring-sky-300/40 focus:ring-offset-0"
                }`}
                value={rawJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                spellCheck={false}
                style={{ fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" }}
              />
            </div>

            {error && (
              <div className="px-4 pb-4">
                <div
                  className={`text-xs rounded-lg px-4 py-3 ${
                    isDark
                      ? "bg-red-500/10 text-red-300/90 border border-red-500/20"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {error}
                </div>
              </div>
            )}
          </div>

          {/* Drag handle */}
          <div
            className="hidden md:flex items-center justify-center w-0 cursor-col-resize select-none group"
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            <div
              className={`relative h-16 w-1 rounded-full transition-all duration-200 ${
                isDragging
                  ? isDark
                    ? "bg-white/30"
                    : "bg-sky-400/80 shadow-[0_0_0_1px_rgba(59,130,246,0.65)]"
                  : isDark
                    ? "bg-white/10 group-hover:bg-white/20"
                    : "bg-sky-200/80 group-hover:bg-sky-300/90"
              }`}
            />
          </div>

          {/* Right: live preview */}
          <div
            className="flex flex-col flex-1"
            style={{ flexBasis: `${100 - editorWidth}%` }}
          >
            <div
              className={`flex items-center justify-between px-5 py-4 ${
                isDark ? "border-b border-white/5 bg-slate-950/40" : "border-b border-white/70 bg-white/60 backdrop-blur-xl"
              }`}
            >
              <span
                className={`text-xs font-medium tracking-wide ${
                  isDark ? "text-slate-300/80" : "text-slate-500/90"
                }`}
              >
                PREVIEW
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center h-7 px-3 rounded-md text-[11px] font-medium transition-all duration-200 ${
                    isDark
                      ? "bg-purple-800/80 text-white/90 shadow-sm shadow-purple-950/60 hover:bg-purple-900/80"
                      : "bg-purple-50 text-purple-800 border border-purple-100 shadow-sm shadow-purple-100/70 hover:bg-purple-100"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Play
                </button>
                <div
                  className={`flex items-center p-0.5 rounded-lg h-6 ${
                    isDark ? "bg-white/5 border border-white/10 backdrop-blur-md" : "bg-white/70 border border-white/80 shadow-sm shadow-sky-500/20 backdrop-blur-md"
                  }`}
                >
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center h-6 px-2.5 rounded-md text-[11px] font-medium transition-all duration-200 ${
                      previewTheme === "light"
                        ? isDark
                          ? "bg-purple-800/80 text-white/90 shadow-sm shadow-purple-950/60 hover:bg-purple-900/80"
                          : "bg-purple-50 text-sky-800 shadow-sm shadow-purple-100/70 hover:bg-purple-100"
                        : isDark
                          ? "text-white/50 hover:text-white/80"
                          : "text-slate-500 hover:text-slate-800"
                    }`}
                    onClick={() => setPreviewTheme("light")}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center h-6 px-2.5 rounded-md text-[11px] font-medium transition-all duration-200 ${
                      previewTheme === "dark"
                        ? isDark
                          ? "bg-purple-800/80 text-white/90 shadow-sm shadow-purple-950/60 hover:bg-purple-900/80"
                          : "bg-purple-200 text-slate-900 shadow-sm shadow-purple-200/80 hover:bg-purple-300"
                        : isDark
                          ? "text-white/50 hover:text-white/80"
                          : "text-slate-500 hover:text-slate-800"
                    }`}
                    onClick={() => setPreviewTheme("dark")}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            <div className="relative flex-1 flex items-center justify-center p-2 overflow-hidden">
              {/* Subtle grid pattern */}
              <div
                className={`absolute inset-0 opacity-[0.3] ${isDark ? "opacity-[0.15]" : "opacity-[0.3]"}`}
                style={{
                  backgroundImage: `radial-gradient(${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
              {/* Soft glow behind the device frame */}
              <div className="pointer-events-none absolute inset-[-120px] opacity-70 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.25),_transparent_55%)]" />

              {parsedScreens.length > 0 ? (
                <div
                  className={`preview-embedded ${
                    previewTheme === "dark" ? "preview-theme-dark" : "preview-theme-light"
                  } relative z-1 w-full h-full transition-all duration-500 ease-out ${
                    hasMounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-[0.98]"
                  } ${
                    isDark
                      ? "rounded-[26px] border border-white/12 bg-slate-950/40 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.9)]"
                      : "rounded-[26px] border border-white/80 bg-white/70 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
                  }`}
                >
                  <ScreenRouter
                    config={{
                      screens: parsedScreens,
                      placeholders: PLACEHOLDERS,
                    }}
                  />
                </div>
              ) : (
                <div className="relative z-1 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      isDark
                        ? "bg-white/5 border border-white/10 backdrop-blur-xl"
                        : "bg-white/80 border border-white/80 backdrop-blur-xl shadow-sm shadow-sky-500/20"
                    }`}
                  >
                    <Plus className={isDark ? "w-5 h-5 text-white/60" : "w-5 h-5 text-slate-500"} />
                  </div>
                  <p
                    className={`text-sm ${isDark ? "text-slate-300/70" : "text-slate-500/85"}`}
                  >
                    Add valid JSON to see your preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Preview;