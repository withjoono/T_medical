/**
 * 면접 세트 공개 파일 만들기 — pnpm build · pnpm dev 앞에서 돈다.
 *
 *   lib/gichul-data · lib/gachon-gichul.ts  →  lib/interview-sets.ts(buildMediSets)  →  public/interview-sets/<id>.json + index.json
 *
 * public/interview-sets 는 빌드 산출물이라 git 에 넣지 않는다(.gitignore). 원본은 기출 분석 데이터 하나다.
 * 세트마다 lib/interview-set/validate.ts(Interview 엔진과 같은 검사기)로 '공개 파일' 검사를 하고,
 * 하나라도 틀리면 빌드를 멈춘다 — 틀린 세트가 배포되면 /interview/ai 코치가 그 세트를 열지 못한다.
 *
 * 실행: pnpm sets
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hasPrivate, validateSet } from "../lib/interview-set/validate";
import { buildMediSets, SET_DIR, setFileName, setIndex } from "../lib/interview-sets";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "public", SET_DIR);

const sets = buildMediSets();
const errors: string[] = [];
const ids = new Set<string>();
for (const s of sets) {
  if (ids.has(s.id)) errors.push(`${s.id}: 세트 id 가 겹친다`);
  ids.add(s.id);
  if (hasPrivate(s)) errors.push(`${s.id}: 면접관 메모가 들어 있다(공개 파일에 실을 수 없다)`);
  const check = validateSet(s, { publicFile: true });
  if (!check.ok) errors.push(...check.errors.map((e) => `${s.id}: ${e}`));
}
if (errors.length) {
  console.error(`[interview-sets] 세트 ${errors.length}곳이 규격에 맞지 않습니다:\n  ${errors.slice(0, 30).join("\n  ")}`);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const s of sets) writeFileSync(join(OUT, setFileName(s.id)), JSON.stringify(s));
writeFileSync(join(OUT, "index.json"), JSON.stringify(setIndex(sets)));

const items = sets.reduce((n, s) => n + s.items.length, 0);
const univs = new Set(sets.map((s) => s.target.univ)).size;
console.log(`[interview-sets] ${univs}개 대학 · 세트 ${sets.length}개 · 문항 ${items}개 → public${SET_DIR}/`);
