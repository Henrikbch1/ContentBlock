# Tabellenaktionen in Directus

Das Interface `contentblock-table` erweitert das vorhandene Grid um drei
Aktionen: Spalte hinzufuegen, Spalte entfernen und Zeile entfernen. Neue
Tabellen haben zwei Spalten; bestehende Tabellen behalten ihre gespeicherte
Spaltenzahl. Die Website und bestehende Inhalte werden nicht migriert.

## Umsetzung

| Aktion | Ergebnis |
| --- | --- |
| Add row | Leere Inhaltszeile anhaengen |
| Add column | Leere Spalte rechts anhaengen |
| Remove column | Spalte der fokussierten Zelle inklusive aller Werte entfernen |
| Remove row | Zeile der fokussierten Zelle inklusive aller Werte entfernen |
| Undo | Letzte Aenderung zuruecknehmen; maximal 30 Schritte im offenen Editor |

Entfernen erfordert Bestaetigung mit Anzahl befuellter Zellen. Die erste Zeile
enthaelt Ueberschriften und kann nicht entfernt werden; mindestens eine Spalte
bleibt bestehen. Leere Werte, `0` und `false` werden korrekt unterschieden.
Die Aktionen aendern nur das Formular. Erst Directus **Save** speichert sie.
Undo ist keine dauerhafte Datensicherung und geht beim Neuladen verloren.
Nach gespeicherten Loeschungen ist eine zuvor verifizierte Revision oder ein
Backup fuer die Wiederherstellung erforderlich.

## Frontend

[src/TableEditor.js](src/TableEditor.js) kapselt die vorhandene Grid-Komponente.
[src/tableData.js](src/tableData.js) verwaltet unveraenderlich das bestehende
Arrayformat mit `col_1`, `col_2`, usw. Beim Entfernen einer mittleren Spalte
werden die verbleibenden Schluessel ueber alle Zeilen gemeinsam neu nummeriert.
Leere Spalten bleiben durch explizite leere Zellwerte nach Neuladen erhalten.
Unbekannte Datenformate werden nicht bearbeitet oder stillschweigend konvertiert.

Die Toolbar verwendet tastaturbedienbare Buttons mit zugaenglichen Namen und
sichtbarem Fokus. Eine fokussierte Grid-Zelle bestimmt Zeile und Spalte fuer
die Loeschaktionen. `disabled` sperrt Bearbeitung und Aktionen; `nonEditable`
blendet die Toolbar zusaetzlich aus. Die originalen Add-Row-Steuerelemente
werden ausgeblendet. Sortieren und Filtern bleiben deaktiviert.

> **Bewusste Abhaengigkeit:** Der Wrapper verwendet die Vue-Komponente und
> DOM-Struktur von AG Grid Interface **1.0.2**. Ein Upgrade muss separat auf
> Kompatibilitaet geprueft werden. Die Marketplace-Dateien bleiben unveraendert.
> Mehrzelliges Clipboard-Paste ist nicht enthalten. Die Website blendet wie
> bisher leere nachfolgende Spalten aus, obwohl sie im Editor erhalten bleiben.

## Backend

Nur die Interface-Metadaten von `block_table.data` werden umgestellt:
`interface: contentblock-table`, `options: null` und ein aktualisierter Hinweis.
Der Feldtyp bleibt JSON. Es gibt keine neuen Endpunkte oder Berechtigungen.

### Build und Deployment

Voraussetzungen: lokale Directus-Instanz gemaess
[Compose](../../docker-compose.yml), installierte Marketplace-Erweiterung
`directus-extension-ag-grid-interface@1.0.2` und vorhandene Vite-Abhaengigkeiten
des Projekt-Frontends. Befehle aus dem Repository-Root:

```powershell
npm --prefix cms/extensions/directus-extension-contentblock-table run build
docker compose -f cms/docker-compose.yml exec -T directus mkdir -p /directus/extensions/directus-extension-contentblock-table
docker compose -f cms/docker-compose.yml cp cms/extensions/directus-extension-contentblock-table/dist directus:/directus/extensions/directus-extension-contentblock-table/dist
docker compose -f cms/docker-compose.yml cp cms/extensions/directus-extension-contentblock-table/package.json directus:/directus/extensions/directus-extension-contentblock-table/package.json
```

[build.mjs](build.mjs) liest das vorhandene Bundle aus dem Projekt-Container,
prueft Paketname und Version, baut mit lokalem Vite und behaelt dessen MIT-Lizenz
als `dist/UPSTREAM-LICENSE`. Ein npm-Download ist nicht erforderlich. Der Build
gibt den SHA-256 des verwendeten Bundles aus. Vue und das Directus Extensions SDK
werden von Studio bereitgestellt. Build-Artefakte unter `dist/` sind nicht in Git.
Nach Deployment die erfolgreiche Registrierung ueber `/extensions` pruefen;
erst dann das Feld auf `contentblock-table` umstellen. Auto-Reload kann kurzzeitig
HTTP 503 verursachen; keine anderen Erweiterungen deaktivieren oder blind neu starten.

Bei erneuten Deployments nur die gebaute Datei aktualisieren:

```powershell
docker compose -f cms/docker-compose.yml cp cms/extensions/directus-extension-contentblock-table/dist/index.js directus:/directus/extensions/directus-extension-contentblock-table/dist/index.js
```

### Sicherung und Rollback

Vor der ersten Umstellung wurde der Schema-Snapshot ausserhalb von Git gesichert:
`%LOCALAPPDATA%/ContentBlock/backups/pre-table-controls-20260918-151727/schema.json`.
Er enthaelt die vorherigen Feldoptionen, aber keine Inhalte.

Zum Interface-Rollback nur die gesicherten Metadaten von `block_table.data`
wiederherstellen: Interface `veryphatic-ag-grid`, urspruengliche Optionen und
Hinweis. Keine pauschale Schema-Wiederherstellung oder Inhaltsimporte ausfuehren.
Das alte Interface definiert vier gemeinsame Spalten; inzwischen hinzugefuegte
Spalten jenseits davon bleiben gespeichert, sind dort aber nicht sichtbar.
Vor einem spaeteren Rollback deshalb aktuelle Spaltenzahlen pruefen.

### Verifikation am 18.09.2026

- Build mit lokalem Vite erfolgreich; keine Downloads erforderlich.
- Datenoperationen mit Node-Assertions geprueft: zwei Standardspalten,
	leere persistierte Spalten, mittlere Spalte entfernen, Zeile entfernen,
	geschuetzte Kopfzeile/letzte Spalte, `0`/`false`, unveraenderte Eingabedaten.
- Im lokalen Studio per Maus getestet: Zellen bearbeiten, Spalte/Zeile
	hinzufuegen, Loeschung abbrechen/bestaetigen, Undo, Speichern und Neuladen.
- Leere zusaetzliche Spalte sowie gespeicherte Zeilen-/Spaltenentfernung nach
	Neuladen und per Admin-API bestaetigt. Vier vorhandene Tabellen mit 31 Zeilen
	blieben laut SHA-256-Vergleich unveraendert. Der freigegebene Testdatensatz
	`7102c4e6-8c5f-47f3-8f35-b2926c1f5333` wurde anschliessend geloescht.
- Tastatur: Enter fuer Undo und Add column, Tab-Reihenfolge und sichtbarer
	Fokus geprueft. Kein vollstaendiger ausschliesslicher Tastaturdurchlauf.
- Desktop und mobile Darstellung visuell geprueft: Toolbar umbrechend,
	Grid horizontal scrollbar. Tests verwendeten die bestehende Admin-Sitzung;
	keine separate Rollen-/Public-Pruefung und keine Berechtigungsveraenderung.
- Live-Schema gegen die Sicherung verglichen: nur Interface, Optionen und
	Hinweis des Tabellenfelds geaendert. Vorbestehende Drift des Repository-Snapshots
	bei Alias-Metadaten und `block_ticker_items` wurde nicht mit uebernommen.