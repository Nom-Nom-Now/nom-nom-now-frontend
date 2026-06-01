<template>
  <div class="category-filter">
    <md-filled-tonal-button class="filter-button" @click="toggleDropdown">
      <md-icon slot="icon">filter_list</md-icon>
      {{ t('feature.recipes.list.filterCategories') }}
      <span v-if="selectedCategoryIds.length > 0" class="badge">{{ selectedCategoryIds.length }}</span>
    </md-filled-tonal-button>

    <div v-if="isDropdownOpen" class="dropdown-overlay" @click="closeDropdown" />

    <div v-if="isDropdownOpen" class="dropdown-panel">
      <div v-if="isLoadingCategories" class="dropdown-loading">{{ t('feature.recipes.list.filterLoading') }}</div>
      <div v-else-if="categoriesError" class="dropdown-error">{{ categoriesError }}</div>
      <div v-else class="dropdown-content">
        <div v-for="superCategory in superCategories" :key="superCategory.id" class="super-category-group">
          <div class="super-category-header" @click="toggleSuperCategory(superCategory.id)">
            <md-icon class="expand-icon">
              {{ expandedSuperCategories.has(superCategory.id) ? 'expand_more' : 'chevron_right' }}
            </md-icon>
            <span class="super-category-name">{{ translateCategoryName(superCategory.name) }}</span>
          </div>

          <div v-if="expandedSuperCategories.has(superCategory.id)" class="category-list">
            <label
              v-for="category in getCategoriesForSuper(superCategory.id)"
              :key="category.id"
              class="category-item"
            >
              <md-checkbox
                :checked="selectedCategoryIds.includes(category.id)"
                @change="toggleCategory(category.id)"
              />
              <span class="category-name">{{ translateCategoryName(category.name) }}</span>
            </label>
          </div>
        </div>

        <div class="dropdown-actions">
          <md-text-button @click="clearSelection">
            {{ t('feature.recipes.list.filterClear') }}
          </md-text-button>
          <md-filled-button @click="applyFilter">
            {{ t('feature.recipes.list.filterApply') }}
          </md-filled-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  fetchCategories,
  type SuperCategoryResponseDto,
  type CategoryResponseDto,
} from '../services/categoryFilterService';

const emit = defineEmits<{
  'apply-filter': [categoryIds: number[]];
}>();

const { t, te } = useI18n();

const isDropdownOpen = ref(false);
const isLoadingCategories = ref(false);
const categoriesError = ref<string | null>(null);
const superCategories = ref<SuperCategoryResponseDto[]>([]);
const categories = ref<CategoryResponseDto[]>([]);
const expandedSuperCategories = ref<Set<number>>(new Set());
const selectedCategoryIds = ref<number[]>([]);

async function loadCategories() {
  if (superCategories.value.length > 0) return;

  isLoadingCategories.value = true;
  categoriesError.value = null;

  try {
    const data = await fetchCategories();
    superCategories.value = data.superCategories;
    categories.value = data.categories;
  } catch (err) {
    categoriesError.value = err instanceof Error ? err.message : t('feature.recipes.list.filterError');
  } finally {
    isLoadingCategories.value = false;
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    loadCategories();
  }
}

function closeDropdown() {
  isDropdownOpen.value = false;
}

function toggleSuperCategory(id: number) {
  if (expandedSuperCategories.value.has(id)) {
    expandedSuperCategories.value.delete(id);
  } else {
    expandedSuperCategories.value.add(id);
  }
}

function getCategoriesForSuper(superCategoryId: number): CategoryResponseDto[] {
  return categories.value.filter((c) => c.superCategoryId === superCategoryId);
}

function translateCategoryName(name: string): string {
  const key = toCamelCaseKey(name);
  const i18nPath = `feature.recipes.createRecipe.categories.${key}`;
  return te(i18nPath) ? t(i18nPath) : name;
}

function toCamelCaseKey(name: string): string {
  // If the name contains spaces, convert "No bake" -> "noBake"
  if (name.includes(' ')) {
    const words = name.trim().split(/\s+/);
    return words
      .map((word, index) =>
        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('');
  }
  // If already camelCase or single word (e.g. "noBake", "vegan"), use as-is with first char lowercase
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function toggleCategory(categoryId: number) {
  const index = selectedCategoryIds.value.indexOf(categoryId);
  if (index >= 0) {
    selectedCategoryIds.value.splice(index, 1);
  } else {
    selectedCategoryIds.value.push(categoryId);
  }
}

function clearSelection() {
  selectedCategoryIds.value = [];
  emit('apply-filter', []);
  closeDropdown();
}

function applyFilter() {
  emit('apply-filter', [...selectedCategoryIds.value]);
  closeDropdown();
}

onMounted(() => {
  // Preload categories so they're ready when the user opens the dropdown
});
</script>

<style scoped>
.category-filter {
  position: relative;
}

.filter-button {
  height: 3rem;
  --md-filled-tonal-button-container-shape: 16px;
}

.badge {
  margin-left: 0.25rem;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 99;
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  margin-top: 0.5rem;
  background: var(--md-sys-color-surface-container);
  border-radius: 16px;
  box-shadow: var(--md-sys-elevation-2, 0 2px 6px rgba(0, 0, 0, 0.15));
  min-width: 280px;
  max-width: 360px;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.75rem;
}

.dropdown-loading,
.dropdown-error {
  padding: 1rem;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
}

.dropdown-error {
  color: var(--md-sys-color-error);
}

.dropdown-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.super-category-group {
  border-radius: 8px;
}

.super-category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  user-select: none;
}

.super-category-header:hover {
  background: var(--md-sys-color-surface-container-high);
}

.expand-icon {
  font-size: 1.25rem;
  color: var(--md-sys-color-on-surface-variant);
}

.super-category-name {
  font-family: var(--md-sys-typescale-title-small-font);
  font-size: var(--md-sys-typescale-title-small-size);
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.category-list {
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  border-radius: 8px;
}

.category-item:hover {
  background: var(--md-sys-color-surface-container-high);
}

.category-name {
  font-family: var(--md-sys-typescale-body-medium-font);
  font-size: var(--md-sys-typescale-body-medium-size);
  color: var(--md-sys-color-on-surface);
}

.dropdown-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}
</style>

