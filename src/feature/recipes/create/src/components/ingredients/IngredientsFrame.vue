<script setup lang="ts">
import MdLabel from "../../../../../../components/MdLabel.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="frame">
    <div>
      <md-tabs>
        <MdLabel size="large">
          {{ t('feature.recipes.createRecipe.ingredients.name') }}
        </MdLabel>
      </md-tabs>
      <md-filled-text-field class="text-field" :label="t('feature.recipes.createRecipe.ingredients.nameExample')" type="text" ></md-filled-text-field>
    </div>

    <div>
      <md-tabs>
        <MdLabel size="large">
          {{ t('feature.recipes.createRecipe.ingredients.servings') }}
        </MdLabel>
      </md-tabs>
    </div>
  </div>


</template>

<style scoped>
.frame {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.text-field {
  margin-left: 2rem;
}

md-icon {
  color: var(--md-sys-color-primary);
  font-size: 24px;

  font-variation-settings:
      'FILL' 1,
      'wght' 400;
}
</style>