import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && location.pathname === '/') {
      navigate('/dashboard/chat', { replace: true });
    }
  }, [isSignedIn, location.pathname, navigate]);

  // Hiển thị loading khi đang kiểm tra
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Chuyển hướng nếu chưa đăng nhập
  if (!isSignedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return <>{children}</>;
};
