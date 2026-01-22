import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Headphones, Instagram, Loader2, ShieldCheck, Star } from 'lucide-react';
import { getPublicQuiz, type PlanType } from '../services/api';
import {
  initializePurchases,
  getOfferings,
  purchasePackage,
  isRevenueCatInitialized,
  PREMIUM_ENTITLEMENT_ID,
  type Package,
} from '../services/revenuecat';
import logo from '../assests/logo.svg';
import visaLogo from '../assests/visa.svg';
import mastercardLogo from '../assests/mastercard.svg';
import amexLogo from '../assests/amex.svg';
import discoverLogo from '../assests/discover.svg';
import paypalLogo from '../assests/paypal.svg';
import maestroLogo from '../assests/maestro.svg';
import microsoftLogo from '../assests/microsoft.svg';
import walmartLogo from '../assests/walmart.svg';
import bankofamericaLogo from '../assests/bankofamerica.svg';
import amazonLogo from '../assests/amazon.svg';
import salesforceLogo from '../assests/salesforce.svg';
import nvidiaLogo from '../assests/nvidia.svg';

type PaymentState = 'idle' | 'processing';

const DISCOUNT_PERCENT_LABEL = '51%';
const DEFAULT_COUNTDOWN_SECONDS = 10 * 60; // 10 minutes

const getCountdownStorageKey = (quizId: string) => `quiz:${quizId}:paywall:expiresAt`;

const formatCountdown = (seconds: number): string => {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

type Plan = {
  id: PlanType;
  duration: string;
  originalPrice: string;
  discountedPrice: string;
  perDay: string;
  strikePrice: string;
  badge: string;
  badgeColor: string;
  popular?: boolean;
};

type PaymentMethod = {
  id: string;
  label: string;
  logo: string;
};

type Review = {
  id: string;
  rating: number;
  text: string;
  userName: string;
  handle: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'visa', label: 'Visa', logo: visaLogo },
  { id: 'mastercard', label: 'Mastercard', logo: mastercardLogo },
  { id: 'discover', label: 'Discover', logo: discoverLogo },
  { id: 'paypal', label: 'PayPal', logo: paypalLogo },
  { id: 'amex', label: 'Amex', logo: amexLogo },
  { id: 'maestro', label: 'Maestro', logo: maestroLogo },
];

const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'r1',
    rating: 5,
    text: "This app breaks books down into quick, easy snippets. Just listened to a chunk of 'Atomic Habits' during my warm-up today. Highly recommend it for anyone who's too busy to sit down and read!",
    userName: 'Alex Johnson',
    handle: 'AlexJohnsonNYC',
  },
  {
    id: 'r2',
    rating: 5,
    text: "I never imagined finding a tattoo this personal and meaningful. It's perfect, the way it reflects my journey and personality is amazing!",
    userName: 'Emily Brown',
    handle: 'EmilyBrown.3',
  },
  {
    id: 'r3',
    rating: 5,
    text: "The customization options blew me away. It's exactly what I envisioned from the start, and the ability to tweak every detail made all the difference!",
    userName: 'Kevin Miller',
    handle: 'KevinMillerx',
  },
];

type TrustedCompany = {
  id: string;
  label: string;
  logo: string;
};

const TRUSTED_COMPANIES: TrustedCompany[] = [
  { id: 'microsoft', label: 'Microsoft', logo: microsoftLogo },
  { id: 'walmart', label: 'Walmart', logo: walmartLogo },
  { id: 'bankofamerica', label: 'Bank of America', logo: bankofamericaLogo },
  { id: 'amazon', label: 'Amazon', logo: amazonLogo },
  { id: 'salesforce', label: 'Salesforce', logo: salesforceLogo },
  { id: 'nvidia', label: 'NVIDIA', logo: nvidiaLogo },
];

interface LocationState {
  leadId?: string;
  email1?: string;
  quizResponseId?: string;
  clerkUserId?: string; // Used as RevenueCat app_user_id
}

const PaymentPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [quizTitle, setQuizTitle] = useState<string>('Quiz');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('1_year');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(DEFAULT_COUNTDOWN_SECONDS);
  const [rcPackages, setRcPackages] = useState<Package[]>([]);

  // Check if we have leadId from navigation
  useEffect(() => {
    if (!state?.leadId) {
      // No lead ID - redirect back to email collection
      navigate(`/email/${quizId}`, { replace: true });
    }
  }, [state?.leadId, quizId, navigate]);

  // Initialize RevenueCat
  useEffect(() => {
    if (!state?.clerkUserId) {
      console.warn('PaymentPage: No clerkUserId provided in state');
      return;
    }

    const initRC = async () => {
      try {
        console.log('Initializing RevenueCat with userId:', state.clerkUserId);
        if (!isRevenueCatInitialized()) {
          initializePurchases(state.clerkUserId!);
        }
        // Fetch offerings
        console.log('Fetching RevenueCat offerings...');
        const offerings = await getOfferings();
        console.log('RevenueCat offerings:', offerings);

        if (offerings.current?.availablePackages) {
          console.log('Available packages:', offerings.current.availablePackages);
          setRcPackages(offerings.current.availablePackages);
        } else {
          console.warn('No offerings or packages available from RevenueCat');
        }
      } catch (err) {
        console.error('Failed to initialize RevenueCat:', err);
      }
    };

    initRC();
  }, [state?.clerkUserId]);

  // Load quiz info
  useEffect(() => {
    if (!quizId) {
      setError('Missing quiz id.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const quiz = await getPublicQuiz(quizId);
        if (cancelled) return;
        setQuizTitle(quiz.title || 'Quiz');
      } catch {
        if (cancelled) return;
        // Don't block on title load failure
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  // Discount countdown (persisted per quiz)
  useEffect(() => {
    if (!quizId) return;
    if (typeof window === 'undefined') return;

    const key = getCountdownStorageKey(quizId);
    const stored = window.sessionStorage.getItem(key);
    const now = Date.now();
    const expiresAt =
      stored && Number.isFinite(Number(stored))
        ? Number(stored)
        : now + DEFAULT_COUNTDOWN_SECONDS * 1000;

    window.sessionStorage.setItem(key, String(expiresAt));

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setCountdownSeconds(remaining);
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [quizId]);

  const handlePay = async () => {
    if (!quizId || !state?.leadId) return;
    if (paymentState === 'processing') return;

    try {
      setPaymentState('processing');
      setError(null);

      // Find the matching RevenueCat package for the selected plan
      // Package types use $rc_ prefix (e.g., "$rc_monthly", "$rc_three_month", "$rc_annual")
      const planToPackageType: Record<PlanType, string> = {
        '1_month': '$rc_monthly',
        '3_month': '$rc_three_month',
        '1_year': '$rc_annual',
      };

      const targetPackageType = planToPackageType[selectedPlan];
      const packageInfo = rcPackages.map(p => ({ id: p.identifier, type: p.packageType }));
      console.log('Looking for package type:', targetPackageType);
      console.log('Available packages:', JSON.stringify(packageInfo, null, 2));
      const rcPackage = rcPackages.find((pkg) => pkg.packageType === targetPackageType);
      console.log('Found package:', rcPackage ? rcPackage.identifier : 'NONE');

      if (!rcPackage) {
        // Fallback: If no RevenueCat packages loaded, navigate to email-confirm with skip
        console.warn('No RevenueCat package found for plan:', selectedPlan);
        setError('Unable to load payment options. Please try again.');
        setPaymentState('idle');
        return;
      }

      // Purchase using RevenueCat
      const customerInfo = await purchasePackage(rcPackage);

      if (customerInfo && PREMIUM_ENTITLEMENT_ID in customerInfo.entitlements.active) {
        // Payment successful - navigate to email confirmation
        navigate(`/email-confirm/${quizId}`, {
          state: {
            leadId: state.leadId,
            email1: state.email1,
            planType: selectedPlan,
            paid: true,
            quizResponseId: state.quizResponseId,
          },
        });
      } else if (customerInfo === null) {
        // User cancelled
        setPaymentState('idle');
      } else {
        // Payment completed but entitlement not active yet (webhook may be processing)
        navigate(`/email-confirm/${quizId}`, {
          state: {
            leadId: state.leadId,
            email1: state.email1,
            planType: selectedPlan,
            paid: true,
            quizResponseId: state.quizResponseId,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setPaymentState('idle');
    }
  };

  const handleSkip = () => {
    if (!quizId) return;

    // Navigate to email confirmation page with skip (paid=false)
    navigate(`/email-confirm/${quizId}`, {
      state: {
        leadId: state?.leadId,
        email1: state?.email1,
        planType: null,
        paid: false,
        quizResponseId: state?.quizResponseId,
      },
    });
  };

  const plans: Plan[] = useMemo(
    () => [
      {
        id: '1_month',
        duration: '1 month',
        originalPrice: '$25.99',
        discountedPrice: '$12.99',
        perDay: '$0.43',
        strikePrice: '$0.87',
        badge: 'SAVE 50%',
        badgeColor: 'text-[#6d3be8] border-[#6d3be8]',
      },
      {
        id: '1_year',
        duration: '1 year',
        originalPrice: '$199.99',
        discountedPrice: '$99.99',
        perDay: '$0.27',
        strikePrice: '$0.55',
        badge: 'BEST OFFER',
        badgeColor: 'text-[#6d3be8] border-[#6d3be8]',
        popular: true,
      },
    ],
    []
  );

  const selectedPlanDetails = useMemo(
    () => plans.find((p) => p.id === selectedPlan) ?? plans[0],
    [plans, selectedPlan]
  );

  const handleContinue = () => {
    void handlePay();
  };

  return (
    <div className="app-container">
      <section className="screen-section">
        <div className="mobile-frame">
          <div className="w-full h-full bg-gray-50 flex flex-col p-4 gap-3 overflow-y-auto scrollbar-hide">
            {/* Logo */}
            <div className="flex justify-center py-2">
              <img src={logo} alt="Logo" className="h-10" />
            </div>

            {/* Timer Banner */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {DISCOUNT_PERCENT_LABEL} discount reserved for:
                </p>
                <p className="text-2xl font-bold">{formatCountdown(countdownSeconds)}</p>
              </div>
              <button
                type="button"
                onClick={handleContinue}
                disabled={paymentState === 'processing'}
                className="bg-[#6d3be8] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#5c32c7] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>

            {/* Main Pricing Card */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-wider text-gray-400">
                  {quizTitle}
                </div>
                <h2 className="text-2xl font-bold text-center mt-2">Choose your plan</h2>
              </div>

              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600 py-10">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                    {error}
                  </div>
                ) : (
                  plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedPlan(plan.id);
                      }}
                      className={`relative border-2 rounded-2xl p-4 cursor-pointer transition ${
                        plan.popular
                          ? 'border-[#6d3be8] bg-[#f3eefe]'
                          : selectedPlan === plan.id
                            ? 'border-[#6d3be8]'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-[#6d3be8] text-white text-center py-1.5 rounded-t-xl font-semibold text-xs">
                          MOST POPULAR
                        </div>
                      )}

                      <div
                        className={`flex items-center justify-between ${plan.popular ? 'mt-6' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio Button */}
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedPlan === plan.id
                                ? 'border-[#6d3be8]'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedPlan === plan.id && (
                              <div className="w-3.5 h-3.5 bg-[#6d3be8] rounded-full" />
                            )}
                          </div>

                          <div>
                            <h3 className="text-xl font-bold mb-1">{plan.duration}</h3>
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-gray-400 line-through">
                                {plan.originalPrice}
                              </span>
                              <span className="font-semibold">{plan.discountedPrice}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 border-2 ${plan.badgeColor} rounded-lg text-xs font-bold mb-2`}
                          >
                            {plan.badge}
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-gray-400 line-through text-[11px]">
                              {plan.strikePrice}
                            </span>
                            <span className="text-3xl font-bold">{plan.perDay}</span>
                          </div>
                          <p className="text-xs text-gray-600">per day</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={paymentState === 'processing'}
                className="w-full bg-[#6d3be8] text-white py-3 rounded-2xl font-bold text-base mt-5 hover:bg-[#5c32c7] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {paymentState === 'processing' ? 'PROCESSING...' : 'CONTINUE'}
              </button>

              {/* Terms and Conditions */}
              <div className="mt-5 text-center text-xs text-gray-500 leading-relaxed">
                <p>
                  We&apos;ve applied a discount to your first subscription. Your plan will renew at
                  the full price of {selectedPlanDetails.originalPrice} after the current term. You
                  can manage your subscription in your account.
                </p>
                <p className="mt-2">
                  By continuing, you agree to our{' '}
                  <a
                    href="#"
                    className="text-gray-700 underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Terms &amp; Privacy
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="text-gray-700 underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Refund Policy.
                  </a>
                </p>
              </div>

              {/* Pay safe & secure + supported methods */}
              <div className="mt-4">
                <div className="bg-emerald-50 text-emerald-700 rounded-2xl px-4 py-3 flex items-center justify-center gap-2 font-semibold">
                  <ShieldCheck className="w-5 h-5" />
                  Pay safe &amp; secure
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2"
                      aria-label={m.label}
                    >
                      <img src={m.logo} alt={m.label} className="h-5 w-auto" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={paymentState === 'processing'}
                  className="text-xs text-gray-500 hover:text-gray-700 underline disabled:opacity-50"
                >
                  Skip for now
                </button>
              </div>
            </div>

            {/* Benefits / continuation section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-4xl font-extrabold text-center leading-tight">
                Understand key ideas
                <br />
                in 15 minutes
              </h2>

              <div className="mt-6 flex gap-4 items-start">
                <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#f3eefe] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#6d3be8]" />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-900">Know more in minutes</p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Get the key insights from today&apos;s best books, podcast, and articles
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#f3eefe] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#6d3be8]" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-900">Feed your curiosity</p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Personal recommendations to dive into 6,500+ titles and hundreds of topics
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#f3eefe] flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-[#6d3be8]" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-900">Listen, learn, gain insights!</p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Learn from experts through step-by-step guides &amp; exclusive personal
                    insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Global community */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <p className="text-center text-2xl font-extrabold text-gray-900 leading-snug">
                Become a member of our global community of{' '}
                <span className="text-[#6d3be8]">70 million people</span>
              </p>
            </div>

            {/* Customer reviews */}
            <div className="mt-2">
              <h3 className="text-2xl font-extrabold text-gray-900 px-1">Customer reviews</h3>
            </div>

            {CUSTOMER_REVIEWS.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-5 h-5 ${idx < review.rating ? 'fill-yellow-400' : ''}`}
                    />
                  ))}
                </div>

                <p className="mt-4 text-lg text-gray-900 leading-relaxed">{review.text}</p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                    {review.userName
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-base">{review.handle}</span>
                    <Instagram className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}

            {/* Trusted by companies */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <p className="text-center text-xs tracking-widest font-semibold text-gray-500">
                ALSO TRUSTED BY
              </p>
              <p className="text-center text-3xl font-extrabold text-[#6d3be8] mt-2">
                +1,500 COMPANIES
              </p>

              <div className="mt-6 grid grid-cols-3 gap-4 items-center">
                {TRUSTED_COMPANIES.map((c) => (
                  <div
                    key={c.id}
                    className="h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden"
                    aria-label={c.label}
                  >
                    <img src={c.logo} alt={c.label} className="h-6 w-auto max-w-full object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom discount banner (sticky) */}
            <div className="sticky bottom-0 z-10 pt-2">
              <div className="bg-[#6d3be8] text-white rounded-2xl px-4 py-3 text-center font-extrabold tracking-wide">
                {DISCOUNT_PERCENT_LABEL} DISCOUNT RESERVED FOR {formatCountdown(countdownSeconds)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentPage;
