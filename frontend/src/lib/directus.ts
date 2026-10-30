import { createDirectus, rest, staticToken } from "@directus/sdk";

import { getAssetId } from "./directusRelations";
import type {
  BlockCards,
  BlockContacts,
  BlockContactsRole,
  BlockDocuments,
  BlockDocumentsLink,
  BlockEvents,
  BlockFaq,
  BlockHero,
  BlockImage,
  BlockNews,
  BlockTable,
  BlockText,
  BlockTicker,
  Category,
  DirectusAsset,
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
  navigation: Navigation[];
  nav_items: NavItem[];
  footer: Footer[];
  footer_links: FooterLink[];
  theme: Theme[];
  pages: Page[];
  pages_blocks: PageBlock[];
  people: Person[];
  roles: Role[];
  categories: Category[];
  documents: Document[];
  news: News[];
  events: Event[];
  block_hero: BlockHero[];
  block_text: BlockText[];
  block_image: BlockImage[];
  block_table: BlockTable[];
  block_cards: BlockCards[];
  block_contacts_roles: BlockContactsRole[];
  block_faq: BlockFaq[];
  block_contacts: BlockContacts[];
  block_documents: BlockDocuments[];
  block_docs_docs: BlockDocumentsLink[];
  block_ticker: BlockTicker[];
  block_news: BlockNews[];
  block_events: BlockEvents[];
};

const directusUrl = import.meta.env.VITE_DIRECTUS_URL?.replace(/\/$/, "");
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

export const getAssetUrl = (
  asset: DirectusAsset | undefined,
): string | null => {
  const assetId = getAssetId(asset);
  return assetId !== null && directusUrl
    ? `${directusUrl}/assets/${assetId}`
    : null;
};
