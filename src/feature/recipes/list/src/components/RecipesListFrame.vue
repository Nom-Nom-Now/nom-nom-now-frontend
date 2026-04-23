<template>
  <div class="recipes-list-container">
    <div class="top-bar">
      <RecipeSearchBar />
      <md-filled-button type="button" @click="navigateToCreate">{{ t('feature.recipes.list.createButton') }}</md-filled-button>
    </div>
    <div v-if="store.isLoading" class="loading">Laden...</div>
    <div v-else class="recipes-grid">
      <RecipeBox
        v-for="recipe in store.recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import RecipeSearchBar from './RecipeSearchBar.vue';
import RecipeBox from './RecipeBox.vue';
import { useRecipeListStore } from '../stores/useRecipeListStore';

const router = useRouter();
const { t } = useI18n();
const store = useRecipeListStore();

function navigateToCreate() {
  router.push('/recipes/create');
}

onMounted(() => {
  store.fetchRecipes();
});
</script>

<style scoped>
.recipes-list-container {
  width: 100%;
  padding: 1rem;
  overflow: hidden;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-right: 2rem;
}

.top-bar md-filled-button {
  height: 3rem;
  --md-filled-button-container-shape: 16px;
}

.recipes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.loading {
  margin-top: 1rem;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
}
</style>
