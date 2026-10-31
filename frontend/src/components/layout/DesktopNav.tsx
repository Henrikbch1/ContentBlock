import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SymbolIcon } from "../common/SymbolIcon";
import { NAV_LINK_CLASS, SubItems, type NavProps } from "./DesktopSubItems";
import {
  containsCurrent,
  getChildren,
  getItemId,
  getNavHref,
  isCurrentHref,
} from "./navHelpers";

const TOP_LEVEL_CLASS =
  "inline-flex min-h-12 max-w-full items-center gap-1.5 px-3 text-[1.0625rem] font-semibold text-rail-foreground transition-colors hover:bg-rail-foreground/10 data-[current=true]:font-extrabold data-[current=true]:shadow-[inset_0_-4px_0_var(--color-rail-accent)] [overflow-wrap:anywhere]";

export const DesktopNavItems = ({
  items,
  currentPath,
}: NavProps): React.JSX.Element => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const closeMenu = (): void => setOpenMenuId(null);

  return (
    <ul className="-mx-3 flex flex-wrap items-stretch">
      {getChildren(items, null).map((item) => {
        const itemId = getItemId(item);
        const children = getChildren(items, itemId);
        const href = getNavHref(item);
        const label = item.label?.trim() || "Navigation";
        const isCurrent = containsCurrent(items, item, currentPath);
        // Oberste Ebene: Icons erst ab xl, damit die einzeilige Leiste nicht umbricht.
        const icon = (
          <SymbolIcon className="hidden xl:block" name={item.icon} />
        );
        if (!children.length)
          return (
            <li className="flex" key={itemId}>
              {href ? (
                <a
                  aria-current={
                    isCurrentHref(href, currentPath) ? "page" : undefined
                  }
                  className={TOP_LEVEL_CLASS}
                  data-current={isCurrent}
                  href={href}
                >
                  {icon}
                  {label}
                </a>
              ) : (
                <span className={TOP_LEVEL_CLASS}>
                  {icon}
                  {label}
                </span>
              )}
            </li>
          );
        return (
          <li
            key={itemId}
            className="relative flex"
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
            <details className="group flex" open={openMenuId === itemId}>
              <summary
                aria-expanded={openMenuId === itemId}
                className={`cursor-pointer list-none ${TOP_LEVEL_CLASS} [&::-webkit-details-marker]:hidden`}
                data-current={isCurrent}
                onClick={(event) => {
                  event.preventDefault();
                  setOpenMenuId((currentId) =>
                    currentId === itemId ? null : itemId,
                  );
                }}
              >
                {icon}
                {label}
                <ChevronDown
                  aria-hidden="true"
                  className="transition-transform group-open:rotate-180"
                  size={18}
                />
              </summary>
              <div className="notice-sheet ctx-default absolute left-0 top-full z-20 mt-1 max-h-[min(60vh,26rem)] w-72 max-w-[90vw] overflow-x-hidden overflow-y-auto rounded-card bg-card p-2 pt-8 text-card-foreground shadow-card">
                {href && (
                  <a
                    aria-current={
                      isCurrentHref(href, currentPath) ? "page" : undefined
                    }
                    className={NAV_LINK_CLASS}
                    href={href}
                    onClick={closeMenu}
                  >
                    <SymbolIcon name={item.icon} />
                    {label}
                  </a>
                )}
                <SubItems
                  currentPath={currentPath}
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
