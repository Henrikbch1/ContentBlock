import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { getDocumentsForBlock } from "./documentQueries";

describe("getDocumentsForBlock", () => {
  beforeEach(() => {
    mocks.assertConfigured.mockReset();
    mocks.request.mockReset();
    mocks.readItems.mockClear();
  });

  it("uses document IDs from junctions and preserves editorial order", async () => {
    const color = { id: "document-color", title: "Antrag – Farbe" };
    const monochrome = {
      id: "document-monochrome",
      title: "Antrag – Schwarz-Weiß",
    };
    mocks.request.mockResolvedValue([monochrome, color]);

    const result = await getDocumentsForBlock({
      id: "block",
      mode: "manual",
      docs: [
        { id: "junction-2", sort: 2, document: "document-monochrome" },
        { id: "junction-1", sort: 1, document: { id: "document-color" } },
        { id: "junction-3", sort: 3, document: "document-color" },
        null,
      ],
    });

    expect(mocks.assertConfigured).toHaveBeenCalledOnce();
    expect(mocks.readItems).toHaveBeenCalledWith(
      "documents",
      expect.objectContaining({
        fields: expect.arrayContaining([
          "file_monochrome.id",
          "file_monochrome.filename_download",
        ]),
      }),
    );
    expect(mocks.readItems).toHaveBeenCalledWith(
      "documents",
      expect.objectContaining({
        filter: {
          id: { _in: ["document-color", "document-monochrome"] },
        },
      }),
    );
    expect(result).toEqual([color, monochrome]);
  });

  it("does not fetch an empty manual selection", async () => {
    await expect(
      getDocumentsForBlock({ id: "block", mode: "manual", docs: [] }),
    ).resolves.toEqual([]);
    expect(mocks.request).not.toHaveBeenCalled();
  });

  it("reports unexpanded junctions instead of treating their IDs as documents", async () => {
    await expect(
      getDocumentsForBlock({
        id: "block",
        mode: "manual",
        docs: ["junction-id"],
      }),
    ).rejects.toThrow("Selected document links must be expanded");
    expect(mocks.request).not.toHaveBeenCalled();
  });

  it("reports junctions without a document", async () => {
    await expect(
      getDocumentsForBlock({
        id: "block",
        mode: "manual",
        docs: [{ id: "junction-id", document: null }],
      }),
    ).rejects.toThrow("A selected document link has no document");
    expect(mocks.request).not.toHaveBeenCalled();
  });

  it("reports selected documents missing from the response", async () => {
    mocks.request.mockResolvedValue([{ id: "document-color" }]);

    await expect(
      getDocumentsForBlock({
        id: "block",
        mode: "manual",
        docs: [
          { id: "first", document: "document-color" },
          { id: "second", document: "document-monochrome" },
        ],
      }),
    ).rejects.toThrow("Some selected documents could not be loaded");
  });

  it("keeps category filtering independent of unused manual relations", async () => {
    const documents = [{ id: "category-document" }];
    mocks.request.mockResolvedValue(documents);

    await expect(
      getDocumentsForBlock({
        id: "block",
        mode: "by_category",
        filter_category: { id: "category" },
        docs: ["unexpanded-unused-junction"],
      }),
    ).resolves.toEqual(documents);
    expect(mocks.readItems).toHaveBeenCalledWith(
      "documents",
      expect.objectContaining({
        filter: { category: { _eq: "category" } },
      }),
    );
  });

  it("keeps the existing unfiltered mode and response order", async () => {
    const documents = [{ id: "second" }, { id: "first" }];
    mocks.request.mockResolvedValue(documents);

    await expect(
      getDocumentsForBlock({ id: "block", mode: "latest" }),
    ).resolves.toEqual(documents);
    expect(mocks.readItems).toHaveBeenCalledWith(
      "documents",
      expect.objectContaining({ filter: undefined }),
    );
  });

  it("propagates Directus errors", async () => {
    mocks.request.mockRejectedValue(new Error("Directus unavailable"));

    await expect(
      getDocumentsForBlock({ id: "block", mode: "latest" }),
    ).rejects.toThrow("Directus unavailable");
  });
});
