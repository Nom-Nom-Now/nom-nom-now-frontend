<script setup lang="ts">
import type { Recipe } from '../types/types.ts';

const props = defineProps<Recipe>();
</script>

<template>
  <div class="recipe-object-container">
    <div class="recipe-object-title">
      <h2>{{ props.name }}</h2>
    </div>
    <div class="recipe-object-picture">Here is giong to be a picture</div>
    <div class="recipe-object-content">
      <div class="recipe-object-description">
        Hier könnte später eine Beschreibung stehen
      </div>
      <div class="cooking-time">
        Cooking time: {{ props.cookingTime }} minuten
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-object-container {
  background: #e8def8;
  border-radius: 1rem;
  padding: 0.3rem;
  border-color: #888888;
  border-style: solid;
}
.recipe-object-picture{
  background: #894545;
  border-radius: 1rem;
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
