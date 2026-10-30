import { readItems } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import { getRelationId, getRelationIds } from "../directusRelations";
import type {
  BlockDocuments,
  BlockDocumentsLink,
  DirectusId,
  Document,
} from "../types";

const DOCUMENT_FIELDS = [
  "id",
  "title",
  "file.id",
  "file.filename_download",
  "category.*",
] as const;

const getSelectedDocumentIds = (docs: BlockDocuments["docs"]): DirectusId[] => {
  const links: BlockDocumentsLink[] = [];
  for (const link of docs ?? []) {
    if (link === null) continue;
    if (typeof link !== "object") {
      throw new Error("Selected document links must be expanded.");
    }
    if (getRelationId(link.document) === null) {
      throw new Error("A selected document link has no document.");
    }
    links.push(link);
  }

  links.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  const ids = getRelationIds(links.map((link) => link.document ?? null));
  return [...new Map(ids.map((id) => [String(id), id])).values()];
};

/**
 * Loads block documents in the order of their manual selection.
 * @param cfg - Document block configuration.
 * @returns Documents accessible for the block.
 * @throws If a selected link is unresolved or a selected document is missing.
 */
export const getDocumentsForBlock = async (
  cfg: BlockDocuments,
): Promise<Document[]> => {
  assertDirectusConfigured();
  const categoryId = getRelationId(cfg.filter_category);
  const documentIds =
    cfg.mode === "manual" ? getSelectedDocumentIds(cfg.docs) : [];
  if (cfg.mode === "manual" && documentIds.length === 0) {
    return [];
  }
  if (cfg.mode === "by_category" && categoryId === null) {
    return [];
  }

  const documents = (await directus.request(
    readItems("documents", {
      fields: DOCUMENT_FIELDS as never,
      filter:
        cfg.mode === "manual"
          ? { id: { _in: documentIds } }
          : cfg.mode === "by_category"
            ? { category: { _eq: categoryId } }
            : undefined,
    }),
  )) as Document[];

  if (cfg.mode !== "manual") return documents;

  const documentsById = new Map(
    documents.map((document) => [String(document.id), document]),
  );
  return documentIds.map((id) => {
    const document = documentsById.get(String(id));
    if (!document) {
      throw new Error("Some selected documents could not be loaded.");
    }
    return document;
  });
};
