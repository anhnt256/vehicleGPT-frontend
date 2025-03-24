/**
 * Deletes a Todo item using GraphQL mutation
 * @param id - The ID of the todo to delete
 * @param userRole - User role for token (free/paid)
 * @returns Promise with boolean indicating success
 */
export async function deleteTodo(id: string, token: string): Promise<boolean> {
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
    const result = await response.json();

    return result.data?.deleteTodo === true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}
