<template>
  <div class="home-dashboard">
    <section class="today-panel">
      <div class="panel-copy">
        <span class="eyebrow">{{ t('feature.home.todayEyebrow') }}</span>
        <h2>{{ t('feature.home.todayTitle') }}</h2>
        <p v-if="todayRecipe" class="today-recipe-title">
          {{ todayRecipe.title }}
        </p>
        <p v-else class="muted">
          {{ planError || t('feature.home.noTodayRecipe') }}
        </p>

        <div v-if="todayRecipe" class="recipe-meta">
          <span>{{ todayRecipe.duration }}</span>
          <span>{{ todayRecipe.cost }}</span>
        </div>

        <md-filled-button type="button" @click="navigateTo('/plan')">
          <md-icon slot="icon">calendar_month</md-icon>
          {{ t('feature.home.openPlan') }}
        </md-filled-button>
      </div>

      <div class="today-image-frame">
        <img
          v-if="todayRecipe?.imageUrl"
          :src="todayRecipe.imageUrl"
          :alt="todayRecipe.title"
        />
        <md-icon v-else>restaurant</md-icon>
      </div>
    </section>

    <section class="week-panel">
      <div class="section-header">
        <h3>{{ t('feature.home.weekTitle') }}</h3>
        <md-text-button type="button" @click="navigateTo('/plan')">
          {{ t('feature.home.viewAll') }}
        </md-text-button>
      </div>

      <div v-if="isPlanLoading" class="status">
        {{ t('feature.home.loadingPlan') }}
      </div>
      <div v-else class="week-strip">
        <article
          v-for="day in weekDays"
          :key="day.key"
          class="day-summary"
          :class="{ 'is-today': day.isToday }"
        >
          <span class="day-name">{{ day.name }}</span>
          <span class="day-date">{{ day.dateNum }}</span>
          <strong>{{ day.recipeTitle || t('feature.home.noRecipe') }}</strong>
        </article>
      </div>
    </section>

    <section class="shopping-panel">
      <div class="section-header">
        <h3>{{ t('feature.home.shoppingTitle') }}</h3>
        <md-text-button type="button" @click="navigateTo('/shopping-lists')">
          {{ t('feature.home.openShoppingLists') }}
        </md-text-button>
      </div>

      <div v-if="isShoppingListsLoading" class="status">
        {{ t('feature.home.loadingShoppingLists') }}
      </div>
      <div v-else-if="latestShoppingList" class="shopping-summary">
        <span class="shopping-week">
          {{ formatWeek(latestShoppingList.weekStart) }}
        </span>
        <strong>
          {{
            t('feature.shoppingLists.itemCount', {
              count: latestShoppingList.itemCount,
            })
          }}
        </strong>
        <span class="muted">{{
          formatCreatedAt(latestShoppingList.createdAt)
        }}</span>
      </div>
      <div v-else class="status">
        {{ shoppingListsError || t('feature.home.noShoppingList') }}
      </div>
    </section>

    <section class="actions-panel">
      <h3>{{ t('feature.home.actionsTitle') }}</h3>
      <div class="action-grid">
        <md-outlined-button
          type="button"
          @click="navigateTo('/recipes/create')"
        >
          <md-icon slot="icon">add</md-icon>
          {{ t('feature.home.createRecipe') }}
        </md-outlined-button>
        <md-outlined-button type="button" @click="navigateTo('/recipes')">
          <md-icon slot="icon">menu_book</md-icon>
          {{ t('feature.home.browseRecipes') }}
        </md-outlined-button>
        <md-outlined-button type="button" @click="navigateTo('/plan')">
          <md-icon slot="icon">calendar_month</md-icon>
          {{ t('feature.home.openPlan') }}
        </md-outlined-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  fetchWeeklyRecipePlan,
  formatDateOnly,
  type RecipePlanResponseDto,
} from '../../../plan/src/services/WeeklyRecipePlanService';
import {
  fetchShoppingLists,
  type ShoppingListSummaryDto,
} from '../../../shopping-lists/src/services/ShoppingListService';
import { resolveBackendResourceUrl } from '../../../recipes/list/src/stores/useRecipeListStore';

type HomeRecipe = {
  id: string;
  planDate: string;
  title: string;
  imageUrl: string | null;
  duration: string;
  cost: string;
};

const router = useRouter();
const { t, locale } = useI18n();

const weeklyRecipes = ref<HomeRecipe[]>([]);
const shoppingLists = ref<ShoppingListSummaryDto[]>([]);
const isPlanLoading = ref(false);
const isShoppingListsLoading = ref(false);
const planError = ref<string | null>(null);
const shoppingListsError = ref<string | null>(null);
const currentWeekStart = ref(getStartOfWeek(new Date()));
const todayKey = formatDateOnly(new Date());

const todayRecipe = computed(() =>
  weeklyRecipes.value.find((recipe) => recipe.planDate === todayKey),
);

const latestShoppingList = computed(() => shoppingLists.value[0] ?? null);

const weekDays = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return weekDayKeys.map((weekdayKey, index) => {
    const date = new Date(currentWeekStart.value);
    date.setDate(date.getDate() + index);

    const dayKey = formatDateOnly(date);
    const recipe = weeklyRecipes.value.find(
      (weeklyRecipe) => weeklyRecipe.planDate === dayKey,
    );

    return {
      key: dayKey,
      name: t(`common.weekdays.${weekdayKey}`),
      dateNum: date.getDate(),
      isToday: date.getTime() === today.getTime(),
      recipeTitle: recipe?.title,
    };
  });
});

onMounted(async () => {
  await Promise.all([loadWeeklyPlan(), loadShoppingLists()]);
});

async function loadWeeklyPlan() {
  isPlanLoading.value = true;
  planError.value = null;

  try {
    const plan = await fetchWeeklyRecipePlan(currentWeekStart.value);
    weeklyRecipes.value = plan
      .sort((left, right) => left.planDate.localeCompare(right.planDate))
      .map(mapRecipePlan);
  } catch (loadError) {
    planError.value =
      loadError instanceof Error
        ? loadError.message
        : 'Weekly plan could not be loaded.';
    weeklyRecipes.value = [];
  } finally {
    isPlanLoading.value = false;
  }
}

async function loadShoppingLists() {
  isShoppingListsLoading.value = true;
  shoppingListsError.value = null;

  try {
    shoppingLists.value = await fetchShoppingLists();
  } catch (loadError) {
    shoppingListsError.value =
      loadError instanceof Error
        ? loadError.message
        : 'Shopping lists could not be loaded.';
    shoppingLists.value = [];
  } finally {
    isShoppingListsLoading.value = false;
  }
}

function mapRecipePlan(plan: RecipePlanResponseDto): HomeRecipe {
  return {
    id: String(plan.recipe.id),
    planDate: plan.planDate,
    title: plan.recipe.name,
    imageUrl: resolveBackendResourceUrl(plan.recipe.imageUrl),
    duration: formatDuration(plan.recipe.cookingTime),
    cost: formatCost(plan.recipe.pricePerPerson),
  };
}

function navigateTo(path: string) {
  router.push(path);
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setHours(0, 0, 0, 0);
  return new Date(d.setDate(diff));
}

function formatWeek(weekStart: string) {
  const start = parseDateOnly(weekStart);
  const end = parseDateOnly(weekStart);
  end.setDate(end.getDate() + 6);

  return `${formatDate(start)} - ${formatDate(end)}`;
}

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(locale.value, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function parseDateOnly(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}

function formatDuration(cookingTime: number | null) {
  if (cookingTime === null) {
    return '-';
  }

  return `${cookingTime}min`;
}

function formatCost(pricePerPerson: number | null) {
  if (pricePerPerson === null) {
    return '-';
  }

  return `${(pricePerPerson / 100).toFixed(2)} EUR`;
}

const weekDayKeys = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
</script>

<style scoped>
.home-dashboard {
  width: 100%;
  min-height: 100%;
  padding: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(20rem, 0.7fr);
  grid-template-areas:
    'today shopping'
    'week actions';
  gap: 1rem;
  box-sizing: border-box;
}

.today-panel,
.week-panel,
.shopping-panel,
.actions-panel {
  border-radius: 8px;
  background-color: var(--md-sys-color-surface-container-lowest);
  border: 1px solid var(--md-sys-color-outline-variant);
}

.today-panel {
  grid-area: today;
  min-height: 18rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(12rem, 18rem);
  gap: 1.5rem;
  padding: 1.5rem;
  align-items: center;
}

.panel-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--md-sys-color-primary);
}

h2,
h3,
p {
  margin: 0;
}

h2 {
  font-size: 1.75rem;
  line-height: 1.15;
}

h3 {
  font-size: 1rem;
}

.today-recipe-title {
  font-size: 1.375rem;
  font-weight: 650;
}

.muted,
.status {
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-meta {
  display: flex;
  gap: 0.5rem;
  color: var(--md-sys-color-on-surface-variant);
}

.recipe-meta span,
.item-count {
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  background-color: var(--md-sys-color-surface-container-high);
}

.today-image-frame {
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  display: flex;
  align-items: center;
  justify-content: center;
}

.today-image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.today-image-frame md-icon {
  font-size: 4rem;
  width: 4rem;
  height: 4rem;
}

.week-panel {
  grid-area: week;
  padding: 1rem;
}

.shopping-panel {
  grid-area: shopping;
  padding: 1rem;
}

.actions-panel {
  grid-area: actions;
  padding: 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.week-strip {
  display: grid;
  grid-template-columns: repeat(7, minmax(6.5rem, 1fr));
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.day-summary {
  min-height: 7rem;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: var(--md-sys-color-surface-container-low);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.day-summary.is-today {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.day-name {
  font-size: 0.8125rem;
  color: var(--md-sys-color-on-surface-variant);
  text-transform: capitalize;
}

.day-summary.is-today .day-name {
  color: var(--md-sys-color-on-primary-container);
}

.day-date {
  font-size: 1.25rem;
  font-weight: 700;
}

.day-summary strong {
  font-size: 0.875rem;
  line-height: 1.2;
}

.shopping-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shopping-week {
  font-weight: 650;
}

.action-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.status {
  padding: 1rem 0;
}

md-filled-button,
md-outlined-button,
md-text-button {
  --md-filled-button-container-shape: 8px;
  --md-outlined-button-container-shape: 8px;
}

@media (max-width: 900px) {
  .home-dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      'today'
      'week'
      'shopping'
      'actions';
  }
}

@media (max-width: 640px) {
  .today-panel {
    grid-template-columns: 1fr;
  }
}
</style>
