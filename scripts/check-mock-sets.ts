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
  mockToSet,
  rubricOf,
  scoreWith,
  type ScoreMap,
  type UnivMock,
} from "../lib/mock-sets/uidae-after-suneung";
import { UIDAE_LATE } from "../lib/mock-sets/uidae-late";
import { FIELD_MOCKS } from "../lib/mock-sets/field-sets";
import { EXISTING_SIM_KEYS, buildSimCatalog, simFormatId } from "../lib/mock-sets/sim-catalog";
import { UNIV_PAGES } from "../lib/univ";
import type { InterviewSet, SetItem } from "../lib/interview-set/types";

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
const ALL_MOCKS: UnivMock[] = [...UNIV_MOCKS, ...UIDAE_LATE, ...FIELD_MOCKS];
const setKeys = new Set<string>();
for (const m of ALL_MOCKS) {
  const sk = `${m.field ?? "uidae"}:${m.key}`;
  must(!setKeys.has(sk), `${sk}: 같은 학과·대학 세트가 둘이다`);
  setKeys.add(sk);
  if (m.sim) {
    const simIds = m.sim.rooms.flatMap((r) => r.items);
    must(simIds.length === m.items.length && new Set(simIds).size === simIds.length, `${sk}: 서버 방 구성의 문항이 세트 문항과 하나씩 맞지 않는다`);
    for (const id of simIds) must(m.items.some((it) => it.id === id), `${sk}: 방 구성에 세트에 없는 문항 ${id}`);
    must(m.sim.rooms.length === m.rooms.length, `${sk}: 서버 방 수와 세트 방 수가 다르다`);
  }
  must(m.rooms.reduce((n, r) => n + r.itemsPerRoom, 0) === m.items.length, `${m.key}: 방의 문항 수 합과 문항 수가 다르다`);
  for (const it of m.items) {
    must(!seen.has(it.id), `${it.id}: 문항 id 가 겹친다`);
    seen.add(it.id);
    const keys = new Set(rubricOf(m, it).factors.map((f) => f.key));
    for (const k of it.keyPoints) must(keys.has(k.c), `${it.id}: 채점 틀에 없는 역량 '${k.c}'`);
  }
}
must(UNIV_MOCKS.length + UIDAE_LATE.length + PENDING_BY_DATE.reduce((n, d) => n + d.univs.length, 0) === 33, "수능 이후 면접 의대 수가 33 이 아니다");
must(FIELD_MOCKS.length === 31, `치·한·약·수 세트가 31 이 아니다(${FIELD_MOCKS.length})`);
const mockSets: InterviewSet[] = ALL_MOCKS.map(mockToSet);
const publicSets = mockSets.map((s) => ({ ...s, items: s.items.map(({ memo: _memo, ...rest }): SetItem => rest) }));
for (const s of mockSets) {
  const c = validateSet(s);
  if (!c.ok) errors.push(...c.errors.map((e) => `${s.id}(서버용): ${e}`));
}
for (const s of publicSets) {
  const c = validateSet(s, { publicFile: true });
  if (!c.ok) errors.push(...c.errors.map((e) => `${s.id}(공개용): ${e}`));
  must(!hasPrivate(s), `${s.id}: 공개용 세트에 면접관 메모가 남았다`);
}

// MMI 실전(서버) 카탈로그
const cat = buildSimCatalog();
const fids = new Set<string>();
const pids = new Set<string>();
const DATE = /^2026-1[12]-\d\d$/;
for (const f of cat.formats) {
  must(!fids.has(f.id), `${f.id}: 형식 id 가 겹친다`);
  fids.add(f.id);
  must(f.id.length <= 40, `${f.id}: 형식 id 가 40자를 넘는다(서버 DTO 제한)`);
  must(f.rooms.length >= 1 && f.rooms.length <= 6, `${f.id}: 방 수가 1~6 이 아니다(서버 DTO roomIdx ≤ 5)`);
  must(f.dates.length > 0 && f.dates.every((d) => DATE.test(d)), `${f.id}: 면접일 형식이 틀리다`);
  must(f.dates.every((d) => d >= "2026-11-25"), `${f.id}: 11/25 이전 면접일이 있다`);
  for (const [i, r] of f.rooms.entries()) {
    must(r.answerSec >= 120 && r.answerSec <= 900, `${f.id} 방 ${i}: 답변 시간이 2~15분 밖이다`);
    must(r.prepSec >= 0 && r.prepSec <= 2700, `${f.id} 방 ${i}: 준비 시간이 0~45분 밖이다`);
    must(cat.prompts.some((p) => p.formats.includes(f.id) && p.room === i), `${f.id} 방 ${i}: 이 방에 묶인 문항이 없다`);
  }
  if (f.field === "uidae") must(UNIV_PAGES.some((u) => f.source.url.endsWith(`/interview/uidae/${u.slug}`)), `${f.id}: 의대 안내 페이지 주소가 없다(${f.source.url})`);
}
for (const p of cat.prompts) {
  must(!pids.has(p.id), `${p.id}: 서버 문항 id 가 겹친다`);
  pids.add(p.id);
  must(p.id.length <= 60, `${p.id}: 문항 id 가 60자를 넘는다(서버 DTO 제한)`);
  must(/^[a-z0-9-]+$/.test(p.id), `${p.id}: 문항 id 에 쓸 수 없는 글자`);
  must(p.text.length >= 80 && p.text.length <= 1500, `${p.id}: 본문 길이 ${p.text.length}자(80~1500)`);
  const q = p.firstQuestion.trim();
  must(q.endsWith("?") || q.endsWith("요."), `${p.id}: 첫 질문이 물음표·'요.'로 끝나지 않는다`);
  must(p.memo.issues.length > 0 && p.memo.pitfalls.length > 0, `${p.id}: 면접관 메모가 비었다`);
}
must(cat.formats.length === EXISTING_SIM_KEYS.length + UIDAE_LATE.length + FIELD_MOCKS.length + 2, "서버 형식 수가 세트 수와 맞지 않는다");
must(fids.has(simFormatId("suuidae", "gnu")) && cat.formats[0].dates[0] === "2026-11-25", "카탈로그 첫 형식이 11/25 면접이 아니다");

if (errors.length) {
  console.error(`[mock-sets] ${errors.length}곳이 틀렸습니다:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
const sets = [...snuMockSets(), ...mockSets];
console.log(`[mock-sets] 세트 ${sets.length}개 · 방 ${sets.reduce((n, s) => n + s.format.rooms.length, 0)}개 — 규격 검사 통과`);
console.log(`[mock-sets] MMI 실전 카탈로그: 형식 ${cat.formats.length}개 · 문항 ${cat.prompts.length}개`);
