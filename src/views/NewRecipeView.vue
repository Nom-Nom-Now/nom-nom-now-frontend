<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  createCategory,
  createRecipe,
  type Category,
  type CategoryInput,
  type IngredientInput,
} from '../services/recipeService';

const router = useRouter();

const categories = ref<Category[]>([]);

const unitOptions = [
  { label: 'Gramm (g)', value: 'GRAM' },
  { label: 'Kilogramm (kg)', value: 'KILOGRAM' },
  { label: 'Milliliter (ml)', value: 'MILLILITER' },
  { label: 'Liter (l)', value: 'LITER' },
  { label: 'Stück', value: 'PIECE' },
  { label: 'Teelöffel', value: 'TEASPOON' },
  { label: 'Esslöffel', value: 'TABLESPOON' },
];

const defaultUnit = unitOptions[0]?.value ?? 'GRAM';

const recipeForm = reactive({
  name: '',
  categoryId: categories.value[0]?.id ?? '',
  expectedMinutes: '',
  instructions: '',
  ingredients: [
    { name: '', amount: '', unit: defaultUnit },
    { name: '', amount: '', unit: defaultUnit },
    { name: '', amount: '', unit: defaultUnit },
  ],
});

const categoryForm = reactive({
  name: '',
  color: '',
});

const showCategoryCreator = ref(false);
const recipeFeedback = reactive({
  type: '' as 'success' | 'error' | '',
  message: '',
});

const categoryFeedback = reactive({
  type: '' as 'success' | 'error' | '',
  message: '',
});

const hasIngredients = computed(() => recipeForm.ingredients.length > 0);

function resetRecipeFeedback() {
  recipeFeedback.type = '';
  recipeFeedback.message = '';
}

function resetCategoryFeedback() {
  categoryFeedback.type = '';
  categoryFeedback.message = '';
}

function addIngredientRow() {
  recipeForm.ingredients.push({ name: '', amount: '', unit: defaultUnit });
}

function removeIngredientRow(index: number) {
  if (recipeForm.ingredients.length === 1) {
    return;
  }
  recipeForm.ingredients.splice(index, 1);
}

function sanitizeIngredients(): IngredientInput[] {
  return recipeForm.ingredients
    .map(ingredient => ({
      name: ingredient.name.trim(),
      amount: Number.parseFloat(String(ingredient.amount)),
      unit: ingredient.unit,
    }))
    .filter(ingredient => ingredient.name.length > 0 && Number.isFinite(ingredient.amount));
}

function validateRecipeInput() {
  if (recipeForm.name.trim().length === 0) {
    recipeFeedback.type = 'error';
    recipeFeedback.message = 'Bitte einen Rezeptnamen angeben.';
    return false;
  }
  if (!recipeForm.categoryId) {
    recipeFeedback.type = 'error';
    recipeFeedback.message = 'Bitte eine Kategorie auswählen oder erstellen.';
    return false;
  }
  if (recipeForm.expectedMinutes === '' || Number.isNaN(Number.parseInt(recipeForm.expectedMinutes, 10))) {
    recipeFeedback.type = 'error';
    recipeFeedback.message = 'Bitte eine gültige Zubereitungszeit eintragen.';
    return false;
  }
  if (sanitizeIngredients().length === 0) {
    recipeFeedback.type = 'error';
    recipeFeedback.message = 'Bitte mindestens eine Komponente ergänzen.';
    return false;
  }
  if (recipeForm.instructions.trim().length === 0) {
    recipeFeedback.type = 'error';
    recipeFeedback.message = 'Bitte eine Anleitung hinzufügen.';
    return false;
  }
  return true;
}

async function submitRecipe() {
  resetRecipeFeedback();
  if (!validateRecipeInput()) {
    return;
  }
  const payload = {
    name: recipeForm.name.trim(),
    categoryId: recipeForm.categoryId,
    expectedMinutes: Number.parseInt(recipeForm.expectedMinutes, 10),
    instructions: recipeForm.instructions.trim(),
    ingredients: sanitizeIngredients(),
  };
  try {
    await createRecipe(payload);
    recipeFeedback.type = 'success';
    recipeFeedback.message = 'Rezept wurde erstellt.';
    recipeForm.name = '';
    recipeForm.expectedMinutes = '';
    recipeForm.instructions = '';
    recipeForm.ingredients = [
      { name: '', amount: '', unit: defaultUnit },
      { name: '', amount: '', unit: defaultUnit },
      { name: '', amount: '', unit: defaultUnit },
    ];
  } catch (error) {
    recipeFeedback.type = 'error';
    recipeFeedback.message = 'Rezept konnte nicht erstellt werden.';
  }
}

function openCategoryCreator() {
  showCategoryCreator.value = true;
  resetCategoryFeedback();
}

function closeCategoryCreator() {
  showCategoryCreator.value = false;
  categoryForm.name = '';
  categoryForm.color = '';
}

function validateCategoryInput(input: CategoryInput) {
  if (input.name.trim().length === 0 || input.color.trim().length === 0) {
    categoryFeedback.type = 'error';
    categoryFeedback.message = 'Bitte Kategorie und Farbe angeben.';
    return false;
  }
  return true;
}

async function handleCategoryCreation() {
  resetCategoryFeedback();
  const payload = {
    name: categoryForm.name.trim(),
    color: categoryForm.color.trim(),
  };
  if (!validateCategoryInput(payload)) {
    return;
  }
  try {
    const category = await createCategory(payload);
    categories.value = [...categories.value, category];
    recipeForm.categoryId = category.id;
    categoryFeedback.type = 'success';
    categoryFeedback.message = 'Kategorie wurde gespeichert.';
    closeCategoryCreator();
  } catch (error) {
    categoryFeedback.type = 'error';
    categoryFeedback.message = 'Kategorie konnte nicht gespeichert werden.';
  }
}

function goHome() {
  router.push('/');
}
</script>

<template>
    <div class="layout">
      <header class="page-header">
        <div class="brand">NomNomNow</div>
        <div class="title">New Recipe</div>
        <button class="home-button" type="button" @click="goHome">Home</button>
      </header>
      <main class="content">
        <section class="left">
          <div class="field">
            <label for="recipe-name">Name</label>
            <input id="recipe-name" v-model="recipeForm.name" type="text" placeholder="Pizza Hawaii" />
          </div>
          <div class="field">
            <label for="recipe-category">Category</label>
            <div class="category-inputs">
              <select id="recipe-category" v-model="recipeForm.categoryId">
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.label }}
                </option>
              </select>
              <button class="secondary" type="button" @click="openCategoryCreator">+ Kategorie</button>
            </div>
          </div>
          <div v-if="showCategoryCreator" class="category-creator">
            <div class="creator-fields">
              <div class="field">
                <label for="category-name">Name</label>
                <input id="category-name" v-model="categoryForm.name" type="text" placeholder="Dessert" />
              </div>
              <div class="field">
                <label for="category-color">Farbe</label>
                <input id="category-color" v-model="categoryForm.color" type="text" placeholder="#ffb703" />
              </div>
            </div>
            <div class="creator-actions">
              <button class="secondary" type="button" @click="closeCategoryCreator">Abbrechen</button>
              <button type="button" @click="handleCategoryCreation">Speichern</button>
            </div>
          </div>
          <div class="field expected-time">
            <label for="recipe-time">Expected Time</label>
            <div class="time-input">
              <input id="recipe-time" v-model="recipeForm.expectedMinutes" type="number" min="0" placeholder="60" />
              <span>min</span>
            </div>
          </div>
          <div class="field">
            <label>Components</label>
            <div v-if="hasIngredients" class="components">
              <div
                v-for="(ingredient, index) in recipeForm.ingredients"
                :key="`ingredient-${index}`"
                class="component-row"
              >
                <input
                  v-model="ingredient.name"
                  type="text"
                  placeholder="Mehl"
                  class="component-name"
                />
                <input
                  v-model="ingredient.amount"
                  type="number"
                  min="0"
                  placeholder="500"
                  class="component-amount"
                />
                <select v-model="ingredient.unit" class="component-unit">
                  <option v-for="unit in unitOptions" :key="unit.value" :value="unit.value">
                    {{ unit.label }}
                  </option>
                </select>
                <button
                  v-if="recipeForm.ingredients.length > 1"
                  class="icon-button"
                  type="button"
                  aria-label="Komponente entfernen"
                  @click="removeIngredientRow(index)"
                >
                  ×
                </button>
              </div>
            </div>
            <button class="secondary" type="button" @click="addIngredientRow">+ More Components</button>
          </div>
          <div v-if="recipeFeedback.message" :class="['feedback', recipeFeedback.type]">
            {{ recipeFeedback.message }}
          </div>
        </section>
        <section class="right">
          <div class="field">
            <label for="recipe-instructions">Instructions</label>
            <textarea
              id="recipe-instructions"
              v-model="recipeForm.instructions"
              placeholder="Teig machen, Ofen vorheizen (220°)..."
            ></textarea>
          </div>
          <button class="create-button" type="button" @click="submitRecipe">Create</button>
          <div v-if="categoryFeedback.message" :class="['feedback', categoryFeedback.type]">
            {{ categoryFeedback.message }}
          </div>
        </section>
      </main>
      <footer class="page-footer">Impressum</footer>
    </div>
</template>

<style scoped>

.layout {
  width: 100%;
  max-width: max-content;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: var(--md-sys-color-surface);
}

.page-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  color: var(--md-sys-color-on-surface-variant);
  font-weight: 600;
}

.brand {
  font-size: 32px;
}

.title {
  justify-self: center;
  font-size: 28px;
}

.home-button {
  justify-self: end;
  padding: 10px 28px;
  border-radius: 24px;
  background-color: #1c6c68;
  color: #ffffff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.home-button:hover {
  background-color: #15514d;
}

.content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.field label {
  font-weight: 600;
  color: #1f4745;
}

.field input,
.field select,
.field textarea {
  border-radius: 10px;
  border: 1px solid #c7dedd;
  padding: 12px 16px;
  font-size: 16px;
  font-family: inherit;
  color: #1f4745;
  background-color: #f6fbfb;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #1c6c68;
  box-shadow: 0 0 0 3px rgba(76, 179, 172, 0.2);
}

.category-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-creator {
  background-color: #f1fbfa;
  border: 1px solid #c7dedd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.creator-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.creator-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.expected-time .time-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expected-time .time-input span {
  font-weight: 600;
  color: #1f4745;
}

.components {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.component-row {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 0.7fr auto;
  gap: 12px;
  align-items: center;
}

.component-name {
  grid-column: 1 / 2;
}

.component-amount {
  grid-column: 2 / 3;
}

.component-unit {
  grid-column: 3 / 4;
}

.icon-button {
  grid-column: 4 / 5;
  background-color: transparent;
  border: none;
  color: #1c6c68;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.icon-button:hover {
  background-color: rgba(28, 108, 104, 0.1);
}

.secondary {
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid #1c6c68;
  background-color: #ffffff;
  color: #1c6c68;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.secondary:hover {
  background-color: #1c6c68;
  color: #ffffff;
}

.right {
  display: flex;
  flex-direction: column;
}

.right textarea {
  min-height: 320px;
  resize: vertical;
}

.create-button {
  align-self: flex-end;
  margin-top: auto;
  padding: 14px 40px;
  border-radius: 32px;
  border: none;
  background-color: #1c6c68;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-button:hover {
  background-color: #15514d;
}

.feedback {
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
}

.feedback.success {
  background-color: rgba(76, 179, 172, 0.2);
  color: #0e4f4b;
}

.feedback.error {
  background-color: rgba(220, 87, 87, 0.18);
  color: #8a2121;
}

.page-footer {
  text-align: center;
  color: #1c6c68;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }

  .right {
    order: 2;
  }

  .create-button {
    align-self: stretch;
  }
}

@media (max-width: 640px) {
  .layout {
    padding: 24px 20px;
  }

  .page-header {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }

  .home-button {
    justify-self: center;
  }

  .category-inputs {
    flex-direction: column;
  }

  .component-row {
    grid-template-columns: 1fr 1fr;
  }

  .component-name,
  .component-amount,
  .component-unit,
  .icon-button {
    grid-column: auto;
  }
}
</style>
