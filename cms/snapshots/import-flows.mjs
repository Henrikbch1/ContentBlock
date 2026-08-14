#!/usr/bin/env node
/**
 * import-flows.mjs
 * Importiert Flows + Operations aus flows.seed.json in eine Directus-Instanz.
 *
 * Nutzung:
 *   DIRECTUS_URL=https://cms.example.com \
 *   DIRECTUS_TOKEN=<admin-static-token> \
 *   node import-flows.mjs ./flows.seed.json
 *
 * - Braucht KEINE Dependencies (nur globales fetch, Node >= 18).
 * - Idempotent: existiert ein Flow mit gleichem Namen, wird er (inkl. Operationen) ersetzt.
 * - Der Token muss ein Admin-Token sein (Flows sind admin-only).
 */

import { readFile } from 'node:fs/promises';

const URL   = process.env.DIRECTUS_URL?.replace(/\/+$/, '');
const TOKEN = process.env.DIRECTUS_TOKEN;
const FILE  = process.argv[2] || './flows.seed.json';

if (!URL || !TOKEN) {
  console.error('❌ Bitte DIRECTUS_URL und DIRECTUS_TOKEN als Env-Variablen setzen.');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
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

async function findFlowByName(name) {
  const q = new URLSearchParams({ 'filter[name][_eq]': name, 'fields': 'id,name' });
  const out = await api('GET', `/flows?${q.toString()}`);
  return out?.data?.[0] ?? null;
}

async function run() {
  const seed = JSON.parse(await readFile(FILE, 'utf8'));
  const { flows, operations } = seed;

  for (const flow of flows) {
    // 1) vorhandenen Flow gleichen Namens entfernen (idempotent)
    const existing = await findFlowByName(flow.name);
    if (existing) {
      console.log(`♻️  Ersetze bestehenden Flow "${flow.name}" (${existing.id})`);
      await api('DELETE', `/flows/${existing.id}`); // löscht auch zugehörige Operationen
    }

    // 2) Flow ohne operation-Verweis anlegen (Operation existiert noch nicht)
    const { operation, ...flowNoOp } = flow;
    await api('POST', '/flows', flowNoOp);

    // 3) zugehörige Operation(en) anlegen
    const ops = operations.filter((o) => o.flow === flow.id);
    for (const op of ops) {
      await api('POST', '/operations', op);
    }

    // 4) Flow mit erster Operation verknüpfen (Trigger -> Operation)
    if (operation) {
      await api('PATCH', `/flows/${flow.id}`, { operation });
    }
    console.log(`✅ Flow "${flow.name}" importiert (${ops.length} Operation/en).`);
  }

  console.log('\n🎉 Fertig. Prüfe Settings → Flows im Studio.');
}

run().catch((e) => {
  console.error('❌ Import fehlgeschlagen:', e.message);
  process.exit(1);
});
