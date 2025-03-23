// Hàm để lấy giá trị cookie
export function getCookie(name: string): string | null {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return cookieValue ? decodeURIComponent(cookieValue) : null;
}

// Hàm để đặt cookie với expiry time
export function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Hàm để xóa cookie
export function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Lưu token vào cookie
export function saveAuthToken(token: string): void {
  setCookie('auth_token', token, 7); // Lưu trong 7 ngày
}

// Lấy token từ cookie
export function getAuthTokenFromCookie(): string {
  return getCookie('auth_token') || '';
}
