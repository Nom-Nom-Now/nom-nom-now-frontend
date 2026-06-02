<template>
  <div class="plan-week-view">
    <div v-if="isLoading" class="loading">
      {{ t('feature.plan.loading') }}
    </div>
    <div v-else>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="week-grid">
        <div
          v-for="(day, index) in weekDays"
          :key="day.date.toISOString()"
          class="day-column"
        >
          <div class="day-header">
            <div class="day-title-row">
              <span class="day-name">{{ day.name }}</span>
              <md-icon-button
                class="day-refresh-button"
                type="button"
                :disabled="isDayRefreshing(day.key)"
                :aria-label="t('feature.plan.refreshDay', { day: day.name })"
                :title="t('feature.plan.refreshDay', { day: day.name })"
                @click.stop="emit('refresh-day', index)"
              >
                <md-icon>refresh</md-icon>
              </md-icon-button>
            </div>
            <span class="day-date" :class="{ 'is-today': day.isToday }">
              {{ day.dateNum }}
            </span>
          </div>
          <PlanRecipeBox
            v-if="recipes[index]"
            :recipe="recipes[index]"
            @select="selectedRecipe = recipes[index]"
          />
          <div v-if="recipes[index]" class="people-control">
            <span class="people-label">
              <md-icon>group</md-icon>
              {{ t('feature.plan.peopleCountLabel') }}
            </span>
            <div class="people-stepper">
              <button
                class="people-stepper-button"
                type="button"
                :disabled="getPeopleCount(day.key) <= minPeopleCount"
                :aria-label="
                  t('feature.plan.decreasePeople', { day: day.name })
                "
                @click.stop="updatePeopleCount(day.key, getPeopleCount(day.key) - 1)"
              >
                <md-icon>remove</md-icon>
              </button>
              <span class="people-count">
                {{
                  t('feature.plan.peopleCountValue', {
                    count: getPeopleCount(day.key),
                  })
                }}
              </span>
              <button
                class="people-stepper-button"
                type="button"
                :disabled="getPeopleCount(day.key) >= maxPeopleCount"
                :aria-label="
                  t('feature.plan.increasePeople', { day: day.name })
                "
                @click.stop="updatePeopleCount(day.key, getPeopleCount(day.key) + 1)"
              >
                <md-icon>add</md-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PlanRecipeBox from './PlanRecipeBox.vue';
import type { Recipe } from '../shared/types';
import RecipeDetailPage from '../../../recipes/detail/src/components/RecipeDetailPage.vue';

const { t } = useI18n();

const props = defineProps<{
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  currentWeek: Date;
  refreshingDayKeys: string[];
  peopleCountsByDate: Record<string, number>;
}>();

const emit = defineEmits<{
  'open-fullscreen': [recipe: Recipe];
  'refresh-day': [dayIndex: number];
  'update-people-count': [planDate: string, peopleCount: number];
}>();

const selectedRecipe = ref<Recipe | null>(null);
const minPeopleCount = 1;
const maxPeopleCount = 20;

function switchToFullscreen() {
  if (selectedRecipe.value) {
    emit('open-fullscreen', selectedRecipe.value);
    selectedRecipe.value = null;
  }
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

const weekDays = computed(() => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(props.currentWeek);
    date.setDate(date.getDate() + i);

    const isToday = date.getTime() === today.getTime();

    days.push({
      date,
      key: formatDateOnly(date),
      name: t(`common.weekdays.${weekDayKeys[i]}`),
      dateNum: date.getDate(),
      isToday,
    });
  }
  return days;
});

function formatDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isDayRefreshing(dayKey: string) {
  return props.refreshingDayKeys.includes(dayKey);
}

function getPeopleCount(dayKey: string) {
  return props.peopleCountsByDate[dayKey] ?? minPeopleCount;
}

function updatePeopleCount(dayKey: string, peopleCount: number) {
  emit('update-people-count', dayKey, peopleCount);
}
</script>

<style scoped>
.plan-week-view {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(6rem, 1fr));
  gap: 1rem;
  align-items: start;
  min-width: min(100%, 48rem);
}

.day-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
}

.day-title-row {
  min-height: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
}

.day-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
  text-transform: capitalize;
}

.day-refresh-button {
  width: 2rem;
  height: 2rem;
  --md-icon-button-icon-size: 1.125rem;
}

.day-date {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.day-date.is-today {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}

.people-control {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.65rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--nnn-radius-sm);
  background-color: var(--md-sys-color-surface-container-lowest);
}

.people-label,
.people-stepper,
.people-count {
  display: flex;
  align-items: center;
}

.people-label {
  gap: 0.35rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.78rem;
  font-weight: 600;
}

.people-label md-icon {
  font-size: 1rem;
}

.people-stepper {
  justify-content: space-between;
  gap: 0.35rem;
}

.people-stepper-button {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 999px;
  background-color: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-primary);
  cursor: pointer;
}

.people-stepper-button:disabled {
  cursor: not-allowed;
  color: var(--md-sys-color-outline);
  opacity: 0.55;
}

.people-stepper-button md-icon {
  font-size: 1.05rem;
}

.people-count {
  min-width: 3.9rem;
  justify-content: center;
  color: var(--md-sys-color-on-surface);
  font-size: 0.82rem;
  font-weight: 700;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--md-sys-color-on-surface-variant);
}

.error-message {
  margin: 2rem auto;
  max-width: 32rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  text-align: center;
  font-weight: 500;
}
</style>
