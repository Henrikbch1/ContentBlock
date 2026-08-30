import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "../../lib/types";
import { getChildren, getItemId, getNavHref } from "./navHelpers";

export const DesktopNavItems = ({
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
