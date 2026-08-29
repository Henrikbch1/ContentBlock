# State & Data-Fetching Conventions

[← zurück zu SKILL.md](../SKILL.md)

## `useState` + `useEffect` bleibt die richtige Wahl

Kein Modul-Store, kein Context für Seiteninhalte — siehe
[`../architecture/data-flow.md`](../architecture/data-flow.md) für die
Begründung. Diese Datei beschreibt, **wie** das bestehende Muster sauber
bleibt, wenn es sich wiederholt.

## Tri-State-Gate (feste Reihenfolge)

Jede datengetriebene Page rendert genau einen von vier sich gegenseitig
ausschließenden Zuständen, **in dieser Reihenfolge geprüft**:

1. **Error** — ein Fehler hat Vorrang vor allem anderen.
2. **Loading** — nur solange geladen wird UND noch keine Daten da sind.
3. **Empty** — nur nach einem **erfolgreichen** Fetch mit leerem Ergebnis.
4. **Content** — die eigentlichen Daten.

```tsx
// Bereits so in CmsPage.tsx / NewsPage.tsx — als Muster beibehalten:
if (isLoading) return <LoadingText message={LOADING_MESSAGES.page} />;
if (hasError)
  return <EmptyState message="Die Seite konnte nicht geladen werden." />;
if (!page) return <NotFoundPage />;
return <BlockRenderer blocks={page.blocks} />;
```

Wichtig: **"leer" und "noch nicht geladen" nie verwechseln.** Ein leeres
Array vor Abschluss des ersten Fetches darf nie als `EmptyState` gerendert
werden — deshalb steht die `isLoading`-Prüfung vor der Leer-Prüfung.

## Duplikat auflösen: `useAsyncResource`

`CmsPage`, `NewsPage` (zweimal: Overview + Detail) und `App.tsx`
implementieren denselben Ablauf manuell. Empfehlung — ein gemeinsamer Hook in
`lib/hooks/useAsyncResource.ts`:

```ts
import { useEffect, useState } from "react";

type AsyncResource<T> = {
  data: T | null;
  isLoading: boolean;
  hasError: boolean;
};

export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[],
): AsyncResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    fetcher()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, hasError };
}
```

Verwendung in `CmsPage.tsx`:

```ts
const {
  data: page,
  isLoading,
  hasError,
} = useAsyncResource(() => getPageBySlug(slug), [slug]);
```

Der Hook nimmt die `lib/queries.ts`-Funktion als Parameter entgegen, statt
sie selbst zu kennen — er bleibt dadurch generisch und gehört in `lib/`,
nicht in `components/`. **Das ist kein Store**: Er liefert bei jedem Mount
frischen State, genau wie der jetzige, manuelle Code.

## Ephemere UI-State bleibt lokal

Zustand, der bewusst beim Verlassen der Komponente verschwinden soll (z. B.
ein aufgeklapptes mobiles Menü in `Header.tsx`, `openMenuId`), bleibt
lokaler `useState` — dafür ist kein gemeinsamer Hook nötig.

## Zwei Fehlerarten unterscheiden, wenn ein Formular hinzukommt

`ContactForm.tsx` hat aktuell keinen Fehlerfall (reiner `mailto:`-Link, kein
Netzwerk-Call). Sollte künftig ein echter Form-Submit gegen Directus/eine
API hinzukommen, gilt dieselbe Unterscheidung wie im SLUI-Skill: eine
strukturierte, erwartete Ablehnung (z. B. Validierungsfehler vom Server) ist
etwas anderes als ein technischer Fehler (Netzwerk/5xx) — beide brauchen
eine eigene, spezifische Nutzermeldung statt einer generischen.
