import { readItems } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import { interleaveSearchResults } from "../searchResults";
import type {
  DirectusId,
  Event,
  News,
  Page,
  SearchResponse,
  SearchResult,
} from "../types";
import { buildVisibleEventsFilter } from "./eventQueries";

const SEARCH_FIELDS = ["id", "title", "slug"] as const;
const RESULTS_PER_COLLECTION = 8;

type SearchItem = Readonly<{
  id: DirectusId;
  title?: string | null;
  slug?: string | null;
}>;

const makePath = (slug: string, prefix: string): string => {
  const segments = slug.split("/").filter(Boolean).map(encodeURIComponent);
  if (!prefix && segments.length === 1 && segments[0] === "home") return "/";
  return `/${[prefix, ...segments].filter(Boolean).join("/")}`;
};

const toResults = (
  items: SearchItem[],
  context: string,
  prefix: string,
): SearchResult[] =>
  items.slice(0, RESULTS_PER_COLLECTION).flatMap((item) => {
    const title = item.title?.trim();
    const slug = item.slug?.trim();
    if (!title || !slug || !slug.split("/").some(Boolean)) return [];
    return [
      {
        key: `${context}:${item.id}`,
        title,
        href: makePath(slug, prefix),
        context,
      },
    ];
  });

/** Searches public page, news and currently visible event titles. */
export const searchContent = async (query: string): Promise<SearchResponse> => {
  assertDirectusConfigured();
  const titleFilter = { title: { _icontains: query } };
  const options = {
    fields: SEARCH_FIELDS as never,
    sort: "title" as const,
    limit: RESULTS_PER_COLLECTION + 1,
  };
  const [pageResponse, newsResponse, eventResponse] = await Promise.allSettled([
    directus.request(
      readItems("pages", { ...options, filter: titleFilter as never }),
    ) as Promise<Page[]>,
    directus.request(
      readItems("news", { ...options, filter: titleFilter as never }),
    ) as Promise<News[]>,
    directus.request(
      readItems("events", {
        ...options,
        filter: {
          _and: [
            titleFilter,
            buildVisibleEventsFilter(new Date().toISOString()),
          ],
        } as never,
      }),
    ) as Promise<Event[]>,
  ]);
  const pages = pageResponse.status === "fulfilled" ? pageResponse.value : [];
  const news = newsResponse.status === "fulfilled" ? newsResponse.value : [];
  const events =
    eventResponse.status === "fulfilled" ? eventResponse.value : [];
  const failedCollections = [
    ...(pageResponse.status === "rejected" ? ["Seiten"] : []),
    ...(newsResponse.status === "rejected" ? ["Nachrichten"] : []),
    ...(eventResponse.status === "rejected" ? ["Termine"] : []),
  ];

  return {
    results: interleaveSearchResults([
      toResults(pages, "Seite", ""),
      toResults(news, "Nachricht", "news"),
      toResults(events, "Termin", "termine"),
    ]),
    hasMore: [pages, news, events].some(
      (items) => items.length > RESULTS_PER_COLLECTION,
    ),
    failedCollections,
  };
};
