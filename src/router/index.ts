import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';

const routes = [
  { path: '/', component: HelloWorld, props: { msg: 'Vite + Vue' } },
];

const router = createRouter({
  history: createWebHistory('/nom-nom-now/'),
  routes,
});

export default router;
