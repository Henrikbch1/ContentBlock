import { useEffect } from "react";

/** Setzt document.title; ohne Wert (z. B. Daten noch nicht geladen) bleibt der Titel unverändert. */
export function usePageTitle(title: string | null | undefined): void {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
}
