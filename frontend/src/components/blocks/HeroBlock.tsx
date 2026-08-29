import { DirectusImage } from "../common/DirectusImage";
import { Container } from "../layout/Container";
import type { BlockHero } from "../../lib/types";

export const HeroBlock = ({ item }: { item: BlockHero }): React.JSX.Element => (
  <section className="relative isolate flex min-h-125 items-end overflow-hidden bg-primary text-primary-foreground sm:min-h-150">
    <DirectusImage
      asset={item.image}
      alt=""
      className="absolute inset-0 -z-20 h-full w-full object-cover"
    />
    <div className="absolute inset-0 -z-10 bg-primary/80" />
    <Container className="py-16 lg:py-24">
      <div className="max-w-3xl">
        <div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
            {item.title || "Willkommen"}
          </h1>
          {item.subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/85">
              {item.subtitle}
            </p>
          )}
        </div>
        {item.buttons?.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {item.buttons
              .filter((button) => button.label)
              .map((button) => (
                <a
                  key={button.id ?? button.label}
                  href={button.href || "#"}
                  className={
                    button.variant === "secondary"
                      ? "border border-primary-foreground/70 px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary"
                      : "bg-secondary px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[#f3c972]"
                  }
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
