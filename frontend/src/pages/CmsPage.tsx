import { useEffect, useState } from "react";
import { BlockRenderer } from "../components/blocks/BlockRenderer";
import { EmptyState } from "../components/common/EmptyState";
import { getPageBySlug } from "../lib/queries";
import type { Page } from "../lib/types";
import { NotFoundPage } from "./NotFoundPage";

type CmsPageProps = {
  slug: string;
};

export const CmsPage = ({ slug }: CmsPageProps): React.JSX.Element => {
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    const loadPage = async (): Promise<void> => {
      try {
        const loadedPage = await getPageBySlug(slug);
        if (isMounted) {
          setPage(loadedPage);
          if (loadedPage?.title) {
            document.title = loadedPage.title;
          }
        }
      } catch {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPage();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return <p aria-live="polite" className="px-4 py-16 text-center text-sm text-muted-foreground" role="status">Seite wird geladen ...</p>;
  }
  if (hasError) {
    return <EmptyState message="Die Seite konnte nicht geladen werden." />;
  }
  if (!page) {
    return <NotFoundPage />;
  }

  return <BlockRenderer blocks={page.blocks} />;
};
