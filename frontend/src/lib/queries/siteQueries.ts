import { readItems, readSingleton } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import type { Site, Theme } from "../types";

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

const THEME_FIELDS = [
  "id",
  "primary_color",
  "secondary_color",
  "accent_color",
  "background_color",
  "text_color",
  "font_heading",
  "border_radius",
] as const;

export const getSite = async (): Promise<Site | null> => {
  assertDirectusConfigured();
  const [site, themes] = await Promise.all([
    directus.request(
      readSingleton("site", {
        fields: SITE_FIELDS as never,
        _cb: Date.now(),
      }),
    ),
    directus.request(
      readItems("theme" as never, {
        fields: THEME_FIELDS as never,
        limit: 1,
        _cb: Date.now(),
      }) as never,
    ) as Promise<Theme[]>,
  ]);

  return site ? { ...(site as Site), theme: themes[0] ?? null } : null;
};
