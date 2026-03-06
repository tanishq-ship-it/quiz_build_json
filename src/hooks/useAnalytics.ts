import { useState, useEffect, useCallback } from 'react';
import { getAnalyticsQuizzes, getQuizAnalytics } from '../services/api';
import type {
  QuizListItemDto,
  QuizAnalyticsDto,
  DeviceType,
  DateRangePreset,
  AnalyticsTab,
} from '../types/analytics';

export interface UseAnalyticsReturn {
  // Quiz selection
  quizzes: QuizListItemDto[];
  selectedQuizId: string | null;
  setSelectedQuizId: (id: string | null) => void;

  // Analytics data
  analytics: QuizAnalyticsDto | null;

  // Filters
  activeDevices: Set<DeviceType>;
  toggleDevice: (device: DeviceType) => void;
  dateRange: DateRangePreset;
  setDateRange: (range: DateRangePreset) => void;
  customDateRange: { start: Date; end: Date } | null;
  setCustomDateRange: (range: { start: Date; end: Date } | null) => void;
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  availableCountries: string[];

  // Tab navigation
  activeTab: AnalyticsTab;
  setActiveTab: (tab: AnalyticsTab) => void;

  // Loading states
  isLoadingQuizzes: boolean;
  isLoadingAnalytics: boolean;
  error: string | null;

  // Actions
  refreshAnalytics: () => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  // Quiz selection
  const [quizzes, setQuizzes] = useState<QuizListItemDto[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  // Analytics data
  const [analytics, setAnalytics] = useState<QuizAnalyticsDto | null>(null);

  // Filters
  const [activeDevices, setActiveDevices] = useState<Set<DeviceType>>(
    new Set(['iphone', 'android', 'desktop'])
  );
  const [dateRange, setDateRange] = useState<DateRangePreset>('30d');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  // Loading states
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz list on mount
  useEffect(() => {
    let cancelled = false;

    const loadQuizzes = async () => {
      try {
        setIsLoadingQuizzes(true);
        setError(null);
        const data = await getAnalyticsQuizzes();
        if (!cancelled) {
          setQuizzes(data);
          // Auto-select first quiz if available
          if (data.length > 0 && !selectedQuizId) {
            setSelectedQuizId(data[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load quizzes');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingQuizzes(false);
        }
      }
    };

    void loadQuizzes();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch analytics when quiz or filters change
  useEffect(() => {
    if (!selectedQuizId) {
      setAnalytics(null);
      return;
    }

    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setIsLoadingAnalytics(true);
        setError(null);

        // Build options
        const deviceFilter =
          activeDevices.size < 3 ? (Array.from(activeDevices) as DeviceType[]) : undefined;

        const options: Parameters<typeof getQuizAnalytics>[1] = {
          deviceFilter,
          country: selectedCountry || undefined,
        };

        if (dateRange === 'custom' && customDateRange) {
          options.startDate = customDateRange.start.toISOString();
          options.endDate = customDateRange.end.toISOString();
        } else if (dateRange !== 'all') {
          options.dateRange = dateRange;
        }

        const data = await getQuizAnalytics(selectedQuizId, options);
        if (!cancelled) {
          setAnalytics(data);
          // Update available countries from unfiltered data (only when no country filter active)
          if (!selectedCountry && data.countryDistribution) {
            setAvailableCountries(data.countryDistribution.map((c) => c.country));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load analytics');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAnalytics(false);
        }
      }
    };

    void loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, [selectedQuizId, activeDevices, dateRange, customDateRange, selectedCountry]);

  const handleQuizSelect = useCallback((id: string | null) => {
    setSelectedQuizId(id);
    setSelectedCountry(null);
    setAvailableCountries([]);
  }, []);

  const toggleDevice = useCallback((device: DeviceType) => {
    setActiveDevices((prev) => {
      const next = new Set(prev);
      if (next.has(device)) {
        // Don't allow removing all devices
        if (next.size > 1) {
          next.delete(device);
        }
      } else {
        next.add(device);
      }
      return next;
    });
  }, []);

  const refreshAnalytics = useCallback(() => {
    if (selectedQuizId) {
      // Trigger re-fetch by updating a dependency
      setSelectedQuizId((current) => {
        // Force re-render by setting to null then back
        setTimeout(() => setSelectedQuizId(current), 0);
        return null;
      });
    }
  }, [selectedQuizId]);

  return {
    quizzes,
    selectedQuizId,
    setSelectedQuizId: handleQuizSelect,
    analytics,
    activeDevices,
    toggleDevice,
    dateRange,
    setDateRange,
    customDateRange,
    setCustomDateRange,
    selectedCountry,
    setSelectedCountry,
    availableCountries,
    activeTab,
    setActiveTab,
    isLoadingQuizzes,
    isLoadingAnalytics,
    error,
    refreshAnalytics,
  };
}
