import { useEffect, useState } from "react";

import { getDocumentsForBlock } from "../../lib/queries";
import type { BlockDocuments, Document, DirectusAsset } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";

const getAssetId = (
  asset: DirectusAsset | undefined,
): string | number | null => {
  if (typeof asset === "string" || typeof asset === "number") return asset;
  return asset?.id ?? null;
};

export const DocumentsBlock = ({
  item,
}: {
  item: BlockDocuments;
}): React.JSX.Element => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDocuments = async (): Promise<void> => {
      setIsLoading(true);
      setHasError(false);
      try {
        const loadedDocuments = await getDocumentsForBlock(item);
        if (isMounted) setDocuments(loadedDocuments);
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadDocuments();
    return () => {
      isMounted = false;
    };
  }, [item]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
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
          Dokumente werden geladen ...
        </p>
      )}
      {!isLoading && hasError && (
        <EmptyState message="Dokumente konnten nicht geladen werden." />
      )}
      {!isLoading && !hasError && documents.length === 0 && (
        <EmptyState message="Keine Dokumente vorhanden." />
      )}
      {!isLoading && !hasError && documents.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => {
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
    </section>
  );
};
