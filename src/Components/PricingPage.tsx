import React, { useEffect, useState } from 'react';
import {
  initializePurchases,
  getOfferings,
  purchasePackage,
  hasActiveSubscription,
  isRevenueCatInitialized,
  PREMIUM_ENTITLEMENT_ID,
  type Package,
} from '../services/revenuecat';

interface PricingPageProps {
  userId: string; // Clerk user ID from createPaymentLead response
  onSubscriptionComplete?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ userId, onSubscriptionComplete }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize RevenueCat with user ID
        if (!isRevenueCatInitialized()) {
          initializePurchases(userId);
        }

        // Check if already subscribed
        const subscribed = await hasActiveSubscription();
        setIsSubscribed(subscribed);

        if (!subscribed) {
          // Fetch offerings
          const offerings = await getOfferings();
          if (offerings.current?.availablePackages) {
            setPackages(offerings.current.availablePackages);
          }
        }
      } catch (err) {
        console.error('Error initializing pricing:', err);
        setError('Failed to load pricing. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      init();
    }
  }, [userId]);

  const handlePurchase = async (pkg: Package) => {
    setPurchasing(true);
    setSelectedPackage(pkg.identifier);
    setError(null);

    try {
      const customerInfo = await purchasePackage(pkg);

      if (customerInfo && PREMIUM_ENTITLEMENT_ID in customerInfo.entitlements.active) {
        setIsSubscribed(true);
        onSubscriptionComplete?.();
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
      setSelectedPackage(null);
    }
  };

  const getPackageLabel = (packageType: string): string => {
    switch (packageType) {
      case '$rc_monthly':
        return '/month';
      case '$rc_three_month':
        return '/3 months';
      case '$rc_annual':
        return '/year';
      case '$rc_lifetime':
        return 'lifetime';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading pricing...</div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div style={styles.container}>
        <div style={styles.subscribedMessage}>
          <h2 style={styles.subscribedTitle}>You have Premium Access!</h2>
          <p style={styles.subscribedText}>Enjoy all premium courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Your Plan</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.cardsContainer}>
        {packages.map((pkg) => {
          const product = pkg.rcBillingProduct;
          const isSelected = selectedPackage === pkg.identifier;

          return (
            <div
              key={pkg.identifier}
              style={{
                ...styles.card,
                ...(isSelected ? styles.cardSelected : {}),
              }}
            >
              <h3 style={styles.cardTitle}>{product?.title || 'Premium'}</h3>
              <p style={styles.price}>{product?.currentPrice?.formattedPrice || '$0.00'}</p>
              <p style={styles.period}>{getPackageLabel(pkg.packageType)}</p>
              <p style={styles.description}>
                {product?.description || 'Access to all premium content'}
              </p>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing}
                style={{
                  ...styles.button,
                  ...(purchasing && isSelected ? styles.buttonDisabled : {}),
                }}
              >
                {purchasing && isSelected ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          );
        })}
      </div>

      {packages.length === 0 && !loading && (
        <p style={styles.noPackages}>No subscription plans available at this time.</p>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#1a1a1a',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    padding: '60px 0',
  },
  error: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    padding: '32px',
    width: '280px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  cardSelected: {
    borderColor: '#6366f1',
    transform: 'scale(1.02)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  price: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: '4px',
  },
  period: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
  },
  description: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  subscribedMessage: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#ecfdf5',
    borderRadius: '16px',
    border: '2px solid #a7f3d0',
  },
  subscribedTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#059669',
    marginBottom: '12px',
  },
  subscribedText: {
    fontSize: '16px',
    color: '#047857',
  },
  noPackages: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '16px',
    padding: '40px',
  },
};

export default PricingPage;
