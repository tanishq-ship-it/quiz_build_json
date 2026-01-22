import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Smartphone, Monitor, Mail, ExternalLink } from 'lucide-react';
import type { PlanType } from '../services/api';
import { detectDeviceType, APP_STORE_URL, type DeviceType } from '../utils/platformDetection';
import logo from '../assests/logo.svg';

interface LocationState {
  paid?: boolean;
  planType?: PlanType | null;
  email?: string;
  deviceType?: DeviceType;
}

const getPlanLabel = (planType: PlanType | null | undefined): string => {
  switch (planType) {
    case '1_month':
      return '1 Month Plan';
    case '1_year':
      return '1 Year Plan';
    default:
      return '';
  }
};

// iOS Screen - Auto redirects to App Store
const IOSSuccessScreen: React.FC<{ paid: boolean; planType?: PlanType | null; email?: string }> = ({
  paid,
  planType,
  email,
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = APP_STORE_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Mindsnack" className="h-10" />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {paid ? 'Payment Successful!' : 'You\'re All Set!'}
          </h1>

          {/* Plan info */}
          {paid && planType && (
            <div className="bg-purple-50 rounded-xl px-4 py-2 mb-4 inline-block">
              <p className="text-purple-700 font-semibold text-sm">
                {getPlanLabel(planType)}
              </p>
            </div>
          )}

          {/* Message */}
          <p className="text-gray-600 mb-6">
            We're so happy you completed the quiz! Opening the App Store for you...
          </p>

          {/* Countdown */}
          <div className="bg-purple-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Smartphone className="w-6 h-6 text-purple-600" />
              <span className="text-purple-700 font-medium">
                Redirecting in {countdown}...
              </span>
            </div>
            <button
              onClick={() => window.location.href = APP_STORE_URL}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Download Mindsnack Now
            </button>
          </div>

          {/* Email confirmation */}
          {email && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>Receipt sent to: <span className="font-medium text-gray-700">{email}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Android Screen - iOS only message
const AndroidSuccessScreen: React.FC<{ paid: boolean; planType?: PlanType | null; email?: string }> = ({
  paid,
  planType,
  email,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Mindsnack" className="h-10" />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Mindsnack!
          </h1>

          {/* Plan info */}
          {paid && planType && (
            <div className="bg-green-50 rounded-xl px-4 py-2 mb-4 inline-block">
              <p className="text-green-700 font-semibold text-sm">
                {getPlanLabel(planType)} - Activated
              </p>
            </div>
          )}

          {/* Celebration message */}
          <p className="text-gray-600 mb-6">
            We're so happy you completed the quiz! We'd love for you to experience our app.
          </p>

          {/* iOS Only Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Available on iPhone & iPad
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Our app is currently available only on the App Store. Please download Mindsnack on your iPhone or iPad to get started.
            </p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700"
            >
              View on App Store
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Email confirmation */}
          {email && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>We've sent your access details to:</span>
              </div>
              <p className="font-medium text-gray-900 mt-1">{email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Desktop Screen - QR Code to download
const DesktopSuccessScreen: React.FC<{ paid: boolean; planType?: PlanType | null; email?: string }> = ({
  paid,
  planType,
  email,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Mindsnack" className="h-10" />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Mindsnack!
          </h1>

          {/* Plan info */}
          {paid && planType && (
            <div className="bg-green-50 rounded-xl px-4 py-2 mb-4 inline-block">
              <p className="text-green-700 font-semibold text-sm">
                {getPlanLabel(planType)} - Activated
              </p>
            </div>
          )}

          {/* Celebration message */}
          <p className="text-gray-600 mb-6">
            We're so happy you completed the quiz! Download our app on your iPhone to get started.
          </p>

          {/* QR Code Section */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-center mb-4">
              <Monitor className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Scan with your iPhone
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Point your iPhone camera at this QR code to download Mindsnack from the App Store
            </p>

            {/* QR Code with Logo */}
            <div className="bg-white rounded-xl p-4 inline-block shadow-sm mb-4 relative">
              <QRCodeSVG
                value={APP_STORE_URL}
                size={180}
                level="H"
                includeMargin={true}
              />
              {/* Mindsnack brain logo in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#6D3BE8] rounded-lg flex items-center justify-center shadow-sm">
                  <svg width="32" height="32" viewBox="0 0 245 245" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M203.087 159.352C202.308 198.606 152.668 211.255 122.416 196.745C92.2655 211.305 42.651 198.53 41.9469 159.377C20.7482 144.389 19.3148 106.242 40.8656 90.9525C40.589 84.4898 41.3685 78.5301 44.537 72.8469C50.019 63.0648 59.9771 58.8905 70.9914 59.5191C73.2294 47.9013 84.7215 39.0497 96.3141 38.3456C106.423 37.7169 117.559 41.6891 118.465 53.0303C118.971 61.0194 118.168 70.6685 118.772 78.8411C119.677 82.9652 125.007 83.9869 126.239 79.3348C126.893 70.458 125.409 60.4747 126.239 51.7236C126.842 45.5124 132.827 41.0111 138.46 39.3766C153.498 35.0011 171.251 44.1293 174.747 59.7203C185.233 59.2677 195.166 63.3917 200.497 72.6709C203.766 78.354 204.395 84.0875 204.395 90.5753C224.94 106.644 224.638 144.213 203.087 159.402V159.352ZM104.059 125.102C106.473 122.713 104.512 116.627 102.877 114.062C97.672 105.839 85.501 105.362 79.4658 112.956C76.8254 116.275 73.7072 125.63 80.1448 126.384C85.5513 127.013 83.6111 120.329 86.2012 117.865C89.596 114.621 95.4193 116.636 96.6662 120.902C96.6662 122.781 96.3896 124.197 98.6528 125.655C100.388 126.787 102.601 126.56 104.059 125.102ZM154.152 107.474C147.236 107.675 140.899 113.308 140.17 120.223C139.359 124.625 142.936 128.321 146.935 125.479C148.745 124.197 148.192 121.933 148.896 120.072C150.832 114.741 158.779 114.943 160.338 120.5C160.941 122.688 160.212 124.171 162.525 125.68C164.059 126.686 165.568 126.686 167.102 125.68C169.919 123.844 169.139 119.394 168.108 116.728C165.945 111.145 160.187 107.323 154.177 107.499L154.152 107.474ZM89.0719 137.248C86.8338 137.474 84.7466 139.611 84.8221 141.925C84.973 146.376 93.372 153.316 96.8925 155.655C113.967 167.097 138.913 165.135 154.076 151.305C157.119 148.539 163.38 141.648 158.376 138.103C153.699 134.808 151.536 140.014 149.173 142.705C137.58 155.982 111.352 156.636 98.351 145.018C94.8048 142.446 93.0953 136.845 89.0719 137.248Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Direct link */}
            <div className="pt-4 border-t border-purple-100">
              <p className="text-sm text-gray-500 mb-2">Or open this link on your iPhone:</p>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 text-sm break-all"
              >
                {APP_STORE_URL}
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Email confirmation */}
          {email && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>We've sent your access details to:</span>
              </div>
              <p className="font-medium text-gray-900 mt-1">{email}</p>
            </div>
          )}
        </div>

        {/* Help link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{' '}
          <a href="mailto:support@mindsnack.com" className="text-purple-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const paid = state?.paid ?? false;
  const planType = state?.planType;
  const email = state?.email;

  // Use device type from state or detect it
  const deviceType = state?.deviceType ?? detectDeviceType();

  // Render device-specific screen
  switch (deviceType) {
    case 'ios':
      return <IOSSuccessScreen paid={paid} planType={planType} email={email} />;
    case 'android':
      return <AndroidSuccessScreen paid={paid} planType={planType} email={email} />;
    case 'desktop':
    default:
      return <DesktopSuccessScreen paid={paid} planType={planType} email={email} />;
  }
};

export default PaymentSuccess;
