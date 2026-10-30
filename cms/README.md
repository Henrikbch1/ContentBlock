# CMS-Konfiguration

Hier liegt kein Directus-Core-Code. Directus laeuft als Container-Image.
Dieser Ordner enthaelt Konfiguration, `snapshots/` fuer die Schema-Versionierung
und lokale Interface-Erweiterungen unter `extensions/`.

Die Datenbank liegt lokal in `database/`. Uploads und Marketplace-Erweiterungen
liegen in persistenten Docker-Volumes und werden nicht eingecheckt.

## Sicherheit

| Einstellung                         | Wert             | Wirkung                                                            |
| ----------------------------------- | ---------------- | ------------------------------------------------------------------ |
| `MARKETPLACE_TRUST`                 | `sandbox`        | Marketplace-Erweiterungen nur, wenn sie sandboxed laufen           |
| `RATE_LIMITER_ENABLED` / `_STORE`   | `true` / `redis` | Anfragen pro IP werden ueber den vorhandenen Redis-Dienst gezaehlt |
| `RATE_LIMITER_POINTS` / `_DURATION` | `50` / `1`       | 50 Anfragen pro Sekunde und IP, danach HTTP 429                    |

`MARKETPLACE_TRUST` wirkt auf die Installation, bereits installierte Erweiterungen
laufen weiter. Hinter einem Reverse-Proxy `IP_TRUST_PROXY`/`IP_CUSTOM_HEADER`
pruefen, sonst teilen sich alle Besucher ein Kontingent.

### Public-Rechte als Code

Die Public-Policy darf ausschliesslich lesen. Der Sollzustand steht in
[snapshots/apply-public-permissions.mjs](snapshots/apply-public-permissions.mjs)
und wird mit einem Admin-Token angewendet. Das Skript entfernt alle anderen
Public-Rechte (create, update, delete, share und nicht genutzte Collections) und ist
idempotent; `--dry-run` zeigt nur die Aenderungen.

```powershell
$env:DIRECTUS_URL = "http://localhost:8055"
$env:DIRECTUS_TOKEN = "<admin-token>"
node cms/snapshots/apply-public-permissions.mjs --dry-run
node cms/snapshots/apply-public-permissions.mjs
```

Alle Rechte gelten nur fuer die Aktion `read`, ohne Zeilenfilter. System-Felder
(`user_created`, `date_created`, `user_updated`, `date_updated`) sind nie lesbar.
Neue Frontend-Felder oder -Collections muessen hier und im Skript ergaenzt werden.

| Collection             | Lesbare Felder                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `site`                 | id, navigation, footer, theme                                                                               |
| `navigation`           | id, logo, brand_text, items                                                                                 |
| `nav_items`            | id, navigation, label, parent, type, page, external_url, sort                                               |
| `footer`               | id, copyright, contact_text, legal_heading, imprint_label, privacy_label, imprint_page, privacy_page, columns |
| `footer_links`         | id, footer, label, page, external_url, sort                                                                 |
| `theme`                | id, primary_color, secondary_color, accent_color, background_color, surface_color, text_color, font_heading, font_body, border_radius, spacing_scale, container_width, shadow_style |
| `pages`                | id, title, slug, template, blocks                                                                           |
| `pages_blocks`         | id, pages_id, collection, item, sort                                                                        |
| `block_hero`           | id, background, title, subtitle, image, buttons                                                             |
| `block_hero_buttons`   | id, hero, label, href, variant, sort                                                                        |
| `block_text`           | id, background, headline, content                                                                           |
| `block_image`          | id, background, image, alt                                                                                  |
| `block_table`          | id, background, title, data                                                                                 |
| `block_cards`          | id, background, title, cards                                                                                |
| `block_cards_items`    | id, card, title, text, image, sort                                                                          |
| `block_faq`            | id, background, title, faqs                                                                                 |
| `block_faq_items`      | id, faq, question, answer, sort                                                                             |
| `block_contacts`       | id, background, title, mode, show_photo, show_email, show_phone, layout, roles                              |
| `block_contacts_roles` | id, block_contacts, role, sort                                                                              |
| `block_documents`      | id, background, title, mode, filter_category, docs                                                          |
| `block_docs_docs`      | id, block_documents, document, sort                                                                         |
| `block_ticker`         | id, background, background_color, text_color, messages                                                      |
| `block_ticker_items`   | id, ticker, text, link, sort                                                                                |
| `block_news`           | id, background, title, mode, filter_category, limit                                                         |
| `block_events`         | id, background, title, mode, filter_category, limit                                                         |
| `categories`           | id, name, slug, parent, sort                                                                                |
| `roles`                | id, name, parent, sort                                                                                      |
| `people`               | id, first_name, last_name, role, photo, email, phone                                                        |
| `documents`            | id, title, file, category                                                                                   |
| `news`                 | id, title, slug, published_date, teaser, cover_image, body, category                                        |
| `events`               | id, title, slug, start_date, end_date, location, description, show_days_before, visible_from, category      |
| `directus_files`       | id, title, description, type, filename_download, filesize, width, height                                    |

`people.email` und `people.phone` sind oeffentlich lesbar, weil Kontakt-Blocks sie
anzeigen. Collections ohne Eintrag (`templates`, `templates_blocks`, `nav_groups`,
`nav_links`, Benutzer, Rollen, Einstellungen) sind fuer anonyme Besucher gesperrt.
Das Frontend nutzt `VITE_DIRECTUS_TOKEN` optional; ohne Token gelten genau diese Rechte.
Da `VITE_`-Variablen im Browser sichtbar sind, darf dort kein Admin-Token oder
anderes geheimes Token hinterlegt werden.

## Redaktion: Inhalte, Navigation und PDFs

1. Eine Seite in `pages` mit einem eindeutigen Titel und Slug anlegen und die
   gewuenschten Inhalts-Blocks in der richtigen Reihenfolge zuordnen. Tabellen
   werden wie bisher im AG-Grid gepflegt.
2. Unter der mit `site.navigation` verknuepften Navigation klare, kurze
   Beschriftungen und die zugehoerigen Seiten oder URLs pflegen. Ueber `parent`
   und `sort` die Hierarchie und Reihenfolge festlegen. Fuer Kerninformationen
   moeglichst flache Menues verwenden und die tatsaechlichen Wege pruefen.
3. Die Suche findet Navigationsbeschriftungen sowie Titel oeffentlich lesbarer
   Seiten, Nachrichten und aktuell sichtbarer Termine. Sie findet keine
   Blocktexte, Tabellenzellen oder PDF-Inhalte. Auch nicht verlinkte Seiten
   koennen erscheinen. Die Suche ersetzt keine Berechtigungen.
4. Fuer zwei PDF-Varianten zwei **tatsaechlich unterschiedliche, gepruefte**
   Dateien hochladen und je einen Dokumenteintrag mit eindeutigem Titel wie
   „Aufnahmeformular – Farbe“ und „Aufnahmeformular – Schwarz-Weiss“ anlegen.
   Beide Dokumente im Dokument-Block im Modus `manual` auswaehlen und die
   Verknuepfungen in die gewuenschte Reihenfolge bringen, oder sie derselben im
   Modus `by_category` verwendeten Kategorie zuordnen. Der Block zeigt die beiden
   Eintraege getrennt an und oeffnet jeweils die hinterlegte Datei.
5. Seite und Downloads auf schmalem und breitem Bildschirm sowie mit Tastatur
   pruefen. Beide PDFs oeffnen und die Schwarz-Weiss-Datei auf Drucktauglichkeit
   kontrollieren. Bei „Datei nicht verfuegbar“ die Datei im Dokumenteintrag
   hinterlegen. Falls der gesamte Dokument-Block nicht geladen wird, die
   Dokumentverknuepfungen und Leserechte pruefen.

Eine automatische Umwandlung oder eine verknuepfte Varianten-Auswahl existiert
noch nicht. Bestehende einzelne Dateien werden nicht als Farb- oder
Schwarz-Weiss-Version bezeichnet. Die Public-Policy hat keine Zeilenfilter.
Vertrauliche Inhalte gehoeren nicht in oeffentlich lesbare Collections.

## Farben fuer das neutrale Frontend

Der neue Farbmodus ist opt-in. Die technische Aktivierung steht in der
[Frontend-Architektur](../frontend/frontend-architektur.md#neutraler-modus).
Ohne Aktivierung bleibt das bisherige Theme unveraendert.

1. In Directus das mit `site.theme` verknuepfte Theme oeffnen.
2. Unter `primary_color` eine deckende Hex-Farbe wie `#005f62` auswaehlen.
3. Optional unter `accent_color` eine zweite deckende Hex-Farbe waehlen.
   Bleibt das Feld leer, wird nur die erste Farbe verwendet.
4. Speichern und die Website im hellen und dunklen Systemmodus pruefen.

Im neutralen Modus berechnet das Frontend die Varianten und korrigiert die
geprueften Kontraste. Die Felder `secondary_color`, `background_color`,
`surface_color` und `text_color` sowie eigene Ticker-Farben wirken dort nicht.
Schriften, Abstaende, Radius und Schatten bleiben pflegbar. Nicht unterstuetzte
Farbwerte verursachen eine Warnung in der Browserkonsole und verwenden einen
sicheren Standard. Die Farbanpassung ersetzt keine Sicht- und
Barrierefreiheitspruefung der Inhalte.

## Flows

Flows stehen in [snapshots/flows.seed.json](snapshots/flows.seed.json) und werden mit
`node cms/snapshots/import-flows.mjs cms/snapshots/flows.seed.json` importiert
(`DIRECTUS_URL`, `DIRECTUS_TOKEN` wie oben). Der Import ersetzt Flows gleichen Namens.

| Flow                                   | Verhalten                                                                                                                                                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Slugify (categories/pages/news/events) | Erzeugt `slug` aus `name` bzw. `title` nur, wenn der Slug leer ist. Ein gesetzter Slug wird nie ueberschrieben; Updates ohne `slug` im Payload lassen ihn unveraendert.                                                                                                              |
| Events - visible_from                  | `visible_from = start_date - show_days_before` Tage. Fehlende Werte liest der Flow bei Updates aus dem bestehenden Item; auch ein reines Update von `show_days_before` rechnet neu. Bei Sammel-Updates mehrerer Items mit unvollstaendigem Payload bleibt `visible_from` unberuehrt. |

## Directus Runtime und AG Grid

### Directus 12.5.0 (09.10.2026)

Die lokale Instanz wurde von 12.3.1 auf 12.5.0 aktualisiert. PostgreSQL 17
und Redis 7 blieben unveraendert. Vorher wurden Schema, PostgreSQL-Custom-Dump,
Uploads und Extensions ausserhalb des Repositorys gesichert:
`%LOCALAPPDATA%/ContentBlock/backups/20261009-pre-12.5.0/`.
Der Dump wurde mit `pg_restore --list` strukturell geprueft und die externe
Kopie per SHA-256 mit dem Original verglichen; ein isolierter Restore-Test fand
nicht statt. Die Schemaexporte vor und nach dem Upgrade enthalten dieselben 40
Collections ohne strukturelle Aenderungen. Die bestehende lokale Abweichung bei
`block_ticker_items` im getrackten Snapshot wurde beibehalten.

Directus meldet nach dem Start eine aktivierte Open-Innovation-Grant-Lizenz;
Health-Checks fuer PostgreSQL, Redis, lokalen Storage und E-Mail waren gesund.
Flows und Operations waren leer, Policies enthielten keine IP-Regeln. Die
Extensions wurden beim Start geladen und ihre Source-Route antwortete mit HTTP 200. Sechs installierte Erweiterungen deklarieren in ihren Metadaten jedoch
keinen Directus-12-Hostbereich; ihre fachliche Studio-Funktion wurde nicht
vollstaendig getestet. Inhalts-Reads fuer Seiten und Block-Items antworteten mit
HTTP 403 FORBIDDEN, daher fand kein vollstaendiger Inhalts-Smoke-Test statt.

### Directus 12.3.1 (18.09.2026)

Die lokale Instanz wurde am 18.09.2026 von 12.2.0 auf 12.3.1 aktualisiert.
Das Image ist in [docker-compose.yml](docker-compose.yml) fest gepinnt.
Vorher wurden ein PostgreSQL-Custom-Dump, Uploads, Erweiterungen und ein
Schema-Snapshot ausserhalb des Repositorys gesichert:
`%LOCALAPPDATA%/ContentBlock/backups/pre-12.3.1-20260918-142016/`.
Der Dump wurde mit `pg_restore --list` strukturell geprueft; ein Restore-Test
in einer separaten Staging-Instanz wurde nicht durchgefuehrt.
Ein Rollback erfordert die Wiederherstellung der Datenbank und Erweiterungen
zusammen mit dem alten Image, nicht nur einen Image-Downgrade.

`block_table.data` verwendet jetzt das lokale Interface `contentblock-table`.
Es ergaenzt die installierte Marketplace-Erweiterung
`directus-extension-ag-grid-interface@1.0.2` um tabellenspezifische Spalten,
Loeschaktionen und Undo. Neue Tabellen starten mit zwei Spalten.
Build, Deployment und Rollback stehen in der
[Erweiterungsdokumentation](extensions/directus-extension-contentblock-table/README.md).
Beide Erweiterungen liegen im bestehenden Extensions-Volume; ein Schema-Import
installiert sie nicht automatisch. Die inkompatible Erweiterung
`@directus-labs/tree-view-table-layout@1.0.2` wurde deaktiviert, nicht geloescht:
ihr unaufgeloester Import von `@directus/system-data` verhinderte das Laden
aller Studio-Erweiterungen.

Datenformat, Grenzen und Pruefschritte stehen im
[Datenmodell](../docs/architecture/DB.md#ag-grid-fuer-block_table).
Schema-Snapshots immer mit explizitem Format erzeugen:
`node cli.js schema snapshot --yes --format json /tmp/snapshot.json`.
Der CLI-Standard ist YAML, unabhaengig von der Dateiendung.
