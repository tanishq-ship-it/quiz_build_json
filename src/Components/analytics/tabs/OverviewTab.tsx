import { KPICards } from '../KPICards';
import { ResponsesOverTimeChart } from '../charts/ResponsesOverTimeChart';
import type { QuizAnalyticsDto } from '../../../types/analytics';

interface OverviewTabProps {
  analytics: QuizAnalyticsDto;
}

export function OverviewTab({ analytics }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <section>
        <KPICards kpi={analytics.kpiSummary} />
      </section>

      {/* Responses Over Time Chart */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-medium text-zinc-100">Responses Over Time</h3>
        <ResponsesOverTimeChart data={analytics.responsesOverTime} />
      </section>
    </div>
  );
}
