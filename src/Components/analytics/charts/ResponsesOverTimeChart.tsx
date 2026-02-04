import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CountTooltip } from '../ChartTooltip';
import type { ResponsesOverTimeDto } from '../../../types/analytics';

interface ResponsesOverTimeChartProps {
  data: ResponsesOverTimeDto[];
}

export function ResponsesOverTimeChart({ data }: ResponsesOverTimeChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  // Format dates for display
  const chartData = data.map((d) => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="responsesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="displayDate"
            stroke="#71717a"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickLine={{ stroke: '#3f3f46' }}
            axisLine={{ stroke: '#3f3f46' }}
            interval="preserveStartEnd"
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
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.displayDate === label);
                  if (item) {
                    return new Date(item.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }
                  return label;
                }}
              />
            }
            cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="Responses"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#responsesGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
            dot={data.length <= 14 ? { fill: '#8B5CF6', r: 3 } : false}
            activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
