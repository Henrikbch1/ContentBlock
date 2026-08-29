# Anti-Patterns ("Nicht tun"-Liste)

[← zurück zu SKILL.md](../SKILL.md)

Jeder Punkt ist an einer echten (oder unmittelbar drohenden) Fundstelle in
diesem Repository festgemacht — keine abstrakten Beispiele.

- **Nicht** Relation-/Asset-Id-Hilfsfunktionen pro Datei neu erfinden.
  `components/layout/Header.tsx` definiert aktuell ein eigenes,
  fast identisches `getRelation`/`getAssetId` statt die existierenden
  Helfer aus `lib/queries.ts` (`getRelationId`) bzw.
  `components/common/DirectusImage.tsx` (`getAssetId`) zu nutzen/zu teilen.
  → in `lib/queries.ts` bzw. eine gemeinsame `lib/directusRelations.ts`
  konsolidieren.
- **Nicht** Leer-/Lade-Texte pro Block hartkodieren. Aktuell elfmal
  unabhängig als String-Literal vorhanden (`"Keine ... vorhanden."`,
  `"... wird/werden geladen ..."`). → siehe
  [`conventions/constants-and-strings.md`](conventions/constants-and-strings.md).
- **Nicht** `mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16` inline
  wiederholen, wenn `Section`/`Container` genau dafür existieren. →
  siehe [`conventions/styling-and-components.md`](conventions/styling-and-components.md).
- **Nicht** Fetch-Boilerplate (`useState` × 3 + `useEffect` +
  `isMounted`-Guard) in jeder Page erneut von Hand schreiben, sobald es sich
  zum dritten Mal wiederholt. → `useAsyncResource`-Hook, siehe
  [`conventions/state-and-data-fetching.md`](conventions/state-and-data-fetching.md).
- **Nicht** `as never`/`as unknown` außerhalb von `lib/directus.ts` und
  `lib/queries.ts` verwenden — jede Komponente bekommt bereits sauber
  typisierte Werte.
- **Nicht** einen Modul-Store oder React Context einführen, "weil es SLUI
  auch so macht" — in diesem Projekt mountet jede Seite vollständig neu; ein
  Store ohne Remount-Anforderung ist Over-Engineering (siehe
  [`architecture/data-flow.md`](architecture/data-flow.md)).
- **Nicht** rohe Tailwind-Farben oder Hex-Literale in `className` verwenden,
  wenn ein semantisches Token existiert.
- **Nicht** "leer" und "noch nicht geladen" verwechseln — ein leeres Array
  vor dem ersten erfolgreichen Fetch ist kein `EmptyState`.
- **Nicht** einen neuen Block anlegen, ohne alle vier Stellen zu pflegen
  (Typ, Query-Felder, Komponente, Registry-Eintrag in `BlockRenderer.tsx`) —
  siehe [`checklists/new-block-checklist.md`](checklists/new-block-checklist.md).
- **Nicht** `any` verwenden, wenn `unknown` + Narrowing (wie bereits bei
  `BlockTable.data`) ausreicht.
- **Nicht** eine neue Formularsteuerung von Hand mit Tailwind nachbauen, ohne
  vorher zu prüfen, ob eine shadcn-Komponente (`Button`, `Input`, ...) das
  bereits abdeckt.
- **Nicht** Kommentare schreiben, die nur wiederholen, was der Code schon
  zeigt — ein Kommentar erklärt ausschließlich, _warum_ etwas so gemacht ist
  (z. B. der `as const`-Grund oder ein Directus-Eigenheiten-Workaround).
