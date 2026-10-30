import { getAssetUrl } from "../../lib/directus";
import type { BlockHero, BlockProps } from "../../lib/types";
import { cn } from "../../lib/utils";
import { DirectusImage } from "../common/DirectusImage";
import { Container } from "../layout/Container";
import {
  getSectionBackgroundClasses,
  resolveSectionBackground,
} from "../layout/Section";

export const HeroBlock = ({
  item,
  background,
}: BlockProps<BlockHero>): React.JSX.Element => {
  const hasImage = Boolean(getAssetUrl(item.image));
  const tone = hasImage
    ? "primary"
    : resolveSectionBackground(background, "primary");
  return (
    <section
      className={cn(
        "relative isolate flex min-h-125 items-end overflow-hidden sm:min-h-150",
        getSectionBackgroundClasses(tone),
      )}
      data-background={tone}
      data-hero-image={hasImage || undefined}
    >
      {hasImage && (
        <>
          <DirectusImage
            asset={item.image}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="hero-image-overlay absolute inset-0 -z-10 bg-primary/80" />
        </>
      )}
      <Container className="py-16 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="max-w-3xl text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
            {item.title || "Willkommen"}
          </h1>
          {item.subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              {item.subtitle}
            </p>
          )}
          {item.buttons?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {item.buttons
                .filter((button) => button.label)
                .map((button) => (
                  <a
                    key={button.id ?? button.label}
                    href={button.href || "#"}
                    className={cn(
                      "rounded-card px-5 py-3 text-sm font-semibold transition-colors",
                      button.variant === "secondary"
                        ? "border border-current text-foreground hover:bg-foreground/15"
                        : "hero-primary-action bg-secondary text-secondary-foreground hover:bg-accent-hover",
                    )}
                  >
                    {button.label}
                  </a>
                ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
};
