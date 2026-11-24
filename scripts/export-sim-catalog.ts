/**
 * MMI 실전 모의면접 카탈로그 내보내기 — T메디 세트(lib/mock-sets/sim-catalog.ts)를 서버(susi-back) 파일로 쓴다.
 *
 * 서버(공용 면접 엔진 /interview-sim)는 Susi 저장소에 있어 이 파일을 직접 읽지 못한다.
 * 문항·방 구성을 고치면 이 스크립트로 다시 내보내고, Susi 저장소에 그 파일을 커밋한다(master 푸시 → 서버 자동 배포).
 *
 * 실행: pnpm exec tsx scripts/export-sim-catalog.ts [출력 경로]
 *   출력 경로 기본값 — 형제 폴더의 Susi 저장소: ../Susi/susi-back/src/modules/interview-sim/lib/medi-catalog.generated.ts
 *   먼저 scripts/check-mock-sets.ts 가 통과해야 한다.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildSimCatalog } from "../lib/mock-sets/sim-catalog";

const out = resolve(process.argv[2] ?? "../Susi/susi-back/src/modules/interview-sim/lib/medi-catalog.generated.ts");
const { formats, prompts } = buildSimCatalog();

const body = `/* eslint-disable */
// prettier-ignore
/**
 * 자동 생성 파일 — 손으로 고치지 말 것.
 * 원본: T_medical 저장소 lib/mock-sets/sim-catalog.ts (문항은 lib/mock-sets/*.ts)
 * 생성: T_medical scripts/export-sim-catalog.ts
 *
 * T메디(tmedi.kr) 'MMI 실전' 탭에 나오는 의·치·한·약·수 모의면접 형식과 문항이다.
 * 형식 ${formats.length}개 · 문항 ${prompts.length}개. 문항은 모두 T메디 창작(기출 아님) · draft.
 */
import type { SimFormat, SimPrompt } from './types';

export const MEDI_FORMATS: SimFormat[] = ${JSON.stringify(formats, null, 2)};

export const MEDI_PROMPTS: SimPrompt[] = ${JSON.stringify(prompts, null, 2)};
`;

writeFileSync(out, body, "utf8");
console.log(`[export-sim-catalog] 형식 ${formats.length}개 · 문항 ${prompts.length}개 → ${out}`);
