/**
 * 모의면접 세트 검사 — lib/mock-sets/*.ts 가 면접 세트 규격(lib/interview-set/validate.ts)에 맞는지 본다.
 * 파일을 만들지 않는다. 실행: pnpm exec tsx scripts/check-mock-sets.ts
 */
import { hasPrivate, validateSet } from "../lib/interview-set/validate";
import {
  BANDS,
  COMPETENCIES,
  RANKING,
  bandOf,
  rankOf,
  roomScore,
  snuMockPublicSets,
  snuMockSets,
  totalScore,
  type RoomScore,
} from "../lib/mock-sets/snu-mmi";
import {
  PENDING_BY_DATE,
  RUBRIC_DOC,
  UNIV_MOCKS,
  rubricOf,
  scoreWith,
  uidaeMockPublicSets,
  uidaeMockSets,
  type ScoreMap,
} from "../lib/mock-sets/uidae-after-suneung";

const errors: string[] = [];
const must = (ok: boolean, msg: string) => {
  if (!ok) errors.push(msg);
};

must(COMPETENCIES.reduce((n, c) => n + c.weight, 0) === 100, "역량 비중 합이 100 이 아니다");

const all = (v: 1 | 2 | 3 | 4 | 5) => Object.fromEntries(COMPETENCIES.map((c) => [c.key, v])) as RoomScore;
must(roomScore(all(5)) === 100, "전 역량 5점이 100점이 아니다");
must(roomScore(all(1)) === 20, "전 역량 1점이 20점이 아니다");
must(roomScore(all(5), 9) === 85, "감점 상한이 15점이 아니다");
must(totalScore([100, 80, 60, 70]) === 77.5, "총점 평균이 틀리다");
must(bandOf(88).grade === "S" && bandOf(87.9).grade === "A" && bandOf(0).grade === "D", "등급 경계가 틀리다");
must(BANDS.every((b, i) => i === 0 || b.min < BANDS[i - 1].min), "등급 기준이 내림차순이 아니다");
must(rankOf(80, [90, 70]).rank === null, "표본이 모자란데 등수를 냈다");
const pool = Array.from({ length: RANKING.minSample - 1 }, (_, i) => 50 + i);
must(rankOf(60, pool).rank === 1 + pool.filter((x) => x > 60).length, "등수 계산이 틀리다");

for (const s of snuMockSets()) {
  const c = validateSet(s);
  if (!c.ok) errors.push(...c.errors.map((e) => `${s.id}(서버용): ${e}`));
  must(hasPrivate(s), `${s.id}: 서버용 세트에 면접관 메모가 없다`);
}
for (const s of snuMockPublicSets()) {
  const c = validateSet(s, { publicFile: true });
  if (!c.ok) errors.push(...c.errors.map((e) => `${s.id}(공개용): ${e}`));
  must(!hasPrivate(s), `${s.id}: 공개용 세트에 면접관 메모가 남았다`);
}

// 수능 이후 의대 — 대학별 세트
must(RUBRIC_DOC.factors.reduce((n, f) => n + f.weight, 0) === 100, "서류·인성형 비중 합이 100 이 아니다");
must(scoreWith(RUBRIC_DOC, Object.fromEntries(RUBRIC_DOC.factors.map((f) => [f.key, 5])) as ScoreMap) === 100, "서류·인성형 만점이 100 이 아니다");
const seen = new Set<string>();
for (const m of UNIV_MOCKS) {
  must(m.rooms.reduce((n, r) => n + r.itemsPerRoom, 0) === m.items.length, `${m.key}: 방의 문항 수 합과 문항 수가 다르다`);
  for (const it of m.items) {
    must(!seen.has(it.id), `${it.id}: 문항 id 가 겹친다`);
    seen.add(it.id);
    const keys = new Set(rubricOf(m, it).factors.map((f) => f.key));
    for (const k of it.keyPoints) must(keys.has(k.c), `${it.id}: 채점 틀에 없는 역량 '${k.c}'`);
  }
}
must(UNIV_MOCKS.length + PENDING_BY_DATE.reduce((n, d) => n + d.univs.length, 0) === 33, "수능 이후 면접 의대 수가 33 이 아니다");
for (const s of uidaeMockSets()) {
  const c = validateSet(s);
  if (!c.ok) errors.push(...c.errors.map((e) => `${s.id}(서버용): ${e}`));
}
for (const s of uidaeMockPublicSets()) {
  const c = validateSet(s, { publicFile: true });
  if (!c.ok) errors.push(...c.errors.map((e) => `${s.id}(공개용): ${e}`));
  must(!hasPrivate(s), `${s.id}: 공개용 세트에 면접관 메모가 남았다`);
}

if (errors.length) {
  console.error(`[mock-sets] ${errors.length}곳이 틀렸습니다:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
const sets = [...snuMockSets(), ...uidaeMockSets()];
console.log(`[mock-sets] 세트 ${sets.length}개 · 방 ${sets.reduce((n, s) => n + s.format.rooms.length, 0)}개 — 규격 검사 통과`);
