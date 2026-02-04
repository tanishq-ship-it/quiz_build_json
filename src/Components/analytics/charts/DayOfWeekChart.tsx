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
import type { DayOfWeekBreakdownDto } from '../../../types/analytics';

interface DayOfWeekChartProps {
  data: DayOfWeekBreakdownDto[];
}

// Reorder to start with Monday
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun

export function DayOfWeekChart({ data }: DayOfWeekChartProps) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  // Reorder data to start with Monday
  const orderedData = DAY_ORDER.map((dayIndex) => {
    const day = data.find((d) => d.dayOfWeek === dayIndex);
    return day || { dayOfWeek: dayIndex, dayName: '', count: 0 };
  });

  const maxCount = Math.max(...orderedData.map((d) => d.count), 1);

  // Get color based on value (higher = more purple)
  const getBarColor = (count: number) => {
    const intensity = count / maxCount;
    if (intensity < 0.3) return '#6366F1'; // indigo-500
    if (intensity < 0.6) return '#8B5CF6'; // violet-500
    return '#A855F7'; // purple-500
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={orderedData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />
          <XAxis
            type="number"
            stroke="#71717a"
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickLine={{ stroke: '#3f3f46' }}
            axisLine={{ stroke: '#3f3f46' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis
            type="category"
            dataKey="dayName"
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#3f3f46' }}
            width={50}
          />
          <Tooltip content={<CountTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="count"
            name="Responses"
            radius={[0, 4, 4, 0]}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {orderedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.count)}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
