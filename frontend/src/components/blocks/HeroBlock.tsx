import { getAssetUrl } from "../../lib/directus";
import type { BlockHero, BlockProps } from "../../lib/types";
import { cn } from "../../lib/utils";
import { DirectusImage } from "../common/DirectusImage";
import { sharpSAttribute } from "../common/displayTitle";
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
  const buttons = item.buttons?.filter((button) => button.label) ?? [];
  const title = item.title || "Willkommen";
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[22rem] items-end overflow-hidden sm:min-h-[26rem] lg:min-h-[28rem]",
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
            priority
          />
          <div className="hero-image-overlay absolute inset-0 -z-10 bg-primary/80" />
        </>
      )}
      <Container className="grid gap-6 pb-10 pt-24 sm:pb-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-12 lg:pb-14">
        <h1
          className="display-title text-[2.75rem] leading-none [overflow-wrap:anywhere] sm:text-[4.25rem] lg:text-[5.5rem]"
          {...sharpSAttribute(title)}
        >
          {title}
        </h1>
        {(item.subtitle || buttons.length > 0) && (
          <div className="max-w-xl lg:pb-2">
            {item.subtitle && (
              <p className="text-lg leading-8 text-foreground sm:text-xl">
                {item.subtitle}
              </p>
            )}
            {buttons.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {buttons.map((button) => (
                  <a
                    key={button.id ?? button.label}
                    href={button.href || "#"}
                    className={cn(
                      "inline-flex min-h-12 items-center rounded-card px-5 text-base font-bold transition-colors",
                      button.variant === "secondary"
                        ? "border-2 border-current text-foreground hover:bg-foreground/15"
                        : "hero-primary-action bg-secondary text-secondary-foreground hover:bg-accent-hover",
                    )}
                  >
                    {button.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
};
