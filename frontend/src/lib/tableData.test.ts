import { describe, expect, it } from "vitest";

import { getTableCellText, getTableRows } from "./tableData";

describe("getTableRows", () => {
  it("returns no rows for non-array data", () => {
    expect(getTableRows(null)).toEqual([]);
    expect(getTableRows({ col_1: "a" })).toEqual([]);
  });

  it("maps flat col_N rows to cells", () => {
    const rows = getTableRows([
      { col_1: "Art", col_2: "Aufnahme" },
      { col_1: "Erwachsene", col_2: "120 EUR" },
    ]);

    expect(rows).toEqual([
      { cells: [{ value: "Art" }, { value: "Aufnahme" }] },
      { cells: [{ value: "Erwachsene" }, { value: "120 EUR" }] },
    ]);
  });

  it("hides trailing columns that are empty in every row", () => {
    const rows = getTableRows([
      { col_1: "A", col_2: "B", col_3: "" },
      { col_1: "C", col_2: "D", col_3: null },
    ]);

    expect(rows.map((row) => row.cells.length)).toEqual([2, 2]);
  });

  it("keeps empty cells between filled columns", () => {
    const rows = getTableRows([{ col_1: "A", col_2: "", col_3: "C" }]);

    expect(rows[0].cells.map((cell) => cell.value)).toEqual(["A", "", "C"]);
  });

  it("ignores keys that are not col_N and non-record entries", () => {
    const rows = getTableRows([{ col_1: "A", id: 7, col_0: "x" }, "oops", 3]);

    expect(rows).toEqual([{ cells: [{ value: "A" }] }]);
  });

  it("supports the legacy cells[].value format", () => {
    const rows = getTableRows([{ cells: [{ value: "A" }, "broken", {}] }]);

    expect(rows).toEqual([
      { cells: [{ value: "A" }, { value: null }, { value: undefined }] },
    ]);
  });
});

describe("getTableCellText", () => {
  it("renders null and undefined as empty string", () => {
    expect(getTableCellText(null)).toBe("");
    expect(getTableCellText(undefined)).toBe("");
  });

  it("stringifies primitives", () => {
    expect(getTableCellText("text")).toBe("text");
    expect(getTableCellText(42)).toBe("42");
    expect(getTableCellText(false)).toBe("false");
  });

  it("serializes objects as JSON", () => {
    expect(getTableCellText({ a: 1 })).toBe('{"a":1}');
  });
});
