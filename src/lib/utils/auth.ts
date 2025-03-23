import { useAuth } from '@clerk/clerk-react';
import { saveAuthToken, getAuthTokenFromCookie } from './cookie';

/**
 * Lấy JWT token từ Clerk, thêm thông tin userRole
 * @param userRole - Vai trò người dùng (free/paid)
 * @returns Promise với JWT token chứa userId, userRole, và thời gian hết hạn
 */
export function useAuthToken() {
  const { getToken } = useAuth();

  const getAuthToken = async () => {
    try {
      // Lấy token với custom claims
      const token = await getToken({
        template: 'SuperTodo',
      });

      return token;
    } catch (error) {
      console.error('Lỗi khi lấy auth token:', error);
      return null;
    }
  };

  return { getAuthToken };
}

/**
 * Lấy JWT token cho API request
 * Chỉ sử dụng cookie vì không thể sử dụng React hooks
 */
export async function getAPIToken(): Promise<string> {
  // Sử dụng cookie thay vì localStorage
  return getAuthTokenFromCookie() || 'test_token';
}

// Hàm này đã được cập nhật để dùng cookie
export function getAuthToken(): string {
  return getAuthTokenFromCookie();
}

// Thay thế localStorage.setItem bằng saveAuthToken
export function setAuthToken(token: string): void {
  saveAuthToken(token);
}

// Xóa hàm này nếu nó chỉ là bản sao của hàm getAuthToken
export function getAPITokenFromStorage(): string {
  return getAuthTokenFromCookie();
}
