# API-Integration

## Architektur

Die API-Kommunikation folgt einer klaren Schichtentrennung:

```
┌─────────────────────────┐
│    Store / Komponente    │   Domain-Typen verwenden
├─────────────────────────┤
│    Service-Layer         │   Mapping Domain ↔ DTO + HTTP
├─────────────────────────┤
│    API-Types (DTOs)      │   Spiegeln den Backend-Vertrag
└─────────────────────────┘
```

**Prinzip:** Die Komponenten und Stores arbeiten ausschließlich mit internen Domain-Typen. Die Umwandlung in das Backend-Format (DTOs) geschieht im Service-Layer.

---

## Environment-Konfiguration

| Variable | Beschreibung | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Basis-URL für API-Requests | `""` (leerer String) |
| `VITE_BACKEND_URL` | Backend-URL für OAuth-Redirects | `""` |

Zugriff im Code:

```typescript
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '';
```

---

## Feature-Service: `createRecipeService.ts`

**Pfad:** `src/feature/recipes/create/src/services/createRecipeService.ts`

### Mapping-Funktionen

| Funktion | Beschreibung |
|---|---|
| `mapIngredientToComponent(ingredient)` | `Ingredient` → `CreateRecipeComponentDto` |
| `mapStateToRequestDto(state)` | `CreateRecipeState` → `CreateRecipeRequestDto` |

Das Mapping filtert automatisch ungültige Zutaten heraus (leerer Name oder `amount ≤ 0`).

### HTTP-Helper

```typescript
async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes>
```

- Sendet `POST`-Request mit `Content-Type: application/json`
- Konstruiert die URL als `${API_BASE_URL}${path}`
- Wirft `Error` bei nicht-erfolgreicher Response (`!response.ok`)
- Parst die Antwort als JSON oder gibt leeres Objekt zurück

### Öffentliche API

```typescript
export async function createRecipe(
  state: CreateRecipeState
): Promise<CreateRecipeResponseDto>
```

Nimmt den internen State entgegen, mappt ihn zum DTO und sendet `POST /recipes`.

---

## Backend-DTOs: `createRecipeApi.ts`

**Pfad:** `src/feature/recipes/create/src/services/createRecipeApi.ts`

### Request-DTOs

```typescript
interface CreateRecipeComponentDto {
  name: string;        // Zutatenname
  quantity: number;     // Menge
  unit: string;         // Einheit (z.B. "GRAM")
}

interface CreateRecipeRequestDto {
  name: string;              // Rezeptname
  instructions: string;      // Zubereitungsanleitung
  cookingTime: number;       // Kochzeit in Minuten
  categoryIds: number[];     // Kategorie-IDs
  components: CreateRecipeComponentDto[];
}
```

### Response-DTOs

```typescript
interface RecipeComponentResponseDto {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
}

interface CreateRecipeResponseDto {
  id: number;
  name: string;
  instructions: string;
  cookingTime: number;
  ownerName: string;
  categories: string;
  components: RecipeComponentResponseDto[];
}
```

---

## Globaler Service (Legacy): `recipeService.ts`

**Pfad:** `src/services/recipeService.ts`

> ⚠️ **Legacy** – Für neue Features bitte den Feature-eigenen Service-Ansatz nutzen.

Dieser Service wird vom alten Rezept-Erstellungs-Feature (`create-recipe-old`) verwendet.

### Funktionen

| Funktion | Beschreibung |
|---|---|
| `createRecipe(input: RecipeInput)` | Erstellt ein Rezept via `POST /recipes` |
| `createCategory(input: CategoryInput)` | Erstellt eine Kategorie via `POST /categories` |

### Typen

- `RecipeInput` – Eingabedaten für Rezepterstellung
- `CategoryInput` – Eingabedaten für Kategorieerstellung
- `Category` – Kategorie mit `id`, `name`, `color`, `label`
- `RecipeCreationResult` – Ergebnis mit `id`
- `CategoryCreationResult` – Ergebnis mit vollständiger Kategorie

---

## API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `POST` | `/recipes` | Neues Rezept erstellen |
| `GET` | `/recipes` | Alle Rezepte abrufen |
| `POST` | `/categories` | Neue Kategorie erstellen |

---

## Neuen API-Service erstellen

1. **DTO-Datei** erstellen: `<feature>/src/services/<feature>Api.ts`
   - Request- und Response-Interfaces definieren
   
2. **Service-Datei** erstellen: `<feature>/src/services/<feature>Service.ts`
   - Mapping-Funktionen (Domain → DTO, DTO → Domain)
   - HTTP-Helper wiederverwenden oder eigenen schreiben
   - Öffentliche Funktionen exportieren

3. **Store** aufrufen lassen:
   - Service-Funktion im Store importieren
   - In einer Action aufrufen
