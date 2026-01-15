import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { createPaymentLead, getPublicQuiz } from '../services/api';
import logo from '../assests/logo.svg';

interface LocationState {
  quizResponseId?: string;
}

const EmailCollection: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check quiz exists
  useEffect(() => {
    if (!quizId) {
      setError('Quiz not found');
      setIsLoadingQuiz(false);
      return;
    }

    const loadQuiz = async () => {
      try {
        await getPublicQuiz(quizId);
      } catch {
        // Quiz validation is optional, don't block
      } finally {
        setIsLoadingQuiz(false);
      }
    };

    void loadQuiz();
  }, [quizId]);

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

    if (!quizId) {
      setError('Quiz not found');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const lead = await createPaymentLead({
        email1: email.trim(),
        quizId,
        quizResponseId: state?.quizResponseId,
      });

      // Navigate to payment page with lead ID
      navigate(`/payment/${quizId}`, {
        state: {
          leadId: lead.id,
          email1: lead.email1,
          quizResponseId: state?.quizResponseId,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (isLoadingQuiz) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-10">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          Congratulations!
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-center mb-8 text-lg">
          Enter your email to create a personal account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="Your email"
              className={`w-full px-6 py-4 rounded-2xl border bg-white text-gray-900 text-lg outline-none transition-all ${
                error
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-gray-400'
              }`}
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 px-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className={`w-full font-semibold py-4 px-6 rounded-2xl transition-colors text-lg ${
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
        <p className="text-sm text-gray-400 text-center mt-8 px-4 max-w-md">
          By continuining you indicate that you've read and agree our{' '}
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

export default EmailCollection;
