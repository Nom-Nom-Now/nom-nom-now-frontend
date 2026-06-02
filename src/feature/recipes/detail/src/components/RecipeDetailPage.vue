<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Recipe } from '../../../list/src/shared/types.ts';

defineProps<{
  recipe: Recipe;
}>();

defineEmits<{
  close: [];
  fullscreen: [];
}>();

const { t, te } = useI18n();

const getCategoryLabel = (name: string) => {
  const key = `feature.recipes.createRecipe.categories.${name}`;
  return te(key) ? t(key) : name;
};

const getUnitLabel = (unit: string | null) => {
  if (!unit) return '';
  const key = `feature.recipes.createRecipe.ingredients.unitValues.${unit.toUpperCase()}`;
  return te(key) ? t(key) : unit;
};
</script>

<template>
  <div class="recipe-detail-overlay" @click.self="$emit('close')">
    <article class="recipe-detail-card">
      <div class="detail-hero">
        <div v-if="!recipe.imageUrl" class="detail-placeholder">
          <md-icon>restaurant</md-icon>
        </div>
        <img
          v-if="recipe.imageUrl"
          :src="recipe.imageUrl"
          :alt="recipe.title"
          class="detail-image"
        />

        <button
          class="hero-button hero-button-left"
          type="button"
          :title="t('global.fullscreen')"
          @click="$emit('fullscreen')"
        >
          <md-icon>fullscreen</md-icon>
        </button>
        <button
          class="hero-button hero-button-right"
          type="button"
          :title="t('global.close')"
          @click="$emit('close')"
        >
          <md-icon>close</md-icon>
        </button>
        <span class="hero-cost">{{ recipe.cost }}</span>
      </div>

      <div class="detail-body">
        <h2 class="detail-title">{{ recipe.title }}</h2>

        <div
          v-if="recipe.categories && recipe.categories.length"
          class="detail-chips"
          aria-label="Recipe categories"
        >
          <span
            v-for="(categoryName, index) in recipe.categories"
            :key="categoryName"
            class="detail-chip"
          >
            <md-icon v-if="index === 0">label</md-icon>
            {{ getCategoryLabel(categoryName) }}
          </span>
        </div>

        <div class="detail-meta-row">
          <span class="detail-meta-item">
            <md-icon>schedule</md-icon>
            {{ recipe.duration }}
          </span>
          <span class="detail-meta-item">
            <md-icon>restaurant_menu</md-icon>
            {{ recipe.servings }}
            {{ t('feature.recipes.createRecipe.ingredients.servings') }}
          </span>
        </div>

        <p class="detail-description">
          {{ recipe.description || t('feature.recipes.detail.noDescription') }}
        </p>

        <div class="detail-owner">
          <span class="detail-avatar"><md-icon>person</md-icon></span>
          {{
            t('feature.recipes.detail.byOwner', {
              owner: recipe.owner || t('feature.recipes.detail.unknownChef'),
            })
          }}
        </div>

        <section class="detail-ingredients">
          <div class="ingredients-header">
            <h3>
              <md-icon>list</md-icon>
              {{ t('feature.recipes.detail.ingredientsTitle') }}
            </h3>
            <span class="ingredient-count">
              {{ recipe.ingredients.length }}
              {{ t('feature.recipes.detail.ingredientsTitle') }}
            </span>
          </div>

          <ul class="ingredient-list">
            <li
              v-for="(item, index) in recipe.ingredients"
              :key="index"
              class="ingredient-item"
            >
              <span class="ingredient-name">{{ item.ingredientName }}</span>
              <span class="ingredient-quantity">
                {{ item.quantity || '' }} {{ getUnitLabel(item.unit) }}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </article>
  </div>
</template>

<style scoped>
.recipe-detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(16, 38, 26, 0.42);
}

.recipe-detail-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(30rem, 100%);
  max-height: 88%;
  overflow: hidden;
  border-radius: var(--nnn-radius-xl, 28px);
  background: var(--md-sys-color-surface-container-lowest);
  box-shadow: var(--nnn-elevation-3);
}

.detail-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  flex-shrink: 0;
  background: var(--md-sys-color-surface-container-high);
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.detail-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--md-sys-color-on-surface-variant);
}

.detail-placeholder md-icon {
  --md-icon-size: 3.5rem;
}

.hero-button {
  position: absolute;
  top: 0.75rem;
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--md-sys-color-on-surface);
  box-shadow: var(--nnn-elevation-1);
  cursor: pointer;
  transition: background 0.15s ease;
}

.hero-button:hover {
  background: #ffffff;
}

.hero-button md-icon {
  --md-icon-size: 22px;
}

.hero-button-left {
  left: 0.75rem;
}

.hero-button-right {
  right: 0.75rem;
}

.hero-cost {
  position: absolute;
  right: 0.85rem;
  bottom: 0.85rem;
  padding: 0.3rem 0.75rem;
  border-radius: var(--nnn-radius-pill);
  background: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  font-size: 0.9rem;
  font-weight: 700;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.25rem 1.5rem 1.5rem;
  overflow-y: auto;
}

.detail-title {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.detail-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.detail-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.7rem;
  border-radius: var(--nnn-radius-pill);
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-size: 0.8rem;
  font-weight: 600;
}

.detail-chip md-icon {
  --md-icon-size: 16px;
}

.detail-meta-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.95rem;
}

.detail-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.detail-meta-item md-icon {
  --md-icon-size: 20px;
}

.detail-description {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.975rem;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.detail-owner {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9rem;
}

.detail-avatar {
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.detail-avatar md-icon {
  --md-icon-size: 18px;
}

.detail-ingredients {
  padding: 1rem 1.1rem;
  border-radius: var(--nnn-radius-md);
  background: var(--md-sys-color-surface-container-low);
}

.ingredients-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.ingredients-header h3 {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  font-weight: 700;
}

.ingredients-header md-icon {
  --md-icon-size: 20px;
  color: var(--md-sys-color-primary);
}

.ingredient-count {
  color: var(--md-sys-color-tertiary);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.ingredient-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ingredient-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-name {
  font-weight: 500;
}

.ingredient-quantity {
  color: var(--md-sys-color-on-surface);
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}

@media (max-width: 520px) {
  .recipe-detail-overlay {
    padding: 0.75rem;
  }

  .recipe-detail-card {
    max-height: 92%;
    border-radius: var(--nnn-radius-lg);
  }

  .detail-body {
    padding: 1rem;
  }

  .detail-meta-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.55rem;
  }
}
</style>
