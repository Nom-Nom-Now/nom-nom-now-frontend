<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import IngredientRow from './IngredientRow.vue';
import { ref } from 'vue';

const { t } = useI18n();

const ingredients = ref([{ id: 1 }, { id: 2 }, { id: 3 }]);
let nextId = 4;

function addIngredient() {
  ingredients.value.push({ id: nextId++ });
}

function moveUp(index: number) {
  if (index === 0) return;
  const arr = ingredients.value;
  const current = arr[index]!;
  const previous = arr[index - 1]!;
  arr[index - 1] = current;
  arr[index] = previous;
}

function moveDown(index: number) {
  if (index === ingredients.value.length - 1) return;
  const arr = ingredients.value;
  const current = arr[index]!;
  const next = arr[index + 1]!;
  arr[index] = next;
  arr[index + 1] = current;
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
    <md-outlined-button class="add-ingredient-btn" @click="addIngredient">
      <template v-slot:icon>
        <md-icon>add</md-icon>
      </template>
      {{ t('feature.recipes.createRecipe.ingredients.addIngredient') }}
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
