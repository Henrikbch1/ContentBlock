import { describe, expect, it } from "vitest";

import type { NavItem } from "../../lib/types";
import { getChildren, getItemId, getNavHref } from "./navHelpers";

describe("getNavHref", () => {
  it("returns the external url for url items", () => {
    expect(
      getNavHref({ id: 1, type: "url", external_url: "https://a.de" }),
    ).toBe("https://a.de");
  });

  it("returns null for url items without external url", () => {
    expect(getNavHref({ id: 1, type: "url" })).toBeNull();
  });

  it("builds the path from an expanded page relation", () => {
    expect(
      getNavHref({ id: 1, type: "page", page: { id: 5, slug: "verein" } }),
    ).toBe("/verein");
  });

  it("returns null when the page is only an id or has no slug", () => {
    expect(getNavHref({ id: 1, type: "page", page: 5 })).toBeNull();
    expect(getNavHref({ id: 1, type: "page", page: { id: 5 } })).toBeNull();
    expect(getNavHref({ id: 1, type: "page" })).toBeNull();
  });
});

describe("getItemId", () => {
  it("stringifies numeric and string ids", () => {
    expect(getItemId({ id: 12 })).toBe("12");
    expect(getItemId({ id: "abc" })).toBe("abc");
  });
});

describe("getChildren", () => {
  const items: NavItem[] = [
    { id: "b", sort: 2 },
    { id: "a", sort: 1 },
    { id: "c", parent: "a", sort: 2 },
    { id: "d", parent: { id: "a" }, sort: 1 },
    { id: "e", parent: "b" },
  ];

  it("returns top-level items sorted by sort", () => {
    expect(getChildren(items, null).map(getItemId)).toEqual(["a", "b"]);
  });

  it("matches parents given as id or expanded object", () => {
    expect(getChildren(items, "a").map(getItemId)).toEqual(["d", "c"]);
  });

  it("returns an empty list when there are no children", () => {
    expect(getChildren(items, "zzz")).toEqual([]);
  });

  it("treats a missing sort as 0 and does not mutate the input", () => {
    const input: NavItem[] = [{ id: "x", sort: 3 }, { id: "y" }];
    expect(getChildren(input, null).map(getItemId)).toEqual(["y", "x"]);
    expect(input.map(getItemId)).toEqual(["x", "y"]);
  });
});
