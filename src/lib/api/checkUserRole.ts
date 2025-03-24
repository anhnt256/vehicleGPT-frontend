import { callApi } from '@/lib/utils/apiHelper';

/**
 * Gọi API kiểm tra role của người dùng dựa trên email
 * @param email - Email của người dùng đăng nhập qua Clerk
 * @returns Promise với thông tin role và các dữ liệu khác
 */
export async function checkUserRole(email: string): Promise<{ role: string; isPaid: boolean }> {
  try {
    const endpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';

    // Sử dụng helper function để xử lý API call và 401
    return await callApi<{ role: string; isPaid: boolean }>(
      `${endpoint}/users/check-user-role?email=${encodeURIComponent(email)}`
    );
  } catch (error) {
    console.error('Error checking user role:', error);
    // Không trả về giá trị mặc định nếu xác thực lỗi - để xử lý ở caller
    throw error;
  }
}
