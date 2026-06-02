import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../feature/home/src/pages/HomePage.vue';
import CreateRecipeView from '../views/CreateRecipeView.vue';
import PlanView from '../views/PlanView.vue';
import RecipesView from '../views/RecipesView.vue';
import ShoppingListsView from '../views/ShoppingListsView.vue';
import LoginPage from '../views/LoginPage.vue';
import EditRecipeView from '../views/EditRecipeView.vue';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: LoginPage,
      meta: { titleKey: 'feature.login.title', hideShell: true },
    },
    {
      path: '/login',
      component: LoginPage,
      meta: { titleKey: 'feature.login.title', hideShell: true },
    },
    {
      path: '/home',
      component: HomePage,
      meta: { titleKey: 'feature.home.title' },
    },
    {
      path: '/plan',
      component: PlanView,
      meta: { titleKey: 'feature.plan.title' },
    },
    {
      path: '/recipes',
      component: RecipesView,
      meta: { titleKey: 'feature.recipes.title' },
      children: [
        {
          path: 'create',
          component: CreateRecipeView,
          meta: { titleKey: 'feature.recipes.createRecipe.title' },
        },
        {
          path: 'edit/:id',
          component: EditRecipeView,
          props: true,
          meta: { titleKey: 'feature.recipes.edit.title' },
        },
      ],
    },
    {
      path: '/shopping-lists/:id?',
      component: ShoppingListsView,
      meta: { titleKey: 'feature.shoppingLists.title' },
    },
  ],
});

export default router;
