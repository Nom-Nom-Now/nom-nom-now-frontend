<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MdLabel from '../../../../../components/MdLabel.vue';
import MdText from '../../../../../components/MdText.vue';
import type { Recipe } from '../../../list/src/shared/types.ts';

defineProps<{
  recipe: Recipe;
}>();

defineEmits<{
  close: [];
  fullscreen: [];
}>();

const { t } = useI18n();

const getCategoryLabel = (name: string) =>
  t(`feature.recipes.createRecipe.categories.${name}`);
</script>

<template>
  <div class="recipe-detail-overlay" @click.self="$emit('close')">
    <div class="recipe-detail-page">

      <div class="detail-header-actions">
        <button class="action-button close-button" @click="$emit('close')">
          <md-icon>close</md-icon>
        </button>

        <button class="action-button fullscreen-button" @click="$emit('fullscreen')">
          <md-icon>fullscreen</md-icon>
        </button>
      </div>

      <MdLabel size="large" class="recipe-title"> {{ recipe.title }} </MdLabel>

      <div class="recipe-image-container">
        <img v-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.title" class="recipe-image" />
        <div v-else class="recipe-image-placeholder"> <md-icon>restaurant</md-icon> </div>
      </div>

      <div v-if="recipe.categories && recipe.categories.length" class="recipe-detail-chips">
        <div v-for="categoryName in recipe.categories" :key="categoryName" class="detail-chip">
          <md-icon class="chip-icon">label</md-icon>
          <span>{{ getCategoryLabel(categoryName) }}</span>
        </div>
      </div>

      <div class="recipe-meta">
        <div class="recipe-time">
          <md-icon>schedule</md-icon>
          <MdText size="medium"> {{ recipe.duration }} </MdText>
        </div>
        <span class="recipe-cost">{{ recipe.cost }}</span>
      </div>

      <MdText class="recipe-description">
        {{ recipe.description || t('feature.recipes.detail.noDescription') }}
      </MdText>

      <div class="recipe-owner-section">
        <md-icon>person</md-icon>
        <MdText size="medium">
          {{ t('feature.recipes.detail.byOwner', { owner: recipe.owner || t('feature.recipes.detail.unknownChef') }) }}
        </MdText>
      </div>

      <div class="recipe-ingredients-section">
        <div class="ingredients-header">
          <md-icon>list</md-icon>
          <MdLabel size="medium">{{ t('feature.recipes.detail.ingredientsTitle') }}</MdLabel>
        </div>

        <ul class="ingredients-list">
          <li v-for="(item, index) in recipe.ingredients" :key="index" class="ingredient-item">
            <span class="ingredient-name"><strong>{{ item.ingredientName }}</strong></span>
            <span class="ingredient-quantity">{{ item.quantity || '' }}</span>
            <span class="ingredient-unit">
              {{ item.unit ? t(`feature.recipes.createRecipe.ingredients.unitValues.${item.unit.toUpperCase()}`) : '' }}
            </span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<style scoped>
.recipe-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.recipe-detail-page {
  position: relative;
  background-color: var(--md-sys-color-surface);
  border-radius: 0.5rem;
  padding: 1rem;
  width: 90%;
  max-width: 24rem;
  max-height: 75vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.detail-header-actions {
  position: absolute;
  top: 0.35rem;
  left: 0.35rem;
  right: 0.35rem;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--md-sys-color-on-surface-variant);
  padding: 0.3rem;
  display: flex;
  border-radius: 50%;
  transition: background-color 0.2s;
  pointer-events: auto;
}

.action-button:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

.action-button md-icon {
  font-size: 1.2rem;
}

.recipe-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.recipe-image-container {
  width: 100%;
  height: 9rem;
  border-radius: 0.35rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-image-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: var(--md-sys-color-surface-container-high);
}

.recipe-image-placeholder md-icon {
  font-size: 2.2rem;
}

.recipe-detail-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

.detail-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--md-sys-color-outline-variant, #c7c7c7);
  border-radius: 6px;
  background: var(--md-sys-color-surface-container-low, #f3f3f3);
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface);
}

.chip-icon {
  font-size: 0.9rem !important;
  color: var(--md-sys-color-primary);
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.recipe-time {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.recipe-time md-icon {
  font-size: 1rem;
}

.recipe-cost {
  font-weight: 500;
}

.recipe-description {
  margin-bottom: 0.5rem;
  line-height: 1.35;
  text-align: left;
  width: 100%;
  font-size: 0.875rem;
}

.recipe-owner-section {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  margin-bottom: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.85rem;
}

.recipe-owner-section md-icon {
  font-size: 1rem;
}

.recipe-ingredients-section {
  width: 100%;
}

.ingredients-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 0.35rem;
}

.ingredients-header md-icon {
  font-size: 1.1rem;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredient-item {
  padding: 4px 0;
  border-bottom: 1px solid var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.08));
  display: grid;
  grid-template-columns: 1fr 3.5rem 3rem;
  font-size: 0.875rem;
}
</style>