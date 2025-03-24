import { GraphQLResponse } from '@/types/graphql';

/**
 * Deletes a Todo item using GraphQL mutation
 * @param id - The ID of the todo to delete
 * @param token - Authentication token
 * @returns Promise with result and any errors
 */
export async function deleteTodo(
  id: string,
  token: string
): Promise<{ success?: boolean; errors?: string[] }> {
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

  // GraphQL mutation
  const mutation = `
    mutation DeleteTodo($deleteTodoId: String!) {
      deleteTodo(id: $deleteTodoId)
    }
  `;

  try {
    // Execute the GraphQL mutation
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { deleteTodoId: id },
      }),
    });

    // Parse the response
    const result = (await response.json()) as GraphQLResponse<boolean>;

    // Handle errors
    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((err) =>
        err.extensions?.details?.length ? err.extensions.details[0] : err.message
      );
      return { errors: errorMessages };
    }

    return { success: result.data?.deleteTodo === true };
  } catch (error) {
    console.error('Error deleting todo:', error);
    return { errors: [(error as Error).message] };
  }
}
