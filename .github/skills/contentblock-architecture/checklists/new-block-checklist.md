# New-Block Checklist

[← zurück zu SKILL.md](../SKILL.md)

Schritt-für-Schritt, um einen neuen `block_*`-Typ Ende-zu-Ende anzulegen.
Nicht bei `components/` anfangen, bevor Typ und Query stehen.

## 1. Modell (`lib/types.ts`)

- [ ] `Block<Name>`-Interface mit `id: DirectusId` + optionalen,
      Directus-gespiegelten Feldern (`?: T | null`, nie ein Pflichtfeld, das
      im CMS leer sein kann).
- [ ] `BlockCollection`-Union um `"block_<name>"` erweitert.
- [ ] `BlockItem`-Union um `Block<Name>` erweitert.
- [ ] Relationen konsequent als `DirectusRelation<T>`, Assets als
      `DirectusAsset` typisiert (siehe [`../conventions/typescript.md`](../conventions/typescript.md)).

## 2. Directus-Schema

- [ ] Collection `block_<name>` existiert im CMS mit denselben Feldnamen wie
      der Typ (Snapshot/`cms/snapshots/snapshot.json` als Referenz).

## 3. Query (`lib/queries.ts`)

- [ ] `PAGE_FIELDS` um `"blocks.item:block_<name>.*"` (+ Relationsfelder wie
      `"blocks.item:block_<name>.<relation>.*"`) ergänzt.
- [ ] Falls der Block eine eigene Datenquelle mit `mode` hat (wie
      `News`/`Events`/`Documents`): eine `get<Name>ForBlock(cfg:
  Block<Name>)`-Funktion nach demselben Muster wie
      `getNewsForBlock`/`getEventsForBlock`/`getDocumentsForBlock`.
- [ ] Keine neue Relation-Hilfsfunktion, wenn `getRelationId`/`getRelationIds`
      bereits ausreicht.

## 4. Komponente (`components/blocks/<Name>Block.tsx`)

- [ ] Eine Datei, eine Komponente, Suffix `Block` (siehe
      [`../conventions/naming.md`](../conventions/naming.md)); Budget ≤ 120
      Zeilen (siehe [`../conventions/file-size-and-splitting.md`](../conventions/file-size-and-splitting.md)).
- [ ] Props-Typ `Readonly<{ item: Block<Name> }>`.
- [ ] **Statischer Block**: kein Import aus `lib/queries.ts`/`@directus/sdk`.
      **Datenladender Block** (eigene Datenquelle mit `mode`):
      `useAsyncResource(() => get<Name>ForBlock(item), [item])` + Tri-State
      (Error → Loading → Empty → Content) — Vorbild `NewsBlock.tsx`.
- [ ] `Section`/`Container` statt eigenem Wrapper-Markup (Ausnahme nur
      Full-Bleed, siehe
      [`../conventions/styling-and-components.md`](../conventions/styling-and-components.md)).
- [ ] Nur semantische Tailwind-Tokens, keine rohen Farben.
- [ ] Leer-/Lade-/Fehlertexte aus `lib/uiMessages.ts` statt neu hartkodiert
      (siehe [`../conventions/constants-and-strings.md`](../conventions/constants-and-strings.md)).
- [ ] Bilder über `DirectusImage`, Rich-Text über `RichText`,
      Leerzustand über `EmptyState` (nicht neu nachbauen).

## 5. Registry

- [ ] Import + Zeile im `BLOCKS`-Record in
      `components/blocks/BlockRenderer.tsx` ergänzt.

## 6. Qualitätsgates

- [ ] Invarianten I-1 bis I-9 aus [`../invariants.md`](../invariants.md)
      geprüft (Grep-Checks, keine Treffer).
- [ ] `cd frontend && npm run build` läuft fehlerfrei (`tsc --noEmit` +
      `vite build`).
- [ ] Responsive Darstellung und sichtbarer Tastaturfokus manuell geprüft
      (Projektregel bei UI-Änderungen).
- [ ] [`review-checklist.md`](review-checklist.md) durchgegangen.
