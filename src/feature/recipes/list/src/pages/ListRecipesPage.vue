<template>
  <div class="list-recipes-page">
    <RecipesListFrame />
  </div>
</template>

<script setup lang="ts">
import RecipesListFrame from '../components/RecipesListFrame.vue';
</script>

<style scoped>
.list-recipes-page {
  width: 100%;
  align-self: flex-start;
}
</style>
