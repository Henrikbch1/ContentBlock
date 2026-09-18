---
name: contentblock-directus-upgrade
description: >-
  Aktualisiert das ContentBlock-Projekt auf die vom Nutzer gewuenschte
  Directus-Version oder die verifizierte neueste stabile Version. Verwenden bei
  Directus-Upgrade, CMS-Update, Versionswechsel, Docker-Image-Update oder
  "Directus auf Version X/latest aktualisieren". Prueft Releases, Erweiterungen
  und Flows, sichert Datenbank/Uploads/Extensions/Schema, pinnt das Ziel-Image,
  verifiziert die lokale Instanz und dokumentiert Rollback und offene Risiken.
  Kein pauschales Upgrade von PostgreSQL, Redis oder Frontend-Abhaengigkeiten.
argument-hint: "Directus-Zielversion, z. B. 12.3.1 oder latest stable; optional nur vorbereiten"
user-invocable: true
---

# ContentBlock Directus Upgrade

## Auftrag und Grenzen

Dieser Skill aktualisiert die lokale Directus-Installation dieses Repositorys.
Beachte die [Projektregeln](../../copilot-instructions.md) und die Sicherheits-
und Authentifizierungsregeln des
[Directus-Agenten](../../agents/contentblock-directus.agent.md).
Antworte in der Sprache des Nutzers. Keine Subagenten erforderlich.

- Zielversion aus dem Auftrag uebernehmen, nie auf eine hier genannte Version
  festlegen. Bei fehlendem oder mehrdeutigem Ziel nachfragen.
- "Latest" bedeutet neueste stabile, offiziell veroeffentlichte Version,
  nicht Vorabversion oder Docker-Tag `latest`. Danach den konkreten Tag pinnen.
- Nur angefragte Arbeiten ausfuehren. "Nur vorbereiten" aendert keine laufende
  Instanz. Ein Upgrade-Auftrag erlaubt die lokale Aktualisierung, aber keine
  zusaetzlichen Inhaltsmigrationen, Berechtigungswechsel, Veroeffentlichungen,
  Extension-Deaktivierungen oder destruktiven Restore-Operationen.
- Keine fremden Stacks oder Remote-Deployments ohne eigenen Auftrag. PostgreSQL,
  Redis, SDK und Frontend-Abhaengigkeiten nicht nebenbei aktualisieren. Falls
  eine Zielversion solche Aenderungen verlangt: Umfang erklaeren und bestaetigen
  lassen, bevor die Voraussetzungen geaendert werden.
- Niemals `down -v`, Volume-Pruning, DB-Verzeichnis-Manipulation oder direkte
  SQL-Mutationen. Keine Secrets ausgeben, erfragen, in Git schreiben oder in
  `VITE_*` hinterlegen. Backups enthalten private Daten und bleiben ausserhalb Git.

## 1. Ist-Zustand und Ziel feststellen

1. Arbeitsbaum mit `git status --short` pruefen; vorhandene Aenderungen erhalten.
   [Compose](../../../cms/docker-compose.yml), [CMS-Dokumentation](../../../cms/README.md)
   und nur benoetigte Teile des [Snapshots](../../../cms/snapshots/snapshot.json) lesen.
2. Vom Repository-Root `docker compose -f cms/docker-compose.yml ps` ausfuehren.
   Konfigurierten Tag und wirklich laufendes Image getrennt erfassen. Dienste,
   Container-IDs, Volumes/Bind-Mounts und lokale URL ermitteln, nicht aus alten
   Beispielen uebernehmen. Keine aufgeloesten Compose-Secrets ausgeben.
3. `GET /server/health` an der bestaetigten URL pruefen. Bei 401/403 vorhandene
   Browser-Session oder bereitgestellte Umgebungs-Credentials verwenden; Nutzer
   bei Bedarf direkt in Studio anmelden lassen. Keine Bootstrap-Passwoerter raten.
4. Fuer Health und Inhaltsvergleiche frische GETs verwenden: Browser-Cache umgehen
   und auf kompatiblen Endpunkten einen eindeutigen Query-Parameter setzen.
   Ein alter `releaseId` kann gecacht sein. Niemals deswegen Redis leeren.
5. Die exakte Zielversion ueber offizielle Quellen pruefen:
   [Releases](https://github.com/directus/directus/releases),
   [Release-API](https://api.github.com/repos/directus/directus/releases/latest),
   bei festem Ziel den entsprechenden `/releases/tags/v<version>`-Endpunkt.
   Tag, Veroeffentlichung und Pre-Release-Status kontrollieren. Fuer andere
   Release-Schemata die tatsaechlich publizierte Tag-Bezeichnung verwenden.
6. Alle relevanten Versionsschritte zwischen Ist und Ziel lesen, einschliesslich
   erforderlicher Zwischen-Upgrades, Datenbank-/Node-Anforderungen, Lizenz- und
   Migrationsaenderungen. Nicht allein aus einem angehaengten Plan ableiten.
   Verfuegbarkeit des exakten Docker-Images pruefen, z. B. per Manifest-Abfrage.

**Gate:** Unveroeffentlichte/unpruefbare Ziele nicht durch eine andere Version
ersetzen. Pre-Releases nur auf ausdruecklichen Wunsch. Ein niedrigeres Ziel ist
kein normales Upgrade: stoppen und einen gesonderten Restore-Plan vereinbaren.
Bei gleicher laufender Version nur Abweichungen pruefen, kein erzwungenes Redeploy.

## 2. Kompatibilitaet und Freigaben

- Live `/flows` und `/operations` mit expliziten Feldern und Pagination lesen.
  Flows sind nicht im Schema-Snapshot enthalten. Keine Seeds oder Importskripte
  als vermeintlichen Health-Check ausfuehren.
- Release-spezifische Regeln anwenden, nicht als ewige API-Regeln festschreiben.
  Beispiel beim Ueberschreiten von 12.3.0: Update/Delete-Operationen ohne Ziel
  sowie Konflikte zwischen `key`, `query` und Batch-Payloads pruefen.
- `/extensions` inventarisieren: Name, Version, aktiviert/deaktiviert,
  Host-Kompatibilitaet. Bereits installierte Erweiterungen nicht doppelt
  installieren. Studio-Konsole und vorhandene Fehler vor dem Upgrade erfassen.
  Ein defekter Import kann alle App-Erweiterungen blockieren; Deaktivierung
  eines konkreten Verursachers nur nach Vorschau und ausdruecklicher Freigabe.
- Storage-Typ, Entrypoint/CMD und betroffene Env-Optionen mit Release Notes
  abgleichen. S3-spezifische Massnahmen nicht auf lokale Volumes uebertragen.
  Geaenderte Defaults als Entscheidung offenlegen; nicht ungefragt alte oder
  neue Grenzwerte erzwingen. Marketplace-Trust und Zugriffsrechte nicht erweitern.
- Repraesentative Inhalte, Mengen und M2A-Relationen fuer den Vorher/Nachher-
  Vergleich festhalten. Keine unnoetigen personenbezogenen Inhalte ausgeben.
  Ein Nutzer-Backup kann unvollstaendig oder veraltet sein.
- Zielinstanz, Ist/Ziel, erwartete Unterbrechung, Sicherungsziel und bekannte
  Risiken nennen. Bearbeitungspause mit dem Nutzer abstimmen. Staging fuer
  riskante Versionsspruenge vorsehen; falls nicht verfuegbar, das Risiko vor der
  Aenderung zur Bestaetigung vorlegen. Keine fremde Umgebung dafuer verwenden.

**Gate:** Ungeklaerte Inkompatibilitaeten vor Deployment beheben oder stoppen.
Schema-Anpassungen, Flow-Aenderungen oder Datenmigrationen separat mit genauer
Vorschau freigeben lassen. Runtime-Upgrade und AG-Grid-/Inhaltsmigration nie in
einem ungeprueften Schritt zusammenfassen.

## 3. Image vorbereiten und Rueckweg sichern

1. Nur den Directus-Image-Tag in Compose auf die verifizierte Version aendern.
   Direkt danach `docker compose -f cms/docker-compose.yml config --quiet`
   ausfuehren. Nie aufgeloeste Umgebungswerte mit `config` ausgeben.
2. `docker compose -f cms/docker-compose.yml pull directus` ausfuehren und den
   Exitcode pruefen. Bei Fehler bleibt die bisherige Instanz unangetastet.
   Alten Image-Tag und lokal vorhandenes Image/Digest fuer den Rueckweg notieren;
   kein Image-Pruning. Bei erforderlichen Zwischen-Upgrades pro Schritt verfahren.
3. Einen eindeutigen privaten Backup-Ordner ausserhalb des Repositorys anlegen,
   z. B. unter `%LOCALAPPDATA%/ContentBlock/backups/<zeitpunkt>-pre-<ziel>/`.
   Schreibbarkeit und ausreichend Speicher pruefen. Keine bestehenden Backups
   ueberschreiben. Quellversion, Mounts und Sicherungszeitpunkt ohne Secrets festhalten.
4. Nach abgestimmter Bearbeitungspause den Schema-Export der noch laufenden
   Quellversion erzeugen. CLI mit `--help` auf unterstuetzte Optionen pruefen.
   Auf der erprobten v12-Linie funktioniert im Directus-Service:

   ```powershell
   docker compose -f cms/docker-compose.yml exec -T directus node cli.js schema snapshot --yes --format json /tmp/pre-upgrade-schema.json
   ```

   Per `docker compose ... cp` in den Backup-Ordner kopieren und als JSON parsen.
   Default ist YAML trotz `.json`-Dateiendung. Bei fehlendem CLI eine dokumentierte
   authentifizierte Snapshot-API verwenden, ohne Credentials offenzulegen.

5. Nur Directus mit `docker compose -f cms/docker-compose.yml stop directus`
   stoppen. Datenbank und Cache bleiben laufen. Laufende Uploads/Schreibvorgaenge
   muessen beendet sein; auch externe Writer duerfen die Sicherung nicht veraendern.
6. PostgreSQL als logischen Custom-Dump im DB-Container sichern. Die Variablen
   werden innerhalb des bestaetigten DB-Containers aufgeloest, nicht ausgegeben:

   ```powershell
   docker compose -f cms/docker-compose.yml exec -T database sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f /tmp/contentblock-pre-upgrade.dump'
   docker compose -f cms/docker-compose.yml exec -T database pg_restore --list /tmp/contentblock-pre-upgrade.dump
   ```

   Jeden Befehl einzeln mit Exitcode pruefen, Dump ausserhalb des Containers
   sichern und Dateigroesse/Checksumme kontrollieren. Binardumps nicht durch
   PowerShell-Textpipelines oder Text-Umleitungen leiten. Die Listenausgabe
   zusammenfassen; ein lesbares Inhaltsverzeichnis ist noch kein Restore-Test.

7. Tatsaechliche Uploads und den gesamten Extensions-Bestand aus den zuvor
   ermittelten Mounts sichern, inklusive Marketplace-Registry und versteckter
   Dateien. `docker cp` funktioniert auch bei gestopptem Directus-Container.
   Nicht versehentlich leere lokale Ordner statt der benannten Volumes sichern.
   Externes Storage braucht ein entsprechendes konsistentes Backup/Versionierung.
8. Dump, Schema und Datei-Backups auf Vorhandensein und Lesbarkeit pruefen,
   erwartete Dateimengen/Groessen vergleichen. Ein geeignetes isoliertes
   Restore-/Staging-Verfahren nutzen, wenn vereinbart; Ergebnis ehrlich benennen.

**Gate:** Kein Start der Zielversion ohne verwendbaren Rueckweg. Bei Backup-Fehler
nach dem Stop nicht weiter upgraden. Den unveraenderten alten Container bei Bedarf
mit `docker compose -f cms/docker-compose.yml start directus` wieder starten und
Health pruefen; `up` wuerde bereits den geaenderten Ziel-Tag verwenden.
Ohne bestehenden Datenbestand ist dies eine Neuinstallation, kein gesichertes Upgrade.

## 4. Deployment und Verifikation

1. Nur Directus ersetzen:

   ```powershell
   docker compose -f cms/docker-compose.yml up -d --no-deps directus
   ```

   Kein pauschales `down`, kein Neustart von PostgreSQL/Redis, keine Volume-Loeschung.
   Das Image fuehrt auf der erprobten v12-Linie Migrationen beim Start aus;
   andere Zielversionen anhand ihrer Dokumentation pruefen. Nicht gleichzeitig
   manuell `database migrate:latest` starten.

2. Servicezustand, begrenzte Startup-/Migrationslogs und frischen Health-Read
   pruefen. Readiness-Pruefungen begrenzen, nicht endlos pollen oder schlafen.
   Bei asynchronen Tool-Ausfuehrungen auf deren Abschlussmeldung warten.
   "Container started" allein ist kein Erfolg. Keine Neustartschleife bei
   laufenden Migrationen. Bei Fehlern Diagnose sichern, nicht blind wiederholen.
3. API muss die erwartete Zielversion und gesunde Datenbank/Cache/Storage melden.
   Studio neu laden, Session bei Bedarf direkt vom Nutzer erneuern lassen.
   Extension-Ladefehler mit der Baseline vergleichen.
4. Risikoangemessener Smoke-Test: vorhandene Blocktypen und ihre Seiten,
   M2A-Auswahl, Relationen, Rich Text, bestehende Assets und Bildtransformation.
   Gezielte Upload-/Save-/Flow-Tests nur fuer freigegebene Testdatensaetze und
   ohne unbeabsichtigtes Publizieren oder externe Nebenwirkungen durchfuehren.
   Fehlende Blocktypen/Flows als nicht vorhanden, nicht als getestet melden.
5. Authentifizierte Reads und oeffentlichen Frontend-Zugriff getrennt pruefen.
   Fuer den Public-Check keine Admin-Cookies/Tokens mitsenden. Mengen und Werte
   mit der Baseline vergleichen; zwischenzeitliche Nutzer-Aenderungen nicht
   zuruecksetzen. Keine fremden Dirty-Forms fuer eigene Save-Tests verwenden.
6. Frontend nur bei erforderlicher Kompatibilitaetsanpassung editieren; die
   Frontend-Skills und Architektur-Invarianten laden. Danach `npm run build`
   in `frontend/` ausfuehren. Historische npm-Netzwerkfehler rechtfertigen nicht,
   einen Build mit vorhandenen Dependencies auszulassen. Bei UI-Aenderungen
   Desktop/Mobil und Tastatur pruefen, nicht nur per API auf Erfolg schliessen.

## 5. Snapshot, Dokumentation und Abschluss

- Frischen Post-Upgrade-Snapshot mit explizitem JSON-Format exportieren, parsen
  und strukturell vergleichen. Snapshot-Version erst nach erfolgreichem Live-
  Upgrade nachziehen. Geaenderte Felder gegen den Export vergleichen; bestehende
  lokale Aenderungen und fremde Schema-Abweichungen nicht blind ueberschreiben.
- [Schema-Snapshot](../../../cms/snapshots/snapshot.json),
  [Datenmodell](../../../docs/architecture/DB.md) und
  [CMS-Betriebsdokumentation](../../../cms/README.md) bei relevanten Aenderungen
  synchron halten. Inhalts- und Datei-Backups nicht in Git aufnehmen.
- Keine automatischen Commits oder Branches. Bei "nur vorbereiten" klar sagen,
  dass Compose vorbereitet, aber weder Live-Version noch Snapshot aktualisiert ist.
- Abschluss nennt Ziel-URL, vorherige/neue Version, betroffene Dienste und
  gegebenenfalls Erweiterungen, Backup-Ort, konkret bestandene Checks sowie
  ungetestete Bereiche. Staging-/Restore-Test und Keyboard-Tests nicht behaupten,
  wenn nur Archivstruktur oder Mausbedienung geprueft wurden.

## Fehler und Rollback

Nach begonnenen Migrationen nicht einfach das alte Image gegen die migrierte
Datenbank starten. Ein Rollback benoetigt den zur alten Version passenden Dump
und gegebenenfalls Upload-/Extension-Stand samt Konfiguration. Vor einem Restore
Ziel, Datenverlust seit Sicherungszeitpunkt und exakten Umfang nennen und
ausdruecklich bestaetigen lassen. Aktuellen Fehlerzustand zuerst separat sichern.
Restore nur ueber Datenbank-Backup-Werkzeuge, niemals durch direkte Manipulation
des PostgreSQL-Datenverzeichnisses. Anschliessend alte Version und Daten pruefen.
Ist kein sicherer Restore moeglich, stoppen und die Blockade klar melden.
