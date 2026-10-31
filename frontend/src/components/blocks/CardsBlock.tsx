import { DirectusImage } from "../common/DirectusImage";
import { RichText } from "../common/RichText";
import { Section } from "../layout/Section";
import { EMPTY_MESSAGES } from "../../lib/uiMessages";
import type { BlockCards, BlockProps } from "../../lib/types";
import { noticeClassName } from "../common/cardClassName";
import { noticeGridClassName } from "../common/noticeGrid";
import { SectionTitle } from "../common/SectionTitle";

export const CardsBlock = ({
  item,
  background,
}: BlockProps<BlockCards>): React.JSX.Element => (
  <Section background={background}>
    {item.title && <SectionTitle>{item.title}</SectionTitle>}
    {item.cards?.length ? (
      <div className={noticeGridClassName(item.cards.length)}>
        {[...item.cards]
          .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
          .map((card, index) => (
            <article
              className={noticeClassName("flex flex-col px-3 pb-3")}
              key={card.id ?? index}
            >
              {card.image && (
                <DirectusImage
                  asset={card.image}
                  alt={card.title || ""}
                  className="aspect-[16/10] w-full rounded-[calc(var(--cb-radius)/2)] object-cover"
                />
              )}
              <div className="px-3 pb-3 pt-5">
                <h3 className="text-[1.375rem] leading-tight [overflow-wrap:anywhere]">
                  {card.title || ""}
                </h3>
                {card.text && (
                  <RichText
                    className="mt-3 text-muted-foreground [overflow-wrap:anywhere]"
                    content={card.text}
                  />
                )}
              </div>
            </article>
          ))}
      </div>
    ) : (
      <p className="text-base text-muted-foreground">{EMPTY_MESSAGES.cards}</p>
    )}
  </Section>
);
