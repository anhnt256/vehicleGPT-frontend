import { useState, useEffect } from 'react';
import { initData, setAuthToken } from '@/services/api';
import { useAuth } from '@clerk/clerk-react';

export const useInitData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getToken({
          template: 'SuperTodo',
        });
        if (!token) {
          throw new Error('No authentication token found');
        }
        setAuthToken(token);
        const response = await initData();
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  return { data, loading, error };
};
