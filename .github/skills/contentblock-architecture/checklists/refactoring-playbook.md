# Refactoring-Playbook (deterministisch, für Agenten und Menschen)

[← zurück zu SKILL.md](../SKILL.md)

Dieses Playbook macht Refactorings in ContentBlock zu einem mechanischen
Ablauf. Es ist bewusst so geschrieben, dass auch ein Agent ohne tiefes
Architekturverständnis sicher damit arbeiten kann: kleine Schritte, nach
jedem Schritt ein Build, klare Abbruchkriterien.

## Eiserne Regeln (gelten für jedes Rezept)

1. **Ein Rezept pro Commit-Einheit.** Nie zwei Rezepte mischen, nie ein
   Refactoring mit einer Feature-/Verhaltensänderung kombinieren.
2. **Nach jedem Rezept:** `cd frontend && npm run build` muss grün sein,
   bevor das nächste Rezept beginnt. Rot → letzten Schritt zurücknehmen,
   nicht "weiterfixen".
3. **Verhalten bleibt identisch.** Ein Refactoring ändert kein Markup, keine
   Texte, keine Reihenfolge, keine Netzwerkaufrufe. Wenn dafür eine
   Entscheidung nötig wäre → stoppen und nachfragen.
4. **Reihenfolge bei mehreren Funden:** erst Invarianten-Verstöße
   ([`../invariants.md`](../invariants.md)), dann Budget-Verstöße
   ([`../conventions/file-size-and-splitting.md`](../conventions/file-size-and-splitting.md)),
   dann Kür (Naming, Lesbarkeit).
5. **Nichts löschen, das nicht ersetzt wurde.** Erst neue zentrale Stelle
   anlegen und alle Call-Sites umstellen, dann die Duplikate entfernen.

## Rezept 1: Dupliziertes Snippet zentralisieren

Anlass: derselbe Helfer/String/Klassencluster in 2+ Dateien
(Invarianten I-6/I-7/I-8).

1. Alle Fundstellen auflisten (Suche über `frontend/src`, exakter Text).
2. Zentrale Zielstelle nach dieser Tabelle wählen:

   | Was                               | Wohin                            |
   | --------------------------------- | -------------------------------- |
   | Relation-/Asset-Id-Zugriff        | `lib/directusRelations.ts`       |
   | Datums-/Zahlformatierung          | `lib/format.ts`                  |
   | Lade-/Leer-/Fehlertext            | `lib/uiMessages.ts`              |
   | generischer, domänenfreier Helfer | `lib/utils.ts`                   |
   | React-Fetch-/Effekt-Muster        | `lib/hooks/use<Zweck>.ts`        |
   | wiederholtes Wrapper-Markup       | `components/layout/` oder shadcn |
   | wiederholter UI-Baustein          | `components/common/`             |

3. Existiert dort schon ein passender Export? → verwenden, nichts Neues
   anlegen. Sonst: den **besten** vorhandenen Duplikat-Code dorthin
   verschieben (nicht neu erfinden), benennen nach
   [`../conventions/naming.md`](../conventions/naming.md).
4. Call-Sites einzeln umstellen; nach jeder Datei kompiliert der Editor —
   am Ende Build.
5. Lokale Duplikate löschen. Invariante erneut prüfen: null Treffer.

## Rezept 2: Datei über Budget splitten

Anlass: Datei über hartem Limit. **Exakt** das passende Rezept R-A bis R-E aus
[`../conventions/file-size-and-splitting.md`](../conventions/file-size-and-splitting.md)
ausführen. Zusätzlich:

1. Vor dem Split: Build grün? Sonst erst reparieren.
2. Beim Split ausschließlich `export`s verschieben und Re-Export-Index
   anlegen — keine Umbenennung, keine Signaturänderung im selben Schritt.
3. Nach dem Split: Suche nach dem alten Dateinamen — kein Import darf auf
   eine nicht mehr existierende Datei zeigen.

## Rezept 3: Code in die richtige Schicht verschieben

Anlass: Verstoß gegen die Verantwortungstabelle in
[`../architecture/overview.md`](../architecture/overview.md)
(z. B. Feldliste in einer Page, Fetch in einem statischen Block, Markup im
`BlockRenderer`).

1. Zielschicht aus der Tabelle bestimmen.
2. Code an der Zielstelle einfügen (Export), an der Quellstelle importieren.
3. Build. Erst dann den Code an der Quellstelle entfernen.
4. Prüfen, ob durch den Umzug ein Duplikat entstanden ist → Rezept 1.

## Rezept 4: Handgebautes UI-Element durch shadcn ersetzen

Anlass: handgebauter Button/Input/Dialog o. Ä., wo eine shadcn-Komponente
existiert (siehe `../shadcn/SKILL.md`; es gibt noch **kein**
`components/ui/` — die erste Installation legt ihn an).

1. Komponente per shadcn-CLI hinzufügen (nie Registry-Code raten).
2. **Eine** Verwendungsstelle umstellen, visuell prüfen (Theme-Tokens aus
   `index.css` greifen?), Build.
3. Restliche Stellen umstellen, alte Klassencluster löschen.

## Rezept 5: Neuen wiederverwendbaren Hook extrahieren

Anlass: dasselbe `useState`/`useEffect`-Muster in 3+ Komponenten
(Rule of three — bei 2 Vorkommen noch warten).

1. Muster in `lib/hooks/use<Zweck>.ts` extrahieren; Abhängigkeiten
   (Query-Funktion etc.) als Parameter, nie fest verdrahtet
   (Vorbild: `useAsyncResource`).
2. Call-Sites nacheinander umstellen (Build zwischen den Dateien).
3. Kein Store, kein Context — siehe
   [`../architecture/data-flow.md`](../architecture/data-flow.md).

## Abschluss jeder Refactoring-Session

- [ ] Alle Invarianten aus [`../invariants.md`](../invariants.md) geprüft.
- [ ] Budget-Check ohne Treffer über dem harten Limit.
- [ ] `cd frontend && npm run build` grün.
- [ ] [`review-checklist.md`](review-checklist.md) durchgegangen.
- [ ] Bei UI-Berührung: responsive Darstellung + Tastaturfokus manuell geprüft.
