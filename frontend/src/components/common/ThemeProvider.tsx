import { useLayoutEffect } from "react";
import type { PropsWithChildren } from "react";
import { getThemeVariables } from "../../lib/themeVariables";
import type { Theme } from "../../lib/types";

export const ThemeProvider = ({
  theme,
  children,
}: PropsWithChildren<{
  theme: Theme | null | undefined;
}>): React.JSX.Element => {
  useLayoutEffect(() => {
    const rootStyle = document.documentElement.style;
    const variables = getThemeVariables(theme);
    for (const [name, value] of Object.entries(variables)) {
      rootStyle.setProperty(name, value);
    }
    return () => {
      for (const name of Object.keys(variables)) {
        rootStyle.removeProperty(name);
      }
    };
  }, [theme]);

  return <>{children}</>;
};
