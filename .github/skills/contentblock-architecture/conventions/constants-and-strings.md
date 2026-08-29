# Constants, Strings & Magic Values

[← zurück zu SKILL.md](../SKILL.md)

**Harte Regel: keine wiederholten UI-Texte, Sentinel-Werte oder
Tailwind-Klassencluster inline in Komponenten.** Was mehrfach vorkommt oder
fachlich bedeutsam ist, bekommt einen Namen an einer zentralen Stelle.

## Bereits gute Beispiele im Projekt (so weitermachen)

- `lib/queries.ts`: `SITE_FIELDS`, `PAGE_FIELDS`, `NEWS_FIELDS`, ... als
  `as const`-Arrays — ein Ort pro Ressource, keine Feldliste doppelt getippt.
- `components/common/ThemeProvider.tsx`: `COLOR_VARIABLES`, `RADIUS_VALUES`,
  `HEADING_FONTS` als benannte Lookup-Tabellen statt `if`/`switch`-Ketten.

## Konkretes Duplikat im Projekt (Refactor-Kandidat)

Leer-/Lade-Texte sind aktuell in **elf Dateien unabhängig voneinander**
hartkodiert (u. a. `"Keine Karten vorhanden."`, `"Keine Kontakte
vorhanden."`, `"Keine Dokumente vorhanden."`, `"Nachrichten werden geladen
..."`). Das ist redundant und macht einen Wortlaut-/Ton-Wechsel
fehleranfällig (elf Stellen statt einer).

**Empfehlung**: eine zentrale Text-Quelle, z. B.
`lib/uiMessages.ts`:

```ts
export const EMPTY_MESSAGES = {
  cards: "Keine Karten vorhanden.",
  contacts: "Keine Kontakte vorhanden.",
  documents: "Keine Dokumente vorhanden.",
  news: "Keine Nachrichten vorhanden.",
  events: "Keine Veranstaltungen vorhanden.",
  faq: "Keine Fragen vorhanden.",
  table: "Keine Tabellendaten vorhanden.",
} as const;

export const LOADING_MESSAGES = {
  page: "Seite wird geladen ...",
  news: "Nachrichten werden geladen ...",
  events: "Termine werden geladen ...",
} as const;
```

Da das Projekt **einsprachig (Deutsch)** ist, ist eine volle
i18n-Bibliothek (wie im SLUI-Skill mit `t(...)`) hier **Over-Engineering**
— eine zentrale, typisierte Konstanten-Datei reicht aus, um Duplikation zu
vermeiden, ohne eine neue Abhängigkeit einzuführen. Sollte das Projekt
später mehrsprachig werden, ist genau diese Datei der richtige Ort, um durch
eine i18n-Lösung ersetzt zu werden (ein einziger Austauschpunkt).

## Wo Konstanten hingehören

| Datei                                 | Inhalt                                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `lib/queries.ts`                      | Feldlisten (`*_FIELDS`), Directus-seitige Sentinel-Filter                              |
| `lib/types.ts`                        | String-Literal-Unions (`BlockMode`, `BlockCollection`)                                 |
| `components/common/ThemeProvider.tsx` | Theme-Lookup-Tabellen (Farben, Radius, Font)                                           |
| `lib/uiMessages.ts` (neu, empfohlen)  | Wiederkehrende Lade-/Leer-/Fehlertexte                                                 |
| jeweilige `*Block.tsx`                | Block-lokale Konstanten, die _nur_ dort gebraucht werden (z. B. eine feste Icon-Größe) |

## Checkliste

- [ ] Kein String-Literal, das mehr als einmal im Projekt vorkommt, liegt
      außerhalb einer Konstante.
- [ ] Keine nackte Zahl steuert Timing, Größe oder Limit (`limit ?? -1` ist
      als Directus-Konvention "kein Limit" bereits an einer Stelle
      dokumentiert — neue Sentinel-Werte bekommen denselben Kommentar-Stil).
- [ ] Enum-artige Wertemengen (`BlockMode`, `layout`-Strings) sind einmal
      definiert und werden überall wiederverwendet, nie neu abgetippt.
