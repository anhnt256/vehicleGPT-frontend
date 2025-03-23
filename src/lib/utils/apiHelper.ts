import { getAuthTokenFromCookie } from './cookie';

// Tạo headers chuẩn với token từ cookie
export function getAuthHeaders(): HeadersInit {
  const token = getAuthTokenFromCookie();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

// Xử lý response, kiểm tra 401 và redirect nếu cần
export async function handleApiResponse<T>(response: Response): Promise<T> {
  // Nếu lỗi 401 Unauthorized
  if (response.status === 401) {
    console.error('Unauthorized: Token đã hết hạn hoặc không hợp lệ');

    // Xóa token và các cookie liên quan
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Chuyển hướng về trang chủ
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  // Xử lý các lỗi JSON, check UNAUTHENTICATED từ GraphQL
  const data = await response.json();
  if (
    data.errors &&
    data.errors.some(
      (e: { extensions?: { code: string } }) => e.extensions?.code === 'UNAUTHENTICATED'
    )
  ) {
    console.error('GraphQL UNAUTHENTICATED error');

    // Xóa token và các cookie liên quan
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Chuyển hướng về trang chủ
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return data;
}

// Hàm tổng hợp để thực hiện API call với xử lý lỗi
export async function callApi<T>(
  url: string,
  method: string = 'GET',
  body: object | null = null
): Promise<T> {
  try {
    const options: RequestInit = {
      method,
      headers: getAuthHeaders(),
    };

    console.log('debug', options);

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    return await handleApiResponse<T>(response);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
