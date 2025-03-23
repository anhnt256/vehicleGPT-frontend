import { callApi } from '@/lib/utils/apiHelper';

/**
 * Gọi API cập nhật vai trò người dùng
 * @param email - Email của người dùng
 * @param role - Vai trò mới ('free' hoặc 'paid')
 * @returns Promise với thông tin cập nhật
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUserRole(email: string, role: string = 'paid'): Promise<any> {
  try {
    const endpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';

    // Sử dụng helper function để thực hiện API call
    const data = await callApi(`${endpoint}/users/update-user-role`, 'POST', { email, role });

    return data;
  } catch (error) {
    console.error('Lỗi khi cập nhật vai trò người dùng:', error);
    throw error;
  }
}
