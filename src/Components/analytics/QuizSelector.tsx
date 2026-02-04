import { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText, Check } from 'lucide-react';
import type { QuizListItemDto } from '../../types/analytics';

interface QuizSelectorProps {
  quizzes: QuizListItemDto[];
  selectedQuizId: string | null;
  onSelect: (quizId: string) => void;
  isLoading?: boolean;
}

export function QuizSelector({
  quizzes,
  selectedQuizId,
  onSelect,
  isLoading,
}: QuizSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-10 w-64 animate-pulse rounded-lg bg-zinc-800/50" />
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 min-w-[200px] items-center justify-between gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 text-sm text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
      >
        <div className="flex items-center gap-2 truncate">
          <FileText className="h-4 w-4 text-zinc-400" />
          <span className="truncate">
            {selectedQuiz?.title || 'Select a quiz'}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[280px] overflow-hidden rounded-lg border border-zinc-700/50 bg-zinc-900/95 shadow-xl backdrop-blur-sm">
          <div className="max-h-[300px] overflow-y-auto py-1">
            {quizzes.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-zinc-500">
                No quizzes found
              </div>
            ) : (
              quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => {
                    onSelect(quiz.id);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-zinc-800/50 ${
                    quiz.id === selectedQuizId ? 'bg-zinc-800/30' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm text-zinc-100">
                        {quiz.title}
                      </span>
                      {quiz.live && (
                        <span className="flex-shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-500">
                      {quiz.totalResponses.toLocaleString()} responses
                    </div>
                  </div>
                  {quiz.id === selectedQuizId && (
                    <Check className="h-4 w-4 flex-shrink-0 text-violet-400" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
