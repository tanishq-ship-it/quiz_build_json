import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Eye, Radio, Trash2, Zap, Link2, Users, LogOut, Copy, Check, Globe } from "lucide-react";
import Lottie from "lottie-react";
import { createQuiz, getQuizzes, updateQuizDeletion, updateQuizLive, getWebQuiz, setWebQuiz, unsetWebQuiz } from "../services/api";
import { useAuth } from "../context/AuthContext";
import loadingAnimation from "../assests/Loding.json";

type QuizListItem = {
  id: string;
  name: string;
  status: { live: boolean };
};

function QuizCreator() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [updatingLiveId, setUpdatingLiveId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [webQuizId, setWebQuizId] = useState<string | null>(null);
  const [updatingWebQuizId, setUpdatingWebQuizId] = useState<string | null>(null);

  const handleToggleLive = async (quizId: string, currentLive: boolean) => {
    try {
      setUpdatingLiveId(quizId);
      setLoadError(null);

      const updated = await updateQuizLive(quizId, { live: !currentLive });

      setQuizzes((current) =>
        current.map((quiz) =>
          quiz.id === quizId
            ? {
                ...quiz,
                status: { ...quiz.status, live: updated.live },
              }
            : quiz,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update live status.";
      setLoadError(message);
    } finally {
      setUpdatingLiveId(null);
    }
  };

  const handleCopyLink = async (quizId: string) => {
    const url = new URL(`/${quizId}`, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(quizId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(quizId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      setDeletingId(quizId);
      setLoadError(null);

      await updateQuizDeletion(quizId, { deletion: true });

      setQuizzes((current) => current.filter((quiz) => quiz.id !== quizId));

      // If this was the web quiz, clear it
      if (webQuizId === quizId) {
        setWebQuizId(null);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete quiz.";
      setLoadError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleWebQuiz = async (quizId: string, isCurrentlyWebQuiz: boolean) => {
    try {
      setUpdatingWebQuizId(quizId);
      setLoadError(null);

      if (isCurrentlyWebQuiz) {
        // Unset this quiz as web quiz
        await unsetWebQuiz(quizId);
        setWebQuizId(null);
      } else {
        // Set this quiz as web quiz
        await setWebQuiz(quizId);
        setWebQuizId(quizId);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update website quiz.";
      setLoadError(message);
    } finally {
      setUpdatingWebQuizId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // Fetch quizzes and web quiz in parallel
        const [quizzesFromApi, webQuizData] = await Promise.all([
          getQuizzes(),
          getWebQuiz(),
        ]);

        if (cancelled) return;

        setQuizzes(
          quizzesFromApi
            .filter((quiz) => !quiz.deletion)
            .map((quiz) => ({
              id: quiz.id,
              name: quiz.title,
              status: { live: quiz.live },
            })),
        );

        // Set the current web quiz ID
        if (webQuizData && webQuizData.isActive) {
          setWebQuizId(webQuizData.quizId);
        }
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Failed to load quizzes.";
        setLoadError(message);
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
  }, []);

  const handleOpenDialog = () => {
    setQuizTitle("");
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isCreating) return;
    setIsDialogOpen(false);
  };

  const handleCreateQuiz = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = quizTitle.trim();

    if (!trimmedTitle) {
      setDialogError("Please enter a quiz name.");
      return;
    }

    try {
      setIsCreating(true);
      setDialogError(null);

      const quiz = await createQuiz({
        title: trimmedTitle,
        // content can be filled later from the Preview editor
      });

      // Optimistically add to local list if not deleted
      if (!quiz.deletion) {
        setQuizzes((current) => [
          {
            id: quiz.id,
            name: quiz.title,
            status: { live: quiz.live },
          },
          ...current,
        ]);
      }

      setIsDialogOpen(false);

      // Navigate to preview for this specific quiz
      navigate(`/preview/${quiz.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create quiz.";
      setDialogError(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#eef2ff] to-[#e0f2fe]">
      {/* Background glow + subtle texture (match Screen Preview) */}
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

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/70 border border-white/80 backdrop-blur-xl shadow-sm shadow-sky-500/20">
              <Zap className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-inter-semibold tracking-[-0.01em] text-slate-900">
                Quiz Creator
              </h1>
              <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
                Design, preview and manage your quiz flows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md text-sm font-inter-medium border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              title="Manage Users"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </button>
            <button
              type="button"
              onClick={handleOpenDialog}
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-inter-medium bg-violet-600 text-white shadow-sm shadow-violet-500/40 hover:bg-violet-500 hover:shadow-md hover:shadow-violet-500/40 transition-all flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4" />
              Create Quiz
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-md text-sm font-inter-medium border border-rose-100 bg-rose-50/80 text-rose-600 hover:bg-rose-100 hover:border-rose-200 transition-all"
              title={`Logout ${user?.name || ''}`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Glass panel (matches Screen Preview panel style) */}
        <section className="rounded-2xl bg-white/70 border border-white/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.16)] p-5 md:p-7 flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm md:text-base font-inter-medium text-slate-800">
                Your Quizzes
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Manage and track your quiz projects in one calm, focused view.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium bg-sky-50/80 text-sky-800/80 border border-sky-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"}
            </span>
          </div>

          {/* Quiz List */}
          <div className="flex flex-col gap-3">
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <div className="w-52 h-52 sm:w-80 sm:h-80">
                  <Lottie animationData={loadingAnimation} loop autoplay />
                </div>
              </div>
            )}

            {loadError && !isLoading && (
              <div className="text-xs text-rose-500">{loadError}</div>
            )}

            {!isLoading &&
              !loadError &&
              quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white/80 border border-white/80 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:border-sky-100 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all cursor-pointer"
                >
                  {/* Quiz Name + status */}
                  <div className="flex flex-col gap-1">
                    <span className="font-inter-medium text-slate-900 text-sm md:text-base">
                      {quiz.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${
                          quiz.status.live
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-50 text-slate-600 border-slate-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            quiz.status.live ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {quiz.status.live ? "Live" : "Draft"}
                      </span>
                      {webQuizId === quiz.id && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium bg-violet-50 text-violet-700 border-violet-100">
                          <Globe className="w-3 h-3" />
                          Website
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-start gap-2">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => navigate(`/editorion/${quiz.id}`)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors px-2.5"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden md:inline text-[11px]">Edit</span>
                    </button>

                    {/* Preview */}
                    <button
                      type="button"
                      onClick={() => {
                        const url = new URL(`/preview-play/${quiz.id}`, window.location.origin).toString();
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-sky-100 bg-sky-50/80 text-sky-700 hover:bg-sky-100 hover:border-sky-200 transition-colors px-2.5"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden md:inline text-[11px]">Preview</span>
                    </button>

                    {/* Public quiz */}
                    <button
                      type="button"
                      onClick={() => navigate(`/${quiz.id}`)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 transition-colors px-2.5"
                      title="Open public quiz"
                    >
                      <Link2 className="w-4 h-4" />
                      <span className="hidden md:inline text-[11px]">Public link</span>
                    </button>

                    {/* Copy link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(quiz.id)}
                      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 transition-colors ${
                        copiedId === quiz.id
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                      title="Copy public link"
                    >
                      {copiedId === quiz.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="hidden md:inline text-[11px]">
                        {copiedId === quiz.id ? "Copied!" : "Copy"}
                      </span>
                    </button>

                    {/* Live */}
                    <button
                      type="button"
                      onClick={() => handleToggleLive(quiz.id, quiz.status.live)}
                      disabled={updatingLiveId === quiz.id}
                      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-inter-medium transition-colors ${
                        quiz.status.live
                          ? "border-emerald-100 bg-emerald-50/90 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200"
                          : "border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                      title={quiz.status.live ? "Set as not live" : "Make live"}
                    >
                      <Radio className="w-4 h-4" />
                      <span className="hidden md:inline text-[11px]">
                        {quiz.status.live ? "Unlive" : "Make live"}
                      </span>
                    </button>

                    {/* Website Quiz Toggle - Only show for live quizzes */}
                    {quiz.status.live && (
                      <button
                        type="button"
                        onClick={() => handleToggleWebQuiz(quiz.id, webQuizId === quiz.id)}
                        disabled={updatingWebQuizId === quiz.id}
                        className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-inter-medium transition-colors ${
                          webQuizId === quiz.id
                            ? "border-violet-200 bg-violet-100 text-violet-700 hover:bg-violet-150 hover:border-violet-300"
                            : "border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                        title={webQuizId === quiz.id ? "Remove from website" : "Set as website quiz"}
                      >
                        <Globe className="w-4 h-4" />
                        <span className="hidden md:inline text-[11px]">
                          {webQuizId === quiz.id ? "On Website" : "Website"}
                        </span>
                      </button>
                    )}

                    {/* Delete (soft delete) */}
                    <button
                      type="button"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      disabled={deletingId === quiz.id}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50/90 text-rose-600 hover:bg-rose-100 hover:border-rose-200 transition-colors px-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden md:inline text-[11px]">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State (when no quizzes) */}
          {quizzes.length === 0 && (
            <div className="mt-6 text-center py-14 bg-white/70 border border-dashed border-slate-300/80 rounded-xl backdrop-blur-xl">
              <p className="text-slate-500 mb-4 text-sm">
                No quizzes yet. Start with a simple flow and refine as you go.
              </p>
              <button
                type="button"
                onClick={handleOpenDialog}
                className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg font-inter-medium text-sm hover:bg-violet-500 shadow-sm shadow-violet-500/40 hover:shadow-md hover:shadow-violet-500/40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first quiz
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Create quiz dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-100 p-5">
            <h2 className="text-sm md:text-base font-inter-medium text-slate-900">
              Name your quiz
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              This will be shown in your quiz list and preview.
            </p>

            <form onSubmit={handleCreateQuiz} className="mt-4 flex flex-col gap-3">
              <label className="text-xs font-inter-medium text-slate-700">
                Quiz title
                <input
                  autoFocus
                  type="text"
                  value={quizTitle}
                  onChange={(event) => setQuizTitle(event.target.value)}
                  placeholder="e.g. Customer Satisfaction Survey"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-violet-400/70"
                />
              </label>

              {dialogError && (
                <p className="text-xs text-rose-500 mt-1">{dialogError}</p>
              )}

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-inter-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center justify-center h-8 px-4 rounded-lg bg-violet-600 text-xs font-inter-medium text-white shadow-sm shadow-violet-500/40 hover:bg-violet-500 hover:shadow-md hover:shadow-violet-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create & open preview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizCreator;
