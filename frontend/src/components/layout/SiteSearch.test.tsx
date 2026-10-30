import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useContentSearch } from "../../lib/hooks/useContentSearch";
import type { NavItem, SearchResult } from "../../lib/types";
import { SiteSearch } from "./SiteSearch";

vi.mock("../../lib/hooks/useContentSearch", () => ({
  useContentSearch: vi.fn(),
}));

const navigation: NavItem[] = [
  { id: 1, label: "Startseite", type: "page", page: { id: 1, slug: "home" } },
];

const page = (key: string, href: string): SearchResult => ({
  key,
  href,
  title: key,
  context: "Seite",
});

describe("SiteSearch", () => {
  beforeEach(() => {
    vi.mocked(useContentSearch).mockReturnValue({
      results: [],
      hasMore: false,
      failedCollections: [],
      isLoading: false,
      hasError: false,
    });
  });

  it("opens from the labelled search field and supports Escape and Enter", () => {
    render(<SiteSearch items={navigation} />);
    const input = screen.getByRole("searchbox", { name: "Suche" });
    fireEvent.focus(input);
    expect(screen.getByText("Mindestens zwei Zeichen eingeben.")).toBeVisible();
    fireEvent.change(input, { target: { value: "Start" } });

    const link = screen.getByRole("link", { name: /Startseite/ });
    fireEvent.submit(screen.getByRole("search"));
    expect(link).toHaveFocus();
    fireEvent.keyDown(link, { key: "Escape" });
    expect(input).toHaveFocus();
    expect(
      screen.queryByRole("link", { name: /Startseite/ }),
    ).not.toBeInTheDocument();
  });

  it("reports partial failures while showing results from other sources", () => {
    vi.mocked(useContentSearch).mockReturnValue({
      results: [page("Wasser", "/wasser")],
      hasMore: false,
      failedCollections: ["Nachrichten"],
      isLoading: false,
      hasError: false,
    });
    render(<SiteSearch items={[]} />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Wasser" },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Nicht durchsucht: Nachrichten",
    );
    expect(screen.getByRole("link", { name: /Wasser/ })).toHaveAttribute(
      "href",
      "/wasser",
    );
    expect(
      screen.queryByText("Keine passenden Einträge gefunden."),
    ).not.toBeInTheDocument();
  });

  it("deduplicates equivalent destinations and caps displayed results", () => {
    vi.mocked(useContentSearch).mockReturnValue({
      results: [
        page("Startseite", "/"),
        ...Array.from({ length: 10 }, (_, index) =>
          page(`Start ${index}`, `/start-${index}`),
        ),
      ],
      hasMore: false,
      failedCollections: [],
      isLoading: false,
      hasError: false,
    });
    render(<SiteSearch items={navigation} />);
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Start" },
    });

    expect(
      within(screen.getByRole("search")).getAllByRole("link"),
    ).toHaveLength(10);
    expect(screen.getAllByText("Startseite")).toHaveLength(1);
    expect(screen.getByText(/Weitere Treffer vorhanden/)).toBeVisible();
  });
});
