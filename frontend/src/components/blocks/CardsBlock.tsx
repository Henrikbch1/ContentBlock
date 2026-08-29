import { DirectusImage } from "../common/DirectusImage";
import { Section } from "../layout/Section";
import { EMPTY_MESSAGES } from "../../lib/uiMessages";
import type { BlockCards } from "../../lib/types";

export const CardsBlock = ({
  item,
}: {
  item: BlockCards;
}): React.JSX.Element => (
  <Section>
    {item.title && (
      <h2 className="mb-8 text-3xl font-semibold tracking-tight">
        {item.title}
      </h2>
    )}
    {item.cards?.length ? (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...item.cards]
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map((card, index) => (
            <article
              className="overflow-hidden border border-border bg-card"
              key={card.id ?? index}
            >
              {card.image && (
                <DirectusImage
                  asset={card.image}
                  alt={card.title || ""}
                  className="aspect-[16/10] w-full object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold">{card.title || ""}</h3>
                {card.text && (
                  <p className="mt-3 text-muted-foreground">{card.text}</p>
                )}
              </div>
            </article>
          ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">{EMPTY_MESSAGES.cards}</p>
    )}
  </Section>
);
