# npm install: Workaround für Firmenproxy (Zscaler + Lenze Root-CA)

## Problem

Auf diesem PC läuft ein Firmen-TLS-Proxy (Zscaler) inkl. interner Lenze-Root-CA. `npm install`
im Ordner `frontend/` schlägt deshalb fehl:

- **Ohne CA-Fix:** `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`
  (Node/npm kennt die im Windows-Zertifikatspeicher vertrauten Zscaler-/Lenze-Root-Zertifikate nicht,
  da Node ein eigenes CA-Bundle mitbringt und nicht den Windows-Zertifikatspeicher nutzt.)
- **Mit gesetztem `NODE_EXTRA_CA_CERTS`** (behebt nur das Zertifikatsproblem): `403 Forbidden`
  beim Zugriff auf `registry.npmjs.org` – betrifft auch Standardpakete wie `react`. Der Firmenproxy
  blockiert also den direkten Zugriff auf die öffentliche npm-Registry grundsätzlich.

Ein Firmen-Artifactory-Mirror (`artifactory.encoway-services.de`) existiert zwar in der globalen
`.npmrc`, wurde aber für dieses **private** Projekt bewusst **nicht** verwendet, da er
Firmen-Zugangsdaten voraussetzt.

## Lösung: `node_modules` auf einem anderen PC bauen und übertragen

### Schritt 1 – Auf dem anderen PC (ohne Proxy-Sperre)

1. Aktuellen Stand holen: `git pull` (stellt sicher, dass `frontend/package.json` und
   `frontend/package-lock.json` aktuell sind).
2. In den Frontend-Ordner wechseln:
   ```powershell
   cd frontend
   ```
3. Abhängigkeiten exakt gemäß `package-lock.json` installieren:
   ```powershell
   npm install
   ```
4. `node_modules` zippen:
   ```powershell
   Compress-Archive -Path node_modules -DestinationPath node_modules.zip -Force
   ```
5. `node_modules.zip` auf diesen PC übertragen (USB-Stick, Netzwerkfreigabe, Cloud-Speicher o.ä.).

### Schritt 2 – Auf diesem PC

1. Vorhandenen Ordner löschen (falls vorhanden):
   ```powershell
   cd frontend
   Remove-Item -Recurse -Force node_modules
   ```
2. Neues `node_modules.zip` nach `frontend/` kopieren (vorhandenes ersetzen).
3. Entpacken:
   ```powershell
   Expand-Archive -Path node_modules.zip -DestinationPath . -Force
   ```
4. Build prüfen:
   ```powershell
   npm run build
   ```
5. Dev-Server starten:
   ```powershell
   npm run dev
   ```

## Wichtig

- Bei **jeder** Änderung an `frontend/package.json` (neue/aktualisierte Abhängigkeit) muss dieser
  Kreislauf wiederholt werden: Änderung committen → auf dem anderen PC `npm install` → zippen →
  übertragen → hier entpacken.
- `frontend/package-lock.json` muss auf beiden PCs identisch sein, sonst installiert
  `npm install` auf dem anderen PC ggf. andere Versionen als erwartet.
- Der CA-Zertifikats-Fix (`NODE_EXTRA_CA_CERTS`, User-Umgebungsvariable, zeigt auf
  `%USERPROFILE%\.certs\corporate-ca-bundle.pem`) bleibt auf diesem PC bestehen und ist weiterhin
  sinnvoll für andere Tools – er löst aber **nicht** die 403-Sperre der öffentlichen npm-Registry.
