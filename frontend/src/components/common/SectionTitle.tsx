import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

type SectionTitleProps = PropsWithChildren<
  Readonly<{
    className?: string;
  }>
>;

export const SectionTitle = ({
  children,
  className,
}: SectionTitleProps): React.JSX.Element => (
  <h2
    className={cn(
      "section-title mb-8 text-[1.75rem] leading-tight [overflow-wrap:anywhere] sm:text-[2.125rem]",
      className,
    )}
  >
    {children}
  </h2>
);
