import { createContext, useEffect, useState } from 'react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { router } from '@/routes';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { signOut } = useClerk();
  const { getToken } = useAuth();

  useEffect(() => {
    const checkAndSetToken = async () => {
      if (getToken) {
        try {
          const token = await getToken();
          if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            router.navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error getting token:', error);
          setIsAuthenticated(false);
        }
      }
    };

    checkAndSetToken();
  }, [getToken]);

  const logout = async () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    await signOut();
    router.navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
