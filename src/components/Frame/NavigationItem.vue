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
  gap: 0.3rem;

  user-select: none;
  -webkit-user-select: none;
}

.item-label {
  width: 5.25rem;
  font-size: 0.75rem;
  font-weight: 500;
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
  border-radius: var(--nnn-radius-md);
  transition: background-color 0.18s ease;
}

.icon {
  height: 24px;
  width: 24px;
}

@media (max-width: 760px) {
  .item-label {
    width: 4.75rem;
    font-size: 0.625rem;
    line-height: 1;
  }
}
</style>
