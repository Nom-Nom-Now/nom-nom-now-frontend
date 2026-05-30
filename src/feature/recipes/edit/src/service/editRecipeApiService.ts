import type { Recipe } from '../../../list/src/shared/types.ts';

/**
 * Sendet ein Update für ein bestehendes Rezept an das Backend.
 * Entspricht dem Controller-Endpunkt mit MediaType.MULTIPART_FORM_DATA_VALUE
 */
export async function updateRecipe(id: number, recipeData: any, imageFile?: File | null): Promise<Recipe> {
  const formData = new FormData();

  const recipeBlob = new Blob([JSON.stringify(recipeData)], {
    type: 'application/json',
  });
  formData.append('recipe', recipeBlob);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`/api/recipes/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Fehler beim Aktualisieren des Rezepts (Status: ${response.status})`);
  }

  return await response.json();
}