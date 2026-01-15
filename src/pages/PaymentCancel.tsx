import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const quizId = searchParams.get('quiz_id');
  const leadId = searchParams.get('lead_id');

  const handleTryAgain = () => {
    if (quizId && leadId) {
      navigate(`/payment/${quizId}`, {
        state: { leadId },
      });
    } else if (quizId) {
      navigate(`/email/${quizId}`);
    } else {
      navigate('/');
    }
  };

  const handleSkip = () => {
    if (quizId && leadId) {
      navigate(`/email-confirm/${quizId}`, {
        state: {
          leadId,
          planType: null,
          paid: false,
        },
      });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Payment Cancelled
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            Your payment was cancelled. No charges have been made to your account.
            You can try again or continue without purchasing.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={handleSkip}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Continue Without Paying
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Info text */}
          <p className="text-xs text-gray-400 mt-6">
            If you experienced any issues during checkout, please contact our support team.
          </p>
        </div>

        {/* Support link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{' '}
          <a href="#" className="text-blue-600 hover:underline" onClick={(e) => e.preventDefault()}>
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentCancel;
