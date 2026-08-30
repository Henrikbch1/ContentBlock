import type { Category, Document, Page, Role } from "./content";
import type { DirectusAsset, DirectusId, DirectusRelation } from "./directus";

export type BlockMode =
  | "manual"
  | "latest"
  | "upcoming"
  | "by_category"
  | "by_role"
  | string;

export type BlockCollection =
  | "block_hero"
  | "block_text"
  | "block_image"
  | "block_table"
  | "block_cards"
  | "block_faq"
  | "block_contacts"
  | "block_documents"
  | "block_ticker"
  | "block_news"
  | "block_events";

export type BlockItem =
  | BlockHero
  | BlockText
  | BlockImage
  | BlockTable
  | BlockCards
  | BlockFaq
  | BlockContacts
  | BlockDocuments
  | BlockTicker
  | BlockNews
  | BlockEvents;

export interface PageBlock {
  id: DirectusId;
  collection: BlockCollection | string;
  item: BlockItem | DirectusId | null;
  sort?: number | null;
}

export interface HeroButton {
  id?: DirectusId;
  label?: string | null;
  href?: string | null;
  variant?: string | null;
  sort?: number | null;
}

export interface BlockHero {
  id: DirectusId;
  title?: string | null;
  subtitle?: string | null;
  image?: DirectusAsset;
  buttons?: HeroButton[] | null;
}

export interface BlockText {
  id: DirectusId;
  headline?: string | null;
  content?: string | null;
}

export interface BlockImage {
  id: DirectusId;
  image?: DirectusAsset;
  alt?: string | null;
}

export interface BlockTable {
  id: DirectusId;
  title?: string | null;
  data?: unknown;
}

export interface CardItem {
  id?: DirectusId;
  title?: string | null;
  text?: string | null;
  image?: DirectusAsset;
  sort?: number | null;
}

export interface BlockCards {
  id: DirectusId;
  title?: string | null;
  cards?: CardItem[] | null;
}

export interface FaqItem {
  id?: DirectusId;
  question?: string | null;
  answer?: string | null;
  sort?: number | null;
}

export interface BlockFaq {
  id: DirectusId;
  title?: string | null;
  faqs?: FaqItem[] | null;
}

export interface BlockContactsRole {
  id: DirectusId;
  role?: DirectusRelation<Role>;
  sort?: number | null;
}

export interface BlockTickerMessage {
  id?: DirectusId;
  text?: string | null;
  link?: DirectusRelation<Page>;
  sort?: number | null;
}

export interface BlockTicker {
  id: DirectusId;
  background_color?: string | null;
  text_color?: string | null;
  messages?: BlockTickerMessage[] | null;
}

export interface BlockContacts {
  id: DirectusId;
  title?: string | null;
  mode?: BlockMode | null;
  show_photo?: boolean | null;
  show_email?: boolean | null;
  show_phone?: boolean | null;
  layout?: string | null;
  roles?: Array<DirectusRelation<BlockContactsRole>> | null;
}

export interface BlockDocuments {
  id: DirectusId;
  title?: string | null;
  mode?: BlockMode | null;
  filter_category?: DirectusRelation<Category>;
  docs?: Array<DirectusRelation<Document>> | null;
}

export interface BlockNews {
  id: DirectusId;
  title?: string | null;
  mode?: BlockMode | null;
  filter_category?: DirectusRelation<Category>;
  limit?: number | null;
}

export interface BlockEvents {
  id: DirectusId;
  title?: string | null;
  mode?: BlockMode | null;
  filter_category?: DirectusRelation<Category>;
  limit?: number | null;
}
