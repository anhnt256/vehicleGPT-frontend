import { Status, TodoStatus } from '@/types';
import { getAuthTokenFromCookie } from '@/lib/utils/cookie';
import { callApi } from '@/lib/utils/apiHelper';

// Input cho createTodo
interface CreateTodoInput {
  title: string;
  status: string; // Status gửi lên BE sẽ là dạng enum TODO, IN_PROGRESS, ...
  note?: string; // Một note duy nhất khi tạo
}

// Đối tượng Note trong response
interface Note {
  id: string;
  content: string;
  todoId: string;
  createdAt: string;
}

// Response từ createTodo
interface TodoResponse {
  id: string;
  title: string;
  status: string; // Status do người dùng định nghĩa
  createdAt: string;
  updatedAt: string;
  note: string | null;
}

// Response từ getTodo sẽ có notes là array
interface TodoWithNotesResponse {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  notes: Note[]; // API getTodo trả về mảng notes
}

interface CreateTodoResponse {
  createTodo: TodoResponse;
}

/**
 * Creates a new Todo item using GraphQL mutation
 * @param title - The title of the todo
 * @param status - The status of the todo (TO DO, IN PROGRESS, DONE)
 * @param token - The authentication token
 * @param note - Optional note for the todo
 * @returns Promise with the created todo data
 */
export async function createTodo(
  title: string,
  status: Status,
  token: string,
  note?: string
): Promise<TodoResponse> {
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

  // Sử dụng statusMapping để lấy ra giá trị enum tương ứng
  const statusForBackend = statusMapping[status];

  // Construct input object
  const input: CreateTodoInput = {
    title,
    status: statusForBackend,
  };

  // Add note if provided
  if (note) {
    input.note = note;
  }

  console.log('Dữ liệu gửi lên backend:', input);

  // GraphQL mutation
  const mutation = `
    mutation Mutation($input: CreateTodoInput!) {
      createTodo(input: $input) {
        id
        title
        status
        createdAt
        updatedAt
        note
      }
    }
  `;

  try {
    // Execute the GraphQL mutation với token trực tiếp từ tham số
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { input },
      }),
    });

    // Parse the response
    const result = await response.json();

    // Check for errors
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    // Return the created todo
    return result.data.createTodo;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

export async function createTodoWithCookie(data: CreateTodoInput): Promise<any> {
  try {
    const endpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';

    // Sử dụng helper function callApi đã được cập nhật để tự lấy token từ cookie
    const response = await callApi(`${endpoint}/todos`, 'POST', data);

    return response;
  } catch (error) {
    console.error('Lỗi khi tạo todo:', error);
    throw error;
  }
}
