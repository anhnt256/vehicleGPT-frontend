import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useInitData } from '@/hooks/useInitData';
import { toast } from 'sonner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useInitData();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        if (!loading && !error && data) {
          if (error) {
            toast.error('Failed to initialize data. Please try again.');
            return;
          }
          navigate('/dashboard/chat');
        }
      } else {
        navigate('/');
      }
    }
  }, [isLoaded, isSignedIn, loading, error, data, navigate]);

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
