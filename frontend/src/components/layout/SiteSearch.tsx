import { Search } from "lucide-react";
import { useId, useRef, useState } from "react";

import { useContentSearch } from "../../lib/hooks/useContentSearch";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { NavItem, SearchResult } from "../../lib/types";
import { mergeSearchResults, searchNavigation } from "./navSearch";

const MAX_RESULTS = 10;

type SiteSearchProps = Readonly<{
  items: NavItem[];
}>;

export const SiteSearch = ({ items }: SiteSearchProps): React.JSX.Element => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const resultsId = useId();
  const search = query.trim();
  const content = useContentSearch(isOpen ? search : "");
  const navigation =
    isOpen && search.length >= 2 ? searchNavigation(items, search) : [];
  const allResults = mergeSearchResults(navigation, content.results);
  const visibleResults = allResults.slice(0, MAX_RESULTS);
  const hasMore = content.hasMore || allResults.length > MAX_RESULTS;

  const closeSearch = (): void => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <form
      className="relative w-full"
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          inputRef.current?.focus();
          setIsOpen(false);
        }
      }}
      onSubmit={(event) => {
        event.preventDefault();
        event.currentTarget
          .querySelector<HTMLAnchorElement>("[data-search-result]")
          ?.focus();
      }}
      role="search"
    >
      <div className="flex min-h-11 items-center gap-2 rounded-card border border-rail-edge bg-rail-foreground/10 px-3 text-rail-foreground focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-rail-foreground">
        <Search aria-hidden="true" className="shrink-0" size={18} />
        <label className="shrink-0 text-sm font-semibold" htmlFor={inputId}>
          Suche
        </label>
        <input
          aria-controls={isOpen ? resultsId : undefined}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-base text-rail-foreground placeholder:text-rail-foreground/70 focus-visible:outline-none"
          id={inputId}
          maxLength={80}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Seiten, Nachrichten, Termine"
          ref={inputRef}
          type="search"
          value={query}
        />
      </div>
      {isOpen && (
        <div
          className="ctx-default absolute left-0 right-0 top-full mt-2 max-h-[min(60vh,24rem)] overflow-y-auto rounded-card border border-input bg-card p-3 text-card-foreground shadow-card"
          id={resultsId}
        >
          <p className="text-sm text-muted-foreground">
            Navigation und Titel von Seiten, Nachrichten und Terminen.
          </p>
          {search.length < 2 ? (
            <p className="mt-3 text-sm">Mindestens zwei Zeichen eingeben.</p>
          ) : (
            <>
              {content.isLoading && (
                <p className="mt-3 text-sm" role="status">
                  {LOADING_MESSAGES.search}
                </p>
              )}
              {content.hasError && (
                <p className="mt-3 text-sm" role="alert">
                  {ERROR_MESSAGES.search}
                </p>
              )}
              {content.failedCollections.length > 0 && (
                <p className="mt-3 text-sm" role="alert">
                  Nicht durchsucht: {content.failedCollections.join(", ")}.
                  Bitte später erneut versuchen.
                </p>
              )}
              {!content.isLoading &&
                !content.hasError &&
                content.failedCollections.length === 0 &&
                visibleResults.length === 0 && (
                  <p className="mt-3 text-sm" role="status">
                    {EMPTY_MESSAGES.search}
                  </p>
                )}
              {!content.isLoading &&
                !content.hasError &&
                visibleResults.length > 0 && (
                  <p className="mt-3 text-sm" role="status">
                    {visibleResults.length} Treffer angezeigt.
                  </p>
                )}
              <SearchResultList
                results={visibleResults}
                onNavigate={closeSearch}
              />
              {hasMore && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Weitere Treffer vorhanden. Bitte die Suche verfeinern.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );
};

const SearchResultList = ({
  results,
  onNavigate,
}: Readonly<{
  results: SearchResult[];
  onNavigate: () => void;
}>): React.JSX.Element | null =>
  results.length ? (
    <ul className="mt-3 flex flex-col gap-1">
      {results.map((result) => (
        <li key={result.key}>
          <a
            className="flex min-h-11 flex-col justify-center rounded-card px-3 py-2 text-foreground hover:bg-muted"
            data-search-result
            href={result.href}
            onClick={onNavigate}
          >
            <span className="font-semibold [overflow-wrap:anywhere]">
              {result.title}
            </span>
            <span className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
              {result.context}
            </span>
          </a>
        </li>
      ))}
    </ul>
  ) : null;
