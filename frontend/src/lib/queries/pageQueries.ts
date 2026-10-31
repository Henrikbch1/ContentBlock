import { readItems } from "@directus/sdk";

import { assertDirectusConfigured, directus } from "../directus";
import type { Page } from "../types";

const PAGE_FIELDS = [
  "id",
  "title",
  "slug",
  "template",
  "blocks.id",
  "blocks.collection",
  "blocks.item",
  "blocks.sort",
  "blocks.item:block_hero.*",
  "blocks.item:block_hero.buttons.*",
  "blocks.item:block_text.*",
  "blocks.item:block_image.*",
  "blocks.item:block_table.*",
  "blocks.item:block_cards.*",
  "blocks.item:block_cards.cards.*",
  "blocks.item:block_faq.*",
  "blocks.item:block_faq.faqs.*",
  "blocks.item:block_contacts.*",
  "blocks.item:block_contacts.roles.*",
  "blocks.item:block_contacts.roles.role.*",
  "blocks.item:block_documents.*",
  "blocks.item:block_documents.docs.*",
  "blocks.item:block_ticker.*",
  "blocks.item:block_ticker.messages.*",
  "blocks.item:block_ticker.messages.link.*",
  "blocks.item:block_news.*",
  "blocks.item:block_events.*",
  "blocks.item:block_quicklinks.id",
  "blocks.item:block_quicklinks.title",
  "blocks.item:block_quicklinks.items.id",
  "blocks.item:block_quicklinks.items.label",
  "blocks.item:block_quicklinks.items.icon",
  "blocks.item:block_quicklinks.items.text",
  "blocks.item:block_quicklinks.items.external_url",
  "blocks.item:block_quicklinks.items.sort",
  "blocks.item:block_quicklinks.items.page.slug",
] as const;

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  assertDirectusConfigured();
  const pages = (await directus.request(
    readItems("pages", {
      filter: { slug: { _eq: slug } },
      fields: PAGE_FIELDS as never,
      limit: 1,
    }),
  )) as Page[];
  return pages[0] ?? null;
};
