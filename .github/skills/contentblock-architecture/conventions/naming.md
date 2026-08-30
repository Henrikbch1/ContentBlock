# Naming Conventions

[← zurück zu SKILL.md](../SKILL.md)

Abgeleitet aus dem bestehenden, bereits konsistenten Code (`HeroBlock`,
`CmsPage`, `getPageBySlug`, ...) — dieses Dokument macht das implizite Muster
explizit, damit es bei jedem neuen Block/jeder neuen Page erhalten bleibt.

| Kategorie                | Konvention                                                                  | Beispiel                                         |
| ------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------ |
| Block-Komponenten        | `<Name>Block.tsx`, PascalCase, Suffix `Block` Pflicht                       | `HeroBlock`, `CardsBlock`, `TickerBlock`         |
| Page-Komponenten         | `<Name>Page.tsx`, Suffix `Page` Pflicht                                     | `CmsPage`, `NewsPage`, `NotFoundPage`            |
| Layout-Komponenten       | PascalCase, Rollenname ohne Suffix                                          | `Header`, `Footer`, `Container`, `Section`       |
| Query-Funktionen         | `get<Resource>()` / `get<Resource>By<Key>()` / `get<Resource>ForBlock(cfg)` | `getSite`, `getPageBySlug`, `getNewsForBlock`    |
| Relation-Hilfsfunktionen | `get<X>Id` (Einzahl) / `get<X>Ids` (Mehrzahl)                               | `getRelationId`, `getRelationIds`                |
| Domain-Typen             | PascalCase, Directus-Collection gespiegelt                                  | `BlockHero`, `Page`, `News`, `Event`             |
| Union-Typen (String)     | PascalCase-Typname, SCREAMING-artige Literale nur wenn fachlich so benannt  | `BlockMode = "manual" \| "latest" \| ...`        |
| Props-Typen              | `<Component>Props`, `type`, nie `interface` für reine Props                 | `CmsPageProps`, `HeaderProps`                    |
| Boolesche Props/State    | Präfix `is`/`has`/`can`                                                     | `isLoading`, `hasError`, `hasFetchedOnce`        |
| Feldlisten (Directus)    | `SCREAMING_SNAKE_CASE` + Suffix `_FIELDS`, immer `as const`                 | `PAGE_FIELDS`, `NEWS_FIELDS`                     |
| Hooks                    | `use<Zweck>`                                                                | `useAsyncResource` (neu, siehe state-Konvention) |
| Dateien (Komponente)     | PascalCase, Dateiname = Exportname                                          | `DirectusImage.tsx`                              |
| Dateien (sonst)          | camelCase                                                                   | `queries.ts`, `format.ts`                        |

## Zusätzliche Regeln

- **Ein Export pro Konzept**: Eine Datei, die eine Komponente exportiert, ist
  nach dieser Komponente benannt. `ContactForm.tsx` exportiert nur
  `ContactForm` — keine zweite, unabhängige Komponente "weil sie klein ist".
- **Konsistenz vor Kreativität**: Ist das Muster `get<X>ForBlock(cfg)` für
  `News`/`Events` etabliert, folgt ein neuer moduswahlfähiger Block-Typ
  demselben Namen (`getDocumentsForBlock` existiert bereits so) — auch wenn
  ein kürzerer Name technisch auch ginge.
- **Keine Abkürzungen**: `cfg` in `getNewsForBlock(cfg: BlockNews)` ist die
  einzige etablierte Ausnahme (Parametername für ein Konfigurationsobjekt);
  neue Funktionen führen keine weiteren kryptischen Kürzel ein.
- **Relation-Helfer nicht pro Datei neu erfinden**: `getRelationId`,
  `getRelationIds`, `getRelation` und `getAssetId` leben zentral in
  `lib/directusRelations.ts` und werden von dort importiert. Eine neue,
  lokal duplizierte Variante ist ein Namens-_und_-Kohäsionsproblem — siehe
  [`../anti-patterns.md`](../anti-patterns.md) und Invariante I-7 in
  [`../invariants.md`](../invariants.md).
