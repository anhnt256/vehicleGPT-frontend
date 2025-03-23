import { Status, TodoStatus } from '@/types';
import { getAuthTokenFromCookie } from '@/lib/utils/cookie';

// Interface cho input của updateTodo
interface UpdateTodoInput {
  id: string; // ID là bắt buộc
  title?: string;
  status?: string;
  isCompleted?: boolean;
  note?: string;
}

// Interface cho response
interface TodoResponse {
  id: string;
  title: string;
  status: string;
  isCompleted: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  email: string;
  orgId: string;
}

/**
 * Updates an existing Todo item using GraphQL mutation
 * @param id - The ID of the todo to update
 * @param token - Authentication token
 * @param data - The data to update (title, status, completed, note)
 * @returns Promise with the updated todo data
 */
export async function updateTodo(
  id: string,
  token: string,
  data: {
    title?: string;
    status?: Status;
    isCompleted?: boolean;
    note?: string;
  }
): Promise<TodoResponse> {
  try {
    const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

    // Cập nhật statusMapping để sử dụng enum dạng viết hoa
    const statusMapping: Record<Status, string> = {
      [TodoStatus.TODO]: 'TODO',
      [TodoStatus.IN_PROGRESS]: 'IN_PROGRESS',
      [TodoStatus.BLOCKED]: 'BLOCKED',
      [TodoStatus.REVIEW]: 'REVIEW',
      [TodoStatus.DONE]: 'DONE',
      [TodoStatus.CANCELED]: 'CANCELED',
    };

    // Construct input object
    const input: UpdateTodoInput = { id };

    // Thêm các trường được cung cấp vào input
    if (data.title !== undefined) {
      input.title = data.title;
    }

    if (data.status !== undefined) {
      input.status = statusMapping[data.status];
    }

    if (data.isCompleted !== undefined) {
      input.isCompleted = data.isCompleted;
    }

    if (data.note !== undefined) {
      input.note = data.note;
    }

    console.log('Dữ liệu cập nhật gửi lên backend:', input);

    // GraphQL mutation đã được cập nhật
    const mutation = `
      mutation UpdateTodo($input: UpdateTodoInput!) {
        updateTodo(input: $input) {
          id
          title
          status
          isCompleted
          note
          createdAt
          updatedAt
          email
          orgId
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: input,
        },
      }),
    });

    const result = await response.json();

    // Kiểm tra lỗi UNAUTHENTICATED
    if (result.errors && result.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) {
      console.error('Token không hợp lệ hoặc đã hết hạn');

      // Xóa token và các cookie liên quan
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Chuyển hướng về trang chủ
      window.location.href = '/';
      throw new Error('Unauthorized');
    }

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.updateTodo;
  } catch (error) {
    console.error('Lỗi khi cập nhật todo:', error);
    throw error;
  }
}
