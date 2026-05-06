<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const store = useCreateRecipeStore();
const { instructions, cookingTime } = storeToRefs(store);

const prepareHours = ref(String(Math.floor(cookingTime.value / 60)));
const prepareMinutes = ref(String(cookingTime.value % 60));

function updateCookingTime() {
  const hours = parseInt(prepareHours.value, 10) || 0;
  const minutes = parseInt(prepareMinutes.value, 10) || 0;
  cookingTime.value = hours * 60 + minutes;
}

function onInstructionsInput(event: Event) {
  instructions.value = (event.target as HTMLTextAreaElement).value;
}

function onHoursInput(event: Event) {
  prepareHours.value = (event.target as HTMLInputElement).value;
  updateCookingTime();
}

function onMinutesInput(event: Event) {
  prepareMinutes.value = (event.target as HTMLInputElement).value;
  updateCookingTime();
}
</script>

<template>
  <div class="frame">
    <div>
      <md-tabs>
        <MdLabel size="large">
          {{ t('feature.recipes.createRecipe.preparation.title') }}
        </MdLabel>
      </md-tabs>
      <MdLabel size="medium" class="description">
        {{ t('feature.recipes.createRecipe.preparation.description') }}
      </MdLabel>
    </div>

    <div>
      <textarea
        :value="instructions"
        :placeholder="t('feature.recipes.createRecipe.preparation.placeholder')"
        class="preparationTextarea"
        @input="onInstructionsInput"
      />
    </div>

    <div>
      <md-tabs>
        <MdLabel size="large">
          {{ t('feature.recipes.createRecipe.preparation.workingTime') }}
        </MdLabel>
      </md-tabs>
      <div class="timeInputs">
        <div class="timeInputGroup">
          <md-outlined-text-field
            :value="prepareHours"
            type="number"
            min="0"
            :label="t('feature.recipes.createRecipe.preparation.hours')"
            @input="onHoursInput"
          />
        </div>
        <div class="timeInputGroup">
          <md-outlined-text-field
            :value="prepareMinutes"
            type="number"
            min="0"
            max="59"
            :label="t('feature.recipes.createRecipe.preparation.minutes')"
            @input="onMinutesInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.description {
  margin-left: 1.5rem;
  color: var(--md-sys-color-on-surface-variant);
  line-height: 1.5;
}

.preparationTextarea {
  width: calc(100% - 4rem);
  min-height: 200px;
  margin-left: 2rem;
  padding: 1rem;
  border: 1px solid var(--md-sys-color-outline);
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  color: var(--md-sys-color-on-surface);
  background-color: var(--md-sys-color-surface);
  resize: vertical;
  transition: border-color 0.2s ease;
}

.preparationTextarea:focus {
  outline: none;
  border-color: var(--md-sys-color-primary);
  border-width: 2px;
  padding: calc(1rem - 1px);
}

.preparationTextarea::placeholder {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 0.6;
}

.timeInputs {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-left: 2rem;
}

.timeInputGroup {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeInputGroup md-outlined-text-field {
  width: 100px;
}
</style>
