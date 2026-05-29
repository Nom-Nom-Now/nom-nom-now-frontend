<template>
  <div class="list-recipes-page">
    <PlanFrame />
  </div>
</template>

<script setup lang="ts">
import PlanFrame from '../components/PlanFrame.vue';
</script>

<style scoped>
.list-recipes-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
