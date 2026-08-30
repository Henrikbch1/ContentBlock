# File Size & Splitting (Dateien klein halten)

[← zurück zu SKILL.md](../SKILL.md)

Kleine, kohäsive Dateien sind das wichtigste Mittel, damit dieses Projekt
für Menschen _und_ Agenten wartbar bleibt. Diese Datei definiert verbindliche
Budgets und — wichtiger — die **exakten Split-Rezepte**, damit ein Split immer
gleich aussieht.

## Budgets (Zeilen inkl. Imports/Leerzeilen)

| Dateityp                          | Soll (weich) | Hart (Split Pflicht) |
| --------------------------------- | ------------ | -------------------- |
| `components/blocks/*Block.tsx`    | ≤ 120        | 180                  |
| `components/common/*`, `layout/*` | ≤ 120        | 180                  |
| `pages/*Page.tsx`                 | ≤ 150        | 200                  |
| `App.tsx`                         | ≤ 120        | 160                  |
| `lib/*.ts` (ein Modul)            | ≤ 200        | 250                  |

- **Weiches Budget überschritten** → beim nächsten Anfassen der Datei den
  passenden Split unten mitziehen ("Boy-Scout-Rule").
- **Hartes Budget überschritten** → Split ist Teil der aktuellen Aufgabe,
  kein "später".
- Budget-Check (erwartet: keine Ausgabe über dem harten Limit):

```powershell
Get-ChildItem frontend/src -Recurse -Include *.ts,*.tsx |
  ForEach-Object { [PSCustomObject]@{ Lines = (Get-Content $_.FullName).Count; File = $_.FullName } } |
  Where-Object Lines -gt 200 | Sort-Object Lines -Descending
```

## Split-Rezepte (in genau dieser Form splitten, nicht anders)

### R-A: `lib/queries.ts` überschreitet das Budget → pro Ressource splitten

Zielstruktur (Feldlisten bleiben bei ihrer Ressource):

```
lib/queries/
├── index.ts          # re-exportiert alles; Import-Pfad "lib/queries" bleibt stabil
├── siteQueries.ts    # SITE_FIELDS, THEME_FIELDS, getSite
├── pageQueries.ts    # PAGE_FIELDS, getPageBySlug, getPageSlugs
├── newsQueries.ts    # NEWS_FIELDS, getNews, getNewsBySlug, getNewsForBlock
├── eventQueries.ts   # EVENT_FIELDS, getEvents, getEventBySlug, getEventsForBlock
└── ...               # eine Datei pro Ressource, gleiche Namenslogik
```

Regeln:

1. `index.ts` enthält **nur** `export * from "./xQueries";`-Zeilen — keine Logik.
2. Kein Call-Site-Import ändert sich (`from "../lib/queries"` bleibt gültig).
3. Gemeinsame Helfer (z. B. `getContactRoleIds`) wandern zu ihrer einzigen
   Verbraucher-Ressource; werden sie von 2+ Ressourcen gebraucht, gehören sie
   nach `lib/directusRelations.ts`.
4. Die `as never`-Grenze gilt danach für **alle** Dateien unter `lib/queries/`
   (plus `lib/directus.ts`).

### R-B: `lib/types.ts` überschreitet das Budget → nach Domäne splitten

```
lib/types/
├── index.ts          # nur Re-Exports; Import-Pfad "lib/types" bleibt stabil
├── directus.ts       # DirectusId, DirectusRelation, DirectusAsset
├── blocks.ts         # Block* -Typen, BlockCollection, BlockItem, PageBlock
└── content.ts        # Page, News, Event, Document, Person, Site, Theme, ...
```

Gleiche Regeln wie R-A: reiner Re-Export-Index, keine Call-Site-Änderung.

### R-C: `App.tsx` wächst → Routing-Logik nach `lib/` extrahieren

`App.tsx` darf nur orchestrieren. Wächst es (z. B. neue Routen, mehr
Link-Interception-Fälle), extrahieren in dieser Reihenfolge:

1. `getPathSegments` + Routen-Matching → `lib/routing.ts` (pure Funktionen,
   gut testbar: `matchRoute(pathname): Route`).
2. `popstate`/Click-Interception-`useEffect` → `lib/hooks/useClientNavigation.ts`
   (liefert `pathname` + `navigate`).
3. `RouteContent` bleibt in `App.tsx` — es ist die Orchestrierung selbst.

### R-D: Komponente zu groß → Sub-Komponente in derselben Datei zuerst, dann eigene Datei

1. Zuerst benannte, nicht exportierte Sub-Komponente **in derselben Datei**
   extrahieren (z. B. `const ContactCard = ...` in `ContactsBlock.tsx`).
2. Erst wenn die Datei trotzdem das harte Budget reißt ODER die
   Sub-Komponente von einer zweiten Datei gebraucht wird: eigene Datei.
   - Block-spezifisch → bleibt in `components/blocks/` (wie `ContactForm.tsx`).
   - Generisch wiederverwendbar → `components/common/`.
3. Kandidat aktuell: `Header.tsx` (> 200 Zeilen) — Desktop-Navigation und
   mobiles Menü als Sub-Komponenten (`DesktopNav`, `MobileNav`) extrahieren;
   erst in eigene Dateien, wenn Regel 2 greift.

### R-E: Page zu groß → Detail-/Listen-Ansicht trennen

`NewsPage.tsx`/`EventsPage.tsx` rendern Overview **und** Detail. Reißt eine
davon das Budget: `NewsOverview` + `NewsDetail` als nicht exportierte
Sub-Komponenten in derselben Datei (R-D Schritt 1); die Page bleibt der
einzige Export und behält Fetch + Tri-State-Gate.

## Wann NICHT splitten (Over-Engineering vermeiden)

- Keine Datei splitten, die unter dem weichen Budget liegt, "auf Vorrat".
- Keine `index.ts`-Barrels für Ordner einführen, deren Module einzeln
  importiert werden (`components/blocks/` braucht kein Barrel — der
  `BlockRenderer` ist der einzige Verbraucher und importiert explizit).
- Keine Ein-Zeilen-Helper in eigene Dateien auslagern; Helfer wandern nach
  `lib/` erst, wenn **zwei+ Dateien** sie brauchen (Rule of three light).
- Einen Split nie mit einer Umbenennung oder Verhaltensänderung im selben
  Schritt kombinieren — siehe [`../checklists/refactoring-playbook.md`](../checklists/refactoring-playbook.md).
