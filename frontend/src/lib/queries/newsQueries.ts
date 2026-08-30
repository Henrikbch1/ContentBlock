import { readItems } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import { getRelationId } from "../directusRelations";
import type { BlockNews, News } from "../types";

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

export const getNewsForBlock = async (cfg: BlockNews): Promise<News[]> => {
  assertDirectusConfigured();
  const categoryId = getRelationId(cfg.filter_category);
  if (cfg.mode === "by_category" && categoryId === null) {
    return [];
  }

  return (await directus.request(
    readItems("news", {
      fields: NEWS_FIELDS as never,
      filter:
        categoryId === null ? undefined : { category: { _eq: categoryId } },
      sort: ["-published_date"],
      limit: cfg.limit ?? -1,
    }),
  )) as News[];
};

export const getNews = async (): Promise<News[]> => {
  assertDirectusConfigured();
  return (await directus.request(
    readItems("news", {
      fields: NEWS_FIELDS as never,
      sort: ["-published_date"],
    }),
  )) as News[];
};

export const getNewsBySlug = async (slug: string): Promise<News | null> => {
  assertDirectusConfigured();
  const news = (await directus.request(
    readItems("news", {
      fields: NEWS_FIELDS as never,
      filter: { slug: { _eq: slug } },
      limit: 1,
    }),
  )) as News[];
  return news[0] ?? null;
};
