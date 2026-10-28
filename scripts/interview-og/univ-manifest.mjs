import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const require_ = createRequire(path.join(REPO, "package.json"));
const ts = require_("typescript");


const TMP = path.join(REPO, ".cache", "univ-lib");
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(path.join(TMP, "ipkyul"), { recursive: true });

const FILES = [
  "mmi-schedule.ts", "teachers.ts", "univ-interview.ts", "interview-types.ts", "univ.ts",
  "ipkyul/index.ts", "ipkyul/uiye.ts", "ipkyul/chiuiye.ts", "ipkyul/hanuiye.ts",
  "ipkyul/yakhak.ts", "ipkyul/suuiye.ts",
];
for (const f of FILES) {
  const src = fs.readFileSync(path.join(REPO, "lib", f), "utf8");
  let out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  out = out
    .replace(/from "\.\/ipkyul"/g, 'from "./ipkyul/index.mjs"')
    .replace(/from "\.\/([a-z-]+)"/g, 'from "./$1.mjs"');
  fs.writeFileSync(path.join(TMP, f.replace(/\.ts$/, ".mjs")), out);
}
const m = await import(pathToFileURL(path.join(TMP, "univ.mjs")).href);
const u = m.UNIV_PAGES[0];
console.log("총", m.UNIV_PAGES.length);
console.log(JSON.stringify(u, null, 2).slice(0, 1600));
