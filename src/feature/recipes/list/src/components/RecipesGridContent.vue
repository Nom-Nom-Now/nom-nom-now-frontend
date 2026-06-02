<template>
  <div ref="scrollContainer" class="recipes-grid-scroll">
    <div v-if="isLoading && recipes.length === 0" class="loading">Laden...</div>
    <div v-else-if="error && recipes.length === 0" class="status status--error">
      {{ error }}
    </div>
    <div v-else-if="recipes.length === 0" class="status">
      {{
        props.searchQuery
          ? `Keine Rezepte für "${props.searchQuery}" gefunden.`
          : 'Keine Rezepte vorhanden.'
      }}
    </div>

    <div class="recipes-grid">
      <RecipeBox
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        @select="selectedRecipe = recipe"
      />
    </div>

    <div ref="loadMoreSentinel" class="load-more-sentinel" />
    <div v-if="isLoading && recipes.length > 0" class="loading">Laden...</div>
    <div v-if="error && recipes.length > 0" class="status status--error">
      {{ error }}
    </div>

    <RecipeDetailPage
      v-if="selectedRecipe"
      :recipe="selectedRecipe"
      @close="selectedRecipe = null"
      @fullscreen="switchToFullscreen"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import RecipeBox from './RecipeBox.vue';
import type { Recipe } from '../shared/types';
import RecipeDetailPage from '../../../detail/src/components/RecipeDetailPage.vue';

const props = defineProps<{
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  canLoadMore: boolean;
  searchQuery?: string;
}>();

const emit = defineEmits<{
  loadMore: [];
  openFullscreen: [recipe: Recipe];
}>();

const selectedRecipe = ref<Recipe | null>(null);

function switchToFullscreen() {
  if (selectedRecipe.value) {
    emit('openFullscreen', selectedRecipe.value);
    selectedRecipe.value = null; // Popup schließen
  }
}

const loadMoreSentinel = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;
let underfilledCheckQueued = false;

function maybeLoadMore(entries: IntersectionObserverEntry[]) {
  if (entries.some((entry) => entry.isIntersecting) && shouldLoadMore()) {
    emit('loadMore');
  }
}

function shouldLoadMore() {
  return (
    props.recipes.length > 0 &&
    props.canLoadMore &&
    !props.isLoading &&
    !props.error
  );
}

function queueUnderfilledLoadCheck() {
  if (underfilledCheckQueued) return;
  underfilledCheckQueued = true;

  nextTick(() => {
    underfilledCheckQueued = false;
    const container = scrollContainer.value;

    if (!container || !shouldLoadMore()) return;

    const hasScrollableOverflow =
      container.scrollHeight > container.clientHeight + 2;

    if (!hasScrollableOverflow) {
      emit('loadMore');
    }
  });
}

function connectObserver() {
  observer?.disconnect();
  if (!loadMoreSentinel.value || !scrollContainer.value) return;
  observer = new IntersectionObserver(maybeLoadMore, {
    root: scrollContainer.value,
    rootMargin: '320px',
  });
  observer.observe(loadMoreSentinel.value);
}

function connectResizeObserver() {
  resizeObserver?.disconnect();
  if (!scrollContainer.value || typeof ResizeObserver === 'undefined') return;

  resizeObserver = new ResizeObserver(queueUnderfilledLoadCheck);
  resizeObserver.observe(scrollContainer.value);
}

onMounted(() => {
  connectObserver();
  connectResizeObserver();
  window.addEventListener('resize', queueUnderfilledLoadCheck);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  resizeObserver?.disconnect();
  window.removeEventListener('resize', queueUnderfilledLoadCheck);
});
watch(loadMoreSentinel, connectObserver);
watch(scrollContainer, () => {
  connectObserver();
  connectResizeObserver();
});
watch(
  () => [
    props.recipes.length,
    props.isLoading,
    props.canLoadMore,
    props.error,
    props.searchQuery,
  ],
  queueUnderfilledLoadCheck,
  { flush: 'post' },
);
</script>

<style scoped>
.recipes-grid-scroll {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 1rem 0.25rem 0.5rem;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  grid-auto-rows: 24rem;
  gap: 1.25rem;
}

.loading,
.status {
  margin-top: 1rem;
  text-align: center;
  color: var(--md-sys-color-on-surface-variant);
}
.status--error {
  color: var(--md-sys-color-error);
}
.load-more-sentinel {
  height: 1px;
}
</style>
