import { getNewsForBlock } from "../../lib/queries";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { BlockNews, BlockProps } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";
import { LoadingState } from "../common/LoadingState";
import { NewsNotice } from "../common/NewsNotice";
import { noticeGridClassName } from "../common/noticeGrid";
import { SectionTitle } from "../common/SectionTitle";
import { Section } from "../layout/Section";

export const NewsBlock = ({
  item,
  background,
}: BlockProps<BlockNews>): React.JSX.Element => {
  const {
    data: news,
    isLoading,
    hasError,
  } = useAsyncResource(() => getNewsForBlock(item), [item]);
  const newsList = news ?? [];

  return (
    <Section background={background}>
      {item.title && <SectionTitle>{item.title}</SectionTitle>}
      {isLoading && <LoadingState message={LOADING_MESSAGES.news} />}
      {!isLoading && hasError && <EmptyState message={ERROR_MESSAGES.news} />}
      {!isLoading && !hasError && newsList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.news} />
      )}
      {!isLoading && !hasError && newsList.length > 0 && (
        <div className={noticeGridClassName(newsList.length)}>
          {newsList.map((article) => (
            <NewsNotice article={article} key={article.id} />
          ))}
        </div>
      )}
    </Section>
  );
};
