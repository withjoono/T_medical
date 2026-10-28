/** =========================================================================
 *  대학별 면접 기출 분석 — 의·치·한·약·수 46개 대학 (2026-10-28 추가)
 *
 *  원천: 각 대학 「대학별 고사 선행학습 영향평가 자체평가 보고서」 2025·2026학년도의
 *        면접 문항 공개분. 대학당 데이터 파일 하나 — `lib/gichul-data/<key>.json`,
 *        목록은 `lib/gichul-data/index.ts`(자동 생성). 가천대는 `lib/gachon-gichul.ts` 가 따로 맡는다.
 *
 *  ⚠️ 원칙 (lib/gachon-gichul.ts 와 같다)
 *   1. 질문은 보고서 문장을 그대로 옮기지 않고 '근거 기록 + 묻는 것' 으로 요약했다.
 *   2. `unit` 은 보고서가 공개한 범위 그대로다. '전 계열 공통' 예시를 의대 기출처럼 쓰지 말 것.
 *      학과 구분 없는 문항을 여러 계열 페이지에 나눈 것(`page`)은 과목 성격에 맞춘 **배치**일 뿐이다.
 *   3. 같은 대학의 여러 계열 페이지에 같은 문항·표를 겹쳐 싣지 않는다(2026-10-24 본문 중복 정리).
 *      배치 규칙은 `gichulLayout()` 한 곳이 정한다.
 *   4. 답변 골격은 고교 교육과정 수준이다. 교육과정 밖 내용을 넣지 말 것.
 *   5. 보고서 원문을 다시 대조해 고친 값이다. 고칠 때는 출처 쪽수(`src`)와 함께 고친다.
 *  ========================================================================= */

import { GICHUL_DATA } from "./gichul-data";

export type GichulField = "uidae" | "chidae" | "hanuidae" | "yakdae" | "suuidae";

export const GICHUL_FIELD_ORDER: GichulField[] = ["uidae", "chidae", "hanuidae", "yakdae", "suuidae"];

export const GICHUL_FIELD_LABEL: Record<GichulField, { page: string; unit: string }> = {
  uidae: { page: "의대", unit: "의예과" },
  chidae: { page: "치대", unit: "치의예과" },
  hanuidae: { page: "한의대", unit: "한의예과" },
  yakdae: { page: "약대", unit: "약학과" },
  suuidae: { page: "수의대", unit: "수의예과" },
};

export type UnivGichulQuestion = {
  id: string;
  year: number;
  /** 보고서가 공개한 범위 — 의예과 / 의약계열(학과 구분 없음) / 전 계열 공통 … */
  unit: string;
  track?: string;
  kind: string;
  topic: string;
  subject: string;
  /** 생기부 기록 요약 또는 제시문·상황 요지 */
  basis: string;
  ask: string;
  focus: string;
  frame: string[];
  followups: string[];
  pitfall: string;
  /** 이 문항을 싣는 계열 페이지 */
  page: GichulField;
  src?: string;
};

export type UnivGichulInseong = { year: number; unit?: string; record: string; ask: string; point: string };

export type UnivGichul = {
  key: string;
  name: string;
  short: string;
  /** 계열 → 사이트 슬러그 (/interview/<계열>/<슬러그>) */
  pages: Partial<Record<GichulField, string>>;
  format2027?: string;
  oneLine?: string;
  evidence?: string;
  questions: UnivGichulQuestion[];
  inseong?: UnivGichulInseong[];
  trend?: { item: string; y2025: string; y2026: string }[];
  prep?: { step: string; detail: string }[];
  limits?: string[];
  sources?: { label: string; url?: string; note?: string }[];
};

export const UNIV_GICHUL: UnivGichul[] = GICHUL_DATA as UnivGichul[];

export function gichulHref(field: GichulField, slug: string) {
  return `/interview/${field}/${slug}`;
}

/** 이 대학의 사이트 계열 페이지(순서 고정) */
export function gichulFields(u: UnivGichul): GichulField[] {
  return GICHUL_FIELD_ORDER.filter((f) => u.pages[f]);
}

/** 그 페이지에 싣는 문항 — 최근 연도 먼저, 같은 해는 데이터 순서 */
export function gichulQuestionsOn(u: UnivGichul, field: GichulField) {
  return u.questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.page === field)
    .sort((a, b) => b.q.year - a.q.year || a.i - b.i)
    .map(({ q }) => q);
}

export type GichulLayout = {
  /** 한마디·근거·2027 방식·연도 비교·자료의 한계를 싣는 페이지 */
  primary: GichulField;
  /** 인성 질문 표를 싣는 페이지 */
  inseong: GichulField;
  /** 준비 순서를 싣는 페이지 */
  prep: GichulField;
};

/** 같은 대학 여러 페이지에 공통 블록을 한 번씩만 배치한다.
 *  · 주 페이지 = 계열 순서상 첫 페이지(의대 > 치대 > 한의대 > 약대 > 수의대)
 *  · 인성 표·준비 순서는 나머지 페이지 중 문항이 적은 쪽부터 하나씩 */
export function gichulLayout(u: UnivGichul): GichulLayout {
  const fields = gichulFields(u);
  const primary = fields[0];
  const rest = fields
    .slice(1)
    .map((f, i) => ({ f, i, n: gichulQuestionsOn(u, f).length }))
    .sort((a, b) => a.n - b.n || b.i - a.i)
    .map((x) => x.f);
  const inseong = rest[0] ?? primary;
  const prep = rest[1] ?? rest[0] ?? primary;
  return { primary, inseong, prep };
}

/** 라우트(계열·슬러그) → 그 페이지가 싣는 대학 분석. 없으면 undefined */
export function univGichulFor(field: string, slug: string): { u: UnivGichul; field: GichulField } | undefined {
  for (const u of UNIV_GICHUL) {
    for (const f of gichulFields(u)) {
      if (f === field && u.pages[f] === slug) return { u, field: f };
    }
  }
  return undefined;
}
