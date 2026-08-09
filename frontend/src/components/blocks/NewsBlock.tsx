import { useEffect, useState } from "react";

import { getNewsForBlock } from "../../lib/queries";
import type { News, BlockNews } from "../../lib/types";
import { DirectusImage } from "../common/DirectusImage";
import { EmptyState } from "../common/EmptyState";

const formatDate = (date: string | null | undefined): string =>
  date ? new Date(date).toLocaleDateString("de-DE") : "";

export const NewsBlock = ({ item }: { item: BlockNews }): React.JSX.Element => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async (): Promise<void> => {
      setIsLoading(true);
      setHasError(false);
      try {
        const loadedNews = await getNewsForBlock(item);
        if (isMounted) setNews(loadedNews);
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadNews();
    return () => {
      isMounted = false;
    };
  }, [item]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {item.title && <h2 className="mb-6 text-3xl font-semibold tracking-tight">{item.title}</h2>}
      {isLoading && <p aria-live="polite" className="text-sm text-muted-foreground" role="status">Nachrichten werden geladen ...</p>}
      {!isLoading && hasError && <EmptyState message="Nachrichten konnten nicht geladen werden." />}
      {!isLoading && !hasError && news.length === 0 && <EmptyState message="Keine Nachrichten vorhanden." />}
      {!isLoading && !hasError && news.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <a className="block overflow-hidden border border-border bg-card transition-colors hover:border-primary" href={`/news/${article.slug ?? article.id}`} key={article.id}>
              {article.cover_image && <DirectusImage asset={article.cover_image} alt={article.title ?? ""} className="aspect-16/10 w-full object-cover" />}
              <div className="p-6">
                {article.published_date && <p className="text-sm text-muted-foreground">{formatDate(article.published_date)}</p>}
                <h3 className="mt-2 text-xl font-semibold">{article.title ?? ""}</h3>
                {article.teaser && <p className="mt-3 text-muted-foreground">{article.teaser}</p>}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};
