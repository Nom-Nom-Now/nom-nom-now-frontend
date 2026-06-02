<template>
  <div class="recipe-box" @click="$emit('select')">
    <div class="recipe-image-container">
      <div v-if="!recipe.imageUrl" class="recipe-image-placeholder">
        <md-icon>restaurant</md-icon>
      </div>
      <img
        v-if="recipe.imageUrl"
        :src="recipe.imageUrl"
        :alt="recipe.title"
        class="recipe-image"
      />
      <span class="recipe-cost">{{ recipe.cost }}</span>
    </div>

    <div class="recipe-body">
      <h3 class="recipe-title">{{ recipe.title }}</h3>

      <div
        v-if="displayCategories.length"
        class="recipe-tags"
        aria-label="Recipe categories"
      >
        <span
          v-for="category in displayCategories"
          :key="category"
          class="tag"
        >
          {{ category }}
        </span>
      </div>

      <p class="recipe-description">{{ recipe.description }}</p>

      <div class="recipe-meta">
        <md-icon>schedule</md-icon>
        <span>{{ recipe.duration }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Recipe } from '../shared/types';

const props = defineProps<{
  recipe: Recipe;
}>();

defineEmits<{
  select: [];
}>();

const { t, te } = useI18n();

const displayCategories = computed(() =>
  props.recipe.categories.slice(0, 2).map((category) => {
    const key = `feature.recipes.createRecipe.categories.${category}`;
    return te(key) ? t(key) : category;
  }),
);
</script>

<style scoped>
.recipe-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--nnn-radius-md);
  background-color: var(--md-sys-color-surface-container-low);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.recipe-box:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: var(--nnn-elevation-2);
}

.recipe-image-container {
  position: relative;
  width: 100%;
  height: 11rem;
  flex: 0 0 11rem;
  background: var(--md-sys-color-surface-container-high);
}

.recipe-image {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.recipe-image-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-image-placeholder md-icon {
  --md-icon-size: 3rem;
}

.recipe-cost {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--nnn-radius-pill);
  background-color: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  font-size: 0.8rem;
  font-weight: 700;
}

.recipe-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  padding: 0.9rem 1rem 1rem;
}

.recipe-title {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--md-sys-color-on-surface);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  max-height: 3.1rem;
  overflow: hidden;
}

.tag {
  padding: 0.2rem 0.55rem;
  border-radius: var(--nnn-radius-xs);
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.1;
}

.recipe-description {
  display: -webkit-box;
  flex: 1;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.45;
  white-space: pre-line;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.875rem;
}

.recipe-meta md-icon {
  --md-icon-size: 18px;
}
</style>
