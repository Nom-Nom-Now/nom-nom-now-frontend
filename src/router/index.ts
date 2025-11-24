import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import CreateRecipeView from '../feature/create-recipe/src/pages/CreateRecipeView.vue';

const routes = [
  { path: '/', component: HelloWorld, props: { msg: 'Vite + Vue' } },
  { path: '/create', component: CreateRecipeView, meta: { title: 'Create Recipe' } }
];

const router = createRouter({
  history: createWebHistory('/nom-nom-now/'),
  routes,
});

export default router;
