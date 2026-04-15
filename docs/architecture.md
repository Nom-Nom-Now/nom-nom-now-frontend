# Architektur

## Übersicht

Nom Nom Now Frontend ist eine Single-Page-Application (SPA) auf Basis von **Vue 3** mit der **Composition API**. Das Projekt verfolgt eine **feature-basierte Ordnerstruktur**, bei der jedes Feature seine eigenen Komponenten, Stores, Services und Typen kapselt.

---

## Ordnerstruktur

```
src/
├── App.vue                     # Root-Komponente (App-Shell)
├── main.ts                     # Einstiegspunkt (Plugins, Mounts)
├── material.ts                 # Material Design Web Component Imports
├── style.css                   # Globale CSS-Variablen (MD3 Design Tokens)
│
├── assets/                     # Statische Assets (Bilder, Icons)
│   └── icons/
│       ├── navigation/         # Icons für die Navigationsleiste
│       └── createRecipeProgress/  # Icons für den Rezept-Wizard
│
├── components/                 # Globale/Shared-Komponenten
│   ├── Frame/                  # App-Shell-Rahmenkomponenten
│   │   ├── NavigationFrame.vue
│   │   ├── NavigationItem.vue
│   │   ├── TitleFrame.vue
│   │   └── CornerRadius.vue
│   ├── MdLabel.vue
│   ├── StepNavigationButton.vue
│   └── HelloWorld.vue
│
├── feature/                    # Feature-Module (→ siehe features.md)
│   ├── recipes/
│   │   └── create/
│   ├── list-all-recipes/
│   ├── create-recipe-old/      # Legacy (wird ersetzt)
│   └── main-page/
│
├── locales/                    # i18n-Übersetzungsdateien
│   ├── index.ts
│   ├── de.json
│   └── en.json
│
├── router/                     # Vue Router Konfiguration
│   └── index.ts
│
├── services/                   # Globale API-Services (Legacy)
│   └── recipeService.ts
│
└── views/                      # Top-Level-Routen-Komponenten
    ├── LoginPage.vue
    ├── HomeView.vue
    ├── PlanView.vue
    ├── RecipesView.vue
    ├── CreateRecipeView.vue
    ├── BrowseView.vue
    └── NewRecipeView.vue
```

---

## App-Shell-Konzept

Die `App.vue` implementiert ein **Shell-Pattern** mit bedingter Anzeige:

```
┌──────────────────────────────────────────┐
│  ┌──────┐  ┌──────────────────────────┐  │
│  │      │  │   TitleFrame (Header)    │  │
│  │ Nav  │  ├──────────────────────────┤  │
│  │Frame │  │                          │  │
│  │      │  │   <router-view />        │  │
│  │      │  │   (Content Area)         │  │
│  │      │  │                          │  │
│  └──────┘  └──────────────────────────┘  │
└──────────────────────────────────────────┘
```

- **`showShell = true`** (Standard): Navigation-Sidebar + Header + Content
- **`showShell = false`**: Vollbild-Layout (z.B. Login-Seite)

Die Shell wird über die Route-Meta-Property `hideShell` gesteuert:

```typescript
{
  path: '/',
  component: LoginPage,
  meta: { hideShell: true },  // ← keine Navigation sichtbar
}
```

---

## Routing

Die App nutzt **Vue Router** mit `createWebHistory` (HTML5 History Mode). Routen sind teilweise verschachtelt:

```
/                  → LoginPage        (hideShell: true)
/home              → HelloWorld
/plan              → PlanView
/recipes           → RecipesView      (Layout-Wrapper)
  /recipes/create  → CreateRecipeView
  /recipes/oldcreate → NewRecipeView  (Legacy)
/browse            → BrowseView       (Layout-Wrapper)
  /browse/listall  → AllRecipesPage
```

### Route-Meta

Jede Route definiert einen `titleKey` in `meta`, der von `TitleFrame.vue` über `vue-i18n` aufgelöst wird:

```typescript
meta: { titleKey: 'feature.recipes.title' }
```

---

## Schichtenmodell

Die App folgt einer klaren Schichtentrennung innerhalb jedes Features:

```
┌─────────────────────────────────┐
│       Pages / Views             │  ← Route-Komponenten
├─────────────────────────────────┤
│       Components                │  ← UI-Bausteine
├─────────────────────────────────┤
│       Stores (Pinia)            │  ← Reaktiver Zustand
├─────────────────────────────────┤
│       Services                  │  ← Business-Logik + API-Mapping
├─────────────────────────────────┤
│       API-Types (DTOs)          │  ← Backend-Vertrag
└─────────────────────────────────┘
```

**Datenfluss:**  
`Komponente` → ruft `Store-Action` auf → `Service` mappt Domain-Modell zu DTO → `fetch()` → Backend

---

## Plugin-Registrierung

In `main.ts` werden die Vue-Plugins in folgender Reihenfolge registriert:

1. **vue-i18n** – Internationalisierung
2. **Vue Router** – Routing
3. **Pinia** – State Management

Material Design Web Components werden als ES-Modul-Seiteneffekte importiert und über Vites `isCustomElement`-Konfiguration als Custom Elements behandelt.

---

## Weiterführende Dokumentation

- [Features im Detail](./features.md)
- [Komponenten-Referenz](./components.md)
- [State Management](./state-management.md)
- [API-Integration](./api-integration.md)
