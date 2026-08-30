import { readItems } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import { getRelationId } from "../directusRelations";
import type {
  BlockContacts,
  BlockContactsRole,
  DirectusId,
  DirectusRelation,
  Person,
} from "../types";

const PERSON_FIELDS = ["id", "first_name", "last_name", "role.*"] as const;

const getContactRoleIds = (
  relations: Array<DirectusRelation<BlockContactsRole>> | null | undefined,
): DirectusId[] =>
  (relations ?? [])
    .map((relation) =>
      relation && typeof relation === "object"
        ? getRelationId(relation.role)
        : null,
    )
    .filter((id): id is DirectusId => id !== null);

export const getContactsForBlock = async (
  cfg: BlockContacts,
): Promise<Array<Person & { phone?: string | null }>> => {
  assertDirectusConfigured();
  const roleIds = getContactRoleIds(cfg.roles);
  if (cfg.mode === "manual" && roleIds.length === 0) {
    return [];
  }
  if (cfg.mode === "by_role" && roleIds.length === 0) {
    return [];
  }
  const fields = [
    ...PERSON_FIELDS,
    ...(cfg.show_photo ? ["photo"] : []),
    ...(cfg.show_email || cfg.layout === "form" ? ["email"] : []),
  ];

  return (await directus.request(
    readItems("people", {
      fields: fields as never,
      filter: { role: { _in: roleIds } },
      sort: ["role.sort"] as never,
    }),
  )) as Array<Person & { phone?: string | null }>;
};
