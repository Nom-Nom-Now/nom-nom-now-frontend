<template>
  <div v-if="showShell" class="app-layout">
    <aside class="aside">
      <NavigationFrame />
    </aside>

    <div class="main-section">
      <header class="header">
        <TitleFrame />
        <CornerRadius />
      </header>

      <main class="content-area">
        <div class="content-box">
          <router-view />
        </div>
      </main>
    </div>
  </div>

  <main v-else class="auth-layout">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavigationFrame from './components/Frame/NavigationFrame.vue';
import TitleFrame from './components/Frame/TitleFrame.vue';
import CornerRadius from './components/Frame/CornerRadius.vue';

const route = useRoute();
const showShell = computed(() => !route.meta.hideShell);
</script>

<style scoped>
.app-layout {
  display: flex;
  overflow: hidden;
  height: 100%;
}

.auth-layout {
  width: 100%;
  height: 100%;
}

aside {
  width: 5.5rem;
  flex-shrink: 0;
  min-height: 100vh;
  background-color: var(--md-sys-color-surface);
  overflow-y: auto;
}

.main-section {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex-grow: 1;
}

.content-area {
  padding: 0 1rem 1rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-box {
  display: flex;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  background-color: var(--md-sys-color-surface);
  overflow: auto;
}
</style>
