<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import RecipeDetailContent from './RecipeDetailContent.vue';
import type { Recipe } from '../../../list/src/shared/types.ts';
import { useAuth } from '../../../../../composables/useAuth';

const props = defineProps<{
  recipe: Recipe;
}>();

const emit = defineEmits<{
  close: [];
  edit: [recipe: Recipe];
  delete: [recipeId: string];
}>();

const { t } = useI18n();

const { currentUsername } = useAuth();

const isOwner = computed(() => {
  if (!currentUsername.value || !props.recipe?.owner) return false;
  return props.recipe.owner.toLowerCase() === currentUsername.value.toLowerCase();
});
</script>

<template>
  <div class="recipe-fullscreen-container">
    <button class="close-button" @click="emit('close')" :title="t('global.close')">
      <md-icon>close</md-icon>
    </button>

    <div v-if="isOwner" class="recipe-screen-actions">
      <button class="icon-action-button edit" @click="emit('edit', recipe)" :title="t('global.edit')">
        <md-icon>edit</md-icon>
      </button>
      <button class="icon-action-button delete" @click="emit('delete', recipe.id)" :title="t('global.delete')">
        <md-icon>delete</md-icon>
      </button>
    </div>

    <RecipeDetailContent :recipe="recipe" />
  </div>
</template>

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

/* Schließen-Button mit fixem Z-Index und Hover-Effekt */
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
  z-index: 1010; /* Höher als der Content */
  transition: background-color 0.2s, color 0.2s;
}

.close-button:hover {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-error); /* Färbt das X beim Hover leicht rot/wichtig */
}

.close-button md-icon {
  font-size: 1.75rem;
}

/* Aktions-Leiste */
.recipe-screen-actions {
  position: absolute;
  top: 1.2rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1010; /* Höher als der Content */
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
</style>