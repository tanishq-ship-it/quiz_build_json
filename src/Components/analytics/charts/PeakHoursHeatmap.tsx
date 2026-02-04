import { useState } from 'react';
import type { PeakHoursHeatmapDto } from '../../../types/analytics';

interface PeakHoursHeatmapProps {
  data: PeakHoursHeatmapDto[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(hour: number): string {
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

function getColor(value: number, max: number): string {
  if (max === 0 || value === 0) return '#18181b'; // zinc-900

  const intensity = value / max;

  // Gradient from zinc-900 to violet-500
  if (intensity < 0.2) return '#27272a'; // zinc-800
  if (intensity < 0.4) return '#3b2d66'; // mix
  if (intensity < 0.6) return '#5b3f8f'; // darker violet
  if (intensity < 0.8) return '#7c3aed'; // violet-600
  return '#8B5CF6'; // violet-500
}

export function PeakHoursHeatmap({ data }: PeakHoursHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    day: number;
    hour: number;
    count: number;
  } | null>(null);

  // Create a map for quick lookup
  const dataMap = new Map<string, number>();
  let maxCount = 0;

  data.forEach((d) => {
    const key = `${d.dayOfWeek}-${d.hour}`;
    dataMap.set(key, d.count);
    if (d.count > maxCount) maxCount = d.count;
  });

  if (data.length === 0 || maxCount === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Legend */}
      <div className="mb-4 flex items-center justify-end gap-2">
        <span className="text-xs text-zinc-500">Less</span>
        <div className="flex gap-0.5">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
            <div
              key={intensity}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: getColor(intensity * maxCount, maxCount) }}
            />
          ))}
        </div>
        <span className="text-xs text-zinc-500">More</span>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="mb-1 flex pl-10">
            {HOURS.filter((h) => h % 3 === 0).map((hour) => (
              <div
                key={hour}
                className="text-[10px] text-zinc-500"
                style={{ width: `${100 / 8}%`, textAlign: 'center' }}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-1">
              {/* Day label */}
              <div className="w-9 text-right text-xs text-zinc-500">{day}</div>

              {/* Hour cells */}
              <div className="flex flex-1 gap-[2px]">
                {HOURS.map((hour) => {
                  const key = `${dayIndex}-${hour}`;
                  const count = dataMap.get(key) || 0;
                  const isHovered =
                    hoveredCell?.day === dayIndex && hoveredCell?.hour === hour;

                  return (
                    <div
                      key={hour}
                      className="aspect-square flex-1 cursor-pointer rounded-sm transition-all"
                      style={{
                        backgroundColor: getColor(count, maxCount),
                        transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                        zIndex: isHovered ? 10 : 1,
                        boxShadow: isHovered
                          ? `0 0 12px ${getColor(count, maxCount)}`
                          : 'none',
                      }}
                      onMouseEnter={() =>
                        setHoveredCell({ day: dayIndex, hour, count })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 shadow-xl backdrop-blur-sm"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="text-sm font-medium text-zinc-100">
            {DAYS[hoveredCell.day]} at {formatHour(hoveredCell.hour)}
          </div>
          <div className="mt-1 text-xs text-zinc-400">
            {hoveredCell.count.toLocaleString()} responses
          </div>
        </div>
      )}
    </div>
  );
}
