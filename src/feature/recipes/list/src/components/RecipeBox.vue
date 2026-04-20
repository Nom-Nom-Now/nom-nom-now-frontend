<template>
  <div class="recipe-box">
    <MdLabel size="large"  class="recipe-title"> {{ recipe.title }} </MdLabel>

    <div class="recipe-image-container">
      <img :src="recipe.imageUrl" :alt="recipe.title" class="recipe-image" />
    </div>

    <div class="recipe-meta">
      <div class="recipe-time">
        <md-icon>schedule</md-icon>
        <MdText size="medium"> {{ recipe.duration  }} </MdText>
      </div>
      <span class="recipe-cost">{{ recipe.cost }}</span>
    </div>
    <MdText class="recipe-description"> {{ recipe.description }} </MdText>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '../shared/types';
import MdLabel from '../../../../../components/MdLabel.vue';
import MdText from '../../../../../components/MdText.vue';

defineProps<{
  recipe: Recipe;
}>();
</script>

<style scoped>
.recipe-box {
  background-color: var(--md-sys-color-inverse-on-surface);
  border-radius: 1rem;
  padding: 0.25rem 1.25rem 1.25rem 1.25rem;
  width: 18rem;
  height: 26rem;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.recipe-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  color: var(--md-sys-color-on-surface);
}

.recipe-image-container {
  width: 100%;
  height: 12rem;
  min-height: 12rem;
  max-height: 12rem;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
}

.recipe-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
}

.recipe-cost {
  font-size: 1rem;
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-description {
  margin: 0;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
  line-height: 1.4;
}
</style>