# ContentBlock: Projektweite Copilot-Anweisungen

## Projekt und Architektur

- Das Repository ist ein leichtes Monorepo: `cms/` enthält Directus 12.2.0 mit PostgreSQL 17 und Redis; `frontend/` ist eine React-19-/TypeScript-/Vite-8-SPA mit Tailwind CSS v4 und `@directus/sdk`.
- Die aktuelle Architektur ist die implementierte Vite-SPA. `src/App.tsx` behandelt die Client-seitigen Pfade für CMS-Seiten, News und Events. Ohne ausdrücklichen Auftrag keinen Router und kein Next.js einführen.
- Bei Widersprüchen sind der aktuelle Code und die aktuelle Konfiguration maßgeblich, nicht historische Vorschläge in `frontend/frontend-architektur.md` oder `frontend/PLAN.md`.
- Relevante Orientierung: `README.md`, `cms/README.md`, `docs/architecture/DB.md` und `cms/snapshots/snapshot.json`.

## Frontend und Directus

- `src/lib/directus.ts` ist die Directus-Schema-Grenze. `src/lib/types.ts` definiert nullable `DirectusRelation<T>`-Typen; Relationen immer null-sicher behandeln.
- `src/lib/queries.ts` besitzt die typisierten Directus-Queries und expliziten Feldlisten. Neue Daten dort typisieren und die benötigten Felder ausdrücklich aufnehmen.
- CMS-Inhalte werden als Blocks gerendert. `src/components/blocks/BlockRenderer.tsx` ordnet die elf implementierten `block_*`-Collections jeweils einer Komponente zu.
- Einen neuen Block vollständig ergänzen: Typ, Directus-Schema, Query-Felder, Komponente und Registry-Eintrag. Das Directus-Schema nur ändern, wenn sich das CMS-Modell ändert.
- Theme-Daten kommen aus der Directus-`theme`-Collection. `src/components/common/ThemeProvider.tsx` überführt sie in CSS-Variablen; die semantischen Tailwind-v4-Tokens liegen in `src/index.css`.
- Für Farben semantische Tokens wie `bg-primary` und `text-foreground` verwenden, keine rohen Tailwind-Farben oder hart codierten Theme-Farben.

## UI und Skills

- Für Frontend-Daten und -Logik `.github/skills/frontend/SKILL.md` beachten.
- Für Architektur, Ordnerstruktur, Kohäsion/Kapselung, Naming und State-Handling
  im Frontend `.github/skills/contentblock-architecture/SKILL.md` verwenden —
  insbesondere beim Anlegen eines neuen Blocks oder beim Clean-Code-Review.
- Für visuelle/UI-Änderungen `.github/skills/frontend-design/SKILL.md` verwenden; responsive Darstellung, sichtbaren Tastaturfokus und reduzierte Bewegung berücksichtigen.
- `components.json` beschreibt shadcn im Stil `new-york`, Tailwind-Datei `src/index.css`, Alias `@/*` und Lucide-Icons. Es beweist nicht, dass eine UI-Komponente installiert ist.
- Vor dem Hinzufügen oder Ändern einer shadcn-Komponente `.github/skills/shadcn/SKILL.md` und deren Docs-Workflow verwenden. Zuerst installierte Komponenten prüfen und keine APIs oder Registry-Komponenten erraten.

## CMS, Konfiguration und Sicherheit

- Die Frontend-Umgebung verwendet `VITE_DIRECTUS_URL` und optional `VITE_DIRECTUS_TOKEN`.
- Niemals `.env*`, Secrets, `cms/database/` oder `cms/uploads/` committen.
- CMS-Modelländerungen mit dem Directus-Snapshot und der Datenbankdokumentation abgleichen.

## Befehle und Validierung

- Voraussetzungen: Node 20.19+ oder 22.12+ sowie Docker Compose.
- CMS starten: `cd cms && docker compose up -d`
- Frontend installieren: `cd frontend && npm install`
- Entwicklungsserver starten: `cd frontend && npm run dev`
- Frontend bauen: `cd frontend && npm run build` (`tsc --noEmit && vite build`)
- Nach jeder Frontend-Änderung `npm run build` aus dem Verzeichnis `frontend/` ausführen.
- Bei UI- oder Navigationsänderungen zusätzlich responsive Darstellung und Tastaturbedienung manuell prüfen.
