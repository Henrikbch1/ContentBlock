import { readItems, readSingleton } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "./directus";
import type {
  BlockContacts,
  BlockDocuments,
  BlockEvents,
  BlockNews,
  DirectusId,
  DirectusRelation,
  Document,
  Event,
  News,
  Page,
  Person,
  Site,
} from "./types";

const SITE_FIELDS = [
  "id",
  "navigation.*",
  "navigation.logo.*",
  "navigation.items.*",
  "navigation.items.parent.*",
  "navigation.items.page.*",
  "footer.*",
  "footer.columns.*",
  "footer.columns.page.*",
  "footer.imprint_page.*",
  "footer.privacy_page.*",
  "theme.*",
] as const;

const PAGE_FIELDS = [
  "id",
  "title",
  "slug",
  "template",
  "blocks.id",
  "blocks.collection",
  "blocks.item",
  "blocks.sort",
  "blocks.item:block_hero.*",
  "blocks.item:block_hero.buttons.*",
  "blocks.item:block_text.*",
  "blocks.item:block_image.*",
  "blocks.item:block_table.*",
  "blocks.item:block_cards.*",
  "blocks.item:block_cards.cards.*",
  "blocks.item:block_faq.*",
  "blocks.item:block_faq.faqs.*",
  "blocks.item:block_contacts.*",
  "blocks.item:block_contacts.roles.*",
  "blocks.item:block_documents.*",
  "blocks.item:block_documents.docs.*",
  "blocks.item:block_ticker.*",
  "blocks.item:block_ticker.messages.*",
  "blocks.item:block_news.*",
  "blocks.item:block_events.*",
] as const;

const NEWS_FIELDS = [
  "id",
  "title",
  "slug",
  "published_date",
  "teaser",
  "cover_image",
  "body",
  "category.*",
] as const;

const EVENT_FIELDS = [
  "id",
  "title",
  "slug",
  "start_date",
  "end_date",
  "location",
  "description",
  "show_days_before",
  "category.*",
] as const;

const DOCUMENT_FIELDS = ["id", "title", "file", "category.*"] as const;

const PERSON_FIELDS = [
  "id",
  "first_name",
  "last_name",
  "role.*",
] as const;

const getRelationId = <T extends { id: DirectusId }>(
  relation: DirectusRelation<T> | undefined,
): DirectusId | null => {
  if (typeof relation === "string" || typeof relation === "number") {
    return relation;
  }

  return relation?.id ?? null;
};

const getRelationIds = <T extends { id: DirectusId }>(
  relations: Array<DirectusRelation<T>> | null | undefined,
): DirectusId[] =>
  (relations ?? [])
    .map((relation) => getRelationId(relation))
    .filter((id): id is DirectusId => id !== null);

export const getSite = async (): Promise<Site | null> => {
  assertDirectusConfigured();
  return directus.request(
    readSingleton("site", {
      fields: SITE_FIELDS,
    }),
  );
};

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  assertDirectusConfigured();
  const pages = await directus.request(
    readItems("pages", {
      filter: { slug: { _eq: slug } },
      fields: PAGE_FIELDS,
      limit: 1,
    }),
  );
  return pages[0] ?? null;
};

export const getPageSlugs = async (): Promise<string[]> => {
  assertDirectusConfigured();
  const pages = await directus.request(
    readItems("pages", {
      fields: ["slug"],
      filter: { slug: { _nnull: true } },
    }),
  );
  return pages.flatMap((page) => (typeof page.slug === "string" ? [page.slug] : []));
};

export const getNewsForBlock = async (cfg: BlockNews): Promise<News[]> => {
  assertDirectusConfigured();
  const categoryId = getRelationId(cfg.filter_category);
  if (cfg.mode === "by_category" && categoryId === null) {
    return [];
  }

  return directus.request(
    readItems("news", {
      fields: NEWS_FIELDS,
      filter: categoryId === null ? undefined : { category: { _eq: categoryId } },
      sort: ["-published_date"],
      limit: cfg.limit ?? -1,
    }),
  );
};

export const getNews = async (): Promise<News[]> => {
  assertDirectusConfigured();
  return directus.request(
    readItems("news", {
      fields: NEWS_FIELDS,
      sort: ["-published_date"],
    }),
  );
};

export const getNewsBySlug = async (slug: string): Promise<News | null> => {
  assertDirectusConfigured();
  const news = await directus.request(
    readItems("news", {
      fields: NEWS_FIELDS,
      filter: { slug: { _eq: slug } },
      limit: 1,
    }),
  );
  return news[0] ?? null;
};

export const getEventsForBlock = async (cfg: BlockEvents): Promise<Event[]> => {
  assertDirectusConfigured();
  const categoryId = getRelationId(cfg.filter_category);
  if (cfg.mode === "by_category" && categoryId === null) {
    return [];
  }

  const filter = {
    ...(cfg.mode === "upcoming"
      ? { start_date: { _gte: new Date().toISOString() } }
      : {}),
    ...(categoryId === null ? {} : { category: { _eq: categoryId } }),
  };

  return directus.request(
    readItems("events", {
      fields: EVENT_FIELDS,
      filter,
      sort: cfg.mode === "upcoming" ? ["start_date"] : ["-start_date"],
      limit: cfg.limit ?? -1,
    }),
  );
};

export const getEvents = async (): Promise<Event[]> => {
  assertDirectusConfigured();
  return directus.request(
    readItems("events", {
      fields: EVENT_FIELDS,
      filter: { start_date: { _gte: new Date().toISOString() } },
      sort: ["start_date"],
    }),
  );
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  assertDirectusConfigured();
  const events = await directus.request(
    readItems("events", {
      fields: EVENT_FIELDS,
      filter: { slug: { _eq: slug } },
      limit: 1,
    }),
  );
  return events[0] ?? null;
};

export const getDocumentsForBlock = async (
  cfg: BlockDocuments,
): Promise<Document[]> => {
  assertDirectusConfigured();
  const categoryId = getRelationId(cfg.filter_category);
  const documentIds = getRelationIds(cfg.docs);
  if (cfg.mode === "manual" && documentIds.length === 0) {
    return [];
  }
  if (cfg.mode === "by_category" && categoryId === null) {
    return [];
  }

  return directus.request(
    readItems("documents", {
      fields: DOCUMENT_FIELDS,
      filter:
        cfg.mode === "manual"
          ? { id: { _in: documentIds } }
          : { category: { _eq: categoryId } },
    }),
  );
};

export const getContactsForBlock = async (
  cfg: BlockContacts,
): Promise<Array<Person & { phone?: string | null }>> => {
  assertDirectusConfigured();
  const roleIds = getRelationIds(cfg.roles);
  if (cfg.mode === "manual" && roleIds.length === 0) {
    return [];
  }
  if (cfg.mode === "by_role" && roleIds.length === 0) {
    return [];
  }
  const fields = [
    ...PERSON_FIELDS,
    ...(cfg.show_photo ? ["photo"] : []),
    ...(cfg.show_email ? ["email"] : []),
    ...(cfg.show_phone ? ["phone"] : []),
  ];

  return directus.request(
    readItems("people", {
      fields,
      filter: { role: { _in: roleIds } },
    }),
  );
};
