<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Recipe } from '../../../recipes/list/src/shared/types';

defineProps<{
  recipe: Recipe;
}>();

const { t, te } = useI18n();

function formatCategory(category: string) {
  const key = `feature.recipes.createRecipe.categories.${category}`;
  return te(key) ? t(key) : category;
}
</script>

<template>
  <div class="recipe-object-container">
    <div class="recipe-object-title">
      <h2>{{ recipe.title }}</h2>
    </div>
    <div class="recipe-object-picture">
      <img
        v-if="recipe.imageUrl"
        :src="recipe.imageUrl"
        :alt="recipe.title"
        class="recipe-image"
      />
      <md-icon v-else>restaurant</md-icon>
    </div>
    <div class="recipe-object-content">
      <div class="recipe-tags">
        <span v-for="category in recipe.categories" :key="category">
          {{ formatCategory(category) }}
        </span>
      </div>
      <div class="recipe-object-description">{{ recipe.description }}</div>
      <div class="cooking-time">Cooking time: {{ recipe.duration }}</div>
    </div>
  </div>
</template>

<style scoped>
.recipe-object-container {
  background: #e8def8;
  border-radius: 1rem;
  padding: 0.3rem;
  border-color: #888888;
  border-style: solid;
}
.recipe-object-picture {
  background: #894545;
  border-radius: 1rem;
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.recipe-tags span {
  border-radius: 0.5rem;
  background: var(--md-sys-color-surface-container-high);
  padding: 0.25rem 0.5rem;
}
</style>
