# Recherche und Setup für das generische ContentBlock-Frontend

**Stand der Recherche: 30.10.2026.** Dieser Stand umfasst Projektanalyse und
Ressourcenauswahl, **keine** Designfreigabe und keine Umsetzung. Die Quellen
wurden auf Aktivität, Lizenz und Eignung geprüft; Zahlen und Versionen ändern
sich. Die Anleitung richtet sich an Windows und GitHub Copilot in VS Code.

**Haltepunkt:** Die ausgewählten Ressourcen werden zunächst auf einem anderen
PC bereitgestellt. Danach bitte Bescheid geben. Erst dann folgt das Konzept
mit Seitenstruktur, Navigation, Farbsystem, Komponenten und begründeten
Vorschlägen für eventuelle Modelländerungen. Vor deren Umsetzung wird die
Freigabe eingeholt. Der bestehende Kern bleibt erhalten.

## Projektbefund

| Bereich | Vorhandener Stand |
| --- | --- |
| Laufzeit | [Directus 12.5.0](cms/docker-compose.yml), PostgreSQL und Redis; das Frontend ist eine clientseitige React-19-/Vite-/TypeScript-SPA mit Tailwind 4. Kein SSR und kein separates Router-Paket. |
| Verbindung | Das [Directus-SDK](frontend/src/lib/directus.ts) und typisierte Queries bilden die Grenze zum CMS. `site` verknüpft Navigation, Footer und Theme. Eine gruppenspezifische Frontend-Auswahl ist nicht nachgewiesen. |
| Seiten und Navigation | Seiten verknüpfen über `pages_blocks` elf Blocktypen; sortierte `nav_items` unterstützen Eltern, interne Seiten und externe Links. Siehe [Datenmodell](docs/architecture/DB.md) und [Block-Registry](frontend/src/components/blocks/BlockRenderer.tsx). |
| Pflege von Tabellen | Der [AG-Grid-Wrapper](cms/extensions/directus-extension-contentblock-table/README.md) ergänzt Zeilen-/Spaltenaktionen, Bestätigung und Undo. `block_table.data` bleibt ein flaches JSON mit `col_N` und Kopfzeile. Das öffentliche [Tabellen-Frontend](frontend/src/components/blocks/TableBlock.tsx) scrollt mobil bislang horizontal. |
| Design | [components.json](frontend/components.json) konfiguriert shadcn und semantische CSS-Variablen; Radix-Abhängigkeiten sind vorhanden, aber noch keine generierten `components/ui`-Dateien. Lucide sowie die lokal gehosteten variablen Schriften [DM Sans](frontend/public/fonts/dm-sans-latin-wght-normal.woff2) und [Fraunces](frontend/public/fonts/fraunces-latin-wght-normal.woff2) sind bereits vorhanden. |
| Farben | Das [Theme-Mapping](frontend/src/lib/themeVariables.ts) übernimmt mehrere CMS-Farben und validiert ihre CSS-Syntax. Es erzeugt noch keine kontrastgeprüfte Akzentskala; ein systematischer Light-/Dark-Mode ist derzeit nicht belegt. |
| Downloads | `documents` hat derzeit ein Dateifeld; der [Dokumentenblock](frontend/src/components/blocks/DocumentsBlock.tsx) bietet noch keine Auswahl zwischen zwei PDF-Varianten. |
| Bekannte Prüfungslücke | Der historische Upgrade-Bericht in der [CMS-Dokumentation](cms/README.md) erwähnt HTTP 403 bei Seiten-/Block-Lesezugriffen und keinen vollständigen Inhalts-Smoke-Test. Das ist **kein** in dieser Recherche geprüfter aktueller Laufzeitstatus; vor visuellen Tests die laufende Instanz und Public-Rechte prüfen. |

Die hier vorgefundenen Werte in Compose und Snapshot sind maßgeblich; ältere
Versionsangaben in anderen Dokumenten sind kein Upgrade-Auftrag. Directus 12.5
verwendet laut seiner [versionsbezogenen Lizenz](https://github.com/directus/directus/blob/v12.5.0/license)
die **MSCL-1.0-GPL**; die konkreten Nutzungs- und Weitergabebedingungen sind für
den jeweiligen Einsatz zu prüfen.

## Priorisierte Ressourcen

**Muss** = für den gewünschten späteren Arbeitsablauf einplanen; **Soll** =
sinnvolle Ergänzung; **Kann** = erst bei konkretem Bedarf. „Vorhanden“ bedeutet:
prüfen und nutzen, nicht erneut installieren. Die verlinkten Abschnitte enthalten
den konkreten Befehl, Zielpfad und den manuellen bzw. Offline-Weg.

| Name | Typ | Link | Zweck für dieses Projekt | Priorität | Genaue Installations-/Ablageanweisung |
| --- | --- | --- | --- | --- | --- |
| Projekt-Skills `frontend-design`, `contentblock-frontend`, `contentblock-architecture`, `shadcn` | Skill | [Vorhandene Skills](.github/skills) | Bestehende Architektur, Designregeln und shadcn-Workflow beibehalten; keine Duplikate. | Muss, vorhanden | Keine Installation. Vor UI-Arbeiten die passenden vorhandenen Skills laden. |
| Emil: `break-ui` | Skill | [emilkowalski/skills](https://github.com/emilkowalski/skills) | Grenzfälle wie lange Labels, leere Listen und ungewöhnliche Inhalte prüfen. | Muss | Nach `.github/skills/break-ui` oder per CLI nach `.agents/skills`; [Skills-Anleitung](#skills). |
| Emil: `emil-design-eng` | Skill | [emil-design-eng](https://github.com/emilkowalski/skills/tree/main/skills/emil-design-eng) | Dezente Interaktionen, Easing und UI-Feinschliff. | Soll | Nach `.github/skills/emil-design-eng`; [Skills-Anleitung](#skills). |
| Emil: `mobile-native` | Skill | [mobile-native](https://github.com/emilkowalski/skills/tree/main/skills/mobile-native) | Touch-, Viewport- und Mobilbrowser-Fallen erkennen, ohne eine App-Optik zu erzwingen. | Soll | Nach `.github/skills/mobile-native`; [Skills-Anleitung](#skills). |
| Emil: `review-animations` | Skill | [review-animations](https://github.com/emilkowalski/skills/tree/main/skills/review-animations) | Gezielte Prüfung vorhandener Animationen. | Kann | Nach `.github/skills/review-animations`; explizit aufrufen; [Skills-Anleitung](#skills). |
| Emil: `pick-ui-library` | Skill | [pick-ui-library](https://github.com/emilkowalski/skills/tree/main/skills/pick-ui-library) | Bibliothekswahl bei einer konkreten Lücke hinterfragen. | Kann | Nach `.github/skills/pick-ui-library`; explizit aufrufen; [Skills-Anleitung](#skills). |
| Impeccable | Skill/Package | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `audit` und `critique`, Designkontext und Erkennen häufiger KI-Designmuster. | Muss | `npx impeccable install` auf dem anderen PC oder vollständigen Skill kopieren; Windows-Engine separat prüfen; [Skills](#skills) und [Offline-Transfer](#offline-transfer). |
| Taste: `design-taste-frontend` | Skill | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | Zusätzlicher, gezielter Referenz-/Redesign-Audit; wegen Überschneidung nicht bei jeder Änderung. | Kann | Nach `.github/skills/design-taste-frontend`; [Skills-Anleitung](#skills). |
| Playwright MCP | MCP/Package | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | Browsersteuerung und Screenshots auf Mobile, Tablet und Desktop. | Muss | `@playwright/mcp` im `frontend` installieren und lokalen MCP eintragen; [MCP](#mcp). |
| Playwright Test und axe-core | Package | [Playwright](https://playwright.dev/) · [axe-core](https://github.com/dequelabs/axe-core) | Wiederholbare Interaktions-, Screenshot- und automatisierte Accessibility-Tests. | Soll | `@playwright/test` und `@axe-core/playwright` als Dev-Abhängigkeiten; [Abhängigkeiten](#abhaengigkeiten). |
| shadcn/ui und Radix | Repo/Package | [shadcn/ui](https://ui.shadcn.com/) · [Radix Primitives](https://www.radix-ui.com/primitives) | Zugängliche Bausteine für Navigation, Dialoge, Formulare und Layout; bestehende Tokens nutzen. | Muss, teilweise vorhanden | CLI `shadcn` optional als Dev-Abhängigkeit; Komponenten **erst nach Freigabe** gezielt erzeugen; [Produktpakete](#produktpakete). |
| shadcn MCP | MCP | [shadcn MCP](https://ui.shadcn.com/docs/mcp) | Komponenten und Registries suchen; kein Ersatz für Quellen- und Accessibility-Review. | Soll | Lokales `frontend/node_modules/shadcn/dist/index.js mcp` mit `cwd` auf `frontend`; [MCP](#mcp). |
| Magic UI | Repo | [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | Optional einzelne Layout-/Effektideen aus einer shadcn-kompatiblen Registry. | Kann | Keine Komplettinstallation; nach Freigabe einzelne Komponente am anderen PC erzeugen und prüfen; [Produktpakete](#produktpakete). |
| Motion for React | Package | [Motion](https://motion.dev/docs/react) | Komplexere, unterbrechbare Animationen nur, wenn CSS nicht genügt; Reduced Motion beachten. | Kann | Später `npm install --save-exact motion` in `frontend`; [Produktpakete](#produktpakete). |
| Lucide | Package | [Lucide](https://lucide.dev/) | Konsistente Icons ergänzen Textbeschriftungen, ersetzen sie aber nicht. | Muss, vorhanden | `lucide-react` ist bereits in [package.json](frontend/package.json); keine Neuinstallation. |
| Atkinson Hyperlegible Next | Package | [Fontsource](https://fontsource.org/fonts/atkinson-hyperlegible-next) | Optional lesbare variable Alternative; vorhandene lokale Fonts zunächst beibehalten. | Kann | Nach Entscheidung `npm install --save-exact @fontsource-variable/atkinson-hyperlegible-next` oder WOFF2 mit Lizenz nach `frontend/public/fonts`; [Produktpakete](#produktpakete). |
| TanStack Table | Package | [TanStack Table](https://tanstack.com/table/latest) | Headless Sortierung und Filter für öffentliche Tabellen; mobile Karten und Semantik separat umsetzen. | Kann | Nach Konzeptfreigabe `npm install --save-exact @tanstack/react-table`; [Produktpakete](#produktpakete). AG Grid im CMS bleibt bestehen. |
| React Hook Form | Package | [React Hook Form](https://react-hook-form.com/) | Erst für komplexere, zugängliche Formulare mit Validierung. | Kann | Nach Bedarf `npm install --save-exact react-hook-form`; [Produktpakete](#produktpakete). |
| Color.js | Package | [Color.js](https://colorjs.io/) | OKLCH-Farbverarbeitung und WCAG-Kontrastmessung als Grundlage für eine automatische Prüfung. | Soll, nach Konzept | `npm install --save-exact colorjs.io`; [Farben](#farben) und [Produktpakete](#produktpakete). |
| Adobe Leonardo | Package/Repo | [adobe/leonardo](https://github.com/adobe/leonardo) | Alternative bzw. Ergänzung zur kontrastorientierten Skalenberechnung; nicht ungeprüft parallel einführen. | Kann | Bei begründetem Bedarf `npm install --save-exact @adobe/leonardo-contrast-colors`; [Farben](#farben). |
| Radix Colors | Repo | [Radix Colors](https://www.radix-ui.com/colors) · [Palette-Tool](https://www.radix-ui.com/colors/custom) | Referenz für abgestufte Farbpaletten und Zustände. | Kann | Kein Paket erforderlich; optional `npm install --save-exact @radix-ui/colors`; [Farben](#farben). |
| React PDF | Package | [@react-pdf/renderer](https://react-pdf.org/) | Neue PDFs aus strukturierten Daten im Browser oder auf einem Server erzeugen. | Kann | Nach PDF-Entscheidung `npm install --save-exact @react-pdf/renderer`; [PDF](#pdf). |
| Ghostscript | Repo | [Ghostscript](https://ghostscript.com/) · [Quellcode](https://github.com/ArtifexSoftware/ghostpdl) | Mögliche serverseitige Umwandlung vorhandener PDFs; Lizenz und Ausgabequalität sind gesondert zu prüfen. | Kann | Offizielle Windows-Ausgabe außerhalb des Repos installieren; keine Übernahme ohne Entscheidung; [PDF](#pdf). |
| Directus MCP und SDK-Doku | MCP/Repo | [Directus MCP](https://directus.com/docs/guides/ai/mcp/installation) · [SDK-Doku](https://directus.com/docs/guides/connect/sdk) | Sicherer Zugriff auf freigegebene Testdaten und versionsbezogene SDK-Dokumentation. | Soll | MCP ist ab Directus 11.12 integriert; nur dedizierten Read-only-Zugang konfigurieren; [MCP](#mcp). SDK ist vorhanden. |
| Context7 | MCP | [upstash/context7](https://github.com/upstash/context7) | Optional aktueller Doku-Zugriff für öffentliche Bibliotheken und Versionen. | Kann | Remote-HTTP-MCP `https://mcp.context7.com/mcp`, nur bei erlaubtem Dienst; [MCP](#mcp). Keine Projekt- oder CRM-Daten senden. |
| React-, Tailwind- und WCAG-Doku | Repo | [React](https://react.dev/learn) · [Tailwind](https://tailwindcss.com/docs) · [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) | Maßgebliche, versionspassende Referenzen statt unpassender Next.js-/SSR-Regeln. | Muss | Keine Installation. Öffentliche Dokumentation und vorhandene Projekt-Skills verwenden. |

**Korrektur zum Pflichtkandidaten:** `https://github.com/egonkowalski/skills`
lieferte bei der Recherche 404. Die genannten fünf Skills liegen nachweislich
unter **[emilkowalski/skills](https://github.com/emilkowalski/skills)**.

**Kurzablauf für den anderen PC:** Erstens Impeccable, `break-ui`,
`emil-design-eng` und `mobile-native` auswählen; Taste und die zwei weiteren
Emil-Skills sind zusätzliche Optionen. Zweitens Playwright MCP, Playwright
Test, axe, shadcn CLI und Impeccable wie unten installieren und MCP-Einträge
bei Bedarf ergänzen. Drittens Skill-Dateien, Lizenzen, Manifest und Lockfile
gezielt bereitstellen und `node_modules` separat übertragen. Produktpakete
und CMS-Änderungen bleiben bis nach der Konzeptfreigabe zurückgestellt.

## Kombination statt Überladung

- **Basis:** vorhandene Projekt-Skills plus Impeccable und `break-ui`.
  `emil-design-eng` und `mobile-native` ergänzen gezielt Motion und mobile
  Robustheit. `review-animations` und `pick-ui-library` nur bei konkretem Anlass.
- **Taste** überschneidet sich erheblich mit `frontend-design` und Impeccable
  und kann zusätzliche Browser-/Tokenzeit kosten. Optional für einen
  eingegrenzten Audit oder ein freigegebenes Redesign; kein pauschaler Ersatz
  der bestehenden Seiten und keine zufällige Art-Direction gegen die
  Projektziele. Bilder nur mit geklärter Lizenz und Freigabe verwenden.
- Projektregeln und Barrierefreiheit haben Vorrang vor Empfehlungen aus
  Drittanbieter-Skills. Die vorhandene SPA wird nicht auf Next.js oder SSR
  umgestellt. Der untersuchte [Vercel-React-Skill](https://github.com/vercel-labs/agent-skills)
  enthält auch Next.js-/SSR-Ratschläge; die Root-Lizenzlage war nicht eindeutig.
  Deshalb nicht ungeprüft vendoren oder pauschal aktivieren.

## Voraussetzungen

1. Auf beiden Windows-PCs gleiche Architektur verwenden; hier wurde **Windows
   x64 mit Node 22.23.2 und npm 11.13.0** festgestellt. Für das aktuelle
   `npx skills` ist laut Anbieter **Node 22.20 oder neuer** erforderlich.
   `node --version`, `npm --version` und `node -p "process.platform + ' ' + process.arch"`
   auf beiden PCs vergleichen.
2. Der andere PC benötigt Git, npm-Registry-Zugriff und einen aktuellen
   Edge/Chrome/Chromium. Edge kann den Playwright-MCP-Browser ohne separaten
   Chromium-Download bereitstellen; echte Browser-/Gerätetests sind später
   trotzdem sinnvoll.
3. Der hier dokumentierte [Installations-Workaround](docs/npm-install-workaround.md)
   ist verbindlich: Installation auf dem anderen Rechner, Manifest und Lockfile
   über Git, `node_modules` separat übertragen. Ein lesender Registry-Abruf
   scheiterte hier mit HTTP 403; es wurde nichts installiert und keine Sperre
   umgangen. Bei einer Sperre nicht Zertifikatsprüfung, Registry-Policy oder
   andere Sicherheitsvorgaben abschalten.
4. Vor jedem Kopieren fremde Skill-Dateien, Skripte und etwaige Hooks prüfen,
   Version oder Git-Commit notieren und Lizenzen mit übernehmen. Bestehende
   Skills und MCP-Einträge nicht überschreiben. VS Code kann projektspezifische
   Skills unter `.github/skills` laden; die aktuelle `skills`-CLI verwendet für
   `github-copilot` `.agents/skills`. **Einen Skill nur an einem Ort ablegen.**

## Skills

Alle folgenden Befehle laufen **auf dem anderen PC im Repository-Root**.
Die CLI-Schritte setzen erlaubten npm- und GitHub-Zugriff voraus. Siehe
[CLI-Optionen](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
und [VS-Code-Skill-Dokumentation](https://code.visualstudio.com/docs/agent-customization/agent-skills).

### Emil-Skills

Offizieller Weg, zunächst mit den drei empfohlenen Skills:

```powershell
$env:DO_NOT_TRACK = "1"
npx skills@latest add emilkowalski/skills --skill break-ui emil-design-eng mobile-native --agent github-copilot --copy
```

Optional die zwei weiteren ausdrücklich gewünschten Kandidaten ergänzen:

```powershell
npx skills@latest add emilkowalski/skills --skill review-animations pick-ui-library --agent github-copilot --copy
```

Die CLI legt die Skills aktuell unter `.agents/skills/<name>` ab. Ihre
`SKILL.md` und jeweils benötigte Begleitdateien wie `CATALOG.md` beziehungsweise
`STANDARDS.md` müssen vorhanden sein. Root-`LICENSE` aus dem Quell-Repository
auch bei einer CLI-Installation mit den kopierten Skills aufbewahren. Die
beiden optionalen Skills setzen `disable-model-invocation: true`: bei Bedarf
explizit aufrufen, nicht auf automatische Aktivierung verlassen.

**Manuell ohne npm/npx:** Auf dem anderen PC klonen oder das
[GitHub-ZIP](https://github.com/emilkowalski/skills/archive/refs/heads/main.zip)
herunterladen und außerhalb des Repos entpacken. Beispiel für den Git-Weg;
Zielordner dürfen noch nicht existieren:

```powershell
$src = Join-Path $env:TEMP "contentblock-emil-skills"
if (Test-Path $src) { throw "Quellordner existiert bereits: $src" }
git clone --depth 1 https://github.com/emilkowalski/skills.git $src
if ($LASTEXITCODE -ne 0) { throw "Klonen fehlgeschlagen" }
git -C $src rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw "Quellversion konnte nicht gelesen werden" }
$names = @("break-ui", "emil-design-eng", "mobile-native")
foreach ($name in $names) {
    $target = Join-Path ".github\skills" $name
    if ((Test-Path $target) -or (Test-Path ".agents\skills\$name")) {
        throw "Skill existiert bereits: $name"
    }
    if (!(Test-Path "$src\skills\$name\SKILL.md")) {
        throw "Quelldateien fehlen: $name"
    }
}
foreach ($name in $names) {
    $target = Join-Path ".github\skills" $name
    Copy-Item (Join-Path $src "skills\$name") $target -Recurse
    Copy-Item (Join-Path $src "LICENSE") (Join-Path $target "LICENSE")
}
```

Für `review-animations` und `pick-ui-library` dieselbe Schleife mit diesen
Namen ausführen. Beim ZIP-Weg `$src` auf dessen entpacktes Wurzelverzeichnis
setzen. Der gesamte jeweilige Skill-Ordner wird kopiert, nicht nur `SKILL.md`.
Vorher auch nach gleichnamigen Skills unter `.agents/skills` sehen.

### Impeccable

Offiziell auf dem anderen PC im Repository-Root:

```powershell
npx impeccable install
```

Der Installer kann zusätzliche Konfigurationsdateien oder Hooks vorschlagen:
vor Übernahme und Commit prüfen, keine bestehenden Einstellungen ersetzen.
Alternativ, nach Installation des Pakets im `frontend`, den lokalen Installer
ohne erneuten npm-Abruf starten:

```powershell
node .\frontend\node_modules\impeccable\cli\bin\cli.js install
```

**Manueller Weg:** Das Repository klonen oder als
[ZIP](https://github.com/pbakaus/impeccable/archive/refs/heads/main.zip)
laden. Beispiel mit Git:

```powershell
$src = Join-Path $env:TEMP "contentblock-impeccable"
$target = ".github\skills\impeccable"
if ((Test-Path $src) -or (Test-Path $target) -or (Test-Path ".agents\skills\impeccable")) {
    throw "Quellordner oder Skill existiert bereits"
}
git clone --depth 1 https://github.com/pbakaus/impeccable.git $src
if ($LASTEXITCODE -ne 0) { throw "Klonen fehlgeschlagen" }
git -C $src rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw "Quellversion konnte nicht gelesen werden" }
Copy-Item "$src\.github\skills\impeccable" $target -Recurse
Copy-Item "$src\LICENSE" "$target\LICENSE"
Copy-Item "$src\NOTICE.md" "$target\NOTICE.md"
```

Beim ZIP-Weg `$src` auf dessen entpacktes Wurzelverzeichnis setzen und die
Kopierschritte verwenden. Der Windows-Launcher braucht eine passende native
Engine; der [Offline-Transfer](#offline-transfer) erklärt die Prüfung und
Bereitstellung. Der Launcher selbst bezeichnet seinen Windows-Weg als nicht
auf einem echten Windows-Rechner getestet; die hier vorgeschlagenen
Offline-Schritte wurden ebenfalls noch nicht praktisch ausgeführt.

**Nach der Bereitstellung** in einem Copilot-Chat den Skill laden und
`/impeccable init` ausführen. Aktuell erzeugt dies `PRODUCT.md`, nicht beide
Dateien. Danach `/impeccable document` für `DESIGN.md` verwenden. Als
Projektkontext aufnehmen: generischer Directus-Kern, erstes Projekt Angelverein,
Zielgruppe 14–80, WCAG 2.2 AA, gut sichtbare Suche, höchstens zwei Klicks zu
Kerninformationen, neutrale Basis und ein bis zwei geprüfte Akzente. Den
heutigen Stand und das gewünschte zukünftige Farbsystem eindeutig unterscheiden;
das Design bleibt bis Phase 2 offen. Diese Dateien werden in Phase 1 **nicht**
vom Agenten erzeugt.

### Taste

Optionaler offizieller Weg auf dem anderen PC:

```powershell
npx skills@latest add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend --agent github-copilot --copy
```

**Manuell:** Repository klonen oder
[ZIP](https://github.com/Leonxlnx/taste-skill/archive/refs/heads/main.zip)
entpacken. Der vollständige Quellordner `skills/taste-skill` heißt anders als
der Skill-Name in seiner Frontmatter:

```powershell
$src = Join-Path $env:TEMP "contentblock-taste-skill"
$target = ".github\skills\design-taste-frontend"
if ((Test-Path $src) -or (Test-Path $target) -or (Test-Path ".agents\skills\design-taste-frontend")) {
    throw "Quellordner oder Skill existiert bereits"
}
git clone --depth 1 https://github.com/Leonxlnx/taste-skill.git $src
if ($LASTEXITCODE -ne 0) { throw "Klonen fehlgeschlagen" }
git -C $src rev-parse HEAD
if ($LASTEXITCODE -ne 0) { throw "Quellversion konnte nicht gelesen werden" }
Copy-Item "$src\skills\taste-skill" $target -Recurse
Copy-Item "$src\LICENSE" "$target\LICENSE"
```

Beim ZIP-Weg `$src` entsprechend setzen und die Kopierschritte verwenden.
Node 22+ und Chrome, Edge oder Chromium sind erforderlich; die optionale
Bildsuche benötigt Netzwerkzugriff. Für dieses Projekt nur Audit-/Redesign-
Aufgaben im freigegebenen Umfang verwenden.

## Abhaengigkeiten

Die folgenden Pakete bereiten nur Werkzeuge vor, keine neue Website-Funktion.
Auf dem anderen PC vom Repository-Root:

```powershell
Set-Location frontend
npm install --save-dev --save-exact @playwright/mcp @playwright/test @axe-core/playwright shadcn impeccable
if ($LASTEXITCODE -ne 0) { throw "Installation fehlgeschlagen" }
npm run lint
if ($LASTEXITCODE -ne 0) { throw "Lint fehlgeschlagen" }
npm run test
if ($LASTEXITCODE -ne 0) { throw "Tests fehlgeschlagen" }
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build fehlgeschlagen" }
Set-Location ..
```

`frontend/package.json` **und** `frontend/package-lock.json` gemeinsam prüfen
und später committen. `--save-exact` hält die gewählten direkten Versionen fest;
das Lockfile hält den vollständigen Abhängigkeitsbaum fest. Bei einem Fehler
nicht mit gelockerten Sicherheitsoptionen weiterinstallieren. `impeccable`
liefert die Windows-Engine als optionale Plattformabhängigkeit; deren
Vorhandensein und Hash werden unten geprüft. Bei Verwendung von `npx skills`
auch Änderungen an [skills-lock.json](skills-lock.json) prüfen und zusammen
mit den tatsächlich installierten Skill-Ordnern committen.

Die generierten Playwright-Tests und die Einrichtung von Produktpaketen
entstehen erst später. Für `@playwright/test` kann zusätzlich ein zur
installierten Version passendes Browser-Bundle nötig sein. Edge für den MCP
ersetzt keine vollständige Browsermatrix. Muss ein Browser-Bundle übertragen
werden, auf dem anderen PC die zur Lockfile-Version passende Playwright-Version
verwenden, den zugehörigen Browser-Cache separat übertragen und gemäß
[Playwright-Browserdokumentation](https://playwright.dev/docs/browsers)
konfigurieren.

## MCP

**Vorschlag, noch nicht in diesem Repo angelegt oder praktisch getestet:**
In VS Code die bestehenden Einträge in `.vscode/mcp.json` erhalten und
folgenden Inhalt gegebenenfalls zusammenführen. `node` muss im PATH sein;
beide referenzierten Paketdateien müssen durch den obigen Transfer existieren.
`msedge` setzt eine lokale Edge-Installation voraus.

```json
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "node",
      "args": [
        "${workspaceFolder}\\frontend\\node_modules\\@playwright\\mcp\\cli.js",
        "--browser", "msedge",
        "--headless",
        "--isolated",
        "--output-dir", "${env:TEMP}\\ContentBlock-playwright"
      ]
    },
    "shadcn": {
      "type": "stdio",
      "command": "node",
      "cwd": "${workspaceFolder}\\frontend",
      "args": [
        "${workspaceFolder}\\frontend\\node_modules\\shadcn\\dist\\index.js",
        "mcp"
      ]
    }
  }
}
```

Die [VS-Code-MCP-Dokumentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
beschreibt das Workspace-Format `servers`; eine Copilot-CLI-Konfiguration kann
ein anderes Format verwenden. In VS Code über die MCP-Serververwaltung starten,
Verbindungsstatus und Tool-Liste prüfen, danach eine lokale Testseite öffnen
und einen Screenshot auslösen. Keine fremden Browserprofile oder eingeloggten
Sitzungen übernehmen. Screenshots können Inhalte enthalten und gehören nicht
ungeprüft in Git.

Das lokale shadcn-Startskript vermeidet einen `npx`-Download, **nicht** aber
Zugriff auf Online-Registries beim Suchen oder Hinzufügen. Ist die Registry
gesperrt, nach Freigabe auf dem anderen PC den generierten Komponentencode
und das Lockfile committen und die Abhängigkeiten separat übertragen. Keine
Registry-Komponente blind ausführen oder deren Schreibzugriff automatisch
freigeben.

### Directus MCP

1. Optional in Directus unter **Settings → AI → Model Context Protocol**
   aktivieren; laut [Directus](https://directus.com/docs/guides/ai/mcp/installation)
   ist der Server ab 11.12 integriert. Keine zusätzliche Extension nötig.
2. Einen eigenen Benutzer mit nur den konkret erforderlichen **Leserechten**
   für synthetische oder ausdrücklich freigegebene, nichtpersonenbezogene
   Testinhalte anlegen. Keine Admin-, Schreib- oder Löschrechte; insbesondere
   `people`, Dateien und andere personenbezogene Inhalte nicht pauschal
   freigeben. Auch öffentlich lesbare Kontaktdaten sind nicht automatisch für
   eine Weitergabe an einen KI-Dienst freigegeben.
3. Nach Möglichkeit OAuth verwenden. Andernfalls ein dediziertes Token
   erzeugen und nur über eine geheime VS-Code-Eingabe bereitstellen, nicht im
   Repo, in der URL, in Screenshots oder im Chat. Lokales Beispiel, als
   Ergänzung zu `servers` und `inputs`:

```json
{
  "servers": {
    "directus-readonly": {
      "type": "http",
      "url": "http://localhost:8055/mcp",
      "headers": {
        "Authorization": "Bearer ${input:directus-mcp-token}"
      }
    }
  },
  "inputs": [
    {
      "id": "directus-mcp-token",
      "type": "promptString",
      "description": "Token des dedizierten Directus-Read-only-Benutzers",
      "password": true
    }
  ]
}
```

Zugriff lokal zunächst mit synthetischen Daten und einer erlaubten Leseaktion
prüfen; verbotene Schreibaktionen müssen verweigert werden. Nicht auf
automatische Bestätigung von MCP-Werkzeugen vertrauen. Bei 403 die Rechte
gezielt diagnostizieren statt den Benutzer zum Admin zu machen.

### Context7

Nur falls der externe Dienst und seine Datenschutzbedingungen ausdrücklich
erlaubt sind: zum Beispiel mit OAuth folgenden Eintrag in `.vscode/mcp.json`
mit den bestehenden `servers` zusammenführen:

```json
{
  "servers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp/oauth"
    }
  }
}
```

Die Anmeldung erfolgt nach der
[Anbieteranleitung](https://context7.com/docs/resources/all-clients); falls
statt OAuth ein API-Key verwendet wird, eine geheime VS-Code-Eingabe nutzen,
keinen Schlüssel committen. Der Dienst verarbeitet Anfragen extern:
nur öffentliche Bibliotheksnamen, Versionen und allgemeine Doku-Fragen
übermitteln, **keinen** Projektcode, Schema, Screenshots, CRM-Daten oder
Zugangsdaten. Alternativ die offiziellen Dokumentationsseiten direkt lesen.

## Offline-Transfer

Diese Schritte konkretisieren den vorhandenen Workaround und vermeiden, ein
vorhandenes `node_modules` ungefragt zu löschen. Sie wurden hier noch nicht
praktisch durchgeführt.

1. Auf dem anderen PC nach erfolgreicher Installation und Prüfung im Ordner
   `frontend` das Paket außerhalb des Repos erstellen:

   ```powershell
   Compress-Archive -Path .\node_modules -DestinationPath "$env:TEMP\ContentBlock-node_modules.zip"
   Get-FileHash "$env:TEMP\ContentBlock-node_modules.zip" -Algorithm SHA256
   ```

   Falls das Ziel bereits existiert, einen anderen Dateinamen wählen. ZIP
   einschließlich Hash auf einem freigegebenen Weg übertragen. Versionen,
   Windows-Architektur und Node-Version müssen kompatibel sein.
2. Auf dem Ziel-PC zuerst den Git-Stand mit dem bereitgestellten Manifest und
   Lockfile übernehmen; eigene nicht zusammenhängende Änderungen schützen.
   Hash des übertragenen ZIPs vergleichen. Danach im Ordner `frontend`:

   ```powershell
   Get-FileHash "$env:TEMP\ContentBlock-node_modules.zip" -Algorithm SHA256
   # Nur fortfahren, wenn dieser Hash dem auf dem anderen PC entspricht.
   $backup = Join-Path $env:TEMP "ContentBlock-node_modules-vor-transfer"
   if (Test-Path $backup) { throw "Sicherungsziel existiert bereits: $backup" }
   if (Test-Path .\node_modules) { Move-Item .\node_modules $backup }
   Expand-Archive -Path "$env:TEMP\ContentBlock-node_modules.zip" -DestinationPath . -ErrorAction Stop
   npm run lint
   if ($LASTEXITCODE -ne 0) { throw "Lint fehlgeschlagen" }
   npm run test
   if ($LASTEXITCODE -ne 0) { throw "Tests fehlgeschlagen" }
   npm run build
   if ($LASTEXITCODE -ne 0) { throw "Build fehlgeschlagen" }
   ```

   Existiert das Sicherungsziel bereits, vorab einen anderen Namen außerhalb
   des Repos wählen. Das ZIP enthält den Ordner `node_modules` als oberste
   Ebene. Den alten Ordner erst nach erfolgreicher Prüfung und eigener
   Entscheidung gezielt entfernen. MCP anschließend wie oben starten und
   tatsächlich mit einer lokalen Seite testen.
3. `node_modules`, ZIPs, Browser-Caches, erzeugte Screenshots, `.env`-Dateien,
   Tokens sowie `cms/database` und `cms/uploads` **nicht committen**.
   `node_modules` ist ignoriert, ein beliebiges `*.zip` laut aktueller
   `.gitignore` dagegen nicht; ZIPs daher außerhalb des Repos halten.

### Impeccable-Engine offline bereitstellen

Der kopierte Skill enthält `scripts/VERSION` und
`scripts/engine-checksums.txt`. Der Windows-Launcher sucht die Engine
standardmäßig unter `%USERPROFILE%\.impeccable\bin\<VERSION>\impeccable.exe`
und kann bei Fehlen sonst einen Netzwerkdownload versuchen. Die folgenden
Schritte gelten **nur für Windows x64** und den Standard-Cache; bei gesetztem
`IMPECCABLE_HOME` oder `IMPECCABLE_BIN` zunächst deren Bedeutung prüfen.

Auf dem Ziel-PC im Repository-Root nach dem `node_modules`-Transfer, bei
manuell nach `.github/skills/impeccable` kopiertem Skill:

```powershell
$skill = ".github\skills\impeccable"
if ($env:IMPECCABLE_HOME -or $env:IMPECCABLE_BIN) {
    throw "Abweichende Impeccable-Umgebung zuerst prüfen"
}
$version = (Get-Content "$skill\scripts\VERSION" -Raw).Trim()
$pattern = "^$([regex]::Escape($version))\s+impeccable-windows-x64\.exe\s+([a-fA-F0-9]{64})$"
$entry = @(Select-String -Path "$skill\scripts\engine-checksums.txt" -Pattern $pattern)
if ($entry.Count -ne 1) { throw "Kein eindeutiger Engine-Hash für $version" }
$expected = $entry[0].Matches[0].Groups[1].Value
$engine = ".\frontend\node_modules\@impeccable\cli-windows-x64\bin\impeccable.exe"
if (!(Test-Path $engine)) { throw "Windows-Engine fehlt im übertragenen Paket" }
if ((Get-FileHash $engine -Algorithm SHA256).Hash -ne $expected) {
    throw "Engine-Version oder SHA-256 stimmt nicht; nicht starten"
}
$unversioned = Join-Path $env:USERPROFILE ".impeccable\bin\impeccable.exe"
if (Test-Path $unversioned) {
    throw "Vorhandene unversionierte Engine beeinflusst die Auswahl; zuerst prüfen"
}
$sibling = Join-Path $skill "scripts\bin\windows-x64\impeccable.exe"
if ((Test-Path $sibling) -and ((Get-FileHash $sibling -Algorithm SHA256).Hash -ne $expected)) {
    throw "Vorhandene Skill-Engine hat einen anderen Hash"
}
$cache = Join-Path $env:USERPROFILE ".impeccable\bin\$version"
$target = Join-Path $cache "impeccable.exe"
New-Item -ItemType Directory -Path $cache -Force | Out-Null
if (Test-Path $target) {
    if ((Get-FileHash $target -Algorithm SHA256).Hash -ne $expected) {
        throw "Vorhandene Cache-Engine hat einen anderen Hash"
    }
} else {
    Copy-Item $engine $target
}
& "$skill\scripts\impeccable.cmd" --version
```

Bei CLI-Installation den tatsächlichen Skill-Pfad entsprechend anpassen.
Bei Versions-/Hashabweichung oder fehlender Plattformdatei **abbrechen**:
Auf dem anderen PC eine zu genau diesem Skill passende Engine aus dem
verifizierten [Release](https://github.com/pbakaus/impeccable/releases)
bereitstellen und separat übertragen. Keine fremde vorhandene Engine
überschreiben und keinen automatischen Netzwerk-Fallback auf dem gesperrten
PC voraussetzen. Die ausgegebene Engine-Version muss zum Skill passen.

### Aenderungen bereitstellen

Auf dem anderen PC im Repository-Root die geänderten Dateien und neuen
Skill-Ordner mit `git --no-pager status --short` prüfen. Nur die tatsächlich
ausgewählten Skill-Pfade unter `.github/skills` **oder** `.agents/skills`,
gegebenenfalls `skills-lock.json`, die passende `.vscode/mcp.json` und die
beiden Frontend-Manifestdateien gezielt zum Commit hinzufügen. Zum Beispiel
für die Abhängigkeiten:

```powershell
git add -- frontend\package.json frontend\package-lock.json
git --no-pager diff --cached --stat
```

Inhalt und Lizenzen der übrigen, einzeln ausgewählten Pfade ebenfalls prüfen,
dann nach der eigenen Commit-Konvention committen und den Stand über den
vereinbarten Git-Weg bereitstellen. Keine ZIPs oder lokalen Laufzeitdaten
hinzufügen. Anschließend den separaten Transfer durchführen und Bescheid
geben; der Agent übernimmt den Git-Stand erst danach.

## Produktpakete

**Nicht Teil des jetzigen Setups:** Die folgenden Eingriffe erfolgen erst
nach Konzeptfreigabe und nur, wenn der konkrete Bedarf bestätigt ist. Auf dem
anderen PC im Ordner `frontend`:

```powershell
# Beispiele; nur die tatsächlich beschlossenen Pakete installieren:
npm install --save-exact motion
npm install --save-exact @tanstack/react-table
npm install --save-exact react-hook-form
npm install --save-exact colorjs.io
npm install --save-exact @adobe/leonardo-contrast-colors
npm install --save-exact @radix-ui/colors
npm install --save-exact @react-pdf/renderer
npm install --save-exact @fontsource-variable/atkinson-hyperlegible-next
```

Anschließend Lockfile, Lizenz und Build prüfen und denselben
[Offline-Transfer](#offline-transfer) verwenden. Quell-Repositories solcher
Pakete wegen ihrer transitiven Abhängigkeiten **nicht** ersatzweise einfach in
`src` kopieren. Für die optionale Schrift ist auch der manuelle Weg möglich:
aus dem [Fontsource-Paketordner](https://github.com/fontsource/font-files/tree/main/fonts/variable/atkinson-hyperlegible-next)
die Dateien `files/atkinson-hyperlegible-next-latin-wght-normal.woff2`,
`files/atkinson-hyperlegible-next-latin-ext-wght-normal.woff2` und `LICENSE`
nach `frontend/public/fonts` übernehmen und die `@font-face`-Deklaration später
passend ergänzen. Weitere Varianten nur bei Bedarf hinzufügen.

Für shadcn am anderen PC mit Zugriff auf die Registry und nach Freigabe zum
Beispiel `node .\node_modules\shadcn\dist\index.js add navigation-menu`
ausführen; das erzeugt Projektdateien und kann Abhängigkeiten ändern. Für eine
konkret genehmigte Magic-UI-Komponente wäre entsprechend
`node .\node_modules\shadcn\dist\index.js add https://magicui.design/r/bento-grid.json`
möglich. **Nicht jetzt ausführen:** Das geprüfte Bento-Beispiel enthält feste
Neutralfarben, Animationen und zusätzliche Abhängigkeiten; es müsste vor
Übernahme an semantische Tokens, Responsive-Verhalten und Reduced Motion
angepasst werden. Einen kompletten Registry-Katalog nicht installieren.

## Farben

Für die spätere Konzeptentscheidung eignen sich **Color.js** für OKLCH und
Kontrastberechnung und gegebenenfalls **Leonardo** für kontrastorientierte
Skalen. Radix Colors bietet gute Referenzskalen. Keine dieser Bibliotheken
garantiert automatisch, dass jede konkrete Vorder-/Hintergrundkombination,
jeder Zustand oder jedes CMS-Bild barrierefrei ist. APCA-Werte sind nicht
unbesehen mit den WCAG-2.2-Kontrastverhältnissen gleichzusetzen.

Prüfanforderungen für die spätere Umsetzung:

- Neutrale Grundflächen, Light und Dark, ein bis zwei auswählbare Akzente.
  Tatsächlich verwendete Paare und Zustände einschließlich Transparenz gegen
  den realen Hintergrund prüfen; bei Bedarf Stufe und Textfarbe korrigieren.
- [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html):
  normaler Text mindestens **4,5:1**, großer Text mindestens **3:1**;
  Grenzwerte nicht aufrunden. [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html):
  erforderliche Bedienelemente, Zustände und informative Grafiken **3:1**
  gegen angrenzende Farben.
- Extremfarben wie Schwarz, Weiß, sehr helles Gelb, Neon und Mittelgrau sowie
  beide Modi testen. Farbe darf Bedeutung nicht allein vermitteln.
- Änderungen an Theme-Feldern, öffentlichen Berechtigungen oder CMS-Modell
  sind Vorschläge für Phase 2 und benötigen vorherige Zustimmung.

## PDF

| Möglichkeit | Eignung und Grenze | Bereitstellung |
| --- | --- | --- |
| Zwei getrennt hochgeladene PDFs | Für bestehende Aufnahmeformulare am zuverlässigsten kontrollierbar; Redaktion prüft Inhalt, Formularfelder, Tags und Gleichstand beider Dateien. Erfordert voraussichtlich eine abgestimmte Modelländerung. | Kein neues Paket. Beide Dateien später über Directus pflegen; Auswahl „Farbe / Schwarz-Weiß“ erst nach Freigabe. |
| Neue PDFs aus strukturierten Daten | React PDF kann im Browser oder Server zwei eigens gestaltete Ausgaben erzeugen; sinnvoll, wenn das Formular als Daten/Template vorliegt. Es konvertiert keine beliebigen vorhandenen PDF-Dateien automatisch. Ausfüllbarkeit und PDF-Barrierefreiheit gesondert verifizieren. | Optional `@react-pdf/renderer` nach Entscheidung; siehe [Produktpakete](#produktpakete). |
| HTML-Druckansicht | Ein Print-Stylesheet kann eine selbst erzeugte HTML-Ansicht druckfreundlich ausgeben; daraus kann ein Browser ein neues PDF drucken. Es ändert **nicht zuverlässig** ein bereits hochgeladenes, heruntergeladenes PDF. | Browser-/CSS-Funktion; kein Paket. Kein Ersatz für die geforderte zweite echte Download-Datei ohne zusätzliche Erzeugung. |
| Serverkonvertierung | Ghostscript kann eine Graustufen-PDF-Datei erzeugen, aber interaktive Felder, Tags, Formulare und Farben müssen danach geprüft werden. Benötigt Serverbetrieb und sichere Verarbeitung. | Nur nach Zustimmung: offizielle [Windows-Ausgabe](https://github.com/ArtifexSoftware/ghostpdl-downloads/releases) außerhalb des Repos beziehen und Integrität prüfen. **AGPL-3.0 oder kommerzielle Lizenz** vor Einsatz klären. |

Für den ersten Ansatz sind zwei redaktionell geprüfte Dateien die robuste
Referenz; Automatisierung erst nach Qualitäts-, Sicherheits- und
Lizenzprüfung entscheiden. Das untersuchte `pdf-lib` ist keine nachgewiesene
generische Graustufenkonvertierung für beliebige PDFs und wird hierfür nicht
empfohlen.

## Barrierefreiheit und spaeterer Ablauf

Automatisches axe-Testing findet nur einen Teil möglicher Probleme und ist
**kein WCAG-Nachweis**. Zusätzlich Tastaturbedienung inklusive sichtbarem
Fokus, Screenreader, Zoom, Reduced Motion, Fehlerzustände und echte Geräte
prüfen. [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
fordert für Zeigerziele grundsätzlich **24 × 24 CSS-px** mit Ausnahmen;
**44 × 44 CSS-px** sind hier ein freiwilliges, nutzerfreundliches Ziel.

Für jede größere UI-Änderung nach Bereitstellung der Ressourcen:

1. Bestehenden Kern erweitern und bauen.
2. Mit Playwright Screenshots für Mobile, Tablet und Desktop erstellen;
   Light/Dark, mehrere Akzente und Reduced Motion prüfen.
3. Impeccable `audit` und `critique` auf den geänderten Bereich anwenden.
4. `break-ui` mit langen/fehlenden Inhalten, schmalen Viewports und
   Grenzfällen durchführen.
5. Nachbessern und die Prüfungen wiederholen. Ergänzend Tastatur,
   automatisierte und manuelle WCAG-Prüfungen durchführen.

Tabellen auf mobilen Geräten als verständliche Karten **oder** eine andere
nachweislich gut bedienbare Darstellung prüfen; Filter, Suche und semantische
Bezüge müssen erhalten bleiben. Das ist eine spätere Konzeptentscheidung,
keine bereits implementierte Funktion.

## Quellenstand

GitHub-Sterne sind gerundete Momentaufnahmen vom 30.10.2026; das Datum ist der
letzte beobachtete Push, nicht notwendigerweise ein Release. Lizenzangaben
beziehen sich auf die jeweilige Quelle bzw. das genannte Paket und ersetzen
keine Lizenzprüfung aller transitiven Abhängigkeiten.

| Quelle | Sterne ca. | Letzter Push | Lizenz / Anmerkung |
| --- | ---: | --- | --- |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | 51.760 | 28.10.2026 | MIT |
| [Impeccable](https://github.com/pbakaus/impeccable) | 96.593 | 30.10.2026 | Apache-2.0; zusätzlich `NOTICE.md` beachten |
| [Taste](https://github.com/Leonxlnx/taste-skill) | 106.079 | 30.10.2026 | MIT |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | 38.853 | 30.10.2026 | Apache-2.0 |
| [Playwright](https://github.com/microsoft/playwright) | 98.875 | 30.10.2026 | Apache-2.0 |
| [shadcn/ui](https://github.com/shadcn-ui/ui) | 126.963 | 30.10.2026 | MIT; Komponenten und Abhängigkeiten einzeln prüfen |
| [Radix Primitives](https://github.com/radix-ui/primitives) | 19.447 | 14.10.2026 | MIT |
| [Magic UI](https://github.com/magicuidesign/magicui) | 22.973 | 17.10.2026 | MIT; Beispiele nicht automatisch projektkonform |
| [Motion](https://github.com/motiondivision/motion) | 34.667 | 30.10.2026 | MIT |
| [Lucide](https://github.com/lucide-icons/lucide) | 25.398 | 30.10.2026 | ISC; einzelne Feather-abgeleitete Icons zusätzlich MIT |
| [Fontsource-Dateien](https://github.com/fontsource/font-files) | 509 | 25.10.2026 | Paket der empfohlenen Schrift: OFL-1.1; das ursprüngliche [Schrift-Repository](https://github.com/googlefonts/atkinson-hyperlegible-next) ist archiviert |
| [TanStack Table](https://github.com/TanStack/table) | 28.536 | 21.10.2026 | MIT |
| [React Hook Form](https://github.com/react-hook-form/react-hook-form) | 44.895 | 30.10.2026 | MIT |
| [Color.js](https://github.com/color-js/color.js) | 2.314 | 26.10.2026 | MIT |
| [Adobe Leonardo](https://github.com/adobe/leonardo) | 2.161 | 08.07.2026 | Apache-2.0 |
| [Radix Colors](https://github.com/radix-ui/colors) | 1.725 | 17.12.2025 | MIT; etablierte Skalen, längerer Abstand seit letztem Push |
| [React PDF](https://github.com/diegomura/react-pdf) | 16.848 | 29.10.2026 | MIT |
| [Ghostscript/ghostpdl](https://github.com/ArtifexSoftware/ghostpdl) | 298 | 30.10.2026 | AGPL-3.0 bzw. kommerziell |
| [axe-core](https://github.com/dequelabs/axe-core) | 7.732 | 29.10.2026 | MPL-2.0; auch `@axe-core/playwright` |
| [Context7](https://github.com/upstash/context7) | 63.956 | 30.10.2026 | MIT für das Repository; der externe Dienst hat eigene Bedingungen |
| [Directus](https://github.com/directus/directus) | 38.751 | 30.10.2026 | Für das Projekt die [Lizenz von v12.5.0](https://github.com/directus/directus/blob/v12.5.0/license) prüfen |

Zusätzliche Primärquellen: [W3C WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/),
[VS Code: Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills),
[VS Code: MCP](https://code.visualstudio.com/docs/copilot/customization/mcp-servers),
[Directus MCP](https://directus.com/docs/guides/ai/mcp/installation) und
[Playwright Browser](https://playwright.dev/docs/browsers).
