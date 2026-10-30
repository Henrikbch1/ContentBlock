import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "../../lib/types";
import { getChildren, getItemId, getNavHref } from "./navHelpers";

const NAV_LINK_CLASS =
  "flex min-h-11 items-center rounded-card px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted [overflow-wrap:anywhere]";

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
      nested
        ? "mt-1 flex flex-col gap-1 border-l border-border pl-3"
        : "flex flex-col gap-1"
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
            <span className="block px-3 py-2 text-base font-semibold text-muted-foreground">
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
    <ul className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
      {getChildren(items, null).map((item) => {
        const itemId = getItemId(item);
        const children = getChildren(items, itemId);
        const href = getNavHref(item);
        const label = item.label?.trim() || "Navigation";
        const topLevelClass =
          "min-h-11 max-w-full rounded-card px-2 text-base font-semibold text-foreground transition-colors hover:text-link [overflow-wrap:anywhere]";
        if (!children.length)
          return (
            <li key={itemId}>
              {href ? (
                <a
                  className={`inline-flex items-center ${topLevelClass}`}
                  href={href}
                >
                  {label}
                </a>
              ) : (
                <span className={`inline-flex items-center ${topLevelClass}`}>
                  {label}
                </span>
              )}
            </li>
          );
        return (
          <li
            key={itemId}
            className="relative"
            onBlur={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                closeMenu();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                closeMenu();
                event.currentTarget.querySelector("summary")?.focus();
              }
            }}
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
              >
                {label}
                <ChevronDown aria-hidden="true" size={16} />
              </summary>
              <div className="absolute right-0 top-full z-20 max-h-[min(60vh,24rem)] w-72 max-w-[90vw] overflow-x-hidden overflow-y-auto rounded-card border border-border bg-card p-2 shadow-card">
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
