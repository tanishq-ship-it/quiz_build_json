import { DeviceDistributionChart } from '../charts/DeviceDistributionChart';
import { DeviceBreakdownChart } from '../charts/DeviceBreakdownChart';
import type { QuizAnalyticsDto } from '../../../types/analytics';

interface DevicesTabProps {
  analytics: QuizAnalyticsDto;
}

export function DevicesTab({ analytics }: DevicesTabProps) {
  return (
    <div className="space-y-6">
      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device Distribution */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-1 text-lg font-medium text-zinc-100">Device Distribution</h3>
          <p className="mb-4 text-sm text-zinc-500">
            Overall breakdown of user devices
          </p>
          <DeviceDistributionChart data={analytics.deviceDistribution} />
        </section>

        {/* Device Stats Summary */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-1 text-lg font-medium text-zinc-100">Device Details</h3>
          <p className="mb-4 text-sm text-zinc-500">
            Detailed breakdown by device type
          </p>
          <div className="space-y-4">
            {analytics.deviceDistribution.map((device) => {
              const colors = {
                iphone: '#3B82F6',
                android: '#10B981',
                desktop: '#F59E0B',
              };
              const labels = {
                iphone: 'iPhone',
                android: 'Android',
                desktop: 'Desktop',
              };

              return (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: colors[device.device] }}
                    />
                    <span className="text-sm text-zinc-300">{labels[device.device]}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-zinc-100">
                      {device.count.toLocaleString()}
                    </span>
                    <div className="w-20">
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${device.percentage}%`,
                            backgroundColor: colors[device.device],
                          }}
                        />
                      </div>
                    </div>
                    <span className="w-12 text-right text-sm text-zinc-500">
                      {device.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Device Breakdown Per Question - Full Width */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-1 text-lg font-medium text-zinc-100">Device Breakdown by Question</h3>
        <p className="mb-4 text-sm text-zinc-500">
          How device usage changes across questions
        </p>
        <DeviceBreakdownChart data={analytics.deviceBreakdownPerQuestion} />
      </section>
    </div>
  );
}
