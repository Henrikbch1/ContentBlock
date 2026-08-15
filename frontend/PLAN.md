# Umsetzungsplan – ContentBlock Frontend

> **Für den ausführenden Agenten (überwiegend GPT-5.6 Luna).**
> Dieser Plan ist **step-by-step** abzuarbeiten. Arbeite die Phasen **in Reihenfolge** ab.
> Nach jeder Phase: **Definition of Done (DoD)** prüfen, dann committen (Conventional Commits).
>
> **Grundlage:** `frontend-architektur.md` (liegt im Projekt) + Directus-Snapshot (v12.2.0).
> **Stack:** React · Next.js (App Router) · TypeScript · Tailwind v4 · shadcn/ui · @directus/sdk.
> **Prinzipien:** mobile-first · komponentenbasiert · wiederverwendbar · Clean Code (SOLID).
> **Design:** Default Schwarz/Weiß/Graustufen (neutral/zinc), modern & reduziert.

---

## 0. Skill-Nutzung (VERPFLICHTEND)

Vor der Umsetzung **einmal** die relevanten Skills lesen, dann **zweckgebunden** einsetzen.
Skills NICHT bei jedem Task neu lesen – einmal verstehen, dann konsequent anwenden.

| Skill              | Wofür einsetzen                                                        | In welchen Phasen |
|--------------------|-----------------------------------------------------------------------|-------------------|
| `shadcn`           | UI-Komponenten installieren/verwenden (Button, Card, Accordion, …)    | 3, 5, 6, 7        |
| `frontend-design`  | Look & Feel, Spacing-/Typo-Skala, Theme-Token-Mapping, Graustufen     | 3, 4, 5, 6, 7     |
| `frontend`         | Datenanbindung, Routing, BlockRenderer, Komponentenlogik              | 2, 4, 5, 6, 7, 8  |

**Regel:** Wenn ein Task eine UI-Komponente erzeugt → `shadcn` + `frontend-design`.
Wenn ein Task Daten/Logik betrifft → `frontend`.

---

## 1. Phase 1 – Projekt-Setup & Grundgerüst

**Ziel:** Lauffähiges Next.js-Projekt mit Tailwind v4, shadcn/ui und SDK.

### Tasks
- [ ] 1.1 Next.js (App Router, TypeScript) in `apps/web` initialisieren.
- [ ] 1.2 Tailwind v4 konfigurieren (`globals.css`, PostCSS).
- [ ] 1.3 shadcn/ui initialisieren (**Skill: `shadcn`**) – Base-Color: **neutral/zinc**.
- [ ] 1.4 `@directus/sdk` installieren.
- [ ] 1.5 `.env.local` anlegen: `DIRECTUS_URL`, optional `DIRECTUS_TOKEN`.
- [ ] 1.6 Ordnerstruktur laut `frontend-architektur.md` anlegen (`lib`, `components/{ui,layout,blocks,common}`, `hooks`).

### DoD
- `pnpm dev` startet ohne Fehler, leere Startseite rendert.
- shadcn `Button` lässt sich importieren und anzeigen.

### Commit
`chore(web): scaffold next.js app with tailwind v4 and shadcn/ui`

---

## 2. Phase 2 – Directus-Anbindung & Typen

**Ziel:** Typisierter Datenzugriff auf alle relevanten Collections.
**Skill:** `frontend`

### Tasks
- [ ] 2.1 `lib/directus.ts`: SDK-Client mit `DIRECTUS_URL` + `rest()`.
- [ ] 2.2 `lib/types.ts`: TypeScript-Interfaces für das Schema. Mindestens:
  - `Site`, `Navigation`, `NavItem`, `Footer`, `FooterLink`, `Theme`
  - `Page`, `PageBlock` (M2A: `collection`, `item`, `sort`)
  - `News`, `Event`, `Person`, `Role`, `Category`, `Document`
  - alle 11 Block-Interfaces (siehe Phase 5)
- [ ] 2.3 `lib/queries.ts`: Basisfunktionen
  - `getSite()` → Singleton `site` inkl. `navigation` (+`items`, +`logo`), `footer` (+`columns`, +`imprint_page`, +`privacy_page`), `theme`.
  - `getPageBySlug(slug)` → `pages` inkl. `blocks.*` (M2A tief laden).
  - `getPageSlugs()` → für statische Generierung.

### Wichtige Directus-Query-Hinweise
- M2A tief laden über `fields`, z. B.:
  `fields: ['*', { blocks: ['id','collection','item','sort'] }]`
  und pro Block-Typ die Deep-Query (`item:block_hero.*`).
- `on_delete: SET NULL` überall → **immer auf `null` prüfen** beim Rendern.
- Relationsfelder sind UUIDs; bei Bildern (`directus_files`) → Asset-URL bauen.

### DoD
- `getSite()` liefert Navigation + Footer + Theme.
- `getPageBySlug("home")` liefert Blocks in korrekter `sort`-Reihenfolge.

### Commit
`feat(web): add directus client, schema types and base queries`

---

## 3. Phase 3 – Theme-System (Schwarz/Weiß/Graustufen)

**Ziel:** Directus-`theme` steuert shadcn-CSS-Variablen zur Laufzeit.
**Skills:** `frontend-design` + `shadcn`

### Feld-Mapping (`theme` → CSS-Variablen)
| Directus-Feld      | CSS-Variable   | Fallback (neutral) |
|--------------------|----------------|--------------------|
| `background_color` | `--background` | weiß / zinc-950 (dark) |
| `text_color`       | `--foreground` | zinc-950 / zinc-50 |
| `primary_color`    | `--primary`    | zinc-900           |
| `secondary_color`  | `--secondary`  | zinc-100           |
| `accent_color`     | `--accent`     | zinc-100           |
| `font_heading`     | Font (sans/serif) | sans            |
| `border_radius`    | `--radius`     | md (0.5rem)        |

### Tasks
- [ ] 3.1 `components/common/ThemeProvider.tsx`: liest `theme` aus `getSite()`, injiziert CSS-Variablen auf `:root` (inline style oder `<style>`).
- [ ] 3.2 `globals.css`: neutrale Default-Tokens (Light + Dark) definieren → greifen, wenn Theme-Feld leer.
- [ ] 3.3 `border_radius`-Mapping: `none→0`, `sm→0.25rem`, `md→0.5rem`, `lg→1rem`.
- [ ] 3.4 `font_heading`: sans/serif als Utility-Klasse auf Headings.

### DoD
- Ändern eines Farbwerts in Directus verändert das Frontend nach Reload.
- Ohne Theme-Werte erscheint sauberer neutraler Schwarz-Weiß-Look.

### Commit
`feat(web): map directus theme to shadcn css variables with neutral fallback`

---

## 4. Phase 4 – Layout (Header, Footer, Container)

**Ziel:** Globales, mobile-first Layout mit Navigation & Footer.
**Skills:** `frontend` (Logik) + `frontend-design` + `shadcn` (UI)

### Tasks
- [ ] 4.1 `components/layout/Container.tsx` + `Section.tsx` (max-width, responsive Padding, konsistenter vertikaler Rhythmus).
- [ ] 4.2 `components/layout/Header.tsx`:
  - Logo aus `navigation.logo`.
  - `nav_items` als Baum aufbauen (`parent`), Typen: `group` (Dropdown), `page` (→ `pages.slug`), `url` (`external_url`).
  - **Mobile:** shadcn `Sheet` (Burger). **Desktop:** horizontale Leiste + Dropdown für Gruppen.
- [ ] 4.3 `components/layout/Footer.tsx`:
  - `copyright`, Pflicht-Links `imprint_page` + `privacy_page`.
  - `footer_links` als Spalten (`sort`).
- [ ] 4.4 `app/layout.tsx`: ThemeProvider + Header + `{children}` + Footer; `getSite()` serverseitig.

### DoD
- Navigation funktioniert mobil (Sheet) und Desktop (Dropdown).
- Footer zeigt Impressum/Datenschutz + Spalten.

### Commit
`feat(web): add responsive layout with tree navigation and footer`

---

## 5. Phase 5 – BlockRenderer & die 11 Blöcke

**Ziel:** Block-getriebenes Rendering. **Kern des Systems.**
**Skills:** `frontend` (Renderer/Logik) + `shadcn` + `frontend-design` (jede Block-UI)

### 5.1 BlockRenderer zuerst
- [ ] `components/blocks/BlockRenderer.tsx` mit typisierter Map `collection → Komponente`.
- [ ] `sort` beachten, unbekannte Collections überspringen, `item === null` abfangen.

```tsx
const BLOCKS = {
  block_hero: HeroBlock, block_text: TextBlock, block_image: ImageBlock,
  block_table: TableBlock, block_cards: CardsBlock, block_faq: FaqBlock,
  block_contacts: ContactsBlock, block_documents: DocumentsBlock,
  block_ticker: TickerBlock, block_news: NewsBlock, block_events: EventsBlock,
} as const;
```

### 5.2 Statische Blöcke (Daten kommen aus `item`)
- [ ] **HeroBlock** – `title`, `subtitle`, `image`, `buttons[]` (`label`,`href`,`variant` primary/secondary). shadcn `Button`.
- [ ] **TextBlock** – `headline` + `content` (HTML) → `RichText`-Komponente (sicheres Rendern).
- [ ] **ImageBlock** – `image`, `alt`; shadcn `AspectRatio`, responsive.
- [ ] **TableBlock** – `title` + `data` (JSON: Zeilen mit `cells[].value`); shadcn `Table`, horizontal scrollbar auf Mobile.
- [ ] **CardsBlock** – `title` + `cards[]` (`title`,`text`,`image`); Grid 1→2→3 Spalten; shadcn `Card`.
- [ ] **FaqBlock** – `title` + `faqs[]` (`question`,`answer`); shadcn `Accordion`.
- [ ] **TickerBlock** – `background_color`, `text_color`, `messages[]` (`text`,`link`→page); Marquee (custom, `prefers-reduced-motion` respektieren).

### 5.3 Dynamische Blöcke (laden Inhalte selbst nach → Phase 6)
- [ ] **NewsBlock** – Config: `mode` (latest/by_category), `filter_category`, `limit`.
- [ ] **EventsBlock** – Config: `mode` (upcoming/by_category), `filter_category`, `limit`.
- [ ] **DocumentsBlock** – Config: `mode` (manual/by_category), `filter_category`, `docs[]`.
- [ ] **ContactsBlock** – Config: `mode` (manual/by_role), `show_photo/email/phone`, `roles[]`.

### DoD
- Eine Testseite mit allen 11 Blöcken rendert fehlerfrei, mobil & Desktop.
- Jeder Block ist eine eigenständige, wiederverwendbare Komponente.

### Commits (blockweise)
`feat(blocks): add hero block`, `feat(blocks): add faq block` …

---

## 6. Phase 6 – Datenlogik der dynamischen Blöcke

**Ziel:** `news`/`events`/`documents`/`contacts` laden serverseitig ihre Inhalte.
**Skill:** `frontend`

### Tasks (`lib/queries.ts` erweitern)
- [ ] 6.1 `getNewsForBlock(cfg)` – `latest` → sortiert `published_date` DESC + `limit`; `by_category` → Filter `category = filter_category`.
- [ ] 6.2 `getEventsForBlock(cfg)` – `upcoming` → `start_date >= now`, ASC, `limit`; `by_category` → Filter.
- [ ] 6.3 `getDocumentsForBlock(cfg)` – `manual` → `docs[]`; `by_category` → Filter `category`.
- [ ] 6.4 `getContactsForBlock(cfg)` – `manual` → `roles[]`; `by_role` → `people` nach `role`; Felder je nach `show_*`.

### DoD
- Jeder dynamische Block zeigt echte, gefilterte Daten.
- Leerer Zustand → `EmptyState`-Komponente (kein Layout-Bruch).

### Commit
`feat(web): add server-side data loading for dynamic blocks`

---

## 7. Phase 7 – Routing & Detailseiten

**Ziel:** CMS-Seiten + News/Events-Detailseiten.
**Skills:** `frontend` + `frontend-design`

### Tasks
- [ ] 7.1 `app/[...slug]/page.tsx` – `getPageBySlug` → `BlockRenderer`; `generateStaticParams` aus `getPageSlugs`; 404 bei unbekanntem Slug.
- [ ] 7.2 `app/news/page.tsx` + `app/news/[slug]/page.tsx` – Übersicht (Grid) + Detail (`cover_image`, `body`, `category`).
- [ ] 7.3 `app/events/page.tsx` + `app/events/[slug]/page.tsx` – Übersicht + Detail (`start_date`,`end_date`,`location`,`description`).
- [ ] 7.4 `<head>`/Metadata pro Seite (Title, Description) für SEO.
- [ ] 7.5 Datums-Formatierung zentral (Locale `de-DE`), keine verstreuten Formatierungen.

### DoD
- Jede CMS-Seite ist über ihren Slug erreichbar.
- News/Events-Übersicht und -Detail funktionieren.

### Commit
`feat(web): add dynamic page routing and news/events detail pages`

---

## 8. Phase 8 – Feinschliff, A11y & QA

**Ziel:** Konsistenz, Barrierefreiheit, Performance. (Frontend-Tests: **manuelles QA**, keine Unit-Tests.)
**Skills:** `frontend-design` + `frontend`

### Tasks
- [ ] 8.1 Responsive-Check aller Blöcke (Mobile · Tablet · Desktop).
- [ ] 8.2 A11y: semantisches HTML, `alt`-Texte, Fokus-States, Kontrast (Graustufen prüfen), Tastaturnavigation (Sheet/Accordion/Dropdown).
- [ ] 8.3 Bilder: Next `<Image>` / responsive `srcset`, Lazy Loading.
- [ ] 8.4 `prefers-reduced-motion` für Ticker/Animationen.
- [ ] 8.5 Loading-/Error-/Empty-States vereinheitlichen.
- [ ] 8.6 Manuelles QA gegen echte CMS-Inhalte.

### DoD
- Keine Layout-Shifts, saubere A11y, konsistenter Look über alle Blöcke.

### Commit
`polish(web): responsive, a11y and performance refinements`

---

## 9. Arbeitsregeln für den Agenten

1. **Reihenfolge einhalten** (Phase 1 → 8). Keine Phase überspringen.
2. **Skills zweckgebunden** einsetzen (siehe Abschnitt 0), nicht wiederholt neu einlesen.
3. **Clean Code:** sprechende Namen, kleine Funktionen, keine Magic Strings (Block-Namen/Modes als Konstanten/Enums), explizite Sichtbarkeiten, JSDoc bei öffentlichen Funktionen.
4. **Wiederverwendung vor Duplikat:** gemeinsame Bausteine (`DirectusImage`, `RichText`, `Section`, `EmptyState`) zuerst bauen, dann in Blöcken nutzen.
5. **Null-Sicherheit:** wegen `on_delete: SET NULL` überall Relationen defensiv prüfen.
6. **Commits:** Conventional Commits, pro sinnvoller Einheit ein Commit.
7. **Keine Frontend-Unit-Tests** – QA erfolgt manuell.
8. **Bei Unklarheit im Datenmodell:** Snapshot/`frontend-architektur.md` als Quelle nutzen.

---

## 10. Referenz: Alle Block-Collections (M2A erlaubt)

`block_hero`, `block_text`, `block_image`, `block_table`, `block_cards`,
`block_faq`, `block_contacts`, `block_documents`, `block_ticker`,
`block_news`, `block_events`

Untertabellen (o2m): `block_hero_buttons`, `block_cards_items`,
`block_faq_items`, `block_ticker_items`, `block_contacts_roles`, `block_docs_docs`.

Globals: `site` (singleton), `navigation` + `nav_items`, `footer` + `footer_links`, `theme`.
Content: `news`, `events`. Core: `pages` + `pages_blocks`, `people`, `documents`.
Stammdaten: `categories` (Baum), `roles` (Baum), `templates` + `templates_blocks`.
