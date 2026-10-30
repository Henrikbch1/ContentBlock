import type { NavItem, SearchResult } from "../../lib/types";
import { interleaveSearchResults } from "../../lib/searchResults";
import { getChildren, getItemId, getNavHref } from "./navHelpers";

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ß/g, "ss");

const isSafeHref = (href: string): boolean => {
  try {
    const url = new URL(href, window.location.href);
    if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
      return true;
    }
    console.warn(
      "Unsupported navigation link protocol; search result omitted.",
    );
    return false;
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    console.warn("Invalid navigation link; search result omitted.");
    return false;
  }
};

/** Finds reachable navigation links by label or their parent labels. */
export const searchNavigation = (
  items: NavItem[],
  query: string,
): SearchResult[] => {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const results: SearchResult[] = [];
  const visited = new Set<string>();

  const visit = (parentId: string | null, parents: string[]): void => {
    for (const item of getChildren(items, parentId)) {
      const id = getItemId(item);
      if (visited.has(id)) continue;
      visited.add(id);
      const title = item.label?.trim() || "Navigation";
      const path = [...parents, title];
      const href = getNavHref(item)?.trim();
      if (
        href &&
        words.every((word) => normalize(path.join(" ")).includes(word)) &&
        isSafeHref(href)
      ) {
        results.push({
          key: `navigation:${id}`,
          title,
          href,
          context: parents.length ? parents.join(" / ") : "Navigation",
        });
      }
      visit(id, path);
    }
  };

  visit(null, []);
  return results;
};

const canonicalHref = (href: string): string => {
  const url = new URL(href, window.location.href);
  if (url.origin === window.location.origin) {
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] === "home") segments.pop();
    if (segments[0] === "events") segments[0] = "termine";
    url.pathname = `/${segments.join("/")}`;
  }
  return url.href;
};

/** Combines results without repeating equivalent destinations. */
export const mergeSearchResults = (
  navigation: SearchResult[],
  content: SearchResult[],
): SearchResult[] => {
  const seen = new Set<string>();
  return interleaveSearchResults([navigation, content]).filter((result) => {
    const href = canonicalHref(result.href);
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
};
