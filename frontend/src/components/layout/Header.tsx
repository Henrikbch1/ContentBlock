import { Menu, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { getAssetUrl } from "../../lib/directus";
import { getRelation } from "../../lib/directusRelations";
import type { DirectusRelation, Navigation } from "../../lib/types";
import { sharpSAttribute } from "../common/displayTitle";
import { DesktopNavItems } from "./DesktopNav";
import { Container } from "./Container";
import { MobileNavItems } from "./MobileNav";
import { SiteSearch } from "./SiteSearch";

type HeaderProps = Readonly<{
  navigation?: DirectusRelation<Navigation>;
  currentPath?: string;
}>;

const BRAND_TEXT_CLASS =
  "display-title min-w-0 text-[1.375rem] [overflow-wrap:anywhere] sm:text-[1.625rem]";

export const Header = ({
  navigation,
  currentPath = "/",
}: HeaderProps): React.JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationId = useId();
  const navigationData = getRelation(navigation);
  const items = navigationData?.items ?? [];
  const logoUrl = getAssetUrl(navigationData?.logo);
  const brandText = navigationData?.brand_text?.trim() || null;

  return (
    <header
      className="relative z-30 border-b-4 border-rail-edge bg-rail text-rail-foreground lg:sticky lg:top-0"
      data-background="inverse"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isMenuOpen) {
          event.preventDefault();
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <a
          className="flex min-w-0 flex-1 items-center gap-3 text-rail-foreground no-underline"
          href="/"
        >
          {logoUrl && (
            <img
              alt={brandText ? "" : "Startseite"}
              className="max-h-12 max-w-24 shrink-0 object-contain sm:max-w-40"
              decoding="async"
              src={logoUrl}
            />
          )}
          {(brandText || !logoUrl) && (
            <span
              className={BRAND_TEXT_CLASS}
              {...sharpSAttribute(brandText ?? "")}
            >
              {brandText || "ContentBlock"}
            </span>
          )}
        </a>
        <button
          aria-controls={mobileNavigationId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Navigation schließen" : "Navigation öffnen"}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-card border border-rail-edge px-3 font-semibold text-rail-foreground lg:hidden"
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
        <div className="w-full lg:w-80 lg:shrink-0">
          <SiteSearch items={items} />
        </div>
      </Container>
      <div className="hidden border-t border-rail-edge/40 lg:block">
        <Container>
          <nav aria-label="Hauptnavigation">
            <DesktopNavItems currentPath={currentPath} items={items} />
          </nav>
        </Container>
      </div>
      <nav
        aria-label="Mobile Hauptnavigation"
        className="max-h-[65vh] overflow-y-auto border-t border-rail-edge/40 px-4 py-4 lg:hidden"
        hidden={!isMenuOpen}
        id={mobileNavigationId}
      >
        {isMenuOpen && (
          <MobileNavItems
            currentPath={currentPath}
            items={items}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
    </header>
  );
};
