# Contributing

## Überblick

Dieses Dokument beschreibt die Richtlinien für Beiträge zum Projekt. Bitte lies auch die [Conventions in der README](../README.md) für Branch- und Commit-Konventionen.

---

## Entwicklungsumgebung einrichten

Siehe [Getting Started](./getting-started.md) für die vollständige Anleitung.

```bash
git clone <repository-url>
cd nom-nom-now-frontend
npm ci
npm run dev
```

---

## Branch-Konventionen

**Format:** `<type>/<issue-id>-<short-description>`

| Prefix | Zweck |
|---|---|
| `feat/` | Neues Feature |
| `fix/` | Bugfix |
| `docs/` | Dokumentation |
| `chore/` | Wartung / Aufräumen |
| `refactor/` | Code-Umstrukturierung |
| `test/` | Tests |
| `ci/` | CI/CD-Änderungen |

**Beispiele:**
```
feat/NNN-42-add-login-page
fix/NNN-17-resolve-null-pointer
docs/NNN-36-update-readme
```

---

## Commit-Konventionen

**Format:** `<type>(<scope>): <short summary>`

**Regeln:**
- Imperativ verwenden ("add", "fix", "update")
- Maximal 80 Zeichen
- Jira-Issue-ID referenzieren, wenn möglich

**Beispiel:**
```
feat(auth): add token refresh endpoint
fix(recipes): handle empty ingredient list
docs(api): update DTO documentation
```

---

## Code-Style

### ESLint

Das Projekt nutzt ESLint 9 (Flat Config) mit folgenden Plugins:

- `@eslint/js` – Basis-JavaScript-Regeln
- `typescript-eslint` – TypeScript-spezifische Regeln
- `eslint-plugin-vue` – Vue-spezifische Regeln (Flat/Essential)

**Linting ausführen:**
```bash
npm run lint
```

### Prettier

Formatierung erfolgt über Prettier:

```bash
npm run format
```

### Wichtige ESLint-Regeln

| Regel | Beschreibung |
|---|---|
| `vue/no-undef-components` | Alle Komponenten müssen importiert sein. `md-*`, `router-view`, `router-link`, `i18n-t` sind ausgenommen. |
| `vue/no-deprecated-slot-attribute` | Verbietet veraltete `slot`-Attribute, außer in Material-Komponenten (die sie benötigen). |

---

## Testing

### Framework

- **[Vitest](https://vitest.dev/)** – Unit-Test-Runner
- **[jsdom](https://github.com/jsdom/jsdom)** – DOM-Simulation
- **[@vue/test-utils](https://test-utils.vuejs.org/)** – Vue-Komponenten-Testing

### Tests ausführen

```bash
# Alle Tests einmalig ausführen
npm run test:unit

# Tests im Watch-Modus (für Entwicklung)
npx vitest
```

### Tests schreiben

Test-Dateien werden im `tests/`-Ordner des jeweiligen Features abgelegt:

```
feature/recipes/create/src/tests/
```

**Namenskonvention:** `<dateiname>.spec.ts` oder `<dateiname>.test.ts`

**Beispiel:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCreateRecipeStore } from '../stores/useCreateRecipeStore';

describe('useCreateRecipeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const store = useCreateRecipeStore();
    expect(store.recipeName).toBe('');
    expect(store.servings).toBe(1);
    expect(store.ingredients).toHaveLength(3);
  });

  it('should add an ingredient', () => {
    const store = useCreateRecipeStore();
    store.addIngredient();
    expect(store.ingredients).toHaveLength(4);
  });
});
```

---

## Ordnerstruktur-Richtlinien

Detaillierte Richtlinien findest du in [`src/README.md`](../src/README.md).

### Kurzfassung

- **Feature-Ordner** unter `src/feature/` für abgegrenzte Use-Cases
- **Globale Komponenten** unter `src/components/`
- **Kebab-Case** für Ordnernamen
- **PascalCase** für Vue-Komponentendateien
- **Scoped Styles** bevorzugen
- **TypeScript** in allen `.ts`- und `.vue`-Dateien

### Checkliste für neue Features

- [ ] Feature-Ordner unter `src/feature/<name>/src/` erstellt
- [ ] Unterordner: `components/`, `pages/`, `stores/`, `services/`, `shared/types/`, `tests/`
- [ ] Route(n) in `src/router/index.ts` registriert
- [ ] Übersetzungsschlüssel in `de.json` und `en.json` hinzugefügt
- [ ] `titleKey` in Route-Meta definiert
- [ ] Unit-Tests geschrieben
- [ ] `npm run lint` und `npm run test:unit` erfolgreich

---

## Pull-Request-Workflow

1. **Branch** vom aktuellen `main` erstellen
2. **Änderungen** implementieren
3. **Lint & Tests** lokal prüfen:
   ```bash
   npm run lint
   npm run test:unit
   npm run type-check
   ```
4. **Commit** mit konventioneller Nachricht
5. **Pull Request** erstellen
6. **Code Review** abwarten
7. **Merge** nach Freigabe
