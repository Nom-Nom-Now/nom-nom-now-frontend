# Features

Das Projekt nutzt eine **feature-basierte Ordnerstruktur**. Jedes Feature lebt unter `src/feature/` und kapselt seine eigenen Komponenten, Stores, Services und Typen.

> **Wann erstelle ich ein neues Feature?**  
> Siehe die Richtlinien in [`src/README.md`](../src/README.md): Erstelle einen neuen Feature-Ordner, wenn ein Use-Case mehrere Komponenten, eigene Stores oder eigene Routen benötigt.

---

## Feature-Übersicht

| Feature | Pfad | Status | Beschreibung |
|---|---|---|---|
| [Rezept erstellen](#rezept-erstellen-recipescreate) | `feature/recipes/create/` | ✅ Aktiv | Wizard zum Erstellen eines Rezepts |
| [Alle Rezepte anzeigen](#alle-rezepte-anzeigen-list-all-recipes) | `feature/list-all-recipes/` | ✅ Aktiv | Liste aller Rezepte mit Suchfunktion |
| [Rezept erstellen (Legacy)](#rezept-erstellen-legacy-create-recipe-old) | `feature/create-recipe-old/` | ⚠️ Legacy | Ältere Version, wird ersetzt |
| [Startseite](#startseite-main-page) | `feature/main-page/` | 🚧 Platzhalter | Noch in Entwicklung |

---

## Rezept erstellen (`recipes/create`)

**Pfad:** `src/feature/recipes/create/`

Ein mehrstufiger Wizard zum Erstellen eines Rezepts mit den Schritten: Zutaten → Zubereitung → Kategorien → Foto → Vorschau.

### Struktur

```
recipes/create/src/
├── components/
│   ├── CreateRecipeProgressBar.vue   # Schritt-Navigation (Wizard-Leiste)
│   ├── ingredients/
│   │   ├── IngredientsFrame.vue      # Container für Zutateneingabe
│   │   ├── IngredientList.vue        # Liste aller Zutaten-Zeilen
│   │   └── IngredientRow.vue         # Einzelne Zutaten-Zeile
│   └── preview/
│       └── PreviewFrame.vue          # Vorschau vor dem Absenden
├── services/
│   ├── createRecipeApi.ts            # Backend-DTO-Typen (Request/Response)
│   └── createRecipeService.ts        # Mapping + HTTP-Kommunikation
├── shared/types/
│   ├── recipe.ts                     # Domain-Typen (Ingredient, CreateRecipeState)
│   └── units.ts                      # Maßeinheiten (GRAM, KILOGRAM, …)
├── stores/
│   └── useCreateRecipeStore.ts       # Pinia-Store für den gesamten Wizard-State
└── tests/                            # Unit-Tests (Vitest)
```

### Datenfluss

```
CreateRecipeProgressBar
  └→ IngredientsFrame / PreviewFrame
       └→ useCreateRecipeStore (Pinia)
            └→ submitRecipe()
                 └→ createRecipeService.createRecipe()
                      └→ POST /recipes (Backend)
```

### Typen

**Domain-Modell** (`recipe.ts`):
- `Ingredient` – Einzelne Zutat mit `id`, `amount`, `unit`, `name`
- `CreateRecipeState` – Gesamtzustand des Wizards

**Backend-DTOs** (`createRecipeApi.ts`):
- `CreateRecipeRequestDto` – Sendeformat ans Backend
- `CreateRecipeResponseDto` – Antwortformat vom Backend

### Maßeinheiten

Definiert in `units.ts`:

| Enum-Wert | Anzeige (DE) | Anzeige (EN) |
|---|---|---|
| `GRAM` | g | g |
| `KILOGRAM` | kg | kg |
| `MILLILITER` | ml | ml |
| `LITER` | l | l |
| `PIECE` | Stück | piece |
| `TEASPOON` | TL | tsp |
| `TABLESPOON` | EL | tbsp |

---

## Alle Rezepte anzeigen (`list-all-recipes`)

**Pfad:** `src/feature/list-all-recipes/`

Zeigt alle vorhandenen Rezepte in einem responsiven Grid mit Suchfunktion.

### Struktur

```
list-all-recipes/src/
├── components/
│   └── RecipeObject.vue        # Einzelne Rezept-Karte
├── pages/
│   └── AllRecipesPage.vue      # Seite mit Suchleiste + Grid
└── types/
    └── types.ts                # Recipe, Category, Component Interfaces
```

### Funktionsweise

1. Beim Mounten wird `GET /recipes` aufgerufen
2. Die Rezepte werden in einem reaktiven `ref` gespeichert
3. Ein `computed` filtert die Liste anhand der Sucheingabe (case-insensitive)
4. Jedes Rezept wird als `RecipeObject`-Karte dargestellt

### Typen (`types.ts`)

- `Recipe` – Rezept mit `id`, `name`, `instructions`, `cookingTime`, `categories`, `components`
- `Category` – Kategorie mit `id`, `name`, `color`
- `Component` – Zutat mit `ingredientId`, `ingredientName`, `quantity`, `unit`
- `RecipeList` – Array von `Recipe`

---

## Rezept erstellen – Legacy (`create-recipe-old`)

**Pfad:** `src/feature/create-recipe-old/`

> ⚠️ **Veraltet** – Wird durch `recipes/create` abgelöst.

Die ältere Implementierung der Rezepterstellung, erreichbar unter `/recipes/oldcreate`. Nutzt den globalen `recipeService.ts` statt des Feature-eigenen Service-Layers.

---

## Startseite (`main-page`)

**Pfad:** `src/feature/main-page/`

> 🚧 **In Entwicklung** – Aktuell zeigt `/home` die `HelloWorld`-Komponente.

Geplant als Dashboard mit Übersicht über aktuelle Rezepte, Essensplan etc.

---

## Neues Feature erstellen

1. Erstelle einen Ordner unter `src/feature/<feature-name>/src/`
2. Lege die Unterordner an:
   - `components/` – Feature-spezifische Komponenten
   - `pages/` – Route-Komponenten
   - `stores/` – Pinia-Stores
   - `services/` – API-Kommunikation
   - `shared/types/` – TypeScript-Interfaces
   - `tests/` – Unit-Tests
3. Registriere die Route(n) in `src/router/index.ts`
4. Füge Übersetzungsschlüssel in `src/locales/de.json` und `en.json` hinzu
