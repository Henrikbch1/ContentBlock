import type { SearchResult } from "./types";

/** Interleaves independent result sources so one source cannot hide the others. */
export const interleaveSearchResults = (
  sources: readonly (readonly SearchResult[])[],
): SearchResult[] => {
  const results: SearchResult[] = [];
  for (
    let index = 0;
    sources.some((source) => index < source.length);
    index++
  ) {
    for (const source of sources) {
      const result = source[index];
      if (result) results.push(result);
    }
  }
  return results;
};
