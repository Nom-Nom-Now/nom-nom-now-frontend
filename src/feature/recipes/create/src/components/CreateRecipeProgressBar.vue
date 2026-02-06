<template>
  <div class="contentBox">
    <div class="progressBox" >
      <div v-for="item in stepNavigationItems" :key="item.label">
        <StepNavigationButton
          :label="t(item.label)"
          :icon-name="item.iconName"
          :active="activeStep === item.step"
          @click="setActiveStep(item.step)"/>
      </div>
    </div>

    <div class="createBox">
      <div class="ingredientBox" v-if="activeStep.valueOf() === 'ingredients'">
        Ingredients Placeholder
      </div>

      <div class="preparationBox" v-if="activeStep.valueOf() === 'preparation'">
        Preparation Placeholder
      </div>

      <div class="categoriesBox" v-if="activeStep.valueOf() === 'categories'">
        Categories Placeholder
      </div>

      <div class="imageBox" v-if="activeStep.valueOf() === 'image'">
        Image Placeholder
      </div>

      <div class="previewBox" v-if="activeStep.valueOf() === 'preview'">
        Preview Placeholder
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StepNavigationButton from '../../../../../components/StepNavigationButton.vue';

import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
const { t } = useI18n();

const stepNavigationItems = [
  { step: 'ingredients', label: 'feature.recipes.createRecipe.stepNavigation.ingredients', iconName: 'counter_1_20dp_4A4459' },
  { step: 'preparation', label: 'feature.recipes.createRecipe.stepNavigation.preparation', iconName: 'counter_2_20dp_4A4459' },
  { step: 'categories', label: 'feature.recipes.createRecipe.stepNavigation.categories', iconName: 'counter_3_20dp_4A4459' },
  { step: 'image', label: 'feature.recipes.createRecipe.stepNavigation.image', iconName: 'counter_4_20dp_4A4459' },
  { step: 'preview', label: 'feature.recipes.createRecipe.stepNavigation.preview', iconName: 'counter_5_20dp_4A4459' }
]

const activeStep = ref('ingredients');
const setActiveStep = (step: string) => {
  activeStep.value = step;
};
</script>

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
    margin: 1rem;
  }
</style>