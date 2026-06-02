<template>
  <div class="home-dashboard">
    <section class="hero">
      <img
        v-if="todayRecipe?.imageUrl"
        class="hero-image"
        :src="todayRecipe.imageUrl"
        :alt="todayRecipe.title"
      />
      <div v-else class="hero-placeholder">
        <md-icon>restaurant</md-icon>
      </div>
      <div class="hero-scrim"></div>

      <div class="hero-content">
        <span class="hero-eyebrow">
          <md-icon>today</md-icon>
          {{ t('feature.home.todayEyebrow') }} · {{ formattedToday }}
        </span>

        <h2 class="hero-title">
          {{ todayRecipe?.title || t('feature.home.todayTitle') }}
        </h2>

        <p v-if="!todayRecipe" class="hero-empty">
          {{ planError || t('feature.home.noTodayRecipe') }}
        </p>

        <div v-if="todayRecipe" class="hero-meta">
          <span class="hero-chip">
            <md-icon>schedule</md-icon>
            {{ todayRecipe.duration }}
          </span>
          <span class="hero-chip cost">{{ todayRecipe.cost }}</span>
        </div>

        <button class="hero-button" type="button" @click="navigateTo('/plan')">
          <md-icon>calendar_month</md-icon>
          {{ t('feature.home.openPlan') }}
        </button>
      </div>
    </section>

    <div class="home-main-row">
      <section class="week-section">
        <div class="section-header">
          <h3>{{ t('feature.home.weekTitle') }}</h3>
          <button class="link-button" type="button" @click="navigateTo('/plan')">
            {{ t('feature.home.openPlan') }}
            <md-icon>chevron_right</md-icon>
          </button>
        </div>

        <div v-if="isPlanLoading" class="status">
          {{ t('feature.home.loadingPlan') }}
        </div>

        <div v-else class="agenda">
          <article
            v-for="day in weekDays"
            :key="day.key"
            class="agenda-row"
            :class="{ 'is-today': day.isToday }"
            @click="navigateTo('/plan')"
          >
            <div class="agenda-date">
              <span class="day-name">{{ day.shortName }}</span>
              <span class="day-number">{{ day.dateNum }}</span>
            </div>

            <div class="agenda-thumb" :class="{ empty: !day.recipeTitle }">
              <img
                v-if="day.imageUrl"
                :src="day.imageUrl"
                :alt="day.recipeTitle || ''"
              />
              <md-icon v-else-if="day.recipeTitle">restaurant</md-icon>
            </div>

            <div class="agenda-main">
              <strong :class="{ empty: !day.recipeTitle }">
                {{ day.recipeTitle || t('feature.home.noRecipe') }}
              </strong>
              <span v-if="day.recipeTitle" class="agenda-sub">
                {{ day.duration }}
                <template v-if="day.isToday">
                  · {{ t('feature.home.todayEyebrow') }}
                </template>
              </span>
              <span v-else class="agenda-add">
                <md-icon>add</md-icon>
                {{ t('feature.home.addRecipe') }}
              </span>
            </div>

            <md-icon v-if="day.recipeTitle" class="agenda-go">
              chevron_right
            </md-icon>
          </article>
        </div>
      </section>

      <div class="home-right-column">
        <section class="shopping-section">
          <div class="section-header">
            <h3>{{ t('feature.home.shoppingTitle') }}</h3>
            <span v-if="latestShoppingList" class="count-pill">
              {{
                t('feature.shoppingLists.itemCount', {
                  count: latestShoppingList.itemCount,
                })
              }}
            </span>
          </div>

          <div v-if="isShoppingListsLoading" class="status">
            {{ t('feature.home.loadingShoppingLists') }}
          </div>
          <div v-else-if="latestShoppingList" class="shopping-summary">
            <p class="shopping-sub">
              {{ formatWeek(latestShoppingList.weekStart) }} ·
              {{ formatCreatedAt(latestShoppingList.createdAt) }}
            </p>

            <div class="shopping-stat-row">
              <span class="shopping-dot"></span>
              <span class="shopping-stat-label">{{
                t('feature.home.shoppingTitle')
              }}</span>
              <strong>
                {{
                  t('feature.shoppingLists.itemCount', {
                    count: latestShoppingList.itemCount,
                  })
                }}
              </strong>
            </div>

            <button
              class="link-button shopping-link"
              type="button"
              @click="navigateTo(`/shopping-lists/${latestShoppingList.id}`)"
            >
              {{ t('feature.home.openShoppingLists') }}
              <md-icon>chevron_right</md-icon>
            </button>
          </div>
          <div v-else class="status">
            {{ shoppingListsError || t('feature.home.noShoppingList') }}
          </div>
        </section>

        <section class="actions-section">
          <div class="section-header">
            <h3>{{ t('feature.home.actionsTitle') }}</h3>
          </div>

          <div class="actions-grid">
            <button
              class="action-tile primary"
              type="button"
              @click="navigateTo('/recipes/create')"
            >
              <span class="tile-icon"><md-icon>add</md-icon></span>
              <span>{{ t('feature.home.createRecipe') }}</span>
            </button>
            <button
              class="action-tile tonal"
              type="button"
              @click="navigateTo('/recipes')"
            >
              <span class="tile-icon"><md-icon>menu_book</md-icon></span>
              <span>{{ t('feature.home.browseRecipes') }}</span>
            </button>
            <button
              class="action-tile tonal"
              type="button"
              @click="navigateTo('/plan')"
            >
              <span class="tile-icon"><md-icon>calendar_month</md-icon></span>
              <span>{{ t('feature.home.openPlan') }}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
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
import {
  formatCreatedAt as formatCreatedAtValue,
  formatWeekRange,
} from '../../../../formatters/dateFormatters';

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

const formattedToday = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date()),
);

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
      shortName: formatShortWeekday(date),
      dateNum: date.getDate(),
      isToday: date.getTime() === today.getTime(),
      recipeTitle: recipe?.title,
      duration: recipe?.duration,
      imageUrl: recipe?.imageUrl,
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

function formatShortWeekday(date: Date) {
  return new Intl.DateTimeFormat(locale.value, { weekday: 'short' })
    .format(date)
    .replace(/\.$/, '');
}

function formatWeek(weekStart: string) {
  return formatWeekRange(weekStart, locale.value);
}

function formatCreatedAt(createdAt: string) {
  return formatCreatedAtValue(createdAt, locale.value);
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
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  box-sizing: border-box;
}

.hero {
  position: relative;
  min-height: 15rem;
  display: flex;
  flex-shrink: 0;
  align-items: flex-end;
  overflow: hidden;
  border-radius: var(--nnn-radius-lg);
  background: var(--md-sys-color-surface-container-high);
  box-shadow: var(--nnn-elevation-2);
}

.hero-image,
.hero-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-image {
  object-fit: cover;
}

.hero-placeholder {
  display: grid;
  place-items: center;
  color: var(--md-sys-color-on-surface-variant);
  background:
    radial-gradient(
      80% 90% at 100% 0%,
      var(--md-sys-color-primary-container) 0%,
      transparent 65%
    ),
    linear-gradient(
      135deg,
      var(--md-sys-color-surface-container-high) 0%,
      var(--md-sys-color-surface-container-low) 100%
    );
}

.hero-placeholder md-icon {
  --md-icon-size: 5rem;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(15, 40, 28, 0.94) 0%,
    rgba(15, 40, 28, 0.74) 42%,
    rgba(15, 40, 28, 0.1) 80%,
    rgba(15, 40, 28, 0) 100%
  );
}

.hero-content {
  position: relative;
  max-width: 34rem;
  padding: 1.75rem 2rem;
  color: #ffffff;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
  padding: 0.3rem 0.8rem;
  border-radius: var(--nnn-radius-pill);
  background: rgba(255, 255, 255, 0.16);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.hero-eyebrow md-icon {
  --md-icon-size: 16px;
  color: var(--md-sys-color-tertiary-container);
}

.hero-title {
  margin: 0 0 0.85rem;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.05;
}

.hero-empty {
  max-width: 28rem;
  margin: 0 0 1.4rem;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.45;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.4rem;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.8rem;
  border-radius: var(--nnn-radius-pill);
  background: rgba(255, 255, 255, 0.18);
  font-size: 0.85rem;
  font-weight: 600;
}

.hero-chip md-icon {
  --md-icon-size: 17px;
}

.hero-chip.cost {
  background: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container);
}

.hero-button,
.link-button,
.action-tile {
  font: inherit;
  cursor: pointer;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.85rem;
  padding: 0 1.4rem;
  border: none;
  border-radius: var(--nnn-radius-md);
  background: #ffffff;
  color: var(--md-sys-color-on-primary-container);
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    filter 0.15s ease,
    box-shadow 0.15s ease;
}

.hero-button:hover {
  filter: brightness(0.94);
}

.hero-button md-icon {
  --md-icon-size: 20px;
}

.home-main-row {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.55fr) minmax(19rem, 1fr);
  gap: 1.25rem;
  min-height: 0;
}

.week-section,
.home-right-column {
  min-height: 0;
}

.week-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
}

.section-header h3 {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: 1.1rem;
  font-weight: 700;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  padding: 0.3rem 0.5rem;
  border: none;
  border-radius: var(--nnn-radius-xs);
  background: transparent;
  color: var(--md-sys-color-primary);
  font-size: 0.875rem;
  font-weight: 600;
}

.link-button:hover {
  background: var(--md-sys-color-surface-container);
}

.link-button md-icon {
  --md-icon-size: 18px;
}

.agenda {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 0.6rem;
}

.agenda-row {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 1rem;
  min-height: 4rem;
  padding: 0.6rem 0.85rem;
  border: 1px solid transparent;
  border-radius: var(--nnn-radius-md);
  background: var(--md-sys-color-surface-container-low);
  cursor: pointer;
  transition:
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.agenda-row:hover {
  transform: translateX(2px);
  box-shadow: var(--nnn-elevation-1);
}

.agenda-row.is-today {
  border-color: var(--md-sys-color-primary);
  background: var(--md-sys-color-primary-container);
}

.agenda-date {
  display: flex;
  width: 3rem;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.day-name {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
}

.day-number {
  margin-top: 0.2rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.agenda-row.is-today .day-name,
.agenda-row.is-today .day-number {
  color: var(--md-sys-color-on-primary-container);
}

.agenda-thumb {
  position: relative;
  width: 3.4rem;
  height: 3.4rem;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  overflow: hidden;
  border-radius: var(--nnn-radius-sm);
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
}

.agenda-thumb.empty {
  border: 1px dashed var(--md-sys-color-outline-variant);
  background: transparent;
}

.agenda-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agenda-thumb md-icon {
  --md-icon-size: 1.4rem;
}

.agenda-main {
  flex: 1;
  min-width: 0;
}

.agenda-main strong {
  display: block;
  overflow: hidden;
  color: var(--md-sys-color-on-surface);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agenda-main strong.empty {
  color: var(--md-sys-color-outline);
  font-weight: 500;
}

.agenda-sub {
  display: block;
  margin-top: 0.15rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.82rem;
}

.agenda-row.is-today .agenda-sub {
  color: var(--md-sys-color-on-primary-container);
  opacity: 0.85;
}

.agenda-add {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--md-sys-color-primary);
  font-size: 0.82rem;
  font-weight: 600;
}

.agenda-add md-icon {
  --md-icon-size: 18px;
}

.agenda-go {
  --md-icon-size: 22px;
  color: var(--md-sys-color-on-surface-variant);
}

.home-right-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.shopping-section {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  padding: 1.35rem 1.4rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--nnn-radius-lg);
}

.count-pill {
  padding: 0.25rem 0.7rem;
  border-radius: var(--nnn-radius-pill);
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.shopping-summary {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
}

.shopping-sub {
  margin: -0.4rem 0 0.9rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.9rem;
  line-height: 1.4;
}

.shopping-stat-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0;
  border-top: 1px solid var(--md-sys-color-outline-variant);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
  font-size: 0.95rem;
}

.shopping-dot {
  width: 0.5rem;
  height: 0.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--md-sys-color-primary);
}

.shopping-stat-label {
  flex: 1;
}

.shopping-stat-row strong {
  color: var(--md-sys-color-on-surface-variant);
  white-space: nowrap;
}

.shopping-link {
  align-self: flex-start;
  margin-top: 0.6rem;
}

.actions-section {
  flex-shrink: 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.action-tile {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border: none;
  border-radius: var(--nnn-radius-md);
  color: var(--md-sys-color-on-surface);
  transition:
    filter 0.15s ease,
    box-shadow 0.15s ease;
}

.action-tile:hover {
  filter: brightness(1.02);
  box-shadow: var(--nnn-elevation-1);
}

.action-tile.primary {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.action-tile.tonal {
  background: var(--md-sys-color-surface-container-high);
}

.tile-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
}

.action-tile.primary .tile-icon {
  background: rgba(255, 255, 255, 0.2);
}

.action-tile.tonal .tile-icon {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}

.tile-icon md-icon {
  --md-icon-size: 22px;
}

.action-tile span:last-child {
  overflow-wrap: anywhere;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.15;
}

.status {
  padding: 1rem 0;
  color: var(--md-sys-color-on-surface-variant);
}

@media (max-width: 900px) {
  .home-main-row {
    grid-template-columns: 1fr;
  }

  .agenda-row {
    min-height: 3.6rem;
  }
}

@media (max-width: 640px) {
  .home-dashboard {
    padding: 1rem;
  }

  .hero {
    min-height: 17rem;
  }

  .hero-content {
    padding: 1.25rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
