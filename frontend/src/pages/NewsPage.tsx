import { useEffect, useState } from "react";
import { DirectusImage } from "../components/common/DirectusImage";
import { EmptyState } from "../components/common/EmptyState";
import { RichText } from "../components/common/RichText";
import { getNews, getNewsBySlug } from "../lib/queries";
import type { News } from "../lib/types";
import { formatDate } from "./format";
import { NotFoundPage } from "./NotFoundPage";

type NewsPageProps = {
  slug?: string;
};

const getCategoryName = (article: News): string | null =>
  article.category && typeof article.category === "object" ? article.category.name ?? null : null;

const NewsOverview = (): React.JSX.Element => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    document.title = "News | ContentBlock";
    let isMounted = true;
    void getNews()
      .then((loadedNews) => {
        if (isMounted) setNews(loadedNews);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">News</h1>
      {isLoading && <p aria-live="polite" className="text-sm text-muted-foreground" role="status">News wird geladen ...</p>}
      {!isLoading && hasError && <EmptyState message="News konnten nicht geladen werden." />}
      {!isLoading && !hasError && news.length === 0 && <EmptyState message="Keine News vorhanden." />}
      {!isLoading && !hasError && news.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <a className="overflow-hidden border border-border bg-card transition-colors hover:border-primary" href={`/news/${article.slug ?? article.id}`} key={article.id}>
              {article.cover_image && <DirectusImage asset={article.cover_image} alt={article.title ?? ""} className="aspect-[16/10] w-full object-cover" />}
              <div className="p-6">
                <p className="text-sm text-muted-foreground">{formatDate(article.published_date)}</p>
                <h2 className="mt-2 text-xl font-semibold">{article.title ?? "Ohne Titel"}</h2>
                {article.teaser && <p className="mt-3 text-muted-foreground">{article.teaser}</p>}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

const NewsDetail = ({ slug }: { slug: string }): React.JSX.Element => {
  const [article, setArticle] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    void getNewsBySlug(slug)
      .then((loadedArticle) => {
        if (isMounted) {
          setArticle(loadedArticle);
          document.title = loadedArticle?.title ? `${loadedArticle.title} | News` : "News | ContentBlock";
        }
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) return <p aria-live="polite" className="px-4 py-16 text-center text-sm text-muted-foreground" role="status">News wird geladen ...</p>;
  if (hasError) return <EmptyState message="Die News konnte nicht geladen werden." />;
  if (!article) return <NotFoundPage message="Die News wurde nicht gefunden." />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {article.cover_image && <DirectusImage asset={article.cover_image} alt={article.title ?? ""} className="mb-8 aspect-[16/9] w-full object-cover" />}
      <p className="text-sm text-muted-foreground">{formatDate(article.published_date)}{getCategoryName(article) ? ` | ${getCategoryName(article)}` : ""}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{article.title ?? "Ohne Titel"}</h1>
      {article.teaser && <p className="mt-6 text-lg text-muted-foreground">{article.teaser}</p>}
      <RichText content={article.body} className="mt-8 leading-7" />
    </article>
  );
};

export const NewsPage = ({ slug }: NewsPageProps): React.JSX.Element =>
  slug ? <NewsDetail slug={slug} /> : <NewsOverview />;
