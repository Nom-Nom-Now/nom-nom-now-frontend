<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const { t } = useI18n();
const store = useCreateRecipeStore();
const { isSubmitting, submitError, isIngredientsStepValid } =
  storeToRefs(store);

const submitSuccess = ref(false);

async function handleSubmit() {
  submitSuccess.value = false;
  try {
    await store.submitRecipe();
    submitSuccess.value = true;
  } catch {
    // Fehler wird im Store via submitError gesetzt
  }
}
</script>

<template>
  <div class="frame">
    <md-tabs>
      <MdLabel size="large">
        {{ t('feature.recipes.createRecipe.preview.heading') }}
      </MdLabel>
    </md-tabs>

    <div class="actions">
      <md-filled-button
        @click="handleSubmit"
        :disabled="isSubmitting || !isIngredientsStepValid"
      >
        <md-icon slot="icon">send</md-icon>
        {{
          isSubmitting
            ? t('feature.recipes.createRecipe.preview.submitting')
            : t('feature.recipes.createRecipe.preview.submit')
        }}
      </md-filled-button>

      <div v-if="submitError" class="feedback feedback--error">
        {{ submitError }}
      </div>
      <div v-if="submitSuccess" class="feedback feedback--success">
        {{ t('feature.recipes.createRecipe.preview.success') }}
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

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-left: 2rem;
}

.feedback {
  font: var(--md-sys-typescale-body-medium-weight)
    var(--md-sys-typescale-body-medium-size)
    var(--md-sys-typescale-body-medium-font);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.feedback--error {
  color: var(--md-sys-color-on-error-container);
  background: var(--md-sys-color-error-container);
}

.feedback--success {
  color: var(--md-sys-color-on-tertiary-container);
  background: var(--md-sys-color-tertiary-container);
}
</style>
