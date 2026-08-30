import { readItems } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import { getRelationId } from "../directusRelations";
import type { BlockEvents, Event } from "../types";

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

  return (await directus.request(
    readItems("events", {
      fields: EVENT_FIELDS as never,
      filter: filter as never,
      sort: cfg.mode === "upcoming" ? ["start_date"] : ["-start_date"],
      limit: cfg.limit ?? -1,
    }),
  )) as Event[];
};

export const getEvents = async (): Promise<Event[]> => {
  assertDirectusConfigured();
  return (await directus.request(
    readItems("events", {
      fields: EVENT_FIELDS as never,
      filter: { start_date: { _gte: new Date().toISOString() } } as never,
      sort: ["start_date"],
    }),
  )) as Event[];
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  assertDirectusConfigured();
  const events = (await directus.request(
    readItems("events", {
      fields: EVENT_FIELDS as never,
      filter: { slug: { _eq: slug } },
      limit: 1,
    }),
  )) as Event[];
  return events[0] ?? null;
};
