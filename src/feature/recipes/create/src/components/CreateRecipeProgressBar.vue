<template>
  <RecipeFormWrapper>
    <template #ingredients>
      <IngredientsFrame />
    </template>
    <template #preparation>
      <PreparationFrame />
    </template>
    <template #categories>
      <CategoryFrame />
    </template>
    <template #image>
      <ImageFrame />
    </template>
    <template #preview>
      <PreviewFrame />
    </template>
  </RecipeFormWrapper>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import RecipeFormWrapper from './RecipeFormWrapper.vue';
import IngredientsFrame from './ingredients/IngredientsFrame.vue';
import PreparationFrame from './preparation/PreparationFrame.vue';
import CategoryFrame from './categories/CategoryFrame.vue';
import ImageFrame from './image/ImageFrame.vue';
import PreviewFrame from './preview/PreviewFrame.vue';
import { useCreateRecipeStore } from '../stores/useCreateRecipeStore';

const store = useCreateRecipeStore();
provide('recipeStore', store);
</script>
