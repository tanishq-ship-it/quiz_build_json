import { Purchases, type CustomerInfo, type Offerings, type Package } from '@revenuecat/purchases-js';

// RevenueCat API Keys (must match backend config)
const REVENUECAT_PUBLIC_KEY = 'rcb_NsfaLLSgQYGCCbHbtoCErUZcNJIc'; // Production

const REVENUECAT_SANDBOX_KEY = 'rcb_sb_VxqhPCleFgrPtzHoJdwVWlTii'; // Sandbox/Testing

// Use sandbox key for development, production key for production
const API_KEY = import.meta.env.DEV ? REVENUECAT_SANDBOX_KEY : REVENUECAT_PUBLIC_KEY;

// Premium entitlement identifier (must match RevenueCat dashboard)
export const PREMIUM_ENTITLEMENT_ID = 'Premium Courses';

let isInitialized = false;

/**
 * Initialize RevenueCat with the user's ID
 * @param userId - The user's Clerk ID (from createPaymentLead response)
 */
export const initializePurchases = (userId: string): void => {
  if (isInitialized) {
    console.log('RevenueCat already initialized');
    return;
  }

  try {
    Purchases.configure({
      apiKey: API_KEY,
      appUserId: userId,
    });
    isInitialized = true;
    console.log('RevenueCat initialized for user:', userId);
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    throw error;
  }
};

/**
 * Check if RevenueCat is initialized
 */
export const isRevenueCatInitialized = (): boolean => {
  return isInitialized;
};

/**
 * Get available offerings (subscription plans)
 */
export const getOfferings = async (): Promise<Offerings> => {
  try {
    const offerings = await Purchases.getSharedInstance().getOfferings();
    return offerings;
  } catch (error) {
    console.error('Error fetching offerings:', error);
    throw error;
  }
};

/**
 * Purchase a subscription package
 * @param pkg - The package to purchase
 */
export const purchasePackage = async (pkg: Package): Promise<CustomerInfo | null> => {
  try {
    const result = await Purchases.getSharedInstance().purchase({
      rcPackage: pkg,
    });
    return result.customerInfo;
  } catch (error: any) {
    // Check if user cancelled
    if (error?.errorCode === 'UserCancelledError' || error?.code === 'USER_CANCELLED') {
      console.log('User cancelled purchase');
      return null;
    }
    console.error('Purchase error:', error);
    throw error;
  }
};

/**
 * Get current customer info (subscription status)
 */
export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error fetching customer info:', error);
    throw error;
  }
};

/**
 * Check if user has active premium subscription
 */
export const hasActiveSubscription = async (): Promise<boolean> => {
  try {
    const customerInfo = await getCustomerInfo();
    return PREMIUM_ENTITLEMENT_ID in customerInfo.entitlements.active;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
};

/**
 * Get subscription expiration date if subscribed
 */
export const getSubscriptionExpirationDate = async (): Promise<Date | null> => {
  try {
    const customerInfo = await getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
    if (entitlement?.expirationDate) {
      return new Date(entitlement.expirationDate);
    }
    return null;
  } catch (error) {
    console.error('Error getting expiration date:', error);
    return null;
  }
};

/**
 * Close the RevenueCat SDK connection (call when user logs out)
 * Note: For web SDK, there's no restorePurchases - subscriptions are tied to user ID
 */
export const closePurchases = (): void => {
  try {
    if (isInitialized) {
      Purchases.getSharedInstance().close();
      isInitialized = false;
      console.log('RevenueCat connection closed');
    }
  } catch (error) {
    console.error('Error closing RevenueCat:', error);
    throw error;
  }
};

// Re-export types for convenience
export type { CustomerInfo, Offerings, Package };
