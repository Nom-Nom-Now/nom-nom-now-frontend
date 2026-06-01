<template>
  <div class="shopping-lists-container">
    <aside class="shopping-list-sidebar">
      <div v-if="store.isLoading" class="status">
        {{ t('feature.shoppingLists.loading') }}
      </div>
      <div v-else-if="store.shoppingLists.length === 0" class="status">
        {{ t('feature.shoppingLists.empty') }}
      </div>
      <template v-else>
        <RouterLink
          v-for="shoppingList in store.shoppingLists"
          :key="shoppingList.id"
          :to="`/shopping-lists/${shoppingList.id}`"
          class="shopping-list-link"
          active-class="shopping-list-link-active"
        >
          <span class="shopping-list-week">
            {{ formatWeek(shoppingList.weekStart) }}
          </span>
          <span class="shopping-list-meta">
            {{
              t('feature.shoppingLists.itemCount', {
                count: shoppingList.itemCount,
              })
            }}
          </span>
          <span class="shopping-list-meta">
            {{ formatCreatedAt(shoppingList.createdAt) }}
          </span>
        </RouterLink>
      </template>
    </aside>

    <section class="shopping-list-detail">
      <div v-if="store.error" class="error-message">
        {{ store.error }}
      </div>
      <div v-else-if="store.isDetailLoading" class="status">
        {{ t('feature.shoppingLists.loadingDetail') }}
      </div>
      <div v-else-if="store.selectedShoppingList" class="detail-content">
        <div class="detail-header">
          <div>
            <h2>{{ formatWeek(store.selectedShoppingList.weekStart) }}</h2>
            <p>{{ formatCreatedAt(store.selectedShoppingList.createdAt) }}</p>
          </div>
          <div class="detail-actions">
            <span class="item-count">
              {{
                t('feature.shoppingLists.itemCount', {
                  count: store.selectedShoppingList.items.length,
                })
              }}
            </span>
            <md-icon-button
              type="button"
              class="delete-list-button"
              :disabled="store.isDeleting"
              :aria-label="t('feature.shoppingLists.delete')"
              :title="t('feature.shoppingLists.delete')"
              @click="openDeleteDialog"
            >
              <md-icon>delete</md-icon>
            </md-icon-button>
          </div>
        </div>

        <ul class="items-list">
          <li
            v-for="item in store.selectedShoppingList.items"
            :key="`${item.ingredientName}-${item.unit}`"
            class="shopping-item"
          >
            <span>{{ item.ingredientName }}</span>
            <strong
              >{{ formatQuantity(item.quantity) }}
              {{ formatUnit(item.unit) }}</strong
            >
          </li>
        </ul>
      </div>
      <div v-else class="status">
        {{ t('feature.shoppingLists.selectList') }}
      </div>
    </section>

    <md-dialog
      :open="isDeleteDialogOpen"
      @closed="isDeleteDialogOpen = false"
    >
      <div slot="headline">
        {{ t('feature.shoppingLists.deleteDialogTitle') }}
      </div>
      <div slot="content">
        {{ t('feature.shoppingLists.deleteDialogDescription') }}
      </div>
      <div slot="actions">
        <md-text-button
          type="button"
          :disabled="store.isDeleting"
          @click="closeDeleteDialog"
        >
          {{ t('global.cancel') }}
        </md-text-button>
        <md-text-button
          type="button"
          class="confirm-delete-button"
          :disabled="store.isDeleting"
          @click="confirmDeleteShoppingList"
        >
          {{ t('global.delete') }}
        </md-text-button>
      </div>
    </md-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useShoppingListStore } from '../stores/useShoppingListStore';
import {
  formatCreatedAt as formatCreatedAtValue,
  formatWeekRange,
} from '../../../../formatters/dateFormatters';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const store = useShoppingListStore();
const isDeleteDialogOpen = ref(false);

onMounted(async () => {
  await store.loadShoppingLists();
  await loadSelectedList();
});

watch(
  () => route.params.id,
  async () => {
    await loadSelectedList();
  },
);

async function loadSelectedList() {
  const id = route.params.id;

  if (typeof id === 'string' && id.trim() !== '') {
    await store.loadShoppingList(id);
    return;
  }

  store.clearSelectedShoppingList();
}

function openDeleteDialog() {
  if (store.selectedShoppingList) {
    isDeleteDialogOpen.value = true;
  }
}

function closeDeleteDialog() {
  if (!store.isDeleting) {
    isDeleteDialogOpen.value = false;
  }
}

async function confirmDeleteShoppingList() {
  const id = store.selectedShoppingList?.id;
  if (!id) {
    isDeleteDialogOpen.value = false;
    return;
  }

  await store.deleteShoppingList(id);
  isDeleteDialogOpen.value = false;
  await router.push('/shopping-lists');
}

function formatWeek(weekStart: string) {
  return formatWeekRange(weekStart, locale.value);
}

function formatCreatedAt(createdAt: string) {
  return formatCreatedAtValue(createdAt, locale.value);
}

function formatQuantity(quantity: number) {
  return new Intl.NumberFormat(locale.value, {
    maximumFractionDigits: 2,
  }).format(quantity);
}

function formatUnit(unit: string) {
  return t(`feature.recipes.createRecipe.ingredients.unitValues.${unit}`);
}
</script>

<style scoped>
.shopping-lists-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 1rem;
  display: grid;
  grid-template-columns: minmax(16rem, 22rem) minmax(0, 1fr);
  gap: 1rem;
  box-sizing: border-box;
}

.shopping-list-sidebar,
.shopping-list-detail {
  min-height: 0;
  overflow: auto;
  border-radius: 8px;
  background-color: var(--md-sys-color-surface-container-lowest);
}

.shopping-list-sidebar {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shopping-list-link {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.875rem;
  border-radius: 8px;
  color: var(--md-sys-color-on-surface);
  text-decoration: none;
}

.shopping-list-link:hover,
.shopping-list-link-active {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.shopping-list-week {
  font-weight: 600;
}

.shopping-list-meta {
  font-size: 0.875rem;
  color: var(--md-sys-color-on-surface-variant);
}

.shopping-list-link-active .shopping-list-meta {
  color: var(--md-sys-color-on-secondary-container);
}

.shopping-list-detail {
  padding: 1.5rem;
}

.detail-content {
  max-width: 48rem;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-header h2 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
}

.detail-header p {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
}

.item-count {
  white-space: nowrap;
  color: var(--md-sys-color-on-surface-variant);
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-list-button {
  color: var(--md-sys-color-error);
}

.items-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shopping-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.status {
  padding: 2rem;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
}

.error-message {
  margin: 2rem auto;
  max-width: 32rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  text-align: center;
  font-weight: 500;
}

@media (max-width: 760px) {
  .shopping-lists-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .shopping-list-sidebar {
    max-height: 14rem;
  }

  .detail-header {
    flex-direction: column;
  }
}
</style>
