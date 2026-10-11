import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";
import type { SectionBackground } from "../../lib/types";
import { Container } from "./Container";

type SectionProps = PropsWithChildren<{
  ariaLabel?: string;
  background?: SectionBackground | null;
  className?: string;
  containerClassName?: string;
  id?: string;
}>;

const BACKGROUND_CLASSES: Record<SectionBackground, string> = {
  default: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  primary: "bg-primary text-foreground",
};

export const resolveSectionBackground = (
  background: SectionBackground | null | undefined,
  fallback: SectionBackground = "default",
): SectionBackground =>
  background && Object.hasOwn(BACKGROUND_CLASSES, background)
    ? background
    : fallback;

export const getSectionBackgroundClasses = (
  background: SectionBackground,
): string => BACKGROUND_CLASSES[background];

export const Section = ({
  children,
  ariaLabel,
  background,
  className,
  containerClassName,
  id,
}: SectionProps): React.JSX.Element => {
  const resolved = resolveSectionBackground(background);
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "py-section",
        getSectionBackgroundClasses(resolved),
        className,
      )}
      data-background={resolved}
      id={id}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
};
