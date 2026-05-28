<template>
  <div>
    <md-filled-text-field
      v-model="query"
      placeholder="Search Recipes"
      type="text"
      class="search-field"
      no-asterisk
    >
      <md-icon slot="leading-icon">search</md-icon>
      <md-icon-button
        v-if="query"
        slot="trailing-icon"
        @click="clearSearch"
      >
        <md-icon>close</md-icon>
      </md-icon-button>
    </md-filled-text-field>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const emit = defineEmits<{
  'update:search': [query: string];
}>();

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
  width: 25rem;
  height: 3rem;
  --md-filled-text-field-container-shape: 16px;
  --md-filled-text-field-active-indicator-height: 0px;
  --md-filled-text-field-hover-active-indicator-height: 0px;
  --md-filled-text-field-focus-active-indicator-height: 0px;
}
</style>
