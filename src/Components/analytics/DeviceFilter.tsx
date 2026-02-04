import { Smartphone, Monitor } from 'lucide-react';
import type { DeviceType } from '../../types/analytics';

interface DeviceFilterProps {
  activeDevices: Set<DeviceType>;
  onToggle: (device: DeviceType) => void;
}

const DEVICES: { id: DeviceType; label: string; icon: typeof Smartphone; color: string }[] = [
  { id: 'iphone', label: 'iPhone', icon: Smartphone, color: '#3B82F6' },
  { id: 'android', label: 'Android', icon: Smartphone, color: '#10B981' },
  { id: 'desktop', label: 'Desktop', icon: Monitor, color: '#F59E0B' },
];

export function DeviceFilter({ activeDevices, onToggle }: DeviceFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Devices
      </span>
      <div className="flex items-center gap-1">
        {DEVICES.map((device) => {
          const Icon = device.icon;
          const isActive = activeDevices.has(device.id);

          return (
            <button
              key={device.id}
              onClick={() => onToggle(device.id)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'border border-zinc-600 bg-zinc-800 text-zinc-100'
                  : 'border border-transparent bg-zinc-800/30 text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-400'
              }`}
              style={{
                borderColor: isActive ? device.color + '50' : undefined,
                boxShadow: isActive ? `0 0 12px ${device.color}20` : undefined,
              }}
            >
              <Icon
                className="h-3.5 w-3.5"
                style={{ color: isActive ? device.color : undefined }}
              />
              <span>{device.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
