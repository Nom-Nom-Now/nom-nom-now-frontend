# Nom Nom Now – Frontend-Dokumentation

> Rezept- und Essensplanungs-App, gebaut mit **Vue 3**, **TypeScript** und **Vite**.

---

## Inhaltsverzeichnis

| Dokument | Beschreibung |
|---|---|
| [Getting Started](./getting-started.md) | Installation, Voraussetzungen, verfügbare Scripts |
| [Architektur](./architecture.md) | Projektstruktur, Feature-basiertes Layout, App-Shell-Konzept |
| [Features](./features.md) | Übersicht aller Feature-Module und deren Aufbau |
| [Komponenten](./components.md) | Globale/Shared-Komponenten und Material Design Integration |
| [State Management](./state-management.md) | Pinia-Stores, Konventionen und Referenzbeispiel |
| [API-Integration](./api-integration.md) | Service-Schicht, DTOs, HTTP-Helper, Environment-Konfiguration |
| [Internationalisierung (i18n)](./i18n.md) | vue-i18n-Setup, Locale-Dateien, neue Sprache hinzufügen |
| [Deployment](./deployment.md) | Docker, Nginx, Docker Compose, CI/CD |
| [Contributing](./contributing.md) | Branch-Konventionen, Linting, Testing, PR-Workflow |

---

## Tech-Stack

| Technologie | Version | Zweck |
|---|---|---|
| [Vue 3](https://vuejs.org/) | ^3.5 | UI-Framework (Composition API) |
| [TypeScript](https://www.typescriptlang.org/) | ~5.8 | Typsicherheit |
| [Vite](https://vite.dev/) | ^7.1 | Build-Tool & Dev-Server |
| [Pinia](https://pinia.vuejs.org/) | ^3.0 | State Management |
| [Vue Router](https://router.vuejs.org/) | ^4.6 | Client-seitiges Routing |
| [vue-i18n](https://vue-i18n.intlify.dev/) | ^11.2 | Internationalisierung |
| [Material Web](https://github.com/nicholasbarnette/material-web) | ^2.4 | Material Design 3 Web Components |
| [Vitest](https://vitest.dev/) | ^4.1 | Unit-Testing |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | 9 / 3.6 | Linting & Formatierung |

---

## Schnellstart

```bash
git clone <repository-url>
cd nom-nom-now-frontend
npm ci
npm run dev
```

Detaillierte Anleitung: [Getting Started](./getting-started.md)
