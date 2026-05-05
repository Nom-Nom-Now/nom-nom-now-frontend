<template>
  <div class="viewContainer">
    <div v-if="store.isLoadingRecipe" class="loading">
      Rezept wird geladen...
    </div>
    <div v-else-if="store.submitError" class="error">
      {{ store.submitError }}
    </div>
    <CreateRecipeProgressBar v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCreateRecipeStore } from '../feature/recipes/create/src/stores/useCreateRecipeStore';
import CreateRecipeProgressBar from '../feature/recipes/create/src/components/CreateRecipeProgressBar.vue';

const route = useRoute();
const router = useRouter();
const store = useCreateRecipeStore();

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id || isNaN(id)) {
    router.replace('/recipes');
    return;
  }
  try {
    await store.loadRecipe(id);
  } catch {
    // Fehler wird im Store gesetzt
  }
});
</script>

<style scoped>
.viewContainer {
  display: flex;
  height: 100%;
  width: 100%;
  margin: 1rem;
}

.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem;
  font: var(--md-sys-typescale-body-large-weight)
    var(--md-sys-typescale-body-large-size)
    var(--md-sys-typescale-body-large-font);
}

.error {
  color: var(--md-sys-color-error);
}
</style>
