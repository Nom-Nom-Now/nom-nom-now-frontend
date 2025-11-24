<template>
  <div>
    <md-tabs>
      <md-primary-tab>
        <span class="tab-title"> {{ pageTitle }} </span>
        <!-- TODO: Tab Title so anpassen, dass aktuelle Seite mitgegeben wird -->
      </md-primary-tab>
    </md-tabs>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const pageTitle = computed(() => (route.meta.title as string) ?? 'Nom Nom Now');
</script>

<style scoped>
div {
  height: 4.5rem;
  background-color: var(--md-sys-color-surface);
  padding-left: 2rem;

  display: flex;
  align-items: center;
}

.tab-title {
  font-size: var(--md-sys-typescale-title-large-size);
  line-height: var(--md-sys-typescale-title-large-line-height);

  color: var(--md-sys-color-on-surface-variant);
}
</style>
