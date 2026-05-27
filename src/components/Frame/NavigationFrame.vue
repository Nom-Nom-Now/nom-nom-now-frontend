<template>
  <nav class="nav-bar">
    <div class="top-section">
      <img class="logo" src="../../assets/Logo.png" alt="Nom Nom Now" />
      <ul>
        <li v-for="item in navigationItems" :key="item.textKey">
          <RouterLink
            :to="item.to"
            class="nav-link"
            active-class="nav-link-active"
          >
            <NavigationItem :text="t(item.textKey)" :icon-name="item.iconName" />
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="lang-selector-wrapper">
      <md-icon class="lang-icon">language</md-icon>

      <select
        v-model="locale"
        class="lang-select"
        :title="t('languages.title')"
      >
        <option v-for="langCode in availableLanguageCodes" :key="langCode" :value="langCode">
          {{ t(`languages.${langCode}`) }}
        </option>
      </select>
    </div>
  </nav>
</template>

<script setup lang="ts">
import NavigationItem from './NavigationItem.vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const navigationItems = [
  { textKey: 'navigation.home', iconName: 'home_24dp_1F1F1F', to: '/home' },
  { textKey: 'navigation.plan', iconName: 'calendar_meal_24dp_1F1F1F', to: '/plan' },
  { textKey: 'navigation.recipes', iconName: 'chef_hat_24dp_1F1F1F', to: '/recipes' },
  { textKey: 'navigation.browse', iconName: 'wb_incandescent_24dp_1F1F1F', to: '/browse' },
];
const availableLanguageCodes = ['de', 'en'];
</script>

<style scoped>
.nav-bar {
  width: 5.5rem;
  height: 100vh;
  background-color: var(--md-sys-color-surface);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding-bottom: 2rem;
}

.top-section {
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

.logo {
  height: 4rem;
  width: 4rem;
  display: flex;
  margin: auto;
  margin-top: 0.5rem;
}

.lang-selector-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
}

.lang-icon {
  color: var(--md-sys-color-on-surface-variant);
  pointer-events: none;
  margin-bottom: 0.25rem;
}

.lang-select {
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--md-sys-color-on-surface-variant);
  background: transparent;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 4px;
  padding: 0.2rem 0.4rem;
  cursor: pointer;
  outline: none;
  text-align: center;
  text-align-last: center;
}

.lang-select:hover {
  background-color: var(--md-sys-color-surface-variant);
  border-color: var(--md-sys-color-outline);
}
</style>