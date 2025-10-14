# Project Structure Guidelines

---

## When to Create a New Feature Folder

### Create a new feature folder under `feature/` when:

- A use-case has multiple components or logic (e.g., "user-profile", "settings", etc.).
- It introduces its own composables, stores, or routing views.

### Each feature folder should include:

- `components/` – Only used inside the feature
- `composables/` – Feature-specific composables (e.g., `useFetchShoppingItems.ts`)
- `pages/` – Pages/routes belonging to this feature
- `stores/` – Pinia stores tied to this feature

### Global Components

If a component is **reused across features**, place it in `components/ui/`. Group similar components (e.g., all button variants under `ui/buttons/`).

---

## Conventions

- **Naming**: Use kebab-case for folders, PascalCase for Vue components.
- **Typescript**: All files should be written in `.ts` or `.vue` with TS support.
- **CSS**: Keep global styles minimal. Prefer scoped styles or Tailwind (optional).
- **State Management**: Use Pinia. Keep store logic inside the relevant feature.

---