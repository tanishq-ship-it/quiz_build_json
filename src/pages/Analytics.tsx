import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import { BarChart3 } from 'lucide-react';

import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsHeader } from '../Components/analytics/AnalyticsHeader';
import { TabNavigation } from '../Components/analytics/TabNavigation';
import { DeviceFilter } from '../Components/analytics/DeviceFilter';
import { OverviewTab } from '../Components/analytics/tabs/OverviewTab';
import { QuestionsTab } from '../Components/analytics/tabs/QuestionsTab';
import { TimeTrendsTab } from '../Components/analytics/tabs/TimeTrendsTab';
import { DevicesTab } from '../Components/analytics/tabs/DevicesTab';
import { CountriesTab } from '../Components/analytics/tabs/CountriesTab';
import { EmailsTab } from '../Components/analytics/tabs/EmailsTab';
import type { AnalyticsTab } from '../types/analytics';
import loadingAnimation from '../assests/Loding.json';

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    quizzes,
    selectedQuizId,
    setSelectedQuizId,
    analytics,
    activeDevices,
    toggleDevice,
    dateRange,
    setDateRange,
    customDateRange,
    setCustomDateRange,
    activeTab,
    setActiveTab,
    isLoadingQuizzes,
    isLoadingAnalytics,
    error,
    refreshAnalytics,
  } = useAnalytics();

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get('tab') as AnalyticsTab | null;
    if (tabParam && ['overview', 'questions', 'time-trends', 'devices', 'countries', 'emails'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  const handleTabChange = (tab: AnalyticsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const renderTabContent = () => {
    if (activeTab === 'emails') {
      return selectedQuizId ? <EmailsTab quizId={selectedQuizId} /> : null;
    }

    if (!analytics) return null;

    switch (activeTab) {
      case 'overview':
        return <OverviewTab analytics={analytics} />;
      case 'questions':
        return <QuestionsTab analytics={analytics} activeDevices={activeDevices} />;
      case 'time-trends':
        return <TimeTrendsTab analytics={analytics} />;
      case 'devices':
        return <DevicesTab analytics={analytics} />;
      case 'countries':
        return <CountriesTab analytics={analytics} />;
      default:
        return <OverviewTab analytics={analytics} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with quiz selector and date filter */}
        <AnalyticsHeader
          quizzes={quizzes}
          selectedQuizId={selectedQuizId}
          onQuizSelect={setSelectedQuizId}
          isLoadingQuizzes={isLoadingQuizzes}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customDateRange={customDateRange}
          onCustomDateRangeChange={setCustomDateRange}
          onRefresh={refreshAnalytics}
        />

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoadingAnalytics && (
          <div className="flex items-center justify-center py-20">
            <div className="h-40 w-40">
              <Lottie animationData={loadingAnimation} loop autoplay />
            </div>
          </div>
        )}

        {/* Analytics content */}
        {!isLoadingAnalytics && (analytics || selectedQuizId) && (
          <div className="animate-fade-in">
            {/* Tab Navigation + Device Filter Row */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
              <DeviceFilter activeDevices={activeDevices} onToggle={toggleDevice} />
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in" key={activeTab}>
              {activeTab !== 'emails' && !analytics ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BarChart3 className="mb-4 h-16 w-16 text-zinc-700" />
                  <h3 className="mb-2 text-lg font-medium text-zinc-300">No analytics data</h3>
                  <p className="text-sm text-zinc-500">
                    This quiz doesn't have any responses yet.
                  </p>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        )}

        {/* No quiz selected */}
        {!isLoadingQuizzes && !selectedQuizId && quizzes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BarChart3 className="mb-4 h-16 w-16 text-zinc-700" />
            <h3 className="mb-2 text-lg font-medium text-zinc-300">No quizzes found</h3>
            <p className="text-sm text-zinc-500">
              Create a quiz first to see analytics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
