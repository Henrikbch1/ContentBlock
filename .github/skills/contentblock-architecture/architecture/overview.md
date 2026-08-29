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

| Ort                                   | Verantwortung                                                                                                                  | Darf NICHT enthalten                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `App.tsx`                             | Site-weite Daten (Theme/Navigation/Footer), clientseitiges Routing, Verbindungsstatus                                          | Block- oder Seiteninhalte, Directus-Feldlisten                                            |
| `pages/*Page.tsx`                     | Eine Route orchestrieren: Slug/Parameter entgegennehmen, genau eine `lib/queries.ts`-Funktion aufrufen, Tri-State-Gate rendern | Eigene Directus-Feldlisten, Tailwind-Markup für Blockinhalte (das ist Aufgabe der Blocks) |
| `components/blocks/BlockRenderer.tsx` | `collection` → Block-Komponente auflösen (Registry/Adapter)                                                                    | Fetching, Geschäftslogik, eigenes Styling                                                 |
| `components/blocks/*Block.tsx`        | Ein Directus-Block-Typ rendern: `item`-Prop → Markup                                                                           | Fetching, globaler State, Directus-SDK-Importe                                            |
| `components/common/*`                 | Blockübergreifende, dumme UI-Bausteine (Bild, Leerzustand, Rich-Text, Theme-CSS-Variablen)                                     | Block- oder seitenspezifische Logik                                                       |
| `components/layout/*`                 | Seitenrahmen (Header/Footer/Container/Section)                                                                                 | Fetching, Block-Rendering-Logik                                                           |
| `lib/directus.ts`                     | SDK-Client + `Schema`-Typ instanziieren, Konfigurationsprüfung                                                                 | Feldlisten, fachliche Query-Logik                                                         |
| `lib/queries.ts`                      | Alle `getX()`-Funktionen, Feldlisten (`as const`), Relation-Hilfsfunktionen                                                    | JSX, React-Hooks, Komponenten-State                                                       |
| `lib/types.ts`                        | Reine Domain-Typen (Directus-Collections gespiegelt)                                                                           | Funktionen mit Seiteneffekten, JSX                                                        |
| `lib/utils.ts`                        | Generische, domänenfreie Helfer (`cn`)                                                                                         | Directus- oder Block-spezifische Logik                                                    |

Jeder Ordner beantwortet genau eine Frage:

- `App.tsx` — _welche Route/welches Theme gilt gerade?_
- `pages/` — _welche eine Ressource braucht diese Route, und in welchem Zustand ist sie?_
- `components/blocks/` — _wie sieht ein bestimmter Directus-Block aus?_
- `components/common/` + `components/layout/` — _welche wiederverwendbaren, dummen Bausteine gibt es?_
- `lib/` — _woher kommen die Daten, und welche Form haben sie?_

## Warum diese Trennung sich lohnt

- **Testbarkeit**: `lib/types.ts` und die reinen Helfer in `lib/queries.ts`
  (`getRelationId`, `getRelationIds`, `getContactRoleIds`) sind pure
  Funktionen ohne Rendering — ideal für spätere Unit-Tests, ganz ohne DOM.
- **Austauschbarkeit**: Ändert sich die Directus-API oder ein Feldname, ist
  ausschließlich `lib/queries.ts` betroffen — keine Komponente muss angefasst
  werden.
- **Vorhersagbarkeit**: Ein neuer Block folgt immer demselben Muster (siehe
  [`../checklists/new-block-checklist.md`](../checklists/new-block-checklist.md)),
  dadurch ist jede `*Block.tsx` unabhängig vom Rest lesbar.
- **SRP auf Dateiebene**: `BlockRenderer.tsx` ordnet zu, `CmsPage.tsx`
  orchestriert, `HeroBlock.tsx` rendert — keine Datei macht alle drei Dinge.

Siehe [`data-flow.md`](data-flow.md) für den Datenfluss im Detail.
