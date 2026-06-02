<template>
  <div class="header-container">
    <div class="page-title">{{ pageTitle }}</div>

    <div v-if="currentUsername" class="account-menu-container">
      <button
        id="account-menu-anchor"
        type="button"
        class="user-profile"
        :aria-label="t('feature.account.menuLabel', { name: currentUsername })"
        :aria-expanded="isAccountMenuOpen"
        aria-haspopup="menu"
        @click="toggleAccountMenu"
      >
        <span class="user-name">{{ currentUsername }}</span>
        <span class="avatar-badge">
          <md-icon>account_circle</md-icon>
        </span>
      </button>

      <md-menu
        class="account-action-menu"
        anchor="account-menu-anchor"
        :open="isAccountMenuOpen"
        @closed="isAccountMenuOpen = false"
      >
        <md-menu-item :disabled="isAccountActionPending" @click="handleLogout">
          <md-icon slot="start">logout</md-icon>
          <div slot="headline">{{ t('feature.account.logout') }}</div>
        </md-menu-item>
        <md-menu-item
          class="danger-menu-item"
          :disabled="isAccountActionPending"
          @click="openDeleteDialog"
        >
          <md-icon slot="start">delete</md-icon>
          <div slot="headline">{{ t('feature.account.deleteAccount') }}</div>
        </md-menu-item>
      </md-menu>

      <p
        v-if="accountActionError && !isDeleteDialogOpen"
        class="account-action-popover"
        role="alert"
      >
        {{ accountActionError }}
      </p>

      <md-dialog
        class="account-delete-dialog"
        :open="isDeleteDialogOpen"
        @closed="isDeleteDialogOpen = false"
      >
        <div slot="headline">
          {{ t('feature.account.deleteDialogTitle') }}
        </div>
        <div slot="content" class="delete-dialog-content">
          <p>{{ t('feature.account.deleteDialogDescription') }}</p>
          <p v-if="accountActionError" class="account-action-error">
            {{ accountActionError }}
          </p>
        </div>
        <div slot="actions">
          <md-text-button
            type="button"
            :disabled="isDeletingAccount"
            @click="closeDeleteDialog"
          >
            {{ t('global.cancel') }}
          </md-text-button>
          <md-text-button
            type="button"
            class="confirm-delete-button"
            :disabled="isDeletingAccount"
            @click="confirmDeleteAccount"
          >
            {{ t('feature.account.deleteAccount') }}
          </md-text-button>
        </div>
      </md-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import { useAuth } from '../../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const { currentUsername, logout, deleteCurrentAccount } = useAuth();
const isAccountMenuOpen = ref(false);
const isLoggingOut = ref(false);
const isDeletingAccount = ref(false);
const isDeleteDialogOpen = ref(false);
const accountActionError = ref<string | null>(null);

const isAccountActionPending = computed(
  () => isLoggingOut.value || isDeletingAccount.value,
);

const pageTitle = computed(() => {
  const key = route.meta.titleKey as string | undefined;
  return key ? t(key) : 'Nom Nom Now';
});

function toggleAccountMenu() {
  accountActionError.value = null;
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
}

async function handleLogout() {
  if (isAccountActionPending.value) return;

  isAccountMenuOpen.value = false;
  accountActionError.value = null;
  isLoggingOut.value = true;

  try {
    await logout();
    await router.push('/');
  } catch (error) {
    accountActionError.value = t('feature.account.logoutError');
    console.error('Fehler beim Abmelden:', error);
  } finally {
    isLoggingOut.value = false;
  }
}

function openDeleteDialog() {
  if (isAccountActionPending.value) return;

  isAccountMenuOpen.value = false;
  accountActionError.value = null;
  isDeleteDialogOpen.value = true;
}

function closeDeleteDialog() {
  if (!isDeletingAccount.value) {
    isDeleteDialogOpen.value = false;
  }
}

async function confirmDeleteAccount() {
  if (isDeletingAccount.value) return;

  accountActionError.value = null;
  isDeletingAccount.value = true;

  try {
    await deleteCurrentAccount();
    isDeleteDialogOpen.value = false;
    await router.push('/');
  } catch (error) {
    accountActionError.value = t('feature.account.deleteError');
    console.error('Fehler beim Löschen des Kontos:', error);
  } finally {
    isDeletingAccount.value = false;
  }
}
</script>

<style scoped>
.header-container {
  position: relative;
  z-index: 20000;
  height: 4.5rem;
  background-color: var(--md-sys-color-surface);
  padding: 0 2rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.page-title {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  font-size: var(--md-sys-typescale-title-large-size);
  line-height: var(--md-sys-typescale-title-large-line-height);
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
  padding: 0.4rem 0 1rem;
}

.account-menu-container {
  position: relative;
  display: flex;
  z-index: 20001;
}

.account-action-menu,
.account-delete-dialog {
  z-index: 20002;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 2.5rem;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  border: 0;
  border-radius: var(--nnn-radius-pill);
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.user-profile:hover,
.user-profile:focus-visible {
  background-color: var(--md-sys-color-surface-container-high);
}

.user-profile:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.user-name {
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
}

.avatar-badge {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  --md-icon-size: 26px;
}

.danger-menu-item {
  color: var(--md-sys-color-error);
}

.delete-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.delete-dialog-content p {
  margin: 0;
}

.account-action-error {
  color: var(--md-sys-color-error);
}

.account-action-popover {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 20003;
  width: max-content;
  max-width: 18rem;
  margin: 0;
  padding: 0.625rem 0.75rem;
  border-radius: var(--nnn-radius-xs);
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  box-shadow: var(--nnn-elevation-2);
}

.confirm-delete-button {
  color: var(--md-sys-color-error);
}

@media (max-width: 760px) {
  .header-container {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 1.125rem;
  }

  .user-name {
    display: none;
  }
}
</style>
