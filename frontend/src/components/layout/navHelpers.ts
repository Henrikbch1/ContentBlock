import { getRelation, getRelationId } from "../../lib/directusRelations";
import type { DirectusRelation, NavItem, Page } from "../../lib/types";

const getPageHref = (
  page: DirectusRelation<Page> | undefined,
): string | null => {
  const pageData = getRelation(page);
  return pageData?.slug ? `/${pageData.slug}` : null;
};

export const getNavHref = (item: NavItem): string | null => {
  if (item.type === "url") {
    return item.external_url ?? null;
  }
  return getPageHref(item.page);
};

export const getItemId = (item: NavItem): string => String(item.id);

const getParentId = (item: NavItem): string | null => {
  const parentId = getRelationId(item.parent);
  return parentId === null ? null : String(parentId);
};

export const getChildren = (
  items: NavItem[],
  parentId: string | null,
): NavItem[] =>
  items
    .filter((item) => getParentId(item) === parentId)
    .sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0));

const decodePath = (path: string): string => {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
};

const normalizePath = (path: string): string => {
  const trimmed = decodePath(path).replace(/\/+$/, "") || "/";
  return trimmed === "/home" ? "/" : trimmed;
};

/** Reports whether a navigation target is the page currently shown. */
export const isCurrentHref = (
  href: string | null,
  currentPath: string,
): boolean =>
  href !== null &&
  href.startsWith("/") &&
  normalizePath(href) === normalizePath(currentPath);

/** Reports whether an item or any of its descendants is the current page. */
export const containsCurrent = (
  items: NavItem[],
  item: NavItem,
  currentPath: string,
): boolean =>
  isCurrentHref(getNavHref(item), currentPath) ||
  getChildren(items, getItemId(item)).some((child) =>
    containsCurrent(items, child, currentPath),
  );
