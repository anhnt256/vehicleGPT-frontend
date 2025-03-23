import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { saveAuthToken, setCookie } from '@/lib/utils/cookie';
import { checkUserRole } from '@/lib/api/checkUserRole';

function App() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Effect để xử lý đăng nhập và lưu token
  useEffect(() => {
    // Chỉ chạy khi user đã load
    if (isLoaded && user) {
      console.log('🔑 User logged in:', user.primaryEmailAddress?.emailAddress);

      // Lấy token từ Clerk và lưu vào cookie
      const saveTokenAndCheckRole = async () => {
        try {
          const token = await getToken({
            template: 'SuperTodo',
          });
          if (token) {
            console.log('📝 Saving token to cookie');
            saveAuthToken(token);

            // Gọi API kiểm tra vai trò người dùng
            if (user.primaryEmailAddress?.emailAddress) {
              console.log('🔎 Checking user role');
              const email = user.primaryEmailAddress.emailAddress;
              try {
                const userData = await checkUserRole(email);
                console.log('👤 User role:', userData.role);
                // Lưu userRole vào cookie
                setCookie('userRole', userData.role, 7);

                // Kiểm tra URL hiện tại xem đã ở dashboard chưa
                if (!window.location.pathname.includes('/dashboard')) {
                  console.log('📱 Redirecting to dashboard...');
                  window.location.href = `/dashboard?userRole=${userData.role}`;
                }
              } catch (error) {
                console.error('❌ Error checking user role:', error);
                setCookie('userRole', 'free', 7);

                // Redirect to dashboard even if role check fails
                if (!window.location.pathname.includes('/dashboard')) {
                  console.log('📱 Redirecting to dashboard with free role...');
                  window.location.href = '/dashboard?userRole=free';
                }
              }
            }
          } else {
            console.warn('⚠️ No token received from Clerk');
          }
        } catch (error) {
          console.error('❌ Error saving token:', error);
        }
      };

      saveTokenAndCheckRole();
    }
  }, [isLoaded, user, getToken]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
