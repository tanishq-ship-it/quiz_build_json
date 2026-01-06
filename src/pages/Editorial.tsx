import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, GripVertical, Loader2, Play, Plus, Save, Trash2 } from "lucide-react";
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

const moveArrayItem = <T,>(array: T[], from: number, to: number): T[] => {
  if (from === to) return array;
  if (from < 0 || from >= array.length) return array;
  if (to < 0 || to >= array.length) return array;

  const copy = [...array];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
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
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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
    const url = new URL(`/preview-play/${quizId}${hash}`, window.location.origin).toString();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleReorderScreens = async (fromIndex: number, toIndex: number) => {
    if (!quizId) return;
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= screens.length) return;
    if (toIndex < 0 || toIndex >= screens.length) return;

    const selectedScreenId = screens[selectedIndex]?.id;

    // Protect unsaved edits: if the editor's preview is for the currently selected screen,
    // use it as the source-of-truth for that screen when persisting reorder.
    const baseScreens = [...screens];
    if (selectedScreenId && previewScreen?.id === selectedScreenId) {
      baseScreens[selectedIndex] = previewScreen;
    }

    const reordered = moveArrayItem(baseScreens, fromIndex, toIndex);
    const previousScreens = screens;

    setScreens(reordered);
    setDraggingIndex(null);
    setDragOverIndex(null);

    if (selectedScreenId) {
      const newSelected = reordered.findIndex((s) => s.id === selectedScreenId);
      if (newSelected >= 0) {
        setSelectedIndex(newSelected);
      }
    }

    try {
      setIsSaving(true);
      setError(null);
      const payload: ReplaceScreensPayload = { screens: reordered };
      await replaceQuizScreens(quizId, payload);
    } catch {
      setError("Failed to save new screen order.");
      // Roll back to keep UI consistent with DB
      setScreens(previousScreens);
      if (selectedScreenId) {
        const rollbackSelected = previousScreens.findIndex((s) => s.id === selectedScreenId);
        if (rollbackSelected >= 0) setSelectedIndex(rollbackSelected);
      }
    } finally {
      setIsSaving(false);
    }
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
                  <div
                    key={screen.id}
                    draggable={!isSaving}
                    onDragStart={(e) => {
                      setDraggingIndex(index);
                      setDragOverIndex(index);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", String(index));
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverIndex !== index) setDragOverIndex(index);
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDragLeave={() => {
                      setDragOverIndex((prev) => (prev === index ? null : prev));
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const raw = e.dataTransfer.getData("text/plain");
                      const from = Number.parseInt(raw, 10);
                      if (!Number.isFinite(from)) return;
                      void handleReorderScreens(from, index);
                    }}
                    onDragEnd={() => {
                      setDraggingIndex(null);
                      setDragOverIndex(null);
                    }}
                    onClick={() => handleSelectScreen(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelectScreen(index);
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-xs border-b border-slate-100 last:border-b-0 ${
                      index === selectedIndex
                        ? "bg-sky-50 text-sky-900"
                        : "bg-transparent text-slate-700 hover:bg-slate-50"
                    } ${
                      draggingIndex === index ? "opacity-60" : ""
                    } ${
                      dragOverIndex === index && draggingIndex != null && draggingIndex !== index
                        ? "ring-2 ring-sky-200"
                        : ""
                    }`}
                  >
                    <span className="text-slate-400">
                      <GripVertical className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">
                      {index + 1}. {screen.id}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteScreen(e, screen.id, index)}
                      disabled={isSaving}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded disabled:opacity-40"
                      title="Delete screen"
                      draggable={false}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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


