import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section } from "./Section";

describe("Section", () => {
  it.each([
    ["default", "bg-background"],
    ["surface", "bg-surface"],
    ["primary", "bg-primary"],
  ] as const)("applies the %s background", (background, expectedClass) => {
    const { container } = render(<Section background={background}>x</Section>);
    const section = container.querySelector("section");

    expect(section).toHaveClass(expectedClass);
    expect(section).toHaveAttribute("data-background", background);
  });

  it("falls back to the default background for unknown values", () => {
    const { container } = render(
      // @ts-expect-error Directus kann unbekannte Werte liefern
      <Section background="neon">x</Section>,
    );

    expect(container.querySelector("section")).toHaveAttribute(
      "data-background",
      "default",
    );
  });
});
