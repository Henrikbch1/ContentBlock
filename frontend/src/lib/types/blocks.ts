import type { Category, Document, Page, Role } from "./content";
import type { DirectusAsset, DirectusId, DirectusRelation } from "./directus";

export type SectionBackground = "default" | "surface" | "primary";

export type BlockMode =
  "manual" | "latest" | "upcoming" | "by_category" | "by_role";

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
  | "block_events"
  | "block_quicklinks";

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
  | BlockEvents
  | BlockQuicklinks;

export interface PageBlock {
  id: DirectusId;
  collection: BlockCollection | string;
  item: BlockItem | DirectusId | null;
  sort?: number | null;
}

export interface BlockBase {
  id: DirectusId;
  background?: SectionBackground | null;
}

export interface BlockProps<T extends BlockBase = BlockItem> {
  item: T;
  background?: SectionBackground | null;
}

export interface HeroButton {
  id?: DirectusId;
  label?: string | null;
  href?: string | null;
  variant?: string | null;
  sort?: number | null;
}

export interface BlockHero extends BlockBase {
  title?: string | null;
  subtitle?: string | null;
  image?: DirectusAsset;
  buttons?: HeroButton[] | null;
}

export interface BlockText extends BlockBase {
  headline?: string | null;
  content?: string | null;
}

export interface BlockImage extends BlockBase {
  image?: DirectusAsset;
  alt?: string | null;
}

export interface BlockTable extends BlockBase {
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

export interface BlockCards extends BlockBase {
  title?: string | null;
  cards?: CardItem[] | null;
}

export interface FaqItem {
  id?: DirectusId;
  question?: string | null;
  answer?: string | null;
  sort?: number | null;
}

export interface BlockFaq extends BlockBase {
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

export interface BlockTicker extends BlockBase {
  background_color?: string | null;
  text_color?: string | null;
  messages?: BlockTickerMessage[] | null;
}

export type ContactLayout = "form" | "list" | "grid";

export interface BlockContacts extends BlockBase {
  title?: string | null;
  mode?: BlockMode | null;
  show_photo?: boolean | null;
  show_email?: boolean | null;
  show_phone?: boolean | null;
  layout?: ContactLayout | null;
  roles?: Array<DirectusRelation<BlockContactsRole>> | null;
}

export interface BlockDocumentsLink {
  id: DirectusId;
  document?: DirectusRelation<Document>;
  sort?: number | null;
}

export interface BlockDocuments extends BlockBase {
  title?: string | null;
  mode?: BlockMode | null;
  filter_category?: DirectusRelation<Category>;
  docs?: Array<DirectusRelation<BlockDocumentsLink>> | null;
}

export interface BlockNews extends BlockBase {
  title?: string | null;
  mode?: BlockMode | null;
  filter_category?: DirectusRelation<Category>;
  limit?: number | null;
}

export interface BlockEvents extends BlockBase {
  title?: string | null;
  mode?: BlockMode | null;
  filter_category?: DirectusRelation<Category>;
  limit?: number | null;
}

export interface QuicklinkItem {
  id?: DirectusId;
  label?: string | null;
  /** Symbolschlüssel aus der festen Liste (`iconRegistry.ts`). */
  icon?: string | null;
  text?: string | null;
  page?: DirectusRelation<Page>;
  external_url?: string | null;
  sort?: number | null;
}

export interface BlockQuicklinks extends BlockBase {
  title?: string | null;
  items?: QuicklinkItem[] | null;
}
