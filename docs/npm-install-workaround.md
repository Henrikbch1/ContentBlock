# npm install: Workaround für gesperrten Registry-Zugriff

## Problem

Auf manchen PCs blockiert das Netzwerk den direkten Zugriff auf die öffentliche npm-Registry
(`registry.npmjs.org`), sodass `npm install` im Ordner `frontend/` fehlschlägt – etwa mit
`UNABLE_TO_GET_ISSUER_CERT_LOCALLY` oder `403 Forbidden`, auch bei Standardpaketen wie `react`.

## Lösung: `node_modules` auf einem anderen PC bauen und übertragen

### Schritt 1 – Auf einem PC ohne Netzwerksperre

Aktuellen Stand holen (stellt sicher, dass `frontend/package.json` und
`frontend/package-lock.json` aktuell sind):

```powershell
git pull
```

In den Frontend-Ordner wechseln und Abhängigkeiten exakt gemäß `package-lock.json` installieren:

```powershell
cd frontend
npm install
```

`node_modules` zippen:

```powershell
Compress-Archive -Path node_modules -DestinationPath node_modules.zip -Force
```

`node_modules.zip` auf den Ziel-PC übertragen (USB-Stick, Netzwerkfreigabe, Cloud-Speicher o. ä.).

### Schritt 2 – Auf dem gesperrten PC

Vorhandenen Ordner löschen (falls vorhanden) und neues `node_modules.zip` nach `frontend/`
kopieren (vorhandenes ersetzen), dann entpacken:

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Expand-Archive -Path node_modules.zip -DestinationPath . -Force
```

Build prüfen:

```powershell
npm run build
```

Dev-Server starten:

```powershell
npm run dev
```

## Wichtig

- Bei **jeder** Änderung an `frontend/package.json` (neue/aktualisierte Abhängigkeit) muss dieser
  Kreislauf wiederholt werden: Änderung committen → auf dem anderen PC `npm install` → zippen →
  übertragen → hier entpacken.
- `frontend/package-lock.json` muss auf beiden PCs identisch sein, sonst installiert
  `npm install` auf dem anderen PC ggf. andere Versionen als erwartet.
