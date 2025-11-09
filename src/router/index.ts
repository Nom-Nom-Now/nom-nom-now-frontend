import { createRouter, createWebHistory } from 'vue-router';
import NewRecipeView from '../views/NewRecipeView.vue';

const routes = [
  { path: '/', component: NewRecipeView },
];

const router = createRouter({
  history: createWebHistory('/nom-nom-now/'),
  routes,
});

export default router;
