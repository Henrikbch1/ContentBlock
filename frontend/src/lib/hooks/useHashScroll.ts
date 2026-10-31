import { useEffect } from "react";

const WAIT_MS = 5000;
const SETTLE_MS = 2000;
const USER_SCROLL_EVENTS = ["wheel", "touchstart", "keydown"] as const;

/**
 * Scrolls to `location.hash` after a client-side page change. Waits for
 * asynchronously loaded content to render the target and keeps it in place
 * while content above it is still loading, until the user scrolls.
 */
export const useHashScroll = (pathname: string): void => {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    const cleanups: Array<() => void> = [];
    const cleanup = (): void => cleanups.splice(0).forEach((fn) => fn());
    const scrollToTarget = (): boolean => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ block: "start" });
      return target !== null;
    };

    const keepInPlace = (): void => {
      const resizeObserver = new ResizeObserver(scrollToTarget);
      resizeObserver.observe(document.body);
      const timeout = window.setTimeout(cleanup, SETTLE_MS);
      USER_SCROLL_EVENTS.forEach((type) =>
        window.addEventListener(type, cleanup, { once: true, passive: true }),
      );
      cleanups.push(
        () => resizeObserver.disconnect(),
        () => window.clearTimeout(timeout),
        () =>
          USER_SCROLL_EVENTS.forEach((type) =>
            window.removeEventListener(type, cleanup),
          ),
      );
    };

    if (scrollToTarget()) {
      keepInPlace();
      return cleanup;
    }

    const observer = new MutationObserver(() => {
      if (!scrollToTarget()) return;
      observer.disconnect();
      keepInPlace();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), WAIT_MS);
    cleanups.push(
      () => observer.disconnect(),
      () => window.clearTimeout(timeout),
    );
    return cleanup;
  }, [pathname]);
};
