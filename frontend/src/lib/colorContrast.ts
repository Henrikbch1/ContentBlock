export type Color = readonly [number, number, number];

export const WHITE: Color = [255, 255, 255];
export const BLACK: Color = [0, 0, 0];

const MIN_CONTRAST = 7;
const MAX_PRIMARY_CONTRAST = 10;

export const mix = (from: Color, to: Color, amount: number): Color => [
  Math.round(from[0] + (to[0] - from[0]) * amount),
  Math.round(from[1] + (to[1] - from[1]) * amount),
  Math.round(from[2] + (to[2] - from[2]) * amount),
];

const luminance = (color: Color): number => {
  const linear = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};

export const contrast = (first: Color, second: Color): number => {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
};

/** Moves `color` towards `destination` until it reaches `minimum` contrast against `background`. */
export const ensureContrast = (
  color: Color,
  background: Color,
  destination: Color,
  minimum = MIN_CONTRAST,
): Color => {
  if (contrast(color, background) >= minimum) return color;
  if (contrast(destination, background) < minimum) {
    throw new RangeError("Neutral theme contrast target cannot be reached.");
  }

  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 16; iteration += 1) {
    const middle = (low + high) / 2;
    if (contrast(mix(color, destination, middle), background) >= minimum) {
      high = middle;
    } else {
      low = middle;
    }
  }
  return mix(color, destination, high);
};

/** Fades `color` into `background` until its contrast is at most 10:1. */
export const limitPrimaryContrast = (
  color: Color,
  background: Color,
): Color => {
  if (contrast(color, background) <= MAX_PRIMARY_CONTRAST) return color;

  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 16; iteration += 1) {
    const middle = (low + high) / 2;
    if (
      contrast(mix(color, background, middle), background) <=
      MAX_PRIMARY_CONTRAST
    ) {
      high = middle;
    } else {
      low = middle;
    }
  }
  return mix(color, background, high);
};

export const toHex = (color: Color): string =>
  `#${color.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
