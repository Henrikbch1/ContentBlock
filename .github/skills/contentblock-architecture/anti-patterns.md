# Anti-Patterns ("Nicht tun"-Liste)

[← zurück zu SKILL.md](../SKILL.md)

Jeder Punkt war eine echte Fundstelle in diesem Repository (Stand vor dem
Refactoring auf dieses Skill) — die Beispiele sind mittlerweile behoben
(siehe jeweiliger Verweis); die Regel bleibt gültig für neuen Code. Die
meisten Punkte sind mechanisch prüfbar — siehe
[`invariants.md`](invariants.md); Behebung immer nach
[`checklists/refactoring-playbook.md`](checklists/refactoring-playbook.md).

- **Nicht** Relation-/Asset-Id-Hilfsfunktionen pro Datei neu erfinden.
  `components/layout/Header.tsx` definierte früher ein eigenes,
  fast identisches `getRelation`/`getAssetId` statt die gemeinsamen Helfer zu
  nutzen — jetzt zentral in `lib/directusRelations.ts`
  (`getRelationId`/`getRelationIds`/`getRelation`/`getAssetId`), von
  `lib/queries.ts`, `DirectusImage.tsx`, `Header.tsx` und `DocumentsBlock.tsx`
  gemeinsam importiert.
- **Nicht** Leer-/Lade-/Fehlertexte pro Block hartkodieren. Waren zuvor elfmal
  unabhängig als String-Literal vorhanden — jetzt zentral in
  `lib/uiMessages.ts` (`EMPTY_MESSAGES`/`LOADING_MESSAGES`/`ERROR_MESSAGES`),
  siehe [`conventions/constants-and-strings.md`](conventions/constants-and-strings.md).
- **Nicht** `mx-auto max-w-Nxl px-4 py-12 sm:px-6 sm:py-16` inline
  wiederholen, wenn `Section`/`Container` genau dafür existieren. Alle Blocks
  nutzen jetzt `<Section>` (optional mit `containerClassName`), siehe
  [`conventions/styling-and-components.md`](conventions/styling-and-components.md).
- **Nicht** Fetch-Boilerplate (`useState` × 3 + `useEffect` +
  `isMounted`-Guard) in jeder Page/jedem Block erneut von Hand schreiben,
  sobald es sich zum dritten Mal wiederholt. Jetzt zentral im
  `useAsyncResource`-Hook, siehe
  [`conventions/state-and-data-fetching.md`](conventions/state-and-data-fetching.md).
- **Nicht** eigene `formatDate`-Implementierungen pro Datei anlegen. War in
  `NewsBlock.tsx`, `EventsBlock.tsx` und `pages/format.ts` dreifach
  vorhanden — jetzt zentral in `lib/format.ts`.
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
- **Nicht** eine Datei über ihr hartes Zeilen-Budget wachsen lassen, "weil
  der Split später kommt" — Budgets und Split-Rezepte in
  [`conventions/file-size-and-splitting.md`](conventions/file-size-and-splitting.md).
- **Nicht** ein Refactoring mit einer Verhaltensänderung im selben Schritt
  mischen — siehe die eisernen Regeln im
  [`checklists/refactoring-playbook.md`](checklists/refactoring-playbook.md).
- **Nicht** eine neue Formularsteuerung von Hand mit Tailwind nachbauen, ohne
  vorher zu prüfen, ob eine shadcn-Komponente (`Button`, `Input`, ...) das
  bereits abdeckt.
- **Nicht** Kommentare schreiben, die nur wiederholen, was der Code schon
  zeigt — ein Kommentar erklärt ausschließlich, _warum_ etwas so gemacht ist
  (z. B. der `as const`-Grund oder ein Directus-Eigenheiten-Workaround).
