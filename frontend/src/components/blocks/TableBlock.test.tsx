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

  it("highlights date ranges that include today in table and cards", () => {
    const seasons = [
      { col_1: "Gewässer", col_2: "Schonzeit", col_3: "Hinweis" },
      { col_1: "Stoteler See", col_2: "15.10. – 15.02.", col_3: "keine" },
      { col_1: "Hafen", col_2: "01.02. – 15.05.", col_3: "ganzjährig" },
    ];
    render(
      <TableBlock
        item={{ id: 1, title: "Zeiten", data: seasons }}
        today={new Date(2026, 9, 31)}
      />,
    );

    const table = screen.getByRole("table", { name: "Zeiten" });
    const active = within(table).getByRole("cell", {
      name: /15\.10\. – 15\.02\./,
    });
    expect(active).toHaveClass("bg-highlight");
    expect(active).toHaveTextContent("Schonzeit: gilt heute");
    expect(within(table).getAllByText("gilt heute")).toHaveLength(1);
    expect(
      within(table).getByRole("cell", { name: "01.02. – 15.05." }),
    ).not.toHaveClass("bg-highlight");
    expect(within(table).getByRole("cell", { name: "keine" })).not.toHaveClass(
      "bg-highlight",
    );

    const cards = screen.getByRole("list", { name: "Zeiten als Karten" });
    const [activeCard, inactiveCard] = within(cards).getAllByRole("listitem");
    expect(within(activeCard).getByText(/15\.10\./)).toHaveClass(
      "bg-highlight",
    );
    expect(activeCard).toHaveTextContent("Schonzeit: gilt heute");
    expect(within(inactiveCard).queryByText("gilt heute")).toBeNull();
    expect(within(inactiveCard).getByText(/01\.02\./)).not.toHaveClass(
      "bg-highlight",
    );
  });

  it("does not highlight anything outside of the date ranges", () => {
    render(
      <TableBlock
        item={{
          id: 1,
          title: "Zeiten",
          data: [
            { col_1: "Gewässer", col_2: "Schonzeit" },
            { col_1: "Stoteler See", col_2: "15.10. – 15.02." },
          ],
        }}
        today={new Date(2026, 6, 1)}
      />,
    );

    expect(screen.queryByText(/gilt heute/)).not.toBeInTheDocument();
  });

  it("summarizes active entries of all pages above the table", () => {
    const narrow = window.matchMedia("(min-width: 9999px)");
    const matchMedia = vi.spyOn(window, "matchMedia").mockReturnValue(narrow);
    const rows = [
      { col_1: "Art", col_2: "Schonzeit" },
      ...Array.from({ length: 6 }, (_, index) => ({
        col_1: `Fisch ${index + 1}`,
        col_2: "01.02. – 15.05.",
      })),
      { col_1: "Bachforelle", col_2: "15.10. – 15.02." },
    ];

    try {
      render(
        <TableBlock
          item={{ id: 1, title: "Zeiten", data: rows }}
          today={new Date(2026, 9, 31)}
        />,
      );

      const summary = screen.getByText("Gilt heute:").parentElement;
      expect(summary).toHaveClass("bg-highlight");
      expect(summary).not.toHaveAttribute("role");
      expect(summary).not.toHaveAttribute("aria-live");
      expect(
        within(summary as HTMLElement).getByRole("listitem"),
      ).toHaveTextContent("Bachforelle – Schonzeit 15.10. – 15.02.");
      expect(screen.getByText("Zeilen 1–5 von 7")).toBeVisible();
      expect(
        within(
          screen.getByRole("list", { name: "Zeiten als Karten" }),
        ).queryByText("Bachforelle"),
      ).not.toBeInTheDocument();
    } finally {
      matchMedia.mockRestore();
    }
  });

  it("omits the summary when no cell applies today", () => {
    render(
      <TableBlock
        item={{
          id: 1,
          title: "Zeiten",
          data: [
            { col_1: "Gewässer", col_2: "Schonzeit" },
            { col_1: "Stoteler See", col_2: "15.10. – 15.02." },
          ],
        }}
        today={new Date(2026, 6, 1)}
      />,
    );

    expect(screen.queryByText("Gilt heute:")).not.toBeInTheDocument();
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
