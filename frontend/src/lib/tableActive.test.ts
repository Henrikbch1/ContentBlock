import { describe, expect, it } from "vitest";

import { collectActiveEntries } from "./tableActive";

const headers = ["Art", "Schonzeit", "Mindestmaß"];

describe("collectActiveEntries", () => {
  it("lists active cells labelled by the first column", () => {
    expect(
      collectActiveEntries(headers, [
        {
          values: ["Bachforelle", "15.10. – 15.02.", "25 cm"],
          active: [false, true, false],
        },
        {
          values: ["Hecht", "01.02. – 15.05.", "50 cm"],
          active: [false, false, false],
        },
      ]),
    ).toEqual([
      { label: "Bachforelle", heading: "Schonzeit", value: "15.10. – 15.02." },
    ]);
  });

  it("keeps table order and lists several cells per row", () => {
    const entries = collectActiveEntries(headers, [
      { values: ["A", "x", "y"], active: [false, true, true] },
      { values: ["B", "z", ""], active: [false, true, false] },
    ]);

    expect(entries.map((entry) => `${entry.label}/${entry.heading}`)).toEqual([
      "A/Schonzeit",
      "A/Mindestmaß",
      "B/Schonzeit",
    ]);
  });

  it("uses no label when the first column itself is active", () => {
    expect(
      collectActiveEntries(headers, [
        { values: ["01.02. – 15.05."], active: [true] },
      ]),
    ).toEqual([{ label: "", heading: "Art", value: "01.02. – 15.05." }]);
  });

  it("returns nothing without active cells", () => {
    expect(
      collectActiveEntries(headers, [
        { values: ["Hecht", "", ""], active: [false, false, false] },
      ]),
    ).toEqual([]);
  });
});
