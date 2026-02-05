<template>
  <div class="item-container">
    <div class="icon-badge">
      <img :src="iconSrc" class="icon" draggable="false" />
    </div>
    {{ navItemProps.text }}
  </div>
</template>

<script setup lang="ts">
const navItemProps = defineProps<{
  text: string;
  iconName: string;
}>();

const iconSrc = new URL(`/src/assets/icons/navigation/${navItemProps.iconName}.svg`, import.meta.url).href;
</script>

<style scoped>
.item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 3.1875rem;
  gap: 0.25rem;

  user-select: none;
  -webkit-user-select: none;
}

.icon-badge {
  display: flex;
  width: 3.5rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
}

.icon {
  height: 24px;
  width: 24px;
}
</style>
