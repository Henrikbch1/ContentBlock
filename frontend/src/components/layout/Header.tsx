import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { DirectusAsset, DirectusRelation, NavItem, Navigation, Page } from "../../lib/types";

type HeaderProps = {
  navigation?: DirectusRelation<Navigation>;
};

const getRelation = <T,>(relation: DirectusRelation<T> | undefined): T | null =>
  relation && typeof relation === "object" ? relation : null;

const getAssetId = (asset: DirectusAsset | undefined): string | null => {
  if (typeof asset === "string" || typeof asset === "number") {
    return String(asset);
  }
  return asset && typeof asset === "object" ? String(asset.id) : null;
};

const getPageHref = (page: DirectusRelation<Page> | undefined): string | null => {
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
  return parent && typeof parent === "object" ? String(parent.id) : parent ? String(parent) : null;
};

const getChildren = (items: NavItem[], parentId: string | null): NavItem[] =>
  items
    .filter((item) => getParentId(item) === parentId)
    .sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0));

const NavItems = ({ items, parentId = null }: { items: NavItem[]; parentId?: string | null }): React.JSX.Element => (
  <ul className={parentId ? "space-y-2 pl-4" : "flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6"}>
    {getChildren(items, parentId).map((item) => {
      const children = getChildren(items, getItemId(item));
      const href = getNavHref(item);
      const label = item.label?.trim() || "Navigation";

      return (
        <li key={getItemId(item)}>
          {href ? (
            <a className="text-sm font-medium text-foreground transition-opacity hover:opacity-65" href={href}>
              {label}
            </a>
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">{label}</span>
          )}
          {children.length > 0 && <NavItems items={items} parentId={getItemId(item)} />}
        </li>
      );
    })}
  </ul>
);

export const Header = ({ navigation }: HeaderProps): React.JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationData = getRelation(navigation);
  const items = navigationData?.items ?? [];
  const logoId = getAssetId(navigationData?.logo);
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL;
  const logoUrl = logoId && directusUrl ? `${directusUrl}/assets/${logoId}` : null;

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a className="shrink-0 text-lg font-bold tracking-tight text-foreground" href="/">
          {logoUrl ? <img alt="ContentBlock" className="max-h-10 max-w-48 object-contain" decoding="async" src={logoUrl} /> : "ContentBlock"}
        </a>
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Navigation schliessen" : "Navigation oeffnen"}
          className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <NavItems items={items} />
        </nav>
      </div>
      {isMenuOpen && (
        <nav aria-label="Mobile Hauptnavigation" className="border-t border-border px-4 py-4 lg:hidden">
          <NavItems items={items} />
        </nav>
      )}
    </header>
  );
};