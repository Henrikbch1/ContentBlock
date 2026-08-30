import { readItems } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import { getRelationId, getRelationIds } from "../directusRelations";
import type { BlockDocuments, Document } from "../types";

const DOCUMENT_FIELDS = ["id", "title", "file", "category.*"] as const;

export const getDocumentsForBlock = async (
  cfg: BlockDocuments,
): Promise<Document[]> => {
  assertDirectusConfigured();
  const categoryId = getRelationId(cfg.filter_category);
  const documentIds = getRelationIds(cfg.docs);
  if (cfg.mode === "manual" && documentIds.length === 0) {
    return [];
  }
  if (cfg.mode === "by_category" && categoryId === null) {
    return [];
  }

  return (await directus.request(
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
};
