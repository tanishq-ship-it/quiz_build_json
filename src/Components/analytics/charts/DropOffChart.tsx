import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CountTooltip } from '../ChartTooltip';
import type { DropOffAnalysisDto } from '../../../types/analytics';

interface DropOffChartProps {
  data: DropOffAnalysisDto[];
}

export function DropOffChart({ data }: DropOffChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  const maxDropOff = Math.max(...data.map((d) => d.dropOffCount), 1);

  // Color gradient from amber to red based on intensity
  const getBarColor = (count: number) => {
    const intensity = count / maxDropOff;
    if (intensity > 0.7) return '#EF4444'; // red
    if (intensity > 0.4) return '#F97316'; // orange
    return '#F59E0B'; // amber
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="questionLabel"
            stroke="#71717a"
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickLine={{ stroke: '#3f3f46' }}
            axisLine={{ stroke: '#3f3f46' }}
          />
          <YAxis
            stroke="#71717a"
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickLine={{ stroke: '#3f3f46' }}
            axisLine={{ stroke: '#3f3f46' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            content={
              <CountTooltip
                valueFormatter={(value, name) => {
                  if (name === 'Drop-off Rate') return `${value.toFixed(1)}%`;
                  return value.toLocaleString();
                }}
              />
            }
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar
            dataKey="dropOffCount"
            name="Drop-offs"
            radius={[4, 4, 0, 0]}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.dropOffCount)}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
