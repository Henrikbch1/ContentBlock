import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDocumentsForBlock: vi.fn(),
}));

vi.mock("../../lib/queries", () => ({
  getDocumentsForBlock: mocks.getDocumentsForBlock,
}));
vi.mock("../../lib/directus", () => ({
  getAssetUrl: (file: { id: string } | null) =>
    file ? `https://cms.example.test/assets/${file.id}` : null,
}));

import { DocumentsBlock } from "./DocumentsBlock";

describe("DocumentsBlock", () => {
  beforeEach(() => {
    mocks.getDocumentsForBlock.mockReset();
  });

  it("offers distinguishable links for both uploaded variants", async () => {
    mocks.getDocumentsForBlock.mockResolvedValue([
      {
        id: "color",
        title: "Antrag – Farbe",
        file: { id: "color-file", filename_download: "antrag.pdf" },
      },
      {
        id: "monochrome",
        title: "Antrag – Schwarz-Weiß",
        file: { id: "mono-file", filename_download: "antrag.pdf" },
      },
    ]);

    render(<DocumentsBlock item={{ id: "block", title: "Formulare" }} />);

    const color = await screen.findByRole("link", {
      name: /Dokument öffnen\s*:\s*Antrag – Farbe \(öffnet in neuem Tab\)/,
    });
    const monochrome = screen.getByRole("link", {
      name: /Dokument öffnen\s*:\s*Antrag – Schwarz-Weiß \(öffnet in neuem Tab\)/,
    });
    expect(
      screen.getByRole("heading", { name: "Antrag – Farbe" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Antrag – Schwarz-Weiß" }),
    ).toBeVisible();
    expect(color).toHaveAttribute(
      "href",
      "https://cms.example.test/assets/color-file",
    );
    expect(monochrome).toHaveAttribute(
      "href",
      "https://cms.example.test/assets/mono-file",
    );
    expect(color).toHaveAttribute("target", "_blank");
    expect(color).toHaveClass("min-h-11");
    expect(monochrome).toHaveClass("min-h-11");
  });

  it("uses the filename or a fallback when a title is absent", async () => {
    mocks.getDocumentsForBlock.mockResolvedValue([
      {
        id: "file",
        title: " ",
        file: { id: "file-id", filename_download: "formular.pdf" },
      },
      { id: "untitled", title: null, file: null },
    ]);

    render(<DocumentsBlock item={{ id: "block" }} />);

    expect(
      await screen.findByRole("heading", { name: "formular.pdf" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Ohne Titel" })).toBeVisible();
    expect(screen.getByText("Datei nicht verfügbar.")).toBeVisible();
    expect(
      screen.getByRole("link", {
        name: /formular\.pdf \(öffnet in neuem Tab\)/,
      }),
    ).toBeVisible();
  });

  it("shows a loading error rather than an empty success state", async () => {
    mocks.getDocumentsForBlock.mockRejectedValue(
      new Error("Some selected documents could not be loaded."),
    );

    render(<DocumentsBlock item={{ id: "block" }} />);

    expect(
      await screen.findByText("Dokumente konnten nicht geladen werden."),
    ).toBeVisible();
    expect(
      screen.queryByText("Keine Dokumente vorhanden."),
    ).not.toBeInTheDocument();
  });

  it("shows the existing empty state for an empty selection", async () => {
    mocks.getDocumentsForBlock.mockResolvedValue([]);

    render(<DocumentsBlock item={{ id: "block" }} />);

    expect(await screen.findByText("Keine Dokumente vorhanden.")).toBeVisible();
  });
});
