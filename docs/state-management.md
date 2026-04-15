# State Management

## Überblick

Das Projekt nutzt **[Pinia](https://pinia.vuejs.org/)** (v3) für reaktives State Management. Stores werden mit der **Composition API** (Setup-Syntax) definiert.

---

## Konventionen

1. **Stores leben im Feature-Ordner:** Jeder Store gehört zum Feature, das ihn nutzt.  
   Beispiel: `src/feature/recipes/create/src/stores/useCreateRecipeStore.ts`

2. **Namenskonvention:** `use<Feature>Store` (z.B. `useCreateRecipeStore`)

3. **Composition API:** Alle Stores nutzen die Setup-Syntax mit `defineStore('id', () => { ... })`

4. **Reset-Funktion:** Jeder Store implementiert eine `$reset()`-Methode, um den State auf die Initialwerte zurückzusetzen.

---

## Pinia-Setup

Pinia wird in `main.ts` als Vue-Plugin registriert:

```typescript
import { createPinia } from 'pinia';

const pinia = createPinia();
app.use(pinia);
```

---

## Referenzbeispiel: `useCreateRecipeStore`

**Pfad:** `src/feature/recipes/create/src/stores/useCreateRecipeStore.ts`

Dieser Store verwaltet den gesamten Zustand des Rezept-Erstellungs-Wizards.

### State

| Feld | Typ | Beschreibung |
|---|---|---|
| `recipeName` | `string` | Name des Rezepts |
| `servings` | `number` | Anzahl der Portionen (min. 1) |
| `ingredients` | `Ingredient[]` | Liste der Zutaten |
| `instructions` | `string` | Zubereitungsanleitung |
| `cookingTime` | `number` | Kochzeit in Minuten |
| `categoryIds` | `number[]` | Ausgewählte Kategorie-IDs |
| `isSubmitting` | `boolean` | Ob gerade gesendet wird |
| `submitError` | `string \| null` | Fehlermeldung bei fehlgeschlagenem Submit |

### Getters (Computed)

| Getter | Rückgabetyp | Beschreibung |
|---|---|---|
| `ingredientCount` | `number` | Anzahl der Zutaten |
| `isIngredientsStepValid` | `boolean` | Ob der Zutaten-Schritt valide ist (Name, Portionen, alle Zutaten vollständig) |

### Actions

| Action | Parameter | Beschreibung |
|---|---|---|
| `setRecipeName` | `name: string` | Setzt den Rezeptnamen |
| `setServings` | `value: number` | Setzt die Portionen (min. 1) |
| `addIngredient` | – | Fügt eine leere Zutat hinzu |
| `removeIngredient` | `id: number` | Entfernt eine Zutat nach ID |
| `updateIngredientAmount` | `id, amount` | Aktualisiert die Menge einer Zutat |
| `updateIngredientUnit` | `id, unit` | Aktualisiert die Einheit einer Zutat |
| `updateIngredientName` | `id, name` | Aktualisiert den Namen einer Zutat |
| `moveIngredientUp` | `index: number` | Verschiebt eine Zutat nach oben |
| `moveIngredientDown` | `index: number` | Verschiebt eine Zutat nach unten |
| `submitRecipe` | – | Sendet das Rezept ans Backend (async) |
| `$reset` | – | Setzt den gesamten Store zurück |

### Submit-Ablauf

```
submitRecipe()
  ├→ isSubmitting = true
  ├→ State → CreateRecipeState zusammenbauen
  ├→ createRecipeService.createRecipe(state)
  │    ├→ mapStateToRequestDto(state)  → DTO
  │    └→ POST /recipes                → Backend
  ├→ Bei Erfolg: $reset()
  └→ Bei Fehler: submitError setzen
```

### Verwendung in Komponenten

```vue
<script setup lang="ts">
import { useCreateRecipeStore } from '../stores/useCreateRecipeStore';

const store = useCreateRecipeStore();

// Reaktiver Zugriff
console.log(store.recipeName);
console.log(store.isIngredientsStepValid);

// Actions aufrufen
store.setRecipeName('Pizza Margherita');
store.addIngredient();

// Submit
await store.submitRecipe();
</script>
```

---

## Neuen Store erstellen

```typescript
// src/feature/<feature>/src/stores/use<Feature>Store.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const use<Feature>Store = defineStore('<feature>', () => {
  // State
  const myValue = ref('');

  // Getters
  const isValid = computed(() => myValue.value.length > 0);

  // Actions
  function setMyValue(value: string) {
    myValue.value = value;
  }

  function $reset() {
    myValue.value = '';
  }

  return {
    myValue,
    isValid,
    setMyValue,
    $reset,
  };
});
```
