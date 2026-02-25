<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import IngredientRow from './IngredientRow.vue';

const { t } = useI18n();
</script>

<template>
  <md-tabs>
    <MdLabel size="large">
      {{ t('feature.recipes.createRecipe.ingredients.chooserHeading') }}
    </MdLabel>
  </md-tabs>

  <div>
    <IngredientRow />
  </div>
</template>

<style scoped>

</style>