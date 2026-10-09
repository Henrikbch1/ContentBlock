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

// 1. Erstelle News-Beitrag (Willkommen & Lehrgangs-Information)
const newsItem = await postItem('news', {
  title: 'Vorbereitungslehrgang zur Fischerprüfung – Nächster Termin in Planung',
  slug: 'lehrgang-fischerpruefung-in-planung',
  published_date: new Date().toISOString(),
  teaser: 'Der ASV Loxstedt bietet regelmäßig Vorbereitungslehrgänge zur Fischerprüfung an. Neue Termine werden hier rechtzeitig bekanntgegeben.',
  body: '<p>Der ASV Loxstedt „Stoteler See“ e.V. führt ca. alle ein bis zwei Jahre einen Vorbereitungslehrgang zur staatlich anerkannten Fischerprüfung in Niedersachsen im Vereinsheim durch.</p>' +
    '<p>Der Lehrgang umfasst alle relevanten Themengebiete der niedersächsischen Fischerprüfung (Allgemeine & Spezielle Fischkunde, Gewässerkunde, Natur- & Umweltschutz, Gerätekunde sowie Gesetzeskunde). Eine Teilnahme ist ab 14 Jahren möglich.</p>' +
    '<p><strong>Aktueller Status:</strong> Der nächste Lehrgangstermin steht aktuell noch aus und wird derzeit mit den Ausbildern und Prüfern abgestimmt. Sobald der konkrete Zeitraum und die Anmeldefristen feststehen, veröffentlichen wir die Termine, Gebühren und Anmeldeinformationen direkt hier in den Vereins-News.</p>'
});
console.log('Created news item:', newsItem.data.id);

// 2. Erstelle block_news für Startseite (limit = 3, mode = latest)
const blockNewsHome = await postItem('block_news', {
  title: 'Aktuelle Vereinsnachrichten',
  limit: 3
});
console.log('Created block_news for Home:', blockNewsHome.data.id);

// Verknüpfe block_news mit Startseite (pages_id: 341d225b-f106-5c56-8a80-49bd6f3cb5d0)
await postItem('pages_blocks', {
  pages_id: '341d225b-f106-5c56-8a80-49bd6f3cb5d0',
  collection: 'block_news',
  item: blockNewsHome.data.id,
  sort: 6
});
console.log('Linked block_news to Home page');

// 3. Navigation: Aktualisiere Navigationspunkt "Aktuelles" -> verweist direkt auf /news
// Nav-Item ID cf613f2b-9d74-5e5b-85bf-0e6fae3c7e9f
const updateNav = await fetch('http://localhost:8055/items/nav_items/cf613f2b-9d74-5e5b-85bf-0e6fae3c7e9f', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    label: 'Aktuelles',
    type: 'url',
    external_url: '/news',
    page: null
  })
});
console.log('Updated Nav Item Aktuelles status:', updateNav.status);
