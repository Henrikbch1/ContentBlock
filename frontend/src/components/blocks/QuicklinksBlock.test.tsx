import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { QuicklinkItem } from "../../lib/types";
import { QuicklinksBlock } from "./QuicklinksBlock";

const renderBlock = (items: QuicklinkItem[], title?: string) =>
  render(<QuicklinksBlock item={{ id: 1, title, items }} />);

describe("QuicklinksBlock", () => {
  it("links internal pages to /slug and shows icon, label and text", () => {
    const { container } = renderBlock(
      [
        {
          id: 1,
          label: "Gastkarten",
          icon: "gastkarte",
          text: "Tageskarte online",
          page: { id: 5, slug: "gastkarten" },
        },
      ],
      "Schnellzugriff",
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Schnellzugriff" }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Gastkarten/ });
    expect(link).toHaveAttribute("href", "/gastkarten");
    expect(link).not.toHaveAttribute("target");
    expect(within(link).getByText("Tageskarte online")).toBeInTheDocument();
    expect(container.querySelector("a svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("opens external urls in a new tab with rel and an accessible hint", () => {
    renderBlock([
      { id: 1, label: "Landesverband", external_url: "https://example.org/x" },
    ]);

    const link = screen.getByRole("link", { name: /Landesverband/ });
    expect(link).toHaveAttribute("href", "https://example.org/x");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveTextContent("öffnet in neuem Tab");
  });

  it("keeps mailto links in the same tab", () => {
    renderBlock([
      { id: 1, label: "Mail", external_url: "mailto:info@example.org" },
    ]);

    const link = screen.getByRole("link", { name: "Mail" });
    expect(link).toHaveAttribute("href", "mailto:info@example.org");
    expect(link).not.toHaveAttribute("target");
  });

  it("does not render entries without a usable target or label", () => {
    renderBlock([
      { id: 1, label: "Ohne Ziel" },
      { id: 2, label: "Unsicher", external_url: "javascript:alert(1)" },
      { id: 3, label: "Leere Seite", page: { id: 9, slug: " " } },
      { id: 4, label: "  ", page: { id: 5, slug: "start" } },
      { id: 5, label: "Gültig", page: { id: 6, slug: "gueltig" } },
    ]);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Gültig" })).toBeInTheDocument();
    expect(screen.queryByText("Ohne Ziel")).not.toBeInTheDocument();
  });

  it("renders nothing when no entry is usable", () => {
    const { container } = renderBlock([{ id: 1, label: "Ohne Ziel" }], "Titel");

    expect(container).toBeEmptyDOMElement();
  });

  it("orders entries by sort and ignores unknown icon keys", () => {
    const { container } = renderBlock([
      {
        id: 1,
        label: "Zweite",
        sort: 2,
        icon: "gibt-es-nicht",
        page: { id: 4, slug: "zweite" },
      },
      { id: 2, label: "Erste", sort: 1, page: { id: 3, slug: "erste" } },
      { id: 3, label: "Unaufgelöst", sort: 3, page: 7 },
    ]);

    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual(["/erste", "/zweite"]);
    expect(container.querySelector("svg")).toBeNull();
  });
});
