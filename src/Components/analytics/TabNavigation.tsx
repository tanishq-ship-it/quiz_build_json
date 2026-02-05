import type { AnalyticsTab } from '../../types/analytics';
import { BarChart3, HelpCircle, Clock, Smartphone, Globe, Mail } from 'lucide-react';

interface TabNavigationProps {
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
}

const TABS: { id: AnalyticsTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
  { id: 'time-trends', label: 'Time Trends', icon: Clock },
  { id: 'devices', label: 'Devices', icon: Smartphone },
  { id: 'countries', label: 'Countries', icon: Globe },
  { id: 'emails', label: 'Emails', icon: Mail },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
