import type { NavItem } from "../../lib/types";
import {
  getChildren,
  getItemId,
  getNavHref,
  isCurrentHref,
} from "./navHelpers";

const LINK_CLASS =
  "nav-pin nav-pin--rail inline-flex min-h-12 w-full items-center py-2 pl-3 text-[1.0625rem] font-semibold text-rail-foreground hover:bg-rail-foreground/10 aria-[current=page]:font-extrabold";

export const MobileNavItems = ({
  items,
  currentPath = "/",
  parentId = null,
  onClose,
}: Readonly<{
  items: NavItem[];
  currentPath?: string;
  parentId?: string | null;
  onClose?: () => void;
}>): React.JSX.Element => (
  <ul
    className={
      parentId
        ? "mb-2 ml-3 flex flex-col border-l border-rail-edge/50 pl-2"
        : "flex flex-col divide-y divide-rail-edge/30"
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
              aria-current={
                isCurrentHref(href, currentPath) ? "page" : undefined
              }
              className={LINK_CLASS}
              href={href}
              onClick={onClose}
            >
              {label}
            </a>
          ) : (
            <span className="notice-label inline-flex min-h-11 items-center pl-4 pt-3 text-rail-foreground/80">
              {label}
            </span>
          )}
          {children.length > 0 && (
            <MobileNavItems
              currentPath={currentPath}
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
