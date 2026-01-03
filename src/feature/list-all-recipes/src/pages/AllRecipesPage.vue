<script setup lang="ts">
import {computed, onMounted, ref } from 'vue';
import type { RecipeList } from '../types/types.ts';
import RecipeObject from '../components/RecipeObject.vue';

const baseUrl = 'http://localhost:8080/';
const recipeList = ref<RecipeList>([]);
const searchQuery = ref('');

async function getAllRecipes() {
  const response = await fetch(baseUrl + 'recipes');

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  recipeList.value = await response.json();
}

onMounted(() => getAllRecipes());

const filteredRecipes = computed(() => {
  if (!recipeList.value) return recipeList.value;
  return recipeList.value.filter(recipe => recipe.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});
</script>

<template>
  <div class="recipe-page-container">
    <div class="recipe-searchbar">
      <md-outlined-text-field placeholder="Search for recipes" type="search" v-model="searchQuery">
        <md-icon slot="trailing-icon">search</md-icon>
      </md-outlined-text-field>
    </div>
    <div class="recipe-page-description">
      Hungry for something new? Get inspired!
    </div>
    <div class="all-recipes">
      <RecipeObject
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :id="recipe.id"
        :name="recipe.name"
        :instructions="recipe.instructions"
        :cookingTime="recipe.cookingTime"
        :categories="recipe.categories"
        :components="recipe.components"
      >
      </RecipeObject>
    </div>
  </div>
</template>

<style scoped>
.recipe-page-container {
  background: #ffffff;
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
