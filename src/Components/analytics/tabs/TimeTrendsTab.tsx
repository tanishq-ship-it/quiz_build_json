import { ResponsesOverTimeChart } from '../charts/ResponsesOverTimeChart';
import { PeakHoursHeatmap } from '../charts/PeakHoursHeatmap';
import { DayOfWeekChart } from '../charts/DayOfWeekChart';
import type { QuizAnalyticsDto } from '../../../types/analytics';

interface TimeTrendsTabProps {
  analytics: QuizAnalyticsDto;
}

export function TimeTrendsTab({ analytics }: TimeTrendsTabProps) {
  return (
    <div className="space-y-6">
      {/* Responses Over Time */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-1 text-lg font-medium text-zinc-100">Responses Over Time</h3>
        <p className="mb-4 text-sm text-zinc-500">
          Daily response counts for the selected period
        </p>
        <ResponsesOverTimeChart data={analytics.responsesOverTime} />
      </section>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Peak Hours Heatmap */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-1 text-lg font-medium text-zinc-100">Activity Heatmap</h3>
          <p className="mb-4 text-sm text-zinc-500">
            Response distribution by day and hour
          </p>
          <PeakHoursHeatmap data={analytics.peakHoursHeatmap} />
        </section>

        {/* Day of Week Breakdown */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-1 text-lg font-medium text-zinc-100">Day of Week</h3>
          <p className="mb-4 text-sm text-zinc-500">
            Total responses by day of the week
          </p>
          <DayOfWeekChart data={analytics.dayOfWeekBreakdown} />
        </section>
      </div>
    </div>
  );
}
