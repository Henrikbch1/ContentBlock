import type { PropsWithChildren } from "react";
import { toAnchorId } from "../../lib/anchorId";
import { cn } from "../../lib/utils";

type SectionTitleProps = PropsWithChildren<
  Readonly<{
    className?: string;
  }>
>;

/** Text titles get a fragment id so navigation can link to the section (e.g. `/verein#unser-vorstand`). */
export const SectionTitle = ({
  children,
  className,
}: SectionTitleProps): React.JSX.Element => (
  <h2
    className={cn(
      "section-title mb-8 scroll-mt-6 text-[1.75rem] leading-tight [overflow-wrap:anywhere] sm:text-[2.125rem] lg:scroll-mt-40",
      className,
    )}
    id={
      typeof children === "string"
        ? (toAnchorId(children) ?? undefined)
        : undefined
    }
  >
    {children}
  </h2>
);
