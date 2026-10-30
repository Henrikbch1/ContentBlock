import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getPageBySlug: vi.fn() }));

vi.mock("../lib/queries", () => ({ getPageBySlug: mocks.getPageBySlug }));

import { CmsPage } from "./CmsPage";

describe("CmsPage", () => {
  beforeEach(() => {
    mocks.getPageBySlug.mockReset();
  });

  it("gives pages without a leading hero a single page title", async () => {
    mocks.getPageBySlug.mockResolvedValue({
      id: 1,
      title: "Mitgliedschaft",
      blocks: [
        {
          id: 1,
          sort: 1,
          collection: "block_text",
          item: { id: 1, headline: "Mitglied werden", content: "<p>Text</p>" },
        },
      ],
    });

    render(<CmsPage slug="mitgliedschaft" />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Mitgliedschaft" }),
    ).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("does not repeat the page title in a leading text headline", async () => {
    mocks.getPageBySlug.mockResolvedValue({
      id: 1,
      title: "Kontakt",
      blocks: [
        {
          id: 1,
          sort: 1,
          collection: "block_text",
          item: { id: 1, headline: " kontakt ", content: "<p>Vorstand</p>" },
        },
        {
          id: 2,
          sort: 2,
          collection: "block_text",
          item: { id: 2, headline: "Kontakt", content: "<p>Später</p>" },
        },
      ],
    });

    render(<CmsPage slug="kontakt" />);

    expect(
      await screen.findByRole("heading", { level: 1, name: "Kontakt" }),
    ).toBeVisible();
    expect(screen.getByText("Vorstand")).toBeVisible();
    expect(screen.getAllByRole("heading", { name: /kontakt/i })).toHaveLength(
      2,
    );
  });

  it("lets a leading hero provide the only page title", async () => {
    mocks.getPageBySlug.mockResolvedValue({
      id: 1,
      title: "Startseite",
      blocks: [
        {
          id: 2,
          sort: 2,
          collection: "block_text",
          item: { id: 2, headline: "Willkommen", content: "<p>Text</p>" },
        },
        {
          id: 1,
          sort: 1,
          collection: "block_hero",
          item: { id: 1, title: "Am Wasser zuhause." },
        },
      ],
    });

    render(<CmsPage slug="home" />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Am Wasser zuhause.",
      }),
    ).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
