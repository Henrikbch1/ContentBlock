# Styling & Component Conventions (Tailwind v4 + shadcn/ui)

[← zurück zu SKILL.md](../SKILL.md)

Das MUI-Kapitel des SLUI-Skills (`sx` vs. `styled()`, Wrapper-Komponenten,
Responsiveness, A11y) übersetzt sich in diesem Projekt auf Tailwind + shadcn.

## Semantische Tokens statt roher Farben (bereits Projektregel)

Immer `bg-primary`, `text-foreground`, `border-border`,
`text-muted-foreground` — nie `bg-blue-500` oder ein hex-Wert direkt in der
`className`. Die einzige zulässige Ausnahme ist ein bewusst
Theme-unabhängiger Hover-Akzent, und auch der sollte, wenn er mehrfach
vorkommt, als Token diskutiert werden statt als Hex-Literal in mehreren
Dateien zu landen (siehe `hover:bg-[#f3c972]` / `hover:bg-[#004a4d]` in
`HeroBlock.tsx`/`ContactForm.tsx` — Kandidat für ein `--accent-hover`-Token,
falls der Farbton wiederverwendet werden soll).

## `Section`/`Container` wiederverwenden statt Wrapper-Markup zu duplizieren

`components/layout/Section.tsx` und `Container.tsx` existieren genau für das
wiederkehrende `mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16`-Muster.
Aktuell duplizieren `CardsBlock.tsx`, `HeroBlock.tsx` und `ContactForm.tsx`
dieses Muster **inline** statt `<Section>`/`<Container>` zu nutzen.

```tsx
// Vermeiden — dupliziert das Section/Container-Muster:
<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">...</section>

// Bevorzugt:
<Section>...</Section>
```

Neue Blocks nutzen `Section`/`Container` von Anfang an; bestehende Blocks
sind Refactor-Kandidaten (kein Blocker, aber bei nächster Berührung
mitziehen).

## shadcn/ui statt handgebauter Formularelemente

`components.json` ist konfiguriert, aber es existiert noch **kein**
`components/ui/`-Ordner — d. h. bislang wurde keine einzige shadcn-Komponente
tatsächlich generiert. `ContactForm.tsx` baut Button/Input/Textarea/Checkbox
aktuell von Hand mit Tailwind-Klassen nach.

**Empfehlung**: Bevor ein weiteres handgebautes Formularelement entsteht,
die passende shadcn-Komponente über den `shadcn`-Skill hinzufügen (`Button`,
`Input`, `Textarea`, `Checkbox`, `Label`). Das spart die manuelle
Fokus-/Disabled-/A11y-Behandlung, die shadcn bereits mitbringt, und
vereinheitlicht das Erscheinungsbild projektweit über eine Quelle statt über
wiederholte Klassenlisten.

## Wiederholte Klassencluster extrahieren

Wenn dieselbe Tailwind-Klassenkombination 3+ Mal auftritt (z. B. die
Input-/Textarea-Styles in `ContactForm.tsx`), entweder:

- eine shadcn-Komponente verwenden (bevorzugt, siehe oben), oder
- eine kleine Wrapper-Komponente extrahieren, die die Defaults bündelt und
  restliche Props durchreicht — analog zum SLUI-Prinzip
  "Wrapper-Komponenten statt Prop-Duplikation".

Niemals ein Klassen-String-Literal wortgleich in mehr als zwei Dateien
kopieren.

## Responsivität

Tailwind-Breakpoint-Präfixe (`sm:`, `md:`, `lg:`) direkt in der `className`
— bereits durchgängig so im Projekt. Kein `useMediaQuery`/JS-basiertes
Umschalten einführen, solange sich nur Abstände/Größen ändern, nicht die
Markup-Struktur.

## Barrierefreiheit (A11y)

- Lade-/Statustexte: `role="status"` + `aria-live="polite"` (bereits so in
  `EmptyState.tsx`, `CmsPage.tsx`) — bei jedem neuen Lade-/Leerzustand
  beibehalten.
- Fehlertexte mit harter Priorität: `role="alert"` + `aria-live="assertive"`
  (wie in `App.tsx` beim Verbindungsfehler).
- Icon-only-Buttons/Links bekommen ein `aria-label` bzw. `aria-hidden="true"`
  auf dem Icon selbst, wenn daneben schon Text steht (bereits so mit
  `lucide-react`-Icons in `NewsPage.tsx`/`ContactForm.tsx`).
- Bilder ohne Informationsgehalt (z. B. Hero-Hintergrundbild) bekommen
  `alt=""` (bereits so in `HeroBlock.tsx`), inhaltstragende Bilder ein
  sprechendes `alt`.
- Nie Farbe allein als Statusträger verwenden (z. B. Fehler-Rahmen ohne
  Fehlertext).
