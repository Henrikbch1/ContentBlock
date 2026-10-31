# Umsetzungsstand – ContentBlock Frontend

> Ersetzt den ursprünglichen Phasenplan (Next.js/pnpm/`apps/web`). Das Frontend ist
> eine Vite-SPA unter `frontend/`; die Architektur steht in
> [frontend-architektur.md](frontend-architektur.md). Arbeitsregeln für Agenten:
> [.github/copilot-instructions.md](../.github/copilot-instructions.md) und die Skills
> unter `.github/skills/`.

## Status der ursprünglichen Phasen

| Phase                           | Stand   | Umsetzung im Ist-Stand                                                                          |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| 1 Setup                         | fertig  | Vite + React 19 + Tailwind v4; `components.json` für shadcn vorhanden, `components/ui` fehlt    |
| 2 Directus-Anbindung und Typen  | fertig  | `lib/directus.ts`, `lib/types/`, `lib/queries/` mit expliziten Feldlisten                       |
| 3 Theme-System                  | fertig  | `ThemeProvider` setzt `--cb-*` auf `<html>`; Defaults und Tailwind-Tokens in `src/index.css`    |
| 4 Layout                        | fertig  | `Header` (Desktop-/Mobile-Navigation und Titelsuche), `Footer`, `Container`, `Section`          |
| 5 BlockRenderer und 12 Blöcke   | fertig  | `components/blocks/`                                                                            |
| 6 Datenlogik dynamischer Blöcke | fertig  | `get{News,Events,Documents,Contacts}ForBlock`, clientseitig über `useAsyncResource`             |
| 7 Routing und Detailseiten      | fertig  | Pfad-Auswertung in `App.tsx` (CMS-Seiten, News, Termine); kein Router-Paket                     |
| 8 Feinschliff, A11y, QA         | laufend | Skip-Link, Fokus-Stile, `prefers-reduced-motion`, statische Hinweisleiste; responsive/Tastatur geprüft |

Abweichungen vom Ursprungsplan: kein Next.js (daher kein SSR, keine statische
Generierung, kein `getPageSlugs`), `npm` statt `pnpm`, Umgebungsvariablen mit
`VITE_`-Präfix. Standard ist die neutrale Gestaltung „Vereinsschaukasten“ mit
Hell-/Dunkelmodus; das bisherige Theme ist über `VITE_THEME_MODE=legacy`
weiterhin verfügbar.

## Qualitätsgate

Vor Abschluss einer Änderung aus `frontend/`:

```powershell
npm run lint
npm run test
npm run build
```

Zusätzlich die Grep-Invarianten aus
[.github/skills/contentblock-architecture/invariants.md](../.github/skills/contentblock-architecture/invariants.md)
prüfen. Frontend-Tests (Vitest) decken Hilfsfunktionen und einfache Komponenten ab;
Seiten und Blöcke werden manuell gegen echte CMS-Inhalte geprüft.

## Arbeitsregeln

1. Neue Daten in `lib/queries/` typisieren und die benötigten Felder ausdrücklich listen;
   benötigte Felder auch in `cms/snapshots/apply-public-permissions.mjs` ergänzen.
2. Relationen immer null-sicher behandeln (`directusRelations.ts`).
3. Farben nur über semantische Tokens (`bg-primary`, `text-foreground`).
4. Wiederverwendung vor Duplikat: `DirectusImage`, `RichText`, `Section`, `EmptyState`,
   `lib/format.ts`, `lib/uiMessages.ts`.
5. CMS-Modelländerungen mit Snapshot und `docs/architecture/DB.md` abgleichen.
6. `block_table.data` bleibt im flachen `col_N`-Format.
7. Conventional Commits, pro sinnvoller Einheit ein Commit.
