<template>
  <div class="recipes-list-container">
    <RecipeSearchBar />
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
import RecipeSearchBar from './RecipeSearchBar.vue';
import RecipeBox from './RecipeBox.vue';
import { useRecipeListStore } from '../stores/useRecipeListStore';

const store = useRecipeListStore();

onMounted(() => {
  store.fetchRecipes();
});
</script>

<style scoped>
.recipes-list-container {
  width: 100%;
  padding: 1rem;
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
