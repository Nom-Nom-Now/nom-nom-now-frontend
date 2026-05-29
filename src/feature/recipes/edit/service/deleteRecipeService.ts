const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';

async function deleteRequest(path: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`DELETE ${path} failed (${response.status}): ${text}`);
  }
}

export async function deleteRecipe(recipeId: number): Promise<void> {
  return deleteRequest(`/recipes/${recipeId}`);
}