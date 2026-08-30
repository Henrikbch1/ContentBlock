# Data Flow

[← zurück zu SKILL.md](../SKILL.md)

## Unidirektionaler Fluss

```
lib/directus.ts                  Client-Instanz (einmal erzeugt, importiert)
        │
        ▼
lib/queries.ts     getPageBySlug(slug) / getSite() / getNewsForBlock(cfg) / ...
        │  Promise<T>
        ▼
pages/<X>Page.tsx (oder App.tsx)   useAsyncResource(() => query(...), [deps])
        │                          liefert { data, isLoading, error, hasError }
        │  Props
        ▼
BlockRenderer.tsx   sortiert blocks, mappt collection → Komponente
        │  item-Prop
        ▼
<X>Block.tsx        rendert; ruft ausschließlich components/common/* auf
```

Regeln:

- **Zwei Block-Arten, keine dritte:**
  1. _Statische Blocks_ (`HeroBlock`, `TextBlock`, `CardsBlock`, ...) lesen
     ausschließlich über ihre `item`-Prop und importieren nie
     `lib/queries.ts` oder `lib/directus.ts`.
  2. _Datenladende Blocks_ (`NewsBlock`, `EventsBlock`, `ContactsBlock`,
     `DocumentsBlock`) haben eine eigene Datenquelle mit `mode`-Feld: sie
     rufen **genau ihre eine** `get<X>ForBlock(item)`-Funktion aus
     `lib/queries.ts` über `useAsyncResource` auf — nie mehrere Queries,
     nie `lib/directus.ts` direkt.
- Pages (bzw. `App.tsx` für Site-/Theme-Daten) rufen `lib/queries.ts`
  ausschließlich über `useAsyncResource` auf — kein manuelles
  `useState`×3 + `useEffect`-Boilerplate mehr schreiben.
- Es gibt aktuell **keine Schreiboperationen** außer `ContactForm`, das
  bewusst _keinen_ Directus-Call macht, sondern einen `mailto:`-Link baut —
  dafür ist kein State-Layer nötig, ein lokaler `onSubmit`-Handler reicht.

## Warum `useState`/`useEffect` hier genügt (kein Modul-Store nötig)

Im Unterschied zu einem SLUI-Dialog (der bei geschlossenem Modal unmountet,
seine Filter/Paginierung aber überleben soll) wird in ContentBlock bei jeder
Navigation die **gesamte Seite neu gemountet** (kein Router mit
Keep-Alive/Tabs, kein Dialog-Stack). Es gibt keinen Anwendungsfall, der
State über ein Unmount hinweg erhalten müsste. Deshalb:

- **Kein Modul-Store, kein Context nötig** für Seiteninhalte — der
  gemeinsame `useAsyncResource`-Hook (lokaler State pro Mount) in der
  jeweiligen `*Page.tsx` ist die richtige, einfachste Lösung. Einen Store
  einzuführen wäre Over-Engineering.
- Der **`isMounted`-Guard** (in `useAsyncResource` gekapselt)
  reicht als Race-Schutz aus, **solange** genau ein
  Fetch-Parameter (z. B. `slug`) den Effekt triggert: Ändert sich `slug`,
  läuft die Cleanup-Funktion des _alten_ Effekts und setzt dessen
  `isMounted` auf `false`, bevor der neue Effekt startet. Ein
  Sequenz-Token (wie in SLUI-Features) ist hier **nicht** nötig, solange
  jede Page nur einen einzigen Fetch-auslösenden Parameter hat.
- **Ausnahme, bei der ein Token nötig würde**: Sollte eine Seite künftig
  mehrere unabhängig änderbare Filter/Parameter gegen dieselbe Ressource
  bekommen (z. B. eine Such-/Filterleiste auf `NewsPage`), dann greift die
  einfache `isMounted`-Prüfung nicht mehr zuverlässig — ab diesem Punkt ist
  ein monoton steigendes Request-Sequenz-Token (siehe SLUI-Skill,
  `conventions/state.md`) das richtige Mittel, kein Modul-Store.

## Site-/Theme-Daten als Props, nicht als globaler Store

`App.tsx` lädt `Site` (Navigation, Footer, Theme) einmal beim Start und
reicht sie als Props an `Header`/`Footer`/`ThemeProvider` weiter. Das ist
bewusst **kein** globaler Store, weil:

- Diese Daten sich pro Sitzung nicht ändern (kein Live-Update nötig),
- nur eine Handvoll Komponenten sie brauchen (kein "Prop Drilling"-Problem
  über viele Ebenen).

Würde eine dritte, unabhängige Konsumentengruppe (z. B. ein Modal, das tief
verschachtelt ist) Zugriff auf `Site` brauchen, wäre React Context (nicht
zwingend ein Modul-Store) die nächste sinnvolle Eskalationsstufe — nicht
vorher einführen ("Rule of three").

## Behobenes Duplikat: Fetch-Boilerplate → `useAsyncResource`

`CmsPage`, `NewsPage`, `EventsPage`, `App.tsx` und die vier datenladenden
Blocks implementierten denselben Ablauf früher manuell
(`useState(data) + useState(isLoading) + useState(hasError) + useEffect` mit
`isMounted`-Guard). Das ist behoben: `lib/hooks/useAsyncResource.ts` kapselt
genau dieses Muster und gibt `{ data, isLoading, error, hasError }` zurück
(siehe [`../conventions/state-and-data-fetching.md`](../conventions/state-and-data-fetching.md)).
**Neuer Fetch-Code schreibt dieses Boilerplate nie wieder von Hand** — wer
es irgendwo findet, wendet Rezept 1 aus
[`../checklists/refactoring-playbook.md`](../checklists/refactoring-playbook.md) an.
