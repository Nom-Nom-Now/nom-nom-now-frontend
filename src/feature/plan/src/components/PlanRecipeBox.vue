<template>
  <div class="recipe-box">
    <div class="recipe-title">{{ recipe.title }}</div>

    <div class="recipe-image-container">
      <img 
        v-if="recipe.imageUrl" 
        :src="recipe.imageUrl" 
        :alt="recipe.title" 
        class="recipe-image" 
      />
      <div v-else class="recipe-image-placeholder">
        <md-icon>image</md-icon>
      </div>
    </div>

    <div class="recipe-tags">
      <span v-for="category in displayCategories" :key="category" class="tag">
        {{ category }}
      </span>
    </div>

    <div class="recipe-meta">
      <div class="recipe-time">
        <md-icon>schedule</md-icon>
        <span class="time-text">{{ recipe.duration }}</span>
      </div>
      <span class="recipe-cost">{{ recipe.cost }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Recipe } from '../shared/types';

defineProps<{
  recipe: Recipe;
}>();

// TODO: Replace with actual categories from backend
const displayCategories = computed(() => {
  // Placeholder data - remove when backend is connected
  return ['#Tags'];
});
</script>

<style scoped>
.recipe-box {
  background-color: var(--md-sys-color-surface-container-low);
  border-radius: 0.875rem;
  padding: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 16rem;
}

.recipe-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
  text-align: center;
  line-height: 1.2;
  height: 2.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-image-container {
  width: 100%;
  height: 6.5rem;
  border-radius: 0.625rem;
  overflow: hidden;
  flex-shrink: 0;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.recipe-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-image-placeholder md-icon {
  font-size: 2rem;
  --md-icon-size: 2rem;
}

.recipe-tags {
  display: flex;
  gap: 0.375rem;
  justify-content: center;
  flex-wrap: wrap;
  height: 2rem;
  align-items: center;
}

.tag {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: auto;
  padding-top: 0.25rem;
}

.recipe-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-time md-icon {
  font-size: 1rem;
  --md-icon-size: 1rem;
}

.time-text {
  font-size: 0.75rem;
}

.recipe-cost {
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 500;
}
</style>
