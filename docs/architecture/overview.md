# Architekturuebersicht

`frontend` enthaelt das React/Vite-Frontend (reine Client-SPA, Tailwind CSS v4).
Es verwendet den Directus SDK Client; `getSite()` laedt beim Start Navigation,
Footer und Theme (ueber die Relation `site.theme`) in einer Abfrage.

`cms` enthaelt keinen Directus-Core-Code. Directus laeuft als Docker-Image;
der Ordner enthaelt Konfiguration, Schema-Snapshots, Flows, das Rechte-Skript
fuer die Public-Policy und lokale Erweiterungen.

Der Compose-Stack startet drei Container:

- PostgreSQL speichert die Directus-Datenbank und ist nur im Compose-Netzwerk
  erreichbar.
- Redis dient Directus als Cache und ist nur im Compose-Netzwerk erreichbar.
- Directus stellt CMS und API auf http://localhost:8055 bereit.

Zum Starten siehe den Quickstart im Root-README.
