import { ref } from 'vue';

const currentUsername = ref<string | undefined>(undefined);
const currentUserId = ref<string | undefined>(undefined);
const isLoading = ref(false);

export function useAuth() {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';

  async function loadCurrentUser() {
    if (currentUsername.value) return;

    isLoading.value = true;
    try {
      const response = await fetch(`${baseUrl}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        currentUsername.value = userData.username || userData.name;
        currentUserId.value = String(userData.id);
      }
    } catch (error) {
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
