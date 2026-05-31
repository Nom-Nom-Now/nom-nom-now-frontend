<template>
  <div class="item-container">
    <div class="icon-badge">
      <img :src="iconSrc" class="icon" draggable="false" alt="" />
    </div>
    <span class="item-label">{{ navItemProps.text }}</span>
  </div>
</template>

<script setup lang="ts">
const navItemProps = defineProps<{
  text: string;
  iconName: string;
}>();

const iconSrc = new URL(
  `/src/assets/icons/navigation/${navItemProps.iconName}.svg`,
  import.meta.url,
).href;
</script>

<style scoped>
.item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 3.1875rem;
  gap: 0.25rem;

  user-select: none;
  -webkit-user-select: none;
}

.item-label {
  width: 5rem;
  font-size: 0.78rem;
  line-height: 1.05;
  text-align: center;
  overflow-wrap: anywhere;
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
