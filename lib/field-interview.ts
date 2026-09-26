/** =========================================================================
 *  계열별 면접 데이터의 공통 타입 — 치의예 · 한의예 · 약학 · 수의예가 함께 쓴다.
 *
 *  ⚠️ 각 계열 파일은 해당 계열 요강 문장만 담는다.
 *     의예과 데이터로 다른 계열을 유추하지 않는다.
 *  ========================================================================= */

/** 요강에서 확인된 면접의 성격. none = 그 대학이 그 계열에서 면접을 실시하지 않음 */
export type FieldStyle = "jesimun" | "injeokseong" | "none";

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
