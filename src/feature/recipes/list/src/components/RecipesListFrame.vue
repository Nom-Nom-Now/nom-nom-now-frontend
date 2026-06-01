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
        {{ t('feature.recipes.list.createButton') }}
      </md-filled-button>
    </div>

    <RecipesGridContent
      :recipes="store.recipes"
      :is-loading="store.isLoading"
      :error="store.error"
      :can-load-more="store.canLoadMore"
      :search-query="store.searchQuery"
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
import { onMounted, ref } from 'vue';
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-right: 2rem;
  flex-shrink: 0;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  color: var(--md-sys-color-on-surface);
  white-space: nowrap;
}

.top-bar md-filled-button {
  height: 3rem;
  --md-filled-button-container-shape: 16px;
}
</style>
