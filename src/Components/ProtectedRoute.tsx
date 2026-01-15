import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Lottie from 'lottie-react';
import loadingAnimation from '../assests/Loding.json';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#eef2ff] to-[#e0f2fe] flex items-center justify-center">
        <div className="w-52 h-52 sm:w-80 sm:h-80">
          <Lottie animationData={loadingAnimation} loop autoplay />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
