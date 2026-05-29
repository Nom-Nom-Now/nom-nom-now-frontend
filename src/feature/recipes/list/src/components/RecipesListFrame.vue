<template>
  <div class="recipes-list-container">
    <div class="top-bar">
      <RecipeSearchBar />
      <div class="filter-toggle">
        <md-switch
          :selected="showMyRecipesOnly"
          @change="handleToggleMyRecipes"
        />
        <span class="filter-label">{{ t('feature.recipes.list.myRecipesOnly') }}</span>
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
      @load-more="store.fetchNextPage"
      @open-fullscreen="handleOpenFullscreen"
    />

    <RecipeDetailFull
      v-if="fullscreenRecipe"
      :recipe="fullscreenRecipe"
      :current-username="currentUsername?.valueOf()"
      @close="handleCloseFullscreen"
      @edit="handleEditRecipe"
      @delete="handleDeleteRecipe"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import RecipeSearchBar from './RecipeSearchBar.vue';
import RecipesGridContent from './RecipesGridContent.vue';
import RecipeDetailFull from '../../../detail/src/components/RecipeDetailFull.vue';
import { useRecipeListStore } from '../stores/useRecipeListStore';
import { useAuth } from '../../../../../composables/useAuth';
import type { Recipe } from '../shared/types';

const router = useRouter();
const { t } = useI18n();
const store = useRecipeListStore();
const { currentUserId } = useAuth();

const currentUsername = inject<Ref<string | undefined>>('currentUsername');

const fullscreenRecipe = ref<Recipe | null>(null);
const showMyRecipesOnly = ref(false);

function handleToggleMyRecipes(event: Event) {
  const target = event.target as HTMLElement & { selected: boolean };
  showMyRecipesOnly.value = target.selected;
  const ownerId = target.selected ? currentUserId.value : undefined;
  store.fetchRecipes(ownerId);
}

function handleOpenFullscreen(recipe: Recipe) {
  fullscreenRecipe.value = recipe;
}

function handleCloseFullscreen() {
  fullscreenRecipe.value = null;
}

function handleEditRecipe(recipe: Recipe) {
  console.log('edit aufgerufen', recipe);
}

function handleDeleteRecipe(recipeId: string) {
  console.log('delete aufgerufen für Rezept-ID:', recipeId);
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
