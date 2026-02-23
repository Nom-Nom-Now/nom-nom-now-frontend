<template>
  <div class="viewContainer">
    <CreateRecipeProgressBar  />
  </div>

</template>

<script setup lang="ts">

import CreateRecipeProgressBar from '../feature/recipes/create/src/components/CreateRecipeProgressBar.vue';
</script>

<style scoped>
.viewContainer {
  display: flex;
  height: 100%;
  width: 100%;

  margin: 1rem;
}
</style>