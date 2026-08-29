import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";
import { Container } from "./Container";

type SectionProps = PropsWithChildren<{
  ariaLabel?: string;
  className?: string;
  containerClassName?: string;
  id?: string;
}>;

export const Section = ({
  children,
  ariaLabel,
  className,
  containerClassName,
  id,
}: SectionProps): React.JSX.Element => (
  <section
    aria-label={ariaLabel}
    className={cn("py-12 sm:py-16", className)}
    id={id}
  >
    <Container className={containerClassName}>{children}</Container>
  </section>
);
