import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import type { DateRangePreset } from '../../types/analytics';

interface DateRangeFilterProps {
  value: DateRangePreset;
  onChange: (value: DateRangePreset) => void;
  customRange: { start: Date; end: Date } | null;
  onCustomRangeChange: (range: { start: Date; end: Date } | null) => void;
}

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom range' },
];

export function DateRangeFilter({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPreset = PRESETS.find((p) => p.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize custom range inputs
  useEffect(() => {
    if (customRange) {
      setTempStartDate(customRange.start.toISOString().split('T')[0]);
      setTempEndDate(customRange.end.toISOString().split('T')[0]);
    } else {
      // Default to last 30 days for custom picker
      const end = new Date();
      const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      setTempStartDate(start.toISOString().split('T')[0]);
      setTempEndDate(end.toISOString().split('T')[0]);
    }
  }, [customRange]);

  const handlePresetSelect = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setShowCustomPicker(true);
    } else {
      onChange(preset);
      onCustomRangeChange(null);
      setIsOpen(false);
      setShowCustomPicker(false);
    }
  };

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      end.setHours(23, 59, 59, 999); // End of day

      if (start <= end) {
        onCustomRangeChange({ start, end });
        onChange('custom');
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    }
  };

  const getDisplayLabel = () => {
    if (value === 'custom' && customRange) {
      const start = customRange.start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const end = customRange.end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${start} - ${end}`;
    }
    return selectedPreset?.label || 'Select range';
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 text-sm text-zinc-100 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
      >
        <Calendar className="h-4 w-4 text-zinc-400" />
        <span>{getDisplayLabel()}</span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-zinc-700/50 bg-zinc-900/95 shadow-xl backdrop-blur-sm">
          {!showCustomPicker ? (
            <div className="w-44 py-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetSelect(preset.value)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-800/50 ${
                    value === preset.value ? 'bg-zinc-800/30 text-zinc-100' : 'text-zinc-300'
                  }`}
                >
                  <span>{preset.label}</span>
                  {value === preset.value && preset.value !== 'custom' && (
                    <Check className="h-4 w-4 text-violet-400" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="w-64 p-3">
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Custom Range
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Start Date</label>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">End Date</label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCustomPicker(false)}
                    className="flex-1 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyCustomRange}
                    className="flex-1 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
