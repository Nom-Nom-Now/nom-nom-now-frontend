import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import CreateRecipeView from '../views/CreateRecipeView.vue';
import PlanView from '../views/PlanView.vue';
import RecipesView from '../views/RecipesView.vue';
import ShoppingListsView from '../views/ShoppingListsView.vue';
import LoginPage from '../views/LoginPage.vue';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: LoginPage,
      meta: { titleKey: 'feature.login.title', hideShell: true },
    },
    {
      path: '/home',
      component: HelloWorld,
      meta: { titleKey: 'feature.mainPage.title' },
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
