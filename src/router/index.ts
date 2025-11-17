import { createRouter, createWebHistory } from 'vue-router';
//import HelloWorld from '../components/HelloWorld.vue';
import AllRecipesPage from '../components/feature/recipe/src/Pages/AllRecipesPage.vue';
const routes = [
  //{ path: '/', component: HelloWorld, props: { msg: 'Vite + Vue' } },
  { path: '/', component: AllRecipesPage},
];

const router = createRouter({
  history: createWebHistory('/nom-nom-now/'),
  routes,
});

export default router;
