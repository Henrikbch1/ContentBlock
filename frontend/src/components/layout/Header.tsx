import { Menu, X } from "lucide-react";
import { useState } from "react";
import { getAssetUrl } from "../../lib/directus";
import { getRelation } from "../../lib/directusRelations";
import type { DirectusRelation, Navigation } from "../../lib/types";
import { DesktopNavItems } from "./DesktopNav";
import { Container } from "./Container";
import { MobileNavItems } from "./MobileNav";

type HeaderProps = {
  navigation?: DirectusRelation<Navigation>;
};

export const Header = ({ navigation }: HeaderProps): React.JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationData = getRelation(navigation);
  const items = navigationData?.items ?? [];
  const logoUrl = getAssetUrl(navigationData?.logo);
  const brandText = navigationData?.brand_text?.trim() || null;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex items-center justify-between py-3">
        <a
          className="flex shrink-0 items-center gap-3 text-foreground"
          href="/"
        >
          {logoUrl ? (
            <>
              <img
                alt="Website-Logo"
                className="max-h-12 max-w-48 scale-125 object-contain"
                decoding="async"
                src={logoUrl}
              />
              {brandText && (
                <span className="font-heading text-lg font-semibold sm:text-xl">
                  {brandText}
                </span>
              )}
            </>
          ) : (
            <span className="font-heading text-xl font-semibold">
              ContentBlock
            </span>
          )}
        </a>
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Navigation schließen" : "Navigation öffnen"}
          className="inline-flex size-10 items-center justify-center rounded-card border border-input text-foreground lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
        </button>
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <DesktopNavItems items={items} />
        </nav>
      </Container>
      {isMenuOpen && (
        <nav
          aria-label="Mobile Hauptnavigation"
          className="border-t border-border bg-background px-4 py-5 lg:hidden"
        >
          <MobileNavItems items={items} onClose={() => setIsMenuOpen(false)} />
        </nav>
      )}
    </header>
  );
};
