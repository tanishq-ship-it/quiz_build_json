import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CountTooltip } from '../ChartTooltip';
import type { DeviceBreakdownPerQuestionDto } from '../../../types/analytics';

interface DeviceBreakdownChartProps {
  data: DeviceBreakdownPerQuestionDto[];
}

const DEVICE_COLORS = {
  iphone: '#3B82F6',
  android: '#10B981',
  desktop: '#F59E0B',
};

export function DeviceBreakdownChart({ data }: DeviceBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  // Transform data for stacked areas
  const chartData = data.map((d) => ({
    questionLabel: d.questionLabel,
    iPhone: d.iphone,
    Android: d.android,
    Desktop: d.desktop,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="iphoneGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={DEVICE_COLORS.iphone} stopOpacity={0.8} />
              <stop offset="95%" stopColor={DEVICE_COLORS.iphone} stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="androidGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={DEVICE_COLORS.android} stopOpacity={0.8} />
              <stop offset="95%" stopColor={DEVICE_COLORS.android} stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="desktopGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={DEVICE_COLORS.desktop} stopOpacity={0.8} />
              <stop offset="95%" stopColor={DEVICE_COLORS.desktop} stopOpacity={0.2} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<CountTooltip />} cursor={{ stroke: '#71717a', strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => <span style={{ color: '#a1a1aa' }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="Desktop"
            stackId="1"
            stroke={DEVICE_COLORS.desktop}
            fill="url(#desktopGradient)"
            animationDuration={1500}
            animationBegin={0}
          />
          <Area
            type="monotone"
            dataKey="Android"
            stackId="1"
            stroke={DEVICE_COLORS.android}
            fill="url(#androidGradient)"
            animationDuration={1500}
            animationBegin={300}
          />
          <Area
            type="monotone"
            dataKey="iPhone"
            stackId="1"
            stroke={DEVICE_COLORS.iphone}
            fill="url(#iphoneGradient)"
            animationDuration={1500}
            animationBegin={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
