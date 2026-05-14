<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import MdLabel from '../../../../../../components/MdLabel.vue';
import { loadCategoryLists } from '../../services/categoryMapper';
import type {
  CategoryOption,
  SuperCategoryOption,
} from '../../services/categoryApiTypes.ts';
import type { ComponentPublicInstance } from 'vue';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore.ts';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type TextFieldElement = HTMLElement & { value: string };

const store = useCreateRecipeStore();

const selectedIds = ref<number[]>([...store.categoryIds]);

const categories = ref<CategoryOption[]>([]);
const superCategories = ref<SuperCategoryOption[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchTerms = ref<Record<number, string>>({});
const openDropdowns = ref<Record<number, boolean>>({});

const selectedCategories = computed(() =>
  categories.value.filter((category) =>
    selectedIds.value.includes(category.id),
  ),
);

const getCategoryLabel = (name: string) =>
  t(`feature.recipes.createRecipe.categories.${name}`);

const getSuperCategoryLabel = (name: string) =>
  t(`feature.recipes.createRecipe.categories.${name}`);

const getSearchTerm = (superCategoryId: number) =>
  searchTerms.value[superCategoryId] ?? '';

const setDropdownOpen = (superCategoryId: number, isOpen: boolean) => {
  openDropdowns.value = {
    ...openDropdowns.value,
    [superCategoryId]: isOpen,
  };
};

const isDropdownOpen = (superCategoryId: number) =>
  openDropdowns.value[superCategoryId] ?? false;

const onSearchInput = (superCategoryId: number, event: Event) => {
  const target = event.target as TextFieldElement;

  searchTerms.value = {
    ...searchTerms.value,
    [superCategoryId]: target.value ?? '',
  };

  setDropdownOpen(superCategoryId, true);
};

const getFilteredCategories = (superCategoryId: number) => {
  const term = getSearchTerm(superCategoryId).trim().toLowerCase();

  return categories.value.filter((category) => {
    const matchesSuperCategory = category.superCategoryId === superCategoryId;
    const translatedName = getCategoryLabel(category.name).toLowerCase();
    const matchesSearch = !term || translatedName.includes(term);

    return matchesSuperCategory && matchesSearch;
  });
};

const toggleCategory = (id: number) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((value) => value !== id)
    : [...selectedIds.value, id];

  store.setCategoryIds([...selectedIds.value]);
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;

  for (const superCategory of superCategories.value) {
    const dropdown = dropdownRefs.value[superCategory.id];

    if (dropdown && !dropdown.contains(target)) {
      openDropdowns.value = {
        ...openDropdowns.value,
        [superCategory.id]: false,
      };
    }
  }
};

const dropdownRefs = ref<Record<number, HTMLElement | null>>({});

const setDropdownRef =
  (id: number) => (element: Element | ComponentPublicInstance | null) => {
    dropdownRefs.value[id] = element as HTMLElement | null;
  };

const removeCategory = (id: number) => {
  selectedIds.value = selectedIds.value.filter((value) => value !== id);
  store.setCategoryIds([...selectedIds.value]);
};

const isChecked = (id: number) => selectedIds.value.includes(id);

const fetchCategories = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await loadCategoryLists();
    categories.value = data.categories;
    superCategories.value = data.superCategories;

    searchTerms.value = Object.fromEntries(
      data.superCategories.map((superCategory) => [superCategory.id, '']),
    );

    openDropdowns.value = Object.fromEntries(
      data.superCategories.map((superCategory) => [superCategory.id, false]),
    );
  } catch (err) {
    console.error(err);
    error.value = t('feature.recipes.createRecipe.categories.loadError');
  } finally {
    loading.value = false;
  }
  selectedIds.value = [...store.categoryIds];
};

onMounted(() => {
  fetchCategories();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="frame">
    <div>
      <md-tabs>
        <MdLabel size="large">
          {{ t('feature.recipes.createRecipe.categories.title') }}
        </MdLabel>
      </md-tabs>

      <div v-if="selectedCategories.length" class="selected-chips">
        <div
          v-for="category in selectedCategories"
          :key="category.id"
          class="chip"
        >
          <span>{{ getCategoryLabel(category.name) }}</span>
          <button
            type="button"
            class="chip-remove"
            @click.stop="removeCategory(category.id)"
          >
            ×
          </button>
        </div>
      </div>

      <div v-if="loading" class="empty-state">
        {{ t('feature.recipes.createRecipe.categories.loading') }}
      </div>

      <div v-else-if="error" class="empty-state">
        {{ error }}
      </div>

      <div v-else class="super-category-list">
        <div
          v-for="superCategory in superCategories"
          :key="superCategory.id"
          class="super-category-block"
        >
          <MdLabel class="super-category-title">
            {{ getSuperCategoryLabel(superCategory.name) }}
          </MdLabel>

          <div class="search-dropdown" :ref="setDropdownRef(superCategory.id)">
            <md-outlined-text-field
              class="search-field"
              :label="t('feature.recipes.createRecipe.categories.selectLabel')"
              :value="getSearchTerm(superCategory.id)"
              @focus="setDropdownOpen(superCategory.id, true)"
              @input="onSearchInput(superCategory.id, $event)"
            />

            <div v-if="isDropdownOpen(superCategory.id)" class="dropdown-panel">
              <div
                v-for="category in getFilteredCategories(superCategory.id)"
                :key="category.id"
                class="dropdown-option"
                @mousedown.prevent="toggleCategory(category.id)"
              >
                <md-checkbox :checked="isChecked(category.id)" tabindex="-1" />
                <span>{{ getCategoryLabel(category.name) }}</span>
              </div>

              <div
                v-if="getFilteredCategories(superCategory.id).length === 0"
                class="empty-state"
              >
                {{ t('feature.recipes.createRecipe.categories.empty') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  --select-width: 20%;
}

.search-field {
  width: 100%;
}

.search-dropdown {
  position: relative;
  width: 100%;
}

.super-category-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

@media (min-width: 40rem) {
  .super-category-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .super-category-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 90rem) {
  .super-category-list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  background: white;
  border: 0.0625rem solid #c7c7c7;
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);
  max-height: 16rem;
  overflow-y: auto;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.dropdown-option:hover {
  background: #f5f5f5;
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border: 0.0625rem solid #c7c7c7;
  border-radius: 999rem;
  background: #f3f3f3;
  font-size: 0.9rem;
}

.chip-remove {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

.super-category-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.super-category-title {
  margin-left: 0.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  color: #666;
}

.empty-state {
  padding: 0.75rem 1rem;
  color: #666;
  font-size: 0.875rem;
}
</style>
