export type DirectusId = string | number;
export type DirectusAsset = DirectusId | { id: DirectusId } | null;
export type DirectusRelation<T> = T | DirectusId | null;

export type NavItemType = "group" | "page" | "url" | string;
export type BlockMode = "manual" | "latest" | "upcoming" | "by_category" | "by_role" | string;

export interface Theme {
  id: DirectusId;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  background_color?: string | null;
  text_color?: string | null;
  font_heading?: string | null;
  border_radius?: string | null;
}

export interface NavItem {
  id: DirectusId;
  navigation?: DirectusRelation<DirectusId>;
  label?: string | null;
  parent?: DirectusRelation<NavItem>;
  type?: NavItemType | null;
  page?: DirectusRelation<Page>;
  external_url?: string | null;
  sort?: number | null;
}

export interface Navigation {
  id: DirectusId;
  logo?: DirectusAsset;
  items?: NavItem[] | null;
}

export interface FooterLink {
  id: DirectusId;
  footer?: DirectusRelation<DirectusId>;
  label?: string | null;
  page?: DirectusRelation<Page>;
  external_url?: string | null;
  sort?: number | null;
}

export interface Footer {
  id: DirectusId;
  copyright?: string | null;
  imprint_page?: DirectusRelation<Page>;
  privacy_page?: DirectusRelation<Page>;
  columns?: FooterLink[] | null;
}

export interface Site {
  id: DirectusId;
  navigation?: DirectusRelation<Navigation>;
  footer?: DirectusRelation<Footer>;
  theme?: DirectusRelation<Theme>;
}

export interface Page {
  id: DirectusId;
  title?: string | null;
  slug?: string | null;
  template?: string | null;
  blocks?: PageBlock[] | null;
  user_created?: DirectusId | null;
  date_created?: string | null;
  user_updated?: DirectusId | null;
  date_updated?: string | null;
}

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

export interface BlockTickerMessage {
  id?: DirectusId;
  text?: string | null;
  link?: string | null;
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
  roles?: Array<DirectusRelation<Role>> | null;
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

export interface Category {
  id: DirectusId;
  name?: string | null;
  slug?: string | null;
  parent?: DirectusRelation<Category>;
  sort?: number | null;
}

export interface Role {
  id: DirectusId;
  name?: string | null;
  parent?: DirectusRelation<Role>;
  sort?: number | null;
}

export interface Person {
  id: DirectusId;
  first_name?: string | null;
  last_name?: string | null;
  role?: DirectusRelation<Role>;
  photo?: DirectusAsset;
  email?: string | null;
}

export interface Document {
  id: DirectusId;
  title?: string | null;
  file?: DirectusAsset;
  category?: DirectusRelation<Category>;
}

export interface News {
  id: DirectusId;
  title?: string | null;
  slug?: string | null;
  published_date?: string | null;
  teaser?: string | null;
  cover_image?: DirectusAsset;
  body?: string | null;
  category?: DirectusRelation<Category>;
}

export interface Event {
  id: DirectusId;
  title?: string | null;
  slug?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  description?: string | null;
  show_days_before?: number | null;
  category?: DirectusRelation<Category>;
}
