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

// Update block_text Mitgliedschaft
await patchItem('block_text', 'd9f308c5-fa77-57b4-842e-313c69ad320b', {
  headline: 'Mitglied werden & Vereinsbeiträge',
  content: '<p>Für die Aufnahme in den ASV Loxstedt „Stoteler See“ e.V. benötigen wir:</p>' +
    '<ul>' +
    '<li>Zwei Passbilder</li>' +
    '<li>Einen Nachweis über die bestandene Fischerprüfung (falls vorhanden)</li>' +
    '<li>Den vollständig ausgefüllten Aufnahmeantrag mit SEPA-Einzugsermächtigung für den Beitrag</li>' +
    '</ul>' +
    '<p>Bitte gebt die Unterlagen auf der Geschäftsstelle ab.</p>' +
    '<h3>Arbeitsdienst & Regelungen</h3>' +
    '<p>Mitglieder leisten laut Satzung Arbeitsdienste zur Hege und Gewässerpflege. Ausgenommen von dieser Verpflichtung sind:</p>' +
    '<ul>' +
    '<li>Mitglieder, die zu Beginn eines laufenden Kalenderjahres das 60. Lebensjahr vollendet haben</li>' +
    '<li>Mitglieder, die mit Vereinsämtern betraut sind</li>' +
    '<li>Mitglieder mit nachgewiesener amtlicher Schwerbehinderung ab 50 %</li>' +
    '<li>Passive Mitglieder (ohne Angelberechtigung)</li>' +
    '</ul>' +
    '<p>Für nicht geleisteten Arbeitsdienst wird laut Satzung ein Strafbeitrag von <strong>60,- €</strong> für Erwachsene erhoben.</p>' +
    '<h3>Fangmeldungen</h3>' +
    '<p>Die Fangmeldungen sind bis spätestens <strong>30. November</strong> eines jeden Jahres in der Geschäftsstelle abzugeben. Bei Nichtabgabe wird laut Beitragsordnung ein Strafbeitrag fällig (Erwachsene: <strong>40,- €</strong>, Jugendliche: <strong>15,- €</strong>) und es droht eine Sperre für die Folgejahreskarte.</p>'
});
console.log("Updated Mitgliedschaft text block");
