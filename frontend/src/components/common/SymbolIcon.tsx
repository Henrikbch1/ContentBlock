import { createElement } from "react";

import { cn } from "../../lib/utils";
import { getIconComponent } from "./iconRegistry";

type SymbolIconProps = Readonly<{
  name: string | null | undefined;
  className?: string;
  size?: number | string;
}>;

/**
 * Dekoratives Symbol (immer `aria-hidden`) — steht nur neben einer sichtbaren
 * Beschriftung. Rendert nichts bei leerem oder unbekanntem Schlüssel.
 */
export const SymbolIcon = ({
  name,
  className,
  size = "1em",
}: SymbolIconProps): React.JSX.Element | null => {
  const icon = getIconComponent(name);
  return icon
    ? createElement(icon, {
        "aria-hidden": true,
        className: cn("shrink-0", className),
        focusable: "false",
        size,
      })
    : null;
};
