# Architecture Overview

[← zurück zu SKILL.md](../SKILL.md)

## Schichten, von außen nach innen

```
App.tsx
  ├─ lädt Site (Navigation/Footer/Theme) via getSite()
  ├─ übernimmt clientseitiges Routing (Pfad-Parsing, pushState-Interception)
  └─ RouteContent → CmsPage | NewsPage | EventsPage
        └─ <X>Page.tsx
              ├─ lädt genau eine Ressource (Page/News/Event) über lib/queries.ts
              ├─ rendert Tri-State (Error/Loading/Empty/Content)
              └─ BlockRenderer (nur CmsPage) / eigenes Listing-Markup (News/Events)
                    └─ <X>Block.tsx
                          └─ components/common/* (DirectusImage, RichText, EmptyState)
```

## Verantwortlichkeit pro Ordner/Datei

| Ort                                   | Verantwortung                                                                                                                                  | Darf NICHT enthalten                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `App.tsx`                             | Site-weite Daten (Theme/Navigation/Footer), clientseitiges Routing, Verbindungsstatus                                                          | Block- oder Seiteninhalte, Directus-Feldlisten                                            |
| `pages/*Page.tsx`                     | Eine Route orchestrieren: Slug/Parameter entgegennehmen, genau eine `lib/queries.ts`-Funktion aufrufen, Tri-State-Gate rendern                 | Eigene Directus-Feldlisten, Tailwind-Markup für Blockinhalte (das ist Aufgabe der Blocks) |
| `components/blocks/BlockRenderer.tsx` | `collection` → Block-Komponente auflösen (Registry/Adapter)                                                                                    | Fetching, Geschäftslogik, eigenes Styling                                                 |
| `components/blocks/*Block.tsx`        | Ein Directus-Block-Typ rendern: `item`-Prop → Markup; datenladende Blocks zusätzlich: genau eine `get<X>ForBlock`-Query via `useAsyncResource` | Fremde Queries, globaler State, Directus-SDK-/`lib/directus.ts`-Importe                   |
| `components/common/*`                 | Blockübergreifende, dumme UI-Bausteine (Bild, Leerzustand, Rich-Text, Theme-CSS-Variablen)                                                     | Block- oder seitenspezifische Logik                                                       |
| `components/layout/*`                 | Seitenrahmen (Header/Footer/Container/Section)                                                                                                 | Fetching, Block-Rendering-Logik                                                           |
| `lib/directus.ts`                     | SDK-Client + `Schema`-Typ instanziieren, Konfigurationsprüfung                                                                                 | Feldlisten, fachliche Query-Logik                                                         |
| `lib/queries.ts`                      | Alle `getX()`-Funktionen, Feldlisten (`as const`)                                                                                              | JSX, React-Hooks, Komponenten-State                                                       |
| `lib/directusRelations.ts`            | Geteilte Relation-/Asset-Id-Guards (`getRelationId`, `getRelationIds`, `getRelation`, `getAssetId`)                                            | Ressourcen-spezifische Logik, JSX                                                         |
| `lib/types.ts`                        | Reine Domain-Typen (Directus-Collections gespiegelt)                                                                                           | Funktionen mit Seiteneffekten, JSX                                                        |
| `lib/format.ts`                       | Geteilte Datums-/Wertformatierung (`formatDate`, `formatDateRange`)                                                                            | Directus-Zugriffe, JSX                                                                    |
| `lib/uiMessages.ts`                   | Zentrale Lade-/Leer-/Fehlertexte (`LOADING_MESSAGES`/`EMPTY_MESSAGES`/`ERROR_MESSAGES`)                                                        | Logik jeglicher Art                                                                       |
| `lib/hooks/`                          | Geteilte React-Hooks (`useAsyncResource`); Query-Funktion immer als Parameter                                                                  | Fest verdrahtete Directus-Aufrufe, JSX                                                    |
| `lib/utils.ts`                        | Generische, domänenfreie Helfer (`cn`)                                                                                                         | Directus- oder Block-spezifische Logik                                                    |

Jeder Ordner beantwortet genau eine Frage:

- `App.tsx` — _welche Route/welches Theme gilt gerade?_
- `pages/` — _welche eine Ressource braucht diese Route, und in welchem Zustand ist sie?_
- `components/blocks/` — _wie sieht ein bestimmter Directus-Block aus?_
- `components/common/` + `components/layout/` — _welche wiederverwendbaren, dummen Bausteine gibt es?_
- `lib/` — _woher kommen die Daten, und welche Form haben sie?_

## Warum diese Trennung sich lohnt

- **Testbarkeit**: `lib/types.ts` und die reinen Helfer in
  `lib/directusRelations.ts` und `lib/format.ts` sind pure Funktionen ohne
  Rendering — ideal für spätere Unit-Tests, ganz ohne DOM.
- **Austauschbarkeit**: Ändert sich die Directus-API oder ein Feldname, ist
  ausschließlich `lib/queries.ts` betroffen — keine Komponente muss angefasst
  werden.
- **Vorhersagbarkeit**: Ein neuer Block folgt immer demselben Muster (siehe
  [`../checklists/new-block-checklist.md`](../checklists/new-block-checklist.md)),
  dadurch ist jede `*Block.tsx` unabhängig vom Rest lesbar.
- **SRP auf Dateiebene**: `BlockRenderer.tsx` ordnet zu, `CmsPage.tsx`
  orchestriert, `HeroBlock.tsx` rendert — keine Datei macht alle drei Dinge.

Siehe [`data-flow.md`](data-flow.md) für den Datenfluss im Detail.
