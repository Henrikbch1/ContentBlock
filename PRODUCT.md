# Product

<!-- impeccable:product-schema 1 -->

Dieses Produktprofil wurde anhand des Nutzerauftrags und des bestehenden
Projekts manuell erstellt. Der lokale Impeccable-Initialisierungsbefehl konnte
ohne die zugehörige Engine nicht ausgeführt werden.

## Platform

web

## Users

- Besucherinnen und Besucher sollen auf Informationsseiten schnell finden,
  was sie benötigen. Das erste Zielprojekt ist die Website eines Angelvereins;
  die angesprochene Altersgruppe reicht von 14 bis 80 Jahren.
- Redakteurinnen und Redakteure pflegen Inhalte, Navigation und Einstellungen
  im Directus-CMS. Die Pflege soll ohne technische Spezialkenntnisse einfach
  und nachvollziehbar sein.
- Das Frontend soll auch für andere Projekte und Benutzergruppen nutzbar
  bleiben; deren Inhalte und Struktur kommen aus Directus.

## Product Purpose

ContentBlock stellt ein generisches, inhaltsgetriebenes Web-Frontend bereit.
Es erweitert den bestehenden Kern, statt ihn durch ein projektspezifisches
Frontend zu ersetzen. Für das erste Zielprojekt stehen Informationen zu Verein,
Angeln und Gewässern sowie Termine, Kontakt und Downloads im Vordergrund.

## Operating Context

- Informationen werden als Seiten und wiederverwendbare Inhaltsblöcke
  zusammengestellt. Das bestehende Directus-Modell und die Blockzuordnung sind
  in der [Frontend-Architektur](frontend/frontend-architektur.md) beschrieben.
- Tabellen, etwa mit Mindestmaßen oder Schonzeiten, werden in Directus über
  die vorhandene AG-Grid-Integration gepflegt. Ihr `col_N`-Datenformat bleibt
  erhalten.
- Formulare und andere Dokumente sollen herunterladbar sein. Gewünscht sind
  eine farbige und eine druckfreundliche Schwarz-Weiß-Variante; deren
  separate Bereitstellung ist bereits möglich. Eine automatisch verknüpfte
  Varianten-Auswahl benötigt noch ein freigegebenes Datenmodell.
- Das Frontend ist eine clientseitige React-SPA mit Vite, Tailwind CSS und
  shadcn/ui. Ein Router, SSR oder ein Frameworkwechsel sind nicht beauftragt.

## Capabilities and Constraints

- Inhalte, Navigation, Bilder und Einstellungen sollen aus Directus stammen;
  vereins- oder projektspezifische Inhalte dürfen nicht im Frontend fest
  codiert werden.
- Die Website soll für Smartphones, Tablets und Desktopgeräte geeignet sein.
  Kerninformationen sollen auf kurzen Wegen erreichbar sein und eine gut
  sichtbare Suche erhalten.
- Das gewünschte Farbsystem verwendet eine neutrale Basis für Light- und
  Dark-Mode sowie höchstens zwei administrativ wählbare Akzentfarben.
  Geprüfte Farbkombinationen werden automatisch korrigiert. Das bisherige
  Theme ist nur noch über eine technische Einstellung verfügbar. Ein manueller
  Hell-/Dunkel-Umschalter ist noch nicht vorhanden.
- Änderungen am Directus-Datenmodell benötigen vor ihrer Umsetzung eine
  gesonderte Freigabe. Die [Datenbankdokumentation](docs/architecture/DB.md)
  und der Directus-Snapshot sind dabei abzugleichen.
- Eine Zwei-Klick-Vorgabe für Kerninformationen setzt voraus, dass die
  jeweiligen Kernziele redaktionell festgelegt und die tatsächlichen
  Navigationswege geprüft werden.

## Product Principles

1. Bestehende generische Bausteine erhalten und gezielt erweitern.
2. Inhalte und Aufgaben schnell auffindbar und verständlich machen.
3. Redaktionelle Pflege mit klaren Bezeichnungen und sinnvollen Vorgaben
   erleichtern.
4. Lesbarkeit und Bedienbarkeit vor dekorative Effekte stellen.
5. Fähigkeiten und leere oder fehlende Inhalte ehrlich anzeigen.

## Accessibility & Inclusion

Ziel ist WCAG 2.2 AA. Dazu gehören insbesondere ausreichende Kontraste,
sichtbarer Tastaturfokus, verständliche Beschriftungen, gut lesbare Schrift,
große Berührungsziele und die Berücksichtigung reduzierter Bewegung.
