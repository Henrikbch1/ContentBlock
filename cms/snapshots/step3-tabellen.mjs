import { readFileSync } from 'node:fs';

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

async function postItem(collection, data) {
  const res = await fetch(`http://localhost:8055/items/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST ${collection} failed (${res.status}): ${txt}`);
  }
  return await res.json();
}

// 1. Tabelle für Stoteler See
const tableStotelData = [
  { cells: [{ value: 'Fischart' }, { value: 'Mindestmaß' }, { value: 'Schonzeit' }, { value: 'Tages-Fangbegrenzung' }] },
  { cells: [{ value: 'Hecht' }, { value: '60 cm' }, { value: '01.02. – 15.05.' }, { value: 'max. 2 Stück (mit Zander komb.)' }] },
  { cells: [{ value: 'Zander' }, { value: '45 cm' }, { value: '01.02. – 15.05.' }, { value: 'max. 2 Stück (mit Hecht komb.)' }] },
  { cells: [{ value: 'Flussbarsch' }, { value: '15 cm' }, { value: '01.02. – 15.05.' }, { value: '-' }] },
  { cells: [{ value: 'Karpfen' }, { value: '40 cm' }, { value: 'keine Schonzeit' }, { value: 'max. 2 Stück' }] },
  { cells: [{ value: 'Schleie' }, { value: '25 cm' }, { value: 'keine Schonzeit' }, { value: 'max. 2 Stück' }] },
  { cells: [{ value: 'Brachse / Brasse' }, { value: 'kein Mindestmaß' }, { value: 'keine Schonzeit' }, { value: 'max. 3 Stück' }] },
  { cells: [{ value: 'Aal' }, { value: '45 cm' }, { value: 'keine Schonzeit' }, { value: 'max. 3 Stück' }] },
  { cells: [{ value: 'Bachforelle' }, { value: '30 cm' }, { value: '15.10. – 15.02.' }, { value: 'max. 2 Stück' }] }
];

const tableStotelRes = await postItem('block_table', {
  title: 'Mindestmaße, Schonzeiten & Fangbegrenzungen – Stoteler See',
  data: tableStotelData
});
const tableStotelId = tableStotelRes.data.id;
console.log('Created block_table Stoteler See:', tableStotelId);

// Verknüpfe Tabelle mit Seite gewaesser/stoteler-see (pages_id: 18e335e9-88eb-540d-851d-919025f328c3)
await postItem('pages_blocks', {
  pages_id: '18e335e9-88eb-540d-851d-919025f328c3',
  collection: 'block_table',
  item: tableStotelId,
  sort: 4
});
console.log('Linked table to Stoteler See page');

// 2. Tabelle für Lune und Neue Lune
const tableLuneData = [
  { cells: [{ value: 'Fischart' }, { value: 'Mindestmaß' }, { value: 'Schonzeit' }, { value: 'Tages-Fangbegrenzung' }] },
  { cells: [{ value: 'Hecht' }, { value: '60 cm' }, { value: '01.02. – 15.05.' }, { value: 'max. 2 Stück' }] },
  { cells: [{ value: 'Zander' }, { value: '45 cm' }, { value: '01.02. – 15.05.' }, { value: 'max. 2 Stück (mit Hecht komb.)' }] },
  { cells: [{ value: 'Flussbarsch' }, { value: '15 cm' }, { value: '01.02. – 15.05.' }, { value: '-' }] },
  { cells: [{ value: 'Aal' }, { value: '45 cm' }, { value: 'keine Schonzeit' }, { value: 'max. 3 Edelfische gesamt' }] },
  { cells: [{ value: 'Karpfen' }, { value: '40 cm' }, { value: 'keine Schonzeit' }, { value: 'max. 3 Edelfische gesamt' }] },
  { cells: [{ value: 'Schleie' }, { value: '25 cm' }, { value: 'keine Schonzeit' }, { value: 'max. 3 Edelfische gesamt' }] },
  { cells: [{ value: 'Meerforelle' }, { value: '40 cm' }, { value: '15.10. – 15.02.' }, { value: 'max. 3 Edelfische gesamt' }] },
  { cells: [{ value: 'Brachse / Brasse' }, { value: '25 cm' }, { value: 'keine Schonzeit' }, { value: '-' }] },
  { cells: [{ value: 'Rotauge / Plötze' }, { value: '15 cm' }, { value: 'keine Schonzeit' }, { value: '-' }] }
];

const tableLuneRes = await postItem('block_table', {
  title: 'Mindestmaße, Schonzeiten & Fangbegrenzungen – Lune & Neue Lune',
  data: tableLuneData
});
const tableLuneId = tableLuneRes.data.id;
console.log('Created block_table Lune:', tableLuneId);

// Verknüpfe Tabelle mit Seite gewaesser/lune-neue-lune (pages_id: 6417dad0-d4d1-58cb-86b3-980048cb13c7)
await postItem('pages_blocks', {
  pages_id: '6417dad0-d4d1-58cb-86b3-980048cb13c7',
  collection: 'block_table',
  item: tableLuneId,
  sort: 3
});
console.log('Linked table to Lune page');
