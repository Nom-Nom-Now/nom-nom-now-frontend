import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import CreateRecipeView from '../views/CreateRecipeView.vue';
import PlanView from '../views/PlanView.vue';
import RecipesView from '../views/RecipesView.vue';
import BrowseView from '../views/BrowseView.vue';
import AllRecipesPage from '../feature/list-all-recipes/src/pages/AllRecipesPage.vue';
import NewRecipeView from '../views/NewRecipeView.vue';

const router = createRouter({
  history: createWebHistory('/nom-nom-now/'),
  routes: [
    {
      path: '/',
      component: HelloWorld,
      meta: { titleKey: 'feature.mainPage.title' }
    },
    {
      path: '/plan',
      component: PlanView,
      meta: { titleKey: 'feature.plan.title' }
    },
    {
      path: '/recipes',
      component: RecipesView,
      meta: { titleKey: 'feature.recipes.title' },
      children: [
        {
          path: 'create',
          component: CreateRecipeView,
          meta: { titleKey: 'feature.recipes.createRecipe.title' }
        },
        {
          path: 'oldcreate',
          component: NewRecipeView,
          meta: { titleKey: 'feature.recipes.createRecipe.title' }
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
          component: AllRecipesPage,
          meta: { titleKey: 'feature.listAllRecipes.title' }
        },
      ],
    }
  ]
});

export default router;
