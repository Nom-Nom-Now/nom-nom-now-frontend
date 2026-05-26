<template>
  <div class="recipes-list-container">
    <div class="top-bar">
      <RecipeSearchBar />
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
import type { Recipe } from '../shared/types';

const router = useRouter();
const { t } = useI18n();
const store = useRecipeListStore();

// 💡 Hier holen wir uns den dynamischen Usernamen aus der App.vue!
const currentUsername = inject<Ref<string | undefined>>('currentUsername');

const fullscreenRecipe = ref<Recipe | null>(null);

function handleOpenFullscreen(recipe: Recipe) {
  fullscreenRecipe.value = recipe;
}

function handleCloseFullscreen() {
  fullscreenRecipe.value = null;
}

// 📝 Event-Handler für das Bearbeiten eines Rezepts
function handleEditRecipe(recipe: Recipe) {
  // TODO: Service anbinden oder zu Edit-Page navigieren
  console.log('edit aufgerufen', recipe);
}

// 📝 Event-Handler für das Löschen eines Rezepts
function handleDeleteRecipe(recipeId: string) {
  // TODO: Lösch-Service anbinden und UI updaten
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
  position: relative; /* Wichtig: Das ist der Anker für das Fullscreen-Element */
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

.top-bar md-filled-button {
  height: 3rem;
  --md-filled-button-container-shape: 16px;
}
</style>
