import { ArrowUpRight, Newspaper, Tag } from "lucide-react";
import { BackLink } from "../components/common/BackLink";
import { DirectusImage } from "../components/common/DirectusImage";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { RichText } from "../components/common/RichText";
import { useAsyncResource } from "../lib/hooks/useAsyncResource";
import { usePageTitle } from "../lib/hooks/usePageTitle";
import { formatDate } from "../lib/format";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../lib/uiMessages";
import { getNews, getNewsBySlug } from "../lib/queries";
import type { News } from "../lib/types";
import { NotFoundPage } from "./NotFoundPage";

type NewsPageProps = {
  slug?: string;
};

const getCategoryName = (article: News): string | null =>
  article.category && typeof article.category === "object"
    ? (article.category.name ?? null)
    : null;

const NewsOverview = (): React.JSX.Element => {
  const { data: news, isLoading, hasError } = useAsyncResource(getNews, []);
  const newsList = news ?? [];

  usePageTitle("Aktuelles | ContentBlock");

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        eyebrow={
          <>
            <Newspaper aria-hidden="true" size={17} /> Aus dem Verein
          </>
        }
        title="Aktuelles"
        intro="Neuigkeiten, Berichte und wichtige Informationen rund um den Angelsportverein."
      />
      {isLoading && <LoadingState message={LOADING_MESSAGES.news} />}
      {!isLoading && hasError && <EmptyState message={ERROR_MESSAGES.news} />}
      {!isLoading && !hasError && newsList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.news} />
      )}
      {!isLoading && !hasError && newsList.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newsList.map((article) => (
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
                  {article.title ?? EMPTY_MESSAGES.untitled}
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
  const {
    data: article,
    isLoading,
    hasError,
  } = useAsyncResource(() => getNewsBySlug(slug), [slug]);

  usePageTitle(
    article?.title
      ? `${article.title} | Aktuelles`
      : "Aktuelles | ContentBlock",
  );

  if (isLoading)
    return <LoadingState centered message={LOADING_MESSAGES.newsDetail} />;
  if (hasError) return <EmptyState message={ERROR_MESSAGES.newsDetail} />;
  if (!article) return <NotFoundPage message={EMPTY_MESSAGES.newsNotFound} />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <BackLink href="/news" label="Alle Beiträge" />
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
        {article.title ?? EMPTY_MESSAGES.untitled}
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
