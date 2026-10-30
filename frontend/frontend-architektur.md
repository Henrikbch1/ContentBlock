# Frontend-Architektur – ContentBlock (React · Vite · Tailwind v4)

> Ist-Stand der implementierten Single-Page-App. Das Datenmodell steht in
> [docs/architecture/DB.md](../docs/architecture/DB.md) und
> [cms/snapshots/snapshot.json](../cms/snapshots/snapshot.json). Bei Widersprüchen
> sind Code und Konfiguration maßgeblich.

---

## 1. Leitprinzip: „Alles ist ein Block“

```
site (singleton) ─ navigation ─ footer ─ theme
pages (slug) ──> pages_blocks[] (sort, collection, item)  ← M2A
                       │
                       ▼
              <BlockRenderer blocks />
                       │
     ┌─────────────────┼─────────────────────────────┐
  block_hero   block_text   block_image ... (11 Block-Typen)
```

`src/components/blocks/BlockRenderer.tsx` ordnet über `collection` jede der elf
`block_*`-Collections einer Komponente zu. Neuer Block = Typ, Directus-Schema,
Query-Felder, Komponente, Registry-Eintrag (siehe Skill
`.github/skills/contentblock-architecture`).

---

## 2. Stack

- **Build/Runtime:** Vite 8, React 19, TypeScript (strict). Reine Client-SPA – kein
  Next.js, kein SSR/SSG, kein Router-Paket.
- **Styling:** Tailwind CSS v4 über `@tailwindcss/vite`; semantische Tokens in
  `src/index.css` (`bg-primary`, `text-foreground`, …). `components.json` beschreibt
  shadcn im Stil `new-york`; einen Ordner `components/ui` gibt es bislang nicht.
- **Daten:** `@directus/sdk` mit typisiertem `Schema` (`src/lib/directus.ts`).
- **Qualität:** `npm run lint` (ESLint, flat config), `npm run format` (Prettier),
  `npm run test` (Vitest + Testing Library), `npm run build` (`tsc --noEmit` + Vite).
- **Umgebung:** `VITE_DIRECTUS_URL`, optional `VITE_DIRECTUS_TOKEN` und
  `VITE_THEME_MODE`.

---

## 3. Projektstruktur

```
frontend/src/
├── App.tsx                 # Routing per pathname, Site-Laden, Layout
├── main.tsx, index.css     # Einstieg, Tailwind + Theme-Tokens
├── pages/                  # CmsPage, NewsPage, EventsPage, NotFoundPage
├── components/
│   ├── blocks/             # BlockRenderer + eine Komponente je Block
│   ├── common/             # ThemeProvider, DirectusImage, RichText, EmptyState, …
│   └── layout/             # Header, Footer, Navigation, Container, Section
├── lib/
│   ├── directus.ts         # Client, Schema, assertDirectusConfigured, getAssetUrl
│   ├── directusRelations.ts# getRelation/getRelationId(s)/getAssetId
│   ├── queries/            # site, page, news, event, document, contact (+ index)
│   ├── types/              # directus, content, blocks (nullable Relationen)
│   ├── hooks/              # useAsyncResource, usePageTitle
│   └── format.ts, tableData.ts, uiMessages.ts, utils.ts
└── test/setup.ts           # Vitest-Setup (jest-dom, cleanup)
```

---

## 4. Routing

`App.tsx` wertet `window.location.pathname` aus und fängt interne Link-Klicks per
`history.pushState` ab:

| Pfad                                           | Seite                                   |
| ---------------------------------------------- | --------------------------------------- |
| `/`                                            | `CmsPage` mit Slug `home`               |
| `/news`, `/news/:slug`                         | `NewsPage`                              |
| `/termine`, `/termine/:slug` (auch `/events…`) | `EventsPage`                            |
| alles andere                                   | `CmsPage` mit dem Pfad als `pages.slug` |

Unbekannte Slugs rendern `NotFoundPage`.

---

## 5. Daten und Blocks

- **Statische Blocks** (Hero, Text, Image, Table, Cards, FAQ, Ticker) lesen nur ihre
  `item`-Prop, die `getPageBySlug` mit tiefer M2A-Feldliste lädt.
- **Datenladende Blocks** (News, Events, Documents, Contacts) rufen genau eine
  `get<X>ForBlock`-Query über `useAsyncResource` auf.
- Relationen sind `DirectusRelation<T>` (Objekt, Id oder `null`) und werden mit den
  Helfern aus `directusRelations.ts` null-sicher aufgelöst.
- Events erscheinen nur, wenn `visible_from` leer oder erreicht ist und der Termin
  (`end_date`, ohne Ende `start_date`) nicht vorbei ist.
- Asset-URLs entstehen ausschließlich über `getAssetUrl` in `lib/directus.ts`.
- `block_table.data` bleibt das flache `col_N`-Format;
  [tableData.ts](src/lib/tableData.ts) normalisiert es.
  [TableBlock.tsx](src/components/blocks/TableBlock.tsx) bietet eine Suche und
  Seiten zu fünf mobilen beziehungsweise 20 Desktop-Zeilen.
  [TableViews.tsx](src/components/blocks/TableViews.tsx) zeigt auf kleinen
  Bildschirmen beschriftete Karten und sonst eine semantische Tabelle.

---

## 6. Theme

`getSite()` lädt das Theme ausschließlich über die Relation `site.theme`.
`ThemeProvider` setzt daraus die `--cb-*`-Variablen auf `document.documentElement`
(nicht auf einem Wrapper) und entfernt sie beim Unmount. `src/index.css` definiert die
Defaults in `:root` und mappt sie in `@theme inline` auf Tailwind-Tokens
(`bg-primary`, `bg-surface`, `font-heading`, `rounded-card`, `shadow-card`, `py-section`,
`max-w-site`). Die Mapping-Logik liegt rein und testbar in `lib/themeVariables.ts`.

Im standardmäßigen Legacy-Modus gelten die bisherigen Farbzuordnungen:

| Directus-Feld      | CSS-Variable        | Werte                                      |
| ------------------ | ------------------- | ------------------------------------------ |
| `primary_color`    | `--cb-primary`      | gültige CSS-Farbe                          |
| `secondary_color`  | `--cb-secondary`    | gültige CSS-Farbe                          |
| `accent_color`     | `--cb-accent`       | gültige CSS-Farbe                          |
| `background_color` | `--cb-bg`           | gültige CSS-Farbe                          |
| `surface_color`    | `--cb-surface`      | gültige CSS-Farbe                          |
| `text_color`       | `--cb-text`         | gültige CSS-Farbe                          |
| `border_radius`    | `--cb-radius`       | `none`, `sm`, `md`, `lg`                   |
| `font_heading`     | `--cb-font-heading` | `sans` (DM Sans), `serif` (Fraunces)       |
| `font_body`        | `--cb-font-body`    | `sans` (DM Sans), `serif` (Fraunces)       |
| `spacing_scale`    | `--cb-section-y`    | `compact`, `normal`, `airy`                |
| `container_width`  | `--cb-container`    | `narrow` (64rem), `normal`, `wide` (80rem) |
| `shadow_style`     | `--cb-shadow`       | `none`, `subtle`, `strong`                 |

Ungültige oder fehlende Legacy-Werte fallen auf die Defaults in
[index.css](src/index.css) zurück. Die Syntaxprüfung gewährleistet keinen
Kontrast für frei kombinierte CMS-Farben. Die Schriften DM Sans und Fraunces
liegen als woff2 in `public/fonts` (Lizenzen daneben) und werden per `@font-face`
geladen; es gibt keine Anfragen an Google Fonts.

### Neutraler Modus

`VITE_THEME_MODE=neutral` wird vor dem Start beziehungsweise Produktionsbuild
gesetzt. Ohne diese Einstellung oder mit `VITE_THEME_MODE=legacy` bleibt das
bisherige Theme unverändert. Eine unbekannte Einstellung erzeugt eine
Konsolenwarnung und verwendet den Legacy-Modus.

Im neutralen Modus liest [neutralTheme.ts](src/lib/neutralTheme.ts) nur
`theme.primary_color` und optional `theme.accent_color`. Beide Werte müssen
deckende Hex-Farben wie `#005f62` oder `#fff` sein. Ohne zweiten Akzent wird
der erste wiederverwendet. Ungültige Eingaben erzeugen eine Konsolenwarnung und
verwenden den Standard beziehungsweise den ersten Akzent. Die bisherigen
Felder `secondary_color`, `background_color`, `surface_color` und `text_color`
sowie die einzelnen Ticker-Farben werden in diesem Modus nicht angewendet.
Schrift-, Radius-, Abstands-, Container- und Schatten-Presets bleiben erhalten.

Die feste neutrale Basis folgt über `prefers-color-scheme` dem hellen oder
dunklen Systemmodus. Ein manueller Umschalter ist nicht implementiert. Die
Primärfarbe wird für einen Kontrast von mindestens 7:1 zur neutralen Fläche
angepasst und auf höchstens 10:1 begrenzt. Weitere Abstufungen sowie passende
helle beziehungsweise dunkle Vordergrundfarben werden daraus abgeleitet.
Bild-Heroes erhalten einen dunklen Filter und helle Schrift. Die getesteten
Farbpaare und Grenzfälle stehen in
[neutralTheme.test.ts](src/lib/neutralTheme.test.ts); sie ersetzen keinen
vollständigen WCAG-Audit der Website.

Beispiel für einen lokalen Build im neutralen Modus aus `frontend`:

```powershell
$env:VITE_THEME_MODE = "neutral"
npm run build
```

Zurück auf das bisherige Verhalten: `VITE_THEME_MODE` entfernen oder auf
`legacy` setzen und das Frontend neu bauen.

`Section` hat die Prop `background` (`default`, `surface`, `primary`), die der
`BlockRenderer` aus dem Directus-Feld `background` jedes Blocks durchreicht. Dunkle
Hintergründe (`primary`, Footer) überschreiben die Kontext-Variablen `--ctx-*`, aus denen
`text-foreground`, `text-muted-foreground`, `border-border` und `text-link` abgeleitet sind;
Karten (`cardClassName`) setzen sie per `ctx-default` zurück. Rich-Text nutzt
`@tailwindcss/typography` mit denselben Tokens.

Die Desktop-Navigation rendert wie die mobile beliebig tiefe Menübäume (verschachtelte
Listen im Dropdown).

---

## 7. Offene Punkte

- shadcn-Komponenten sind noch nicht generiert; Formulare und Buttons sind handgebautes
  Tailwind. Vor dem Hinzufügen den Skill `.github/skills/shadcn/SKILL.md` verwenden.
- Kein SSR/SEO-Rendering; Seitentitel setzt `usePageTitle` clientseitig.
