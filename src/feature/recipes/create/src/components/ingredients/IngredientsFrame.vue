<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import IngredientList from './IngredientList.vue';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const store = useCreateRecipeStore();
const { servings, recipeName } = storeToRefs(store);

function onServingsInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  store.setServings(value);
}

function onNameInput(event: Event) {
  store.setRecipeName((event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="frame">
    <div>
      <md-tabs>
        <MdLabel size="large">
          {{ t('feature.recipes.createRecipe.ingredients.name') }}
        </MdLabel>
      </md-tabs>
      <md-filled-text-field
        class="text-field"
        :label="t('feature.recipes.createRecipe.ingredients.nameExample')"
        type="text"
        :value="recipeName"
        @input="onNameInput"
      ></md-filled-text-field>
    </div>

    <div>
      <md-tabs>
        <MdLabel size="large">
          {{ t('feature.recipes.createRecipe.ingredients.servings') }}
        </MdLabel>
        <MdLabel size="medium" class="label">
          <i18n-t
            keypath="feature.recipes.createRecipe.ingredients.servingsText"
            tag="span"
          >
            <template #servingChooser>
              <md-outlined-text-field
                type="number"
                class="serving-chooser"
                min="1"
                :value="servings"
                @input="onServingsInput"
              />
            </template>
          </i18n-t>
        </MdLabel>
      </md-tabs>
    </div>

    <IngredientList />
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

.label {
  margin-left: 1.5rem;
}

.serving-chooser {
  height: 3rem;
  width: 4.5rem;
  margin: -1rem 0.25rem 0rem 0.25rem;
}

md-icon {
  color: var(--md-sys-color-primary);
  font-size: 24px;

  font-variation-settings:
    'FILL' 1,
    'wght' 400;
}
</style>
