import type { PropsWithChildren } from "react";
import { Container } from "./Container";

type SectionProps = PropsWithChildren<{
  ariaLabel?: string;
  className?: string;
  id?: string;
}>;

export const Section = ({
  children,
  ariaLabel,
  className = "",
  id,
}: SectionProps): React.JSX.Element => (
  <section aria-label={ariaLabel} className={`py-12 sm:py-16 ${className}`} id={id}>
    <Container>{children}</Container>
  </section>
);