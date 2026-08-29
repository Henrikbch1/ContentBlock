import type { DirectusAsset, DirectusId, DirectusRelation } from "./types";

/** Einzige Stelle für Relation-/Asset-Id-Unwrapping (siehe contentblock-architecture Skill). */
export const getRelationId = <T extends { id: DirectusId }>(
  relation: DirectusRelation<T> | undefined,
): DirectusId | null => {
  if (typeof relation === "string" || typeof relation === "number") {
    return relation;
  }

  return relation?.id ?? null;
};

export const getRelationIds = <T extends { id: DirectusId }>(
  relations: Array<DirectusRelation<T>> | null | undefined,
): DirectusId[] =>
  (relations ?? [])
    .map((relation) => getRelationId(relation))
    .filter((id): id is DirectusId => id !== null);

export const getRelation = <T>(
  relation: DirectusRelation<T> | undefined,
): T | null => (relation && typeof relation === "object" ? relation : null);

export const getAssetId = (
  asset: DirectusAsset | undefined,
): DirectusId | null => {
  if (typeof asset === "string" || typeof asset === "number") {
    return asset;
  }

  return asset && typeof asset === "object" ? asset.id : null;
};
