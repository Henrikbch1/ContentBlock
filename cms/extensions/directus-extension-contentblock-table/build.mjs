import { execFileSync } from "node:child_process";
import { copyFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../../../frontend/node_modules/vite/dist/node/index.js";

const directory = dirname(fileURLToPath(import.meta.url));
const composeFile = resolve(directory, "../../docker-compose.yml");
const temporaryDirectory = await mkdtemp(join(tmpdir(), "contentblock-grid-"));
const docker = (args) => execFileSync("docker", args, { encoding: "utf8" }).trim();
const compose = (...args) => docker(["compose", "-f", composeFile, ...args]);
const findInstalledPackage = `
  const fs = require("node:fs");
  const root = "/directus/extensions/.registry";
  const matches = fs.readdirSync(root).map(folder => root + "/" + folder).filter(folder => {
    const file = folder + "/package.json";
    if (!fs.existsSync(file)) return false;
    const metadata = JSON.parse(fs.readFileSync(file, "utf8"));
    return metadata.name === "directus-extension-ag-grid-interface" && metadata.version === "1.0.2";
  });
  if (matches.length !== 1) throw new Error("Expected exactly one installed AG Grid interface 1.0.2");
  console.log(matches[0]);
`;

try {
  const container = compose("ps", "-q", "directus");
  if (!container) throw new Error("Start this project's Directus container before building.");
  const installedPath = compose("exec", "-T", "directus", "node", "-e", findInstalledPackage);
  const upstreamFile = join(temporaryDirectory, "upstream.js");
  docker(["cp", `${container}:${installedPath}/dist/index.js`, upstreamFile]);
  docker(["cp", `${container}:${installedPath}/LICENSE`, join(temporaryDirectory, "LICENSE")]);
  const upstreamHash = createHash("sha256").update(await readFile(upstreamFile)).digest("hex");
  await build({
    configFile: false,
    root: directory,
    resolve: { alias: { "#grid-interface": upstreamFile } },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      minify: false,
      lib: { entry: join(directory, "src/index.js"), formats: ["es"], fileName: () => "index.js" },
      rollupOptions: { external: ["vue", "@directus/extensions-sdk"] },
    },
  });
  await copyFile(join(temporaryDirectory, "LICENSE"), join(directory, "dist/UPSTREAM-LICENSE"));
  console.log(`Reused installed AG Grid interface 1.0.2; SHA-256 ${upstreamHash}`);
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}