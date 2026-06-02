<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Recipe } from '../../../list/src/shared/types.ts';

defineProps<{
  recipe: Recipe;
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
  <div class="recipe-full-content">
    <header class="recipe-full-head">
      <h1 class="recipe-full-title">{{ recipe.title }}</h1>

      <div
        v-if="recipe.categories && recipe.categories.length"
        class="recipe-full-chips"
        aria-label="Recipe categories"
      >
        <span
          v-for="(categoryName, index) in recipe.categories"
          :key="categoryName"
          class="recipe-detail-chip"
        >
          <md-icon v-if="index === 0">label</md-icon>
          {{ getCategoryLabel(categoryName) }}
        </span>
      </div>
    </header>

    <div class="recipe-full-grid">
      <div class="recipe-full-left">
        <div class="recipe-full-hero">
          <img
            v-if="recipe.imageUrl"
            :src="recipe.imageUrl"
            :alt="recipe.title"
            class="recipe-full-image"
          />
          <div v-else class="recipe-full-placeholder">
            <md-icon>restaurant</md-icon>
          </div>
        </div>

        <section class="recipe-detail-card">
          <h3 class="recipe-card-title">
            <md-icon>description</md-icon>
            {{ t('feature.recipes.detail.preparationTitle') }}
          </h3>
          <p class="recipe-full-description">
            {{
              recipe.description || t('feature.recipes.detail.noDescription')
            }}
          </p>

          <div class="recipe-cost-strip">
            <span class="cost-label">
              {{ t('feature.recipes.detail.pricePerPerson') }}
            </span>
            <span class="cost-value">{{ recipe.cost }}</span>
          </div>
        </section>
      </div>

      <aside class="recipe-full-right">
        <section class="recipe-detail-card recipe-meta-card">
          <div class="recipe-meta-line">
            <span class="meta-icon"><md-icon>person</md-icon></span>
            <span>
              <span class="meta-key">{{
                t('feature.recipes.detail.createdBy')
              }}</span>
              <span class="meta-value">{{
                recipe.owner || t('feature.recipes.detail.unknownChef')
              }}</span>
            </span>
          </div>

          <div class="recipe-meta-line">
            <span class="meta-icon"><md-icon>schedule</md-icon></span>
            <span>
              <span class="meta-key">{{
                t('feature.recipes.detail.durationLabel')
              }}</span>
              <span class="meta-value">{{ recipe.duration }}</span>
            </span>
          </div>

          <div class="recipe-meta-line">
            <span class="meta-icon"><md-icon>restaurant_menu</md-icon></span>
            <span>
              <span class="meta-key">{{
                t('feature.recipes.createRecipe.ingredients.servings')
              }}</span>
              <span class="meta-value">
                {{ recipe.servings }}
                {{ t('feature.recipes.detail.peopleLabel') }}
              </span>
            </span>
          </div>
        </section>

        <section class="recipe-detail-card">
          <h3 class="recipe-card-title">
            <md-icon>list</md-icon>
            {{ t('feature.recipes.detail.ingredientsTitle') }}
          </h3>

          <ul class="recipe-ingredient-list">
            <li
              v-for="(item, index) in recipe.ingredients"
              :key="index"
              class="recipe-ingredient-item"
            >
              <span class="ingredient-name">{{ item.ingredientName }}</span>
              <span class="ingredient-quantity">
                {{ item.quantity || '' }} {{ getUnitLabel(item.unit) }}
              </span>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.recipe-full-content {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
}

.recipe-full-head {
  margin-bottom: 1.75rem;
  text-align: center;
}

.recipe-full-title {
  margin: 0 0 0.85rem;
  color: var(--md-sys-color-on-surface);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.recipe-full-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.recipe-detail-chip {
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

.recipe-detail-chip md-icon {
  --md-icon-size: 16px;
}

.recipe-full-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.recipe-full-hero {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  margin-bottom: 1.25rem;
  overflow: hidden;
  border-radius: var(--nnn-radius-lg);
  background: var(--md-sys-color-surface-container-high);
  box-shadow: var(--nnn-elevation-1);
}

.recipe-full-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.recipe-full-placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-full-placeholder md-icon {
  --md-icon-size: 5rem;
}

.recipe-detail-card {
  padding: 1.5rem;
  border-radius: var(--nnn-radius-lg);
  background: var(--md-sys-color-surface-container-low);
}

.recipe-detail-card + .recipe-detail-card {
  margin-top: 1.25rem;
}

.recipe-card-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.85rem;
  color: var(--md-sys-color-on-surface);
  font-size: 1.05rem;
  font-weight: 700;
}

.recipe-card-title md-icon {
  --md-icon-size: 20px;
  color: var(--md-sys-color-primary);
}

.recipe-full-description {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.0625rem;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.recipe-cost-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.25rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.cost-label {
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 600;
}

.cost-value {
  padding: 0.3rem 0.85rem;
  border-radius: var(--nnn-radius-pill);
  background: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
  font-size: 1.05rem;
  font-weight: 700;
  white-space: nowrap;
}

.recipe-meta-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.recipe-meta-line {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--md-sys-color-on-surface-variant);
}

.meta-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  border-radius: var(--nnn-radius-sm);
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-primary);
}

.meta-icon md-icon {
  --md-icon-size: 20px;
}

.meta-key {
  display: block;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.8rem;
}

.meta-value {
  display: block;
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  font-weight: 600;
}

.recipe-ingredient-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.recipe-ingredient-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.recipe-ingredient-item:last-child {
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

@media (max-width: 820px) {
  .recipe-full-content {
    padding: 1.5rem 1rem 2rem;
  }

  .recipe-full-title {
    font-size: 2rem;
  }

  .recipe-full-grid {
    grid-template-columns: 1fr;
  }
}
</style>
