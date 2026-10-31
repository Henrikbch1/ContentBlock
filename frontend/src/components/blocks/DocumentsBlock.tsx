import { getAssetUrl } from "../../lib/directus";
import { getAssetFilename, getRelation } from "../../lib/directusRelations";
import { getDocumentsForBlock } from "../../lib/queries";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  UI_LABELS,
} from "../../lib/uiMessages";
import type { BlockDocuments, BlockProps } from "../../lib/types";
import { noticeClassName } from "../common/cardClassName";
import { noticeGridClassName } from "../common/noticeGrid";
import { EmptyState } from "../common/EmptyState";
import { LoadingState } from "../common/LoadingState";
import { NoticeMeta } from "../common/NoticeMeta";
import { SectionTitle } from "../common/SectionTitle";
import { Section } from "../layout/Section";
import { DocumentLinks } from "./DocumentLinks";

const getFileType = (fileName: string | null): string | null => {
  const extension = fileName?.match(/\.([a-z0-9]{1,5})$/i)?.[1];
  return extension ? extension.toUpperCase() : null;
};

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
      {item.title && <SectionTitle>{item.title}</SectionTitle>}
      {isLoading && <LoadingState message={LOADING_MESSAGES.documents} />}
      {!isLoading && hasError && (
        <EmptyState message={ERROR_MESSAGES.documents} />
      )}
      {!isLoading && !hasError && documentList.length === 0 && (
        <EmptyState message={EMPTY_MESSAGES.documents} />
      )}
      {!isLoading && !hasError && documentList.length > 0 && (
        <div className={noticeGridClassName(documentList.length)}>
          {documentList.map((document) => {
            const fileUrl = getAssetUrl(document.file);
            const fileName = getAssetFilename(document.file);
            const title =
              document.title?.trim() || fileName || EMPTY_MESSAGES.untitled;
            return (
              <article
                className={noticeClassName("flex flex-col")}
                key={document.id}
              >
                <NoticeMeta
                  label={
                    getRelation(document.category)?.name?.trim() ||
                    UI_LABELS.document
                  }
                  value={getFileType(fileName)}
                />
                <h3 className="text-[1.375rem] leading-tight [overflow-wrap:anywhere]">
                  {title}
                </h3>
                {fileUrl ? (
                  <DocumentLinks
                    title={title}
                    fileUrl={fileUrl}
                    monochromeUrl={getAssetUrl(document.file_monochrome)}
                  />
                ) : (
                  <p
                    className="mt-auto pt-5 text-base text-muted-foreground"
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
