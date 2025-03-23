import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { saveAuthToken, getAuthTokenFromCookie } from '@/lib/utils/cookie';

interface AuthContextType {
  token: string | null;
  userRole: string;
  isReady: boolean;
  signOut: () => Promise<void>;
  setUserRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken, signOut: clerkSignOut } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('free');
  const [isReady, setIsReady] = useState<boolean>(false);

  // Lấy token khi component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (user) {
          // Lấy token từ Clerk
          const clerkToken = await getToken({
            template: 'SuperTodo',
          });
          if (clerkToken) {
            // Lưu token vào cookie thay vì localStorage
            saveAuthToken(clerkToken);
            setToken(clerkToken);
          } else {
            // Nếu không có token từ Clerk, kiểm tra trong cookie
            const savedToken = getAuthTokenFromCookie();
            setToken(savedToken);
          }
        }
      } catch (error) {
        console.error('Error fetching authentication token:', error);
      } finally {
        setIsReady(true);
      }
    };

    if (isUserLoaded) {
      fetchToken();
    }
  }, [user, isUserLoaded, getToken]);

  // Theo dõi thay đổi đăng nhập từ Clerk
  useEffect(() => {
    // Nếu có user, đảm bảo token được lưu
    if (user) {
      console.log('User logged in:', user.primaryEmailAddress?.emailAddress);
      getToken().then((token) => {
        if (token) {
          console.log('Got token from Clerk, saving to cookie');
          saveAuthToken(token);
          setToken(token);
        }
      });
    } else {
      console.log('No user found');
    }
  }, [isUserLoaded, user]);

  // Sign out handler
  const handleSignOut = async () => {
    await clerkSignOut();
    // Không cần xóa khỏi localStorage vì chúng ta đã chuyển sang cookie
    // Xóa token từ cookie sẽ được xử lý ở utils/cookie.ts
  };

  const value = {
    token,
    userRole,
    isReady,
    signOut: handleSignOut,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
