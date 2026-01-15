import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import type { PlanType } from '../services/api';

interface LocationState {
  paid?: boolean;
  planType?: PlanType | null;
  email?: string;
}

const getPlanLabel = (planType: PlanType | null | undefined): string => {
  switch (planType) {
    case '1_month':
      return '1 Month Plan';
    case '3_month':
      return '3 Months Plan';
    case '1_year':
      return '1 Year Plan';
    default:
      return '';
  }
};

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const paid = state?.paid ?? false;
  const planType = state?.planType;
  const email = state?.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${paid ? 'bg-green-100' : 'bg-blue-100'}`}>
              {paid ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <Mail className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {paid ? 'Thank You!' : 'You\'re All Set!'}
          </h1>

          {/* Plan info */}
          {paid && planType && (
            <div className="bg-green-50 rounded-xl px-4 py-3 mb-4">
              <p className="text-green-700 font-semibold">
                {getPlanLabel(planType)}
              </p>
              <p className="text-green-600 text-sm mt-1">
                Your purchase was successful
              </p>
            </div>
          )}

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {paid
              ? 'Your payment has been processed successfully. Check your email for the receipt and access details.'
              : 'Thank you for your interest! We\'ll be in touch with updates and exclusive offers.'}
          </p>

          {/* Email confirmation */}
          {email && (
            <p className="text-sm text-gray-500 mb-6">
              Confirmation sent to: <span className="font-medium text-gray-700">{email}</span>
            </p>
          )}

          {/* CTA Button */}
          <button
            onClick={() => navigate('/')}
            className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              paid
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Additional info */}
          {paid && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">What's Next?</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Check your email for the receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Access your personalized content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Start your journey today</span>
                </li>
              </ul>
            </div>
          )}
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

export default PaymentSuccess;
