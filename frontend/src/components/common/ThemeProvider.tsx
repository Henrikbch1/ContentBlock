import { useLayoutEffect } from "react";
import type { PropsWithChildren } from "react";
import { getNeutralTheme } from "../../lib/neutralTheme";
import { THEME_MODE } from "../../lib/themeMode";
import type { ThemeMode } from "../../lib/themeMode";
import { getThemeVariables } from "../../lib/themeVariables";
import type { Theme } from "../../lib/types";

export const ThemeProvider = ({
  theme,
  mode = THEME_MODE,
  children,
}: PropsWithChildren<{
  theme: Theme | null | undefined;
  mode?: ThemeMode;
}>): React.JSX.Element => {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const rootStyle = root.style;
    const previousMode = root.getAttribute("data-cb-theme");
    const neutral = mode === "neutral" ? getNeutralTheme(theme) : null;
    const variables = {
      ...getThemeVariables(theme, mode),
      ...neutral?.variables,
    };
    neutral?.warnings.forEach((warning) => console.warn(warning));
    for (const [name, value] of Object.entries(variables)) {
      rootStyle.setProperty(name, value);
    }
    if (neutral) root.setAttribute("data-cb-theme", "neutral");
    return () => {
      if (neutral) {
        if (previousMode === null) root.removeAttribute("data-cb-theme");
        else root.setAttribute("data-cb-theme", previousMode);
      }
      for (const name of Object.keys(variables)) {
        rootStyle.removeProperty(name);
      }
    };
  }, [theme, mode]);

  return <>{children}</>;
};
