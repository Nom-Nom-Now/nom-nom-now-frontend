<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore';
import { loadCategoryLists } from '../../services/categoryMapper';
import { useAuth } from '../../../../../../composables/useAuth';
import type { CategoryOption } from '../../services/categoryApiTypes.ts';
import RecipeDetailContent from '../../../../detail/src/components/RecipeDetailContent.vue';
import type { Recipe } from '../../../../list/src/shared/types.ts';

const { t } = useI18n();
const store = useCreateRecipeStore();

const { currentUsername } = useAuth();

const { isSubmitting, submitError, isIngredientsStepValid } = storeToRefs(store);
const submitSuccess = ref(false);

const allCategories = ref<CategoryOption[]>([]);

onMounted(async () => {
  try {
    const data = await loadCategoryLists();
    allCategories.value = data.categories || [];
  } catch (err) {
    console.error('Fehler beim Laden der Kategorien in der Preview:', err);
  }
});

const previewRecipe = computed<Recipe>(() => {
  const localImageUrl = store.recipeImage
    ? URL.createObjectURL(store.recipeImage)
    : null;

  const mappedCategoryNames = (store.categoryIds || [])
    .map(id => allCategories.value.find(cat => cat.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: 'preview-id',
    title: store.recipeName || '',
    imageUrl: localImageUrl,
    duration: store.cookingTime ? `${store.cookingTime} Min.` : '',
    cost: store.pricePerPerson !== null ? `${store.pricePerPerson.toFixed(2)} €` : '',
    description: store.instructions || '',

    owner: currentUsername.value || t('feature.recipes.detail.unknownChef'),

    categories: mappedCategoryNames,

    ingredients: (store.ingredients || []).map(ing => ({
      ingredientName: ing.name || '',
      quantity: ing.amount,
      unit: ing.unit || null
    }))
  };
});

async function handleSubmit() {
  submitSuccess.value = false;
  try {
    await store.submitRecipe();
    submitSuccess.value = true;
  } catch {
    // Fehlerhandling im Store
  }
}
</script>

<template>
  <div class="frame">
    <div class="preview-content-wrapper">
      <RecipeDetailContent
        :recipe="previewRecipe"
        :current-username="currentUsername"
      />
    </div>

    <div class="actions">
      <md-filled-button
        @click="handleSubmit"
        :disabled="isSubmitting || !isIngredientsStepValid"
      >
        <md-icon slot="icon">send</md-icon>
        {{
          isSubmitting
            ? t('feature.recipes.createRecipe.preview.submitting')
            : t('feature.recipes.createRecipe.preview.submit')
        }}
      </md-filled-button>

      <div v-if="submitError" class="feedback feedback--error">
        {{ submitError }}
      </div>
      <div v-if="submitSuccess" class="feedback feedback--success">
        {{ t('feature.recipes.createRecipe.preview.success') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.frame {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-content-wrapper {
  width: 100%;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.1));
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-left: 2rem;
}

.feedback {
  font: var(--md-sys-typescale-body-medium-weight)
  var(--md-sys-typescale-body-medium-size)
  var(--md-sys-typescale-body-medium-font);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.feedback--error {
  color: var(--md-sys-color-on-error-container);
  background: var(--md-sys-color-error-container);
}

.feedback--success {
  color: var(--md-sys-color-on-tertiary-container);
  background: var(--md-sys-color-tertiary-container);
}
</style>