<template>
  <div>
    <md-tabs>
      <md-primary-tab>
        <span class="tab-title"> {{ t('feature.mainPage.helloWorld') }} </span>
        <!-- TODO: Tab Title so anpassen, dass aktuelle Seite mitgegeben wird -->
      </md-primary-tab>
    </md-tabs>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
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
