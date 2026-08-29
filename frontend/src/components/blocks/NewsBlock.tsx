import { ArrowUpRight } from "lucide-react";

import { getNewsForBlock } from "../../lib/queries";
import { formatDate } from "../../lib/format";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { BlockNews } from "../../lib/types";
import { DirectusImage } from "../common/DirectusImage";
import { EmptyState } from "../common/EmptyState";
import { Section } from "../layout/Section";

export const NewsBlock = ({ item }: { item: BlockNews }): React.JSX.Element => {
  const {
    data: news,
    isLoading,
    hasError,
  } = useAsyncResource(() => getNewsForBlock(item), [item]);
  const newsList = news ?? [];

  return (
    <Section>
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">
          {item.title}
        </h2>
      )}
      {isLoading && (
        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          role="status"
        >
          {LOADING_MESSAGES.news}
        </p>
      )}
      {!isLoading && hasError && <EmptyState message={ERROR_MESSAGES.news} />}
      {!isLoading && !hasError && newsList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.news} />
      )}
      {!isLoading && !hasError && newsList.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newsList.map((article) => (
            <a
              className="group flex min-h-64 flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary"
              href={`/news/${article.slug ?? article.id}`}
              key={article.id}
            >
              {article.cover_image && (
                <DirectusImage
                  asset={article.cover_image}
                  alt={article.title ?? ""}
                  className="aspect-16/10 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="flex flex-1 flex-col p-6">
                {article.published_date && (
                  <p className="text-sm font-medium text-primary">
                    {formatDate(article.published_date)}
                  </p>
                )}
                <h3 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-primary">
                  {article.title ?? ""}
                </h3>
                {article.teaser && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {article.teaser}
                  </p>
                )}
                <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-foreground">
                  Beitrag öffnen <ArrowUpRight aria-hidden="true" size={16} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </Section>
  );
};
