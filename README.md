# content-block

Monorepo-Light: Directus (CMS) und spaeter React/Vite (Frontend).

## Voraussetzungen

- Docker mit Docker Compose

## Directus starten

1. Die Werte in `.env` pruefen und insbesondere Passwoerter anpassen.
2. `docker compose up -d` aus dem Repository-Root ausfuehren.
3. Directus unter http://localhost:8055 mit `ADMIN_EMAIL` und
	`ADMIN_PASSWORD` aus `.env` anmelden.

## Aktueller Stand

- `apps/cms` enthaelt die Directus-Konfiguration.
- PostgreSQL und Redis laufen ausschliesslich innerhalb des Compose-Netzwerks.
- Directus ist auf Port `8055` erreichbar.