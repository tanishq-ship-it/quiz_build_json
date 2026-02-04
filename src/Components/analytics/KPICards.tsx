import { Users, Clock, TrendingDown, Calendar, Timer } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import type { KPISummaryDto } from '../../types/analytics';

interface KPICardsProps {
  kpi: KPISummaryDto;
}

function formatTime(ms: number): string {
  if (ms >= 60000) {
    return `${(ms / 60000).toFixed(1)}m`;
  }
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${ms}ms`;
}

function formatHour(hour: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}${ampm}`;
}

export function KPICards({ kpi }: KPICardsProps) {
  const cards = [
    {
      label: 'Total Attendees',
      value: kpi.totalAttendees,
      icon: Users,
      color: '#8B5CF6',
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      label: 'Completion Rate',
      value: kpi.completionRate,
      icon: TrendingDown,
      color: '#10B981',
      suffix: '%',
      formatter: (v: number) => v.toString(),
    },
    {
      label: 'Avg. Completion Time',
      value: kpi.avgCompletionTimeMs,
      icon: Clock,
      color: '#3B82F6',
      formatter: formatTime,
      isTimeValue: true,
    },
    {
      label: 'Biggest Drop-off',
      value: kpi.biggestDropOffQuestion?.dropOffCount || 0,
      icon: TrendingDown,
      color: '#EF4444',
      subtext: kpi.biggestDropOffQuestion
        ? `at Q${kpi.biggestDropOffQuestion.questionIndex + 1} (${kpi.biggestDropOffQuestion.dropOffRate.toFixed(1)}%)`
        : 'No drop-offs',
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      label: 'Peak Day',
      value: kpi.peakDay?.count || 0,
      icon: Calendar,
      color: '#F59E0B',
      subtext: kpi.peakDay
        ? new Date(kpi.peakDay.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
        : 'No data',
      formatter: (v: number) => v.toLocaleString(),
    },
    {
      label: 'Peak Hour',
      value: kpi.peakHour?.count || 0,
      icon: Timer,
      color: '#EC4899',
      subtext: kpi.peakHour ? formatHour(kpi.peakHour.hour) : 'No data',
      formatter: (v: number) => v.toLocaleString(),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:shadow-lg"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Glow effect */}
            <div
              className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
              style={{ backgroundColor: card.color }}
            />

            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {card.label}
                </span>
                <Icon className="h-4 w-4" style={{ color: card.color }} />
              </div>

              <div className="flex items-baseline gap-1">
                {card.isTimeValue ? (
                  <span className="text-2xl font-semibold text-zinc-100">
                    {card.formatter(card.value)}
                  </span>
                ) : (
                  <>
                    <AnimatedCounter
                      value={card.value}
                      formatter={card.formatter}
                      className="text-2xl font-semibold text-zinc-100"
                    />
                    {card.suffix && (
                      <span className="text-lg text-zinc-400">{card.suffix}</span>
                    )}
                  </>
                )}
              </div>

              {card.subtext && (
                <p className="mt-1 text-xs text-zinc-500">{card.subtext}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
