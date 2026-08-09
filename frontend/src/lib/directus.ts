import { createDirectus, rest, serverPing, staticToken } from "@directus/sdk";

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
  Category,
  Document,
  Event,
  Footer,
  FooterLink,
  Navigation,
  NavItem,
  News,
  Page,
  PageBlock,
  Person,
  Role,
  Site,
  Theme,
} from "./types";

export type Schema = {
  site: Site;
  navigation: Navigation;
  nav_items: NavItem;
  footer: Footer;
  footer_links: FooterLink;
  theme: Theme;
  pages: Page;
  pages_blocks: PageBlock;
  people: Person;
  roles: Role;
  categories: Category;
  documents: Document;
  news: News;
  events: Event;
  block_hero: BlockHero;
  block_text: BlockText;
  block_image: BlockImage;
  block_table: BlockTable;
  block_cards: BlockCards;
  block_faq: BlockFaq;
  block_contacts: BlockContacts;
  block_documents: BlockDocuments;
  block_ticker: BlockTicker;
  block_news: BlockNews;
  block_events: BlockEvents;
};

const directusUrl = import.meta.env.VITE_DIRECTUS_URL;
const directusToken = import.meta.env.VITE_DIRECTUS_TOKEN;

const missingUrlMessage = "VITE_DIRECTUS_URL is not configured.";

const createDirectusClient = () => {
  const client = createDirectus<Schema>(directusUrl ?? "");
  const restClient = rest({
    onRequest: (options) => ({ ...options, cache: "no-store" }),
  });

  return directusToken
    ? client.with(staticToken(directusToken)).with(restClient)
    : client.with(restClient);
};

export const directus = createDirectusClient();

export const assertDirectusConfigured = (): void => {
  if (!directusUrl) {
    throw new Error(missingUrlMessage);
  }
};

export const pingDirectus = (): Promise<string> => {
  assertDirectusConfigured();
  return directus.request(serverPing());
};
