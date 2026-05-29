<template>
  <div class="recipes-list-container plan-wrapper-relative">
    <div class="top-bar">
      <div class="week-navigation">
        <md-outlined-button @click="goToToday">
          {{ t('feature.plan.today') }}
        </md-outlined-button>
        <md-icon-button v-if="canGoToPreviousWeek" @click="goToPreviousWeek">
          <md-icon>chevron_left</md-icon>
        </md-icon-button>
        <span class="current-date">{{ formattedWeekRange }}</span>
        <md-icon-button v-if="canGoToNextWeek" @click="goToNextWeek">
          <md-icon>chevron_right</md-icon>
        </md-icon-button>
      </div>
      <md-filled-button type="button" @click="refreshPlan">
        <md-icon slot="icon">refresh</md-icon>
        {{ t('feature.plan.refreshPlan') }}
      </md-filled-button>
    </div>

    <PlanGridContent
      :recipes="store.recipes"
      :is-loading="store.isLoading"
      :error="store.error"
      :current-week="currentWeekStart"
      @open-fullscreen="handleOpenFullscreen"
    />

    <div v-if="fullscreenRecipe" class="local-fullscreen-container">
      <RecipeDetailFull
        :recipe="fullscreenRecipe"
        :current-username="currentUsername?.valueOf()"
        @close="handleCloseFullscreen"
        @edit="handleEditRecipe"
        @delete="handleDeleteRecipe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PlanGridContent from './PlanGridContent.vue';
import RecipeDetailFull from '../../../recipes/detail/src/components/RecipeDetailFull.vue';
import { useRecipePlanStore } from '../stores/useRecipePlanStore.ts';
import { fetchAccountCreatedAt } from '../services/authService.ts';
import type { Recipe } from '../shared/types';

const { t } = useI18n();
const store = useRecipePlanStore();

const currentWeekStart = ref(getStartOfWeek(new Date()));
const accountCreatedAt = ref<Date | undefined>();

const currentUsername = inject<Ref<string | undefined>>('currentUsername');
const fullscreenRecipe = ref<Recipe | null>(null);

function handleOpenFullscreen(recipe: Recipe) {
  fullscreenRecipe.value = recipe;
}

function handleCloseFullscreen() {
  fullscreenRecipe.value = null;
}

function handleEditRecipe(recipe: Recipe) {
  console.log('edit im plan aufgerufen', recipe);
}

function handleDeleteRecipe(recipeId: string) {
  console.log('delete im plan aufgerufen für Rezept-ID:', recipeId);
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setHours(0, 0, 0, 0);
  return new Date(d.setDate(diff));
}

const minPastWeekStart = computed(() => {
  if (!accountCreatedAt.value) {
    return getStartOfWeek(new Date());
  }
  return getStartOfWeek(accountCreatedAt.value);
});

const maxFutureWeekStart = computed(() => {
  const nextWeek = getStartOfWeek(new Date());
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek;
});

const canGoToPreviousWeek = computed(() => {
  return currentWeekStart.value.getTime() > minPastWeekStart.value.getTime();
});

const canGoToNextWeek = computed(() => {
  return currentWeekStart.value.getTime() < maxFutureWeekStart.value.getTime();
});

async function loadPlanForCurrentWeek(forceRandom = false) {
  await store.fetchRecipes(
    currentWeekStart.value,
    accountCreatedAt.value,
    forceRandom,
  );
}

async function goToToday() {
  currentWeekStart.value = getStartOfWeek(new Date());
  await loadPlanForCurrentWeek();
}

async function goToPreviousWeek() {
  if (!canGoToPreviousWeek.value) {
    return;
  }

  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 7);
  currentWeekStart.value = newDate;
  await loadPlanForCurrentWeek();
}

async function goToNextWeek() {
  if (!canGoToNextWeek.value) {
    return;
  }

  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 7);
  currentWeekStart.value = newDate;
  await loadPlanForCurrentWeek();
}

const formattedWeekRange = computed(() => {
  const start = new Date(currentWeekStart.value);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const monthFormatter = new Intl.DateTimeFormat('de-DE', { month: 'long' });

  if (start.getMonth() === end.getMonth()) {
    return monthFormatter.format(start);
  }

  return `${monthFormatter.format(start)} - ${monthFormatter.format(end)}`;
});

async function refreshPlan() {
  await loadPlanForCurrentWeek(true);
}

async function initializePlan() {
  try {
    accountCreatedAt.value = await fetchAccountCreatedAt();
  } catch {
    accountCreatedAt.value = undefined;
  }

  await loadPlanForCurrentWeek();
}

onMounted(initializePlan);
</script>

<style scoped>
.recipes-list-container {
  position: relative;
  width: 100%;

  flex-grow: 1;
  min-height: 31.25rem;

  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

:deep(.plan-week-view) {
  flex-grow: 1;
  min-height: 0;
}

.local-fullscreen-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: var(--md-sys-color-background);
  box-sizing: border-box;
}

.week-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-date {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
  min-width: 12rem;
  text-align: center;
}

.top-bar md-filled-button,
.top-bar md-outlined-button {
  height: 3rem;
  --md-filled-button-container-shape: 1rem;
  --md-outlined-button-container-shape: 1rem;
}
</style>
