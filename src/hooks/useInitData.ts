import { useState, useEffect } from 'react';
import { initData } from '@/services/api';
import { useAuth } from '@clerk/clerk-react';
import { setAuthToken } from '@/services/api';

export const useInitData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isSignedIn, isLoaded, getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        setLoading(true);
        // Đợi lấy token trước khi gọi API
        const token = await getToken({
          template: 'SuperTodo',
        });
        console.log('Got token in useInitData:', token);
        setAuthToken(token);
        // Sau khi set token, gọi API
        const response = await initData();
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, getToken]);

  return { data, loading, error };
};
