<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import RecipeObject from '../components/RecipeObject.vue';
import { useRecipeListStore } from '../../../recipes/list/src/stores/useRecipeListStore';

const store = useRecipeListStore();
const searchQuery = ref('');

onMounted(() => store.fetchRecipes());

const filteredRecipes = computed(() => {
  return store.recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});
</script>

<template>
  <div class="recipe-page-container">
    <div class="recipe-searchbar">
      <md-outlined-text-field
        placeholder="Search for recipes"
        type="search"
        v-model="searchQuery"
      >
        <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
        <span slot="trailing-icon">
          <md-icon>search</md-icon>
        </span>
      </md-outlined-text-field>
    </div>
    <div class="recipe-page-description">
      Hungry for something new? Get inspired!
    </div>
    <div class="all-recipes">
      <RecipeObject
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<style scoped>
.recipe-page-container {
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.all-recipes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  justify-content: center;
  align-items: center;
  grid-gap: 1rem;
}
</style>
