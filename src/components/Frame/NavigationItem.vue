<template>
  <div class="item-container">
    <img :src="iconSrc" />
    {{ navItemProps.text }}
  </div>
</template>

<script setup lang="ts">
const navItemProps = defineProps<{
  text: string;
  iconName: string;
}>();

const iconSrc = new URL(`../../assets/icons/${navItemProps.iconName}.svg`, import.meta.url).href;
</script>

<style scoped>
.item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 3.1875rem;
  gap: 0.25rem;
}
</style>
