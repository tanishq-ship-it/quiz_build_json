import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TimeTooltip } from '../ChartTooltip';
import type { TimePerQuestionDto, DeviceType } from '../../../types/analytics';

interface TimePerQuestionChartProps {
  data: TimePerQuestionDto[];
  activeDevices: Set<DeviceType>;
}

const DEVICE_COLORS = {
  iphone: '#3B82F6',
  android: '#10B981',
  desktop: '#F59E0B',
};

export function TimePerQuestionChart({ data, activeDevices }: TimePerQuestionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  // Transform data for grouped bars
  const chartData = data.map((d) => ({
    questionLabel: d.questionLabel,
    ...(activeDevices.has('iphone') ? { iPhone: d.byDevice.iphone } : {}),
    ...(activeDevices.has('android') ? { Android: d.byDevice.android } : {}),
    ...(activeDevices.has('desktop') ? { Desktop: d.byDevice.desktop } : {}),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            tickFormatter={(value) => {
              if (value >= 60000) return `${(value / 60000).toFixed(0)}m`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}s`;
              return `${value}ms`;
            }}
          />
          <Tooltip content={<TimeTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => <span style={{ color: '#a1a1aa' }}>{value}</span>}
          />
          {activeDevices.has('iphone') && (
            <Bar
              dataKey="iPhone"
              fill={DEVICE_COLORS.iphone}
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationBegin={0}
            />
          )}
          {activeDevices.has('android') && (
            <Bar
              dataKey="Android"
              fill={DEVICE_COLORS.android}
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationBegin={200}
            />
          )}
          {activeDevices.has('desktop') && (
            <Bar
              dataKey="Desktop"
              fill={DEVICE_COLORS.desktop}
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationBegin={400}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
