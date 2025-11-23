<template>
  <nav class="nav-bar">
    <img class="logo" src="../../assets/Logo.png" />
    <ul>
      <li>
        <a><NavigationItem text="Home" icon-name="home_24dp_1F1F1F" /></a>
      </li>
      <li>
        <a><NavigationItem text="Plan" icon-name="calendar_meal_24dp_1F1F1F" /></a>
      </li>
      <li>
        <a><NavigationItem text="Recipes" icon-name="chef_hat_24dp_1F1F1F" /></a>
      </li>
      <li>
        <a><NavigationItem text="Browse" icon-name="wb_incandescent_24dp_1F1F1F" /></a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import NavigationItem from './NavigationItem.vue';
</script>

<style scoped>
.nav-bar {
  width: 5.5rem;
  background-color: var(--md-sys-color-surface);
  overflow-y: auto;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 5.5rem;
}

ul li {
  padding-top: 2rem;
}

li a {
  display: block;
  color: var(--md-sys-color-secondary);
  text-decoration: none;
}

.logo {
  height: 4rem;
  width: 4rem;
  display: flex;
  margin: auto;
  margin-top: 0.5rem;
}
</style>
