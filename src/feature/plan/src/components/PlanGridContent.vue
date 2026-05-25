<template>
  <div class="plan-week-view">
    <div v-if="isLoading" class="loading">
      {{ t('feature.plan.loading') }}
    </div>
    <div v-else class="week-grid">
      <div
        v-for="(day, index) in weekDays"
        :key="day.date.toISOString()"
        class="day-column"
      >
        <div class="day-header">
          <span class="day-name">{{ day.name }}</span>
          <span class="day-date" :class="{ 'is-today': day.isToday }">{{
            day.dateNum
          }}</span>
        </div>
        <PlanRecipeBox v-if="recipes[index]" :recipe="recipes[index]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PlanRecipeBox from './PlanRecipeBox.vue';
import type { Recipe } from '../shared/types';

const { t } = useI18n();

const props = defineProps<{
  recipes: Recipe[];
  isLoading: boolean;
  currentWeek: Date;
}>();

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
      name: t(`common.weekdays.${weekDayKeys[i]}`),
      dateNum: date.getDate(),
      isToday,
    });
  }
  return days;
});
</script>

<style scoped>
.plan-week-view {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  align-items: start;
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
  gap: 0.25rem;
  flex-shrink: 0;
}

.day-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant);
  text-transform: capitalize;
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

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--md-sys-color-on-surface-variant);
}
</style>
