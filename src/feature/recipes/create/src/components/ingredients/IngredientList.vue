<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import IngredientRow from './IngredientRow.vue';
import { ref } from 'vue';

const { t } = useI18n();

const ingredients = ref([{ id: 1 }, { id: 2 }, { id: 3 }]);

function moveUp(index: number) {
  if (index === 0) return;
  const arr = ingredients.value;
  [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
}

function moveDown(index: number) {
  if (index === ingredients.value.length - 1) return;
  const arr = ingredients.value;
  [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
}
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
      class="ingredient-list"
      @move-up="moveUp(index)"
      @move-down="moveDown(index)"
    />
  </div>
</template>

<style scoped>
.ingredient-list {
  margin-bottom: 1.5rem;
}
</style>
