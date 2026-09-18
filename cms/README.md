# CMS-Konfiguration

Hier liegt kein Directus-Core-Code. Directus laeuft als Container-Image.
Dieser Ordner enthaelt nur Konfiguration: `snapshots/` fuer die
Schema-Versionierung sowie spaeter `seeds/` und `flows/`.

Die Datenbank liegt lokal in `database/`. Uploads und Marketplace-Erweiterungen
liegen in persistenten Docker-Volumes und werden nicht eingecheckt.

## Directus 12.3.1 und AG Grid

Die lokale Instanz wurde am 18.09.2026 von 12.2.0 auf 12.3.1 aktualisiert.
Das Image ist in [docker-compose.yml](docker-compose.yml) fest gepinnt.
Vorher wurden ein PostgreSQL-Custom-Dump, Uploads, Erweiterungen und ein
Schema-Snapshot ausserhalb des Repositorys gesichert:
`%LOCALAPPDATA%/ContentBlock/backups/pre-12.3.1-20260918-142016/`.
Der Dump wurde mit `pg_restore --list` strukturell geprueft; ein Restore-Test
in einer separaten Staging-Instanz wurde nicht durchgefuehrt.
Ein Rollback erfordert die Wiederherstellung der Datenbank und Erweiterungen
zusammen mit dem alten Image, nicht nur einen Image-Downgrade.

`block_table.data` verwendet die bereits installierte Marketplace-Erweiterung
`directus-extension-ag-grid-interface@1.0.2` (`veryphatic-ag-grid`).
Sie liegt im bestehenden Extensions-Volume; ein Schema-Import installiert
sie nicht automatisch. Die inkompatible Erweiterung
`@directus-labs/tree-view-table-layout@1.0.2` wurde deaktiviert, nicht geloescht:
ihr unaufgeloester Import von `@directus/system-data` verhinderte das Laden
aller Studio-Erweiterungen.

Datenformat, Grenzen und Pruefschritte stehen im
[Datenmodell](../docs/architecture/DB.md#ag-grid-fuer-block_table).
Schema-Snapshots immer mit explizitem Format erzeugen:
`node cli.js schema snapshot --yes --format json /tmp/snapshot.json`.
Der CLI-Standard ist YAML, unabhaengig von der Dateiendung.
