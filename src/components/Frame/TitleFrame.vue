<template>
  <div>
    <md-primary-tab>Create Recipe</md-primary-tab>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
div {
  height: 4.5rem; /* 'em' zu 'rem' für Konsistenz */
  width: 100%; /* WICHTIG: Damit er die ganze Breite füllt */
  overflow: hidden;
  background-color: var(--md-sys-color-surface);

  /* Flexbox für saubere Ausrichtung von Logo und Text */
  display: flex;
  align-items: center; /* Vertikal zentrieren */
}
</style>
