<template>
  <aside>
    <NavigationFrame />
  </aside>
  <header>
    <TitleFrame />
  </header>
</template>

<script setup lang="ts">
import TitleFrame from './TitleFrame.vue';
import NavigationFrame from './NavigationFrame.vue';
</script>

<style scoped>
aside {
  width: 5.5rem;
  background-color: var(--md-sys-color-surface);
  overflow-y: auto;
}

section {
  height: 4.5rem;
  overflow-x: auto;
  max-height: fit-content;
}
</style>
