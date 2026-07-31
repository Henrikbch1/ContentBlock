# content-block

Monorepo-Light: Directus (CMS) und React/Vite (Frontend).

## Voraussetzungen

- Docker mit Docker Compose
- Node 20.19+ oder 22.12+

## Quickstart

1. Die Werte in `.env` pruefen und insbesondere Secret und Passwoerter anpassen.
2. `docker compose up -d` aus dem Repository-Root ausfuehren.
	Directus ist danach unter http://localhost:8055 erreichbar.
3. `cd apps/web && npm install && npm run dev` ausfuehren.
	Das Frontend ist danach unter http://localhost:5173 erreichbar.

Zum Anmelden in Directus werden `ADMIN_EMAIL` und `ADMIN_PASSWORD` aus `.env`
verwendet.

## Struktur

- `apps/web` - React/Vite-Frontend mit Directus-Verbindungstest
- `apps/cms` - Directus-Konfiguration und lokale Laufzeitdaten
- `docs/architecture` - Architekturuebersicht