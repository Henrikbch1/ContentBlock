# Verifizierbare Invarianten (mechanisch prüfbar)

[← zurück zu SKILL.md](../SKILL.md)

Jede Regel hier ist ohne Urteilsvermögen prüfbar — per Suche/Grep und
`npm run build`. **Vor jedem Abschluss einer Frontend-Aufgabe alle
Invarianten prüfen.** Ein Treffer = Verstoß, der in der aktuellen Aufgabe
behoben wird (oder explizit als bekannte Ausnahme unten gelistet ist).

Alle Befehle aus dem Repo-Root; erwartetes Ergebnis ist immer
**keine Treffer** (außer bei gelisteten Ausnahmen).

## I-1: `as never`/`as unknown` nur an der Directus-Grenze

```powershell
Get-ChildItem frontend/src -Recurse -Include *.ts,*.tsx |
  Where-Object { $_.FullName -notmatch 'lib[\\/](directus\.ts|queries)' } |
  Select-String -Pattern 'as never|as unknown'
```

## I-2: Kein `@directus/sdk`-Import außerhalb von `lib/`

```powershell
Get-ChildItem frontend/src -Recurse -Include *.ts,*.tsx |
  Where-Object { $_.FullName -notmatch 'src[\\/]lib[\\/]' } |
  Select-String -Pattern 'from "@directus/sdk"'
```

## I-3: Kein Block importiert Queries oder den Client

Blocks lesen nur ihre `item`-Prop; datenladende Blocks (`NewsBlock` u. a.)
erhalten ihre Query-Funktion trotzdem aus `lib/queries` — deshalb prüft
diese Invariante nur `lib/directus`-Importe:

```powershell
Get-ChildItem frontend/src/components -Recurse -Include *.tsx |
  Select-String -Pattern 'from ".*lib/directus"'
```

## I-4: Kein `any`

```powershell
Get-ChildItem frontend/src -Recurse -Include *.ts,*.tsx |
  Select-String -Pattern ': any\b|as any\b|any\[\]'
```

## I-5: Keine rohen Tailwind-Farben in Klassen

```powershell
Get-ChildItem frontend/src -Recurse -Include *.tsx |
  Select-String -Pattern '(bg|text|border)-(red|blue|green|yellow|orange|purple|pink|slate|zinc|gray|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d'
```

## I-6: Keine Hex-Farben in `className`

```powershell
Get-ChildItem frontend/src -Recurse -Include *.tsx |
  Select-String -Pattern '\[#[0-9a-fA-F]{3,8}\]'
```

**Bekannte Ausnahmen (Refactor-Kandidaten, kein neuer Code darf dazukommen):**
`HeroBlock.tsx` (`hover:bg-[#f3c972]`), `ContactForm.tsx`
(`hover:bg-[#004a4d]`), `Footer.tsx` (`bg-[#17312e]`) — Ziel: semantische
Tokens (`--accent-hover` o. Ä.) in `index.css` + `theme`-Collection.
Wer eine dieser Dateien anfasst, zieht das Token mit.

## I-7: Keine duplizierten Helfer

`formatDate`/`formatDateRange` nur in `lib/format.ts`; Relation-Helfer nur
in `lib/directusRelations.ts`:

```powershell
Get-ChildItem frontend/src -Recurse -Include *.ts,*.tsx |
  Where-Object { $_.Name -notin 'format.ts','directusRelations.ts' } |
  Select-String -Pattern 'const (formatDate|formatDateRange|getRelationId|getRelationIds|getRelation|getAssetId)\b'
```

## I-8: Keine hartkodierten Lade-/Leer-/Fehlertexte

Wiederkehrende Statustexte kommen aus `lib/uiMessages.ts`:

```powershell
Get-ChildItem frontend/src -Recurse -Include *.tsx |
  Where-Object { $_.Name -ne 'uiMessages.ts' } |
  Select-String -Pattern '"[^"]*(werden geladen|vorhanden\.|konnte nicht)[^"]*"'
```

## I-9: Kein TypeScript-`enum`

```powershell
Get-ChildItem frontend/src -Recurse -Include *.ts,*.tsx |
  Select-String -Pattern '\benum\s'
```

## I-10: Build ist grün

```powershell
cd frontend; npm run build
```

`tsc --noEmit` + `vite build` sind das einzige automatische Qualitätsgate
des Projekts (kein ESLint/Prettier konfiguriert) — deshalb sind I-1 bis I-9
Pflicht, nicht optional.

## Datei-Budgets

Siehe [`conventions/file-size-and-splitting.md`](conventions/file-size-and-splitting.md)
inkl. Prüfbefehl (keine Datei über dem harten Limit).
