import type { ComponentType } from "react";
import type {
  BlockCards,
  BlockContacts,
  BlockDocuments,
  BlockEvents,
  BlockFaq,
  BlockHero,
  BlockImage,
  BlockNews,
  BlockTable,
  BlockText,
  BlockTicker,
  BlockItem,
  BlockCollection,
  BlockProps,
  PageBlock,
} from "../../lib/types";
import { CardsBlock } from "./CardsBlock";
import { ContactsBlock } from "./ContactsBlock";
import { DocumentsBlock } from "./DocumentsBlock";
import { EventsBlock } from "./EventsBlock";
import { FaqBlock } from "./FaqBlock";
import { HeroBlock } from "./HeroBlock";
import { ImageBlock } from "./ImageBlock";
import { NewsBlock } from "./NewsBlock";
import { TableBlock } from "./TableBlock";
import { TextBlock } from "./TextBlock";
import { TickerBlock } from "./TickerBlock";

const BLOCKS: Record<BlockCollection, ComponentType<BlockProps>> = {
  block_hero: ({ item, background }) => (
    <HeroBlock item={item as BlockHero} background={background} />
  ),
  block_text: ({ item, background }) => (
    <TextBlock item={item as BlockText} background={background} />
  ),
  block_image: ({ item, background }) => (
    <ImageBlock item={item as BlockImage} background={background} />
  ),
  block_table: ({ item, background }) => (
    <TableBlock item={item as BlockTable} background={background} />
  ),
  block_cards: ({ item, background }) => (
    <CardsBlock item={item as BlockCards} background={background} />
  ),
  block_faq: ({ item, background }) => (
    <FaqBlock item={item as BlockFaq} background={background} />
  ),
  block_contacts: ({ item, background }) => (
    <ContactsBlock item={item as BlockContacts} background={background} />
  ),
  block_documents: ({ item, background }) => (
    <DocumentsBlock item={item as BlockDocuments} background={background} />
  ),
  block_ticker: ({ item, background }) => (
    <TickerBlock item={item as BlockTicker} background={background} />
  ),
  block_news: ({ item, background }) => (
    <NewsBlock item={item as BlockNews} background={background} />
  ),
  block_events: ({ item, background }) => (
    <EventsBlock item={item as BlockEvents} background={background} />
  ),
};

const isBlockItem = (item: PageBlock["item"]): item is BlockItem =>
  Boolean(item && typeof item === "object");

export const BlockRenderer = ({
  blocks,
}: {
  blocks?: PageBlock[] | null;
}): React.JSX.Element => (
  <>
    {[...(blocks ?? [])]
      .sort((left, right) => (left.sort ?? 0) - (right.sort ?? 0))
      .map((block) => {
        if (!isBlockItem(block.item)) return null;
        const Block = BLOCKS[block.collection as BlockCollection];
        return Block ? (
          <Block
            key={block.id}
            item={block.item}
            background={block.item.background}
          />
        ) : null;
      })}
  </>
);
