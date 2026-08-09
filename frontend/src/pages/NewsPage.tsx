import { ArrowLeft, ArrowUpRight, Newspaper, Tag } from "lucide-react";
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
  article.category && typeof article.category === "object"
    ? (article.category.name ?? null)
    : null;

const NewsOverview = (): React.JSX.Element => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    document.title = "Aktuelles | ContentBlock";
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
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          <Newspaper aria-hidden="true" size={17} /> Aus dem Verein
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Aktuelles
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Neuigkeiten, Berichte und wichtige Informationen rund um den
          Angelsportverein.
        </p>
      </header>
      {isLoading && (
        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          role="status"
        >
          Nachrichten werden geladen ...
        </p>
      )}
      {!isLoading && hasError && (
        <EmptyState message="Nachrichten konnten nicht geladen werden." />
      )}
      {!isLoading && !hasError && news.length === 0 && (
        <EmptyState message="Keine Nachrichten vorhanden." />
      )}
      {!isLoading && !hasError && news.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <a
              className="group flex min-h-80 flex-col overflow-hidden border border-border bg-card transition-colors hover:border-primary"
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
                <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <p>{formatDate(article.published_date)}</p>
                  {getCategoryName(article) && (
                    <p className="flex items-center gap-1">
                      <Tag aria-hidden="true" size={14} />
                      {getCategoryName(article)}
                    </p>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight group-hover:text-primary">
                  {article.title ?? "Ohne Titel"}
                </h2>
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
          document.title = loadedArticle?.title
            ? `${loadedArticle.title} | Aktuelles`
            : "Aktuelles | ContentBlock";
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

  if (isLoading)
    return (
      <p
        aria-live="polite"
        className="px-4 py-16 text-center text-sm text-muted-foreground"
        role="status"
      >
        Beitrag wird geladen ...
      </p>
    );
  if (hasError)
    return <EmptyState message="Der Beitrag konnte nicht geladen werden." />;
  if (!article)
    return <NotFoundPage message="Der Beitrag wurde nicht gefunden." />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <a
        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        href="/news"
      >
        <ArrowLeft aria-hidden="true" size={16} /> Alle Beiträge
      </a>
      {article.cover_image && (
        <DirectusImage
          asset={article.cover_image}
          alt={article.title ?? ""}
          className="mb-8 aspect-video w-full object-cover"
        />
      )}
      <p className="text-sm text-muted-foreground">
        {formatDate(article.published_date)}
        {getCategoryName(article) ? ` | ${getCategoryName(article)}` : ""}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        {article.title ?? "Ohne Titel"}
      </h1>
      {article.teaser && (
        <p className="mt-6 text-lg text-muted-foreground">{article.teaser}</p>
      )}
      <RichText content={article.body} className="mt-8 leading-7" />
    </article>
  );
};

export const NewsPage = ({ slug }: NewsPageProps): React.JSX.Element =>
  slug ? <NewsDetail slug={slug} /> : <NewsOverview />;
