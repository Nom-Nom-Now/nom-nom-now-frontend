<template>
  <div>
    <md-filled-text-field
      placeholder="Search Recipes"
      type="search"
      class="search-field"
      no-asterisk
    >
      <md-icon slot="leading-icon">search</md-icon>
    </md-filled-text-field>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.search-field {
  width: 25rem;
  height: 3rem;
  --md-filled-text-field-container-shape: 16px;
  --md-filled-text-field-active-indicator-height: 0px;
  --md-filled-text-field-hover-active-indicator-height: 0px;
  --md-filled-text-field-focus-active-indicator-height: 0px;
}
</style>