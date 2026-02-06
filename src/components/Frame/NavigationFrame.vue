<template>
  <nav class="nav-bar">
    <img class="logo" src="../../assets/Logo.png" />
    <ul>
      <li v-for="item in navigationItems" :key="item.textKey">
        <RouterLink :to="item.to" class="nav-link" active-class="active-link">
          <NavigationItem :text="t(item.textKey)" :icon-name="item.iconName" />
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import NavigationItem from './NavigationItem.vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const navigationItems = [
  { textKey: 'navigation.home', iconName: 'home_24dp_1F1F1F', to: '/' },
  { textKey: 'navigation.plan', iconName: 'calendar_meal_24dp_1F1F1F', to: '/plan' },
  { textKey: 'navigation.recipes', iconName: 'chef_hat_24dp_1F1F1F', to: '/recipes' },
  { textKey: 'navigation.browse', iconName: 'wb_incandescent_24dp_1F1F1F', to: '/browse' },
];
</script>

<style scoped>
.nav-bar {
  width: 5.5rem;
  background-color: var(--md-sys-color-surface);
  overflow-y: auto;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 5.5rem;
}

ul li {
  padding-top: 2rem;
}

.nav-link {
  display: block;
  color: var(--md-sys-color-secondary);
  text-decoration: none;
}

.nav-link:not(.active-link):hover :deep(.icon-badge) {
  background-color: var(--md-sys-color-surface-variant);
}

.active-link :deep(.icon-badge) {
  background-color: var(--md-sys-color-secondary-container);
}

.logo {
  height: 4rem;
  width: 4rem;
  display: flex;
  margin: auto;
  margin-top: 0.5rem;
}
</style>
