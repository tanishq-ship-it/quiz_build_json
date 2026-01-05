import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Play, Plus, Save, Trash2 } from "lucide-react";
import ScreenRouter, { type ScreenData } from "../services/ScreenRouter";
import qtLogo from "../assests/qt.svg";
import { deleteQuizScreen, getQuiz, replaceQuizScreens, type ReplaceScreensPayload } from "../services/api";

type InputMode = "single" | "array" | "config";

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

const normalizeScreensArray = (parsed: unknown): ScreenData[] => {
  // If DB content is already array of screens
  if (Array.isArray(parsed)) {
    return parsed.map((item, index) => validateScreen(item, `Item ${index + 1}`));
  }

  // If DB content is config with `screens`
  if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { screens?: unknown[] }).screens)
  ) {
    const { screens: rawScreens } = parsed as { screens: unknown[] };
    return rawScreens.map((item, index) => validateScreen(item, `screens[${index}]`));
  }

  // Single screen object
  return [validateScreen(parsed)];
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

const Editorial: React.FC = () => {
  const { quizId } = useParams<{ quizId?: string }>();
  const navigate = useNavigate();

  const [screens, setScreens] = useState<ScreenData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [editorJson, setEditorJson] = useState<string>("");
  const [previewScreen, setPreviewScreen] = useState<ScreenData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) {
      setError("Missing quiz id.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const quiz = await getQuiz(quizId);
        const contentFromDb = quiz.content;

        if (cancelled) return;

        if (!contentFromDb) {
          setScreens([]);
          setSelectedIndex(0);
          setEditorJson("");
          setPreviewScreen(null);
          return;
        }

        const allScreens = normalizeScreensArray(contentFromDb);
        setScreens(allScreens);

        const initialIndex = 0;
        if (allScreens.length > 0) {
          const initialScreen = allScreens[initialIndex];
          setSelectedIndex(initialIndex);
          setEditorJson(JSON.stringify(initialScreen, null, 2));
          setPreviewScreen(initialScreen);
        }
      } catch {
        if (cancelled) return;
        setError("Failed to load quiz screens.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const handleSelectScreen = (index: number) => {
    setSelectedIndex(index);
    const screen = screens[index];
    setEditorJson(JSON.stringify(screen, null, 2));
    setPreviewScreen(screen);
    setParseError(null);
  };

  const handleEditorChange = (value: string) => {
    setEditorJson(value);
    setParseError(null);

    try {
      const parsed = JSON.parse(value) as unknown;
      const { screens: parsedScreens } = normalizeScreensInput(parsed);
      // For editor, we only care about first screen in the input
      const [first] = parsedScreens;
      setPreviewScreen(first);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid JSON";
      setParseError(message);
      setPreviewScreen(null);
    }
  };

  const handleSave = async () => {
    if (!quizId) return;
    if (previewScreen == null) {
      setParseError("Fix JSON errors before saving.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const updatedScreens = [...screens];
      updatedScreens[selectedIndex] = previewScreen;

      const payload: ReplaceScreensPayload = { screens: updatedScreens };
      await replaceQuizScreens(quizId, payload);

      setScreens(updatedScreens);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoToAdd = () => {
    if (!quizId) return;
    navigate(`/preview/${quizId}`);
  };

  const handleGoToPlay = () => {
    if (!quizId) return;
    // Use the currently selected screen from the saved list.
    // (The user may be editing JSON and temporarily change the `id` in the editor,
    // but the "play from where I am editing" intent maps to the selected list item.)
    const screenIdForPlay = screens[selectedIndex]?.id;
    const hash = screenIdForPlay ? `#${encodeURIComponent(screenIdForPlay)}` : "";
    navigate(`/preview-play/${quizId}${hash}`);
  };

  const handleDeleteScreen = async (e: React.MouseEvent, screenId: string, index: number) => {
    e.stopPropagation(); // Prevent selecting the screen when clicking delete
    if (!quizId) return;
    
    // Optional: Confirm with user? For now, direct delete as per request to "give a delete button icon"
    if (!window.confirm("Are you sure you want to delete this screen?")) {
      return;
    }

    try {
      setIsLoading(true);
      const updatedQuiz = await deleteQuizScreen(quizId, screenId, index);
      const allScreens = normalizeScreensArray(updatedQuiz.content);
      setScreens(allScreens);

      // Adjust selected index if needed
      if (allScreens.length === 0) {
        setSelectedIndex(0);
        setEditorJson("");
        setPreviewScreen(null);
      } else if (index === selectedIndex) {
        // If we deleted the selected screen, select the first one (or previous)
        const newIndex = 0;
        setSelectedIndex(newIndex);
        setEditorJson(JSON.stringify(allScreens[newIndex], null, 2));
        setPreviewScreen(allScreens[newIndex]);
      } else if (index < selectedIndex) {
        // If we deleted a screen before the selected one, decrement index
        setSelectedIndex(selectedIndex - 1);
      }
    } catch (err) {
      setError("Failed to delete screen.");
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#eef2ff] to-[#e0f2fe]">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md bg-white/80 border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <main className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-sm md:text-base font-inter-semibold tracking-[-0.01em] text-slate-900">
            Screens Editor
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoToAdd}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-inter-medium bg-violet-600 text-white shadow-sm hover:bg-violet-500"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
            <button
              type="button"
              onClick={handleGoToPlay}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[11px] font-inter-medium border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100"
            >
              <Play className="w-3.5 h-3.5" />
              Play
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading screens...
          </div>
        ) : error ? (
          <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
            {error}
          </div>
        ) : (
          <section className="flex flex-col md:flex-row gap-4 rounded-2xl bg-white/80 border border-white/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.12)] min-h-[80vh]">
            {/* Left: list of screens */}
            <div className="w-full md:w-1/5 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/60 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-inter-medium text-slate-600">Screens</span>
                <span className="text-[11px] text-slate-400">
                  {screens.length} {screens.length === 1 ? "screen" : "screens"}
                </span>
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {screens.map((screen, index) => (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => handleSelectScreen(index)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs border-b border-slate-100 last:border-b-0 ${
                      index === selectedIndex
                        ? "bg-sky-50 text-sky-900"
                        : "bg-transparent text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">
                      {index + 1}. {screen.id}
                    </span>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleDeleteScreen(e, screen.id, index)}
                      onKeyDown={(e) => {
                         if (e.key === "Enter" || e.key === " ") {
                           handleDeleteScreen(e as unknown as React.MouseEvent, screen.id, index);
                         }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                      title="Delete screen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
                {screens.length === 0 && (
                  <div className="px-4 py-4 text-xs text-slate-400">
                    No screens yet. Use Add to create screens.
                  </div>
                )}
              </div>
            </div>

            {/* Right: JSON + preview */}
            <div className="w-full md:flex-1 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-xs font-inter-medium text-slate-600">Editor</span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || previewScreen == null}
                  className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-[11px] font-inter-medium bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>

              <div className="flex flex-col md:flex-row flex-1">
                <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100 p-3">
                  <textarea
                    className="w-full h-full min-h-[180px] font-mono text-[12px] leading-[1.6] rounded-lg p-3 resize-none bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
                    value={editorJson}
                    onChange={(event) => handleEditorChange(event.target.value)}
                    spellCheck={false}
                  />
                  {parseError && (
                    <p className="mt-2 text-[11px] text-rose-500">{parseError}</p>
                  )}
                </div>

                <div className="w-full md:w-3/4 p-0 flex items-stretch justify-stretch bg-slate-50 rounded-br-2xl md:rounded-bl-none md:rounded-br-2xl overflow-hidden">
                  {previewScreen ? (
                    <div className="preview-embedded preview-theme-light editorial-preview w-full h-full">
                      <ScreenRouter
                        config={{
                          screens: [previewScreen],
                          placeholders: PLACEHOLDERS,
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Enter valid screen JSON to see preview.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Editorial;


