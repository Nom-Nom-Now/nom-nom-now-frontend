<script setup lang="ts">

import MdLabel from "../../../../../../components/MdLabel.vue";
</script>

<template>
  <div class="frame">

    <md-tabs>
      <MdLabel size="large">
        Test
      </MdLabel>
    </md-tabs>
  </div>
</template>

<style scoped>
.frame {
  display: flex;
  background-color: var(--md-sys-color-surface-container);
}

md-icon {
  color: var(--md-sys-color-primary);
  font-size: 24px;

  font-variation-settings:
      'FILL' 1,
      'wght' 400;
}
</style>