import { describe, expect, it } from "vitest";

import { formatDate, formatDateRange } from "./format";

describe("formatDate", () => {
  it("formats an ISO date in German notation", () => {
    expect(formatDate("2026-03-05T12:00:00Z")).toBe("5.3.2026");
  });

  it.each([null, undefined, "", "not-a-date"])(
    "returns an empty string for %s",
    (value) => {
      expect(formatDate(value)).toBe("");
    },
  );
});

describe("formatDateRange", () => {
  it("returns only the start for a single-day range", () => {
    expect(
      formatDateRange("2026-03-05T10:00:00Z", "2026-03-05T14:00:00Z"),
    ).toBe("5.3.2026");
  });

  it("returns only the start when the end is missing", () => {
    expect(formatDateRange("2026-03-05T12:00:00Z", null)).toBe("5.3.2026");
  });

  it("joins start and end for a multi-day range", () => {
    expect(
      formatDateRange("2026-03-05T12:00:00Z", "2026-03-07T12:00:00Z"),
    ).toBe("5.3.2026 - 7.3.2026");
  });

  it("returns an empty string when both dates are missing", () => {
    expect(formatDateRange(null, undefined)).toBe("");
  });
});
