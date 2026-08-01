# content-block

Monorepo-Light: Directus (CMS) und React/Vite (Frontend).

## Voraussetzungen

- Docker mit Docker Compose
- Node 20.19+ oder 22.12+

## Quickstart

1. Die Werte in `cms/.env` pruefen und insbesondere Secret und Passwoerter anpassen.
2. `cd cms && docker compose up -d` aus dem Repository-Root ausfuehren.
   Directus ist danach unter http://localhost:8055 erreichbar.
3. `cd frontend && npm install && npm run dev` ausfuehren.
   Das Frontend ist danach unter http://localhost:5173 erreichbar.

Zum Anmelden in Directus werden `ADMIN_EMAIL` und `ADMIN_PASSWORD` aus `cms/.env`
verwendet.

## Struktur

- `frontend` - React/Vite-Frontend mit Directus-Verbindungstest
- `cms` - Directus-Konfiguration und lokale Laufzeitdaten
- `docs/architecture` - Architekturuebersicht
