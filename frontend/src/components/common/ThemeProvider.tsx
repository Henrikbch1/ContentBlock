import type { CSSProperties, PropsWithChildren } from "react";
import type { Theme } from "../../lib/types";

const COLOR_VARIABLES = {
  background_color: "--background",
  text_color: "--foreground",
  primary_color: "--primary",
  secondary_color: "--secondary",
  accent_color: "--accent",
} as const;

const RADIUS_VALUES = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
} as const;

const HEADING_FONTS = {
  sans: '"Avenir Next", Avenir, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
} as const;

const isValidCssColor = (value: string): boolean =>
  typeof CSS !== "undefined" && CSS.supports("color", value);

const getThemeStyle = (theme: Theme | null | undefined): CSSProperties => {
  if (!theme) {
    return {};
  }

  const style: CSSProperties & Record<`--${string}`, string> = {};

  for (const [themeKey, cssVariable] of Object.entries(COLOR_VARIABLES)) {
    const value = theme[themeKey as keyof typeof COLOR_VARIABLES];
    if (typeof value === "string" && isValidCssColor(value.trim())) {
      style[cssVariable] = value.trim();
    }
  }

  const radius = theme.border_radius?.trim();
  if (radius && radius in RADIUS_VALUES) {
    style["--radius"] = RADIUS_VALUES[radius as keyof typeof RADIUS_VALUES];
  }

  const headingFont = theme.font_heading?.trim();
  if (headingFont && headingFont in HEADING_FONTS) {
    style["--font-heading"] =
      HEADING_FONTS[headingFont as keyof typeof HEADING_FONTS];
  }

  return style;
};

export const ThemeProvider = ({
  theme,
  children,
}: PropsWithChildren<{ theme: Theme | null | undefined }>): React.JSX.Element => (
  <div style={getThemeStyle(theme)}>{children}</div>
);
