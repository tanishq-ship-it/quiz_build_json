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
import type { QuestionAttendanceDto } from '../../../types/analytics';

interface AttendanceFunnelChartProps {
  data: QuestionAttendanceDto[];
}

export function AttendanceFunnelChart({ data }: AttendanceFunnelChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
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
          <Tooltip
            content={<CountTooltip />}
            cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="attendeeCount"
            name="Attendees"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#attendanceGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
