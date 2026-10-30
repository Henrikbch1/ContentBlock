import { describe, expect, it } from "vitest";

import { getNeutralTheme } from "./neutralTheme";

const rgb = (hex: string): number[] =>
  [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16));

const relativeLuminance = (color: number[]): number => {
  const [red, green, blue] = color.map((channel) => {
    const component = channel / 255;
    return component <= 0.04045
      ? component / 12.92
      : ((component + 0.055) / 1.055) ** 2.4;
  });
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
};

const contrastRatio = (first: number[], second: number[]): number => {
  const values = [relativeLuminance(first), relativeLuminance(second)].sort(
    (left, right) => left - right,
  );
  return (values[1] + 0.05) / (values[0] + 0.05);
};

const blend = (background: number[], foreground: number[], alpha: number) =>
  background.map((channel, index) =>
    Math.round(channel * (1 - alpha) + foreground[index] * alpha),
  );

const accentPairs = [
  ["#ffffff", "#000000"],
  ["#000000", "#ffffff"],
  ["#ff0000", "#00ffff"],
  ["#00ff00", "#0000ff"],
  ["#ffff00", "#ff00ff"],
  ["#808080", "#e7b552"],
  ["#005f62", "#fcfcfa"],
  ["#123", "#fed"],
] as const;

describe("getNeutralTheme", () => {
  it.each(accentPairs)(
    "keeps the rendered color pairs readable for %s and %s",
    (primary, accent) => {
      const { variables, warnings } = getNeutralTheme({
        id: 1,
        primary_color: primary,
        accent_color: accent,
      });
      expect(warnings).toEqual([]);

      for (const scheme of ["light", "dark"] as const) {
        const color = (name: string) =>
          rgb(variables[`--cb-neutral-${scheme}-${name}`]);
        const background = color("bg");
        const surface = color("surface");
        const text = color("text");
        const muted = color("muted");
        const primaryColor = color("primary");
        const onPrimary = color("on-primary");
        const inverse = color("inverse");
        const onInverse = color("on-inverse");
        const paper = color("paper");
        const pairs: Array<[number[], number[], number]> = [
          [primaryColor, background, 7],
          [primaryColor, surface, 7],
          [primaryColor, paper, 7],
          [text, paper, 7],
          [muted, paper, 4.5],
          [color("pin"), paper, 3],
          [color("rail-accent"), inverse, 3],
          [onPrimary, primaryColor, 4.5],
          [onPrimary, color("primary-hover"), 4.5],
          [text, background, 7],
          [text, surface, 7],
          [muted, background, 4.5],
          [muted, surface, 4.5],
          [text, color("secondary"), 4.5],
          [text, color("accent"), 4.5],
          [text, color("accent-hover"), 4.5],
          [text, blend(background, color("accent"), 0.45), 4.5],
          [blend(primaryColor, onPrimary, 0.85), primaryColor, 4.5],
          [onInverse, inverse, 4.5],
          [blend(inverse, onInverse, 0.78), inverse, 4.5],
          [blend(background, text, 0.6), background, 3],
        ];

        for (const [foreground, backdrop, minimum] of pairs) {
          expect(contrastRatio(foreground, backdrop)).toBeGreaterThanOrEqual(
            minimum,
          );
        }
        expect(contrastRatio(primaryColor, surface)).toBeLessThanOrEqual(10);
      }
    },
  );

  it("uses one accent when the second color is not configured", () => {
    const single = getNeutralTheme({ id: 1, primary_color: "#e7b552" });
    const repeated = getNeutralTheme({
      id: 1,
      primary_color: "#e7b552",
      accent_color: "#e7b552",
    });

    expect(single).toEqual(repeated);
  });

  it("keeps a broad range of generated accents within the contrast limits", () => {
    for (let value = 0; value < 256; value += 1) {
      const primary = `#${[value, (value * 71) % 256, (value * 149) % 256]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")}`;
      const { variables } = getNeutralTheme({ id: 1, primary_color: primary });

      for (const scheme of ["light", "dark"] as const) {
        const color = (name: string) =>
          rgb(variables[`--cb-neutral-${scheme}-${name}`]);
        const ratio = contrastRatio(color("primary"), color("surface"));
        expect(ratio).toBeGreaterThanOrEqual(7);
        expect(ratio).toBeLessThanOrEqual(10);
        expect(
          contrastRatio(color("primary"), color("paper")),
        ).toBeGreaterThanOrEqual(7);
        expect(
          contrastRatio(color("pin"), color("paper")),
        ).toBeGreaterThanOrEqual(3);
        expect(
          contrastRatio(color("rail-accent"), color("inverse")),
        ).toBeGreaterThanOrEqual(3);
        expect(
          contrastRatio(color("on-primary"), color("primary-hover")),
        ).toBeGreaterThanOrEqual(4.5);
        expect(
          contrastRatio(color("text"), color("accent-hover")),
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("reports invalid or transparent colors and uses a safe default", () => {
    const result = getNeutralTheme({
      id: 1,
      primary_color: "var(--user-color)",
      accent_color: "#ffffff80",
    });

    expect(result.warnings).toHaveLength(2);
    expect(result.warnings[0]).toContain("theme.primary_color");
    expect(result.warnings[1]).toContain("theme.accent_color");
    expect(result.variables).toEqual(getNeutralTheme(null).variables);
  });

  it("keeps image-overlay text readable over a white image", () => {
    const largeTextZone = blend(rgb("#ffffff"), rgb("#000000"), 0.45);
    const bodyTextZone = blend(rgb("#ffffff"), rgb("#000000"), 0.62);

    expect(contrastRatio(rgb("#ffffff"), largeTextZone)).toBeGreaterThan(3);
    expect(contrastRatio(rgb("#ffffff"), bodyTextZone)).toBeGreaterThan(4.5);
    expect(contrastRatio(rgb("#e5e5e5"), bodyTextZone)).toBeGreaterThan(4.5);
  });
});
