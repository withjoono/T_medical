/** =========================================================================
 *  계열별 면접 데이터의 공통 타입 — 치의예 · 한의예 · 약학 · 수의예가 함께 쓴다.
 *
 *  ⚠️ 각 계열 파일은 해당 계열 요강 문장만 담는다.
 *     의예과 데이터로 다른 계열을 유추하지 않는다.
 *
 *  ⚠️ 면접 유형은 두 축이다. 하나로 묶지 말 것.
 *     · 질문 출처(source) — 질문이 어디서 나오는가. 생기부 / 제시문 / 현장 문항.
 *     · 평가 배점(scoring) — 무엇에 점수를 주는가. 인성·적성 배점 / 역량 배점.
 *     "인적성면접"은 배점 이름이고 "생기부 기반"은 출처 이름이라 서로 배타적이지
 *     않다. 요강에 둘 다 적힌 대학, 하나만 적힌 대학, 아무것도 안 적힌 대학이
 *     모두 있으므로 없는 축은 '요강 미기재'로 남긴다. 추정해서 채우지 말 것.
 *  ========================================================================= */

/** 요강에서 확인된 면접의 성격. none = 그 대학이 그 계열에서 면접을 실시하지 않음 */
export type FieldStyle = "jesimun" | "injeokseong" | "none";

/** 두 축 각각의 표기. label 은 한 줄 요약, detail 은 요강 문장에 붙인 설명 */
export type FieldAxis = { label: string; detail: string };

export type FieldTrack = {
  /** 요강에 적힌 전형명 */
  name: string;
  kind: "교과" | "종합" | "논술";
  /** 요강 기준 모집인원. 묶음 표기라 개별 인원이 없으면 null */
  quota: number | null;
  /** 이 전형이 면접을 실시하는가 */
  interview: boolean;
  /** 단계별 반영 비율 — 요강 문장에서 옮긴다 */
  weight: string;
  /** 1단계 합격자 발표일(ISO). 요강 미기재면 null */
  announce: string | null;
  /** 면접고사일(ISO). 요강 미기재면 null */
  date: string | null;
  minimum?: string;
};

export type FieldUniv = {
  slug: string;
  short: string;
  name: string;
  zone: string;
  style: FieldStyle;
  styleLabel: string;
  headline: string;
  /** 질문 출처 축. 면접 미실시 대학은 생략 */
  source?: FieldAxis;
  /** 평가 배점 축. 요강에 배점이 없으면 label 에 '요강 미기재'로 적는다 */
  scoring?: FieldAxis;
  /** 요강에서 확인된 면접 방식 문장 */
  format: string[];
  /** 이 대학을 겨냥한 훈련 포인트 */
  drills: string[];
  tracks: FieldTrack[];
  notes?: string[];
};

export function fieldEarliest(u: FieldUniv): string | null {
  const ds = u.tracks.filter((t) => t.interview && t.date).map((t) => t.date!);
  return ds.length ? ds.sort()[0] : null;
}

export function fieldTotals(univs: FieldUniv[]) {
  return {
    univs: univs.length,
    withInterview: univs.filter((u) => u.style !== "none").length,
    noInterview: univs.filter((u) => u.style === "none").length,
    interviewTracks: univs.reduce(
      (n, u) => n + u.tracks.filter((t) => t.interview).length,
      0,
    ),
  };
}

/** 유형 순서는 고정한다 — 제시문 → 인적성·서류 → 미실시. */
export const FIELD_STYLE_ORDER: FieldStyle[] = ["jesimun", "injeokseong", "none"];

export function fieldByStyle<T extends FieldUniv>(
  univs: T[],
): { style: FieldStyle; univs: T[] }[] {
  return FIELD_STYLE_ORDER.map((style) => ({
    style,
    univs: univs.filter((u) => u.style === style),
  })).filter((g) => g.univs.length > 0);
}

export function fieldBySlug<T extends FieldUniv>(
  univs: T[],
  slug: string,
): T | undefined {
  return univs.find((u) => u.slug === slug);
}

/** 1단계 발표에서 면접까지 며칠인가. 역산 일정을 보여줄 때 쓴다. */
export function fieldGapDays(t: FieldTrack): number | null {
  if (!t.announce || !t.date) return null;
  const a = Date.parse(`${t.announce}T00:00:00Z`);
  const d = Date.parse(`${t.date}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(d)) return null;
  return Math.round((d - a) / 86400000);
}

/** 면접을 보는 전형 중 발표→면접 간격이 가장 짧은 구간. */
export function fieldTightestGap(u: FieldUniv): { track: FieldTrack; days: number } | null {
  let best: { track: FieldTrack; days: number } | null = null;
  for (const t of u.tracks) {
    if (!t.interview) continue;
    const days = fieldGapDays(t);
    if (days === null) continue;
    if (!best || days < best.days) best = { track: t, days };
  }
  return best;
}
