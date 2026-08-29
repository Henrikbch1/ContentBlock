---
name: contentblock-frontend
description: >-
  Projektweite Grundregeln für das ContentBlock-Frontend (React + Vite +
  Tailwind v4 + shadcn/ui, Directus-Backend). Immer nutzen bei Frontend-Daten
  und -Logik: Block-Registry-Konvention, Theme-Farben aus Directus, nur
  semantische Tailwind-Tokens.
applyTo: 'frontend/src/**/*.{ts,tsx}'
---

# SKILL: contentblock-frontend

Dieses Projekt: React + Vite + Tailwind v4 + shadcn/ui, Directus-Backend.

## Nutze die importierten Skills
- Architektur/Struktur/Kohäsion (Ordner-Layout, Naming, State, Duplikate
  vermeiden) → siehe `contentblock-architecture` Skill.
- Design/Komponenten → siehe `shadcn` Skill.
- Tailwind-v4-Setup/Theming → siehe `shadcn` Skill, insbesondere `rules/styling.md`.
- Visuelle Gestaltungsentscheidungen → siehe `frontend-design` Skill.

## Projekt-Regeln (NUR hier definiert)
- Bausteine via Block-Registry: neuer Block = 1 Datei + 1 Registry-Zeile.
- Theme-Farben kommen aus der Directus `theme`-Collection → CSS-Variablen.
- Semantische Farben (bg-primary), niemals hardcoded (bg-blue-500).