---
name: ContentBlock
description: Dokumentierter visueller Istzustand des generischen Frontends
colors:
  primary: "#005f62"
  on-primary: "#ffffff"
  secondary: "#d7e9e6"
  accent: "#e7b552"
  background: "#fcfcfa"
  surface: "#f0f4f1"
  text: "#17312e"
  muted: "#4f625d"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontWeight: 600
    lineHeight: "1"
  body:
    fontFamily: '"DM Sans", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5"
rounded:
  card: "0.5rem"
spacing:
  section: "clamp(3rem, 6vw, 5rem)"
components:
  hero-action:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "0.75rem 1.25rem"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
---

# Design System: ContentBlock

## Overview

Dies ist eine manuelle Bestandsaufnahme des vorhandenen Frontends, keine
Freigabe für dessen geplante Neugestaltung. Die Werte im Frontmatter sind
Defaults aus [index.css](frontend/src/index.css); Directus kann mehrere davon
zur Laufzeit überschreiben. Die lokale Impeccable-Engine war nicht verfügbar,
daher wurden weder `/impeccable document` noch dessen Sidecar-Erzeugung
ausgeführt.

Der aktuelle Auftritt kombiniert eine serifenbetonte Überschriftenhierarchie
mit einer serifenlosen Leseschrift, farbigen Abschnittsflächen und
zurückhaltend umrandeten Karten. Die Inhalte kommen aus Directus-Blöcken.

## Colors

Die Ausgangspalette verwendet Petrol als Primärfarbe, eine helle sekundäre
Fläche, einen goldenen Akzent sowie helle Hintergründe und dunkle Texte.
Kontextvariablen passen Text, Links, Linien und Fokusfarben für primäre und
inverse Abschnitte an.

Der [ThemeProvider](frontend/src/components/common/ThemeProvider.tsx) übernimmt
gültige CMS-Farbwerte über
[themeVariables.ts](frontend/src/lib/themeVariables.ts). Er prüft deren
CSS-Syntax, aber nicht die resultierenden Kontrastverhältnisse. Ein
automatisches Akzentskalen- oder Kontrastsystem und ein vollständiger
Dark-Mode sind aktuell nicht implementiert.

## Typography

DM Sans ist die Grundschrift, Fraunces wird für Überschriften verwendet. Beide
variablen Fonts werden lokal bereitgestellt. Der Grundtext beträgt im
Standard `1rem` bei `1.5` Zeilenhöhe. Der Hero verwendet `3rem` und ab dem
`sm`-Breakpoint `4.5rem`; seine Überschrift hat Schriftgewicht 600 und
Zeilenhöhe 1.

## Layout

Der zentrale Container ist standardmäßig maximal `72rem` breit und erhält
responsiven horizontalen Innenabstand. Abschnitte verwenden standardmäßig
`clamp(3rem, 6vw, 5rem)` vertikalen Abstand. Karten wechseln von einer auf
zwei Spalten ab `md` und drei Spalten ab `lg`. Die Hauptnavigation wechselt
bei `lg` zwischen mobiler und Desktopdarstellung.

## Elevation & Depth

Karten erhalten standardmäßig eine feine Kontur und den Schatten
`0 1px 2px rgb(0 0 0 / 0.06)`. Abstände, Radius, Containerbreite und Schatten
können über vordefinierte Theme-Einstellungen abweichen.

## Shapes

Der Standardradius für Karten und entsprechende Aktionen beträgt `0.5rem`.
Der Theme-Radius ist über vordefinierte Größen konfigurierbar.

## Components

- **Hero:** großer Titel, optionale Beschreibung, optionales Bild und
  beschriftete Aktionen. Ohne Bild wird ein primärer Abschnitt als
  Standard verwendet.
- **Karten:** umrandete, leicht erhöhte Inhaltsflächen. Die vorhandenen
  `block_cards`-Einträge besitzen derzeit kein eigenes Linkfeld.
- **Navigation:** angehefteter Header mit Desktopmenü beziehungsweise
  aufklappbarer mobiler Navigation. Die Einträge stammen aus Directus.
- **Tabellen:** semantische Tabelle mit erster Datenzeile als Spaltenkopf;
  auf schmalen Bildschirmen derzeit horizontal scrollbar.
- **Dokumente:** Karten mit einem Link zur vorhandenen Datei. Eine Auswahl
  zwischen Farb- und Schwarz-Weiß-Dateien existiert noch nicht.
- **Fokus und Bewegung:** interaktive Elemente erhalten einen sichtbaren
  Fokusrahmen; reduzierte Bewegung wird im globalen Stylesheet berücksichtigt.

## Do's and Don'ts

- **Do:** semantische Tailwind-Tokens und die bestehenden CSS-Variablen
  verwenden, damit Directus-Themes wirksam bleiben.
- **Do:** Bilder, Inhalte und Navigationsziele aus Directus beziehen und
  Relationen null-sicher behandeln.
- **Do:** responsive Darstellung, Tastaturbedienung und reduzierte Bewegung
  bei UI-Änderungen prüfen.
- **Don't:** aus der syntaktischen Prüfung einer CMS-Farbe auf ausreichenden
  Kontrast schließen.
- **Don't:** das geplante neutrale Light-/Dark-System oder automatische
  PDF-Varianten als bereits vorhanden darstellen.
