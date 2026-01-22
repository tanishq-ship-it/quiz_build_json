import { useState, useEffect, useCallback } from 'react';
import {
  initializePurchases,
  hasActiveSubscription,
  getCustomerInfo,
  getSubscriptionExpirationDate,
  isRevenueCatInitialized,
  type CustomerInfo,
} from '../services/revenuecat';

interface UseSubscriptionResult {
  isPremium: boolean;
  loading: boolean;
  error: string | null;
  expiresAt: Date | null;
  customerInfo: CustomerInfo | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to check and manage subscription status
 * @param userId - The user's Clerk ID (from createPaymentLead response)
 */
export const useSubscription = (userId: string | null): UseSubscriptionResult => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Initialize RevenueCat if not already initialized
      if (!isRevenueCatInitialized()) {
        initializePurchases(userId);
      }

      // Check subscription status
      const subscribed = await hasActiveSubscription();
      setIsPremium(subscribed);

      // Get customer info
      const info = await getCustomerInfo();
      setCustomerInfo(info);

      // Get expiration date if subscribed
      if (subscribed) {
        const expDate = await getSubscriptionExpirationDate();
        setExpiresAt(expDate);
      } else {
        setExpiresAt(null);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to check subscription');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    isPremium,
    loading,
    error,
    expiresAt,
    customerInfo,
    refresh: checkSubscription,
  };
};

export default useSubscription;
