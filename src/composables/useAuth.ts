import { ref } from 'vue';
import { apiFetch, UnauthorizedError } from '../services/apiFetch';

const currentUsername = ref<string | undefined>(undefined);
const currentUserId = ref<string | undefined>(undefined);
const isLoading = ref(false);

export function useAuth() {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';

  async function loadCurrentUser() {
    if (currentUsername.value) return;

    isLoading.value = true;
    try {
      const response = await apiFetch(`${baseUrl}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        currentUsername.value = userData.username || userData.name;
        currentUserId.value = String(userData.id);
      }
    } catch (error) {
      currentUsername.value = undefined;
      currentUserId.value = undefined;
      if (error instanceof UnauthorizedError) {
        return;
      }
      console.error('Fehler beim Laden des angemeldeten Benutzers:', error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    currentUsername,
    currentUserId,
    isLoading,
    loadCurrentUser,
  };
}
