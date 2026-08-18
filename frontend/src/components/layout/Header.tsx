import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import type {
  DirectusAsset,
  DirectusRelation,
  NavItem,
  Navigation,
  Page,
} from "../../lib/types";

type HeaderProps = {
  navigation?: DirectusRelation<Navigation>;
};

const getRelation = <T,>(
  relation: DirectusRelation<T> | undefined,
): T | null => (relation && typeof relation === "object" ? relation : null);

const getAssetId = (asset: DirectusAsset | undefined): string | null => {
  if (typeof asset === "string" || typeof asset === "number") {
    return String(asset);
  }
  return asset && typeof asset === "object" ? String(asset.id) : null;
};

const getPageHref = (
  page: DirectusRelation<Page> | undefined,
): string | null => {
  const pageData = getRelation(page);
  return pageData?.slug ? `/${pageData.slug}` : null;
};

const getNavHref = (item: NavItem): string | null => {
  if (item.type === "url") {
    return item.external_url ?? null;
  }
  return getPageHref(item.page);
};

const getItemId = (item: NavItem): string => String(item.id);

const getParentId = (item: NavItem): string | null => {
  const parent = item.parent;
  return parent && typeof parent === "object"
    ? String(parent.id)
    : parent
      ? String(parent)
      : null;
};

const getChildren = (items: NavItem[], parentId: string | null): NavItem[] =>
  items
    .filter((item) => getParentId(item) === parentId)
    .sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0));

const MobileNavItems = ({
  items,
  parentId = null,
  onClose,
}: {
  items: NavItem[];
  parentId?: string | null;
  onClose?: () => void;
}): React.JSX.Element => (
  <ul
    className={
      parentId ? "mt-2 space-y-2 border-l border-border pl-4" : "space-y-4"
    }
  >
    {getChildren(items, parentId).map((item) => {
      const children = getChildren(items, getItemId(item));
      const href = getNavHref(item);
      const label = item.label?.trim() || "Navigation";
      return (
        <li key={getItemId(item)}>
          {href ? (
            <a
              className="text-sm font-semibold text-foreground hover:text-primary"
              href={href}
              onClick={onClose}
            >
              {label}
            </a>
          ) : (
            <span className="text-sm font-semibold text-foreground">
              {label}
            </span>
          )}
          {children.length > 0 && (
            <MobileNavItems
              items={items}
              onClose={onClose}
              parentId={getItemId(item)}
            />
          )}
        </li>
      );
    })}
  </ul>
);

const DesktopNavItems = ({
  items,
}: {
  items: NavItem[];
}): React.JSX.Element => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <ul className="flex items-center gap-7">
      {getChildren(items, null).map((item) => {
        const children = getChildren(items, getItemId(item));
        const href = getNavHref(item);
        const label = item.label?.trim() || "Navigation";
        const itemId = getItemId(item);
        if (!children.length)
          return (
            <li key={itemId}>
              <a
                className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                href={href ?? "#"}
              >
                {label}
              </a>
            </li>
          );
        return (
          <li
            key={itemId}
            className="relative"
            onMouseEnter={() => setOpenMenuId(itemId)}
            onMouseLeave={() => setOpenMenuId(null)}
          >
            <details className="group" open={openMenuId === itemId}>
              <summary
                aria-expanded={openMenuId === itemId}
                className="flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden"
                onClick={() =>
                  setOpenMenuId((currentId) =>
                    currentId === itemId ? null : itemId,
                  )
                }
                onFocus={() => setOpenMenuId(itemId)}
              >
                {label}
                <ChevronDown aria-hidden="true" size={16} />
              </summary>
              <ul className="absolute right-0 top-full z-20 min-w-56 border border-border bg-card p-2 shadow-lg">
                {children.map((child) => (
                  <li key={getItemId(child)}>
                    <a
                      className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      href={getNavHref(child) ?? "#"}
                      onClick={() => setOpenMenuId(null)}
                    >
                      {child.label?.trim() || "Navigation"}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        );
      })}
    </ul>
  );
};

export const Header = ({ navigation }: HeaderProps): React.JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationData = getRelation(navigation);
  const items = navigationData?.items ?? [];
  const logoId = getAssetId(navigationData?.logo);
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL;
  const logoUrl =
    logoId && directusUrl ? `${directusUrl}/assets/${logoId}` : null;
  const brandText = navigationData?.brand_text?.trim() || null;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
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
          className="inline-flex size-10 items-center justify-center border border-border text-foreground lg:hidden"
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
      </div>
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
