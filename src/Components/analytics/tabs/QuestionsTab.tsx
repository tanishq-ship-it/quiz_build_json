import { AttendanceFunnelChart } from '../charts/AttendanceFunnelChart';
import { DropOffChart } from '../charts/DropOffChart';
import { TimePerQuestionChart } from '../charts/TimePerQuestionChart';
import type { QuizAnalyticsDto, DeviceType } from '../../../types/analytics';

interface QuestionsTabProps {
  analytics: QuizAnalyticsDto;
  activeDevices: Set<DeviceType>;
}

export function QuestionsTab({ analytics, activeDevices }: QuestionsTabProps) {
  return (
    <div className="space-y-6">
      {/* Attendance Funnel */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-1 text-lg font-medium text-zinc-100">Attendance Funnel</h3>
        <p className="mb-4 text-sm text-zinc-500">
          How many users reached each question
        </p>
        <AttendanceFunnelChart data={analytics.attendanceFunnel} />
      </section>

      {/* Two-column layout for smaller charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Drop-off Analysis */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-1 text-lg font-medium text-zinc-100">Drop-off Analysis</h3>
          <p className="mb-4 text-sm text-zinc-500">
            Users who left at each question
          </p>
          <DropOffChart data={analytics.dropOffAnalysis} />
        </section>

        {/* Time Per Question */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-1 text-lg font-medium text-zinc-100">Time Per Question</h3>
          <p className="mb-4 text-sm text-zinc-500">
            Average time spent by device type
          </p>
          <TimePerQuestionChart data={analytics.timePerQuestion} activeDevices={activeDevices} />
        </section>
      </div>
    </div>
  );
}
