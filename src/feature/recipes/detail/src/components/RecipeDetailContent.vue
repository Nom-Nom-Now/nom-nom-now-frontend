<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import MdLabel from '../../../../../components/MdLabel.vue';
import MdText from '../../../../../components/MdText.vue';
import type { Recipe } from '../../../list/src/shared/types.ts';

defineProps<{
  recipe: Recipe;
}>();

const { t } = useI18n();

// Übersetzt den rohen Kategorienamen (z.B. "VEGAN") via i18n
const getCategoryLabel = (name: string) =>
  t(`feature.recipes.createRecipe.categories.${name}`);
</script>

<template>
  <div class="recipe-fullscreen-layout">
    <MdLabel size="large" class="recipe-title">{{ recipe.title }}</MdLabel>

    <div class="recipe-left-column">
      <div class="recipe-image-container">
        <img v-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.title" class="recipe-image" />
        <div v-else class="recipe-image-placeholder">
          <md-icon>restaurant</md-icon>
        </div>
      </div>

      <div class="recipe-section description-box">
        <MdText class="recipe-description">
          {{ recipe.description || t('feature.recipes.detail.noDescription') }}
        </MdText>

        <div class="recipe-cost-factor">
          <strong>Preis pro Person:</strong> <span class="recipe-cost">{{ recipe.cost }}</span>
        </div>
      </div>
    </div>

    <div class="recipe-right-column">
      <div class="recipe-meta-top">
        <div class="meta-left-info">
          <div class="recipe-owner-section">
            <md-icon>person</md-icon>
            <MdText size="medium">
              {{ t('feature.recipes.detail.byOwner', { owner: recipe.owner || t('feature.recipes.detail.unknownChef') }) }}
            </MdText>
          </div>

          <div class="recipe-time">
            <md-icon>schedule</md-icon>
            <MdText size="medium">{{ recipe.duration }}</MdText>
          </div>
        </div>
      </div>

      <div v-if="recipe.categories && recipe.categories.length" class="recipe-detail-chips">
        <div v-for="categoryName in recipe.categories" :key="categoryName" class="detail-chip">
          <md-icon class="chip-icon">label</md-icon>
          <span>{{ getCategoryLabel(categoryName) }}</span>
        </div>
      </div>

      <div class="recipe-ingredients-section">
        <div class="ingredients-header">
          <md-icon>list</md-icon>
          <MdLabel size="medium">{{ t('feature.recipes.detail.ingredientsTitle') }}</mdLabel>
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
.recipe-fullscreen-layout {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "header header"
    "left right";
  gap: 1.5rem 4rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.recipe-title {
  grid-area: header;
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  font-size: 2.5rem;
  font-weight: 500;
  text-align: center !important;
  color: var(--md-sys-color-on-surface);
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.recipe-left-column {
  grid-area: left;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-left-column > * {
  width: 100%;
  max-width: 45rem;
}

.recipe-image-container {
  height: 22rem;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
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
  font-size: 6rem;
}

.recipe-detail-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.detail-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--md-sys-color-outline-variant, #c7c7c7);
  border-radius: 8px;
  background: var(--md-sys-color-surface-container-low, #f3f3f3);
  font-size: 0.9rem;
  color: var(--md-sys-color-on-surface);
}

.chip-icon {
  font-size: 1.1rem !important;
  color: var(--md-sys-color-primary);
}

.description-box {
  background-color: var(--md-sys-color-surface-container-lowest, #fff);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.05));
  box-sizing: border-box;
}

.recipe-description {
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--md-sys-color-on-surface);
  margin-bottom: 1.5rem;
}

.recipe-cost-factor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  border-top: 1px solid var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.1));
  padding-top: 1rem;
}

.recipe-cost {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--md-sys-color-primary);
}

.recipe-right-column {
  grid-area: right;
  width: max-content;
  min-width: 24rem;
  max-width: 35rem;
  justify-self: end;
}

.recipe-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--md-sys-color-surface-container-low);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  gap: 2rem;
}

.meta-left-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.recipe-owner-section,
.recipe-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-ingredients-section {
  background-color: var(--md-sys-color-surface-container-low);
  padding: 1.5rem;
  border-radius: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.ingredients-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.1));
  display: grid;
  grid-template-columns: 1fr 4rem 4rem;
  gap: 12px;
}

.ingredient-name { text-align: left; font-weight: bold; }
.ingredient-quantity { text-align: right; }
.ingredient-unit { text-align: left; }

@media (max-width: 768px) {
  .recipe-fullscreen-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "left"
      "right";
    gap: 1.5rem;
  }

  .recipe-title {
    font-size: 2rem;
    margin-top: 1rem;
    padding: 0 4rem;
  }

  .recipe-right-column {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    justify-self: stretch;
  }
}
</style>