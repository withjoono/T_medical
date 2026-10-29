/** =========================================================================
 *  T메디 면접 세트 — 기출 분석 데이터 → AI 모의면접 세트 (2026-10-29)
 *
 *  규격: Interview 저장소 docs/interview-set-spec.md · 타입·검사기는 lib/interview-set/(복사본, 직접 수정 금지).
 *  엔진(코치)은 세트를 받기만 하고, 문제와 방식은 T메디가 만든다.
 *
 *  원본은 기출 분석 데이터 하나다 — lib/gichul-data/*.json(univ-gichul.ts) · lib/gachon-gichul.ts.
 *  이 파일은 그 데이터를 세트로 바꾸기만 한다. 공개 파일은 scripts/build-interview-sets.ts 가
 *  빌드 때 public/interview-sets/ 에 만든다(gitignore). /interview/ai 선택기는 setIndex() 를 쓴다.
 *
 *  ⚠️ 원칙 (data-rules.md 4-1 과 같다)
 *   1. 공개 범위(unit)를 좁혀 쓰지 않는다 — '전 계열 공통' 문항은 그 대학 모든 학과 세트에 넣되 범위를 그대로 보인다.
 *      '의예과 외 학과' 로 공개된 문항은 의대 세트에 넣지 않는다.
 *   2. 대학이 질문을 공개하지 않은 문항은 질문을 지어내지 않는다 — 비공개라고 밝힌 공통 질문을 붙인다.
 *   3. 답변 시간은 대학이 밝히지 않았으므로 넣지 않는다(코치 기본값).
 *   4. 가천대 한의예과는 2027학년도 면접이 없어 세트를 만들지 않는다.
 *  ========================================================================= */

import type { InterviewSet, SetItem } from "./interview-set/types";
import {
  GICHUL_FIELD_LABEL,
  GICHUL_FIELD_ORDER,
  UNIV_GICHUL,
  gichulFields,
  type GichulField,
  type UnivGichul,
  type UnivGichulQuestion,
} from "./univ-gichul";
import { GACHON_INSEONG, GACHON_PAGES, GACHON_QUESTIONS, GACHON_SOURCES } from "./gachon-gichul";

export const SET_YEAR = 2027;
export const SET_DIR = "/interview-sets";

/** 한 번에 연습하라고 골라 두는 문항 수 */
const ITEMS_PER_SESSION = 3;
/** 코치 질문 후 준비 시간 기본값(초) — 대학 값이 아니다 */
const PREP_SEC = 5;

/** 그 대학 모든 학과 세트에 넣는 범위. '자연계열 공통'은 넣지 않는다 — 서울대처럼 공대·약대 등 전형에 적힌
 *  모집단위만 함께 쓰는 문항(수학 구술)이라 의대·수의대 면접과 다르다. 그런 문항은 기출 분석 페이지 배치(page)를 따른다 */
const SHARED_SCOPE = /^(전 계열 공통|의약계열\(학과 구분 없음\))/;
const NON_UIDAE_SCOPE = /^의예과 외/;
const PASSAGE_KINDS = new Set(["제시문", "MMI 상황", "공통문항"]);

/** 대학이 질문을 공개하지 않은 제시문 문항에 붙이는 질문 — 지어낸 질문이 아님을 문장에 밝힌다 */
export const PRIVATE_ASK_QUESTION = "대학이 질문은 공개하지 않았습니다. 제시문을 읽고 핵심 쟁점과 본인의 판단을 말해 보세요.";

/** 이 공개 범위의 문항을 이 학과 세트에 넣는가 */
export function scopeFits(scope: string | undefined, field: GichulField, page: GichulField): boolean {
  if (!scope) return page === field;
  if (scope === GICHUL_FIELD_LABEL[field].unit) return true;
  if (SHARED_SCOPE.test(scope)) return true;
  if (NON_UIDAE_SCOPE.test(scope)) return field !== "uidae";
  return page === field;
}

/** 전형 이름 → 세트 id 조각(ASCII). 같은 이름이면 언제나 같은 값 */
function slug(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `t${(h >>> 0).toString(36)}`;
}

export const setFileName = (id: string) => `${id.replace(/:/g, "-")}.json`;
export const setPath = (id: string) => `${SET_DIR}/${setFileName(id)}`;

const passageLabel = (kind: string) => (PASSAGE_KINDS.has(kind) ? "제시문·상황 요지" : "생기부 기록");

function questionItem(q: UnivGichulQuestion): SetItem {
  const priv = /비공개/.test(q.ask);
  return {
    id: q.id,
    question: priv ? PRIVATE_ASK_QUESTION : q.ask,
    passages: q.basis ? [{ label: passageLabel(q.kind), text: q.basis }] : undefined,
    followups: q.followups.length ? q.followups : undefined,
    meta: { year: q.year, kind: q.kind, topic: q.topic, subject: q.subject, scope: q.unit },
    review: { focus: q.focus, frame: q.frame, pitfall: q.pitfall },
  };
}

type Group = { key: string; track: string; items: SetItem[]; years: Set<number> };

function baseSet(
  u: { key: string; short: string },
  field: GichulField,
  g: Group,
  kind: InterviewSet["source"]["kind"],
  source: { label: string; url?: string },
): InterviewSet {
  const id = `medi:${u.key}:${g.key}:${field}:gichul`;
  const years = [...g.years].sort();
  return {
    spec: 1,
    id,
    site: "medi",
    target: { year: SET_YEAR, univ: u.short, univKey: u.short, track: g.track, unit: GICHUL_FIELD_LABEL[field].unit, field },
    title: `${u.short} ${GICHUL_FIELD_LABEL[field].page} 면접 — ${g.track}`,
    engine: "question",
    format: {
      pick: "student",
      timeNote: "대학이 문항별 답변 시간을 밝히지 않아 기본 시간으로 연습합니다. 아래에서 바꿀 수 있습니다.",
      rooms: [{ label: "기출 연습", prepSec: PREP_SEC, itemsPerRoom: Math.min(ITEMS_PER_SESSION, g.items.length) }],
    },
    items: g.items,
    source: { kind, label: `${source.label}${years.length ? ` (${years.join('·')})` : ""}`, ...(source.url ? { url: source.url } : {}) },
    notes: [
      "질문은 대학 공개 자료의 문장을 그대로 옮기지 않고 요약했습니다.",
      "문항마다 대학이 공개한 범위(의예과 · 전 계열 공통 등)를 함께 적었습니다.",
    ],
  };
}

/** 국내 수시 지원자가 고를 일이 드문 전형 — '수시 전형 전체'에 섞지 않고 칩 맨 뒤에 둔다.
 *  '수시·정시 통합 공개' 처럼 수시가 함께 적힌 전형은 수시로 본다 */
const isSpecialTrack = (t: string) => /재외국민|외국인/.test(t) || (/정시/.test(t) && !/수시/.test(t));

/** 기출 문항들을 전형별로 묶는다. 국내 수시 전형이 둘 이상이면 '수시 전형 전체' 묶음을 앞에 둔다 */
function trackGroups(qs: UnivGichulQuestion[]): Group[] {
  const by = new Map<string, Group>();
  for (const q of qs) {
    const track = q.track?.trim() || "전형 구분 없이 공개";
    const g = by.get(track) ?? { key: slug(track), track, items: [], years: new Set<number>() };
    g.items.push(questionItem(q));
    g.years.add(q.year);
    by.set(track, g);
  }
  const bySize = (a: Group, b: Group) => b.items.length - a.items.length;
  const groups = [...by.values()];
  const domestic = groups.filter((g) => !isSpecialTrack(g.track)).sort(bySize);
  const special = groups.filter((g) => isSpecialTrack(g.track)).sort(bySize);
  if (domestic.length < 2) return [...domestic, ...special];
  const all: Group = {
    key: "all",
    track: "수시 전형 전체",
    items: domestic.flatMap((g) => g.items),
    years: new Set(domestic.flatMap((g) => [...g.years])),
  };
  return [all, ...domestic, ...special];
}

function univSets(u: UnivGichul): InterviewSet[] {
  const out: InterviewSet[] = [];
  const src = { label: `${u.short} 선행학습 영향평가 자체평가 보고서`, url: u.sources?.find((s) => s.url)?.url };
  for (const field of gichulFields(u)) {
    const qs = u.questions
      .filter((q) => scopeFits(q.unit, field, q.page))
      .sort((a, b) => b.year - a.year);
    for (const g of trackGroups(qs)) out.push(baseSet(u, field, g, "기출", src));

    const ins = (u.inseong ?? []).filter((r) => scopeFits(r.unit, field, gichulFields(u)[0]));
    if (ins.length) {
      const g: Group = {
        key: "inseong",
        track: "인성 질문 (학생부 기록 확인)",
        years: new Set(ins.map((r) => r.year)),
        items: ins.map((r, i) => ({
          id: `inseong-${r.year}-${i + 1}`,
          question: r.ask,
          passages: [{ label: "생기부 기록", text: r.record }],
          meta: { year: r.year, kind: "인성", ...(r.unit ? { scope: r.unit } : {}) },
          review: { focus: r.point },
        })),
      };
      out.push(baseSet(u, field, g, "기출", src));
    }

    const ex = (u.examples ?? []).filter((q) => q.page === field);
    if (ex.length) {
      const g: Group = { key: "examples", track: "대학 공개 예시문항 (기출 아님)", items: ex.map(questionItem), years: new Set() };
      out.push(baseSet(u, field, g, "대학 예시문항", { label: `${u.short} 공개 예시문항` }));
    }
  }
  return out;
}

/** 가천대 가천의약학전형 — 보고서가 의예·한의예·약학을 나누지 않으므로 범위는 '의약계열(학과 구분 없음)' */
function gachonSets(): InterviewSet[] {
  const u = { key: "gachon", short: "가천대" };
  const src = { label: "가천대 선행학습 영향평가 자체평가 보고서", url: GACHON_SOURCES[0].url };
  const items: SetItem[] = [...GACHON_QUESTIONS]
    .sort((a, b) => b.year - a.year)
    .map((q) => ({
      id: q.id,
      question: q.ask,
      passages: [{ label: "생기부 기록", text: q.record }],
      followups: q.followups,
      meta: { year: q.year, kind: "생기부 기반", topic: q.topic, subject: q.subject, scope: "의약계열(학과 구분 없음)" },
      review: { focus: q.focus, frame: q.frame, pitfall: q.pitfall },
    }));
  const inseong: SetItem[] = GACHON_INSEONG.map((r, i) => ({
    id: `inseong-${r.year}-${i + 1}`,
    question: r.ask,
    passages: [{ label: "생기부 기록", text: r.record }],
    meta: { year: r.year, kind: "인성", topic: r.kind, scope: "전 계열 공통" },
    review: { focus: r.point },
  }));
  const fields = (Object.keys(GACHON_PAGES) as GichulField[]).filter((f) => f !== "hanuidae");
  return fields.flatMap((field) => [
    baseSet(u, field, { key: slug("가천의약학전형"), track: "가천의약학전형", items, years: new Set(GACHON_QUESTIONS.map((q) => q.year)) }, "기출", src),
    baseSet(u, field, { key: "inseong", track: "인성 질문 (학생부 기록 확인)", items: inseong, years: new Set(GACHON_INSEONG.map((r) => r.year)) }, "기출", src),
  ]);
}

/** T메디가 만드는 면접 세트 전부 */
export function buildMediSets(): InterviewSet[] {
  return [...UNIV_GICHUL.flatMap(univSets), ...gachonSets()];
}

/** /interview/ai 선택기에 넘기는 목록 — 화면에 필요한 것만 */
export type PickerEntry = {
  id: string;
  field: GichulField;
  univ: string;
  track: string;
  items: number;
  kind: InterviewSet["source"]["kind"];
  path: string;
  /** 그 대학·학과 기출 분석 페이지 */
  page?: string;
  /** 그 대학·학과 세트 전부의 문항 수(겹치는 문항은 한 번) — 대학 목록에 쓴다 */
  univItems: number;
};

/** 대학·학과 → 기출 분석 페이지 */
function gichulPages(): Map<string, string> {
  const m = new Map<string, string>();
  for (const u of UNIV_GICHUL) for (const f of gichulFields(u)) m.set(`${u.short}|${f}`, `/interview/${f}/${u.pages[f]}`);
  for (const [f, p] of Object.entries(GACHON_PAGES)) m.set(`가천대|${f}`, p.href);
  return m;
}

export function setIndex(sets: InterviewSet[] = buildMediSets()): PickerEntry[] {
  const pages = gichulPages();
  const unique = new Map<string, Set<string>>();
  for (const s of sets) {
    const k = `${s.target.univ}|${s.target.field}`;
    const ids = unique.get(k) ?? new Set<string>();
    for (const it of s.items) ids.add(`${s.source.kind}|${it.id}`);
    unique.set(k, ids);
  }
  return sets.map((s) => {
    const field = s.target.field as GichulField;
    const page = pages.get(`${s.target.univ}|${field}`);
    return {
      univItems: unique.get(`${s.target.univ}|${field}`)?.size ?? s.items.length,
      id: s.id,
      field,
      univ: s.target.univ,
      track: s.target.track,
      items: s.items.length,
      kind: s.source.kind,
      path: setPath(s.id),
      ...(page ? { page } : {}),
    };
  });
}

export const PICKER_FIELDS = GICHUL_FIELD_ORDER.map((f) => ({ key: f, label: GICHUL_FIELD_LABEL[f].page }));
