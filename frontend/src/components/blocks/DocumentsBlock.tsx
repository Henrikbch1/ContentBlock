import { getAssetUrl } from "../../lib/directus";
import { getAssetFilename } from "../../lib/directusRelations";
import { getDocumentsForBlock } from "../../lib/queries";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { BlockDocuments, BlockProps } from "../../lib/types";
import { cardClassName } from "../common/cardClassName";
import { EmptyState } from "../common/EmptyState";
import { LoadingState } from "../common/LoadingState";
import { Section } from "../layout/Section";

export const DocumentsBlock = ({
  item,
  background,
}: BlockProps<BlockDocuments>): React.JSX.Element => {
  const {
    data: documents,
    isLoading,
    hasError,
  } = useAsyncResource(() => getDocumentsForBlock(item), [item]);
  const documentList = documents ?? [];

  return (
    <Section background={background}>
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere]">
          {item.title}
        </h2>
      )}
      {isLoading && <LoadingState message={LOADING_MESSAGES.documents} />}
      {!isLoading && hasError && (
        <EmptyState message={ERROR_MESSAGES.documents} />
      )}
      {!isLoading && !hasError && documentList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.documents} />
      )}
      {!isLoading && !hasError && documentList.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentList.map((document) => {
            const fileUrl = getAssetUrl(document.file);
            const fileName = getAssetFilename(document.file);
            const title =
              document.title?.trim() || fileName || EMPTY_MESSAGES.untitled;
            return (
              <article
                className={cardClassName("min-w-0 p-6")}
                key={document.id}
              >
                <h3 className="text-xl font-semibold [overflow-wrap:anywhere]">
                  {title}
                </h3>
                {fileUrl ? (
                  <a
                    className="mt-4 inline-flex min-h-11 items-center text-base text-link underline underline-offset-4"
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Dokument öffnen
                    <span className="sr-only">
                      : {title} (öffnet in neuem Tab)
                    </span>
                  </a>
                ) : (
                  <p
                    className="mt-4 text-base text-muted-foreground"
                    role="status"
                  >
                    {EMPTY_MESSAGES.documentFile}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
};
