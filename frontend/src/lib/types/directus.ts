export type DirectusId = string | number;
export type DirectusAsset = DirectusId | { id: DirectusId } | null;
export type DirectusRelation<T> = T | DirectusId | null;
