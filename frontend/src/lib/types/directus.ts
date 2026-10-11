export type DirectusId = string | number;
export type DirectusAsset =
  | DirectusId
  | { id: DirectusId; filename_download?: string | null }
  | null;
export type DirectusRelation<T> = T | DirectusId | null;
