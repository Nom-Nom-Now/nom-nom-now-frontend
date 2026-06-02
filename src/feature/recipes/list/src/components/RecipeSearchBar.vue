<template>
  <label class="search-field">
    <md-icon>search</md-icon>
    <input
      v-model="query"
      :placeholder="t('feature.recipes.list.searchPlaceholder')"
      type="text"
    />
    <button
      v-if="query"
      type="button"
      class="clear-search-button"
      :aria-label="t('feature.recipes.list.filterClear')"
      @click="clearSearch"
    >
      <md-icon>close</md-icon>
    </button>
  </label>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  'update:search': [query: string];
}>();

const { t } = useI18n();
const query = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let skipNextWatch = false;

watch(query, (newValue) => {
  if (skipNextWatch) {
    skipNextWatch = false;
    return;
  }
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('update:search', newValue.trim());
  }, 300);
});

function clearSearch() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  skipNextWatch = true;
  query.value = '';
  emit('update:search', '');
}

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});
</script>

<style scoped>
.search-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1 1 20rem;
  max-width: 26rem;
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: var(--nnn-radius-pill);
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
}

.search-field md-icon {
  --md-icon-size: 22px;
  flex-shrink: 0;
}

.search-field input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--md-sys-color-on-surface);
  font: inherit;
  font-size: 0.95rem;
}

.search-field input::placeholder {
  color: var(--md-sys-color-on-surface-variant);
  opacity: 1;
}

.clear-search-button {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--md-sys-color-on-surface-variant);
  cursor: pointer;
}

.clear-search-button:hover {
  background-color: var(--md-sys-color-surface-container-highest);
}

.clear-search-button md-icon {
  --md-icon-size: 18px;
}
</style>
