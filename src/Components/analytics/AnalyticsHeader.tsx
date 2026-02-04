import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, RefreshCw } from 'lucide-react';
import { QuizSelector } from './QuizSelector';
import { DateRangeFilter } from './DateRangeFilter';
import type { QuizListItemDto, DateRangePreset } from '../../types/analytics';

interface AnalyticsHeaderProps {
  quizzes: QuizListItemDto[];
  selectedQuizId: string | null;
  onQuizSelect: (quizId: string) => void;
  isLoadingQuizzes: boolean;
  dateRange: DateRangePreset;
  onDateRangeChange: (range: DateRangePreset) => void;
  customDateRange: { start: Date; end: Date } | null;
  onCustomDateRangeChange: (range: { start: Date; end: Date } | null) => void;
  onRefresh: () => void;
}

export function AnalyticsHeader({
  quizzes,
  selectedQuizId,
  onQuizSelect,
  isLoadingQuizzes,
  dateRange,
  onDateRangeChange,
  customDateRange,
  onCustomDateRangeChange,
  onRefresh,
}: AnalyticsHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="flex items-center gap-3 text-xl font-semibold text-zinc-100 sm:text-2xl">
              <BarChart3 className="h-6 w-6 text-violet-400 sm:h-7 sm:w-7" />
              Quiz Analytics
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Insights and performance metrics
            </p>
          </div>
        </div>

        {/* Right side - Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <QuizSelector
            quizzes={quizzes}
            selectedQuizId={selectedQuizId}
            onSelect={onQuizSelect}
            isLoading={isLoadingQuizzes}
          />
          <DateRangeFilter
            value={dateRange}
            onChange={onDateRangeChange}
            customRange={customDateRange}
            onCustomRangeChange={onCustomDateRangeChange}
          />
          <button
            onClick={onRefresh}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
