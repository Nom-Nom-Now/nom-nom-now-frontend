<script setup lang="ts">

</script>

<template>
  <div class="ingredient-row">
    <md-outlined-text-field label="Amount" ></md-outlined-text-field>
    <md-outlined-text-field label="Unit" ></md-outlined-text-field>
    <md-outlined-text-field label="Ingredient" ></md-outlined-text-field>
  </div>
</template>

<style scoped>

.ingredient-row {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-left: 2rem;
}

.ingredient-row md-outlined-text-field {

}

</style>