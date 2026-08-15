#!/usr/bin/env node

import { createHash } from "node:crypto";

const directusUrl = (
  process.env.DIRECTUS_URL ?? "http://localhost:8055"
).replace(/\/+$/, "");
const email = process.env.DIRECTUS_EMAIL;
const password = process.env.DIRECTUS_PASSWORD;

if (!email || !password) {
  throw new Error("DIRECTUS_EMAIL und DIRECTUS_PASSWORD müssen gesetzt sein.");
}

const seedId = (name) => {
  const value = createHash("sha1").update(`asv-loxstedt:${name}`).digest("hex");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-5${value.slice(13, 16)}-8${value.slice(17, 20)}-${value.slice(20, 32)}`;
};

const login = async () => {
  const response = await fetch(`${directusUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok)
    throw new Error(`Anmeldung fehlgeschlagen: ${response.status}`);
  return (await response.json()).data.access_token;
};

const token = await login();

const request = async (path, options = {}) => {
  const response = await fetch(`${directusUrl}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers ?? {}) },
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `${options.method ?? "GET"} ${path}: ${response.status} ${JSON.stringify(body)}`,
    );
  }
  return body?.data;
};

const upsert = async (collection, name, data) => {
  const id = seedId(name);
  const payload = JSON.stringify({ id, ...data });
  const createResponse = await fetch(`${directusUrl}/items/${collection}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload,
  });
  if (createResponse.ok) return (await createResponse.json()).data;
  const createBody = await createResponse.text();
  if (
    createResponse.status !== 400 ||
    !createBody.includes("RECORD_NOT_UNIQUE")
  ) {
    throw new Error(
      `POST /items/${collection}: ${createResponse.status} ${createBody}`,
    );
  }
  const response = await fetch(`${directusUrl}/items/${collection}/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload,
  });
  if (!response.ok)
    throw new Error(
      `PATCH /items/${collection}/${id}: ${response.status} ${await response.text()}`,
    );
  if (response.status === 204) return { id };
  return (await response.json()).data;
};

const upload = async (name, sourceUrl, title) => {
  const id = seedId(`asset:${name}`);
  const existing = await fetch(`${directusUrl}/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (existing.ok) return id;

  const source = await fetch(sourceUrl);
  if (!source.ok) throw new Error(`Download fehlgeschlagen: ${sourceUrl}`);
  const form = new FormData();
  form.set("id", id);
  form.set("title", title);
  form.set(
    "file",
    new Blob([await source.arrayBuffer()], {
      type: source.headers.get("content-type") ?? "application/octet-stream",
    }),
    name,
  );
  const response = await fetch(`${directusUrl}/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok)
    throw new Error(
      `Upload ${name}: ${response.status} ${await response.text()}`,
    );
  return (await response.json()).data.id;
};

const createBlock = async (collection, name, data) =>
  upsert(collection, `block:${name}`, data);

const createHeroBlock = async (name, data, buttons = []) => {
  await createBlock("block_hero", name, data);
  for (const [sort, button] of buttons.entries()) {
    await upsert("block_hero_buttons", `hero-button:${name}:${sort + 1}`, {
      hero: seedId(`block:${name}`),
      ...button,
      sort: sort + 1,
    });
  }
};

const createCardsBlock = async (name, data, cards) => {
  await createBlock("block_cards", name, data);
  for (const [sort, card] of cards.entries()) {
    await upsert("block_cards_items", `card-item:${name}:${sort + 1}`, {
      card: seedId(`block:${name}`),
      ...card,
      sort: sort + 1,
    });
  }
};

const createFaqBlock = async (name, data, faqs) => {
  await createBlock("block_faq", name, data);
  for (const [sort, faq] of faqs.entries()) {
    await upsert("block_faq_items", `faq-item:${name}:${sort + 1}`, {
      faq: seedId(`block:${name}`),
      ...faq,
      sort: sort + 1,
    });
  }
};

const createContactsBlock = async (name, data, roles) => {
  await createBlock("block_contacts", name, data);
  for (const [sort, role] of roles.entries()) {
    await upsert("block_contacts_roles", `contact-role:${name}:${sort + 1}`, {
      block_contacts: seedId(`block:${name}`),
      role,
      sort: sort + 1,
    });
  }
};

const createTickerBlock = async (name, data, messages) => {
  await createBlock("block_ticker", name, data);
  for (const [sort, message] of messages.entries()) {
    await upsert("block_ticker_items", `ticker-item:${name}:${sort + 1}`, {
      ticker: seedId(`block:${name}`),
      ...message,
      sort: sort + 1,
    });
  }
};

const attachBlock = async (page, collection, item, sort) =>
  upsert("pages_blocks", `page-block:${page}:${sort}`, {
    pages_id: seedId(`page:${page}`),
    collection,
    item: seedId(`block:${item}`),
    sort,
  });

const html = (strings, ...values) =>
  String.raw({ raw: strings }, ...values)
    .replace(/\n\s*/g, " ")
    .trim();

const imageSources = {
  see: "https://www.asv-loxstedt.de/.cm4all/uproc.php/0/alte%20bilder/.1.jpg/picture-1600?_=182932cd0a0",
  lune: "https://www.asv-loxstedt.de/.cm4all/uproc.php/0/Gew%C3%A4sser/neue%20Lune/.big_14913064_0_1055-700.JPG/picture-1600?_=182888c3028",
  seeDetail:
    "https://www.asv-loxstedt.de/.cm4all/uproc.php/0/.3_6.jpg/picture-1600?_=18bb8a8609d",
};

const documentSources = {
  aufnahmeantrag:
    "https://www.asv-loxstedt.de/.cm4all/uproc.php/0/Aufnahmeantrag_ASV_Loxstedt_Stoteler_See_e.V.-1-1.pdf?cdp=a&_=18627ce1658",
  regeln:
    "https://www.asv-loxstedt.de/.cm4all/uproc.php/0/Downloads/Verhaltensregeln-1.pdf?cdp=a&_=1833545e688",
  fangmeldung1:
    "https://www.asv-loxstedt.de/.cm4all/uproc.php/0/Fangmeldungen%20Seite%201.docx?cdp=a&_=18b4c0e1040",
  fangmeldung2:
    "https://www.asv-loxstedt.de/.cm4all/uproc.php/0/Downloads/Fangmeldungen%20Seite%202.docx?cdp=a&_=1833545ee58",
};

const [seeImage, luneImage, seeDetailImage] = await Promise.all([
  upload("stoteler-see.jpg", imageSources.see, "Stoteler See"),
  upload("lune.jpg", imageSources.lune, "Neue Lune"),
  upload("stoteler-see-detail.jpg", imageSources.seeDetail, "Stoteler See"),
]);

const [applicationFile, rulesFile, catchReportOneFile, catchReportTwoFile] =
  await Promise.all([
    upload(
      "aufnahmeantrag.pdf",
      documentSources.aufnahmeantrag,
      "Aufnahmeantrag",
    ),
    upload(
      "verhaltensregeln.pdf",
      documentSources.regeln,
      "Verhaltens- und Angelregeln",
    ),
    upload(
      "fangmeldung-seite-1.docx",
      documentSources.fangmeldung1,
      "Fangmeldung Seite 1",
    ),
    upload(
      "fangmeldung-seite-2.docx",
      documentSources.fangmeldung2,
      "Fangmeldung Seite 2",
    ),
  ]);

await upsert("theme", "theme", {
  primary_color: "#005f62",
  secondary_color: "#d7e9e6",
  accent_color: "#e7b552",
  background_color: "#f4f7f4",
  text_color: "#17312e",
  font_heading: "serif",
  border_radius: "sm",
});

const categories = [
  ["Mitgliedschaft", "Mitgliedschaft"],
  ["Regeln", "Regeln"],
  ["Fangmeldungen", "Fangmeldungen"],
  ["Karten und Gewaesser", "Karten und Gewässer"],
];
for (const [sort, [key, name]] of categories.entries())
  await upsert("categories", `category:${key}`, { name, sort: sort + 1 });

const roles = [
  ["1. Vorsitzender", "1. Vorsitzender"],
  ["2. Vorsitzender", "2. Vorsitzender"],
  ["1. Kassenwart", "1. Kassenwart"],
  ["2. Kassenwart", "2. Kassenwart"],
  ["1. Schriftwart", "1. Schriftwart"],
  ["1. Gewaesserwart", "1. Gewässerwart"],
  ["2. Gewaesserwart", "2. Gewässerwart"],
  ["3. Gewaesserwart", "3. Gewässerwart"],
  ["1. Sportwart", "1. Sportwart"],
  ["2. Sportwart", "2. Sportwart"],
  ["3. Sportwart (Seniorenwart)", "3. Sportwart (Seniorenwart)"],
  ["1. Jugendwart", "1. Jugendwart"],
  ["2. Jugendwart", "2. Jugendwart"],
  ["Vorsitzender Ehrenrat", "Vorsitzender Ehrenrat"],
];
for (const [sort, [key, name]] of roles.entries())
  await upsert("roles", `role:${key}`, { name, sort: sort + 1 });

const people = [
  [
    "Dominick-Bohling",
    "Dominick",
    "Bohling",
    "1. Vorsitzender",
    "1.Vorsitzender@asv-loxstedt.de",
  ],
  [
    "Stefan-Rueckert",
    "Stefan",
    "Rückert",
    "2. Vorsitzender",
    "2.Vorsitzender@asv-loxstedt.de",
  ],
  [
    "Marko-Heuer",
    "Marko",
    "Heuer",
    "1. Kassenwart",
    "Kassenwart@asv-loxstedt.de",
  ],
  ["Reinhard-Zey", "Reinhard", "Zey", "2. Kassenwart", null],
  [
    "Juergen-Bohling",
    "Jürgen",
    "Bohling",
    "1. Schriftwart",
    "Schriftfuehrer@asv-loxstedt.de",
  ],
  [
    "Moritz-Wohlers",
    "Moritz",
    "Wohlers",
    "1. Gewaesserwart",
    "Gewaesserwart@asv-loxstedt.de",
  ],
  ["Jakob-Brant", "Jakob", "Brant", "2. Gewaesserwart", null],
  ["Mario-Sarrazin-Jahn", "Mario", "Sarrazin-Jahn", "3. Gewaesserwart", null],
  [
    "Christoph-Piecha",
    "Christoph",
    "Piecha",
    "1. Sportwart",
    "Sportwart@asv-loxstedt.de",
  ],
  ["z. Zt.-unbesetzt", "z. Zt.", "unbesetzt", "2. Sportwart", null],
  [
    "Karl-Heinz-Liedtke",
    "Karl-Heinz",
    "Liedtke",
    "3. Sportwart (Seniorenwart)",
    "3.Sportwart-Senioren@asv-loxstedt.de",
  ],
  [
    "Timo-Sander",
    "Timo",
    "Sander",
    "1. Jugendwart",
    "Jugendwart@asv-loxstedt.de",
  ],
  ["Henrik-Buechner", "Henrik", "Büchner", "2. Jugendwart", null],
  [
    "Piotr-Poltorak",
    "Piotr",
    "Poltorak",
    "Vorsitzender Ehrenrat",
    "Ehrenrat@asv-loxstedt.de",
  ],
];
for (const [key, first_name, last_name, role, contactEmail] of people) {
  await upsert("people", `person:${key}`, {
    first_name,
    last_name,
    role: seedId(`role:${role}`),
    email: contactEmail,
  });
}

const documents = [
  ["Aufnahmeantrag", applicationFile, "Mitgliedschaft"],
  ["Verhaltens- und Angelregeln am Stoteler See", rulesFile, "Regeln"],
  ["Fangmeldung - Seite 1", catchReportOneFile, "Fangmeldungen"],
  ["Fangmeldung - Seite 2", catchReportTwoFile, "Fangmeldungen"],
];
for (const [title, file, category] of documents) {
  await upsert("documents", `document:${title}`, {
    title,
    file,
    category: seedId(`category:${category}`),
  });
}

const pages = [
  ["home", "ASV Loxstedt Stoteler See e.V."],
  ["verein", "Der Verein"],
  ["jugend", "Jugend"],
  ["mitgliedschaft", "Mitgliedschaft"],
  ["gewaesser/stoteler-see", "Stoteler See"],
  ["gewaesser/lune-neue-lune", "Lune und Neue Lune"],
  ["gastkarten", "Gastkarten"],
  ["aktuelles-termine", "Aktuelles und Termine"],
  ["galerie", "Impressionen"],
  ["kontakt", "Kontakt"],
  ["downloads", "Downloads"],
  ["impressum", "Impressum"],
  ["datenschutz", "Datenschutz"],
];
for (const [slug, title] of pages)
  await upsert("pages", `page:${slug}`, { title, slug });

await createHeroBlock(
  "home-hero",
  {
    title: "Am Wasser zuhause.",
    subtitle:
      "Angeln, Natur und Gemeinschaft am Stoteler See, an der Lune und der Neuen Lune.",
    image: seeImage,
  },
  [
    { label: "Gastkarte holen", href: "/gastkarten", variant: "primary" },
    {
      label: "Gewässer entdecken",
      href: "/gewaesser/stoteler-see",
      variant: "secondary",
    },
  ],
);
await createTickerBlock(
  "home-admission-stop",
  { background_color: "#e7b552", text_color: "#17312e" },
  [
    {
      text: "Wichtiger Hinweis: Aktuell besteht ein Aufnahmestopp. Informationen zur Mitgliedschaft bleiben hier verfügbar.",
      link: seedId("page:mitgliedschaft"),
    },
  ],
);
await createBlock("block_text", "home-welcome", {
  headline: "Willkommen beim ASV Loxstedt",
  content: html`<p>
    Seit 1975 verbindet unser Verein Menschen, die verantwortungsvoll angeln und
    unsere Gewässer pflegen. Hier finden Mitglieder und Gäste schnell die
    Informationen, die sie am Wasser brauchen.
  </p>`,
});
await createCardsBlock("home-waters", { title: "Unsere Gewässer" }, [
  {
    title: "Stoteler See",
    text: "Rund 30 Hektar Wasserfläche, Strukturen bis 15 Meter Tiefe und ein vielfältiger Fischbestand.",
    image: seeDetailImage,
    sort: 1,
  },
  {
    title: "Lune und Neue Lune",
    text: "Fließgewässer mit ruhigen und gut erreichbaren Angelstellen sowie wechselnden Bedingungen.",
    image: luneImage,
    sort: 2,
  },
]);
await createBlock("block_events", "home-events", {
  title: "Die nächsten Termine",
  mode: "upcoming",
  limit: 3,
});

await createBlock("block_text", "verein-about", {
  headline: "Der Verein",
  content: html`<p>
      Der Angelsportverein Loxstedt "Stoteler See" e.V. wurde 1975 gegründet.
      Mit rund 420 Mitgliedern und einer starken Jugendgruppe engagieren wir uns
      für naturnahes Angeln, Gewässerpflege und ein aktives Vereinsleben.
    </p>
    <p>
      Der historische Vortrag zum 25-jährigen Bestehen bleibt als Teil der
      Vereinschronik erhalten, bekommt aber keine eigene Unterseite mehr.
    </p>`,
});
await createContactsBlock(
  "verein-board",
  {
    title: "Unser Vorstand",
    mode: "by_role",
    show_photo: true,
    show_email: true,
    show_phone: false,
    layout: "grid",
  },
  roles.map(([key]) => seedId(`role:${key}`)),
);

await createBlock("block_text", "jugend-intro", {
  headline: "Jugend beim ASV Loxstedt",
  content: html`<p>
      Unsere Jugendgruppe umfasst seit vielen Jahren mehr als 35 junge
      Mitglieder. Für Einsteiger hält der Verein hochwertiges Leihgerät bereit.
      Workshops vermitteln Zielfische, Montagen und Methoden in Theorie und
      Praxis; in den Sommermonaten stehen gemeinsame Hegefischen auf dem
      Programm.
    </p>
    <p>
      Ab dem 14. Geburtstag können Jugendliche die Sportfischerprüfung ablegen.
      Vorbereitungskurs und Prüfung bietet der Verein an. Ansprechpartner sind
      unsere Jugendwarte.
    </p>`,
});
await createContactsBlock(
  "jugend-contacts",
  {
    title: "Jugendwarte",
    mode: "by_role",
    show_photo: false,
    show_email: true,
    show_phone: false,
    layout: "list",
  },
  [seedId("role:1. Jugendwart"), seedId("role:2. Jugendwart")],
);

await createBlock("block_text", "membership-intro", {
  headline: "Mitglied werden",
  content: html`<p>
      Für die Aufnahme benötigen wir zwei Passbilder, den Nachweis der
      bestandenen Fischerprüfung (falls vorhanden) sowie den vollständig
      ausgefüllten Aufnahmeantrag mit Einzugsermächtigung. Bitte gebt die
      Unterlagen in der Geschäftsstelle ab.
    </p>
    <p>
      Mitglieder leisten Arbeitsdienste. Ausgenommen sind Mitglieder ab 60
      Jahren, Amtsinhaber, Menschen mit nachgewiesener Schwerbehinderung ab 50
      Prozent und passive Mitglieder.
    </p>`,
});
await createBlock("block_table", "membership-fees", {
  title: "Beiträge und Gebühren",
  data: [
    {
      cells: [
        { value: "Art" },
        { value: "Aufnahme" },
        { value: "Jahresbeitrag" },
      ],
    },
    {
      cells: [
        { value: "Erwachsene" },
        { value: "120 EUR" },
        { value: "75 EUR" },
      ],
    },
    {
      cells: [
        { value: "Jugendliche" },
        { value: "keine Gebühr" },
        { value: "28 EUR" },
      ],
    },
    {
      cells: [
        { value: "Partnerschaft gemeinsam" },
        { value: "180 EUR" },
        { value: "112,50 EUR" },
      ],
    },
    { cells: [{ value: "Passiv" }, { value: "-" }, { value: "37,50 EUR" }] },
  ],
});
await createBlock("block_documents", "membership-documents", {
  title: "Unterlagen",
  mode: "by_category",
  filter_category: seedId("category:Mitgliedschaft"),
});

await createHeroBlock("see-hero", {
  title: "Der Stoteler See",
  subtitle: "Unser Hausgewässer im südwestlichen Teil von Stotel.",
  image: seeImage,
});
await createBlock("block_text", "see-details", {
  headline: "Ein See mit Charakter",
  content: html`<p>
      Der während des Baus der A27 entstandene See ist von Bäumen, Schilfgürteln
      und Seerosen umgeben. Auf rund 30 Hektar Wasserfläche reichen die Tiefen
      bis 15 Meter. Rotaugen, Brassen, Karpfen, Hechte, Barsche, Zander, Aale
      und Welse gehören zum sich selbst reproduzierenden Bestand.
    </p>
    <p>
      Bitte beachtet die aktuellen Verhaltens- und Angelregeln sowie die
      Tiefenkarte vor dem Ansitz.
    </p>`,
});
await createBlock("block_documents", "see-documents", {
  title: "Karten und Regeln",
  mode: "by_category",
  filter_category: seedId("category:Regeln"),
});

await createHeroBlock("lune-hero", {
  title: "Lune und Neue Lune",
  subtitle: "Abwechslungsreiche Fließgewässer in unserer Mitpacht.",
  image: luneImage,
});
await createBlock("block_text", "lune-details", {
  headline: "Wasserstand und Strömung im Blick behalten",
  content: html`<p>
      Der ASV ist Mitpächter der Neuen Lune sowie der Lune III und IV. Die
      Abschnitte bieten Chancen auf heimische Fried- und Raubfische, besonders
      Zander, Brassen und Güster.
    </p>
    <p>
      Durch Zu- und Abwässerung können Wasserstand und Strömung, vor allem an
      der Neuen Lune, deutlich schwanken. Gut erreichbare Plätze finden sich an
      der Lune; abgelegene Stellen liegen in Neuenlande und an den Windrädern.
      Beachtet vor dem Angeln die Schaukästen: einzelne Abschnitte können für
      Pflege oder Vereinsveranstaltungen gesperrt sein.
    </p>`,
});

await createBlock("block_text", "guest-intro", {
  headline: "Gastangeln am Stoteler See",
  content: html`<p>
    Gastkarten gelten ausschließlich für den Stoteler See. Voraussetzung ist ein
    gültiger Bundesfischereischein. Bitte beachtet die Regeln auf dem Gastschein
    und hinterlasst euren Platz sauber.
  </p>`,
});
await createBlock("block_table", "guest-fee", {
  title: "Gastkarte",
  data: [
    { cells: [{ value: "Leistung" }, { value: "Information" }] },
    { cells: [{ value: "Preis" }, { value: "15 EUR" }] },
    { cells: [{ value: "Gültigkeit" }, { value: "06:00 bis 22:00 Uhr" }] },
    {
      cells: [
        { value: "Nachtangeln" },
        { value: "Mit Gastkarten nicht erlaubt" },
      ],
    },
    {
      cells: [
        { value: "Boote" },
        { value: "Nicht erlaubt, auch kein Futterboot oder Bellyboot" },
      ],
    },
  ],
});
await createCardsBlock("guest-sales-points", { title: "Verkaufsstellen" }, [
  {
    title: "Fisherman's Partner",
    text: "Zur hohen Lieth 11, 27619 Schiffdorf-Spaden",
    sort: 1,
  },
  {
    title: "Autoteile-Becker",
    text: "Helmut-Neynaber-Straße 10, 27612 Loxstedt",
    sort: 2,
  },
]);
await createFaqBlock("guest-faq", { title: "Häufige Fragen" }, [
  {
    question: "Darf ich nachts angeln?",
    answer:
      "<p>Nein. Die Gastkarte gilt von 06:00 bis 22:00 Uhr. Danach muss der Platz abgebaut und der See zeitnah verlassen werden.</p>",
    sort: 1,
  },
  {
    question: "Brauche ich einen Fischereischein?",
    answer:
      "<p>Ja. Ein gültiger Bundesfischereischein ist Voraussetzung für die Gastkarte.</p>",
    sort: 2,
  },
]);

await createBlock("block_text", "events-intro", {
  headline: "Aktuelles und Termine",
  content: html`<p>
    Arbeitsdienste, Königsangeln und weitere Vereinsveranstaltungen werden hier
    veröffentlicht. Termine werden erst ab ihrem festgelegten Sichtbarkeitsdatum
    angezeigt.
  </p>`,
});
await createBlock("block_events", "events-list", {
  title: "Terminkalender",
  mode: "upcoming",
  limit: -1,
});

await createCardsBlock("gallery-impressions", { title: "Impressionen" }, [
  {
    title: "Stoteler See",
    text: "Natur und Angeln am Hausgewässer.",
    image: seeImage,
    sort: 1,
  },
  {
    title: "Neue Lune",
    text: "Abwechslungsreiche Fließgewässer.",
    image: luneImage,
    sort: 2,
  },
  {
    title: "Am Wasser",
    text: "Gemeinschaft und Gewässerpflege.",
    image: seeDetailImage,
    sort: 3,
  },
]);

await createBlock("block_text", "contact-intro", {
  headline: "Kontakt",
  content: html`<p>
      Die Vorstandssitzung findet jeden dritten Dienstag im Monat ab 18:30 Uhr
      im Vereinsheim statt. Dort könnt ihr Fragen stellen und Unterlagen
      abgeben. Für direkte Anfragen erreicht ihr die zuständigen Personen per
      E-Mail.
    </p>
    <p>
      Das Kontaktformular öffnet euer E-Mail-Programm; es werden keine
      Formulardaten auf dieser Website gespeichert.
    </p>`,
});
await createContactsBlock(
  "contact-form",
  {
    title: "Nachricht senden",
    mode: "by_role",
    show_photo: false,
    show_email: false,
    show_phone: false,
    layout: "form",
  },
  [seedId("role:1. Vorsitzender")],
);
await createContactsBlock(
  "contact-board",
  {
    title: "Direkte Ansprechpartner",
    mode: "by_role",
    show_photo: false,
    show_email: true,
    show_phone: false,
    layout: "list",
  },
  [
    seedId("role:1. Vorsitzender"),
    seedId("role:1. Gewaesserwart"),
    seedId("role:1. Jugendwart"),
  ],
);

await createBlock("block_documents", "downloads-all", {
  title: "Downloads",
  mode: "latest",
});
await createBlock("block_text", "downloads-note", {
  headline: "Aktuelle Unterlagen",
  content: html`<p>
    Aufnahmeantrag, Vereinsregeln und Fangmeldungen sind hier direkt verfügbar.
    Eine aktuelle Datei zu Schonzeiten und Mindestmaßen kann in der Kategorie
    <strong>Regeln</strong> ergänzt werden, sobald sie vorliegt.
  </p>`,
});
await createBlock("block_text", "imprint-content", {
  headline: "Impressum",
  content: html`<p>
      <strong>Angelsportverein Loxstedt "Stoteler See" e.V.</strong
      ><br />Vertreten durch den 1. Vorsitzenden Dominick Bohling<br />Vereinsregister:
      Amtsgericht Tostedt, VR 110074
    </p>
    <p>
      Telefon: <a href="tel:+4917680832246">0176 80832246</a><br />E-Mail:
      <a href="mailto:1.Vorsitzender@asv-loxstedt.de"
        >1.Vorsitzender@asv-loxstedt.de</a
      >
    </p>
    <p>
      Bankverbindung: Volksbank Elbe-Weser-Dreieck eG<br />IBAN: DE31 2926 5747
      3600 3395 00<br />BIC: GENODEF1BEV
    </p>`,
});
await createBlock("block_text", "privacy-content", {
  headline: "Datenschutz",
  content: html`<p>
      Verantwortliche Stelle für diese Website ist der Angelsportverein Loxstedt
      "Stoteler See" e.V. unter den im Impressum genannten Kontaktdaten.
    </p>
    <p>
      Beim Aufruf der Website verarbeitet der technische Hosting-Anbieter
      Server-Logdaten, um die Verbindung bereitzustellen und die Sicherheit des
      Angebots zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
    </p>
    <p>
      Sie haben insbesondere das Recht auf Auskunft, Berichtigung, Löschung,
      Einschränkung der Verarbeitung und Widerspruch. Für Datenschutzanfragen
      schreiben Sie bitte an
      <a href="mailto:1.Vorsitzender@asv-loxstedt.de"
        >1.Vorsitzender@asv-loxstedt.de</a
      >.
    </p>
    <p>
      Externe Karten oder Videos werden nicht ohne vorherige Einwilligung
      geladen.
    </p>`,
});

const pageBlocks = [
  ["home", "block_hero", "home-hero"],
  ["home", "block_ticker", "home-admission-stop"],
  ["home", "block_text", "home-welcome"],
  ["home", "block_cards", "home-waters"],
  ["home", "block_events", "home-events"],
  ["verein", "block_text", "verein-about"],
  ["verein", "block_contacts", "verein-board"],
  ["jugend", "block_text", "jugend-intro"],
  ["jugend", "block_contacts", "jugend-contacts"],
  ["mitgliedschaft", "block_text", "membership-intro"],
  ["mitgliedschaft", "block_table", "membership-fees"],
  ["mitgliedschaft", "block_documents", "membership-documents"],
  ["gewaesser/stoteler-see", "block_hero", "see-hero"],
  ["gewaesser/stoteler-see", "block_text", "see-details"],
  ["gewaesser/stoteler-see", "block_documents", "see-documents"],
  ["gewaesser/lune-neue-lune", "block_hero", "lune-hero"],
  ["gewaesser/lune-neue-lune", "block_text", "lune-details"],
  ["gastkarten", "block_text", "guest-intro"],
  ["gastkarten", "block_table", "guest-fee"],
  ["gastkarten", "block_cards", "guest-sales-points"],
  ["gastkarten", "block_faq", "guest-faq"],
  ["aktuelles-termine", "block_text", "events-intro"],
  ["aktuelles-termine", "block_events", "events-list"],
  ["galerie", "block_cards", "gallery-impressions"],
  ["kontakt", "block_text", "contact-intro"],
  ["kontakt", "block_contacts", "contact-form"],
  ["kontakt", "block_contacts", "contact-board"],
  ["downloads", "block_documents", "downloads-all"],
  ["downloads", "block_text", "downloads-note"],
  ["impressum", "block_text", "imprint-content"],
  ["datenschutz", "block_text", "privacy-content"],
];
const sortByPage = new Map();
for (const [page, collection, item] of pageBlocks) {
  const sort = (sortByPage.get(page) ?? 0) + 1;
  sortByPage.set(page, sort);
  await attachBlock(page, collection, item, sort);
}

const navigation = await upsert("navigation", "navigation", {});
const navigationId = navigation.id;
const navItems = [
  ["Der Verein", "Der Verein", null, null, "group"],
  ["Ueber uns", "Über uns", "Der Verein", "verein", "page"],
  ["Jugend", "Jugend", "Der Verein", "jugend", "page"],
  ["Mitgliedschaft", "Mitgliedschaft", "Der Verein", "mitgliedschaft", "page"],
  ["Gewaesser", "Gewässer", null, null, "group"],
  [
    "Stoteler See",
    "Stoteler See",
    "Gewaesser",
    "gewaesser/stoteler-see",
    "page",
  ],
  [
    "Lune und Neue Lune",
    "Lune und Neue Lune",
    "Gewaesser",
    "gewaesser/lune-neue-lune",
    "page",
  ],
  ["Gastkarten", "Gastkarten", null, "gastkarten", "page"],
  ["Aktuelles", "Aktuelles", null, "aktuelles-termine", "page"],
  [
    "Terminkalender",
    "Terminkalender",
    "Aktuelles",
    "aktuelles-termine",
    "page",
  ],
  ["Impressionen", "Impressionen", "Aktuelles", "galerie", "page"],
  ["Kontakt", "Kontakt", null, "kontakt", "page"],
];
for (const [sort, [key, label, parentKey, slug, type]] of navItems.entries()) {
  await upsert("nav_items", `nav:${key}`, {
    navigation: navigationId,
    label,
    type,
    page: slug ? seedId(`page:${slug}`) : null,
    parent: parentKey ? seedId(`nav:${parentKey}`) : null,
    sort: sort + 1,
  });
}

const footer = await upsert("footer", "footer", {
  copyright: 'Angelsportverein Loxstedt "Stoteler See" e.V.',
  imprint_page: seedId("page:impressum"),
  privacy_page: seedId("page:datenschutz"),
});
const footerLinks = [
  ["Downloads", "downloads"],
  ["Vereinsregeln", "downloads"],
  ["Arbeitsdienst und Termine", "aktuelles-termine"],
  ["Mitglied werden", "mitgliedschaft"],
  ["Gastkarten", "gastkarten"],
];
for (const [sort, [label, slug]] of footerLinks.entries())
  await upsert("footer_links", `footer:${label}`, {
    footer: footer.id,
    label,
    page: seedId(`page:${slug}`),
    sort: sort + 1,
  });

await request("/items/site", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    navigation: navigationId,
    footer: footer.id,
    theme: seedId("theme"),
  }),
});
console.log("ASV-Loxstedt-Inhalte wurden erfolgreich importiert.");
