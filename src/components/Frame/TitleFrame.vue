<template>
  <div class="header-container">
    <md-tabs>
      <md-primary-tab>
        <span class="tab-title"> {{ pageTitle }} </span>
      </md-primary-tab>
    </md-tabs>

    <div class="user-profile" v-if="currentUsername">
      <span class="user-name">{{ currentUsername }}</span>
      <div class="avatar-badge">
        <md-icon>account_circle</md-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useAuth } from '../../composables/useAuth';

const route = useRoute();
const { t } = useI18n();

const { currentUsername } = useAuth();

const pageTitle = computed(() => {
  const key = route.meta.titleKey as string | undefined;
  return key ? t(key) : 'Nom Nom Now';
});
</script>

<style scoped>
.header-container {
  height: 4.5rem;
  background-color: var(--md-sys-color-surface);
  padding-left: 2rem;
  padding-right: 2rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.tab-title {
  font-size: var(--md-sys-typescale-title-large-size);
  line-height: var(--md-sys-typescale-title-large-line-height);
  color: var(--md-sys-color-on-surface-variant);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-family: inherit;
  font-size: var(--md-sys-typescale-body-medium-size);
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
}

.avatar-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-secondary);
  --md-icon-size: 28px;
}
</style>
