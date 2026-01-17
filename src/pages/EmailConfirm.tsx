import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { updatePaymentLead, getPaymentLead, type PlanType } from '../services/api';
import { detectDeviceType } from '../utils/platformDetection';
import logo from '../assests/logo.svg';

interface LocationState {
  leadId?: string;
  email1?: string;
  planType?: PlanType | null;
  paid?: boolean;
  quizResponseId?: string;
}

const EmailConfirm: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateFromNav = location.state as LocationState | null;

  // Get params from URL (from Stripe redirect) or state (from skip)
  const sessionIdFromUrl = searchParams.get('session_id');
  const paidFromUrl = searchParams.get('paid') === 'true';
  const planFromUrl = searchParams.get('plan') as PlanType | null;
  const leadIdFromUrl = searchParams.get('lead_id');

  const leadId = stateFromNav?.leadId || leadIdFromUrl;
  const paid = stateFromNav?.paid ?? paidFromUrl;
  const planType = stateFromNav?.planType ?? planFromUrl;

  const [email, setEmail] = useState('');
  const [prefillEmail, setPrefillEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLead, setIsLoadingLead] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load lead info to get email1 for prefill
  useEffect(() => {
    if (!leadId) {
      // No lead ID - redirect back to start
      navigate(`/email/${quizId}`, { replace: true });
      return;
    }

    const loadLead = async () => {
      try {
        const lead = await getPaymentLead(leadId);
        setPrefillEmail(lead.email1);
        setEmail(lead.email1); // Pre-fill with first email
      } catch {
        // Use email from state if available
        if (stateFromNav?.email1) {
          setPrefillEmail(stateFromNav.email1);
          setEmail(stateFromNav.email1);
        }
      } finally {
        setIsLoadingLead(false);
      }
    };

    void loadLead();
  }, [leadId, quizId, navigate, stateFromNav?.email1]);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!leadId) {
      setError('Session expired. Please start again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Detect device type for analytics
    const deviceType = detectDeviceType();

    try {
      await updatePaymentLead(leadId, {
        email2: email.trim(),
        planType: planType,
        paid: paid,
        stripeSessionId: sessionIdFromUrl,
        deviceType: deviceType,
      });

      // Navigate to success page with device type
      navigate('/success', {
        state: {
          paid,
          planType,
          email: email.trim(),
          deviceType,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (isLoadingLead) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Logo */}
        <div className="mb-6 sm:mb-10">
          <img src={logo} alt="Logo" className="h-10 sm:h-12" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 text-center px-2">
          {paid ? 'Payment Successful!' : 'Confirm Your Email'}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-center mb-6 sm:mb-8 text-base sm:text-lg max-w-sm px-2">
          {paid
            ? 'Enter your email to receive your receipt and access details'
            : 'Enter your email to create a personal account'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md px-2">
          <div className="mb-4 sm:mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="Your email"
              className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border bg-white text-gray-900 text-base sm:text-lg outline-none transition-all ${
                error
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-gray-400'
              }`}
              disabled={isLoading}
              autoFocus
            />
            {prefillEmail && email === prefillEmail && (
              <p className="mt-2 text-xs text-gray-400 px-2">
                Pre-filled with your previous email
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600 px-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className={`w-full font-semibold py-3 sm:py-4 px-6 rounded-2xl transition-colors text-base sm:text-lg ${
              email.trim()
                ? 'bg-[#6d3be8] hover:bg-[#5c32c7] text-white'
                : 'bg-[#e8e4df] text-[#9a958f] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs sm:text-sm text-gray-400 text-center mt-6 sm:mt-8 px-4 max-w-md">
          By continuing you indicate that you've read and agree our{' '}
          <a href="#" className="text-gray-600 underline" onClick={(e) => e.preventDefault()}>
            Terms & Conditions
          </a>
          ,{' '}
          <a href="#" className="text-gray-600 underline" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          {' '}and{' '}
          <a href="#" className="text-gray-600 underline" onClick={(e) => e.preventDefault()}>
            Subscription Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default EmailConfirm;
