import { UNIVS as MMI_UNIVS } from "./mmi-schedule";
import { UNIV_INTERVIEWS } from "./univ-interview";
import { CHIDAE_UNIVS } from "./chidae-interview";
import { HANUIDAE_UNIVS } from "./hanuidae-interview";
import { YAKDAE_UNIVS } from "./yakdae-interview";
import { SUUIDAE_UNIVS } from "./suuidae-interview";
import type { FieldUniv } from "./field-interview";

/** =========================================================================
 *  메인 입시 캘린더의 데이터 합류 지점 — 의 · 치 · 한 · 약 · 수 전부.
 *
 *  ⚠️ 이 파일은 데이터를 만들지 않는다. 계열별 SSOT 를 합치기만 한다.
 *       의예   : lib/mmi-schedule.ts (15교) + lib/univ-interview.ts (24교)
 *       치의예 : lib/chidae-interview.ts
 *       한의예 : lib/hanuidae-interview.ts
 *       약학   : lib/yakdae-interview.ts
 *       수의예 : lib/suuidae-interview.ts
 *     날짜를 고치려면 저 다섯 곳을 고친다.
 *
 *  ⚠️ 요강에 날짜가 없는 항목은 이벤트를 만들지 않는다. 추정해서 채우지 않는다.
 *  ========================================================================= */

export const FIELDS = [
  { key: "uiye", label: "의예", short: "의" },
  { key: "chiuiye", label: "치의예", short: "치" },
  { key: "hanuiye", label: "한의예", short: "한" },
  { key: "yakhak", label: "약학", short: "약" },
  { key: "suuiye", label: "수의예", short: "수" },
] as const;

export type FieldKey = (typeof FIELDS)[number]["key"];

/** 일정 종류 — 지원자가 실제로 달력에 적는 세 가지. */
export const KINDS = [
  { key: "announce", label: "1차 발표" },
  { key: "interview", label: "면접" },
  { key: "final", label: "합격 발표" },
] as const;

export type KindKey = (typeof KINDS)[number]["key"];

/** 달력에 실제로 찍히는 종류. "common" 은 대교협 공통 일정이라 필터 버튼을 두지 않는다. */
export type EventKind = KindKey | "common";

export type CalEvent = {
  id: string;
  /** ISO 날짜 */
  date: string;
  kind: EventKind;
  field: FieldKey;
  /** 대학 짧은 이름. 공통 일정이면 null */
  univ: string | null;
  /** 전형명 또는 공통 일정 설명 */
  track: string;
  note?: string;
  href?: string;
};

function push(
  out: CalEvent[],
  field: FieldKey,
  univ: string,
  slug: string,
  trackName: string,
  announce: string | null | undefined,
  interview: string | null | undefined,
  idSeed: string,
  note?: string,
) {
  const href = `/univ/${slug}`;
  if (announce) {
    out.push({
      id: `${idSeed}-a`,
      date: announce,
      kind: "announce",
      field,
      univ,
      track: trackName,
      href,
    });
  }
  if (interview) {
    out.push({
      id: `${idSeed}-i`,
      date: interview,
      kind: "interview",
      field,
      univ,
      track: trackName,
      note,
      href,
    });
  }
}

function fromFieldUnivs(univs: FieldUniv[], field: FieldKey): CalEvent[] {
  const out: CalEvent[] = [];
  for (const u of univs) {
    for (const [i, t] of u.tracks.entries()) {
      if (!t.interview) continue;
      push(out, field, u.short, u.slug.replace(/-[a-z]+$/, ""), t.name, t.announce, t.date, `${field}-${u.slug}-${i}`);
    }
  }
  return out;
}

function uiyeEvents(): CalEvent[] {
  const out: CalEvent[] = [];
  for (const u of MMI_UNIVS) {
    for (const t of u.tracks) {
      push(out, "uiye", u.short, u.slug, t.name, t.announce ?? t.announceAssumed, t.interview, `uiye-${t.id}`, t.interviewNote);
    }
  }
  for (const u of UNIV_INTERVIEWS) {
    for (const t of u.tracks) {
      push(out, "uiye", u.short, u.slug, t.name, t.announce, t.interview, `uiye-${t.id}`, t.interviewNote);
    }
  }
  return out;
}

/** 대교협 공통 일정. 계열과 무관하게 모든 지원자에게 같다. */
const COMMON: CalEvent[] = [
  {
    id: "common-suneung",
    date: "2026-11-19",
    kind: "common",
    field: "uiye",
    univ: null,
    track: "2027학년도 대학수학능력시험",
    note: "이 날을 기준으로 면접이 수능 전인지 후인지 갈립니다.",
  },
  {
    id: "common-final",
    date: "2026-12-18",
    kind: "final",
    field: "uiye",
    univ: null,
    track: "수시 합격자 발표 마감",
    note: "대교협 공통 마감일입니다. 이보다 먼저 발표하는 대학이 있습니다(이화여대 12/3 · 대구한의대 12/11 · 대전대·우석대 12/15 · 동의대 12/16 · 상지대·대구가톨릭대·한림대 12/17).",
  },
  {
    id: "common-register",
    date: "2026-12-21",
    kind: "final",
    field: "uiye",
    univ: null,
    track: "합격자 문서등록 시작 (~12/23)",
  },
  {
    id: "common-chungwon",
    date: "2026-12-30",
    kind: "final",
    field: "uiye",
    univ: null,
    track: "수시 충원 합격 발표 마감",
  },
];

export const CALENDAR_EVENTS: CalEvent[] = [
  ...uiyeEvents(),
  ...fromFieldUnivs(CHIDAE_UNIVS, "chiuiye"),
  ...fromFieldUnivs(HANUIDAE_UNIVS, "hanuiye"),
  ...fromFieldUnivs(YAKDAE_UNIVS, "yakhak"),
  ...fromFieldUnivs(SUUIDAE_UNIVS, "suuiye"),
  ...COMMON,
].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

/** 공통 일정은 계열 필터와 무관하게 항상 보인다. */
export const COMMON_IDS = new Set(COMMON.map((e) => e.id));

export const CALENDAR_TOTALS = {
  events: CALENDAR_EVENTS.length,
  univs: new Set(CALENDAR_EVENTS.filter((e) => e.univ).map((e) => `${e.field}|${e.univ}`)).size,
  byField: Object.fromEntries(
    FIELDS.map((f) => [
      f.key,
      new Set(
        CALENDAR_EVENTS.filter((e) => e.field === f.key && e.univ).map((e) => e.univ),
      ).size,
    ]),
  ) as Record<FieldKey, number>,
};
