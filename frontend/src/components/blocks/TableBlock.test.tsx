import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TableBlock } from "./TableBlock";

const data = [
  { col_1: "Art", col_2: "Mindestmaß" },
  { col_1: "Forelle", col_2: "30 cm" },
  { col_1: "Hecht", col_2: "50 cm" },
];

describe("TableBlock", () => {
  it("preserves table headers and labels every mobile card value", () => {
    render(<TableBlock item={{ id: 1, title: "Fischarten", data }} />);

    const table = screen.getByRole("table", { name: "Fischarten" });
    expect(
      screen.getByRole("region", { name: "Fischarten als Tabelle" }),
    ).toHaveAttribute("tabindex", "0");
    expect(
      within(table).getByRole("columnheader", { name: "Art" }),
    ).toBeVisible();
    expect(
      within(table).getByRole("rowheader", { name: "Forelle" }),
    ).toBeVisible();
    const cards = screen.getByRole("list", { name: "Fischarten als Karten" });
    expect(within(cards).getAllByText("Mindestmaß")).toHaveLength(2);
    expect(within(cards).getByText("30 cm")).toBeVisible();
  });

  it("filters all rows and reports an empty result", () => {
    render(<TableBlock item={{ id: 1, title: "Fischarten", data }} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Tabelle durchsuchen" }),
      {
        target: { value: "hecht" },
      },
    );
    expect(screen.getAllByText("Hecht")).toHaveLength(2);
    expect(screen.queryByText("Forelle")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "unbekannt" },
    });
    expect(
      screen.getByText("Keine passenden Tabellenzeilen gefunden."),
    ).toBeVisible();
  });

  it("paginates long tables and searches beyond the current page", () => {
    const manyRows = [
      { col_1: "Name" },
      ...Array.from({ length: 25 }, (_, index) => ({
        col_1: `Eintrag ${index + 1}`,
      })),
    ];
    render(<TableBlock item={{ id: 1, title: "Liste", data: manyRows }} />);

    expect(screen.getByText("Zeilen 1–20 von 25")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));
    expect(screen.getByText("Zeilen 21–25 von 25")).toBeVisible();
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "Eintrag 3" },
    });
    expect(screen.getByText("Zeilen 1–1 von 1")).toBeVisible();
    expect(screen.getAllByText("Eintrag 3")).toHaveLength(2);
  });

  it("limits the mobile view to five cards per page", () => {
    const narrow = window.matchMedia("(min-width: 9999px)");
    const matchMedia = vi.spyOn(window, "matchMedia").mockReturnValue(narrow);
    const manyRows = [
      { col_1: "Name" },
      ...Array.from({ length: 6 }, (_, index) => ({
        col_1: `Eintrag ${index + 1}`,
      })),
    ];

    try {
      render(<TableBlock item={{ id: 1, title: "Liste", data: manyRows }} />);

      const cards = screen.getByRole("list", { name: "Liste als Karten" });
      expect(within(cards).getAllByRole("listitem")).toHaveLength(5);
      expect(screen.getByText("Zeilen 1–5 von 6")).toBeVisible();
    } finally {
      matchMedia.mockRestore();
    }
  });

  it("shows the existing empty state for invalid table data", () => {
    render(<TableBlock item={{ id: 1, data: null }} />);

    expect(screen.getByText("Keine Tabellendaten vorhanden.")).toBeVisible();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("skips completely empty data rows left by the table editor", () => {
    render(
      <TableBlock
        item={{
          id: 1,
          title: "Beiträge",
          data: [...data, { col_1: "", col_2: null }, { col_1: "  " }],
        }}
      />,
    );

    expect(screen.getByText("Zeilen 1–2 von 2")).toBeVisible();
  });
});
