<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';

const { t } = useI18n();

const preparationInstructions = ref('');
const prepareHours = ref('0');
const prepareMinutes = ref('0');

// Calculate total minutes
const totalMinutes = computed(() => {
  const hours = parseInt(prepareHours.value, 10) || 0;
  const minutes = parseInt(prepareMinutes.value, 10) || 0;
  return hours * 60 + minutes;
});

defineExpose({
  preparationInstructions,
  totalMinutes,
  prepareHours,
  prepareMinutes,
});
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
        v-model="preparationInstructions"
        :placeholder="t('feature.recipes.createRecipe.preparation.placeholder')"
        class="preparationTextarea"
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
            v-model="prepareHours"
            type="number"
            min="0"
            :label="t('feature.recipes.createRecipe.preparation.hours')"
          />
        </div>
        <div class="timeInputGroup">
          <md-outlined-text-field
            v-model="prepareMinutes"
            type="number"
            min="0"
            max="59"
            :label="t('feature.recipes.createRecipe.preparation.minutes')"
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
