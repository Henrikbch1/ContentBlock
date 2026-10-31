import { describe, expect, it } from "vitest";

import { isRangeTextActive, parseDayMonthRanges } from "./dateRanges";

const on = (year: number, month: number, day: number): Date =>
  new Date(year, month - 1, day, 12);

describe("parseDayMonthRanges", () => {
  it.each([
    "01.02. – 15.05.",
    "1.2.-15.5.",
    "01.02. bis 15.05.",
    "01.02.—15.05.",
    "01.02.–15.05.",
    "01.02. BIS 15.05.",
    "Schonzeit: 01.02. - 15.05. (Hecht)",
  ])("recognizes %j", (text) => {
    expect(parseDayMonthRanges(text)).toEqual([
      {
        start: { day: 1, month: 2 },
        end: { day: 15, month: 5 },
      },
    ]);
  });

  it("reads optional years", () => {
    expect(parseDayMonthRanges("01.02.2026 – 15.05.2026")).toEqual([
      {
        start: { day: 1, month: 2, year: 2026 },
        end: { day: 15, month: 5, year: 2026 },
      },
    ]);
  });

  it("derives the missing year from the one given", () => {
    expect(parseDayMonthRanges("15.10. – 15.02.2027")).toEqual([
      {
        start: { day: 15, month: 10, year: 2026 },
        end: { day: 15, month: 2, year: 2027 },
      },
    ]);
    expect(parseDayMonthRanges("15.10.2026 – 15.02.")).toEqual([
      {
        start: { day: 15, month: 10, year: 2026 },
        end: { day: 15, month: 2, year: 2027 },
      },
    ]);
  });

  it("finds several ranges in one cell", () => {
    expect(parseDayMonthRanges("01.02.–15.03. und 01.10.–31.12.")).toHaveLength(
      2,
    );
    expect(parseDayMonthRanges("01.02.–15.03.,01.10.–31.12.")).toHaveLength(2);
  });

  it.each([
    "",
    "   ",
    "keine Schonzeit",
    "ganzjährig",
    "32.01. – 15.05.",
    "01.13. – 15.05.",
    "00.02. – 15.05.",
    "31.04. – 15.05.",
    "01.02.",
    "01.02. 15.05.",
    "1.5 - 2.5 kg",
    "101.02. – 15.05.",
    "29.02.2025 – 15.05.2025",
    "15.05.2026 – 01.02.2026",
  ])("ignores %j", (text) => {
    expect(parseDayMonthRanges(text)).toEqual([]);
  });

  it("keeps valid ranges next to invalid ones", () => {
    expect(parseDayMonthRanges("32.01.–15.05. und 01.10.–31.12.")).toHaveLength(
      1,
    );
  });
});

describe("isRangeTextActive", () => {
  const range = "01.02. – 15.05.";

  it("includes the first and last day", () => {
    expect(isRangeTextActive(range, on(2026, 2, 1))).toBe(true);
    expect(isRangeTextActive(range, on(2026, 5, 15))).toBe(true);
    expect(isRangeTextActive(range, on(2026, 3, 20))).toBe(true);
  });

  it("excludes the days around the range", () => {
    expect(isRangeTextActive(range, on(2026, 1, 31))).toBe(false);
    expect(isRangeTextActive(range, on(2026, 5, 16))).toBe(false);
    expect(isRangeTextActive(range, on(2026, 10, 31))).toBe(false);
  });

  it("handles ranges across the new year", () => {
    const wrapping = "15.10. – 15.02.";
    expect(isRangeTextActive(wrapping, on(2026, 10, 31))).toBe(true);
    expect(isRangeTextActive(wrapping, on(2026, 10, 15))).toBe(true);
    expect(isRangeTextActive(wrapping, on(2026, 12, 31))).toBe(true);
    expect(isRangeTextActive(wrapping, on(2027, 1, 1))).toBe(true);
    expect(isRangeTextActive(wrapping, on(2027, 2, 15))).toBe(true);
    expect(isRangeTextActive(wrapping, on(2027, 2, 16))).toBe(false);
    expect(isRangeTextActive(wrapping, on(2026, 10, 14))).toBe(false);
    expect(isRangeTextActive(wrapping, on(2026, 7, 1))).toBe(false);
  });

  it("treats a single-day range as that day only", () => {
    expect(isRangeTextActive("24.12. – 24.12.", on(2026, 12, 24))).toBe(true);
    expect(isRangeTextActive("24.12. – 24.12.", on(2026, 12, 25))).toBe(false);
  });

  it("handles 29 February in leap and common years", () => {
    expect(isRangeTextActive("29.02. – 15.03.", on(2028, 2, 29))).toBe(true);
    expect(isRangeTextActive("29.02. – 15.03.", on(2028, 2, 28))).toBe(false);
    expect(isRangeTextActive("29.02. – 15.03.", on(2027, 3, 1))).toBe(true);
    expect(isRangeTextActive("29.02. – 15.03.", on(2027, 2, 28))).toBe(false);
    expect(isRangeTextActive("15.02. – 29.02.", on(2027, 2, 28))).toBe(true);
    expect(isRangeTextActive("15.02. – 29.02.", on(2027, 3, 1))).toBe(false);
    expect(isRangeTextActive("29.02.2028 – 01.03.2028", on(2028, 2, 29))).toBe(
      true,
    );
  });

  it("limits ranges with a year to that interval", () => {
    const dated = "01.02.2026 – 15.05.2026";
    expect(isRangeTextActive(dated, on(2026, 3, 1))).toBe(true);
    expect(isRangeTextActive(dated, on(2026, 2, 1))).toBe(true);
    expect(isRangeTextActive(dated, on(2026, 5, 15))).toBe(true);
    expect(isRangeTextActive(dated, on(2027, 3, 1))).toBe(false);
    expect(isRangeTextActive(dated, on(2025, 3, 1))).toBe(false);
    const wrapping = "15.10.2026 – 15.02.2027";
    expect(isRangeTextActive(wrapping, on(2026, 12, 1))).toBe(true);
    expect(isRangeTextActive(wrapping, on(2027, 2, 15))).toBe(true);
    expect(isRangeTextActive(wrapping, on(2027, 10, 31))).toBe(false);
  });

  it("is active when any of several ranges applies", () => {
    const text = "01.02.–15.03. und 01.10.–31.12.";
    expect(isRangeTextActive(text, on(2026, 2, 10))).toBe(true);
    expect(isRangeTextActive(text, on(2026, 11, 10))).toBe(true);
    expect(isRangeTextActive(text, on(2026, 6, 10))).toBe(false);
  });

  it.each(["", "keine Schonzeit", "ganzjährig", "32.01. – 15.05."])(
    "is never active for %j",
    (text) => {
      expect(isRangeTextActive(text, on(2026, 3, 1))).toBe(false);
    },
  );

  it("defaults to the current date", () => {
    expect(isRangeTextActive("01.01. – 31.12.")).toBe(true);
  });
});
