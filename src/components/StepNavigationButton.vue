<template>
  <div class="buttonContainer" :class="{ active: progressBarProps.active }">
    <img :src="iconSrc" class="indexIcon" />
    {{progressBarProps.label}}
  </div>


</template>

<script setup lang="ts">
const progressBarProps = defineProps<{
  label: string;
  iconName: string;
  active: boolean;
}>();

const iconSrc = new URL(`/src/assets/icons/createRecipeProgress/${progressBarProps.iconName}.svg`, import.meta.url).href;
</script>

<style scoped>
.buttonContainer {
  display: flex;
  align-items: center;
  width: 9rem;
  height: 2.25rem;
  margin-left: 2rem;
  border-style: solid;
  border-radius: 0.5rem;
  border-width: 1px;
  border-color: var(--md-sys-color-on-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  cursor: pointer;
}

.buttonContainer.active {
  background-color: var(--md-sys-color-surface);
}

.indexIcon {
  display: block;
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin: 0rem 0.5rem 0rem 0.5rem;
}
</style>