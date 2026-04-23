<template>
  <div class="recipes-grid-scroll">
    <div v-if="isLoading" class="loading">Laden...</div>
    <div v-else class="recipes-grid">
      <RecipeBox
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RecipeBox from './RecipeBox.vue';
import type { Recipe } from '../shared/types';

defineProps<{
  recipes: Recipe[];
  isLoading: boolean;
}>();
</script>

<style scoped>
.recipes-grid-scroll {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
}

.recipes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
}

.loading {
  margin-top: 1rem;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
}
</style>
