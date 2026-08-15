# Frontend-Architektur – ContentBlock (React · Tailwind v4 · shadcn/ui)

> Grobe Struktur & Rendering-Konzept, abgeleitet aus dem Directus-Snapshot (v12.2.0).
> Ziel: mobile-first, komponentenbasiert, wiederverwendbar, block-getrieben.
> Design-Details bewusst offen – werden über die Projekt-Skills (`shadcn`, `frontend-design`, `frontend`) umgesetzt.
> Ausführender Agent: überwiegend GPT-5.6 Luna.

---

## 1. Leitprinzip: "Alles ist ein Block"

Das CMS-Modell ist block-zentriert:

```
site (singleton) ─ navigation ─ footer ─ theme
pages (slug) ──> pages_blocks[] (sort, collection, item)  ← M2A
                       │
                       ▼
             <BlockRenderer collection item />
                       │
     ┌─────────────────┼─────────────────────────────┐
  block_hero   block_text   block_image ... (insgesamt 11 Block-Typen)
```

Das Frontend spiegelt das 1:1: **eine `BlockRenderer`-Komponente** löst über das
`collection`-Feld die passende React-Komponente auf. Neuer Block im CMS = neue
Komponente + ein Map-Eintrag.

---

## 2. Empfohlener Stack

- **Framework:** Next.js (App Router) – SSR/SSG für SEO auf `pages.slug`, `news`, `events`.
  (Alternative: Vite + React Router, falls rein clientseitig gewünscht.)
- **Styling:** Tailwind v4 + shadcn/ui (CSS-Variablen-Theming).
- **Daten:** `@directus/sdk` (typisiert über das Snapshot-Schema).

---

## 3. Projektstruktur

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Header + Footer + ThemeProvider
│   │   ├── [...slug]/page.tsx      # dynamische CMS-Seiten (pages.slug)
│   │   ├── news/page.tsx           # News-Übersicht
│   │   ├── news/[slug]/page.tsx    # News-Detail
│   │   ├── events/page.tsx         # Termin-Übersicht
│   │   └── events/[slug]/page.tsx  # Termin-Detail
│   ├── lib/
│   │   ├── directus.ts             # SDK-Client
│   │   ├── queries.ts              # getSite, getPageBySlug, getNews, getEvents ...
│   │   └── types.ts                # typisiertes Schema
│   ├── components/
│   │   ├── ui/                     # shadcn-Komponenten
│   │   ├── layout/                 # Header, Footer, Container, Section
│   │   ├── blocks/                 # BlockRenderer + je 1 Komponente pro Block
│   │   └── common/                 # DirectusImage, RichText, EmptyState
│   ├── styles/globals.css          # Tailwind + Theme-Tokens
│   └── hooks/
```

---

## 4. Block-Mapping (11 Typen)

| Directus-Block      | Relevante Felder                                   | Komponente        | shadcn-Basis         |
|---------------------|----------------------------------------------------|-------------------|----------------------|
| `block_hero`        | title, subtitle, image, buttons[] (variant)        | `HeroBlock`       | Button               |
| `block_text`        | headline, content (HTML)                           | `TextBlock`       | RichText/Typography  |
| `block_image`       | image, alt                                         | `ImageBlock`      | AspectRatio          |
| `block_table`       | title, data (JSON: Zeilen/Zellen)                  | `TableBlock`      | Table                |
| `block_cards`       | title, cards[] (title, text, image)                | `CardsBlock`      | Card                 |
| `block_faq`         | title, faqs[] (question, answer)                   | `FaqBlock`        | Accordion            |
| `block_contacts`    | mode (manual/by_role), show_photo/email/phone, roles[] | `ContactsBlock` | Card, Avatar         |
| `block_documents`   | mode (manual/by_category), filter_category, docs[] | `DocumentsBlock`  | Card/Table + Button  |
| `block_ticker`      | background_color, text_color, messages[]           | `TickerBlock`     | Marquee (custom)     |
| `block_news`        | mode (latest/by_category), filter_category, limit  | `NewsBlock`       | Card                 |
| `block_events`      | mode (upcoming/by_category), filter_category, limit| `EventsBlock`     | Card, Badge          |

### BlockRenderer (Skizze)

```tsx
const BLOCKS = {
  block_hero: HeroBlock,
  block_text: TextBlock,
  block_image: ImageBlock,
  block_table: TableBlock,
  block_cards: CardsBlock,
  block_faq: FaqBlock,
  block_contacts: ContactsBlock,
  block_documents: DocumentsBlock,
  block_ticker: TickerBlock,
  block_news: NewsBlock,
  block_events: EventsBlock,
} as const;

export function BlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  return blocks
    .sort((a, b) => a.sort - b.sort)
    .map((b) => {
      const Cmp = BLOCKS[b.collection];
      return Cmp ? <Cmp key={b.id} data={b.item} /> : null;
    });
}
```

---

## 5. Dynamische Blöcke (serverseitig nachladen)

Diese Blöcke speichern nur eine Konfiguration und holen Inhalte selbst:

- `block_news`  → `mode=latest` (nach published_date, limit) / `mode=by_category` (filter_category)
- `block_events`→ `mode=upcoming` (start_date >= now, limit) / `mode=by_category`
- `block_documents` → `mode=manual` (docs[]) / `mode=by_category` (filter_category)
- `block_contacts`  → `mode=manual` (roles[]) / `mode=by_role` (people nach role)

→ In `queries.ts` je eine typisierte Fetch-Funktion kapseln; Blöcke rendern nur.

---

## 6. Globals & Layout

- **`site` (Singleton):** Einstiegspunkt → referenziert `navigation`, `footer`, `theme`. Einmal laden, per Layout/Context bereitstellen.
- **Header:** `navigation.logo` + `nav_items` (Baum via `parent`, Typ `group`/`page`/`url`).
  - Mobile: shadcn `Sheet` (Burger-Menü).
  - Desktop: horizontale Navigation, Gruppen als Dropdown.
- **Footer:** `footer.copyright`, Pflicht-Links `imprint_page` + `privacy_page`, plus `footer_links` (Spalten via `sort`).

---

## 7. Theme & Design (Default: Schwarz-Weiß-Graustufen)

`theme`-Felder → shadcn-CSS-Variablen (Runtime-Injection):

| Directus-Feld       | CSS-Variable / Nutzung         |
|---------------------|--------------------------------|
| `background_color`  | `--background`                 |
| `text_color`        | `--foreground`                 |
| `primary_color`     | `--primary`                    |
| `secondary_color`   | `--secondary`                  |
| `accent_color`      | `--accent`                     |
| `font_heading`      | Font-Klasse (sans/serif)       |
| `border_radius`     | `--radius` (none/sm/md/lg)     |

- **Fallback = neutral/zinc-Palette** → reduzierter Schwarz-Weiß-Look, wenn Felder leer sind.
- **Mobile-first:** Basis-Styles breakpoint-los, danach `md:` / `lg:`.
- Einheitliche `Section` + `Container` (max-width, responsive Padding) über alle Blöcke.

---

## 8. Routing

| Route                | Quelle                                  |
|----------------------|-----------------------------------------|
| `/[...slug]`         | `pages` (slug) → `pages_blocks` rendern |
| `/news`, `/news/:slug` | `news` (slug, category)               |
| `/events`, `/events/:slug` | `events` (slug, start/end, location)|

---

## 9. Skill-Einsatz (einmal lesen, dann zweckgebunden nutzen)

- **`shadcn`** → Komponenten-Inventar (Button, Card, Accordion, Table, Sheet, Avatar, Badge) prüfen/installieren, überall wiederverwenden.
- **`frontend-design`** → Look-&-Feel, Spacing-/Typo-Skala, Theme-Token-Mapping, Graustufen-Ästhetik.
- **`frontend`** → Datenanbindung, BlockRenderer, Routing, Komponentenlogik.

---

## 10. Nächste Schritte (für den ausführenden Agenten)

1. `directus.ts` + typisiertes Schema (`types.ts`) aus dem Snapshot generieren.
2. `queries.ts`: `getSite`, `getPageBySlug`, plus Fetches für dynamische Blöcke.
3. Layout (Header/Footer/ThemeProvider) + `Section`/`Container`.
4. `BlockRenderer` + die 11 Block-Komponenten (shadcn-basiert).
5. Routen für pages / news / events.
6. Theme-Token-Injection + neutraler Default.
