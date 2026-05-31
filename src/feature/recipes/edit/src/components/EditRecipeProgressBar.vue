<script setup lang="ts">
import StepNavigationButton from '../../../../../components/StepNavigationButton.vue';

import { useI18n } from 'vue-i18n';
import { ref, provide } from 'vue';

import IngredientsFrame from '../../../create/src/components/ingredients/IngredientsFrame.vue';
import EditRecipePreview from './EditRecipePreview.vue';
import CategoryFrame from '../../../create/src/components/categories/CategoryFrame.vue';
import ImageFrame from '../../../create/src/components/image/ImageFrame.vue';
import PreparationFrame from '../../../create/src/components/preparation/PreparationFrame.vue';

import { useEditRecipeStore } from '../stores/useEditRecipeStore';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const editStore = useEditRecipeStore();
const router = useRouter();

provide('recipeStore', editStore);

const stepNavigationItems = [
  {
    step: 'ingredients',
    label: 'feature.recipes.createRecipe.stepNavigation.ingredients',
    iconName: 'counter_1_20dp_4A4459',
  },
  {
    step: 'preparation',
    label: 'feature.recipes.createRecipe.stepNavigation.preparation',
    iconName: 'counter_2_20dp_4A4459',
  },
  {
    step: 'categories',
    label: 'feature.recipes.createRecipe.stepNavigation.categories',
    iconName: 'counter_3_20dp_4A4459',
  },
  {
    step: 'image',
    label: 'feature.recipes.createRecipe.stepNavigation.image',
    iconName: 'counter_4_20dp_4A4459',
  },
  {
    step: 'preview',
    label: 'feature.recipes.createRecipe.stepNavigation.preview',
    iconName: 'counter_5_20dp_4A4459',
  },
];

const activeStep = ref('ingredients');
const setActiveStep = (step: string) => {
  activeStep.value = step;
};

const handleCancelEdit = () => {
  router.back();
};

const closeEditorAndRefresh = () => {
  router.back();
};
</script>

<template>
  <div class="contentBox">
    <div class="progressBox">
      <div v-for="item in stepNavigationItems" :key="item.label">
        <StepNavigationButton
          :label="t(item.label)"
          :icon-name="item.iconName"
          :active="activeStep === item.step"
          @click="setActiveStep(item.step)"
        />
      </div>
    </div>

    <div class="createBox">
      <div class="ingredientBox" v-if="activeStep === 'ingredients'">
        <IngredientsFrame />
      </div>
      <div class="preparationBox" v-if="activeStep === 'preparation'">
        <PreparationFrame />
      </div>
      <div class="categoriesBox" v-if="activeStep === 'categories'">
        <CategoryFrame />
      </div>
      <div class="imageBox" v-if="activeStep === 'image'">
        <ImageFrame />
      </div>
      <div class="previewBox" v-if="activeStep === 'preview'">
        <EditRecipePreview
          @cancel="handleCancelEdit"
          @success="closeEditorAndRefresh"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.contentBox {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.progressBox {
  display: flex;
  align-items: center;
  width: 100%;
  height: 4rem;
  border-radius: 1rem;
  background-color: var(--md-sys-color-surface-container);
}

.createBox {
  margin-top: 1rem;
}
</style>