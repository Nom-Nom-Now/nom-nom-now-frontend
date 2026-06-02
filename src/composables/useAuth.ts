import { ref } from 'vue';
import { apiFetch, UnauthorizedError } from '../services/apiFetch';

const currentUsername = ref<string | undefined>(undefined);
const currentUserId = ref<string | undefined>(undefined);
const isLoading = ref(false);

export function useAuth() {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';

  function clearCurrentUser() {
    currentUsername.value = undefined;
    currentUserId.value = undefined;
  }

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
      clearCurrentUser();
      if (error instanceof UnauthorizedError) {
        return;
      }
      console.error('Fehler beim Laden des angemeldeten Benutzers:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    const response = await apiFetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`POST /auth/logout failed (${response.status})`);
    }

    clearCurrentUser();
  }

  async function deleteCurrentAccount() {
    const response = await apiFetch(`${baseUrl}/auth/me`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`DELETE /auth/me failed (${response.status})`);
    }

    clearCurrentUser();
  }

  return {
    currentUsername,
    currentUserId,
    isLoading,
    loadCurrentUser,
    logout,
    deleteCurrentAccount,
    clearCurrentUser,
  };
}
