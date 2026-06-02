<template>
  <div class="recipes-list-container">
    <div class="top-bar">
      <RecipeSearchBar @update:search="handleSearch" />
      <RecipeCategoryFilter @apply-filter="handleCategoryFilter" />
      <div class="filter-toggle">
        <md-switch
          :selected="showMyRecipesOnly"
          @change="handleToggleMyRecipes"
        />
        <span class="filter-label">{{
          t('feature.recipes.list.myRecipesOnly')
        }}</span>
      </div>
      <md-filled-button type="button" @click="navigateToCreate">
        <md-icon slot="icon">add</md-icon>
        {{ t('feature.recipes.list.createButton') }}
      </md-filled-button>
    </div>

    <RecipesGridContent
      :recipes="store.recipes"
      :is-loading="store.isLoading"
      :error="store.error"
      :can-load-more="store.canLoadMore"
      :search-query="store.searchQuery"
      :load-context-key="loadContextKey"
      @load-more="store.fetchNextPage"
      @open-fullscreen="handleOpenFullscreen"
    />

    <RecipeDetailFull
      v-if="fullscreenRecipe"
      :recipe="fullscreenRecipe"
      @close="handleCloseFullscreen"
      @edit="handleEditRecipe"
      @deleted="handleRecipeDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import RecipeSearchBar from './RecipeSearchBar.vue';
import RecipeCategoryFilter from './RecipeCategoryFilter.vue';
import RecipesGridContent from './RecipesGridContent.vue';
import RecipeDetailFull from '../../../detail/src/components/RecipeDetailFull.vue';
import { useRecipeListStore } from '../stores/useRecipeListStore';
import { useAuth } from '../../../../../composables/useAuth';
import type { Recipe } from '../shared/types';
import { useEditRecipeStore } from '../../../edit/src/stores/useEditRecipeStore.ts';

const router = useRouter();
const { t } = useI18n();
const store = useRecipeListStore();
const editStore = useEditRecipeStore();
const { currentUserId } = useAuth();

const fullscreenRecipe = ref<Recipe | null>(null);
const showMyRecipesOnly = ref(false);

const loadContextKey = computed(() => {
  const ownerId = showMyRecipesOnly.value ? currentUserId.value : 'all';
  const categoryIds = store.selectedCategoryIds.join(',');

  return `${ownerId}|${store.searchQuery ?? ''}|${categoryIds}`;
});

function handleToggleMyRecipes(event: Event) {
  const target = event.target as HTMLElement & { selected: boolean };
  showMyRecipesOnly.value = target.selected;
  const ownerId = target.selected ? currentUserId.value : undefined;
  store.fetchRecipes(ownerId, store.searchQuery);
}

function handleSearch(query: string) {
  const ownerId = showMyRecipesOnly.value ? currentUserId.value : undefined;
  store.fetchRecipes(ownerId, query || undefined);
}

function handleCategoryFilter(categoryIds: number[]) {
  store.fetchByCategories(categoryIds);
}

function handleOpenFullscreen(recipe: Recipe) {
  fullscreenRecipe.value = recipe;
}

function handleCloseFullscreen() {
  fullscreenRecipe.value = null;
}

function handleEditRecipe(recipe: Recipe) {
  editStore.fillWithRecipe(recipe);
  router.push(`/recipes/edit/${recipe.id}`);
}

function handleRecipeDeleted() {
  handleCloseFullscreen();
  const ownerId = showMyRecipesOnly.value ? currentUserId.value : undefined;
  store.fetchRecipes(ownerId, store.searchQuery);
}

function navigateToCreate() {
  router.push('/recipes/create');
}

onMounted(() => {
  store.fetchRecipes();
});
</script>

<style scoped>
.recipes-list-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.filter-label {
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  color: var(--md-sys-color-on-surface);
  white-space: nowrap;
}

.top-bar md-filled-button {
  height: 2.75rem;
  --md-filled-button-container-shape: var(--nnn-radius-md);
}

.top-bar md-switch {
  --md-switch-selected-handle-color: var(--md-sys-color-on-primary);
  --md-switch-selected-track-color: var(--md-sys-color-primary);
}

@media (max-width: 860px) {
  .top-bar {
    flex-wrap: wrap;
  }

  .filter-toggle {
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  .recipes-list-container {
    padding: 1rem;
  }

  .top-bar > * {
    flex: 1 1 100%;
  }

  .filter-toggle {
    flex-basis: auto;
  }
}
</style>
