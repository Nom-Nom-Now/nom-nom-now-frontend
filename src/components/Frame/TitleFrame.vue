<template>
  <div>
    <md-tabs>
      <md-primary-tab>
        <span class="tab-title"> {{ pageTitle }} </span>
      </md-primary-tab>
    </md-tabs>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const route = useRoute();
const { t } = useI18n();

const pageTitle = computed(() => {
  const key = route.meta.titleKey as string | undefined;
  return key ? t(key) : 'Nom Nom Now';
});</script>

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
