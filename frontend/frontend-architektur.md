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
- **Umgebung:** `VITE_DIRECTUS_URL`, optional `VITE_DIRECTUS_TOKEN`.

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
- `block_table.data` bleibt das flache `col_N`-Format; `tableData.ts` normalisiert es.

---

## 6. Theme

`getSite()` lädt das Theme ausschließlich über die Relation `site.theme`.
`ThemeProvider` setzt daraus CSS-Variablen auf einem Wrapper:

| Directus-Feld      | CSS-Variable                          |
| ------------------ | ------------------------------------- |
| `background_color` | `--background`                        |
| `text_color`       | `--foreground`                        |
| `primary_color`    | `--primary`                           |
| `secondary_color`  | `--secondary`                         |
| `accent_color`     | `--accent`                            |
| `border_radius`    | `--radius` (`none`, `sm`, `md`, `lg`) |
| `font_heading`     | `--font-heading` (`sans`, `serif`)    |

Ungültige oder fehlende Werte fallen auf die Defaults in `src/index.css` zurück
(grün/gold Vereinspalette, Fraunces/DM Sans).

---

## 7. Offene Punkte

- shadcn-Komponenten sind noch nicht generiert; Formulare und Buttons sind handgebautes
  Tailwind. Vor dem Hinzufügen den Skill `.github/skills/shadcn/SKILL.md` verwenden.
- Kein SSR/SEO-Rendering; Seitentitel setzt `usePageTitle` clientseitig.
