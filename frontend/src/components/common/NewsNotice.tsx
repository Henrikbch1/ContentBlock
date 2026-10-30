import { formatDate } from "../../lib/format";
import { EMPTY_MESSAGES, UI_LABELS } from "../../lib/uiMessages";
import type { News } from "../../lib/types";
import { getRelation } from "../../lib/directusRelations";
import { noticeClassName } from "./cardClassName";
import { DirectusImage } from "./DirectusImage";
import { NoticeMeta } from "./NoticeMeta";

type NewsNoticeProps = Readonly<{
  article: News;
  headingLevel?: "h2" | "h3";
}>;

export const NewsNotice = ({
  article,
  headingLevel: Heading = "h3",
}: NewsNoticeProps): React.JSX.Element => (
  <a
    className={noticeClassName(
      "group flex flex-col text-foreground no-underline",
    )}
    href={`/news/${article.slug ?? article.id}`}
  >
    <NoticeMeta
      label={getRelation(article.category)?.name?.trim() || UI_LABELS.news}
      value={article.published_date ? formatDate(article.published_date) : null}
    />
    {article.cover_image && (
      <DirectusImage
        asset={article.cover_image}
        alt=""
        className="mb-5 aspect-16/10 w-full rounded-[calc(var(--cb-radius)/2)] object-cover"
      />
    )}
    <Heading className="text-[1.375rem] leading-tight [overflow-wrap:anywhere]">
      {article.title ?? EMPTY_MESSAGES.untitled}
    </Heading>
    {article.teaser && (
      <p className="mt-3 line-clamp-4 text-muted-foreground">
        {article.teaser}
      </p>
    )}
    <span className="mt-auto pt-6 font-bold text-link underline decoration-2 underline-offset-4 group-hover:decoration-4">
      {UI_LABELS.readNews}
    </span>
  </a>
);
