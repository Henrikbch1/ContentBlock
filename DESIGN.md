---
name: ContentBlock
description: Vereinsschaukasten. Anthrazitfarbene Rahmenleiste, graue Aushangwand und papierweiße Aushänge mit Nadel
colors:
  primary: "#004d50"
  primary-hover: "#004446"
  on-primary: "#ffffff"
  pin: "#005f62"
  rail-accent: "#217476"
  secondary: "#e0ecec"
  accent-hover: "#c2d9d9"
  highlight: "#b0cccb"
  board: "#e9e8e4"
  surface: "#dddcd7"
  paper: "#fcfbf8"
  ink: "#181a19"
  muted-ink: "#4f5452"
  hairline: "color-mix(in srgb, #181a19 18%, #fcfbf8)"
  rail: "#1c1f1e"
  on-rail: "#f4f3ef"
  rail-edge: "#b9bebc"
  primary-dark: "#90babb"
  primary-hover-dark: "#9dc2c3"
  on-primary-dark: "#000000"
  pin-dark: "#2d7c7e"
  rail-accent-dark: "#0f696b"
  highlight-dark: "#1f3d3d"
  board-dark: "#161717"
  surface-dark: "#1e2020"
  paper-dark: "#262828"
  ink-dark: "#f0efeb"
  muted-ink-dark: "#bdbfbd"
  rail-dark: "#0c0d0d"
  on-rail-dark: "#f0efeb"
  rail-edge-dark: "#4d5452"
typography:
  display:
    fontFamily: '"Archivo", "Arial Narrow", system-ui, sans-serif'
    fontSize: "5.5rem"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "0em"
    fontVariation: '"wdth" 72'
  headline:
    fontFamily: '"Archivo", "Arial Narrow", system-ui, sans-serif'
    fontSize: "2.125rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.005em"
    fontVariation: '"wdth" 78'
  title:
    fontFamily: '"Archivo", "Arial Narrow", system-ui, sans-serif'
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.005em"
    fontVariation: '"wdth" 84'
  body:
    fontFamily: '"Atkinson Hyperlegible Next", system-ui, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  nav:
    fontFamily: '"Atkinson Hyperlegible Next", system-ui, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.6
  label:
    fontFamily: '"Archivo", "Arial Narrow", system-ui, sans-serif'
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.1em"
    fontVariation: '"wdth" 90'
rounded:
  card: "0.1875rem"
  inset: "0.09375rem"
  pin: "9999px"
spacing:
  section: "clamp(2rem, 4vw, 3.25rem)"
  container: "72rem"
  gutter-sm: "1rem"
  gutter-md: "1.5rem"
  gutter-lg: "2rem"
  grid-gap: "1.5rem"
  grid-gap-lg: "2rem"
  notice-top: "2.25rem"
  notice-side: "1.5rem"
  touch-min: "2.75rem"
  touch-comfort: "3rem"
components:
  rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.on-rail}"
  rail-nav-item:
    textColor: "{colors.on-rail}"
    typography: "{typography.nav}"
    height: "3rem"
    padding: "0 0.75rem"
  rail-search:
    textColor: "{colors.on-rail}"
    rounded: "{rounded.card}"
    height: "2.75rem"
    padding: "0 0.75rem"
  notice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "2.25rem 1.5rem 1.5rem"
  notice-pin:
    backgroundColor: "{colors.pin}"
    rounded: "{rounded.pin}"
    size: "0.875rem"
  notice-meta:
    textColor: "{colors.muted-ink}"
    typography: "{typography.label}"
  notice-strip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "1rem 0"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.card}"
    height: "3rem"
    padding: "0 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  hero-action-on-image:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    height: "3rem"
    padding: "0 1.25rem"
  hero-action-on-image-hover:
    backgroundColor: "{colors.surface}"
  input:
    backgroundColor: "{colors.board}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    height: "3rem"
    padding: "0 0.75rem"
---

# Design System: ContentBlock

## Overview

**Creative North Star: "Der Vereinsschaukasten"**

Die Website ist der Schaukasten am Vereinsheim. Ein ruhiger, präziser Rahmen aus Anthrazit hält sauber gehängte Aushänge auf einer hellgrauen Wand. Jeder Inhalt, der etwas mitteilt, hängt als papierweißes Blatt mit einer Nadel in Akzentfarbe. Kopf und Fuß der Seite sind dieselbe dunkle Rahmenleiste mit heller Aluminiumkante, dazwischen liegt die Aushangwand. Das Ergebnis liest sich wie ein gepflegtes Brett, nicht wie ein austauschbares Kachelraster.

Die Schildschrift ist Archivo in schmaler, kräftiger Breite. Großformatige Titel stehen in Versalien wie auf einem Vereinsschild, Abschnittstitel bleiben in gemischter Schreibung. Allen Lesetext trägt Atkinson Hyperlegible Next in 17px, weil die Zielgruppe von 14 bis 80 Jahren reicht. Die Dichte ist mittel. Ein Aushang trägt eine Kopfzeile mit Kategorie links und Datum oder Dateityp rechts, darunter eine Haarlinie, dann Titel, Text und eine einzige Aktion.

Die Farbwelt ist neutral und fest. Directus liefert höchstens zwei Akzente (`primary_color` für Links, Buttons und die Leistenmarkierung, optional `accent_color` für die Nadeln), die automatisch auf ausreichenden Kontrast korrigiert werden. Hell und dunkel folgen der Systemeinstellung. Die Frontmatter-Werte zeigen die Ausgabe für den eingebauten Standardakzent `#005f62`, also den Zustand ohne CMS-Akzent. Mit gepflegten CMS-Akzenten ergeben sich andere Akzentwerte bei gleicher Neutralpalette.

**Key Characteristics:**
- Zweizeilige anthrazitfarbene Rahmenleiste als Kopf und gleichartige Leiste als Fuß, jeweils mit 4px heller Kante zur Wand hin
- Material aus Wand (`board`), Papier (`paper`) und Nadel (`pin`) statt Kacheln auf Weiß
- Aushang-Kopfzeile mit Kategorie, Datum oder Dateityp und Haarlinie
- Aktiv heißt Nadel oder Akzentkante plus Fettdruck, nie Farbe allein
- Statische Hinweisleiste statt Laufschrift
- Versalientitel in Archivo schmal, außer wenn der Text ein „ß“ enthält
- Berührungsziele mindestens 44px, Aktionen meist 48px hoch

## Colors

Eine warmgraue, fast farblose Neutralpalette trägt das System, Farbe kommt nur über ein bis zwei Vereinsakzente und sitzt dort, wo gehandelt oder markiert wird.

### Primary
- **Vereinspetrol** (`primary`, dunkel `primary-dark`): Textlinks, primäre Buttons, Fokusring und das Häkchen von Checkboxen. Der CMS-Wert `primary_color` wird gegen `surface` und `paper` auf mindestens 7:1 angehoben und gegen `surface` auf höchstens 10:1 begrenzt, damit er als Farbe erkennbar bleibt. Hover dunkelt um 12 Prozent nach Schwarz ab (im Dunkelmodus nach Weiß).
- **Leistenmarke** (`rail-accent`, dunkel `rail-accent-dark`): Unterkante des aktiven Hauptmenüpunkts und Nadel im mobilen Menü auf der Rahmenleiste. Aus `primary_color` gegen `rail` auf mindestens 3:1 gebracht.

### Secondary
- **Nadelfarbe** (`pin`, dunkel `pin-dark`): Nadeln auf Aushängen und im Menü, Punkt der Hinweisleiste, Unterstreichung der Hinweise, Ziffernlinie der Schrittspalte und Textmarkierung. Stammt aus `accent_color`, ersatzweise aus `primary_color`, und hat gegen `paper` mindestens 3:1.
- **Akzenttönung** (`secondary`, `accent-hover`): 12 beziehungsweise 24 Prozent des Akzents auf Weiß (im Dunkelmodus auf Schwarz). Fläche des primären Hero-Buttons ohne Bild und dessen Hover. Text darauf erreicht mindestens 7:1.
- **Heute-Markierung** (`highlight`, dunkel `highlight-dark`, Schrift `on-highlight` = Druckschwarz): 30 Prozent der Nadelfarbe auf Papier, mindestens 1,25:1 Abstand zum Papier, Text darauf mindestens 7:1. Fläche für Tabellenzellen, deren Zeitraum heute gilt, und für die Übersicht „Gilt heute“. Sie markiert immer zusammen mit dem Text „gilt heute“.

### Neutral
- **Aushangwand** (`board`, dunkel `board-dark`): Seitenhintergrund und Grundfläche der Abschnitte.
- **Wandfeld** (`surface`, dunkel `surface-dark`): Abschnitte mit Hintergrund `surface`, Hover von Buttons auf Bildern.
- **Aushangpapier** (`paper`, dunkel `paper-dark`): Aushänge, Hinweisleiste, Dropdowns und Suchergebnisse.
- **Druckschwarz** (`ink`, dunkel `ink-dark`): Fließtext und Titel.
- **Bleistiftgrau** (`muted-ink`, dunkel `muted-ink-dark`): Kopfzeilen der Aushänge, Teaser, Hilfetexte. Erreicht auf Papier rund 7,4:1.
- **Haarlinie** (`hairline`): Rahmen der Aushänge und Linie unter der Kopfzeile, gemischt aus 18 Prozent Text in Papier.
- **Rahmenanthrazit** (`rail`, dunkel `rail-dark`) mit **Leistenschrift** (`on-rail`): Kopf- und Fußleiste.
- **Aluminiumkante** (`rail-edge`, dunkel `rail-edge-dark`): 4px Kante unter dem Kopf und über dem Fuß, Rahmen von Suchfeld und Menübutton, mit 40 Prozent Deckkraft als Trennlinie zwischen den Leistenzeilen.
- **Bildschleier**: Auf Bild-Heroes liegt ein Verlauf von unten `rgb(0 0 0 / 82%)` über `62%` nach oben `45%`, ab 1024px Breite oben nur noch `20%`. Schrift darauf ist Weiß.

### Named Rules
**The Two Accents Rule.** Es gibt genau zwei redaktionelle Farbquellen, `primary_color` und `accent_color`. Jede weitere Farbe ist neutral oder aus diesen beiden abgeleitet.

**The Corrected Accent Rule.** Ein CMS-Akzent wird nie roh verwendet. Er läuft immer durch die Kontrastkorrektur von `neutralTheme.ts`, und ungültige Werte fallen mit Warnung auf den Standardakzent zurück.

**The Pin Is The Marker Rule.** Die Nadelfarbe markiert, sie füllt keine Flächen. Nadeln, Punkte, Linien und Unterstreichungen ja, Abschnittshintergründe nein.

## Typography

**Display Font:** Archivo, variable Breite 62 bis 125 Prozent und Stärke 100 bis 900 (mit "Arial Narrow", system-ui)
**Body Font:** Atkinson Hyperlegible Next, variabel 200 bis 800, normal und kursiv (mit system-ui)

**Character:** Ein schmales, kräftiges Schild über einer betont lesbaren Werkschrift. Die Schildschrift ruft, die Leseschrift erklärt ruhig.

Alle Schriften liegen selbst gehostet unter `frontend/public/fonts/` mit ihren OFL-Lizenzen. DM Sans und Fraunces existieren nur noch für den Legacy-Modus.

### Hierarchy
- **Display** (800, Breite 72 Prozent, Zeilenhöhe 0.92, Versalien): Hero-Titel mit 2.75rem, 4.25rem ab 640px und 5.5rem ab 1024px. Seitentitel mit 2.75rem und 4rem ab 640px. Markenname in der Leiste mit 1.375rem und 1.625rem ab 640px. Enthält der Text ein „ß“, entfallen die Versalien.
- **Headline** (800, Breite 78 Prozent, 1.75rem und 2.125rem ab 640px, Zeilenhöhe 1.25): Abschnittstitel in gemischter Schreibung, 2rem Abstand nach unten.
- **Title** (700, Breite 84 Prozent, 1.375rem, Zeilenhöhe 1.25): Titel auf Aushängen. Das Kontaktformular nutzt 1.75rem. Alle Überschriften balancieren ihre Zeilen.
- **Body** (400, 17px, Zeilenhöhe 1.6): Fließtext, Teaser, Formulare. Einleitungen und Hero-Untertitel stehen in 1.125rem bis 1.25rem. Lesetext bleibt auf etwa 48rem (Tailwind `max-w-3xl`) begrenzt.
- **Nav** (600, 17px): Hauptmenü auf der Leiste. Aktiv 800.
- **Label** (700, Breite 90 Prozent, 0.8125rem, Laufweite 0.1em, Versalien): Kopfzeile der Aushänge, Kennung der Hinweisleiste, Spaltenköpfe im Fuß, Gruppenbezeichnungen im mobilen Menü.

### Named Rules
**The Sharp S Rule.** Versalien nur ohne „ß“. Ein Text mit „ß“ bekommt `data-sharp-s` und bleibt in gemischter Schreibung, weil „SS“ die Bedeutung ändern kann (Maße und Masse).

**The One Shout Rule.** Versalien in Archivo schmal sind dem Display und den Labels vorbehalten. Abschnitts- und Aushangtitel schreien nicht.

**The Step Column Rule.** Nummerierte Listen im Fließtext werden zur Schrittspalte: große Ziffern in Archivo schmal 800, rechtsbündig in einer 2.5rem breiten Spalte mit 2px Linie in Nadelfarbe rechts daneben.

## Layout

Ein zentrierter Container von maximal 72rem mit 16px, ab 640px 24px und ab 1024px 32px Seitenrand trägt alle Inhalte. Die Breakpoints sind die Tailwind-Standards (640px, 768px, 1024px). Abschnitte haben einen vertikalen Abstand von `clamp(2rem, 4vw, 3.25rem)`. Das CMS kann Radius, Abschnittsabstand, Containerbreite und Schatten über Vorgaben ändern. Farben und Schriften setzt es im neutralen Modus nicht.

Die Rahmenleiste hat zwei Zeilen. Oben Logo und Markenname links, rechts ein 20rem breites Suchfeld. Darunter, durch eine Linie getrennt, die Navigation in einer Zeile. Unter 1024px wandert das Suchfeld in eine eigene volle Zeile, der Menübutton ersetzt die zweite Zeile und öffnet die Navigation in der Leiste. Angeheftet ist die Leiste erst ab 1024px.

Der Bild-Hero ist ein randloses Band von mindestens 22rem, 26rem ab 640px und 28rem ab 1024px Höhe. Der Titel steht unten links, ab 1024px rechts daneben Untertitel und Aktionen im Verhältnis 1.4 zu 1. Direkt darunter folgt die Hinweisleiste über die volle Breite.

Aushangraster passen sich der Anzahl an. Ein Aushang steht allein mit höchstens 42rem Breite. Zwei oder vier stehen ab 768px zweispaltig. Alle anderen Anzahlen laufen ab 768px zweispaltig und ab 1024px dreispaltig. Der Abstand beträgt 1.5rem, ab 1024px 2rem. Der Fuß ordnet seine Spalten ab 640px zweispaltig und ab 1024px dreispaltig.

## Elevation & Depth

Tiefe entsteht aus Material, nicht aus schwebenden Ebenen. Die Wand ist flach, die Aushänge liegen mit einer Haarlinie und einem kurzen, nach unten gezogenen Schatten knapp davor, als hingen sie auf Kork. Die Nadel ist das einzige Element mit plastischer Wölbung. Die Rahmenleiste bleibt flach und grenzt sich über Farbe und Aluminiumkante ab. Dropdowns und Suchergebnisse sind ebenfalls Aushänge und nutzen denselben Schatten.

### Shadow Vocabulary
- **Aushang hell** (`box-shadow: 0 1px 0 rgb(0 0 0 / 0.08), 0 14px 22px -18px rgb(0 0 0 / 0.45)`): Aushänge, Dropdown-Blätter, Suchergebnisse.
- **Aushang dunkel** (`box-shadow: 0 1px 0 rgb(255 255 255 / 0.04), 0 14px 22px -16px rgb(0 0 0 / 0.8)`): dieselben Elemente im Dunkelmodus.
- **Nadelkopf** (`box-shadow: inset 0 -2px 0 rgb(0 0 0 / 0.25), 0 2px 3px rgb(0 0 0 / 0.35)`): der 14px Punkt oben mittig auf jedem Aushang.

### Named Rules
**The Pinned Not Floating Rule.** Kein Element schwebt. Ein Schatten zeigt nur, dass Papier auf der Wand hängt, und bleibt kurz und unten konzentriert.

## Shapes

Die Formensprache ist kantig und knapp. Aushänge, Buttons, Felder und Menüflächen haben fast rechte Ecken (3px), Bilder in Aushängen die Hälfte davon. Rund ist ausschließlich die Nadel (14px Kreis auf Aushängen, 10px vor dem aktiven Menüpunkt, 12px in der Hinweisleiste). Linien tragen viel Struktur: 4px Aluminiumkante an der Leiste, 1px Haarlinie um Aushänge und unter Kopfzeilen, 2px Rahmen bei sekundären Aktionen und bei Buttons auf Bildern, 2px Unterstreichung bei Links mit 0.22em Abstand. Leerzustände zeigen einen gestrichelten Rahmen.

## Components

### Buttons
Klar, flächig, groß genug für jede Hand.
- **Shape:** fast rechte Ecken (3px), Höhe 48px.
- **Primary:** Vereinspetrol mit weißer Schrift (im Dunkelmodus Schwarz auf hellem Petrol), 700, 1.5rem Innenabstand seitlich, optionales Lucide-Icon 18px rechts.
- **Hover / Focus:** Hover dunkelt ab, Übergang nur über Farbe. Fokus ist ein 3px Umriss in Kontextfarbe mit 3px Abstand.
- **Hero auf Bild:** Primär als papierweiße Fläche mit Druckschwarz und 2px Rahmen, Hover wird zu Wandfeld. Sekundär als 2px weißer Rahmen ohne Fläche, Hover mit 15 Prozent Tönung.
- **Hero ohne Bild:** Primär in Akzenttönung mit 2px Rahmen in Textfarbe, Hover in kräftigerer Tönung.

### Notice (Aushang) / Cards
Die Signatur des Systems. Jedes Blatt, das informiert, ist ein Aushang.
- **Corner Style:** 3px.
- **Background:** Aushangpapier mit Druckschwarz, setzt den Farbkontext auf Standard zurück.
- **Shadow Strategy:** Aushangschatten (siehe Elevation & Depth).
- **Border:** 1px Haarlinie.
- **Internal Padding:** 2.25rem oben für die Nadel, 1.5rem seitlich und unten. Bildkarten setzen das Bild mit 12px Rand in das Blatt.
- **Kopfzeile:** Label links (Kategorie oder Typ wie „Nachricht“, „Dokument“), rechts Datum, Datumsbereich oder Dateityp wie „PDF“, darunter Haarlinie mit 10px Abstand.
- **Aktion:** eine fett unterstrichene Textaktion am Fuß („Beitrag lesen“, „Dokument öffnen“), Hover verdickt die Unterstreichung von 2px auf 4px. Ganze Aushänge für Nachrichten und Termine sind ein einziger Link.

### Inputs / Fields
- **Style:** 48px hoch, 1px Rahmen aus 60 Prozent Text, Grund in Wandfarbe, 3px Ecken, Beschriftung fett darüber. Checkboxen 24px mit Akzentfarbe.
- **Focus:** Rahmen wechselt zu Vereinspetrol, dazu der globale 3px Fokusumriss.
- **Suche in der Leiste:** 44px hoch, Aluminiumrahmen, zehnprozentige Aufhellung der Leiste, Lupe und sichtbare Beschriftung „Suche“ vor dem Feld. Ergebnisse erscheinen als Aushangblatt darunter.

### Navigation
- **Hauptmenü (ab 1024px):** einzeilig in der zweiten Leistenzeile, 48px hohe Einträge in 17px 600. Hover hellt mit 10 Prozent auf. Der aktive Zweig wird 800 und bekommt eine 4px Unterkante in Leistenmarke.
- **Untermenüs:** öffnen per Klick als Aushangblatt mit Nadel, 18rem breit. Der aktive Eintrag zeigt die 10px Nadel davor und wird fett. Escape schließt und gibt den Fokus zurück.
- **Mobil:** Der Button „Menü“ öffnet eine scrollbare Liste in der Leiste, Einträge 48px hoch mit feinen Trennlinien, Gruppen als Label, aktiv mit Nadel in Leistenmarke plus 800.
- **Fuß:** dieselbe Leiste, Spalten mit Label-Überschrift und Haarlinie, Links 44px hoch mit Unterstreichung in Kantenfarbe.

### Hinweisleiste (Notice Strip)
Eine statische Papierleiste direkt unter dem Hero. Links ein 12px Nadelpunkt mit dem Label „Hinweis“, rechts die Meldungen in 17px fett, verlinkte Meldungen mit 2px Unterstreichung in Nadelfarbe. Nichts läuft, nichts blinkt. Die CMS-Farben des Tickers werden im neutralen Modus ignoriert.

### Schrittspalte
Nummerierte Listen in Fließtexten werden zu Schritten mit großen Ziffern und einer Nadelfarblinie (siehe Typography). Gedacht für Abläufe wie Aufnahme oder Gastkarte.

### Schnellzugriff
Große Aushang-Kacheln mit Nadel, jede Kachel ist ein einziger Link. Oben ein 28px Symbol in Linkfarbe, darunter die Beschriftung in 1.25rem 700 und ein optionaler Kurztext in 1rem Bleistiftgrau. Mindesthöhe 7rem, Hover mit Wandfeld-Tönung und Unterstreichung der Beschriftung. Raster: unter 384px einspaltig, darauf zweispaltig, ab 640px dreispaltig, ab 1024px je nach Anzahl bis fünf Spalten. Externe Ziele bekommen ein kleines Symbol für „neuer Tab“.

### Symbole
Lucide-Linien-Symbole aus einer festen, im CMS wählbaren Liste (`components/common/iconRegistry.ts`). Sie stehen immer neben einer sichtbaren Beschriftung, sind `aria-hidden`, haben die Größe 1em und erben die Textfarbe. In der obersten Desktop-Menüleiste erscheinen sie erst ab 1280px, damit die Leiste einzeilig bleibt. Unbekannte Schlüssel zeigen kein Symbol.

### Heute gültige Zeiträume
Tabellenzellen mit Datumsbereichen („01.02. – 15.05.“, auch über den Jahreswechsel) erhalten die Heute-Markierung als Fläche und darunter ein Badge „gilt heute“ in Vereinspetrol (text-sm, fett), in der Tabelle wie in den mobilen Karten. Keine Seitenkante (siehe Detektor-Regel `side-tab`). Über der Tabelle fasst ein statischer Kasten „Gilt heute“ alle aktiven Einträge zusammen, damit sie auch bei Seitenumbruch und Filter sichtbar bleiben.

### Dokumentvarianten
Hat ein Dokument eine Schwarz-Weiß-Datei, zeigt der Aushang statt „Dokument öffnen“ die Zeile „Version wählen“ mit den Textaktionen „Farbe öffnen“ und „Schwarz-Weiß öffnen“, beide 44px hoch.

### Bewegung
Es gibt keine gestaltete Bewegung. Übergänge betreffen nur Farbe und die Drehung des Menüpfeils, mit Tailwind-Standarddauer. Bei reduzierter Bewegung fallen Übergänge und weiches Scrollen weg.

## Do's and Don'ts

### Do:
- **Do** jeden informierenden Inhalt als Aushang setzen: Papier, Haarlinie, Aushangschatten, Nadel oben mittig, 2.25rem Innenabstand oben.
- **Do** Kopfzeilen mit echten Daten füllen (Kategorie links, Datum oder Dateityp rechts) und sie weglassen, wenn das CMS keine liefert.
- **Do** aktive Zustände immer doppelt kodieren: Nadel oder Akzentkante plus höhere Schriftstärke.
- **Do** Akzente nur über `primary_color` und `accent_color` beziehen und durch `neutralTheme.ts` korrigieren lassen.
- **Do** Display-Titel mit `sharpSAttribute` auszeichnen, damit Texte mit „ß“ nicht in Versalien gesetzt werden.
- **Do** Berührungsziele mindestens 44px hoch halten, Aktionen und Menüeinträge 48px.
- **Do** semantische Tokens verwenden (`bg-paper`, `bg-rail`, `bg-pin`, `text-link`, `border-border`), damit Hell, Dunkel und CMS-Akzente wirken.
- **Do** Aushangraster mit `noticeGridClassName(count)` bauen, damit kurze Reihen die Wand füllen.

### Don't:
- **Don't** eine Laufschrift oder animierte Hinweise einsetzen. Die Hinweisleiste steht still.
- **Don't** einen Zustand nur über Farbe zeigen.
- **Don't** die Nadelfarbe als Flächenfarbe für Abschnitte oder Buttons verwenden.
- **Don't** große Radien oder runde Kacheln einführen. Rund ist nur die Nadel.
- **Don't** CMS-Farbwerte roh als CSS-Variable setzen, im neutralen Modus gilt nur die korrigierte Palette.
- **Don't** Fraunces oder DM Sans im neutralen Modus verwenden, sie gehören allein zum Legacy-Modus (`VITE_THEME_MODE=legacy`).
- **Don't** weiche, schwebende Schatten oder Glaseffekte einsetzen.

## Bekannte Grenzen

Diese Punkte beschreiben den gebauten Stand und sind keine Gestaltungsregeln.

- Bildkarten aus `block_cards` haben keine Kopfzeile, weil der CMS-Eintrag kein Kategorie- oder Wertfeld besitzt. Eine CMS-Erweiterung ist vorgeschlagen und wartet auf Freigabe.
- Ob im ersten Viewport eine Reihe Aushänge erscheint, hängt von der Blockreihenfolge im CMS ab. Auf der Startseite sorgt der Schnellzugriff direkt unter der Hinweisleiste dafür.
- Es gibt keinen manuellen Umschalter zwischen Hell und Dunkel. Das Schema folgt der Systemeinstellung.
- Die druckfreundliche Schwarz-Weiß-Datei eines Dokuments wird nicht automatisch erzeugt, sondern von der Redaktion hochgeladen.
- Bilder werden in Originalgröße geladen (keine responsiven Varianten über Directus-Transformationen).
- Der Legacy-Modus nutzt weiterhin Fraunces und DM Sans mit der alten Petrol-Gold-Palette.