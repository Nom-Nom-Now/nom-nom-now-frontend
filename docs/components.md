# Komponenten

## Übersicht

Globale bzw. gemeinsam genutzte Komponenten befinden sich unter `src/components/`. Sie werden feature-übergreifend eingesetzt. Feature-spezifische Komponenten liegen innerhalb des jeweiligen Feature-Ordners.

---

## Material Design Web Components

Das Projekt verwendet **[@material/web](https://github.com/nicholasbarnette/material-web)** (Material Design 3 Web Components). Diese werden als Custom Elements (`<md-*>`) direkt im Template genutzt.

### Konfiguration

In `vite.config.ts` wird Vue mitgeteilt, dass Tags mit dem Prefix `md-` keine Vue-Komponenten, sondern Custom Elements sind:

```typescript
vue({
  template: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('md-'),
    }
  }
})
```

### Registrierte Material-Komponenten

Die Imports erfolgen in `main.ts` und `material.ts`:

- `md-filled-button`
- `md-outlined-button`
- `md-checkbox`
- `md-filled-text-field`
- `md-outlined-text-field`
- `md-outlined-select`
- `md-icon`

### ESLint-Kompatibilität

In `eslint.config.ts` sind Material-Tags für folgende Regeln freigeschaltet:

- **`vue/no-undef-components`** – `md-.*` wird als bekannt behandelt
- **`vue/no-deprecated-slot-attribute`** – Material-Komponenten, die `slot`-Attribute benötigen, sind in `ignoreParents` aufgeführt

---

## Frame-Komponenten (`src/components/Frame/`)

Diese Komponenten bilden die **App-Shell** – den äußeren Rahmen der Anwendung.

### `NavigationFrame.vue`

Die Seitennavigation (linke Sidebar).

- **Darstellung:** Logo oben, darunter eine Liste von Navigationseinträgen
- **Routing:** Jeder Eintrag ist ein `<RouterLink>` mit Active-State-Styling
- **Konfiguration:** `navigationItems`-Array mit `textKey` (i18n-Schlüssel), `iconName` und `to` (Route-Pfad)

**Aktive Navigation:**
- Standard-Zustand: Transparenter Badge-Hintergrund
- Hover: `--md-sys-color-surface-variant`
- Aktiv: `--md-sys-color-secondary-container`

### `NavigationItem.vue`

Ein einzelner Navigationseintrag innerhalb der Sidebar.

| Prop | Typ | Beschreibung |
|---|---|---|
| `text` | `string` | Anzeigetext (über i18n übersetzt) |
| `iconName` | `string` | Dateiname des SVG-Icons (ohne Pfad/Extension) |

Das Icon wird dynamisch über `import.meta.url` geladen:
```
/src/assets/icons/navigation/{iconName}.svg
```

### `TitleFrame.vue`

Der Header-Bereich, der den aktuellen Seitentitel anzeigt.

- **Titel-Quelle:** `route.meta.titleKey` → über `t()` (vue-i18n) aufgelöst
- **Fallback:** `'Nom Nom Now'` wenn kein `titleKey` definiert
- **Styling:** Material-Design-Typografie (`--md-sys-typescale-title-large-*`)

### `CornerRadius.vue`

Rein dekoratives Element, das einen abgerundeten Übergang zwischen Header und Content erzeugt.

- Keine Props
- Keine Logik
- Reine CSS-Rundung (1rem Border-Radius)

---

## Shared-Komponenten

### `StepNavigationButton.vue`

Ein Button für die Schritt-Navigation des Rezept-Wizards.

| Prop | Typ | Beschreibung |
|---|---|---|
| `label` | `string` | Anzeigetext des Schritts |
| `iconName` | `string` | SVG-Icon-Dateiname aus `createRecipeProgress/` |
| `active` | `boolean` | Ob dieser Schritt aktuell aktiv ist |

**Styling:**
- Standard: Border mit `--md-sys-color-on-secondary-container`
- Aktiv: Hintergrund `--md-sys-color-surface`

### `MdLabel.vue`

Ein Label-Wrapper mit Material-Design-Typografie.

| Prop | Typ | Default | Beschreibung |
|---|---|---|---|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Größenvariante |

**Verwendung:**
```vue
<MdLabel size="large">Überschrift</MdLabel>
```

Nutzt den `<slot>`-Mechanismus für den Inhalt. Die CSS-Klasse wird dynamisch als `md-label-{size}` gesetzt.

### `HelloWorld.vue`

Platzhalter-Komponente, aktuell als Homepage unter `/home` genutzt.

---

## Konventionen

- **Feature-spezifische Komponenten** gehören in `feature/<name>/src/components/`
- **Featureübergreifende Komponenten** gehören in `src/components/`
- **Namensgebung:** PascalCase für Komponentendateien (`MyComponent.vue`)
- **Styling:** Scoped-Styles bevorzugen, globale CSS-Variablen aus `style.css` verwenden
