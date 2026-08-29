# Review Checklist

[← zurück zu SKILL.md](../SKILL.md)

Für Selbst-/PR-Review in ContentBlock. Ergänzt — ersetzt nicht — den
globalen `clean-code`-Skill (dessen Sonar-/Checkstyle-/Java-Abschnitte hier
nicht gelten; ESLint/Prettier sind in diesem Projekt aktuell **nicht**
konfiguriert, daher ersetzt `tsc --noEmit` + manuelles Review diese Gates).

## Struktur & Schichtung

- [ ] Datei liegt im richtigen Verantwortungs-Ordner (`components/blocks` /
      `common` / `layout`, `lib/`, `pages/`) — siehe
      [`../architecture/overview.md`](../architecture/overview.md).
- [ ] Kein Block/keine Page importiert `@directus/sdk` oder `lib/directus.ts`
      direkt.
- [ ] `BlockRenderer.tsx` enthält weiterhin nur Registry-Logik, keine
      Fetch- oder Rendering-Details eines einzelnen Blocks.

## State & Datenfluss

- [ ] Kein neuer globaler Store/Context ohne echten Remount-übergreifenden
      Bedarf (siehe [`../architecture/data-flow.md`](../architecture/data-flow.md)).
- [ ] Tri-State-Reihenfolge (Error > Loading > Empty > Content) eingehalten
      und gegenseitig ausschließend.
- [ ] Bei mehr als einem unabhängig änderbaren Fetch-Parameter: Race-Schutz
      per Sequenz-Token statt reinem `isMounted`-Flag geprüft.
- [ ] `useEffect`-Dependency-Arrays vollständig und korrekt.

## TypeScript

- [ ] Kein `any`; `unknown` + Narrowing bei extern/unsicheren Daten.
- [ ] `as never`/`as unknown` ausschließlich in `lib/directus.ts` /
      `lib/queries.ts`.
- [ ] Neue Props-Typen als `Readonly<{...}>`.
- [ ] Relationen konsequent über `DirectusRelation<T>` + vorhandene
      Guard-Funktionen behandelt, kein direkter Feldzugriff „auf gut Glück".

## Konstanten & Strings

- [ ] Kein neues, dupliziertes Leer-/Lade-Text-Literal — zentrale Textquelle
      genutzt oder erweitert.
- [ ] Keine neue, lokal duplizierte Relation-/Asset-Id-Hilfsfunktion.
- [ ] Neue Feldlisten als `as const`, `SCREAMING_SNAKE_CASE` + Suffix
      `_FIELDS`.

## Styling & Komponenten

- [ ] Nur semantische Tailwind-Tokens (`bg-primary`, `text-foreground`, ...),
      keine rohen Farben/Hex-Literale.
- [ ] `Section`/`Container` genutzt statt Wrapper-Markup dupliziert.
- [ ] Vor einem neuen handgebauten Formularelement: geprüft, ob eine
      shadcn-Komponente das abdeckt.
- [ ] Icon-only-Elemente haben `aria-label`; Status-/Ladehinweise haben
      `role="status"`/`aria-live`.

## Allgemein (aus dem globalen `clean-code`-Skill)

- [ ] Guard Clauses / Early Return statt tief verschachtelter `if`/`else`.
- [ ] Keine Kommentare, die nur wiederholen, was der Code zeigt.
- [ ] Namen sprechend, konsistent mit [`../conventions/naming.md`](../conventions/naming.md).
- [ ] `cd frontend && npm run build` erfolgreich.
