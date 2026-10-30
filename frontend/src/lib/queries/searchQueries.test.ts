import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  assertConfigured: vi.fn(),
  request: vi.fn(),
  readItems: vi.fn((collection: string, options: object) => ({
    collection,
    options,
  })),
}));

vi.mock("@directus/sdk", () => ({ readItems: mocks.readItems }));
vi.mock("../directus", () => ({
  assertDirectusConfigured: mocks.assertConfigured,
  directus: { request: mocks.request },
}));

import { buildVisibleEventsFilter } from "./eventQueries";
import { searchContent } from "./searchQueries";

describe("searchContent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-11T10:00:00.000Z"));
    mocks.assertConfigured.mockReset();
    mocks.request.mockReset();
    mocks.readItems.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("searches titles with bounded explicit fields and event visibility", async () => {
    mocks.request.mockResolvedValue([]);

    await searchContent("Wasser");

    expect(mocks.assertConfigured).toHaveBeenCalledOnce();
    expect(mocks.readItems).toHaveBeenCalledTimes(3);
    expect(mocks.readItems).toHaveBeenCalledWith(
      "pages",
      expect.objectContaining({
        fields: ["id", "title", "slug"],
        filter: { title: { _icontains: "Wasser" } },
        sort: "title",
        limit: 9,
      }),
    );
    expect(mocks.readItems).toHaveBeenCalledWith(
      "events",
      expect.objectContaining({
        filter: {
          _and: [
            { title: { _icontains: "Wasser" } },
            buildVisibleEventsFilter("2026-10-11T10:00:00.000Z"),
          ],
        },
      }),
    );
  });

  it("returns navigable titles, safely encoded paths and a truncation flag", async () => {
    mocks.request.mockImplementation(({ collection }: { collection: string }) =>
      Promise.resolve(
        collection === "pages"
          ? [
              { id: 1, title: "Startseite", slug: "home" },
              { id: 2, title: "Über uns", slug: "verein/über uns" },
              { id: 3, title: "Ohne Slug", slug: null },
              ...Array.from({ length: 6 }, (_, index) => ({
                id: index + 4,
                title: `Seite ${index}`,
                slug: `seite-${index}`,
              })),
            ]
          : [],
      ),
    );

    const response = await searchContent("Seite");

    expect(response.results).toHaveLength(7);
    expect(response.results[0]).toMatchObject({
      title: "Startseite",
      href: "/",
      context: "Seite",
    });
    expect(response.results[1]).toMatchObject({
      title: "Über uns",
      href: "/verein/%C3%BCber%20uns",
    });
    expect(response.hasMore).toBe(true);
    expect(response.failedCollections).toEqual([]);
  });

  it("retains successful collections and reports failed ones explicitly", async () => {
    mocks.request.mockImplementation(
      ({ collection }: { collection: string }) =>
        collection === "news"
          ? Promise.reject(new Error("Service unavailable"))
          : Promise.resolve([
              { id: collection, title: collection, slug: "treffer" },
            ]),
    );

    const response = await searchContent("treffer");

    expect(response.results.map((result) => result.href)).toEqual([
      "/treffer",
      "/termine/treffer",
    ]);
    expect(response.failedCollections).toEqual(["Nachrichten"]);
    expect(response.hasMore).toBe(false);
  });

  it("interleaves page, news and event results", async () => {
    mocks.request.mockImplementation(({ collection }: { collection: string }) =>
      Promise.resolve(
        Array.from({ length: 3 }, (_, index) => ({
          id: `${collection}-${index}`,
          title: `${collection}-${index}`,
          slug: `${collection}-${index}`,
        })),
      ),
    );

    const response = await searchContent("test");

    expect(response.results.slice(0, 6).map((item) => item.context)).toEqual([
      "Seite",
      "Nachricht",
      "Termin",
      "Seite",
      "Nachricht",
      "Termin",
    ]);
  });
});
