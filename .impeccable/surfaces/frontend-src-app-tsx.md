---
version: 1
slug: "frontend-src-app-tsx"
primary_target: "frontend/src/App.tsx"
related_targets: ["frontend/src/index.css","frontend/src/components"]
---

# Surface: gesamte öffentliche Website (App-Rahmen und alle Blocks)

Modus: Read. Besucherinnen und Besucher von 14 bis 80 Jahren suchen schnell
eine konkrete Information (Gewässer, Gastkarte, Termine, Mitgliedschaft,
Kontakt, Downloads). Inhalte kommen vollständig aus Directus; nichts
Vereinsspezifisches im Code. Neutrale Basis hell/dunkel, ein bis zwei
CMS-Akzentfarben mit automatischer Kontrastkorrektur.

## Direction contract

THESIS: Die Website ist der Schaukasten am Vereinsheim. Ein ruhiger, präziser
Rahmen hält sauber gehängte Aushänge. Verweigert wird das austauschbare
Standardraster aus weißer Seite, runden Kacheln und Fotobanner.

OWN-WORLD: Anthrazitfarbene Rahmenleiste mit Aluminiumkante oben und unten,
hellgraue Aushangwand, papierweiße Aushänge mit einer Nadel in Akzentfarbe,
Kopfzeile je Aushang (Kategorie links, Datum oder Kennzahl rechts, Haarlinie
darunter). Archivo schmal und kräftig als Schildschrift in Großbuchstaben,
Atkinson Hyperlegible Next für allen Lesetext. Aktiv heißt Akzentkante plus
fett, nie nur Farbe.

STORY: Wer ankommt, erkennt sofort Verein, Wasser und die wichtigsten
Aushänge, liest die aktuelle Meldung ohne Laufschrift und erreicht jedes
Kernziel mit einem Klick aus der Rahmenleiste oder einem Aushang.

FIRST VIEWPORT: Oben die zweizeilige Rahmenleiste: Logo und Name links,
Suchfeld rechts, darunter die Navigation in einer Zeile. Darunter ein
randloses Bildband mit großem Titel unten links und Untertitel rechts. Direkt
anschließend die Hinweisleiste und die erste Reihe Aushänge.

FORM: Vereinsschaukasten, Kandidat 5 der eigenen Liste, seed:8f545f1557b3b365

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Offene Entscheidungen

- Icons je Navigationspunkt oder Aushang benötigen ein freigegebenes CMS-Feld.
- Verlinkte Karten (Aushang führt zu einer Seite) benötigen ein freigegebenes CMS-Feld.
