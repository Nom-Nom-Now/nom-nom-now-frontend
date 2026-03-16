<script setup lang="ts">
const unitOptions = [
  { label: 'g', value: 'GRAM' },
  { label: 'kg', value: 'KILOGRAM' },
  { label: 'ml', value: 'MILLILITER' },
  { label: 'l', value: 'LITER' },
  { label: 'Stück', value: 'PIECE' },
  { label: 'TL', value: 'TEASPOON' },
  { label: 'EL', value: 'TABLESPOON' },
]
</script>

<template>
  <div class="ingredient-row">
    <md-outlined-text-field label="Amount"></md-outlined-text-field>
    <div class="select-wrapper">
      <select class="select">
        <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">
          {{ unit.label }}
        </option>
      </select>
      <span class="select-label">Unit</span>
      <svg class="select-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
    <md-outlined-text-field label="Ingredient"></md-outlined-text-field>
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
  font: var(--md-sys-typescale-body-large-weight) var(--md-sys-typescale-body-large-size) var(--md-sys-typescale-body-large-font);
  cursor: pointer;
  outline: none;
  appearance: none;
}

.select:hover { border-color: var(--md-sys-color-on-surface); }

.select:focus {
  border: 2px solid var(--md-sys-color-primary);
  padding-left: 15px;
}

.select:focus + .select-label { color: var(--md-sys-color-primary); }
.select:focus ~ .select-arrow { fill: var(--md-sys-color-primary); }

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
</style>