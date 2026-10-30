import { BackLink } from "../components/common/BackLink";
import { DirectusImage } from "../components/common/DirectusImage";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { NewsNotice } from "../components/common/NewsNotice";
import { noticeGridClassName } from "../components/common/noticeGrid";
import { NoticeMeta } from "../components/common/NoticeMeta";
import { PageHeader } from "../components/common/PageHeader";
import { RichText } from "../components/common/RichText";
import { Section } from "../components/layout/Section";
import { useAsyncResource } from "../lib/hooks/useAsyncResource";
import { usePageTitle } from "../lib/hooks/usePageTitle";
import { formatDate } from "../lib/format";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  UI_LABELS,
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
    <Section>
      <PageHeader
        title="Aktuelles"
        intro="Aktuelle Meldungen und Informationen im Überblick."
      />
      {isLoading && <LoadingState message={LOADING_MESSAGES.news} />}
      {!isLoading && hasError && <EmptyState message={ERROR_MESSAGES.news} />}
      {!isLoading && !hasError && newsList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.news} />
      )}
      {!isLoading && !hasError && newsList.length > 0 && (
        <div className={noticeGridClassName(newsList.length)}>
          {newsList.map((article) => (
            <NewsNotice article={article} headingLevel="h2" key={article.id} />
          ))}
        </div>
      )}
    </Section>
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
    <Section containerClassName="max-w-3xl">
      <article>
        <BackLink href="/news" label="Alle Beiträge" />
        {article.cover_image && (
          <DirectusImage
            asset={article.cover_image}
            alt={article.title ?? ""}
            className="mb-8 aspect-video w-full rounded-card object-cover"
          />
        )}
        <NoticeMeta
          label={getCategoryName(article) || UI_LABELS.news}
          value={formatDate(article.published_date) || null}
        />
        <h1 className="text-[2.25rem] leading-tight [overflow-wrap:anywhere] sm:text-[2.75rem]">
          {article.title ?? EMPTY_MESSAGES.untitled}
        </h1>
        {article.teaser && (
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            {article.teaser}
          </p>
        )}
        <RichText content={article.body} className="prose-lg mt-8" />
      </article>
    </Section>
  );
};

export const NewsPage = ({ slug }: NewsPageProps): React.JSX.Element =>
  slug ? <NewsDetail slug={slug} /> : <NewsOverview />;
