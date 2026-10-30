import { describe, expect, it, vi } from "vitest";

import type { NavItem, SearchResult } from "../../lib/types";
import { mergeSearchResults, searchNavigation } from "./navSearch";

describe("searchNavigation", () => {
  it("matches reachable labels and their parents without accents or case", () => {
    const items: NavItem[] = [
      { id: "club", label: "Über den Verein", type: "group" },
      {
        id: "waters",
        parent: "club",
        label: "Gewässer",
        type: "page",
        page: { id: 1, slug: "gewaesser" },
      },
      {
        id: "orphan",
        parent: "missing",
        label: "Gewässer",
        type: "page",
        page: { id: 2, slug: "orphan" },
      },
    ];

    expect(searchNavigation(items, "UBER gewasser")).toEqual([
      {
        key: "navigation:waters",
        title: "Gewässer",
        href: "/gewaesser",
        context: "Über den Verein",
      },
    ]);
  });

  it("rejects unsafe link protocols and reports the invalid entry", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      expect(
        searchNavigation(
          [
            {
              id: 1,
              label: "Kontakt",
              type: "url",
              external_url: "javascript:alert(1)",
            },
          ],
          "kontakt",
        ),
      ).toEqual([]);
      expect(warn).toHaveBeenCalledOnce();
    } finally {
      warn.mockRestore();
    }
  });
});

describe("mergeSearchResults", () => {
  const result = (key: string, href: string): SearchResult => ({
    key,
    href,
    title: key,
    context: "Navigation",
  });

  it("keeps the first result for equivalent internal destinations", () => {
    const navigation = [
      result("home", "/home"),
      result("event", "/events/verein"),
      result("outside", "https://example.org/"),
    ];
    const content = [
      result("home-page", "/"),
      result("event-page", "/termine/verein/"),
      result("other-page", "/verein"),
    ];

    expect(
      mergeSearchResults(navigation, content).map((item) => item.key),
    ).toEqual(["home", "event", "outside", "other-page"]);
  });

  it("interleaves navigation and content instead of hiding one source", () => {
    const navigation = Array.from({ length: 12 }, (_, index) =>
      result(`navigation-${index}`, `/navigation-${index}`),
    );
    const content = [
      result("page", "/page"),
      result("news", "/news/article"),
      result("event", "/termine/event"),
    ];

    expect(
      mergeSearchResults(navigation, content)
        .slice(0, 6)
        .map((item) => item.key),
    ).toEqual([
      "navigation-0",
      "page",
      "navigation-1",
      "news",
      "navigation-2",
      "event",
    ]);
  });
});
