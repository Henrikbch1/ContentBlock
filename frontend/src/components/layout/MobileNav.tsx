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
      parentId
        ? "mt-2 flex flex-col gap-1 border-l border-border pl-4"
        : "flex flex-col gap-1"
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
              className="inline-flex min-h-11 w-full items-center rounded-card py-2 text-base font-semibold text-foreground hover:text-link"
              href={href}
              onClick={onClose}
            >
              {label}
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center py-2 text-base font-semibold text-foreground">
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
