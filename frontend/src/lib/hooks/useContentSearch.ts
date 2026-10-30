import { useEffect, useState } from "react";

import { searchContent } from "../queries";
import type { SearchResponse } from "../types";
import { useAsyncResource } from "./useAsyncResource";

const SEARCH_DELAY_MS = 250;
const MIN_SEARCH_LENGTH = 2;

type SearchData = SearchResponse & Readonly<{ query: string }>;
type ContentSearchState = SearchResponse &
  Readonly<{ isLoading: boolean; hasError: boolean }>;

class SearchRequestError extends Error {
  readonly query: string;

  constructor(query: string, cause: unknown) {
    super("Content search failed.", { cause });
    this.query = query;
  }
}

const requestSearch = async (query: string): Promise<SearchData> => {
  if (query.length < MIN_SEARCH_LENGTH) {
    return { query, results: [], hasMore: false, failedCollections: [] };
  }
  try {
    return { query, ...(await searchContent(query)) };
  } catch (error) {
    throw new SearchRequestError(query, error);
  }
};

/** Debounces title searches and prevents results from older queries being shown. */
export const useContentSearch = (query: string): ContentSearchState => {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_DELAY_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [query]);

  const { data, isLoading, error } = useAsyncResource<SearchData>(
    () => requestSearch(debouncedQuery),
    [debouncedQuery],
  );
  const active = query.length >= MIN_SEARCH_LENGTH;
  const currentError =
    error instanceof SearchRequestError && error.query === query;
  const current = !currentError && data?.query === query ? data : null;
  const waiting =
    active &&
    (query !== debouncedQuery || isLoading || (!current && !currentError));

  return {
    results: active && !waiting ? (current?.results ?? []) : [],
    hasMore: active && !waiting && (current?.hasMore ?? false),
    failedCollections:
      active && !waiting ? (current?.failedCollections ?? []) : [],
    isLoading: waiting,
    hasError: active && !waiting && currentError,
  };
};
