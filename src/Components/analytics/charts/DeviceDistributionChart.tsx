import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DeviceDistributionDto } from '../../../types/analytics';

interface DeviceDistributionChartProps {
  data: DeviceDistributionDto[];
}

const DEVICE_COLORS = {
  iphone: '#3B82F6',
  android: '#10B981',
  desktop: '#F59E0B',
};

const DEVICE_LABELS = {
  iphone: 'iPhone',
  android: 'Android',
  desktop: 'Desktop',
};

export function DeviceDistributionChart({ data }: DeviceDistributionChartProps) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-500">
        No data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: DEVICE_LABELS[d.device],
    value: d.count,
    percentage: d.percentage,
    color: DEVICE_COLORS[d.device],
  }));

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percentage: number;
  }) => {
    if (percentage < 5) return null; // Don't show label for tiny segments

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#f4f4f5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight={600}
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            animationDuration={1500}
            animationEasing="ease-out"
            label={renderCustomLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="text-sm text-zinc-100">{data.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {data.value.toLocaleString()} users ({data.percentage}%)
                  </div>
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span style={{ color: '#a1a1aa' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
