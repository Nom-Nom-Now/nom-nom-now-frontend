import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import CreateRecipeView from '../views/CreateRecipeView.vue';
import PlanView from '../views/PlanView.vue';
import RecipesView from '../views/RecipesView.vue';
import BrowseView from '../views/BrowseView.vue';
import ListRecipesPage from '../feature/recipes/list/src/pages/ListRecipesPage.vue';
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
        {
          path: 'edit/:id',
          component: EditRecipeView,
          props: true,
          meta: { titleKey: 'feature.recipes.edit.title' },
        },
      ],
    },
    {
      path: '/browse',
      component: BrowseView,
      meta: { titleKey: 'feature.browse.title' },
      children: [
        {
          path: 'listall',
          component: ListRecipesPage,
          meta: { titleKey: 'feature.listAllRecipes.title' },
        },
      ],
    },
  ],
});

export default router;
