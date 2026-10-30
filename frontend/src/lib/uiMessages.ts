/** Zentrale UI-Labels sowie Fallbacks für optionale Directus-Texte. */
export const UI_LABELS = {
  skipToContent: "Zum Inhalt springen",
  footerContact: "Kontakt",
  footerQuickLinks: "Schnellzugriff",
  footerLegal: "Rechtliches",
  imprint: "Impressum",
  privacy: "Datenschutz",
  defaultCopyright: "ContentBlock",
  notice: "Hinweis",
  news: "Nachricht",
  event: "Termin",
  document: "Dokument",
  readNews: "Beitrag lesen",
  viewEvent: "Termin ansehen",
} as const;

/** Zentrale Lade-/Fehler-/Leertexte, um Duplikate über Blocks/Pages zu vermeiden. */
export const LOADING_MESSAGES = {
  page: "Seite wird geladen ...",
  news: "Nachrichten werden geladen ...",
  newsDetail: "Beitrag wird geladen ...",
  events: "Veranstaltungen werden geladen ...",
  eventsPage: "Termine werden geladen ...",
  eventDetail: "Termin wird geladen ...",
  documents: "Dokumente werden geladen ...",
  contacts: "Kontakte werden geladen ...",
  connection: "Directus-Verbindung wird geprüft ...",
  search: "Suche läuft ...",
} as const;

export const ERROR_MESSAGES = {
  page: "Die Seite konnte nicht geladen werden.",
  news: "Nachrichten konnten nicht geladen werden.",
  newsDetail: "Der Beitrag konnte nicht geladen werden.",
  events: "Veranstaltungen konnten nicht geladen werden.",
  eventsPage: "Termine konnten nicht geladen werden.",
  eventDetail: "Der Termin konnte nicht geladen werden.",
  documents: "Dokumente konnten nicht geladen werden.",
  contacts: "Kontakte konnten nicht geladen werden.",
  connection: "Die Verbindung zu Directus konnte nicht hergestellt werden.",
  search: "Seiten, Nachrichten und Termine konnten nicht durchsucht werden.",
} as const;

export const EMPTY_MESSAGES = {
  content: "Noch keine Inhalte vorhanden.",
  richText: "Noch kein Text vorhanden.",
  notFoundPage: "Die angeforderte Seite wurde nicht gefunden.",
  cards: "Keine Karten vorhanden.",
  contacts: "Keine Kontakte vorhanden.",
  contactsByRole:
    "Für die ausgewählten Rollen sind aktuell keine Personen hinterlegt.",
  documents: "Keine Dokumente vorhanden.",
  documentFile: "Datei nicht verfügbar.",
  events: "Keine Veranstaltungen vorhanden.",
  eventsPage: "Keine Termine vorhanden.",
  eventNotFound: "Der Termin wurde nicht gefunden.",
  faq: "Keine Fragen vorhanden.",
  news: "Keine Nachrichten vorhanden.",
  newsNotFound: "Der Beitrag wurde nicht gefunden.",
  table: "Keine Tabellendaten vorhanden.",
  tableNoResults: "Keine passenden Tabellenzeilen gefunden.",
  search: "Keine passenden Einträge gefunden.",
  untitled: "Ohne Titel",
} as const;
