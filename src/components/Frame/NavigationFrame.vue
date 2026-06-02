<template>
  <nav class="nav-bar">
    <div class="top-section">
      <img class="logo" src="/app-icon.svg" alt="Nom Nom Now" />
      <ul>
        <li v-for="item in navigationItems" :key="item.textKey">
          <RouterLink
            :to="item.to"
            class="nav-link"
            active-class="nav-link-active"
          >
            <NavigationItem
              :text="t(item.textKey)"
              :icon-name="item.iconName"
            />
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
        <option
          v-for="langCode in availableLanguageCodes"
          :key="langCode"
          :value="langCode"
        >
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
  {
    textKey: 'navigation.recipes',
    iconName: 'chef_hat_24dp_1F1F1F',
    to: '/recipes',
  },
  {
    textKey: 'navigation.plan',
    iconName: 'calendar_meal_24dp_1F1F1F',
    to: '/plan',
  },
  {
    textKey: 'navigation.shoppingLists',
    iconName: 'shopping_list_24dp_1F1F1F',
    to: '/shopping-lists',
  },
];
const availableLanguageCodes = ['de', 'en'];
</script>

<style scoped>
.nav-bar {
  width: 6rem;
  height: 100vh;
  background-color: var(--md-sys-color-surface);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0.75rem 0 1.5rem;
  overflow-x: hidden;
}

.top-section {
  overflow-y: auto;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

ul li {
  padding: 0;
}

.nav-link {
  display: flex;
  justify-content: center;
  padding: 0.4rem 0;
  color: var(--md-sys-color-on-surface-variant);
  text-decoration: none;
  cursor: pointer;
}

.logo {
  height: 3rem;
  width: 3rem;
  display: flex;
  object-fit: cover;
  margin: auto;
  margin-bottom: 0.5rem;
  border-radius: 0.75rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--md-sys-color-on-surface-variant);
  background: transparent;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--nnn-radius-xs);
  padding: 0.2rem 0.4rem;
  cursor: pointer;
  outline: none;
  text-align: center;
  text-align-last: center;
}

.nav-link:not(.nav-link-active):hover :deep(.icon-badge) {
  background-color: var(--md-sys-color-surface-variant);
}

.nav-link-active {
  color: var(--md-sys-color-on-surface);
}

.nav-link-active :deep(.icon-badge) {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

.lang-select:hover {
  background-color: var(--md-sys-color-surface-variant);
  border-color: var(--md-sys-color-outline);
}

@media (max-width: 760px) {
  .nav-bar,
  ul {
    width: 5rem;
  }
}
</style>
