# Folder Structure Convention

[← zurück zu SKILL.md](../SKILL.md)

## Das Skelett (Ist-Zustand)

```
frontend/src/
├── App.tsx                        # Root: Site-Fetch + Routing
├── main.tsx
├── index.css                      # Tailwind v4 + semantische Tokens
├── components/
│   ├── blocks/                    # Ein Directus-Block = eine Datei
│   │   ├── BlockRenderer.tsx      # Registry: collection → Komponente
│   │   ├── HeroBlock.tsx
│   │   ├── TextBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── TableBlock.tsx
│   │   ├── CardsBlock.tsx
│   │   ├── FaqBlock.tsx
│   │   ├── ContactsBlock.tsx
│   │   ├── ContactForm.tsx        # von ContactsBlock genutzt (kein eigener Block-Typ)
│   │   ├── DocumentsBlock.tsx
│   │   ├── TickerBlock.tsx
│   │   ├── NewsBlock.tsx
│   │   └── EventsBlock.tsx
│   ├── common/                    # Blockübergreifende, dumme Bausteine
│   │   ├── DirectusImage.tsx
│   │   ├── EmptyState.tsx
│   │   ├── RichText.tsx
│   │   └── ThemeProvider.tsx
│   └── layout/                    # Seitenrahmen
│       ├── Container.tsx
│       ├── Section.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── directus.ts                # Client + Schema
│   ├── queries.ts                 # getX()-Funktionen + Feldlisten
│   ├── directusRelations.ts       # geteilte Relation-/Asset-Id-Helfer
│   ├── format.ts                  # geteilte Datum-Formatierung
│   ├── uiMessages.ts              # zentrale Lade-/Leer-/Fehlertexte
│   ├── types.ts                   # reine Domain-Typen
│   ├── utils.ts                   # generische Helfer (cn)
│   └── hooks/                     # geteilte Fetch-Hooks
│       └── useAsyncResource.ts
└── pages/
    ├── CmsPage.tsx
    ├── NewsPage.tsx
    ├── EventsPage.tsx
    └── NotFoundPage.tsx
```

## Regeln

1. **Ein Ordner pro technischem Belang**, nicht pro Seite. `components/blocks/`
   wächst mit jedem neuen Directus-Block-Typ; `pages/` wächst mit jeder neuen
   Route — beide bleiben unabhängig voneinander.
2. **`components/blocks/*Block.tsx` enthält genau eine Komponente** für genau
   einen `block_*`-Collection-Typ. Ausnahme: `ContactForm.tsx` ist kein
   eigener Block-Typ, sondern eine von `ContactsBlock` genutzte
   Sub-Komponente — sie bleibt trotzdem im `blocks/`-Ordner, weil sie nur in
   diesem Kontext existiert (kohäsiv, nicht generisch genug für `common/`).
3. **`lib/hooks/` kapselt geteilte Fetch-Hooks** (aktuell `useAsyncResource`),
   sobald mehr als zwei Stellen dasselbe Fetch-Boilerplate duplizieren
   (siehe [`state-and-data-fetching.md`](state-and-data-fetching.md)). Hooks
   hier kapseln _wie_ `lib/queries.ts`-Funktionen in React-State landen; sie
   rufen selbst keine Directus-Funktionen mit fest verdrahteten Namen auf,
   sondern nehmen die Query-Funktion als Parameter.
4. **Generische Formatierung lebt in `lib/format.ts`**, nicht in `pages/`.
   `formatDate`/`formatDateRange` werden von Blocks (`NewsBlock`,
   `EventsBlock`) und Pages (`NewsPage`, `EventsPage`) gleichermaßen genutzt
   — ein Page-lokales `format.ts` hätte diese Wiederverwendung erschwert.
5. **Kein Block/keine Page importiert `@directus/sdk` direkt.** Jeder
   Directus-Zugriff läuft über `lib/queries.ts`.
6. **Dateinamen**: Komponenten `PascalCase.tsx` (Dateiname = Exportname);
   alles andere `camelCase.ts` (siehe [`naming.md`](naming.md)).
