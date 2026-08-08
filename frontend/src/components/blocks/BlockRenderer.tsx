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

const BLOCKS: Record<BlockCollection, ComponentType<{ item: BlockItem }>> = {
  block_hero: ({ item }) => <HeroBlock item={item as BlockHero} />,
  block_text: ({ item }) => <TextBlock item={item as BlockText} />,
  block_image: ({ item }) => <ImageBlock item={item as BlockImage} />,
  block_table: ({ item }) => <TableBlock item={item as BlockTable} />,
  block_cards: ({ item }) => <CardsBlock item={item as BlockCards} />,
  block_faq: ({ item }) => <FaqBlock item={item as BlockFaq} />,
  block_contacts: ({ item }) => <ContactsBlock item={item as BlockContacts} />,
  block_documents: ({ item }) => <DocumentsBlock item={item as BlockDocuments} />,
  block_ticker: ({ item }) => <TickerBlock item={item as BlockTicker} />,
  block_news: ({ item }) => <NewsBlock item={item as BlockNews} />,
  block_events: ({ item }) => <EventsBlock item={item as BlockEvents} />,
};

const isBlockItem = (item: PageBlock["item"]): item is BlockItem =>
  Boolean(item && typeof item === "object");

export const BlockRenderer = ({ blocks }: { blocks?: PageBlock[] | null }): React.JSX.Element => (
  <>
    {[...(blocks ?? [])]
      .sort((left, right) => (left.sort ?? 0) - (right.sort ?? 0))
      .map((block) => {
        if (!isBlockItem(block.item)) return null;
        const Block = BLOCKS[block.collection as BlockCollection];
        return Block ? <Block key={block.id} item={block.item} /> : null;
      })}
  </>
);
