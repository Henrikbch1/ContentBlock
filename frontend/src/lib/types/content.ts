import type { PageBlock } from "./blocks";
import type { DirectusAsset, DirectusId, DirectusRelation } from "./directus";

export type NavItemType = "group" | "page" | "url" | string;

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
  brand_text?: string | null;
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
