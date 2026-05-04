<template>
  <div class="recipes-list-container">
    <div class="top-bar">
      <RecipeSearchBar />
      <md-filled-button type="button" @click="navigateToCreate">{{
        t('feature.recipes.list.createButton')
      }}</md-filled-button>
    </div>
    <PlanGridContent
      :recipes="store.recipes"
      :is-loading="store.isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import PlanGridContent from './PlanGridContent.vue';
import { useRecipePlanStore } from '../stores/useRecipePlanStore.ts';

const router = useRouter();
const { t } = useI18n();
const store = useRecipePlanStore();

function navigateToCreate() {
  router.push('/recipes/create');
}

onMounted(() => {
  store.fetchRecipes();
});
</script>

<style scoped>
.recipes-list-container {
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-right: 2rem;
  flex-shrink: 0;
}

.top-bar md-filled-button {
  height: 3rem;
  --md-filled-button-container-shape: 16px;
}
</style>
