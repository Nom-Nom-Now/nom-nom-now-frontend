<template>
  <div class="recipe-fullscreen-container">
    <div class="recipe-fullscreen-bar">
      <button class="bar-back-button" type="button" @click="emit('close')">
        <md-icon>arrow_back</md-icon>
        {{ t('global.back') }}
      </button>

      <div v-if="isOwner" class="bar-actions">
        <button
          class="icon-action edit"
          type="button"
          @click="emit('edit', props.recipe)"
        >
          <md-icon>edit</md-icon>
          {{ t('global.edit') }}
        </button>
        <button
          class="icon-action delete"
          type="button"
          @click="showDeleteDialog = true"
        >
          <md-icon>delete</md-icon>
          {{ t('global.delete') }}
        </button>
      </div>
    </div>

    <RecipeDetailContent :recipe="recipe" />

    <div v-if="showDeleteDialog" class="custom-modal-overlay">
      <div class="custom-modal">
        <p>{{ t('feature.recipes.edit.deleteConfirmation') }}</p>
        <div class="modal-actions">
          <button @click="showDeleteDialog = false">
            {{ t('feature.recipes.edit.cancel') }}
          </button>
          <button class="danger-btn" @click="confirmDelete">
            {{ t('feature.recipes.edit.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import RecipeDetailContent from './RecipeDetailContent.vue';
import type { Recipe } from '../../../list/src/shared/types.ts';
import { useAuth } from '../../../../../composables/useAuth';
import { deleteRecipe } from '../../../edit/src/service/deleteRecipeService.ts';

const props = defineProps<{
  recipe: Recipe;
  currentUsername?: string;
}>();

const emit = defineEmits<{
  close: [];
  edit: [recipe: Recipe];
  deleted: [];
}>();

const { t } = useI18n();
const { currentUsername: authCurrentUsername } = useAuth();

const showDeleteDialog = ref(false);

const activeUsername = computed(
  () => props.currentUsername || authCurrentUsername.value,
);

const isOwner = computed(() => {
  if (!activeUsername.value || !props.recipe?.owner) return false;
  return props.recipe.owner.toLowerCase() === activeUsername.value.toLowerCase();
});

async function confirmDelete() {
  try {
    showDeleteDialog.value = false;
    await deleteRecipe(Number(props.recipe.id));
    console.log(t('feature.recipes.edit.deleteSuccess'));
    emit('deleted');
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
  }
}
</script>

<style scoped>
.recipe-fullscreen-container {
  position: absolute;
  inset: 0;
  z-index: 1000;
  overflow-y: auto;
  background: var(--md-sys-color-surface-container-lowest);
}

.recipe-fullscreen-bar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-lowest) 88%,
    transparent
  );
  backdrop-filter: blur(8px);
}

.bar-back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem 0.4rem 0.5rem;
  border: none;
  border-radius: var(--nnn-radius-pill);
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}

.bar-back-button:hover {
  background: var(--md-sys-color-surface-container-high);
}

.bar-back-button md-icon {
  --md-icon-size: 20px;
}

.bar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2.5rem;
  padding: 0 1rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--nnn-radius-pill);
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.icon-action md-icon {
  --md-icon-size: 19px;
}

.icon-action.edit {
  color: var(--md-sys-color-primary);
}

.icon-action.edit:hover {
  background: var(--md-sys-color-primary-container);
}

.icon-action.delete {
  border-color: var(--md-sys-color-error);
  color: var(--md-sys-color-error);
}

.icon-action.delete:hover {
  background: var(--md-sys-color-error-container);
}

.custom-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(16, 38, 26, 0.5);
}

.custom-modal {
  display: flex;
  width: min(25rem, 100%);
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: var(--nnn-radius-xl);
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  box-shadow: var(--nnn-elevation-3);
}

.custom-modal p {
  margin: 0;
  font-family: var(--md-sys-typescale-body-medium-font);
  font-size: var(--md-sys-typescale-body-medium-size);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--nnn-radius-pill);
  background: none;
  color: var(--md-sys-color-primary);
  font-family: var(--md-sys-typescale-label-large-font, sans-serif);
  font-size: var(--md-sys-typescale-label-large-size, 14px);
  cursor: pointer;
}

.modal-actions button:first-child {
  margin-right: auto;
}

.modal-actions button:hover {
  background-color: var(--md-sys-color-surface-container-lowest);
}

.modal-actions .danger-btn {
  color: var(--md-sys-color-error);
}

.modal-actions .danger-btn:hover {
  background-color: var(--md-sys-color-error-container);
}

@media (max-width: 640px) {
  .recipe-fullscreen-bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .bar-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .icon-action {
    padding: 0 0.8rem;
  }
}
</style>
