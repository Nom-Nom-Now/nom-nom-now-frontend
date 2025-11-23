<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <div class="screen">
    <md-tabs>
      <md-primary-tab>{{ msg }}</md-primary-tab>
    </md-tabs>
    <h1></h1>

    <div class="card">
      <md-filled-button type="button" @click="count++">count is {{ count }}</md-filled-button>

      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
      starter
    </p>
    <p>
      Learn more about IDE Support for Vue in the
      <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a
      >.
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style scoped>
.screen {
  background-color: var(--md-sys-color-surface);
}

.read-the-docs {
  color: #888;
}
</style>
