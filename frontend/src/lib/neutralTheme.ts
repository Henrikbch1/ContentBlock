import {
  BLACK,
  WHITE,
  ensureContrast,
  limitPrimaryContrast,
  mix,
  toHex,
} from "./colorContrast";
import type { Color } from "./colorContrast";
import type { Theme } from "./types";

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

const DEFAULT_ACCENT: Color = [0, 95, 98];
const MIN_INDICATOR_CONTRAST = 3;
const HIGHLIGHT_TINT = 0.3;
const MIN_HIGHLIGHT_CONTRAST = 1.25;

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
  const highlight = ensureContrast(
    ensureContrast(
      mix(base.paper, secondAccent, HIGHLIGHT_TINT),
      base.paper,
      towardsText,
      MIN_HIGHLIGHT_CONTRAST,
    ),
    base.text,
    base.paper,
  );

  return Object.fromEntries(
    Object.entries({
      bg: base.background,
      surface: base.surface,
      paper: base.paper,
      pin,
      highlight,
      "on-highlight": base.text,
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
