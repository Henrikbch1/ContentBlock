import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const Container = ({
  children,
  className,
}: ContainerProps): React.JSX.Element => (
  <div
    className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
  >
    {children}
  </div>
);
