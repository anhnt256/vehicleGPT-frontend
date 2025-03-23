import { Status, Task, TodoStatus } from '@/types';
import { callApi } from '@/lib/utils/apiHelper';
import { getAuthTokenFromCookie } from '@/lib/utils/cookie';

// Interface cho Todo item từ API trả về
interface TodoResponse {
  id: string;
  title: string;
  status: string; // Status từ backend dạng enum: TODO, IN_PROGRESS,...
  isCompleted: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface cho response từ GraphQL query
interface GetTodosResponse {
  todos: TodoResponse[];
}

/**
 * Map status từ backend (TODO, IN_PROGRESS) sang frontend (Todo, In Progress)
 */
function mapStatusFromBackend(backendStatus: string): Status {
  const statusMapping: Record<string, Status> = {
    TODO: TodoStatus.TODO,
    IN_PROGRESS: TodoStatus.IN_PROGRESS,
    BLOCKED: TodoStatus.BLOCKED,
    REVIEW: TodoStatus.REVIEW,
    DONE: TodoStatus.DONE,
    CANCELED: TodoStatus.CANCELED,
  };

  return statusMapping[backendStatus] || TodoStatus.TODO;
}

/**
 * Gets all todos for the current user
 * @returns Promise with array of todos
 */
export async function getTodos(): Promise<Task[]> {
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

  // GraphQL query
  const query = `
    query GetTodos {
      todos {
        id
        title
        status
        isCompleted
        note
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const token = getAuthTokenFromCookie();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    // Xử lý 401
    if (response.status === 401) {
      console.error('Unauthorized: Token đã hết hạn hoặc không hợp lệ');
      window.location.href = '/';
      throw new Error('Unauthorized');
    }

    // Parse the response
    const result = await response.json();

    // Check for errors
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    // Map API response to Task objects
    const todos = result.data.todos as TodoResponse[];

    return todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      status: mapStatusFromBackend(todo.status),
      completed: todo.isCompleted,
      createdAt: new Date(todo.createdAt),
      notes: todo.note || undefined,
    }));
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}
