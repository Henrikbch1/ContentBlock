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
