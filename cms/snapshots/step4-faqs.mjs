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

// 1. FAQ Block für Mitgliedschaft erstellen
const faqMitgliedRes = await postItem('block_faq', {
  title: 'Häufige Fragen zur Mitgliedschaft'
});
const faqMitgliedId = faqMitgliedRes.data.id;
console.log('Created block_faq Mitgliedschaft:', faqMitgliedId);

// FAQ Items für Mitgliedschaft
await postItem('block_faq_items', {
  faq: faqMitgliedId,
  question: 'Wie werde ich Mitglied im ASV Loxstedt?',
  answer: '<p>Fülle unser Beitrittsformular vollständig aus, lege die geforderten Unterlagen (zwei Passbilder, Nachweis der Fischerprüfung) bei und reiche alles in der Geschäftsstelle ein. Nach Prüfung erhältst du eine schriftliche Rückmeldung von uns.</p>',
  sort: 1
});

await postItem('block_faq_items', {
  faq: faqMitgliedId,
  question: 'Muss ich Arbeitsstunden leisten?',
  answer: '<p>Ja, laut Satzung leisten alle aktiven Mitglieder Arbeitsdienst zur Hege und Gewässerpflege bis zur Vollendung des 60. Lebensjahres (im Folgejahr entfällt die Pflicht). Befreit sind zudem Vereinsfunktionsträger, Menschen mit nachgewiesener Schwerbehinderung ab 50 % sowie passive Mitglieder. Bei körperlichen Beeinträchtigungen sprecht uns bitte direkt an.</p>',
  sort: 2
});

await postItem('block_faq_items', {
  faq: faqMitgliedId,
  question: 'Bis wann muss ich meine Fangmeldung abgeben?',
  answer: '<p>Die Fangmeldung muss bis spätestens 30. November eines jeden Jahres in der Geschäftsstelle abgegeben werden. Bei Versäumnis wird laut Beitragsordnung ein Strafbeitrag fällig (40 € für Erwachsene, 15 € für Jugendliche).</p>',
  sort: 3
});

// Verknüpfe FAQ mit Seite mitgliedschaft (pages_id: 5c160b3e-0427-56aa-811d-d61b0cd94ef8)
await postItem('pages_blocks', {
  pages_id: '5c160b3e-0427-56aa-811d-d61b0cd94ef8',
  collection: 'block_faq',
  item: faqMitgliedId,
  sort: 4
});
console.log('Linked FAQ to Mitgliedschaft page');

// 2. Neue FAQ Items für Gastkarten (Gastkarten FAQ ID: 26ac57bf-c3eb-5f4d-8768-c24a8a0169a7)
await postItem('block_faq_items', {
  faq: '26ac57bf-c3eb-5f4d-8768-c24a8a0169a7',
  question: 'Für welche Gewässer gilt die Gastkarte?',
  answer: '<p>Die Gastkarte gilt ausschließlich für den Stoteler See. Andere Vereinsgewässer wie die Lune oder der Teich Offenwarden sind den Vereinsmitgliedern vorbehalten.</p>',
  sort: 3
});

await postItem('block_faq_items', {
  faq: '26ac57bf-c3eb-5f4d-8768-c24a8a0169a7',
  question: 'Wie viele Handangeln / Ruten darf ich als Gastangler nutzen?',
  answer: '<p>Mit der Gastkarte darf mit bis zu 3 Handangeln / Ruten vom Ufer aus geangelt werden. Das Ausbringen vom Boot oder mit Futterbooten ist untersagt.</p>',
  sort: 4
});
console.log('Added new FAQ items to Gastkarten');
