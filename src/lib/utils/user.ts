import { getCookie } from './cookie';

// Kiểm tra xem người dùng có phải là paid user không
export function isPaidUser(): boolean {
  const userRole = getCookie('userRole') || 'free';
  return userRole === 'paid';
}

// Lấy vai trò người dùng
export function getUserRole(): string {
  return getCookie('userRole') || 'free';
} 