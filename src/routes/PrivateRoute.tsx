import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { checkUserRole } from '@/lib/api/checkUserRole';
import { getAuthTokenFromCookie, setCookie, getCookie, saveAuthToken } from '@/lib/utils/cookie';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const verifyUserRole = async () => {
      // Nếu đã kiểm tra role, không đăng nhập, đang kiểm tra, hoặc không có thông tin user => return
      if (roleChecked || !isSignedIn || !user || isCheckingRole) return;

      // Kiểm tra token xác thực từ cookie
      const authToken = getAuthTokenFromCookie();

      if (!authToken) {
        // Nếu không có token, chuyển về trang đăng nhập
        navigate('/', { replace: true });
        return;
      }

      // Kiểm tra URL hiện tại đã có userRole chưa
      const urlParams = new URLSearchParams(location.search);
      const urlRole = urlParams.get('userRole');

      // Kiểm tra userRole trong cookie
      const savedRole = getCookie('userRole');

      // Nếu URL đã có userRole và cookie cũng có => không cần kiểm tra nữa
      if (urlRole && savedRole && urlRole === savedRole) {
        setRoleChecked(true);
        return;
      }

      try {
        setIsCheckingRole(true);
        // Lấy email từ Clerk user
        const primaryEmail = user.primaryEmailAddress?.emailAddress;

        if (primaryEmail) {
          // Gọi API kiểm tra role - API này sẽ tự lấy token từ cookie
          const userData = await checkUserRole(primaryEmail);

          // Lưu userRole vào cookie thay vì localStorage
          setCookie('userRole', userData.role, 7); // 7 ngày

          // Chỉ redirect nếu URL chưa có userRole hoặc userRole khác với API trả về
          if (!urlRole || urlRole !== userData.role) {
            navigate(`/dashboard?userRole=${userData.role}`, { replace: true });
          }
        }

        setRoleChecked(true);
      } catch (error) {
        console.error('Lỗi khi xác thực vai trò:', error);
        // Mặc định là free user nếu có lỗi
        setCookie('userRole', 'free', 7);

        if (!urlRole || urlRole !== 'free') {
          navigate('/dashboard?userRole=free', { replace: true });
        }

        setRoleChecked(true);
      } finally {
        setIsCheckingRole(false);
      }
    };

    verifyUserRole();
  }, [isSignedIn, user, navigate, isCheckingRole, location.search, roleChecked]);

  useEffect(() => {
    // Điều này sẽ đảm bảo redirect khi đã xác thực
    if (isLoaded && isSignedIn) {
      const authToken = getAuthTokenFromCookie();

      if (!authToken) {
        // Lấy token trực tiếp từ Clerk nếu không tìm thấy trong cookie
        const { getToken } = useAuth();
        getToken().then((token) => {
          if (token) {
            saveAuthToken(token);
          }
        });
      }
    }
  }, [isLoaded, isSignedIn]);

  // Hiển thị loading khi đang kiểm tra
  if (!isLoaded || isCheckingRole) {
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

  // Nếu đã đăng nhập và kiểm tra role xong, hiển thị component con
  return <>{children}</>;
};
