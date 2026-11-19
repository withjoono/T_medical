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
 *   5. 2·3 의 예외는 아래 REVIEW_FLOW 하나뿐이다(응시 후기로 진행을 맞춘 대학, 소유자 승인 2026-11-19 — data-rules.md 4-2).
 *      후기에서 온 문항과 연습용 시간은 '기출'·'대학이 밝힌 값'과 섞어 표기하지 않는다.
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
const PASSAGE_KINDS = new Set(["제시문", "MMI 상황"]);

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

/** basis 에 붙이는 라벨 — 대학 페이지(app/interview/_univ-gichul.tsx basisLabel)와 같은 구분이다.
 *  '공통문항'·'…(기출 아님)' 의 basis 는 제시문도 생기부 기록도 아니고, 그 질문이 어떻게 공개됐는지 적은 설명이다.
 *  2026-11-19 공통문항 83개를 확인했다 — 70개는 "특정 기록 인용 없음" 같은 설명뿐이고, 13개(인하대·인제대 재외국민
 *  지식 문항 12, 강원대 치의예 1)는 같은 문장 안에 문제의 조건·상황이 함께 적혀 있다. 둘 다 「문항 설명」이 맞다. */
function passageLabel(kind: string): string {
  if (PASSAGE_KINDS.has(kind)) return "제시문·상황 요지";
  if (kind === "공통문항" || /기출 아님/.test(kind)) return "문항 설명";
  return "생기부 기록";
}

/** -------------------------------------------------------------------------
 *  응시 후기로 진행을 맞춘 대학 — 머리말 원칙 2·3 의 예외 (data-rules.md 4-2, 소유자 승인 2026-11-19)
 *
 *  대학이 면접 시간과 진행 순서를 밝히지 않았지만 같은 전형의 응시 후기가 있을 때, 기본 선택과 시간을 그 진행에 맞춘다.
 *   · 후기에서 온 문항(첫 질문·마지막 질문)은 대학 공개 문항이 아니다. 문항의 meta.kind·passages 에 출처를 따로 적고
 *     세트 notes·source.label·선택기 안내에도 밝힌다.
 *   · 시간은 연습용이다. timeNote 에 대학이 밝힌 값이 아님을 적는다.
 *   · 배포된 코치(question 엔진)는 rooms[0].answerSec 를 「답변 제한 시간」(문항당) 기본값으로 쓰고,
 *     pick 'student' 일 때 문항 목록 앞에서부터 itemsPerRoom 개를 골라 둔다(2026-11-19 tmedi.kr 빌드에서 확인).
 *  ------------------------------------------------------------------------- */
type ReviewFlow = {
  /** 한 번에 연습하는 문항 수 — 첫 질문 + 가운데 + 마지막 질문 */
  items: number;
  /** 문항당 답변 제한 시간 기본값(초) */
  answerSec: number;
  timeNote: string;
  /** source.label 뒤에 붙인다 */
  sourceNote: string;
  notes: string[];
  /** /interview/ai 선택기에 덧붙이는 한 줄 */
  pickerNote: string;
  opening: SetItem;
  closing: SetItem;
};

const EWHA_REVIEW = "울산광역시교육청 「2026 대입 면접 후기 자료집」";

const REVIEW_FLOW: Record<string, ReviewFlow> = {
  ewha: {
    items: 6,
    answerSec: 60,
    timeNote:
      "대학은 면접 시간을 밝히지 않았습니다. 2026학년도 응시 후기(면접관 3명 · 6분 안팎)에 맞춘 연습용 시간입니다 — 6문항 · 문항당 1분. 아래에서 바꿀 수 있습니다.",
    sourceNote: "첫 질문과 마지막 질문은 2026 응시 후기(대학 공개 문항 아님)",
    notes: [
      "대학이 공개한 질문은 전 계열 공통 예시뿐입니다. 의예과·약학부 전용 기출은 공개되지 않았습니다.",
      `첫 질문(지원동기)과 마지막 질문(마지막으로 하고 싶은 말)은 대학이 공개한 문항이 아닙니다. 2026학년도 같은 전형 응시 후기 2건(${EWHA_REVIEW}, 수학교육과·과학교육과)의 진행 순서에서 가져왔습니다. 의예과·약학부 후기는 아닙니다.`,
      "후기의 진행: 면접관 3명이 돌아가며 질문 → 지원동기 → 세특·창체 기반 질문 4~5개 → 마지막으로 하고 싶은 말. 기본으로 골라 둔 6문항이 이 순서입니다.",
    ],
    pickerNote:
      "첫 질문(지원동기)과 마지막 질문(마지막으로 하고 싶은 말)은 대학 공개 문항이 아니라 2026학년도 응시 후기의 진행 순서에서 가져왔습니다. 6문항 · 문항당 1분도 후기(6분 안팎)에 맞춘 연습용 시간입니다.",
    opening: {
      id: "review-motive",
      question: "지원 동기를 말해 보세요.",
      passages: [
        {
          label: "출처",
          text: `대학이 공개한 문항이 아닙니다. 2026학년도 같은 전형 응시 후기 2건(수학교육과·과학교육과) 모두 첫 질문이 지원동기였습니다 — ${EWHA_REVIEW}. 의예과·약학부 후기는 아닙니다.`,
        },
      ],
      meta: { year: 2026, kind: "응시 후기", topic: "지원동기", scope: "대학 공개 문항 아님" },
      review: {
        focus:
          "2026 응시 후기 두 건 모두 첫 질문이 지원동기였고, 한 건은 블라인드 면접이라 자기소개를 생략했다고 적었습니다. 2027 면접 평가요소로 보면 진로역량에 가까운 질문입니다 — 계기보다 고교 활동으로 관심이 구체화된 과정이 답의 중심이어야 합니다.",
        frame: [
          "처음 계기는 한 줄로",
          "관심을 구체화한 고교 활동 하나 — 과목·탐구 이름까지",
          "이 전공이어야 하는 이유(약학부는 약학전공·미래산업약학전공 가운데 고른 전공의 이유까지)",
          "입학 후 먼저 하고 싶은 공부 한 줄",
        ],
        pitfall: "계기 이야기로 1분을 다 쓰는 답, 뒤에 나올 세특 질문의 답을 여기서 미리 다 말해 버리는 답입니다.",
      },
    },
    closing: {
      id: "review-last-word",
      question: "마지막으로 하고 싶은 말이 있으면 해 보세요.",
      passages: [
        {
          label: "출처",
          text: `대학이 공개한 문항이 아닙니다. 2026학년도 같은 전형 응시 후기 2건(수학교육과·과학교육과) 모두 마지막 질문이 '하고 싶은 말'이었습니다 — ${EWHA_REVIEW}. 의예과·약학부 후기는 아닙니다.`,
        },
      ],
      meta: { year: 2026, kind: "응시 후기", topic: "마지막으로 하고 싶은 말", scope: "대학 공개 문항 아님" },
      review: {
        focus:
          "2026 응시 후기 두 건 모두 마지막 질문이 '하고 싶은 말'이었습니다. 한 건은 면접 시간이 짧으니 꼭 보여 주고 싶은 것을 이 질문에 준비해 두라고 적었습니다.",
        frame: ["앞 질문에서 다 말하지 못한 강점 하나 — 기록 근거와 함께", "입학 후 계획 한 문장", "짧은 마무리 인사"],
        pitfall: "앞에서 한 답을 그대로 되풀이하는 답, 준비한 말을 길게 외워 시간을 넘기는 답입니다.",
      },
    },
  },
};

/** 후기의 진행 순서로 문항을 놓는다 — 첫 질문 → 가운데(생기부 기반 먼저, 모자라면 다음 문항으로 채움) → 마지막 질문 → 나머지.
 *  기본 선택이 앞에서부터 flow.items 개라서, 이 순서가 곧 기본 연습 순서다. 학생이 더 고른 문항은 마지막 질문 뒤에 온다. */
function withFlow(items: SetItem[], flow: ReviewFlow): SetItem[] {
  const n = Math.max(0, flow.items - 2);
  const record = items.filter((it) => it.meta?.kind === "생기부 기반").slice(0, n);
  const fill = items.filter((it) => !record.includes(it)).slice(0, n - record.length);
  const middle = items.filter((it) => record.includes(it) || fill.includes(it));
  const rest = items.filter((it) => !middle.includes(it));
  return [flow.opening, ...middle, flow.closing, ...rest];
}

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
  const flow = REVIEW_FLOW[u.key];
  const items = flow ? withFlow(g.items, flow) : g.items;
  return {
    spec: 1,
    id,
    site: "medi",
    target: { year: SET_YEAR, univ: u.short, univKey: u.short, track: g.track, unit: GICHUL_FIELD_LABEL[field].unit, field },
    title: `${u.short} ${GICHUL_FIELD_LABEL[field].page} 면접 — ${g.track}`,
    engine: "question",
    format: {
      pick: "student",
      timeNote: flow?.timeNote ?? "대학이 문항별 답변 시간을 밝히지 않아 기본 시간으로 연습합니다. 아래에서 바꿀 수 있습니다.",
      rooms: [
        {
          label: flow ? "실전 순서 연습" : "기출 연습",
          prepSec: PREP_SEC,
          ...(flow ? { answerSec: flow.answerSec } : {}),
          itemsPerRoom: Math.min(flow?.items ?? ITEMS_PER_SESSION, items.length),
        },
      ],
    },
    items,
    source: {
      kind,
      label: `${source.label}${years.length ? ` (${years.join('·')})` : ""}${flow ? ` · ${flow.sourceNote}` : ""}`,
      ...(source.url ? { url: source.url } : {}),
    },
    notes: [
      "질문은 대학 공개 자료의 문장을 그대로 옮기지 않고 요약했습니다.",
      "문항마다 대학이 공개한 범위(의예과 · 전 계열 공통 등)를 함께 적었습니다.",
      ...(flow?.notes ?? []),
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
  /** 기출이 아닌 것이 섞인 세트의 안내 한 줄(REVIEW_FLOW) — 선택기 설명 뒤에 붙인다 */
  note?: string;
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
    // 세트 id 는 'medi:<대학 키>:…' 꼴이다(baseSet)
    const note = REVIEW_FLOW[s.id.split(":")[1]]?.pickerNote;
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
      ...(note ? { note } : {}),
    };
  });
}

export const PICKER_FIELDS = GICHUL_FIELD_ORDER.map((f) => ({ key: f, label: GICHUL_FIELD_LABEL[f].page }));
