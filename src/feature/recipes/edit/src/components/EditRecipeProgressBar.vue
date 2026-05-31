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
      <EditRecipePreview
        @cancel="handleCancelEdit"
        @success="closeEditorAndRefresh"
      />
    </template>
  </RecipeFormWrapper>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { useRouter } from 'vue-router';
import RecipeFormWrapper from '../../../create/src/components/RecipeFormWrapper.vue';
import IngredientsFrame from '../../../create/src/components/ingredients/IngredientsFrame.vue';
import PreparationFrame from '../../../create/src/components/preparation/PreparationFrame.vue';
import CategoryFrame from '../../../create/src/components/categories/CategoryFrame.vue';
import ImageFrame from '../../../create/src/components/image/ImageFrame.vue';
import EditRecipePreview from './EditRecipePreview.vue';
import { useEditRecipeStore } from '../stores/useEditRecipeStore';

const editStore = useEditRecipeStore();
const router = useRouter();

provide('recipeStore', editStore);

const handleCancelEdit = () => {
  router.back();
};

const closeEditorAndRefresh = () => {
  router.back();
};
</script>