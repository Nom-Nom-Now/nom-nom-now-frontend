<script setup lang="ts">
import arrowUpIcon from '../../../../../../assets/icons/arrow_upward_24dp_1F1F1F1.svg';
import arrowDownIcon from '../../../../../../assets/icons/arrow_downward_24dp_1F1F1F1.svg';
import deleteIcon from '../../../../../../assets/icons/delete_24dp_1F1F1F1.svg';
import { useI18n } from 'vue-i18n';
import { UNIT_VALUES } from '../../shared/types/units';
import type { Unit } from '../../shared/types/units';
import type { Ingredient } from '../../shared/types/recipe';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore';
import { computed } from 'vue';

const { t } = useI18n();
const store = useCreateRecipeStore();

const props = defineProps<{
  ingredient: Ingredient;
}>();

const emit = defineEmits<{
  moveUp: [];
  moveDown: [];
  remove: [];
}>();

const unitOptions = computed(() =>
  UNIT_VALUES.map((value) => ({
    label: t(`feature.recipes.createRecipe.ingredients.unitValues.${value}`),
    value,
  })),
);

function onAmountInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  const value = raw === '' ? null : Number(raw);
  store.updateIngredientAmount(props.ingredient.id, value);
}

function onUnitChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as Unit;
  store.updateIngredientUnit(props.ingredient.id, value);
}

function onNameInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  store.updateIngredientName(props.ingredient.id, value);
}
</script>

<template>
  <div class="ingredient-row">
    <md-outlined-text-field
      :label="t('feature.recipes.createRecipe.ingredients.amount')"
      type="number"
      min="0"
      :value="ingredient.amount ?? ''"
      @input="onAmountInput"
    ></md-outlined-text-field>
    <div class="select-wrapper">
      <select class="select" :value="ingredient.unit" @change="onUnitChange">
        <option
          v-for="unit in unitOptions"
          :key="unit.value"
          :value="unit.value"
        >
          {{ unit.label }}
        </option>
      </select>
      <span class="select-label">
        {{ t('feature.recipes.createRecipe.ingredients.unit') }}
      </span>
      <svg class="select-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
    <md-outlined-text-field
      :label="t('feature.recipes.createRecipe.ingredients.ingredient')"
      :value="ingredient.name"
      @input="onNameInput"
    ></md-outlined-text-field>
    <div class="swap-buttons">
      <button class="swap-btn" @click="emit('moveUp')" title="Move up">
        <img :src="arrowUpIcon" alt="move up" class="swap-icon" />
      </button>
      <button class="swap-btn" @click="emit('moveDown')" title="Move down">
        <img :src="arrowDownIcon" alt="move down" class="swap-icon" />
      </button>
    </div>
    <button class="swap-btn remove-btn" @click="emit('remove')" title="Remove">
      <img :src="deleteIcon" alt="delete" class="swap-icon" />
    </button>
  </div>
</template>

<style scoped>
.ingredient-row {
  display: flex;
  gap: 1rem;
  margin-left: 2rem;
  align-items: center;
}

.select-wrapper {
  position: relative;
  height: 56px;
  display: inline-flex;
  align-items: center;
  min-width: 88px;
}

.select {
  height: 100%;
  width: 100%;
  padding: 0 40px 0 16px;
  border: 1px solid var(--md-sys-color-outline);
  border-radius: 4px;
  background: transparent;
  color: var(--md-sys-color-on-surface);
  font: var(--md-sys-typescale-body-large-weight)
    var(--md-sys-typescale-body-large-size)
    var(--md-sys-typescale-body-large-font);
  cursor: pointer;
  outline: none;
  appearance: none;
}

.select:hover {
  border-color: var(--md-sys-color-on-surface);
}

.select:focus {
  border: 2px solid var(--md-sys-color-primary);
  padding-left: 15px;
}

.select:focus + .select-label {
  color: var(--md-sys-color-primary);
}
.select:focus ~ .select-arrow {
  fill: var(--md-sys-color-primary);
}

.select-label {
  position: absolute;
  top: -0.55rem;
  left: 12px;
  padding: 0 4px;
  font-size: 0.75rem;
  color: var(--md-sys-color-on-surface-variant);
  background: var(--md-sys-color-surface);
  pointer-events: none;
  line-height: 1;
}

.select-arrow {
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
  fill: var(--md-sys-color-on-surface-variant);
  pointer-events: none;
}

.swap-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.swap-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  transition: background 0.15s;
}

.swap-btn:hover {
  background: var(--md-sys-color-surface-variant);
}

.swap-icon {
  width: 20px;
  height: 20px;
}

.remove-btn {
  color: var(--md-sys-color-error);
}
</style>
