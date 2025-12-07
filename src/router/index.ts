import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import CreateRecipeView from '../feature/create-recipe/src/pages/CreateRecipeView.vue';
import NewRecipeView from '../views/NewRecipeView.vue';

//import HelloWorld from '../components/HelloWorld.vue';
import AllRecipesPage from '../components/feature/recipe/src/Pages/AllRecipesPage.vue';
const routes = [
  { path: '/', component: HelloWorld, meta: { titleKey: 'feature.mainPage.title' } },
  { path: '/create', component: NewRecipeView, meta: { titleKey: 'feature.createRecipe.title' } }
]; // TODO: vermutlich besser: 'titleKey' nur zu 'key' machen und abhänging davon z.B. das Highlighting des ausgewählten Tabs in der Navigation Bar zu regeln

const router = createRouter({
  history: createWebHistory('/nom-nom-now/'),
  routes,
});

export default router;
