/** =========================================================================
 *  수능 전 연휴 의대 면접 특강 — 구간 · 일정 데이터
 *
 *  이 파일 하나만 고치면 /interview/chuseok 의 숫자가 전부 바뀐다.
 *  페이지에는 하드코딩된 날짜·회차가 없다.
 *
 *  ⚠️ 슬롯·예약 현황은 lib/mmi-schedule.ts 의 slotsForDate() 를 그대로 쓴다.
 *     강사가 두 명뿐이라 같은 날짜는 /mmi 대학 페이지에서 보든 이 페이지에서
 *     보든 같은 잔여가 나와야 한다. 여기서 따로 만들지 말 것.
 *
 *  ⚠️ 휴일 시간표(5타임)로 열리려면 그 날짜가 mmi-schedule 의 HOLIDAYS 에
 *     있거나 주말이어야 한다. 구간을 늘릴 때 공휴일을 HOLIDAYS 에 먼저 넣는다.
 *  ========================================================================= */

import {
  addDays,
  diffDays,
  formatKo,
  isHolidaySchedule,
  summarize,
  UNIVS,
  type BookingSummary,
} from "./mmi-schedule";

/** 2027학년도 수능일. */
export const SUNEUNG = "2026-11-19";

export type Block = {
  id: string;
  name: string;
  /** 연휴의 이름이 된 공휴일 */
  reason: string;
  start: string;
  end: string;
  /** 이 구간을 왜 쓰는지 — 페이지에 그대로 나간다 */
  note: string;
};

/** 수능 전 남은 연휴 3구간.
 *  2026 추석은 9/25(금)이고 토요일과만 겹쳐 대체공휴일이 없다 — 9/28(월)은 평일이다. */
export const BLOCKS: Block[] = [
  {
    id: "chuseok",
    name: "추석 연휴",
    reason: "추석 9월 25일(금)",
    start: "2026-09-24",
    end: "2026-09-27",
    note:
      "수능 전 가장 긴 연휴입니다. 수시 원서를 넣고 경쟁률까지 확인한 직후라, 실제로 면접을 볼 대학이 좁혀진 상태에서 시작할 수 있는 첫 구간입니다.",
  },
  {
    id: "gaecheon",
    name: "개천절 연휴",
    reason: "개천절 10월 3일(토) · 대체공휴일 10월 5일(월)",
    start: "2026-10-03",
    end: "2026-10-05",
    note:
      "개천절이 토요일과 겹쳐 10월 5일(월)이 대체공휴일입니다. 사흘이 이어지므로 추석에 잡은 답변 골격을 실전 형태로 돌려보는 구간으로 씁니다.",
  },
  {
    id: "hangeul",
    name: "한글날 연휴",
    reason: "한글날 10월 9일(금)",
    start: "2026-10-09",
    end: "2026-10-11",
    note:
      "수능 전 마지막 연휴입니다. 건양대 지역[면접]전형은 10월 12일(월) 1단계 발표, 10월 17일(토) 면접이라 이 사흘이 발표 직전 마지막 준비 구간이 됩니다.",
  },
];

/** 구간 안의 모든 날짜. */
export function daysOf(b: Block): string[] {
  const out: string[] = [];
  for (let d = b.start; diffDays(d, b.end) >= 0; d = addDays(d, 1)) out.push(d);
  return out;
}

/** 특강 구간 전체 날짜 — 세 구간을 이은 것. */
export const ALL_DAYS: string[] = BLOCKS.flatMap(daysOf);

/** 구간별 요약(총 회차 · 남은 자리). */
export function summaryOf(b: Block): BookingSummary {
  return summarize(daysOf(b));
}

/** 특강 전체 요약. */
export const TOTAL: BookingSummary = summarize(ALL_DAYS);

/** 전 구간이 휴일 시간표(5타임)로 열리는가. 어긋나면 데이터가 잘못된 것이다. */
export const ALL_HOLIDAY_SCHEDULE: boolean = ALL_DAYS.every(isHolidaySchedule);

/* -------------------------------------------------------------------------
 *  왜 지금인가 — /mmi 대학 데이터에서 실측으로 뽑는다.
 *  숫자를 손으로 적지 않는다. UNIVS 가 바뀌면 이 값도 따라 바뀐다.
 * ---------------------------------------------------------------------- */

export type TrackFact = {
  univ: string;
  slug: string;
  track: string;
  announce: string | null;
  interview: string;
  /** 발표 → 면접 일수. 발표 미공지면 null */
  gap: number | null;
};

const FACTS: TrackFact[] = UNIVS.flatMap((u) =>
  u.tracks
    .filter((t) => t.interview)
    .map((t) => ({
      univ: u.short,
      slug: u.slug,
      track: t.name,
      announce: t.announce,
      interview: t.interview as string,
      gap: t.announce ? diffDays(t.announce, t.interview as string) : null,
    })),
);

/** 수능(11/19)보다 먼저 면접을 보는 전형. */
export const PRE_SUNEUNG: TrackFact[] = FACTS.filter(
  (f) => diffDays(f.interview, SUNEUNG) > 0,
).sort((a, b) => a.interview.localeCompare(b.interview));

/** 발표 → 면접 구간이 짧은 순. */
export const TIGHTEST: TrackFact[] = FACTS.filter((f) => f.gap !== null).sort(
  (a, b) => (a.gap as number) - (b.gap as number),
);

/** 발표 → 면접 평균 일수 (소수 첫째 자리). */
export const AVG_GAP: number =
  Math.round(
    (TIGHTEST.reduce((s, f) => s + (f.gap as number), 0) /
      Math.max(TIGHTEST.length, 1)) *
      10,
  ) / 10;

export const TRACK_COUNT = FACTS.length;
export const UNIV_COUNT = UNIVS.length;

/** 페이지 상단 배지에 쓰는 구간 라벨. */
export const RANGE_LABEL = `${formatKo(BLOCKS[0].start)} ~ ${formatKo(
  BLOCKS[BLOCKS.length - 1].end,
)}`;
