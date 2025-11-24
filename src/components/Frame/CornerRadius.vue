<template>
  <div class="corner-wrapper">
    <div class="corner-curve"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.corner-wrapper {
  width: 1rem;
  height: 1rem;

  background-color: var(--md-sys-color-surface);
  position: relative;
  overflow: hidden;
}

.corner-curve {
  width: 100%;
  height: 100%;

  background-color: #fff;
  border-top-left-radius: 1rem;
}
</style>
