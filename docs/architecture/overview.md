# Architekturuebersicht

`frontend` enthaelt das React/Vite-Frontend. Es verwendet den Directus SDK
Client und prueft beim Start die Erreichbarkeit des CMS ueber `/server/ping`.

`cms` enthaelt keinen Directus-Core-Code. Directus laeuft als Docker-Image;
der Ordner ist fuer Konfiguration und spaetere Schema-Snapshots vorgesehen.

Der Compose-Stack startet drei Container:

- PostgreSQL speichert die Directus-Datenbank und ist nur im Compose-Netzwerk
  erreichbar.
- Redis dient Directus als Cache und ist nur im Compose-Netzwerk erreichbar.
- Directus stellt CMS und API auf http://localhost:8055 bereit.

Zum Starten siehe den Quickstart im Root-README.
