<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(defineProps<{
  size?: 'small' | 'medium' | 'large';
}>(), {
  size: 'medium'
});

const labelSpan = computed(() => {
  return `md-label-${props.size}`;
});
</script>

<template>
  <div class="label-border">
    <span :class="labelSpan">
      <slot></slot>
    </span>
  </div>
</template>

<style scoped>
.label-border {
  display: flex;
  padding: 1rem;
}

.md-label-large {
  color: var(--md-sys-color-on-surface);
  font-size: var(--md-sys-typescale-label-large-size);
  line-height: var(--md-sys-typescale-label-large-line-height);
  font-weight: var(--md-sys-typescale-label-large-weight);
}

.md-label-medium {
  color: var(--md-sys-color-on-surface);
  font-size: var(--md-sys-typescale-label-medium-size);
  line-height: var(--md-sys-typescale-label-medium-line-height);
  font-weight: var(--md-sys-typescale-label-medium-weight);
}

.md-label-small {
  color: var(--md-sys-color-on-surface);
  font-size: var(--md-sys-typescale-label-small-size);
  line-height: var(--md-sys-typescale-label-small-line-height);
  font-weight: var(--md-sys-typescale-label-small-weight);
}
</style>