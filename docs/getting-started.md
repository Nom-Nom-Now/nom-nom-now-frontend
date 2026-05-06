# Getting Started

## Voraussetzungen

| Tool | Version |
|---|---|
| [Node.js](https://nodejs.org/) | **20 LTS** oder höher |
| npm | Wird mit Node.js mitgeliefert |
| Git | Beliebige aktuelle Version |

> **Tipp:** Nutze [nvm](https://github.com/nvm-sh/nvm) oder [fnm](https://github.com/Schniz/fnm), um zwischen Node-Versionen zu wechseln.

---

## Installation

```bash
# Repository klonen
git clone <repository-url>
cd nom-nom-now-frontend

# Dependencies installieren (exakte Versionen aus package-lock.json)
npm ci
```

---

## Entwicklungsserver starten

Stelle sicher, dass das Backend vorher im `dev`-Profil läuft. Die vollständige Backend-Anleitung liegt hier:

```text
../nom-nom-now-backend/docs/local-development.md
```

```bash
npm run dev
```

Vite startet einen lokalen Dev-Server (standardmäßig unter `http://localhost:5173`).

---

## Environment-Variablen

Die App nutzt Vite-Environment-Variablen (Prefix `VITE_`). Erstelle bei Bedarf eine `.env.local`-Datei im Projekt-Root:

```dotenv
# Direkter lokaler Backend-Endpunkt
VITE_API_BASE_URL=http://localhost:8080

# Backend-URL für Login-Redirects
VITE_BACKEND_URL=http://localhost:8080
```

| Variable | Beschreibung | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Basis-URL für alle API-Aufrufe (`/recipes`, `/categories`, …) | `""` (leerer String) |
| `VITE_BACKEND_URL` | Backend-URL für Login-Redirects. Im Backend-`dev`-Profil wird ohne Google direkt zurück auf `/home` redirected. | `""` |

> **Hinweis:** `.env.local` ist in `.gitignore` enthalten und wird nicht ins Repository eingecheckt.

---

## Verfügbare Scripts

| Script | Befehl | Beschreibung |
|---|---|---|
| `dev` | `npm run dev` | Startet den Vite-Dev-Server mit Hot-Module-Replacement |
| `build` | `npm run build` | Type-Check (`vue-tsc`) + Production-Build |
| `build-only` | `npm run build-only` | Production-Build ohne Type-Check |
| `type-check` | `npm run type-check` | Nur TypeScript-Typprüfung via `vue-tsc` |
| `preview` | `npm run preview` | Lokale Vorschau des Production-Builds |
| `lint` | `npm run lint` | ESLint über alle `.ts`- und `.vue`-Dateien mit Auto-Fix |
| `format` | `npm run format` | Prettier-Formatierung über `src/` |
| `test:unit` | `npm run test:unit` | Unit-Tests mit Vitest ausführen |

---

## Nächste Schritte

- [Architektur-Übersicht](./architecture.md) – Verstehe den Projektaufbau
- [Contributing](./contributing.md) – Richtlinien für Beiträge
