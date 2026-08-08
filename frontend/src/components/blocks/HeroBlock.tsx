import { DirectusImage } from "../common/DirectusImage";
import type { BlockHero } from "../../lib/types";

export const HeroBlock = ({ item }: { item: BlockHero }): React.JSX.Element => (
  <section className="relative overflow-hidden border-b border-border bg-muted">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{item.title || "Willkommen"}</h1>
          {item.subtitle && <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{item.subtitle}</p>}
        </div>
        {item.buttons?.length ? (
          <div className="flex flex-wrap gap-3">
            {item.buttons.filter((button) => button.label).map((button) => (
              <a key={button.id ?? button.label} href={button.href || "#"} className={button.variant === "secondary" ? "border border-border px-5 py-3 text-sm font-medium hover:bg-background" : "bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"}>
                {button.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <DirectusImage asset={item.image} alt={item.title || ""} className="aspect-[4/3] h-full w-full object-cover" />
    </div>
  </section>
);
