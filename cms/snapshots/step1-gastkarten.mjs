import { readFileSync, writeFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf-8');
let email = '', password = '';
for (const line of env.split('\n')) {
  if (line.startsWith('ADMIN_EMAIL=')) email = line.replace('ADMIN_EMAIL=', '').trim();
  if (line.startsWith('ADMIN_PASSWORD=')) password = line.replace('ADMIN_PASSWORD=', '').trim();
}

const loginRes = await fetch('http://localhost:8055/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
if (!loginRes.ok) throw new Error('Login failed');
const token = (await loginRes.json()).data.access_token;

// Helper PATCH
async function patchItem(collection, id, data) {
  const res = await fetch(`http://localhost:8055/items/${collection}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PATCH ${collection}/${id} failed (${res.status}): ${txt}`);
  }
  return await res.json();
}

// 1. Update Fisherman's Partner
await patchItem('block_cards_items', '0200fb9d-4212-50b8-89de-c33f175254d7', {
  title: "Fisherman's Partner",
  text: "Zur hohen Lieth 11, 27619 Schiffdorf-Spaden (Google Maps: https://maps.google.com/?q=Fisherman%27s+Partner+Zur+hohen+Lieth+11+27619+Schiffdorf-Spaden)"
});
console.log("Updated Fisherman's Partner card item");

// 2. Update Autoteile Becker
await patchItem('block_cards_items', '9a453fce-7e88-50ee-85a7-aff5e9ad2b82', {
  title: "Autoteile-Becker",
  text: "Helmut-Neynaber-Straße 10, 27612 Loxstedt (Google Maps: https://maps.google.com/?q=Autoteile+Becker+Helmut-Neynaber-Stra%C3%9Fe+10+27612+Loxstedt)"
});
console.log("Updated Autoteile Becker card item");

// 3. Update Gastangeln text block
await patchItem('block_text', '2efbec71-62d3-5098-8807-b5afdddb0fc9', {
  headline: 'Gastangeln am Stoteler See',
  content: '<p>Gastkarten gelten ausschließlich für den <strong>Stoteler See</strong>. Voraussetzung ist ein gültiger <strong>Bundesfischereischein</strong> (grüner Fischereischein oder Fischereischeinkarte im Scheckkartenformat). Gastkarten sind an den örtlichen Ausgabestellen erhältlich: <a href="https://maps.google.com/?q=Fisherman%27s+Partner+Zur+hohen+Lieth+11+27619+Schiffdorf-Spaden" target="_blank" rel="noopener noreferrer">Fisherman\'s Partner in Spaden</a> und <a href="https://maps.google.com/?q=Autoteile+Becker+Helmut-Neynaber-Stra%C3%9Fe+10+27612+Loxstedt" target="_blank" rel="noopener noreferrer">Autoteile Becker in Loxstedt</a> (Online-Kauf via Hejfish wird derzeit noch nicht angeboten). Bitte beachtet die Bestimmungen auf dem Gastschein und hinterlasst euren Angelplatz sauber.</p>'
});
console.log("Updated Gastangeln text block");

// 4. Update Gastkarten Tabelle (3 Ruten hinzufügen)
await patchItem('block_table', 'e98a80ef-549b-5acc-86a4-82486d144307', {
  title: 'Gastkarte',
  data: [
    { cells: [{ value: 'Leistung' }, { value: 'Information' }] },
    { cells: [{ value: 'Preis' }, { value: '15 EUR' }] },
    { cells: [{ value: 'Gültigkeit' }, { value: '06:00 bis 22:00 Uhr (nur Stoteler See)' }] },
    { cells: [{ value: 'Ruten' }, { value: 'Maximal 3 Ruten' }] },
    { cells: [{ value: 'Nachtangeln' }, { value: 'Mit Gastkarten nicht erlaubt' }] },
    { cells: [{ value: 'Boote' }, { value: 'Nicht erlaubt, auch kein Futterboot oder Bellyboot' }] }
  ]
});
console.log("Updated Gastkarte table block");
