import { Menu, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { getAssetUrl } from "../../lib/directus";
import { getRelation } from "../../lib/directusRelations";
import type { DirectusRelation, Navigation } from "../../lib/types";
import { DesktopNavItems } from "./DesktopNav";
import { Container } from "./Container";
import { MobileNavItems } from "./MobileNav";
import { SiteSearch } from "./SiteSearch";

type HeaderProps = {
  navigation?: DirectusRelation<Navigation>;
};

export const Header = ({ navigation }: HeaderProps): React.JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationId = useId();
  const navigationData = getRelation(navigation);
  const items = navigationData?.items ?? [];
  const logoUrl = getAssetUrl(navigationData?.logo);
  const brandText = navigationData?.brand_text?.trim() || null;

  return (
    <header
      className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isMenuOpen) {
          event.preventDefault();
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
        <a
          className="flex min-w-0 flex-1 items-center gap-3 text-foreground lg:flex-none"
          href="/"
        >
          {logoUrl ? (
            <>
              <img
                alt={brandText ? "" : "Startseite"}
                className="max-h-12 max-w-28 object-contain sm:max-w-48"
                decoding="async"
                src={logoUrl}
              />
              {brandText && (
                <span className="min-w-0 font-heading text-lg font-semibold [overflow-wrap:anywhere] sm:text-xl">
                  {brandText}
                </span>
              )}
            </>
          ) : (
            <span className="min-w-0 font-heading text-lg font-semibold [overflow-wrap:anywhere] sm:text-xl">
              {brandText || "ContentBlock"}
            </span>
          )}
        </a>
        <nav
          aria-label="Hauptnavigation"
          className="hidden min-w-0 lg:block lg:flex-1"
        >
          <DesktopNavItems items={items} />
        </nav>
        <button
          aria-controls={mobileNavigationId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Navigation schließen" : "Navigation öffnen"}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card border border-input px-3 font-semibold text-foreground lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {isMenuOpen ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
          <span>Menü</span>
        </button>
        <SiteSearch items={items} />
      </Container>
      <nav
        aria-label="Mobile Hauptnavigation"
        className="max-h-[60vh] overflow-y-auto border-t border-border bg-background px-4 py-5 lg:hidden"
        hidden={!isMenuOpen}
        id={mobileNavigationId}
      >
        {isMenuOpen && (
          <MobileNavItems items={items} onClose={() => setIsMenuOpen(false)} />
        )}
      </nav>
    </header>
  );
};
