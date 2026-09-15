/** =========================================================================
 *  2027학년도 의치한약수 수시 입시결과 — 데이터 SSOT
 *
 *  원천: T스쿨 수시 DB 적재 패키지(2027 기준) — unit / program / ipgyeol_cut
 *
 *  ⚠️ 게시 원칙 — 실측만 싣는다.
 *     원본 입결컷 테이블은 `자료출처` 가 '입결+어디가'(실측)와 '추정(계열)'로 나뉜다.
 *     추정치는 계열 평균으로 빈칸을 메운 값이라 **이 파일에 넣지 않았다.**
 *     의대는 1.2와 1.4가 당락을 가르는데 계열 평균을 입결로 내보내면 오지원을 만든다.
 *     → cut 이 없는 전형은 페이지에서 '공시 입결 없음'으로 비워 둔다. 추정으로 채우지 말 것.
 *  ========================================================================= */

export type FieldKey = "uiye" | "chiuiye" | "hanuiye" | "suuiye" | "yakhak";

/** 최종등록자 성적 컷. 등급은 낮을수록 우수. */
export type Cut = {
  /** 50%컷 등급 */ g50?: number;
  /** 70%컷 등급 */ g70?: number;
  /** 50%컷 환산점수 */ c50?: number;
  /** 70%컷 환산점수 */ c70?: number;
  /** 환산 만점 */ max?: number;
  /** 신뢰도 — 높음 / 보통 */ conf?: string;
};

export type Unit = {
  type?: string;      // 교과 / 종합 / 논술 / 실기 / 기타
  program?: string;   // 전형명
  unit?: string;      // 모집단위
  quota: number;      // 모집인원
  cut?: Cut;          // 실측 입결이 있을 때만
  minimum?: string;   // 수능최저
  model?: string;     // 선발모형 (단계별/일괄합산)
  stage1?: string;
  stage2?: string;
  ratio?: number;     // 1단계 선발비율(일괄=100)
  interview?: string; // 면접유형
};

export type Univ = {
  slug: string;
  name: string;
  region?: string;
  units: Unit[];
  quota: number;     // 대학 전체 수시 모집인원(해당 계열)
  measured: number;  // 실측 입결을 가진 전형 수
};

export type Field = {
  key: FieldKey;
  label: string;     // 의예과
  college: string;   // 의과대학
  tone: string;      // 캘린더와 같은 계열 색 키
  univs: Univ[];
};

import { UIYE } from "./uiye";
import { CHIUIYE } from "./chiuiye";
import { HANUIYE } from "./hanuiye";
import { SUUIYE } from "./suuiye";
import { YAKHAK } from "./yakhak";

export const FIELDS: Field[] = [
  { key: "uiye", label: "의예과", college: "의과대학", tone: "med", univs: UIYE },
  { key: "chiuiye", label: "치의예과", college: "치과대학", tone: "dent", univs: CHIUIYE },
  { key: "hanuiye", label: "한의예과", college: "한의과대학", tone: "kor", univs: HANUIYE },
  { key: "suuiye", label: "수의예과", college: "수의과대학", tone: "vet", univs: SUUIYE },
  { key: "yakhak", label: "약학과", college: "약학대학", tone: "pharm", univs: YAKHAK },
];


export const FIELD_BY_KEY = Object.fromEntries(FIELDS.map((f) => [f.key, f])) as Record<FieldKey, Field>;

export function getField(key: string): Field | undefined {
  return FIELDS.find((f) => f.key === key);
}

/** 의예과 기준 대학 조회 — 대학별 페이지가 쓴다. */
export function getMedUniv(slug: string): Univ | undefined {
  return FIELD_BY_KEY.uiye.univs.find((u) => u.slug === slug);
}

/** 그 대학이 다른 계열에도 모집단위를 두는가 — 대학별 페이지 하단 링크용. */
export function otherFields(slug: string): { field: Field; univ: Univ }[] {
  return FIELDS.flatMap((f) =>
    f.key === "uiye" ? [] : f.univs.filter((u) => u.slug === slug).map((u) => ({ field: f, univ: u })),
  );
}

/** 실측 입결이 있는 전형만. 없으면 빈 배열 — 추정으로 채우지 않는다. */
export function measuredUnits(u: Univ): Unit[] {
  return u.units.filter((x) => x.cut && (x.cut.g50 != null || x.cut.g70 != null));
}

/** 전형유형별로 묶는다. 표를 유형 단위로 끊어 보여주기 위한 것. */
export function byType(units: Unit[]): { type: string; units: Unit[] }[] {
  const order = ["교과", "종합", "논술", "실기", "기타"];
  const map = new Map<string, Unit[]>();
  for (const x of units) {
    const t = x.type ?? "기타";
    map.set(t, [...(map.get(t) ?? []), x]);
  }
  return [...map.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([type, units]) => ({ type, units }));
}

/** 계열 전체 합계 — 허브·계열 페이지의 숫자 줄. */
export function fieldTotals(f: Field) {
  const units = f.univs.flatMap((u) => u.units);
  return {
    univs: f.univs.length,
    programs: units.length,
    quota: units.reduce((a, x) => a + (x.quota || 0), 0),
    measured: units.filter((x) => x.cut).length,
    measuredUnivs: f.univs.filter((u) => u.measured > 0).length,
  };
}
