<template>
  <div class="recipe-fullscreen-container">
    <button
      class="close-button"
      @click="emit('close')"
      :title="t('global.close')"
    >
      <md-icon>close</md-icon>
    </button>

    <div v-if="isOwner" class="recipe-screen-actions">
      <button
        class="icon-action-button edit"
        @click="emit('edit', recipe)"
        :title="t('global.edit')"
      >
        <md-icon>edit</md-icon>
      </button>
      <button
        class="icon-action-button delete"
        @click="showDeleteDialog = true"
        :title="t('global.delete')"
      >
        <md-icon>delete</md-icon>
      </button>
    </div>

    <RecipeDetailContent :recipe="recipe" />

    <div v-if="showDeleteDialog" class="custom-modal-overlay">
      <div class="custom-modal">
        <p>{{ t('feature.recipes.edit.deleteConfirmation') }}</p>
        <div class="modal-actions">
          <button @click="showDeleteDialog = false">{{ t('feature.recipes.edit.cancel') }}</button>
          <button class="danger-btn" @click="confirmDelete">{{ t('feature.recipes.edit.confirm') }}</button>
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
import { deleteRecipe } from '../../../edit/service/deleteRecipeService.ts';

const props = defineProps<{
  recipe: Recipe;
}>();

const emit = defineEmits<{
  close: [];
  edit: [recipe: Recipe];
  deleted: [];
}>();

const { t } = useI18n();
const { currentUsername } = useAuth();

const showDeleteDialog = ref(false);

const isOwner = computed(() => {
  if (!currentUsername.value || !props.recipe?.owner) return false;
  return props.recipe.owner.toLowerCase() === currentUsername.value.toLowerCase();
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
  top: 0;
  left: 0;
  margin: -1rem;
  width: calc(100% + 2rem);
  height: calc(100% + 2rem);
  background-color: var(--md-sys-color-surface);
  z-index: 1000;
  overflow-y: auto;
  padding: 4rem 2rem 2rem 2rem;
  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 1.2rem;
  left: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--md-sys-color-on-surface-variant);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 1010;
  transition: background-color 0.2s, color 0.2s;
}

.close-button:hover {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-error);
}

.close-button md-icon {
  font-size: 1.75rem;
}

.recipe-screen-actions {
  position: absolute;
  top: 1.2rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1010;
}

.icon-action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
  color: var(--md-sys-color-on-surface-variant);
}

.icon-action-button:hover {
  background-color: var(--md-sys-color-surface-container-high);
}

.icon-action-button.edit:hover {
  color: var(--md-sys-color-primary);
}

.icon-action-button.delete:hover {
  color: var(--md-sys-color-error);
}

.icon-action-button md-icon {
  font-size: 1.35rem;
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.custom-modal {
  background-color: var(--md-sys-color-surface-container-high, #ffffff);
  color: var(--md-sys-color-on-surface);
  padding: 1.5rem;
  border-radius: 28px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-family: var(--md-sys-typescale-label-large-font, sans-serif);
  font-size: var(--md-sys-typescale-label-large-size, 14px);
  cursor: pointer;
  border-radius: 100px;
  color: var(--md-sys-color-primary);
}

.modal-actions button:first-child {
  margin-right: auto;
}

.modal-actions button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-actions .danger-btn {
  color: var(--md-sys-color-error, #ba1a1a);
}

.modal-actions .danger-btn:hover {
  background-color: var(--md-sys-color-error-container, rgba(186, 26, 26, 0.08));
}
</style>