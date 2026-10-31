import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ICON_KEYS, getIconComponent } from "./iconRegistry";
import { SymbolIcon } from "./SymbolIcon";

describe("iconRegistry", () => {
  it("resolves every documented key to a component", () => {
    expect(ICON_KEYS).toHaveLength(25);
    for (const key of ICON_KEYS) {
      expect(getIconComponent(key)).not.toBeNull();
    }
  });

  it("returns null for empty, unknown and prototype keys", () => {
    expect(getIconComponent(null)).toBeNull();
    expect(getIconComponent(undefined)).toBeNull();
    expect(getIconComponent("")).toBeNull();
    expect(getIconComponent("  ")).toBeNull();
    expect(getIconComponent("gibt-es-nicht")).toBeNull();
    expect(getIconComponent("constructor")).toBeNull();
  });
});

describe("SymbolIcon", () => {
  it("renders a decorative svg sized in em", () => {
    const { container } = render(<SymbolIcon name="fisch" />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "1em");
  });

  it("renders nothing for unknown keys", () => {
    const { container } = render(<SymbolIcon name="unbekannt" />);

    expect(container).toBeEmptyDOMElement();
  });
});
