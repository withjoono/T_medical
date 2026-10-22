// lib/*.ts 를 레포에 이미 있는 typescript 로 트랜스파일해 매니페스트 JSON 을 뽑는다.
// 새 의존성을 넣지 않기 위한 방식이다.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require_ = createRequire(import.meta.url);
const ts = require_("typescript");

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const TMP = path.join(REPO, ".cache", "og-lib");
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

const FILES = [
  "field-interview.ts",
  "chidae-interview.ts",
  "hanuidae-interview.ts",
  "yakdae-interview.ts",
  "suuidae-interview.ts",
  "field-registry.ts",
];
for (const f of FILES) {
  const src = fs.readFileSync(path.join(REPO, "lib", f), "utf8");
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText.replace(/from "\.\/([a-z-]+)"/g, 'from "./$1.mjs"');
  fs.writeFileSync(path.join(TMP, f.replace(/\.ts$/, ".mjs")), out);
}

const { FIELD_PAGES } = await import(pathToFileURL(path.join(TMP, "field-registry.mjs")).href);
const { fieldEarliest } = await import(pathToFileURL(path.join(TMP, "field-interview.mjs")).href);

const cards = [];
for (const key of Object.keys(FIELD_PAGES)) {
  const f = FIELD_PAGES[key];
  for (const u of f.univs) {
    cards.push({
      field: key,
      fieldShort: f.short,
      unitLabel: f.unitLabel,
      base: f.base,
      slug: u.slug,
      short: u.short,
      name: u.name,
      zone: u.zone,
      style: u.style,
      styleLabel: u.styleLabel,
      headline: u.headline,
      source: u.source?.label ?? null,
      scoring: u.scoring?.label ?? null,
      date: fieldEarliest(u),
      dates: [...new Set(u.tracks.filter((t) => t.interview && t.date).map((t) => t.date))].sort(),
      tracks: u.tracks.filter((t) => t.interview).length,
    });
  }
}
fs.mkdirSync(path.join(REPO, ".cache"), { recursive: true });
fs.writeFileSync(path.join(REPO, ".cache", "og-cards.json"), JSON.stringify(cards, null, 2));
console.log("cards:", cards.length);

