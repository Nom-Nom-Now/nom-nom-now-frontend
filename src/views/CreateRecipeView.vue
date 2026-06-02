<template>
  <div class="viewContainer">
    <CreateRecipeProgressBar />
  </div>
</template>

<script setup lang="ts">
import CreateRecipeProgressBar from '../feature/recipes/create/src/components/CreateRecipeProgressBar.vue';
</script>

<style scoped>
.viewContainer {
  display: flex;
  height: 100%;
  min-height: 0;
  width: 100%;
  padding: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
