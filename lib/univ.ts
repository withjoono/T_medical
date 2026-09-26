import { FIELD_BY_KEY, type Univ as AdmissionUniv } from "./ipkyul";
import { UNIVS as MMI_UNIVS, type Univ as InterviewUniv } from "./mmi-schedule";
import { UNIV_INTERVIEWS, type UnivInterview } from "./univ-interview";

/** =========================================================================
 *  대학별 페이지(/univ/[slug])의 데이터 합류 지점.
 *
 *  세 곳에 흩어진 대학 정보를 슬러그 하나로 묶는다:
 *    1. lib/ipkyul (uiye)      — 전형 구조·모집인원·수능최저·입결   (38개교)
 *    2. lib/mmi-schedule       — MMI 특강을 여는 대학의 면접 상세    (15개교)
 *    3. lib/univ-interview     — 나머지 대학의 면접 상세             (24개교)
 *
 *  ⚠️ 이 파일은 데이터를 만들지 않는다. 합치기만 한다.
 *     새 대학을 추가하려면 위 세 SSOT 중 하나를 고친다.
 *  ========================================================================= */

export type UnivPage = {
  slug: string;
  /** 정식 명칭 — 면접 데이터의 name 을 우선한다(의과대학까지 포함돼 있다) */
  name: string;
  short: string;
  region: string;
  /** 권역 — 허브에서 묶는 단위 */
  zone: Zone;
  /** 전형 데이터. 의예과 입결 SSOT 에 없는 대학은 undefined */
  admission?: AdmissionUniv;
  /** 면접 데이터. 두 SSOT 중 어느 쪽에서 왔는지는 hasClassPage 로 구분한다 */
  interview?: InterviewUniv;
  /** 대학 페이지(/univ/[slug])에 수업 일정·예약 블록을 렌더하는가.
   *  mmi-schedule SSOT 에 일정 데이터가 있는 대학만 true 다. */
  hasClassPage: boolean;
  /** 면접을 실시하는가. 면접 데이터가 없으면 undefined(= 확인 안 됨) */
  hasInterview?: boolean;
  /** 요강 확인 수준 — "low" 면 페이지에 미확인 경고를 띄운다 */
  confidence: "high" | "medium" | "low";
};

export type Zone = "수도권" | "강원" | "충청" | "전라" | "경상" | "제주";

const ZONE_ORDER: Zone[] = ["수도권", "강원", "충청", "전라", "경상", "제주"];

function toZone(region: string): Zone {
  /** region 은 "울산 · 서울아산병원"처럼 병원명이 붙는다.
   *  소재지는 맨 앞 토큰이므로 거기서만 권역을 읽는다. */
  const r = (region ?? "").split("·")[0].trim();
  if (/서울|인천|경기/.test(r)) return "수도권";
  if (/강원/.test(r)) return "강원";
  if (/충남|충북|대전|세종|충청/.test(r)) return "충청";
  if (/전남|전북|광주|전라/.test(r)) return "전라";
  if (/제주/.test(r)) return "제주";
  if (/경남|경북|대구|부산|울산|경상/.test(r)) return "경상";
  return "경상";
}

const MMI_BY_SLUG = new Map(MMI_UNIVS.map((u) => [u.slug, u]));
const OTHER_BY_SLUG = new Map<string, UnivInterview>(
  UNIV_INTERVIEWS.map((u) => [u.slug, u]),
);
const ADMISSION_BY_SLUG = new Map(
  FIELD_BY_KEY.uiye.univs.map((u) => [u.slug, u]),
);

/** 세 SSOT 의 슬러그 합집합 — 어느 하나에만 있어도 페이지를 만든다. */
const ALL_SLUGS: string[] = [
  ...new Set([
    ...ADMISSION_BY_SLUG.keys(),
    ...MMI_BY_SLUG.keys(),
    ...OTHER_BY_SLUG.keys(),
  ]),
];

function build(slug: string): UnivPage {
  const admission = ADMISSION_BY_SLUG.get(slug);
  const mmi = MMI_BY_SLUG.get(slug);
  const other = OTHER_BY_SLUG.get(slug);
  const interview = mmi ?? other;

  const name = interview?.name ?? `${admission?.name ?? slug}학교 의과대학`;
  const short = interview?.short ?? admission?.name ?? slug;
  const region = interview?.region ?? admission?.region ?? "";

  return {
    slug,
    name,
    short,
    region,
    zone: toZone(region),
    admission,
    interview,
    hasClassPage: Boolean(mmi),
    hasInterview: other ? other.hasInterview : mmi ? true : undefined,
    confidence: other?.confidence ?? (mmi ? "high" : "medium"),
  };
}

export const UNIV_PAGES: UnivPage[] = ALL_SLUGS.map(build).sort((a, b) => {
  const z = ZONE_ORDER.indexOf(a.zone) - ZONE_ORDER.indexOf(b.zone);
  return z !== 0 ? z : a.short.localeCompare(b.short, "ko");
});

export function getUnivPage(slug: string): UnivPage | undefined {
  return UNIV_PAGES.find((u) => u.slug === slug);
}

/** 허브에서 권역별로 묶어 보여준다. */
export function byZone(): { zone: Zone; univs: UnivPage[] }[] {
  return ZONE_ORDER.map((zone) => ({
    zone,
    univs: UNIV_PAGES.filter((u) => u.zone === zone),
  })).filter((g) => g.univs.length > 0);
}

/** 전형 유형별 모집인원 합계 — 대학 페이지 상단 숫자줄. */
export function quotaByType(u: UnivPage): { type: string; quota: number; programs: number }[] {
  if (!u.admission) return [];
  const order = ["교과", "종합", "논술", "실기", "기타"];
  const map = new Map<string, { quota: number; programs: number }>();
  for (const unit of u.admission.units) {
    const t = unit.type ?? "기타";
    const cur = map.get(t) ?? { quota: 0, programs: 0 };
    map.set(t, { quota: cur.quota + (unit.quota || 0), programs: cur.programs + 1 });
  }
  return [...map.entries()]
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([type, v]) => ({ type, ...v }));
}

/** 면접을 실시하는 전형 수 — 0이면 면접 없는 대학이다. */
export function interviewTrackCount(u: UnivPage): number {
  return u.interview?.tracks.length ?? 0;
}

/** 가장 이른 면접일 — 허브 카드와 메타 설명에 쓴다. */
export function earliestInterview(u: UnivPage): string | null {
  const days = (u.interview?.tracks ?? [])
    .map((t) => t.interview)
    .filter((d): d is string => Boolean(d))
    .sort();
  return days[0] ?? null;
}

export const UNIV_TOTALS = {
  univs: UNIV_PAGES.length,
  withAdmission: UNIV_PAGES.filter((u) => u.admission).length,
  withInterview: UNIV_PAGES.filter((u) => u.interview).length,
  withClass: UNIV_PAGES.filter((u) => u.hasClassPage).length,
  noInterview: UNIV_PAGES.filter((u) => u.hasInterview === false).length,
};
