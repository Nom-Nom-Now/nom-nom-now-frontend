<template>
  <div class="recipes-list-container">
    <RecipeSearchBar />
  </div>
</template>

<script setup lang="ts">
import RecipeSearchBar from './RecipeSearchBar.vue';
</script>

<style scoped>
.recipes-list-container {
  width: 100%;
  padding: 1rem;
}
</style>
