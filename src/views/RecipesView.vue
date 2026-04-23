<template>
  <router-view v-if="hasChildRoute" />
  <ListRecipesPage v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ListRecipesPage from '../feature/recipes/list/src/pages/ListRecipesPage.vue';

const route = useRoute();
const hasChildRoute = computed(() => route.matched.length > 1);
</script>

<style scoped></style>
