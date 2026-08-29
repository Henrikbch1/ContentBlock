import { getDocumentsForBlock } from "../../lib/queries";
import { getAssetId } from "../../lib/directusRelations";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { BlockDocuments } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";
import { Section } from "../layout/Section";

export const DocumentsBlock = ({
  item,
}: {
  item: BlockDocuments;
}): React.JSX.Element => {
  const {
    data: documents,
    isLoading,
    hasError,
  } = useAsyncResource(() => getDocumentsForBlock(item), [item]);
  const documentList = documents ?? [];

  return (
    <Section>
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">
          {item.title}
        </h2>
      )}
      {isLoading && (
        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          role="status"
        >
          {LOADING_MESSAGES.documents}
        </p>
      )}
      {!isLoading && hasError && (
        <EmptyState message={ERROR_MESSAGES.documents} />
      )}
      {!isLoading && !hasError && documentList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.documents} />
      )}
      {!isLoading && !hasError && documentList.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentList.map((document) => {
            const fileId = getAssetId(document.file);
            const directusUrl = import.meta.env.VITE_DIRECTUS_URL?.replace(
              /\/$/,
              "",
            );
            return (
              <article
                className="border border-border bg-card p-6"
                key={document.id}
              >
                <h3 className="text-xl font-semibold">
                  {document.title ?? ""}
                </h3>
                {fileId && directusUrl && (
                  <a
                    className="mt-4 inline-block text-sm underline underline-offset-4"
                    href={`${directusUrl}/assets/${fileId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Dokument öffnen
                  </a>
                )}
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
};
