import { BlockRenderer } from "../components/blocks/BlockRenderer";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { useAsyncResource } from "../lib/hooks/useAsyncResource";
import { usePageTitle } from "../lib/hooks/usePageTitle";
import { ERROR_MESSAGES, LOADING_MESSAGES } from "../lib/uiMessages";
import { getPageBySlug } from "../lib/queries";
import { NotFoundPage } from "./NotFoundPage";

type CmsPageProps = {
  slug: string;
};

export const CmsPage = ({ slug }: CmsPageProps): React.JSX.Element => {
  const {
    data: page,
    isLoading,
    hasError,
  } = useAsyncResource(() => getPageBySlug(slug), [slug]);

  usePageTitle(page?.title);

  if (isLoading) {
    return <LoadingState centered message={LOADING_MESSAGES.page} />;
  }
  if (hasError) {
    return <EmptyState message={ERROR_MESSAGES.page} />;
  }
  if (!page) {
    return <NotFoundPage />;
  }

  return <BlockRenderer blocks={page.blocks} />;
};
