<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import IngredientRow from './IngredientRow.vue';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const store = useCreateRecipeStore();
const { ingredients } = storeToRefs(store);
</script>

<template>
  <md-tabs>
    <MdLabel size="large">
      {{ t('feature.recipes.createRecipe.ingredients.chooserHeading') }}
    </MdLabel>
  </md-tabs>

  <div>
    <IngredientRow
      v-for="(ingredient, index) in ingredients"
      :key="ingredient.id"
      :ingredient="ingredient"
      class="ingredient-list"
      @move-up="store.moveIngredientUp(index)"
      @move-down="store.moveIngredientDown(index)"
      @remove="store.removeIngredient(ingredient.id)"
    />
    <md-outlined-button class="add-ingredient-btn" @click="store.addIngredient()">
      <md-icon slot="icon">add</md-icon>
      <md-label size="medium">
        {{ t('feature.recipes.createRecipe.ingredients.addIngredient') }}
      </md-label>
    </md-outlined-button>
  </div>
</template>

<style scoped>
.ingredient-list {
  margin-bottom: 1.5rem;
}

.add-ingredient-btn {
  margin-left: 2rem;
}
</style>
