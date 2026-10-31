import { describe, expect, it } from "vitest";

import { toAnchorId } from "./anchorId";

describe("toAnchorId", () => {
  it.each([
    ["Unser Vorstand", "unser-vorstand"],
    [
      "Mindestmaße, Schonzeiten & Fangbegrenzungen",
      "mindestmasse-schonzeiten-fangbegrenzungen",
    ],
    ["  Über uns  ", "ueber-uns"],
    ["Café 2027", "cafe-2027"],
  ])("converts %j to %j", (text, id) => {
    expect(toAnchorId(text)).toBe(id);
  });

  it("returns null without letters or digits", () => {
    expect(toAnchorId(" – ")).toBeNull();
  });
});
