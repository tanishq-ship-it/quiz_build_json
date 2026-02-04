import type { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number, name: string) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(String(label)) : label;

  return (
    <div
      className="rounded-lg border border-zinc-700/50 bg-zinc-900/95 px-3 py-2 shadow-xl backdrop-blur-sm"
      style={{ minWidth: '120px' }}
    >
      {formattedLabel && (
        <p className="mb-1.5 text-xs font-medium text-zinc-300">{formattedLabel}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const value = entry.value as number;
          const name = entry.name as string;
          const formattedValue = valueFormatter
            ? valueFormatter(value, name)
            : value.toLocaleString();

          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-zinc-400">{name}</span>
              </div>
              <span className="text-xs font-medium text-zinc-100">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Specialized tooltip for time values (ms)
export function TimeTooltip(props: CustomTooltipProps) {
  return (
    <ChartTooltip
      {...props}
      valueFormatter={(value) => {
        if (value >= 60000) {
          return `${(value / 60000).toFixed(1)}m`;
        }
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}s`;
        }
        return `${value}ms`;
      }}
    />
  );
}

// Specialized tooltip for percentage values
export function PercentTooltip(props: CustomTooltipProps) {
  return (
    <ChartTooltip {...props} valueFormatter={(value) => `${value.toFixed(1)}%`} />
  );
}

// Specialized tooltip for count values
export function CountTooltip(props: CustomTooltipProps) {
  return (
    <ChartTooltip
      {...props}
      valueFormatter={(value) => value.toLocaleString()}
    />
  );
}
