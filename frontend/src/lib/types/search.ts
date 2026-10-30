export type SearchResult = Readonly<{
  key: string;
  title: string;
  href: string;
  context: string;
}>;

export type SearchResponse = Readonly<{
  results: SearchResult[];
  hasMore: boolean;
  failedCollections: string[];
}>;
