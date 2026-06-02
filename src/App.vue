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
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavigationFrame from './components/Frame/NavigationFrame.vue';
import TitleFrame from './components/Frame/TitleFrame.vue';
import CornerRadius from './components/Frame/CornerRadius.vue';
import { useAuth } from './composables/useAuth';

const route = useRoute();
const showShell = computed(
  () =>
    route.matched.length > 0 &&
    !route.matched.some((record) => record.meta.hideShell),
);

const { loadCurrentUser } = useAuth();

onMounted(() => {
  if (showShell.value) {
    loadCurrentUser();
  }
});

watch(
  () => route.fullPath,
  () => {
    if (showShell.value) {
      loadCurrentUser();
    }
  },
);
</script>

<style scoped>
.app-layout {
  display: flex;
  overflow: hidden;
  height: 100dvh;
  background-color: var(--md-sys-color-background);
}

.auth-layout {
  width: 100%;
  height: 100%;
}

.aside {
  width: 6rem;
  flex-shrink: 0;
  background-color: var(--md-sys-color-surface);
  overflow-y: auto;
  overflow-x: hidden;
}

.main-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  flex-grow: 1;
  overflow: hidden;
}

.content-area {
  padding: 0 1rem 1rem;
  flex-grow: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  border-radius: var(--nnn-radius-md);
  background-color: var(--md-sys-color-surface-container-lowest);
  overflow-x: hidden;
  overflow-y: auto;
}

@media (max-width: 760px) {
  .aside {
    width: 5rem;
  }

  .content-area {
    padding: 0 0.75rem 0.75rem;
  }
}
</style>
