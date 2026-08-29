---
name: contentblock-architecture
description: >-
  Architektur-Blueprint für das ContentBlock-Frontend (React 19 + Vite +
  TypeScript + Tailwind v4 + shadcn/ui + @directus/sdk). Beschreibt die
  Schichtung App → Page → BlockRenderer → Block-Komponente, die
  Ordner-Verantwortlichkeiten (components/blocks|common|layout, lib/, pages/),
  Namens- und TypeScript-Konventionen, den Umgang mit Directus-Relationen,
  Datenfetching/Tri-State-Gates und Styling mit Tailwind/shadcn. Immer nutzen
  beim Anlegen eines neuen Blocks, beim Review bestehender Blöcke/Seiten oder
  beim Refactoring Richtung Clean Code (Kohäsion, Kapselung, DRY).
applyTo: 'frontend/src/**/*.{ts,tsx}'
---

## ContentBlock Architecture Skill

### Zweck
Dieses Skill überträgt das Schichtungs- und Kohäsionsprinzip, das sich in
encoway-SLUI-Features bewährt hat (`slui-frontend-feature`-Skill), auf die
tatsächliche Architektur von **ContentBlock**. Es ist kein generisches
React-Pattern-Buch, sondern beschreibt exakt, wie *dieses* Repository
geschnitten ist: `App.tsx` → `pages/*Page.tsx` → `BlockRenderer` →
`*Block.tsx`, getragen von der `lib/`-Schicht (`directus.ts` / `queries.ts` /
`types.ts` / `utils.ts`).

Ergänzt, ersetzt aber nicht:
- [`../frontend/SKILL.md`](../frontend/SKILL.md) — projektweite Grundregeln
  (Block-Registry, Theme-Farben, semantische Tokens).
- [`../shadcn/SKILL.md`](../shadcn/SKILL.md) — shadcn/ui-Komponenten
  hinzufügen/anpassen.
- [`../frontend-design/SKILL.md`](../frontend-design/SKILL.md) — visuelle
  Gestaltungsentscheidungen.
- Der globale `clean-code`-Skill (Naming, Guard Clauses, keine Kommentare im
  Code, `const`/`readonly`, keine `any`) gilt weiterhin uneingeschränkt für
  TypeScript/React; die hier beschriebenen Regeln sind die
  **projektspezifische Konkretisierung** davon.

### Kernprinzipien (Kurzfassung)
1. **Schichtung nach technischem Belang, nicht nach UI-Screen**: Directus-I/O
   (`lib/`), reine Präsentation (`components/`), Domänenmodell
   (`lib/types.ts`) und Routing/Orchestrierung (`pages/`, `App.tsx`) sind
   strikt getrennt — siehe [`architecture/overview.md`](architecture/overview.md).
2. **Unidirektionaler Datenfluss**: Daten fließen ausschließlich
   `queries.ts → Page/App (state) → BlockRenderer → Block` per Props nach
   unten. Kein Block importiert `lib/queries.ts` oder `lib/directus.ts`
   selbst — siehe [`architecture/data-flow.md`](architecture/data-flow.md).
3. **Ein Block = eine Datei + ein Registry-Eintrag** (bereits Projektregel);
   dieses Skill definiert zusätzlich, *was* in diese eine Datei gehört und
   was nicht — siehe [`conventions/folder-structure.md`](conventions/folder-structure.md).
4. **Keine verstreuten Duplikate**: Relation-/Asset-Id-Hilfsfunktionen,
   Leer-/Lade-Texte und wiederkehrende Tailwind-Klassencluster leben genau
   einmal — siehe [`conventions/constants-and-strings.md`](conventions/constants-and-strings.md)
   und [`anti-patterns.md`](anti-patterns.md).
5. **`unknown`/`as never` nur an der Directus-Grenze**: Typunsicherheiten aus
   dem SDK werden ausschließlich in `lib/queries.ts`/`lib/directus.ts`
   aufgelöst, nie in Komponenten — siehe [`conventions/typescript.md`](conventions/typescript.md).
6. **Tri-State-Gate statt verstreuter `isLoading`/`hasError`-Ifs**: jede
   datengetriebene Seite rendert Error → Loading → Empty → Content in dieser
   Reihenfolge, über eine gemeinsame Komponente/einen Hook — siehe
   [`conventions/state-and-data-fetching.md`](conventions/state-and-data-fetching.md).

### Schichtung im Überblick

```
App.tsx                         Root: Site-/Theme-Fetch + manuelles Routing
  └─ pages/<X>Page.tsx           Orchestrator: Slug → Fetch → Tri-State-Gate → Inhalt
       └─ BlockRenderer.tsx      Registry-Adapter: collection → Block-Komponente
            └─ <X>Block.tsx      Präsentation: item-Prop → Tailwind/shadcn-Markup
                 └─ components/common/*   wiederverwendbare, dumme UI-Bausteine

lib/directus.ts   → Client + Schema (einzige Stelle mit SDK-Instanziierung)
lib/queries.ts    → getX()-Funktionen (Directus-I/O, Feldlisten als `as const`)
lib/types.ts      → reine Domain-Typen (kein React, keine Side-Effects)
lib/utils.ts      → generische, domänenfreie Helfer (z. B. `cn`)
```

Jeder Pfeil zeigt nur nach unten/seitwärts. Ein `*Block.tsx` ruft nie
`lib/queries.ts` auf; eine `pages/*Page.tsx` enthält nie Tailwind-Markup für
Blockinhalte selbst (das ist Aufgabe der Blocks).

### Referenzindex (modular — gezielt nachlesen, nicht alles auf einmal)

**Architektur**
- [`architecture/overview.md`](architecture/overview.md) — Schichten & Ordner-Verantwortlichkeiten im Detail
- [`architecture/data-flow.md`](architecture/data-flow.md) — wie Daten von Directus bis zum Block fließen, wo State lebt

**Konventionen**
- [`conventions/folder-structure.md`](conventions/folder-structure.md) — verbindliches Ordnerskelett unter `frontend/src/`
- [`conventions/naming.md`](conventions/naming.md) — Namenstabelle für Blocks, Pages, Hooks, Helfer
- [`conventions/typescript.md`](conventions/typescript.md) — `DirectusRelation<T>`, `as never`-Grenze, keine `any`, String-Union statt Enum
- [`conventions/constants-and-strings.md`](conventions/constants-and-strings.md) — Feldlisten, UI-Texte, Sentinel-Werte zentral halten
- [`conventions/state-and-data-fetching.md`](conventions/state-and-data-fetching.md) — wann `useState` genügt, Tri-State-Gate, gemeinsamer Fetch-Hook
- [`conventions/styling-and-components.md`](conventions/styling-and-components.md) — Tailwind/shadcn-Wiederverwendung, `Section`/`Container`, A11y

**Checklisten**
- [`checklists/new-block-checklist.md`](checklists/new-block-checklist.md) — neuen `block_*`-Typ Ende-zu-Ende anlegen
- [`checklists/review-checklist.md`](checklists/review-checklist.md) — Selbst-/PR-Review für dieses Projekt

**Sonstiges**
- [`anti-patterns.md`](anti-patterns.md) — konkrete "Nicht tun"-Liste, an echten Fundstellen im Repo festgemacht

### Quickstart: neuen Block in 6 Schritten
1. **Typ definieren.** `Block<Name>`-Interface in [`../../../frontend/src/lib/types.ts`](../../../frontend/src/lib/types.ts) ergänzen, `BlockCollection`/`BlockItem`-Union erweitern.
2. **Directus-Schema abgleichen.** Collection `block_<name>` im Directus-Snapshot prüfen/anlegen (siehe `cms/snapshots/snapshot.json`); Feldnamen 1:1 zum Typ.
3. **Query-Felder ergänzen.** `PAGE_FIELDS`-Array in `lib/queries.ts` um `blocks.item:block_<name>.*` (und Relationen) erweitern; bei Bedarf eine `get<Name>ForBlock`-Funktion analog zu `getNewsForBlock`/`getEventsForBlock`.
4. **Komponente bauen.** `components/blocks/<Name>Block.tsx`: eine Datei, eine Komponente, `item: Block<Name>`-Prop, `Readonly`-Prop-Typ, Tailwind + semantische Tokens, `Section`/`Container` statt eigenem Wrapper-Markup, Leertexte aus der zentralen Textquelle (siehe [`conventions/constants-and-strings.md`](conventions/constants-and-strings.md)).
5. **Registry-Eintrag.** Import + Zeile in `components/blocks/BlockRenderer.tsx` (`BLOCKS`-Record) ergänzen.
6. **Checkliste abhaken.** [`checklists/new-block-checklist.md`](checklists/new-block-checklist.md) und [`checklists/review-checklist.md`](checklists/review-checklist.md) durchgehen, danach `cd frontend && npm run build`.
