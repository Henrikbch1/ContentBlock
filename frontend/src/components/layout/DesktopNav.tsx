import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "../../lib/types";
import { getChildren, getItemId, getNavHref } from "./navHelpers";

const NAV_LINK_CLASS =
  "block rounded-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted";

const SubItems = ({
  items,
  parentId,
  nested = false,
  onNavigate,
}: {
  items: NavItem[];
  parentId: string;
  nested?: boolean;
  onNavigate: () => void;
}): React.JSX.Element => (
  <ul
    className={
      nested ? "mt-1 space-y-1 border-l border-border pl-3" : "space-y-1"
    }
  >
    {getChildren(items, parentId).map((item) => {
      const itemId = getItemId(item);
      const href = getNavHref(item);
      const label = item.label?.trim() || "Navigation";
      return (
        <li key={itemId}>
          {href ? (
            <a className={NAV_LINK_CLASS} href={href} onClick={onNavigate}>
              {label}
            </a>
          ) : (
            <span className="block px-3 py-2 text-sm font-semibold text-muted-foreground">
              {label}
            </span>
          )}
          {getChildren(items, itemId).length > 0 && (
            <SubItems
              items={items}
              nested
              onNavigate={onNavigate}
              parentId={itemId}
            />
          )}
        </li>
      );
    })}
  </ul>
);

export const DesktopNavItems = ({
  items,
}: {
  items: NavItem[];
}): React.JSX.Element => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const closeMenu = (): void => setOpenMenuId(null);

  return (
    <ul className="flex items-center gap-7">
      {getChildren(items, null).map((item) => {
        const itemId = getItemId(item);
        const children = getChildren(items, itemId);
        const href = getNavHref(item);
        const label = item.label?.trim() || "Navigation";
        const topLevelClass =
          "text-sm font-semibold text-foreground transition-colors hover:text-link";
        if (!children.length)
          return (
            <li key={itemId}>
              {href ? (
                <a className={topLevelClass} href={href}>
                  {label}
                </a>
              ) : (
                <span className={topLevelClass}>{label}</span>
              )}
            </li>
          );
        return (
          <li
            key={itemId}
            className="relative"
            onKeyDown={(event) => {
              if (event.key === "Escape") closeMenu();
            }}
            onMouseEnter={() => setOpenMenuId(itemId)}
            onMouseLeave={closeMenu}
          >
            <details className="group" open={openMenuId === itemId}>
              <summary
                aria-expanded={openMenuId === itemId}
                className={`flex cursor-pointer list-none items-center gap-1 ${topLevelClass} [&::-webkit-details-marker]:hidden`}
                onClick={(event) => {
                  event.preventDefault();
                  setOpenMenuId((currentId) =>
                    currentId === itemId ? null : itemId,
                  );
                }}
                onFocus={() => setOpenMenuId(itemId)}
              >
                {label}
                <ChevronDown aria-hidden="true" size={16} />
              </summary>
              <div className="absolute right-0 top-full z-20 min-w-56 rounded-card border border-border bg-card p-2 shadow-card">
                {href && (
                  <a className={NAV_LINK_CLASS} href={href} onClick={closeMenu}>
                    {label}
                  </a>
                )}
                <SubItems
                  items={items}
                  onNavigate={closeMenu}
                  parentId={itemId}
                />
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
};
