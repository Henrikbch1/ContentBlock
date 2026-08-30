# Styling & Component Conventions (Tailwind v4 + shadcn/ui)

[← zurück zu SKILL.md](../SKILL.md)

Das MUI-Kapitel des SLUI-Skills (`sx` vs. `styled()`, Wrapper-Komponenten,
Responsiveness, A11y) übersetzt sich in diesem Projekt auf Tailwind + shadcn.

## Semantische Tokens statt roher Farben (bereits Projektregel)

Immer `bg-primary`, `text-foreground`, `border-border`,
`text-muted-foreground` — nie `bg-blue-500` oder ein hex-Wert direkt in der
`className` (mechanisch prüfbar: Invarianten I-5/I-6 in
[`../invariants.md`](../invariants.md)). Drei Altlasten existieren noch als
dokumentierte Ausnahmen (`hover:bg-[#f3c972]` in `HeroBlock.tsx`,
`hover:bg-[#004a4d]` in `ContactForm.tsx`, `bg-[#17312e]` in `Footer.tsx`)
— wer eine dieser Dateien anfasst, ersetzt den Hex-Wert durch ein
semantisches Token (z. B. `--accent-hover`) in `index.css` +
`theme`-Collection statt einen weiteren hinzuzufügen.

## `Section`/`Container` wiederverwenden statt Wrapper-Markup zu duplizieren

`components/layout/Section.tsx` und `Container.tsx` existieren genau für das
wiederkehrende `mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16`-Muster.
**Alle Blocks nutzen `<Section>`** (schmalere Blocks wie
`TextBlock`/`FaqBlock`/`ContactForm` mit `containerClassName="max-w-3xl"`).
Bewusste Ausnahmen sind nur die Full-Bleed-Blocks `HeroBlock` und
`TickerBlock`, die über die volle Breite gehen.

```tsx
// Vermeiden — dupliziert das Section/Container-Muster:
<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">...</section>

// Bevorzugt:
<Section>...</Section>
<Section containerClassName="max-w-3xl">...</Section>
```

Neue Blocks nutzen `Section`/`Container` von Anfang an; ein neuer
Full-Bleed-Block ist die einzige zulässige Ausnahme und wird im PR kurz
begründet.

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
