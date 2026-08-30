---
name: contentblock-frontend
description: >-
  Projektweite Grundregeln für das ContentBlock-Frontend (React + Vite +
  Tailwind v4 + shadcn/ui, Directus-Backend). Immer nutzen bei Frontend-Daten
  und -Logik: Block-Registry-Konvention, Theme-Farben aus Directus, nur
  semantische Tailwind-Tokens.
applyTo: "frontend/src/**/*.{ts,tsx}"
---

# SKILL: contentblock-frontend

Dieses Projekt: React + Vite + Tailwind v4 + shadcn/ui, Directus-Backend.
Dies ist der **Einstiegspunkt** für Frontend-Arbeit — er definiert die
wenigen projektweiten Grundregeln und routet zu den Spezial-Skills.

## Skill-Routing (genau einen Weg wählen)

| Aufgabe                                                                               | Skill                                                                  |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Neuer Block, Datei-/Ordnerstruktur, Naming, State, Refactoring, Review, Datei zu groß | `contentblock-architecture` (dort die Aufgaben-Routing-Tabelle nutzen) |
| shadcn-Komponente hinzufügen/verwenden/stylen                                         | `shadcn`                                                               |
| Visuelle Gestaltungsentscheidungen (Palette, Typo, Layout)                            | `frontend-design`                                                      |

## Projekt-Regeln (NUR hier definiert)

- Bausteine via Block-Registry: neuer Block = 1 Datei + 1 Registry-Zeile in
  `BlockRenderer.tsx` (+ Typ in `lib/types.ts` + Query-Felder in
  `lib/queries.ts`).
- Theme-Farben kommen aus der Directus `theme`-Collection → CSS-Variablen
  (`ThemeProvider.tsx` → `index.css`).
- Semantische Farben (`bg-primary`), niemals hardcoded (`bg-blue-500`, Hex).
- Einziges automatisches Qualitätsgate: `cd frontend && npm run build`
  (`tsc --noEmit` + `vite build`) — nach **jeder** Frontend-Änderung
  ausführen. Zusätzlich die Grep-Invarianten aus
  `contentblock-architecture/invariants.md` prüfen.
- Kein Router/Next.js einführen; das clientseitige Routing lebt in
  `App.tsx` (bewusste Architekturentscheidung).
