<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useEditRecipeStore } from '../stores/useEditRecipeStore';
import { loadCategoryLists } from '../../../create/src/services/categoryMapper';
import { useAuth } from '../../../../../composables/useAuth';
import type { CategoryOption } from '../../../create/src/services/categoryApiTypes.ts';
import RecipeDetailContent from '../../../detail/src/components/RecipeDetailContent.vue';
import type { Recipe } from '../../../list/src/shared/types.ts';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'success'): void;
}>();

const { t } = useI18n();

type EditRecipeStoreInstance = ReturnType<typeof useEditRecipeStore>;
const store = inject<EditRecipeStoreInstance>('recipeStore')!;

const { currentUsername } = useAuth();

const { isDirty, isSubmitting, submitError, isIngredientsStepValid } = storeToRefs(store);
const submitSuccess = ref(false);

const allCategories = ref<CategoryOption[]>([]);

onMounted(async () => {
  try {
    const data = await loadCategoryLists();
    allCategories.value = data.categories || [];
  } catch (err) {
    console.error('Fehler beim Laden der Kategorien in der Edit-Preview:', err);
  }
});

const previewRecipe = computed<Recipe>(() => {
  let resolvedImageUrl: string | null = null;

  if (store.recipeImage) {
    resolvedImageUrl = URL.createObjectURL(store.recipeImage);
  } else if (store.existingImageUrl) {
    resolvedImageUrl = store.existingImageUrl;
  }

  const mappedCategoryNames = (store.categoryIds || [])
    .map((id) => allCategories.value.find((cat: CategoryOption) => cat.id === id)?.name)
    .filter((name): name is string => !!name);

  return {
    id: store.recipeId?.toString() || 'preview-id',
    title: store.recipeName || '',
    imageUrl: resolvedImageUrl,
    duration: store.cookingTime ? `${store.cookingTime} Min.` : '',
    cost: store.pricePerPerson === null ? '' : `${store.pricePerPerson.toFixed(2)} €`,
    description: store.instructions || '',
    owner: currentUsername.value || t('feature.recipes.detail.unknownChef'),
    categories: mappedCategoryNames,
    ingredients: (store.ingredients || []).map((ing) => ({
      ingredientName: ing.name || '',
      quantity: ing.amount,
      unit: ing.unit || null,
    })),
  };
});

async function handleSave() {
  submitSuccess.value = false;
  try {
    await store.submitUpdatedRecipe();
    submitSuccess.value = true;
    setTimeout(() => emit('success'), 1200);
  } catch {
    // Fehlerhandling läuft typsicher im Store (wird via submitError gerendert)
  }
}

function handleCancel() {
  emit('cancel');
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
      <div class="button-group">
        <md-outlined-button
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          {{ t('feature.recipes.edit.cancel')}}
        </md-outlined-button>

        <md-filled-button
          @click="handleSave"
          :disabled="isSubmitting || !isIngredientsStepValid || !isDirty"
        >
          <md-icon slot="icon">save</md-icon>
          {{
            isSubmitting
              ? t('feature.recipes.edit.preview.submitting')
              : t('feature.recipes.edit.preview.save')
          }}
        </md-filled-button>
      </div>

      <div v-if="submitError" class="feedback feedback--error">
        {{ submitError }}
      </div>
      <div v-if="submitSuccess" class="feedback feedback--success">
        {{ t('feature.recipes.edit.preview.success') }}
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
  border-bottom: 1px solid
  var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.1));
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-left: 2rem;
}

/* Flexbox-Container, damit die beiden Buttons sauber nebeneinander sitzen */
.button-group {
  display: flex;
  gap: 1rem;
  align-items: center;
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