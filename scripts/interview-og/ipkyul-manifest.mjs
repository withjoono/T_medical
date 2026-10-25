/** lib/ipkyul/* 를 레포에 이미 있는 typescript 로 트랜스파일해 .cache/ipkyul-lib 에 둔다.
 *  ipkyul 는 다른 lib 를 가져오지 않아 의존성 그래프가 깨끗하다 — mmi-schedule 쪽을
 *  끌어오지 말 것(teachers·interview-types 까지 줄줄이 따라온다). */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const ts = createRequire(path.join(REPO, "package.json"))("typescript");
const TMP = path.join(REPO, ".cache", "ipkyul-lib");

fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

for (const f of ["index.ts", "uiye.ts", "chiuiye.ts", "hanuiye.ts", "yakhak.ts", "suuiye.ts"]) {
  const src = fs.readFileSync(path.join(REPO, "lib", "ipkyul", f), "utf8");
  const out = ts
    .transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    })
    .outputText.replace(/from "\.\/([a-z-]+)"/g, 'from "./$1.mjs"');
  fs.writeFileSync(path.join(TMP, f.replace(/\.ts$/, ".mjs")), out);
}

export const IPKYUL = await import(pathToFileURL(path.join(TMP, "index.mjs")).href);

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const f of IPKYUL.FIELDS) {
    console.log(f.key, f.label, "대학", f.univs.length, "전형", f.univs.flatMap((u) => u.units).length);
  }
}
