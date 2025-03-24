import { Status, TodoStatus } from '@/types';
import { GraphQLResponse } from '@/types/graphql';

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
 * @returns Promise with the updated todo data and any errors
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
): Promise<{ data?: TodoResponse; errors?: string[] }> {
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
      // Map status và thêm check để tránh undefined
      input.status = statusMapping[data.status] || String(data.status).toUpperCase();
    }

    if (data.isCompleted !== undefined) {
      input.isCompleted = data.isCompleted;
    }

    if (data.note !== undefined) {
      input.note = data.note;
    }

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

    const result = (await response.json()) as GraphQLResponse<TodoResponse>;

    // Handle GraphQL errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((err) =>
        err.extensions?.details?.length ? err.extensions.details[0] : err.message
      );
      return { errors: errorMessages };
    }

    // Handle UNAUTHENTICATED errors
    if (result.errors && result.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) {
      console.error('Token invalid or expired');

      // Xóa token và các cookie liên quan
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Chuyển hướng về trang chủ
      window.location.href = '/';
      return { errors: ['Token invalid or expired'] };
    }

    return { data: result.data?.updateTodo };
  } catch (error) {
    console.error('Lỗi khi cập nhật todo:', error);
    return { errors: [(error as Error).message] };
  }
}
