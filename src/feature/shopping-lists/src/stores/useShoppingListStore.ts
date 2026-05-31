import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  fetchShoppingList,
  fetchShoppingLists,
  type ShoppingListDto,
  type ShoppingListSummaryDto,
} from '../services/ShoppingListService';
import type { ShoppingList, ShoppingListSummary } from '../shared/types';

export const useShoppingListStore = defineStore('shoppingLists', () => {
  const shoppingLists = ref<ShoppingListSummary[]>([]);
  const selectedShoppingList = ref<ShoppingList | null>(null);
  const isLoading = ref(false);
  const isDetailLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadShoppingLists() {
    isLoading.value = true;
    error.value = null;

    try {
      const summaries = await fetchShoppingLists();
      shoppingLists.value = summaries.map(mapSummary);
    } catch (loadError) {
      error.value =
        loadError instanceof Error
          ? loadError.message
          : 'Shopping lists could not be loaded.';
      shoppingLists.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function loadShoppingList(id: string) {
    isDetailLoading.value = true;
    error.value = null;

    try {
      selectedShoppingList.value = mapShoppingList(await fetchShoppingList(id));
    } catch (loadError) {
      error.value =
        loadError instanceof Error
          ? loadError.message
          : 'Shopping list could not be loaded.';
      selectedShoppingList.value = null;
    } finally {
      isDetailLoading.value = false;
    }
  }

  return {
    shoppingLists,
    selectedShoppingList,
    isLoading,
    isDetailLoading,
    error,
    loadShoppingLists,
    loadShoppingList,
  };
});

function mapSummary(summary: ShoppingListSummaryDto): ShoppingListSummary {
  return {
    id: String(summary.id),
    weekStart: summary.weekStart,
    createdAt: summary.createdAt,
    itemCount: summary.itemCount,
  };
}

function mapShoppingList(shoppingList: ShoppingListDto): ShoppingList {
  return {
    id: String(shoppingList.id),
    weekStart: shoppingList.weekStart,
    createdAt: shoppingList.createdAt,
    items: shoppingList.items,
  };
}
