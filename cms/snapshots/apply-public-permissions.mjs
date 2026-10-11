#!/usr/bin/env node
/**
 * apply-public-permissions.mjs
 * Setzt die Rechte der Public-Policy auf "nur Lesen" für genau die Collections und
 * Felder, die das Frontend nutzt (siehe frontend/src/lib/queries/*).
 *
 * Nutzung:
 *   DIRECTUS_URL=https://cms.example.com \
 *   DIRECTUS_TOKEN=<admin-static-token> \
 *   node apply-public-permissions.mjs [--dry-run]
 *
 * - Braucht KEINE Dependencies (nur globales fetch, Node >= 18).
 * - Idempotent: entfernt alle Public-Rechte außerhalb der Tabelle unten (insbesondere
 *   create/update/delete/share), legt fehlende Leserechte an und korrigiert abweichende
 *   Feldlisten oder Filter. Mit --dry-run wird nur ausgegeben, was passieren würde.
 * - Die Tabelle muss mit der Rechte-Tabelle in cms/README.md übereinstimmen.
 * - Der Token muss ein Admin-Token sein (Policies/Permissions sind admin-only).
 */

const URL = process.env.DIRECTUS_URL?.replace(/\/+$/, "");
const TOKEN = process.env.DIRECTUS_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");

if (!URL || !TOKEN) {
  console.error(
    "Bitte DIRECTUS_URL und DIRECTUS_TOKEN als Env-Variablen setzen.",
  );
  process.exit(1);
}

/** Collection -> lesbare Felder. Systemfelder (user_*, date_*) bleiben bewusst draußen. */
const PUBLIC_READ = {
  // Globale Konfiguration
  site: ["id", "navigation", "footer", "theme"],
  navigation: ["id", "logo", "brand_text", "items"],
  nav_items: [
    "id",
    "navigation",
    "label",
    "parent",
    "type",
    "page",
    "external_url",
    "sort",
  ],
  footer: ["id", "copyright", "imprint_page", "privacy_page", "columns"],
  footer_links: ["id", "footer", "label", "page", "external_url", "sort"],
  theme: [
    "id",
    "primary_color",
    "secondary_color",
    "accent_color",
    "background_color",
    "text_color",
    "font_heading",
    "border_radius",
  ],

  // Seiten und Blocks
  pages: ["id", "title", "slug", "template", "blocks"],
  pages_blocks: ["id", "pages_id", "collection", "item", "sort"],
  block_hero: ["id", "title", "subtitle", "image", "buttons"],
  block_hero_buttons: ["id", "hero", "label", "href", "variant", "sort"],
  block_text: ["id", "headline", "content"],
  block_image: ["id", "image", "alt"],
  block_table: ["id", "title", "data"],
  block_cards: ["id", "title", "cards"],
  block_cards_items: ["id", "card", "title", "text", "image", "sort"],
  block_faq: ["id", "title", "faqs"],
  block_faq_items: ["id", "faq", "question", "answer", "sort"],
  block_contacts: [
    "id",
    "title",
    "mode",
    "show_photo",
    "show_email",
    "show_phone",
    "layout",
    "roles",
  ],
  block_contacts_roles: ["id", "block_contacts", "role", "sort"],
  block_documents: ["id", "title", "mode", "filter_category", "docs"],
  block_docs_docs: ["id", "block_documents", "document", "sort"],
  block_ticker: ["id", "background_color", "text_color", "messages"],
  block_ticker_items: ["id", "ticker", "text", "link", "sort"],
  block_news: ["id", "title", "mode", "filter_category", "limit"],
  block_events: ["id", "title", "mode", "filter_category", "limit"],

  // Stammdaten und Inhalte
  categories: ["id", "name", "slug", "parent", "sort"],
  roles: ["id", "name", "parent", "sort"],
  people: ["id", "first_name", "last_name", "role", "photo", "email", "phone"],
  documents: ["id", "title", "file", "category"],
  news: [
    "id",
    "title",
    "slug",
    "published_date",
    "teaser",
    "cover_image",
    "body",
    "category",
  ],
  events: [
    "id",
    "title",
    "slug",
    "start_date",
    "end_date",
    "location",
    "description",
    "show_days_before",
    "visible_from",
    "category",
  ],

  // Dateien (Bilder und Dokumente über /assets/<id>)
  directus_files: [
    "id",
    "title",
    "description",
    "type",
    "filename_download",
    "filesize",
    "width",
    "height",
  ],
};

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

async function api(method, path, body) {
  const res = await fetch(`${URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && res.status !== 204) {
    const txt = await res.text();
    throw new Error(`${method} ${path} -> ${res.status}: ${txt}`);
  }
  return res.status === 204 ? null : res.json();
}

const sameFields = (a, b) =>
  JSON.stringify([...(a ?? [])].sort()) === JSON.stringify([...b].sort());

const isEmptyRule = (rule) =>
  rule === null ||
  rule === undefined ||
  (typeof rule === "object" && Object.keys(rule).length === 0);

async function findPublicPolicyId() {
  const q = new URLSearchParams({
    "filter[role][_null]": "true",
    "filter[user][_null]": "true",
    fields: "policy",
  });
  const out = await api("GET", `/access?${q.toString()}`);
  const ids = (out?.data ?? []).map((entry) => entry.policy);
  if (ids.length !== 1) {
    throw new Error(
      `Erwartet genau eine Public-Policy, gefunden: ${ids.length}`,
    );
  }
  return ids[0];
}

async function run() {
  const policy = await findPublicPolicyId();
  console.log(`Public-Policy: ${policy}${DRY_RUN ? " (dry-run)" : ""}`);

  const q = new URLSearchParams({
    "filter[policy][_eq]": policy,
    limit: "-1",
    fields: "id,collection,action,fields,permissions,validation,presets",
  });
  const existing = (await api("GET", `/permissions?${q.toString()}`)).data;

  const toDelete = [];
  const toUpdate = [];
  const seen = new Set();

  for (const perm of existing) {
    const desired = PUBLIC_READ[perm.collection];
    const isDuplicate = seen.has(perm.collection);
    if (perm.action !== "read" || !desired || isDuplicate) {
      toDelete.push(perm);
      continue;
    }
    seen.add(perm.collection);
    const isCurrent =
      sameFields(perm.fields, desired) &&
      isEmptyRule(perm.permissions) &&
      isEmptyRule(perm.validation) &&
      isEmptyRule(perm.presets);
    if (!isCurrent) toUpdate.push(perm);
  }

  const toCreate = Object.keys(PUBLIC_READ).filter(
    (collection) => !seen.has(collection),
  );

  for (const perm of toDelete)
    console.log(`- entfernen: ${perm.collection} ${perm.action}`);
  for (const perm of toUpdate)
    console.log(`~ korrigieren: ${perm.collection} read`);
  for (const collection of toCreate)
    console.log(`+ anlegen: ${collection} read`);

  if (DRY_RUN) {
    console.log("\nDry-run: keine Änderungen geschrieben.");
    return;
  }

  if (toDelete.length > 0) {
    await api(
      "DELETE",
      "/permissions",
      toDelete.map((perm) => perm.id),
    );
  }
  for (const perm of toUpdate) {
    await api("PATCH", `/permissions/${perm.id}`, {
      fields: PUBLIC_READ[perm.collection],
      permissions: {},
      validation: null,
      presets: null,
    });
  }
  if (toCreate.length > 0) {
    await api(
      "POST",
      "/permissions",
      toCreate.map((collection) => ({
        policy,
        collection,
        action: "read",
        fields: PUBLIC_READ[collection],
        permissions: {},
        validation: null,
        presets: null,
      })),
    );
  }

  console.log(
    `\nFertig: ${toDelete.length} entfernt, ${toUpdate.length} korrigiert, ${toCreate.length} angelegt.`,
  );
}

run().catch((e) => {
  console.error("Rechte konnten nicht gesetzt werden:", e.message);
  process.exit(1);
});
