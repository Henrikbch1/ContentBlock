# CMS-Konfiguration

Hier liegt kein Directus-Core-Code. Directus laeuft als Container-Image.
Dieser Ordner enthaelt Konfiguration, `snapshots/` fuer die Schema-Versionierung
und lokale Interface-Erweiterungen unter `extensions/`.

Die Datenbank liegt lokal in `database/`. Uploads und Marketplace-Erweiterungen
liegen in persistenten Docker-Volumes und werden nicht eingecheckt.

## Directus Runtime und AG Grid

### Directus 12.5.0 (09.10.2026)

Die lokale Instanz wurde von 12.3.1 auf 12.5.0 aktualisiert. PostgreSQL 17
und Redis 7 blieben unveraendert. Vorher wurden Schema, PostgreSQL-Custom-Dump,
Uploads und Extensions ausserhalb des Repositorys gesichert:
`%LOCALAPPDATA%/ContentBlock/backups/20261009-pre-12.5.0/`.
Der Dump wurde mit `pg_restore --list` strukturell geprueft und die externe
Kopie per SHA-256 mit dem Original verglichen; ein isolierter Restore-Test fand
nicht statt. Die Schemaexporte vor und nach dem Upgrade enthalten dieselben 40
Collections ohne strukturelle Aenderungen. Die bestehende lokale Abweichung bei
`block_ticker_items` im getrackten Snapshot wurde beibehalten.

Directus meldet nach dem Start eine aktivierte Open-Innovation-Grant-Lizenz;
Health-Checks fuer PostgreSQL, Redis, lokalen Storage und E-Mail waren gesund.
Flows und Operations waren leer, Policies enthielten keine IP-Regeln. Die
Extensions wurden beim Start geladen und ihre Source-Route antwortete mit HTTP
200. Sechs installierte Erweiterungen deklarieren in ihren Metadaten jedoch
keinen Directus-12-Hostbereich; ihre fachliche Studio-Funktion wurde nicht
vollstaendig getestet. Inhalts-Reads fuer Seiten und Block-Items antworteten mit
HTTP 403 FORBIDDEN, daher fand kein vollstaendiger Inhalts-Smoke-Test statt.

### Directus 12.3.1 (18.09.2026)

Die lokale Instanz wurde am 18.09.2026 von 12.2.0 auf 12.3.1 aktualisiert.
Das Image ist in [docker-compose.yml](docker-compose.yml) fest gepinnt.
Vorher wurden ein PostgreSQL-Custom-Dump, Uploads, Erweiterungen und ein
Schema-Snapshot ausserhalb des Repositorys gesichert:
`%LOCALAPPDATA%/ContentBlock/backups/pre-12.3.1-20260918-142016/`.
Der Dump wurde mit `pg_restore --list` strukturell geprueft; ein Restore-Test
in einer separaten Staging-Instanz wurde nicht durchgefuehrt.
Ein Rollback erfordert die Wiederherstellung der Datenbank und Erweiterungen
zusammen mit dem alten Image, nicht nur einen Image-Downgrade.

`block_table.data` verwendet jetzt das lokale Interface `contentblock-table`.
Es ergaenzt die installierte Marketplace-Erweiterung
`directus-extension-ag-grid-interface@1.0.2` um tabellenspezifische Spalten,
Loeschaktionen und Undo. Neue Tabellen starten mit zwei Spalten.
Build, Deployment und Rollback stehen in der
[Erweiterungsdokumentation](extensions/directus-extension-contentblock-table/README.md).
Beide Erweiterungen liegen im bestehenden Extensions-Volume; ein Schema-Import
installiert sie nicht automatisch. Die inkompatible Erweiterung
`@directus-labs/tree-view-table-layout@1.0.2` wurde deaktiviert, nicht geloescht:
ihr unaufgeloester Import von `@directus/system-data` verhinderte das Laden
aller Studio-Erweiterungen.

Datenformat, Grenzen und Pruefschritte stehen im
[Datenmodell](../docs/architecture/DB.md#ag-grid-fuer-block_table).
Schema-Snapshots immer mit explizitem Format erzeugen:
`node cli.js schema snapshot --yes --format json /tmp/snapshot.json`.
Der CLI-Standard ist YAML, unabhaengig von der Dateiendung.
