import type { NavItem } from "../../lib/types";
import { getChildren, getItemId, getNavHref } from "./navHelpers";

export const MobileNavItems = ({
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
