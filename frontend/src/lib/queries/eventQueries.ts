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
  "visible_from",
  "category.*",
] as const;

/** Sichtbar: visible_from erreicht (oder leer) und Termin noch nicht vorbei. */
export const buildVisibleEventsFilter = (now: string) => ({
  _and: [
    {
      _or: [{ visible_from: { _null: true } }, { visible_from: { _lte: now } }],
    },
    {
      _or: [
        { end_date: { _gte: now } },
        {
          _and: [{ end_date: { _null: true } }, { start_date: { _gte: now } }],
        },
      ],
    },
  ],
});

export const getEventsForBlock = async (cfg: BlockEvents): Promise<Event[]> => {
  assertDirectusConfigured();
  const categoryId = getRelationId(cfg.filter_category);
  if (cfg.mode === "by_category" && categoryId === null) {
    return [];
  }

  const filter = {
    _and: [
      buildVisibleEventsFilter(new Date().toISOString()),
      ...(categoryId === null ? [] : [{ category: { _eq: categoryId } }]),
    ],
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
      filter: buildVisibleEventsFilter(new Date().toISOString()) as never,
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
