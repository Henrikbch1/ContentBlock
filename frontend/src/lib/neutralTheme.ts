import type { Theme } from "./types";

type Color = readonly [number, number, number];
type Scheme = "light" | "dark";

type Palette = Readonly<{
  background: Color;
  surface: Color;
  paper: Color;
  text: Color;
  muted: Color;
  inverse: Color;
  onInverse: Color;
  onPrimary: Color;
}>;

type NeutralThemeResult = Readonly<{
  variables: Record<string, string>;
  warnings: string[];
}>;

const WHITE: Color = [255, 255, 255];
const BLACK: Color = [0, 0, 0];
const DEFAULT_ACCENT: Color = [0, 95, 98];
const MIN_CONTRAST = 7;
const MIN_INDICATOR_CONTRAST = 3;
const MAX_PRIMARY_CONTRAST = 10;

const PALETTES: Record<Scheme, Palette> = {
  light: {
    background: [233, 232, 228],
    surface: [221, 220, 215],
    paper: [252, 251, 248],
    text: [24, 26, 25],
    muted: [79, 84, 82],
    inverse: [28, 31, 30],
    onInverse: [244, 243, 239],
    onPrimary: WHITE,
  },
  dark: {
    background: [22, 23, 23],
    surface: [30, 32, 32],
    paper: [38, 40, 40],
    text: [240, 239, 235],
    muted: [189, 191, 189],
    inverse: [12, 13, 13],
    onInverse: [240, 239, 235],
    onPrimary: BLACK,
  },
};

const mix = (from: Color, to: Color, amount: number): Color => [
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

const contrast = (first: Color, second: Color): number => {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
};

const ensureContrast = (
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

const limitPrimaryContrast = (color: Color, background: Color): Color => {
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

const toHex = (color: Color): string =>
  `#${color.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;

const readAccent = (
  value: string | null | undefined,
  fallback: Color,
  field: string,
  warnings: string[],
): Color => {
  if (value === null || value === undefined || value === "") return fallback;
  const input = typeof value === "string" ? value.trim() : "";
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(input);
  if (!match) {
    warnings.push(
      `Invalid theme.${field}; use an opaque hexadecimal color. The default accent is used.`,
    );
    return fallback;
  }
  const digits =
    match[1].length === 3
      ? Array.from(match[1], (digit) => digit + digit).join("")
      : match[1];
  return [
    Number.parseInt(digits.slice(0, 2), 16),
    Number.parseInt(digits.slice(2, 4), 16),
    Number.parseInt(digits.slice(4, 6), 16),
  ];
};

const createScale = (accent: Color) => ({
  light: mix(WHITE, accent, 0.12),
  lightHover: mix(WHITE, accent, 0.24),
  dark: mix(BLACK, accent, 0.12),
  darkHover: mix(BLACK, accent, 0.24),
});

const createScheme = (
  scheme: Scheme,
  primaryAccent: Color,
  secondAccent: Color,
): Record<string, string> => {
  const base = PALETTES[scheme];
  const isLight = scheme === "light";
  const towardsText = isLight ? BLACK : WHITE;
  const primary = limitPrimaryContrast(
    ensureContrast(
      ensureContrast(primaryAccent, base.surface, towardsText),
      base.paper,
      towardsText,
    ),
    base.surface,
  );
  const pin = ensureContrast(
    secondAccent,
    base.paper,
    towardsText,
    MIN_INDICATOR_CONTRAST,
  );
  const railAccent = ensureContrast(
    primaryAccent,
    base.inverse,
    WHITE,
    MIN_INDICATOR_CONTRAST,
  );
  const firstScale = createScale(primaryAccent);
  const secondScale = createScale(secondAccent);
  const secondary = ensureContrast(
    firstScale[scheme],
    base.text,
    base.background,
  );
  const accent = ensureContrast(
    secondScale[scheme],
    base.text,
    base.background,
  );
  const accentHover = ensureContrast(
    secondScale[isLight ? "lightHover" : "darkHover"],
    base.text,
    base.background,
  );

  return Object.fromEntries(
    Object.entries({
      bg: base.background,
      surface: base.surface,
      paper: base.paper,
      pin,
      "rail-accent": railAccent,
      text: base.text,
      muted: base.muted,
      inverse: base.inverse,
      "on-inverse": base.onInverse,
      primary,
      "on-primary": base.onPrimary,
      "primary-hover": mix(primary, isLight ? BLACK : WHITE, 0.12),
      secondary,
      accent,
      "accent-hover": accentHover,
    }).map(([name, color]) => [`--cb-neutral-${scheme}-${name}`, toHex(color)]),
  );
};

/** Builds neutral light and dark tokens from up to two CMS accent colors. */
export const getNeutralTheme = (
  theme: Theme | null | undefined,
): NeutralThemeResult => {
  const warnings: string[] = [];
  const primary = readAccent(
    theme?.primary_color,
    DEFAULT_ACCENT,
    "primary_color",
    warnings,
  );
  const accent = readAccent(
    theme?.accent_color,
    primary,
    "accent_color",
    warnings,
  );
  return {
    variables: {
      ...createScheme("light", primary, accent),
      ...createScheme("dark", primary, accent),
    },
    warnings,
  };
};
