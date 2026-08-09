import { useEffect, useState } from "react";
import { getSite } from "./lib/queries";
import type { Site } from "./lib/types";
import { ThemeProvider } from "./components/common/ThemeProvider";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { CmsPage } from "./pages/CmsPage";
import { EventsPage } from "./pages/EventsPage";
import { NewsPage } from "./pages/NewsPage";

type ConnectionStatus = "checking" | "connected" | "failed";

const DEFAULT_ERROR_MESSAGE =
  "Die Verbindung zu Directus konnte nicht hergestellt werden.";

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;

const getPathSegments = (pathname: string): string[] =>
  pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

const RouteContent = ({ pathname }: { pathname: string }): React.JSX.Element => {
  const segments = getPathSegments(pathname);
  const [section, slug] = segments;

  if (section === "news" && segments.length === 1) {
    return <NewsPage />;
  }
  if (section === "news" && slug) {
    return <NewsPage slug={segments.slice(1).join("/")} />;
  }
  if (section === "events" && segments.length === 1) {
    return <EventsPage />;
  }
  if (section === "events" && slug) {
    return <EventsPage slug={segments.slice(1).join("/")} />;
  }
  if (segments.length === 0) {
    return <CmsPage slug="home" />;
  }

  return <CmsPage slug={segments.join("/")} />;
};

export const App = (): React.JSX.Element => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [site, setSite] = useState<Site | null>(null);
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = (): void => setPathname(window.location.pathname);
    const handleDocumentClick = (event: MouseEvent): void => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      setPathname(url.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async (): Promise<void> => {
      try {
        const loadedSite = await getSite();
        if (isMounted) {
          setSite(loadedSite);
          setConnectionStatus("connected");
        }
      } catch (error) {
        if (isMounted) {
          setConnectionStatus("failed");
          setErrorMessage(getErrorMessage(error));
        }
      }
    };

    void checkConnection();

    return () => {
      isMounted = false;
    };
  }, []);

  if (connectionStatus === "checking") {
    return (
      <main aria-live="polite" className="connection-status" role="status">
        Directus-Verbindung wird geprueft ...
      </main>
    );
  }

  if (connectionStatus === "failed") {
    return (
      <main aria-live="assertive" className="connection-status connection-status--failed" role="alert">
        <p>Directus nicht erreichbar.</p>
        <p>{errorMessage}</p>
      </main>
    );
  }

  return (
    <ThemeProvider theme={site?.theme && typeof site.theme === "object" ? site.theme : null}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header navigation={site?.navigation} />
        <main className="flex-1">
          <RouteContent pathname={pathname} />
        </main>
        <Footer footer={site?.footer} />
      </div>
    </ThemeProvider>
  );
};
