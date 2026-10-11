import { readSingleton } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import type { Site } from "../types";

const SITE_FIELDS = [
  "id",
  "navigation.*",
  "navigation.logo.*",
  "navigation.items.*",
  "navigation.items.parent.*",
  "navigation.items.page.*",
  "footer.*",
  "footer.columns.*",
  "footer.columns.page.*",
  "footer.imprint_page.*",
  "footer.privacy_page.*",
  "theme.*",
] as const;

export const getSite = async (): Promise<Site | null> => {
  assertDirectusConfigured();
  const site = await directus.request(
    readSingleton("site", { fields: SITE_FIELDS as never }),
  );
  return (site as Site | null) ?? null;
};
