import { useAuth } from '@clerk/clerk-react';
import { useInitData } from '@/hooks/useInitData';
import { toast } from 'react-hot-toast';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isLoaded } = useAuth();
  const { loading, error } = useInitData();

  if (error) {
    toast.error('Failed to initialize data. Please try again later.');
    return <>{children}</>;
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};
