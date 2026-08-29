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
pages/<X>Page.tsx (oder App.tsx)   useEffect ruft genau eine Query-Funktion auf,
        │                          hält { data, isLoading, hasError } in useState
        │  Props
        ▼
BlockRenderer.tsx   sortiert blocks, mappt collection → Komponente
        │  item-Prop
        ▼
<X>Block.tsx        rendert; ruft ausschließlich components/common/* auf
```

Regeln:

- Ein Block **liest** ausschließlich über seine `item`-Prop. Er importiert
  nie `lib/queries.ts` oder `lib/directus.ts` — sonst entsteht ein zweiter,
  unkontrollierter Fetch-Pfad neben dem der Seite.
- Nur die orchestrierende `pages/*Page.tsx` (bzw. `App.tsx` für
  Site-/Theme-Daten) ruft `lib/queries.ts` auf.
- Es gibt aktuell **keine Schreiboperationen** außer `ContactForm`, das
  bewusst _keinen_ Directus-Call macht, sondern einen `mailto:`-Link baut —
  dafür ist kein State-Layer nötig, ein lokaler `onSubmit`-Handler reicht.

## Warum `useState`/`useEffect` hier genügt (kein Modul-Store nötig)

Im Unterschied zu einem SLUI-Dialog (der bei geschlossenem Modal unmountet,
seine Filter/Paginierung aber überleben soll) wird in ContentBlock bei jeder
Navigation die **gesamte Seite neu gemountet** (kein Router mit
Keep-Alive/Tabs, kein Dialog-Stack). Es gibt keinen Anwendungsfall, der
State über ein Unmount hinweg erhalten müsste. Deshalb:

- **Kein Modul-Store, kein Context nötig** für Seiteninhalte — lokaler
  `useState` in der jeweiligen `*Page.tsx` ist die richtige, einfachste
  Lösung. Einen Store einzuführen wäre Over-Engineering.
- Der bestehende **`isMounted`-Guard-Pattern** (siehe `CmsPage.tsx`,
  `NewsPage.tsx`) reicht als Race-Schutz aus, **solange** genau ein
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

## Wiederkehrendes Duplikat: Fetch-Boilerplate

`CmsPage`, `NewsPage` (Overview + Detail) und `App.tsx` implementieren
denselben Ablauf manuell:
`useState(data) + useState(isLoading) + useState(hasError) + useEffect` mit
`isMounted`-Guard. Das ist die Definition von duplizierter Logik (Clean-Code
Abschnitt 4 „Extract everything that can be extracted"). Empfehlung: ein
gemeinsamer Hook `useAsyncResource<T>(fetcher, deps)` in `lib/hooks/` (siehe
[`../conventions/state-and-data-fetching.md`](../conventions/state-and-data-fetching.md)),
der genau dieses Muster kapselt und `{ data, isLoading, hasError }`
zurückgibt — ohne einen Store einzuführen.
