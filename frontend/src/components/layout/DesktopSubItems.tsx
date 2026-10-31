import type { NavItem } from "../../lib/types";
import { SymbolIcon } from "../common/SymbolIcon";
import {
  getChildren,
  getItemId,
  getNavHref,
  isCurrentHref,
} from "./navHelpers";

export const NAV_LINK_CLASS =
  "nav-pin flex min-h-11 items-center gap-2 rounded-card px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted aria-[current=page]:font-bold [overflow-wrap:anywhere]";

export type NavProps = Readonly<{
  items: NavItem[];
  currentPath: string;
}>;

export const SubItems = ({
  items,
  parentId,
  currentPath,
  nested = false,
  onNavigate,
}: NavProps & {
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
            <a
              aria-current={
                isCurrentHref(href, currentPath) ? "page" : undefined
              }
              className={NAV_LINK_CLASS}
              href={href}
              onClick={onNavigate}
            >
              <SymbolIcon name={item.icon} />
              {label}
            </a>
          ) : (
            <span className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-muted-foreground">
              <SymbolIcon name={item.icon} />
              {label}
            </span>
          )}
          {getChildren(items, itemId).length > 0 && (
            <SubItems
              currentPath={currentPath}
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
