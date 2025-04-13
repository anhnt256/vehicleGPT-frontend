import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useInitData } from '@/hooks/useInitData';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { data, loading, error } = useInitData();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    console.error('Failed to initialize data:', error);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Failed to initialize data</div>
      </div>
    );
  }

  return <>{children}</>;
};
