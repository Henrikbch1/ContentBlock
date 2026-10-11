import type { Theme } from "./types";

const FONT_STACKS = {
  sans: '"DM Sans", system-ui, sans-serif',
  serif: '"Fraunces", Georgia, serif',
} as const;

const RADIUS_VALUES = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
} as const;

const SECTION_Y_VALUES = {
  compact: "clamp(2rem, 4vw, 3rem)",
  normal: "clamp(3rem, 6vw, 5rem)",
  airy: "clamp(4rem, 9vw, 7rem)",
} as const;

const CONTAINER_VALUES = {
  narrow: "64rem",
  normal: "72rem",
  wide: "80rem",
} as const;

const SHADOW_VALUES = {
  none: "none",
  subtle: "0 1px 2px rgb(0 0 0 / 0.06)",
  strong: "0 8px 24px rgb(0 0 0 / 0.14)",
} as const;

const COLOR_VARIABLES = {
  primary_color: "--cb-primary",
  secondary_color: "--cb-secondary",
  accent_color: "--cb-accent",
  background_color: "--cb-bg",
  surface_color: "--cb-surface",
  text_color: "--cb-text",
} as const satisfies Partial<Record<keyof Theme, `--cb-${string}`>>;

const PRESET_VARIABLES = [
  ["border_radius", "--cb-radius", RADIUS_VALUES],
  ["font_heading", "--cb-font-heading", FONT_STACKS],
  ["font_body", "--cb-font-body", FONT_STACKS],
  ["spacing_scale", "--cb-section-y", SECTION_Y_VALUES],
  ["container_width", "--cb-container", CONTAINER_VALUES],
  ["shadow_style", "--cb-shadow", SHADOW_VALUES],
] as const satisfies ReadonlyArray<
  readonly [keyof Theme, `--cb-${string}`, Readonly<Record<string, string>>]
>;

const isValidCssColor = (value: string): boolean => {
  if (typeof document === "undefined" || /var\(/i.test(value)) return false;
  const probe = document.createElement("span");
  probe.style.color = value;
  return probe.style.color !== "";
};

const getPresetValue = (
  presets: Readonly<Record<string, string>>,
  key: string | null | undefined,
): string | null => {
  const preset = key?.trim();
  return preset && Object.hasOwn(presets, preset) ? presets[preset] : null;
};

export const getThemeVariables = (
  theme: Theme | null | undefined,
): Record<string, string> => {
  const variables: Record<string, string> = {};
  if (!theme) return variables;

  for (const [themeKey, cssVariable] of Object.entries(COLOR_VARIABLES)) {
    const value = theme[themeKey as keyof typeof COLOR_VARIABLES]?.trim();
    if (value && isValidCssColor(value)) {
      variables[cssVariable] = value;
    }
  }

  for (const [themeKey, cssVariable, presets] of PRESET_VARIABLES) {
    const value = getPresetValue(presets, theme[themeKey]);
    if (value) {
      variables[cssVariable] = value;
    }
  }

  return variables;
};
