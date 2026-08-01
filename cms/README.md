# CMS-Konfiguration

Hier liegt kein Directus-Core-Code. Directus laeuft als Container-Image.
Dieser Ordner enthaelt nur Konfiguration: `snapshots/` fuer die
Schema-Versionierung sowie spaeter `seeds/` und `flows/`.

Die Datenbank liegt lokal in `database/`. Uploads und Marketplace-Erweiterungen
liegen in persistenten Docker-Volumes und werden nicht eingecheckt.
