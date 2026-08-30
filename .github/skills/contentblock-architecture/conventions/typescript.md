# TypeScript Conventions

[← zurück zu SKILL.md](../SKILL.md)

`tsconfig.json` hat bereits `"strict": true`. Diese Regeln konkretisieren,
wie in diesem Projekt strikt _und_ pragmatisch bleibt.

## `DirectusRelation<T>` konsequent null-sicher behandeln

```ts
export type DirectusRelation<T> = T | DirectusId | null;
```

Jede Relation kann drei Formen annehmen: nicht geladen (`id`/`string`),
geladen (`T`) oder `null`. Jeder Zugriff auf eine Relation geht durch eine
Guard-Funktion — nie durch einen direkten Feldzugriff:

```ts
// Richtig — zentral in lib/directusRelations.ts
const getRelationId = <T extends { id: DirectusId }>(
  relation: DirectusRelation<T> | undefined,
): DirectusId | null =>
  typeof relation === "string" || typeof relation === "number"
    ? relation
    : (relation?.id ?? null);
```

Neue Relation-Zugriffe importieren die vorhandenen Guards aus
`lib/directusRelations.ts` (oder erweitern sie dort), statt sie erneut zu
schreiben (siehe [`naming.md`](naming.md), Invariante I-7).

## `as never` / SDK-Typumgehungen nur an der Directus-Grenze

`@directus/sdk` erzwingt bei dynamischen Feldlisten (`readItems("news", {
fields: NEWS_FIELDS as never })`) gelegentlich eine Typumgehung. Das ist in
**`lib/queries.ts` und `lib/directus.ts` akzeptiert und dokumentiert** —
diese beiden Dateien sind die bewusste Sicherheitsgrenze zwischen dem
untypisierten Directus-Wire-Format und dem typisierten Rest der App.

Regel: **`as never`/`as unknown as X` taucht nirgendwo außerhalb von
`lib/directus.ts`/`lib/queries.ts` auf.** Jede Komponente, jede Page erhält
bereits sauber typisierte Werte aus `lib/types.ts`.

## Kein `any`

- Unbekannte/externe Daten (z. B. `BlockTable.data`) sind `unknown`, nie
  `any` — Verbraucher (`TableBlock.tsx`) müssen aktiv narrowen, bevor sie
  rendern.
- `// @ts-expect-error` (nie `@ts-ignore`) nur mit Begründungskommentar direkt
  darüber, nur als letztes Mittel.

## String-Literal-Unions statt `enum`

`BlockMode` und `BlockCollection` sind bereits als Union definiert
(`"manual" | "latest" | ... | string`). Neue enum-artige Werte (z. B. ein
neues `layout`-Feld) folgen demselben Muster — kein TypeScript-`enum`.

## `Readonly`/`as const` konsequent nutzen

- Feldlisten bleiben `as const` (bereits durchgängig so in `lib/queries.ts`)
  — verhindert versehentliche Mutation und ermöglicht literale Typinferenz.
- Props-Typen sind `type X = { ... }`; wo eine Komponente ihre Props
  garantiert nicht mutiert (der Normalfall), ist `Readonly<{...}>` die
  präzisere, selbstdokumentierende Signatur — neue Komponenten sollten das
  konsequent so schreiben, auch wenn ältere Dateien es noch nicht tun.

```ts
// Empfohlen für neue Komponenten:
type HeroBlockProps = Readonly<{ item: BlockHero }>;
```

## Rückgabetypen explizit

Jede exportierte Komponente/Funktion bekommt einen expliziten Rückgabetyp
(`React.JSX.Element`, `Promise<Page | null>`, ...) — bereits durchgängig so
im Projekt, unbedingt beibehalten. Das macht Breaking Changes an der
Rückgabeform sofort im Diff sichtbar.

## Traceability-Kommentare bei Directus-gespiegelten Typen

Wenn ein Typ eine Directus-Collection 1:1 spiegelt, hilft ein Einzeiler, der
auf den Snapshot verweist — besonders bei Typen mit vielen optionalen
Feldern:

```ts
/** Spiegelt die Directus-Collection `news` (siehe cms/snapshots/snapshot.json). */
export interface News {
  /* ... */
}
```

Kein Pflichtkommentar für jeden Typ, aber sinnvoll bei nicht offensichtlichen
Feldnamen (z. B. `show_days_before` in `Event`).
