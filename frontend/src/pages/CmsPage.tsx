import { useEffect } from "react";
import { BlockRenderer } from "../components/blocks/BlockRenderer";
import { EmptyState } from "../components/common/EmptyState";
import { useAsyncResource } from "../lib/hooks/useAsyncResource";
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

  useEffect(() => {
    if (page?.title) {
      document.title = page.title;
    }
  }, [page]);

  if (isLoading) {
    return <p aria-live="polite" className="px-4 py-16 text-center text-sm text-muted-foreground" role="status">{LOADING_MESSAGES.page}</p>;
  }
  if (hasError) {
    return <EmptyState message={ERROR_MESSAGES.page} />;
  }
  if (!page) {
    return <NotFoundPage />;
  }

  return <BlockRenderer blocks={page.blocks} />;
};
