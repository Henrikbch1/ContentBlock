export type ThemeMode = "legacy" | "neutral";

const configuredMode = import.meta.env.VITE_THEME_MODE;

if (
  configuredMode &&
  configuredMode !== "legacy" &&
  configuredMode !== "neutral"
) {
  console.warn("Invalid VITE_THEME_MODE; the legacy theme will be used.");
}

export const THEME_MODE: ThemeMode =
  configuredMode === "neutral" ? "neutral" : "legacy";
