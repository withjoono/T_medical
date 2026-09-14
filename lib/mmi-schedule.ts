/** =========================================================================
 *  2027 의대 면접(MMI) 특강 — 대학별 일정 · 수업 슬롯 데이터
 *
 *  이 파일 하나만 고치면 /promo/mmi 전 페이지의 숫자가 바뀐다.
 *  페이지 쪽에는 하드코딩된 날짜·정원이 없다.
 *
 *  ⚠️ 예약 현황은 Math.random 을 쓰지 않는다.
 *     정적 export(output: 'export') 라 빌드 때 한 번 확정되어야 하고,
 *     난수를 쓰면 빌드마다 숫자가 바뀌며 hydration 이 어긋난다.
 *     → 날짜·시간·강사 문자열을 해시한 결정적 값으로 채운다.
 *
 *  ⚠️ 날짜는 전부 2027학년도(2026년 실시) 모집요강 실측값이다.
 *     확인되지 않은 항목은 announce: null 로 두고 announceNote 에 근거를 적는다.
 *     추정값을 확정값처럼 쓰지 말 것 — 페이지가 '예정'으로 표기해 준다.
 *  ========================================================================= */

/* -------------------------------------------------------------------------
 * 1. 결정적 해시 · 날짜 유틸
 * ---------------------------------------------------------------------- */

/** FNV-1a → 0 이상 1 미만. 같은 입력이면 언제나 같은 값. */
function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** "2026-11-27" → UTC Date. 로컬 타임존 영향을 받지 않게 UTC 로 고정한다. */
export function toDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, n: number): string {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}

/** b - a (일수). */
export function diffDays(a: string, b: string): number {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);
}

const DOW = ["일", "월", "화", "수", "목", "금", "토"];

export function dow(iso: string): string {
  return DOW[toDate(iso).getUTCDay()];
}

export function isWeekend(iso: string): boolean {
  const d = toDate(iso).getUTCDay();
  return d === 0 || d === 6;
}

/** "11월 27일(금)" */
export function formatKo(iso: string): string {
  const d = toDate(iso);
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일(${dow(iso)})`;
}

/** "2026. 11. 27." */
export function formatDot(iso: string): string {
  const d = toDate(iso);
  return `${d.getUTCFullYear()}. ${d.getUTCMonth() + 1}. ${d.getUTCDate()}.`;
}

/* -------------------------------------------------------------------------
 * 2. 강사 · 수업 조건
 * ---------------------------------------------------------------------- */

export const TEACHERS = [
  {
    id: "pew",
    name: "박은우",
    role: "제시문 · 구술 스테이션 총괄",
    credential: "서강대학교 공과대학 졸업 · 現 과학고 수학·과학(물리·화학·생명) AP 수업 담당",
    focus:
      "자료·제시문이 주어지는 스테이션을 맡습니다. 과학 개념이 얽힌 상황판단, 수치·그래프 해석, 그리고 면접관이 파고드는 꼬리질문을 버티는 논리 구조를 훈련합니다.",
  },
  {
    id: "kjg",
    name: "강정규",
    role: "인성 · 상황 스테이션 / 실전 모의면접",
    credential: "KAIST 전산학부 졸업 · KAIST 석사 재학",
    focus:
      "인성·상황·모의상황 스테이션을 맡습니다. 두괄식 답변 골격을 몸에 붙이고, 실전과 같은 조건으로 모의면접을 돌린 뒤 표현·태도·시선까지 즉시 교정합니다.",
  },
] as const;

export const TUITION = {
  perSession: 380000,
  perSessionLabel: "38만원",
  unit: "1회 · 1:1 개인지도",
} as const;

/** 1회 수업은 2시간 30분. 식사 시간(11:00~12:00 / 17:00~18:00)은 타임에서 뺀다.
 *
 *  평일  — 18:00~23:00 에 2타임
 *  휴일  — 08:30~11:00 / 12:00~17:00 / 18:00~23:00 에 5타임
 *
 *  holidayOnly 인 타임은 낮 시간대라 평일에는 열리지 않는다. */
export const SESSION_MINUTES = 150;

export const SLOT_TIMES = [
  { id: "am", label: "08:30–11:00", short: "08:30", holidayOnly: true },
  { id: "pm1", label: "12:00–14:30", short: "12:00", holidayOnly: true },
  { id: "pm2", label: "14:30–17:00", short: "14:30", holidayOnly: true },
  { id: "ev1", label: "18:00–20:30", short: "18:00", holidayOnly: false },
  { id: "ev2", label: "20:30–23:00", short: "20:30", holidayOnly: false },
] as const;

export type SlotTimeId = (typeof SLOT_TIMES)[number]["id"];

/** 2026년 하반기 법정공휴일. 토·일과 같은 시간표로 운영한다. */
const HOLIDAYS = new Set([
  "2026-10-03", // 개천절
  "2026-10-05", // 개천절 대체공휴일
  "2026-10-09", // 한글날
  "2026-12-25", // 성탄절
]);

/** 휴일 시간표(5타임)로 운영하는 날인가 — 토·일 또는 공휴일. */
export function isHolidaySchedule(date: string): boolean {
  return isWeekend(date) || HOLIDAYS.has(date);
}

/** 그 날 실제로 여는 타임. */
export function timesForDate(date: string) {
  const holiday = isHolidaySchedule(date);
  return SLOT_TIMES.filter((t) => holiday || !t.holidayOnly);
}

/* -------------------------------------------------------------------------
 * 3. 예약 슬롯 — 날짜 기준 전역 생성
 *
 *    강사는 두 명뿐이고 여러 대학 구간이 겹친다.
 *    그래서 슬롯은 '대학별'이 아니라 '날짜별'로 만든다.
 *    같은 날짜는 어느 대학 페이지에서 봐도 같은 잔여가 나온다.
 * ---------------------------------------------------------------------- */

export type SlotState =
  /** 예약 확정 */
  | "booked"
  /** 예약자가 1차 결과 대기 중 — 불합격 시 풀리는 자리(누수 대기 접수 가능) */
  | "waitlist"
  /** 지금 바로 예약 가능 */
  | "open";

export type Slot = {
  date: string;
  /** SLOT_TIMES 의 id */
  slotId: SlotTimeId;
  /** "18:00–20:30" */
  time: string;
  teacherId: string;
  teacher: string;
  state: SlotState;
};

export function slotsForDate(date: string): Slot[] {
  const base = timesForDate(date).flatMap((slot) =>
    TEACHERS.map((t) => ({
      date,
      slotId: slot.id as SlotTimeId,
      time: slot.label,
      teacherId: t.id,
      teacher: t.name,
      key: `${slot.id}|${t.id}`,
      rank: hash01(`${date}|${slot.id}|${t.id}`),
    })),
  );

  // 충원율 70~80% 구간에서 날짜별로 결정적으로 정해진다.
  const rate = 0.7 + Math.round(hash01(`fill|${date}`) * 10) / 100;
  const filledCount = Math.round(base.length * rate);
  const filled = new Set(
    [...base].sort((a, b) => a.rank - b.rank).slice(0, filledCount).map((s) => s.key),
  );

  return base.map(({ key, rank: _rank, ...s }) => {
    if (!filled.has(key)) return { ...s, state: "open" as SlotState };
    // 채워진 자리 중 일부는 1차 결과를 기다리는 예약이다.
    const state: SlotState = hash01(`wait|${date}|${key}`) < 0.32 ? "waitlist" : "booked";
    return { ...s, state };
  });
}

/** 그 날 그 타임의 슬롯(강사 수만큼). 열지 않는 타임이면 빈 배열. */
export function slotsAt(date: string, slotId: SlotTimeId): Slot[] {
  return slotsForDate(date).filter((s) => s.slotId === slotId);
}

/** 1차 발표일부터 면접 전날까지 — 실제로 수업을 넣을 수 있는 날. */
export function classDays(announce: string, interview: string): string[] {
  const out: string[] = [];
  for (let d = announce; diffDays(d, interview) > 0; d = addDays(d, 1)) out.push(d);
  return out;
}

export type BookingSummary = {
  total: number;
  booked: number;
  waitlist: number;
  open: number;
  /** 채워진 비율(확정 + 결과대기) — 0~100 정수 */
  rate: number;
};

export function summarize(days: string[]): BookingSummary {
  let total = 0;
  let booked = 0;
  let waitlist = 0;
  for (const d of days) {
    for (const s of slotsForDate(d)) {
      total += 1;
      if (s.state === "booked") booked += 1;
      else if (s.state === "waitlist") waitlist += 1;
    }
  }
  const open = total - booked - waitlist;
  return {
    total,
    booked,
    waitlist,
    open,
    rate: total === 0 ? 0 : Math.round(((booked + waitlist) / total) * 100),
  };
}

/* -------------------------------------------------------------------------
 * 4. 대학별 전형 · 일정
 *    전부 2027학년도 모집요강/입학처 공지 실측값. 출처는 각 대학 sources 에.
 * ---------------------------------------------------------------------- */

export type Track = {
  id: string;
  name: string;
  /** 이 전형의 면접이 MMI(다면·다중 스테이션) 방식인가 */
  mmi: boolean;
  /** 1단계 합격자 발표일. 요강에 확정일이 없으면 null */
  announce: string | null;
  /** announce 가 null 일 때 캘린더가 쓰는 추정 시작일 — 근거를 note 에 반드시 적는다 */
  announceAssumed?: string;
  announceNote?: string;
  /** 면접고사일. 미공지면 null */
  interview: string | null;
  interviewNote?: string;
  multiple?: string;
  weight?: string;
  minimum?: string;
};

export type Univ = {
  slug: string;
  name: string;
  short: string;
  region: string;
  /** core = 전형 전반이 MMI / variant = 일부 스테이션만 MMI 성격 / none = MMI 아님 */
  style: "core" | "variant" | "none";
  styleLabel: string;
  headline: string;
  lede: string;
  /** 면접 방식 — 요강·공지에서 확인된 사실만 */
  format: string[];
  /** 이 대학을 겨냥한 훈련 포인트 */
  drills: string[];
  tracks: Track[];
  notes?: string[];
  sources: { label: string; url: string }[];
};

export const UNIVS: Univ[] = [
  {
    slug: "snu",
    name: "서울대학교 의과대학",
    short: "서울대",
    region: "서울",
    style: "core",
    styleLabel: "MMI · 제시문 다중 스테이션",
    headline: "제시문 여러 개를 약 60분 동안 연속으로",
    lede:
      "국내 의대 면접 중 가장 길고 가장 깊습니다. 제시문이 여러 개 주어지고 스테이션을 옮겨 가며 약 60분이 이어지므로, 한 문항을 잘 푸는 능력보다 60분 내내 논리가 무너지지 않는 지구력이 당락을 가릅니다.",
    format: [
      "제시문 기반 다중미니면접 — 복수의 제시문·상황을 순차로 통과하며 총 약 60분",
      "지역균형: 1단계 서류 100%(3배수) → 2단계 1단계 성적 70% + 면접 30%",
      "일반전형: 1단계 서류 100%(2배수) → 2단계 면접 및 구술고사 100%",
    ],
    drills: [
      "60분 지구력 — 스테이션을 옮겨도 판단 기준이 흔들리지 않도록, 하나의 원칙을 여러 상황에 반복 적용하는 훈련",
      "일반전형은 2단계가 면접 100%다. 1단계 성적이 전혀 반영되지 않으므로 면접 한 번에 전부를 건다는 전제로 모의면접 횟수를 늘린다",
      "제시문 안의 수치·그래프·실험 설계를 빠르게 읽고 근거로 인용하는 연습(박은우 담당)",
      "'모르겠습니다'를 쓰지 않고 아는 범위를 정직하게 경계 짓는 화법",
    ],
    tracks: [
      {
        id: "snu-jiyeok",
        name: "지역균형전형",
        mmi: true,
        announce: "2026-11-27",
        announceNote: "18:00 이후 발표",
        interview: "2026-12-05",
        multiple: "3배수",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
        minimum: "4개 영역 중 3개 등급 합 7 이내",
      },
      {
        id: "snu-ilban",
        name: "일반전형",
        mmi: true,
        announce: "2026-11-20",
        announceNote: "18:00 이후 발표",
        interview: "2026-11-28",
        interviewNote: "의학과·치의학과·수의예과",
        multiple: "2배수",
        weight: "1단계 서류 100 → 2단계 면접 및 구술고사 100",
        minimum: "미적용",
      },
    ],
    sources: [
      { label: "서울대 2027학년도 수시모집 안내", url: "https://admission.snu.ac.kr/webdata/admission/files/2027susi.pdf" },
    ],
  },

  {
    slug: "korea",
    name: "고려대학교 의과대학",
    short: "고려대",
    region: "서울",
    style: "variant",
    styleLabel: "제시문 면접 + 인·적성 MMI 2회",
    headline: "제시문 면접에 인·적성 8분 × 2회가 더 붙는다",
    lede:
      "의과대학 지원자만 제시문 기반 면접 외에 상황제시문 인·적성 면접을 두 번 더 봅니다. 각 8분, 짧습니다. 8분 안에 결론까지 가지 못하면 평가할 내용이 남지 않습니다.",
    format: [
      "제시문 기반 면접(자연계 공통)",
      "의과대학 추가: 상황제시문 기반 인·적성 면접 2회, 각 8분",
      "계열적합전형 1단계 서류 100%(5배수) → 2단계 1단계 60% + 면접 40%",
      "면접 비중 40% — 주요 대학 중 가장 높은 축",
    ],
    drills: [
      "8분 타이머 훈련. 30초 안에 쟁점을 특정하고 6분 안에 결론까지 도달하는 압축 답변",
      "면접 40% 반영이라 1단계 성적 열세를 뒤집을 수 있는 구간. 뒤집기를 전제로 목표치를 잡는다",
      "계열적합전형은 수능 전(11월 8일) 면접이다. 수능 공부와 면접 준비가 정면으로 겹치는 2주를 어떻게 쓸지가 실제 승부처",
      "상황제시문 2회 연속 — 첫 방에서 쓴 논리를 둘째 방에서 반복하지 않도록 관점을 갈아 끼우는 연습",
    ],
    tracks: [
      {
        id: "ku-gyeyeol",
        name: "학생부종합 계열적합전형",
        mmi: true,
        announce: "2026-10-30",
        announceNote: "17:00 발표",
        interview: "2026-11-08",
        interviewNote: "자연계 (인문계는 11월 7일)",
        multiple: "5배수",
        weight: "1단계 서류 100 → 2단계 1단계 60 + 면접 40",
        minimum: "미적용",
      },
    ],
    notes: [
      "학업우수전형은 2027학년도에 면접을 실시하지 않습니다(서류 100% 일괄합산). 수능최저는 4개 영역 등급 합 5 이내, 한국사 4등급 이내.",
    ],
    sources: [
      { label: "고려대 2027학년도 수시 모집요강", url: "https://oku.korea.ac.kr/attach/202609/1788832925216_0.pdf" },
      { label: "베리타스알파 — 2027수시 주요대 면접 일정", url: "https://www.veritas-a.com/news/articleView.html?idxno=616522" },
    ],
  },

  {
    slug: "ulsan",
    name: "울산대학교 의과대학",
    short: "울산대",
    region: "울산 · 서울아산병원",
    style: "core",
    styleLabel: "다대일 다면평가 (MMI)",
    headline: "면접 50% — 2단계에서 면접이 절반이다",
    lede:
      "1단계 성적과 면접이 50:50입니다. 국내 의대 중 면접 비중이 가장 큰 축이라, 서류에서 앞섰다는 이유로 면접 준비를 줄이면 그대로 뒤집힙니다. 학생부와 제시문을 함께 다루며 총 약 30분이 이어집니다.",
    format: [
      "다대일 다면평가 — 면접위원 여러 명이 한 명을 평가",
      "학생부 기반 + 제시문 기반을 함께 다루며 총 약 30분",
      "1단계 서류 100%(5배수) → 2단계 1단계 50% + 면접 50%",
    ],
    drills: [
      "면접 50% — 1단계 순위가 사실상 리셋된다는 전제로 준비량을 잡는다",
      "다대일 구조: 여러 면접위원이 서로 다른 각도로 파고든다. 한 사람을 설득하는 화법이 아니라 여러 관점을 동시에 만족시키는 답변 설계",
      "제출한 생기부에서 나올 질문 30개를 미리 뽑아 각각 40초 답변으로 정리",
      "잠재역량전형(12/5)과 지역인재(11/28)는 면접일이 다르다. 지원 전형에 맞춰 커리큘럼 시작점을 다르게 잡는다",
    ],
    tracks: [
      {
        id: "ulsan-jamjae",
        name: "학생부종합 잠재역량전형",
        mmi: true,
        announce: "2026-11-20",
        announceNote: "16:00 예정",
        interview: "2026-12-05",
        multiple: "5배수",
        weight: "1단계 서류 100 → 2단계 1단계 50 + 면접 50",
        minimum: "3개 영역 등급 합 4 이내, 한국사 4등급",
      },
      {
        id: "ulsan-jiyeok",
        name: "학생부종합 지역인재전형",
        mmi: true,
        announce: "2026-11-20",
        announceNote: "16:00 예정",
        interview: "2026-11-28",
        multiple: "5배수",
        weight: "1단계 서류 100 → 2단계 1단계 50 + 면접 50",
        minimum: "3개 영역 등급 합 4 이내, 한국사 4등급",
      },
    ],
    sources: [
      { label: "울산대 2027학년도 수시모집요강", url: "https://iphak.ulsan.ac.kr/upload/board/2026/06/01/fca3a6f8-16d3-409a-93ec-23c829990b23.pdf" },
    ],
  },

  {
    slug: "hallym",
    name: "한림대학교 의과대학",
    short: "한림대",
    region: "강원 춘천",
    style: "core",
    styleLabel: "MMI · 3개 면접실",
    headline: "인성 · 상황 · 모의상황 세 방, 각 10분",
    lede:
      "방이 세 개로 명확히 나뉘어 있습니다. 방마다 요구하는 게 달라서, 하나의 답변 스타일로 세 방을 통과할 수 없습니다. 방별로 전환하는 훈련이 그대로 점수가 됩니다.",
    format: [
      "3개 면접실 — 인성 / 상황 / 모의상황, 각 10분 내외",
      "1단계 서류 100% → 2단계 1단계 70% + 면접 30%",
      "학교생활우수자 4배수 / 지역의사·지역인재·농어촌 5배수",
    ],
    drills: [
      "방 전환 훈련 — 인성방(가치관) → 상황방(판단) → 모의상황방(연기·대응)으로 모드를 바꾸는 연습을 한 세션에 몰아서",
      "모의상황 면접은 역할극이다. 상대(환자·보호자·동료) 역을 맡은 면접위원에게 실제로 말을 건네는 훈련이 필요하다 — 혼자서는 불가능한 부분",
      "10분 × 3방 = 30분. 방마다 첫 1분에 결론을 세워 두고 남은 시간을 근거로 채우는 배분",
      "1단계 발표(12/3)부터 면접까지 6일. 이 구간은 신규 학습이 아니라 리허설만 돌리는 기간으로 설계한다",
    ],
    tracks: [
      {
        id: "hallym-woosu",
        name: "학생부종합 학교생활우수자전형",
        mmi: true,
        announce: "2026-12-03",
        announceNote: "16:00 발표",
        interview: null,
        interviewNote: "면접일 미공지 — 입학처 추후 공고",
        multiple: "4배수",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
        minimum: "3개 영역 등급 합 4 이내",
      },
      {
        id: "hallym-jiyeok",
        name: "지역의사 · 지역인재 · 농어촌전형",
        mmi: true,
        announce: "2026-12-03",
        announceNote: "16:00 발표",
        interview: "2026-12-09",
        multiple: "5배수",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
        minimum: "3개 영역 등급 합 5 이내",
      },
    ],
    sources: [
      { label: "한림대 2027학년도 수시모집요강", url: "https://www.hallym.ac.kr/bbs/admission/992/230173/download.do" },
    ],
  },

  {
    slug: "keimyung",
    name: "계명대학교 의과대학",
    short: "계명대",
    region: "대구",
    style: "core",
    styleLabel: "MMI · 3개 고사실 (탈락 규정 있음)",
    headline: "면접위원 6명 중 2명이 미흡을 주면 불합격",
    lede:
      "계명대는 면접에 명시적 탈락 규정이 있습니다. 세 고사실 면접위원 6명 중 2명 이상이 미흡(0점)으로 판정하면 총점과 무관하게 떨어집니다. 잘하는 것보다 어느 방에서도 무너지지 않는 것이 먼저입니다.",
    format: [
      "3개 고사실 — 인성 / 상황 / 모의상황, 고사실당 면접위원 2명, 각 10분 내외(총 30분 내외)",
      "면접위원 6명 중 2명 이상이 미흡(0점) 판정 시 불합격",
      "1단계 학생부(또는 서류) 100% → 2단계 1단계 70% + 면접 30%",
      "선발배수가 크다 — 교과 일반 20배수, 학종 10배수, 교과 지역 13배수",
    ],
    drills: [
      "'미흡' 판정을 받지 않는 것이 1순위. 침묵·동문서답·태도 문제를 먼저 제거한 뒤 고득점을 노린다",
      "배수가 20배수까지 가므로 1단계 통과는 넓고 면접에서 대부분이 걸러진다. 사실상 면접 단일 시험으로 보고 준비",
      "전형마다 면접일이 11/21 · 11/22 · 11/28 · 11/29 · 12/5로 흩어져 있다. 복수지원 시 같은 날 전형은 지원 불가이므로 일정부터 확정하고 수업을 설계한다",
      "모의상황 방 대비 — 상대역을 둔 롤플레이를 반복(강정규 담당)",
    ],
    tracks: [
      {
        id: "km-gyogwa-ilban",
        name: "학생부교과 일반전형",
        mmi: true,
        announce: "2026-11-14",
        announceNote: "예정",
        interview: "2026-11-21",
        multiple: "20배수",
        weight: "1단계 학생부 100 → 2단계 1단계 70 + 면접 30",
        minimum: "3개 영역 등급 합 3 이내(수학 포함)",
      },
      {
        id: "km-gyogwa-gihoe",
        name: "학생부교과 지역기회균형전형",
        mmi: true,
        announce: "2026-11-14",
        announceNote: "예정",
        interview: "2026-11-21",
        multiple: "10배수",
        weight: "1단계 학생부 100 → 2단계 1단계 70 + 면접 30",
        minimum: "3개 영역 등급 합 5 이내(수학 포함)",
      },
      {
        id: "km-gyogwa-jiyeok",
        name: "학생부교과 지역전형",
        mmi: true,
        announce: "2026-11-14",
        announceNote: "예정",
        interview: "2026-11-22",
        multiple: "13배수",
        weight: "1단계 학생부 100 → 2단계 1단계 70 + 면접 30",
        minimum: "3개 영역 등급 합 4 이내(수학 포함)",
      },
      {
        id: "km-jonghap-ilban",
        name: "학생부종합 일반 · 지역의사진료전형",
        mmi: true,
        announce: "2026-11-14",
        announceNote: "예정",
        interview: "2026-11-28",
        multiple: "10배수",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
        minimum: "일반 3개 합 4 / 지역의사진료 3개 합 5 이내",
      },
      {
        id: "km-jonghap-jiyeok",
        name: "학생부종합 지역전형",
        mmi: true,
        announce: "2026-11-14",
        announceNote: "예정",
        interview: "2026-11-29",
        multiple: "10배수",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
        minimum: "3개 영역 등급 합 4 이내(수학 포함)",
      },
      {
        id: "km-gwangyeok",
        name: "학생부교과 지역의사광역전형",
        mmi: true,
        announce: "2026-11-14",
        announceNote: "예정",
        interview: "2026-12-05",
        multiple: "20배수",
        weight: "1단계 학생부 100 → 2단계 1단계 70 + 면접 30",
        minimum: "3개 영역 등급 합 4 이내(수학 포함)",
      },
    ],
    notes: [
      "면접일이 같은 전형끼리는 복수지원이 불가합니다(일반 ↔ 지역기회균형, 교과 면접 ↔ 지역의사광역, 학종 일반 ↔ 지역의사진료).",
      "수학은 미적분 또는 기하, 과탐 2과목 응시가 필수입니다.",
    ],
    sources: [
      { label: "계명대 입학처 — 2027학년도 수시모집 전형 일정 안내", url: "https://www.gokmu.ac.kr/guide/board.htm?bbsid=notice&mode=view&bltn_seq=85886&etc1=common" },
    ],
  },

  {
    slug: "inje",
    name: "인제대학교 의과대학",
    short: "인제대",
    region: "부산 · 김해",
    style: "core",
    styleLabel: "MMI · 전 전형 적용 (문항 비공개)",
    headline: "의예과 전 전형이 MMI, 그런데 문항은 공개되지 않는다",
    lede:
      "인제대는 의예과 지원자라면 어느 전형이든 MMI를 봅니다. 기출 문항카드를 공개하지 않기 때문에 '무엇이 나오는지' 대신 '어떤 유형이든 대응하는 틀'을 만드는 쪽으로 준비 방향이 완전히 달라집니다.",
    format: [
      "의예과 전 전형 MMI — 상황판단·자기성찰 중심",
      "문항카드·채점기준 미공개",
      "1단계 학생부교과 100%(5배수) → 2단계 1단계 80% + 면접 20%(실질 67.5 : 32.5)",
      "의예과 면접은 부산캠퍼스에서 실시",
    ],
    drills: [
      "문항 비공개 대학이라 기출 암기가 통하지 않는다. 상황판단 문제를 유형이 아니라 '판단 기준'으로 분류해 두는 훈련",
      "자기성찰형 문항 — 실패·갈등 경험을 미화하지 않고 배운 점까지 40초로 정리하는 레퍼토리 5개 확보",
      "1단계 발표(11/4)가 이르다. 면접까지 17~31일이 열려 있으므로 이 구간을 가장 길게 쓸 수 있는 대학",
      "명목 20%지만 실질 반영은 32.5%. 교과 성적 차이를 면접으로 좁힐 수 있는 폭이 생각보다 크다",
    ],
    tracks: [
      {
        id: "inje-uiye",
        name: "의예·약학전형 (학생부교과)",
        mmi: true,
        announce: "2026-11-04",
        announceNote: "14:00 · 면접 장소·시간 동시 공지",
        interview: "2026-11-21",
        multiple: "5배수",
        weight: "1단계 교과 100 → 2단계 1단계 80 + 면접 20 (실질 67.5 : 32.5)",
        minimum: "국·수(미적/기하)·영·과탐(1) 4개 영역 각 2등급 이내",
      },
      {
        id: "inje-jiyeok1",
        name: "지역인재Ⅰ전형",
        mmi: true,
        announce: "2026-11-04",
        announceNote: "14:00 발표",
        interview: "2026-11-28",
        multiple: "5배수",
        weight: "1단계 교과 100 → 2단계 1단계 80 + 면접 20",
        minimum: "4개 영역 각 2등급 이내",
      },
      {
        id: "inje-jiyeokuisa",
        name: "지역의사전형 (신설)",
        mmi: true,
        announce: "2026-11-04",
        announceNote: "14:00 발표",
        interview: "2026-12-05",
        multiple: "5배수",
        weight: "1단계 교과 100 → 2단계 1단계 80 + 면접 20",
        minimum: "4개 영역 각 2등급 이내",
      },
    ],
    notes: [
      "의예과·약학과는 3학년 1학기까지 과학교과 20단위 이상 이수자만 지원할 수 있습니다(검정고시 제외).",
    ],
    sources: [
      { label: "인제대 입학처 — 전형일정", url: "https://iphak.inje.ac.kr/contents/contents.asp?m=1&m2=4&m3=4" },
    ],
  },

  {
    slug: "daegu-catholic",
    name: "대구가톨릭대학교 의과대학",
    short: "대구가톨릭대",
    region: "대구",
    style: "core",
    styleLabel: "다면인적성면접 (MMI)",
    headline: "1단계 발표가 면접 2~3일 전 — 준비 기간이 가장 짧다",
    lede:
      "요강에 1단계 발표 확정일이 없습니다. '면접 2~3일 전 발표 예정'으로만 적혀 있어, 발표를 보고 수업을 잡으면 이미 늦습니다. 지원 단계에서 자리를 미리 확보해 두는 것 말고는 방법이 없는 대학입니다.",
    format: [
      "다면인적성면접(MMI) 방식 — 제시문 공개",
      "1단계 학생부(또는 서류) 100% → 2단계 1단계 80% + 면접 20%",
      "교과전형 10배수 / 지역교과·지역의사·지역기회균형·지역종합 7배수",
      "의예과 면접 장소는 루가캠퍼스(대구 대명동)",
    ],
    drills: [
      "발표~면접이 2~3일뿐이다. 발표 전에 기본기를 끝내 두고, 발표 후에는 리허설만 돌리는 역순 설계가 사실상 유일한 방법",
      "선발배수가 7~10배수로 넓다 → 면접에서 대부분이 결정된다",
      "2027학년도에 지역교과·지역기회균형·지역종합 배수가 10배수에서 7배수로 축소됐다. 1단계 통과 자체가 작년보다 좁아진 점을 전제로 준비",
      "제시문이 공개되는 방식이므로 읽고 즉시 구조화하는 속도를 집중 훈련(박은우 담당)",
    ],
    tracks: [
      {
        id: "dgcu-gyogwa",
        name: "학생부교과 교과 · 지역교과 · 지역의사(광역) · 지역기회균형",
        mmi: true,
        announce: null,
        announceAssumed: "2026-11-18",
        announceNote: "요강에 확정일 없음 — '면접 2~3일 전 발표 예정'. 캘린더는 11/18을 예정일로 표시",
        interview: "2026-11-21",
        multiple: "교과 10배수 / 그 외 7배수",
        weight: "1단계 학생부 100 → 2단계 1단계 80 + 면접 20",
        minimum: "3개 영역 등급 합 4 이내(수학 반영 필수)",
      },
      {
        id: "dgcu-jonghap",
        name: "학생부종합 지역종합 · 지역의사(진료권)",
        mmi: true,
        announce: null,
        announceAssumed: "2026-11-19",
        announceNote: "요강에 확정일 없음 — '면접 2~3일 전 발표 예정'. 캘린더는 11/19를 예정일로 표시",
        interview: "2026-11-22",
        multiple: "7배수",
        weight: "1단계 서류 100 → 2단계 1단계 80 + 면접 20",
        minimum: "3개 영역 등급 합 5 이내",
      },
    ],
    notes: [
      "수능최저 공통 — 수학은 미적분 또는 기하, 탐구는 과탐 2과목 응시 및 2과목 평균 반영(소수점 절사), 한국사 응시 필수.",
      "1단계 발표 확정일은 입학처 홈페이지 공지로 나옵니다. 공지되는 대로 이 페이지도 갱신합니다.",
    ],
    sources: [
      { label: "대구가톨릭대 2027학년도 수시모집요강", url: "https://ibsi.cu.ac.kr/kor/susi/doctrine/view.do" },
    ],
  },

  {
    slug: "konyang",
    name: "건양대학교 의과대학",
    short: "건양대",
    region: "대전 · 충남 논산",
    style: "core",
    styleLabel: "다수 면접실 운영 (MMI형)",
    headline: "10월부터 12월까지, 전형마다 시기가 완전히 다르다",
    lede:
      "건양대는 면접 일정이 10월 17일부터 12월 12일까지 두 달 가까이 흩어져 있습니다. 지역[면접]전형은 수능 한참 전에 끝나고, 지역[기초]·농어촌은 수능이 끝난 뒤입니다. 지원 전형에 따라 준비 시기가 통째로 달라집니다.",
    format: [
      "면접준비실에서 자료를 읽은 뒤 다수의 면접실을 통과하는 방식(MMI형)",
      "면접실당 면접위원 2~3명 / 인성 30% + 발전가능성 30% + 전공적합성 40%",
      "지역의사전형은 생활기록부 기반 면접",
      "교과 계열 1단계 80% + 면접 20%(실질 61.5 : 38.5) / 지역의사 1단계 70% + 면접 30%",
    ],
    drills: [
      "지역[면접]전형은 10월 17일 면접이다. 수능 전 가장 이른 축 — 9월 원서 직후부터 준비를 시작해야 맞는다",
      "실질 반영비율이 38.5%다. 명목 20%만 보고 준비량을 줄이면 손해가 크다",
      "면접준비실에서 자료를 읽는 시간이 주어지는 구조 — 읽기 시간에 답변 골격까지 완성하는 메모법 훈련",
      "지역의사전형은 생기부 기반이다. 제출 서류에서 나올 질문을 먼저 소진시키는 준비가 우선",
    ],
    tracks: [
      {
        id: "ky-jiyeok-myeonjeop",
        name: "학생부교과 지역[면접]전형",
        mmi: true,
        announce: "2026-10-12",
        announceNote: "16:00 발표",
        interview: "2026-10-17",
        interviewNote: "메디컬캠퍼스",
        multiple: "3배수",
        weight: "1단계 교과 100 → 2단계 1단계 80 + 면접 20 (실질 61.5 : 38.5)",
        minimum: "미적용",
      },
      {
        id: "ky-jiyeokuisa",
        name: "학생부종합 지역의사전형",
        mmi: true,
        announce: "2026-11-13",
        announceNote: "16:00 발표",
        interview: "2026-11-28",
        interviewNote: "오전·오후 분할 실시",
        multiple: "5배수",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30 (실질 82.71 : 17.29)",
        minimum: "국·수·영·과탐(2과목 평균) 중 3과목 합 6등급",
      },
      {
        id: "ky-gicho",
        name: "학생부교과 지역[기초] · 농어촌학생[면접]전형",
        mmi: true,
        announce: "2026-12-11",
        announceNote: "16:00 발표 (요강 내 16:00·17:00 표기가 달라 대학 확인 필요)",
        interview: "2026-12-12",
        multiple: "5배수 (수능최저 통과자 대상)",
        weight: "1단계 교과 100 → 2단계 1단계 80 + 면접 20 (실질 61.5 : 38.5)",
        minimum: "지역[기초] 3과목 합 7 / 농어촌 3개 영역 합 6",
      },
    ],
    notes: [
      "일반[최저]·지역[최저]전형은 면접 없이 학생부교과 100% 일괄 선발입니다.",
    ],
    sources: [
      { label: "건양대 입학처 — 2027학년도 수시 모집요강", url: "https://ipsi.konyang.ac.kr/prog/info/ipsi/sub01_01/susi/list.do" },
    ],
  },

  {
    slug: "kangwon",
    name: "강원대학교 의과대학",
    short: "강원대",
    region: "강원 춘천",
    style: "none",
    styleLabel: "2027부터 MMI 폐지 · 학생부 기반 확인면접",
    headline: "2027학년도부터 MMI가 사라졌다",
    lede:
      "가장 큰 변화가 있는 대학입니다. 2026학년도까지 학생부기반 1개 + 제시문기반 2개 면접실로 운영하던 MMI가 2027학년도에는 학생부 기반 확인 면접 1개 면접실로 바뀌었습니다. 작년 기출과 작년 커리큘럼이 그대로는 통하지 않습니다.",
    format: [
      "학생부 기반 확인 면접 — 1개 면접실 (2026학년도 MMI 3개 면접실에서 변경)",
      "1단계 서류 100%(120점) → 2단계 서류 60% + 면접 40%(200점)",
      "미래인재면접 4배수 이내 / 지역인재면접 3배수 이내",
      "면접고사장·면접시간은 1단계 발표일(11/20)에 함께 공고",
    ],
    drills: [
      "제시문 훈련보다 생기부 검증 대비로 무게중심을 옮긴다 — 2027 변경의 핵심",
      "면접 40% 반영. 방은 하나뿐이지만 비중은 크다. 한 방에서 모든 걸 보여 줘야 한다",
      "'이 활동 실제로 본인이 했는가'를 확인하는 성격의 면접이다. 활동의 동기·과정·한계를 스스로 설명할 수 있는지 점검",
      "지역인재면접은 수능최저(3개 합 7)가 붙는다. 면접 준비와 최저 확보를 함께 관리",
    ],
    tracks: [
      {
        id: "kw-mirae",
        name: "학생부종합 미래인재면접전형",
        mmi: false,
        announce: "2026-11-20",
        announceNote: "15:00 발표 · 면접 장소·시간 동시 공고",
        interview: "2026-11-27",
        multiple: "4배수 이내 (모집 5명)",
        weight: "1단계 서류 100 → 2단계 서류 60 + 면접 40",
        minimum: "미적용",
      },
      {
        id: "kw-jiyeok",
        name: "학생부종합 지역인재면접전형",
        mmi: false,
        announce: "2026-11-20",
        announceNote: "15:00 발표",
        interview: "2026-11-28",
        multiple: "3배수 이내 (모집 15명)",
        weight: "1단계 서류 100 → 2단계 서류 60 + 면접 40",
        minimum: "국·수·영·과탐(1) 중 3개 합 7 이내 (수학·과탐 필수반영)",
      },
    ],
    notes: [
      "학생부교과 지역의사선발전형(신설)과 지역교과전형은 면접 없이 교과 100% 일괄 선발입니다.",
      "2027학년도 의예과 일반교과전형 선발은 없습니다.",
    ],
    sources: [
      { label: "강원대 입학처 — 2027학년도 수시모집요강", url: "https://admission.kangwon.ac.kr/admission/conts/1120/web.do" },
      { label: "강원대 입학처 — 대학별고사 일정 안내", url: "https://admission.kangwon.ac.kr/admission/bbs/1147/detail.do?pstSn=2166" },
    ],
  },

  {
    slug: "catholic",
    name: "가톨릭대학교 의과대학",
    short: "가톨릭대",
    region: "서울",
    style: "core",
    styleLabel: "인·적성면접 (전형별 10분 / 20분)",
    headline: "같은 대학인데 전형에 따라 면접 길이가 두 배 차이",
    lede:
      "지역균형은 10분 내외, 학교장추천·가톨릭지도자추천은 20분 내외입니다. 20분 쪽이 다면(MMI) 구성입니다. 10분짜리를 준비하던 감각으로 20분에 들어가면 중반부터 할 말이 없어집니다.",
    format: [
      "지역균형: 인·적성면접 10분 내외",
      "학교장추천 · 가톨릭지도자추천: 인·적성면접 20분 내외 (다면 구성)",
      "가톨릭대는 의료윤리·소명 의식을 묻는 문항 비중이 전통적으로 높은 편",
    ],
    drills: [
      "10분형과 20분형은 다른 시험이다. 지원 전형에 맞춰 답변 길이 자체를 다르게 훈련한다",
      "20분형 대비 — 한 주제로 5분 이상 밀도 있게 끌고 가는 훈련. 초반에 결론을 다 써 버리면 중반이 빈다",
      "의료윤리 쟁점(자율성·선의·정의·해악금지)을 사례에 적용하는 연습. 용어를 외우는 게 아니라 사례로 설명할 수 있어야 한다",
      "1단계 발표 확정일이 아직 없다. 면접일(11/28 · 12/5)에서 역산해 미리 자리를 잡아 두는 편이 안전하다",
    ],
    tracks: [
      {
        id: "cath-jiyeok",
        name: "지역균형전형",
        mmi: false,
        announce: null,
        announceAssumed: "2026-11-18",
        announceNote: "1단계 발표 확정일 미공지 — 캘린더는 면접 10일 전을 예정 구간으로 표시",
        interview: "2026-11-28",
        interviewNote: "인·적성면접 10분 내외",
      },
      {
        id: "cath-chucheon",
        name: "학교장추천 · 가톨릭지도자추천전형",
        mmi: true,
        announce: null,
        announceAssumed: "2026-11-25",
        announceNote: "1단계 발표 확정일 미공지 — 캘린더는 면접 10일 전을 예정 구간으로 표시",
        interview: "2026-12-05",
        interviewNote: "08:30 시작 · 인·적성면접 20분 내외",
      },
    ],
    sources: [
      { label: "베리타스알파 — 가톨릭대 2027수시 대학별고사 시간 공개", url: "https://www.veritas-a.com/news/articleView.html?idxno=626311" },
    ],
  },

  {
    slug: "skku",
    name: "성균관대학교 의과대학",
    short: "성균관대",
    region: "서울 · 삼성서울병원",
    style: "variant",
    styleLabel: "학생부종합 면접 (다면 구성)",
    headline: "발표부터 면접까지 5일 — 가장 짧은 구간 중 하나",
    lede:
      "12월 1일 발표, 12월 6일 오전 면접입니다. 사이에 주말 하나가 끼어 있을 뿐입니다. 이 5일에 새로 배울 수 있는 건 없습니다. 발표 전에 끝내 두고, 이 구간은 리허설로만 씁니다.",
    format: [
      "1단계 서류 100%(6배수 내외) → 2단계 1단계 70% + 면접 30%",
      "면접은 12월 6일 오전 실시",
      "성균인재(학과모집) · 성균인재 지역인재 모두 같은 날",
    ],
    drills: [
      "5일 구간. 발표 전에 기본기를 끝내고 발표 후에는 실전 리허설만 돌리는 2단계 설계",
      "6배수 내외 — 1단계 통과 인원이 적어 지원자 수준이 고르게 높다. 감점 요소 제거가 가산점보다 먼저",
      "면접 30% 반영. 1단계 성적이 앞선다면 지키는 면접, 뒤졌다면 뒤집는 면접으로 목표를 다르게 잡는다",
      "오전 면접이다. 전날 늦게까지 준비하는 패턴을 면접 1주일 전부터 바꾼다",
    ],
    tracks: [
      {
        id: "skku-seonggyun",
        name: "학생부종합 성균인재(학과모집) 의예",
        mmi: false,
        announce: "2026-12-01",
        interview: "2026-12-06",
        interviewNote: "오전 실시",
        multiple: "6배수 내외",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
      },
      {
        id: "skku-jiyeok",
        name: "학생부종합 성균인재 지역인재 의예",
        mmi: false,
        announce: "2026-12-01",
        interview: "2026-12-06",
        interviewNote: "오전 실시",
        multiple: "6배수 내외",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
      },
    ],
    sources: [
      { label: "베리타스알파 — 성균관대 2027수시 실기/면접 일정", url: "https://www.veritas-a.com/news/articleView.html?idxno=626388" },
    ],
  },

  {
    slug: "cau",
    name: "중앙대학교 의과대학",
    short: "중앙대",
    region: "서울",
    style: "variant",
    styleLabel: "학생부종합 면접",
    headline: "발표 11월 26일, 면접 12월 6일 — 열흘",
    lede:
      "융합형 의학부는 12월 6일, 탐구형·성장형은 12월 5~6일에 면접이 걸려 있습니다. 발표부터 열흘, 주말 두 번이 들어 있어 실제로 쓸 수 있는 시간은 생각보다 넉넉합니다.",
    format: [
      "1단계 발표 11월 26일 14:00 (전 전형 공통)",
      "융합형 의학부 면접 12월 6일",
      "탐구형 · 성장형 면접 12월 5~6일",
    ],
    drills: [
      "열흘 구간 + 주말 두 번. 주말에 실전 모의면접을 2회 이상 배치할 수 있는 드문 일정",
      "면접 유형 세부가 요강 외 공개 자료로 충분히 확인되지 않는 대학이다. 생기부 기반 + 상황 문항을 함께 대비하는 폭넓은 준비가 안전하다",
      "12월 5일·6일이 다른 대학(서울대 지역균형·성균관대·울산대·한양대)과 겹친다. 복수 합격 시 이동 동선까지 미리 확인",
    ],
    tracks: [
      {
        id: "cau-yunghap",
        name: "학생부종합 융합형 (의학부)",
        mmi: false,
        announce: "2026-11-26",
        announceNote: "14:00 발표",
        interview: "2026-12-06",
      },
      {
        id: "cau-tamgu",
        name: "학생부종합 탐구형 · 성장형",
        mmi: false,
        announce: "2026-11-26",
        announceNote: "14:00 발표",
        interview: "2026-12-05",
        interviewNote: "12월 5일~6일 실시",
      },
    ],
    sources: [
      { label: "베리타스알파 — 2027수시 주요22개대 면접 일정", url: "https://www.veritas-a.com/news/articleView.html?idxno=616522" },
    ],
  },

  {
    slug: "yonsei",
    name: "연세대학교 의과대학",
    short: "연세대",
    region: "서울",
    style: "none",
    styleLabel: "제시문 기반 면접 (MMI 아님)",
    headline: "MMI가 아니라 제시문 면접 — 준비 방향이 다르다",
    lede:
      "연세대는 스테이션을 도는 MMI가 아니라 제시문 기반 면접입니다. 짧은 상황 판단을 여러 번 하는 훈련보다, 하나의 제시문을 깊게 읽고 길게 논증하는 훈련이 맞습니다.",
    format: [
      "제시문 기반 면접 (자연계)",
      "1단계 발표 11월 16일 → 면접 11월 22일",
      "활동우수형 의예과",
    ],
    drills: [
      "MMI 커리큘럼을 그대로 쓰면 안 된다. 제시문 독해 → 논지 구성 → 반론 대응의 긴 호흡 훈련",
      "제시문 안의 논리적 허점을 스스로 찾아 지적하는 연습 — 추가 질문의 상당수가 여기서 나온다",
      "발표 11/16 → 면접 11/22, 6일. 수능(11/19) 직후 구간이라 체력 관리가 준비량만큼 중요하다",
    ],
    tracks: [
      {
        id: "yonsei-hwaldong",
        name: "학생부종합 활동우수형 의예",
        mmi: false,
        announce: "2026-11-16",
        interview: "2026-11-22",
        interviewNote: "자연계",
      },
    ],
    sources: [
      { label: "베리타스알파 — 연세대 2027수시 면접일정 공개", url: "https://www.veritas-a.com/news/articleView.html?idxno=625556" },
    ],
  },

  {
    slug: "hanyang",
    name: "한양대학교 의과대학",
    short: "한양대",
    region: "서울",
    style: "none",
    styleLabel: "학생부 기반 인성면접 (2027 신설)",
    headline: "2027부터 의예과 전원을 면접으로 뽑는다",
    lede:
      "서류 100%로 뽑던 의예과가 2027학년도부터 면접형으로 전환됐습니다. 16명 전원이 면접을 봅니다. 전년도 기출도, 선배들의 후기도 없는 첫 해입니다.",
    format: [
      "학생부 기반 인성면접 — 면접관 2명 : 학생 1명 (MMI 아님)",
      "1단계 서류 100%(약 7배수) → 2단계 서류 70% + 면접 30%",
      "수능최저 미적용",
      "2027학년도 신설 — 의예과 16명 전원 면접형 선발",
    ],
    drills: [
      "첫 해 전형이다. 기출이 없으므로 학생부 기반 인성면접의 표준 문항군으로 폭넓게 대비한다",
      "수능최저가 없다 → 수능 부담이 적은 대신 면접 30%가 실질 변별의 거의 전부가 된다",
      "발표 11/13 → 면접 12/5, 22일. 이번 시즌 대학 중 준비 기간이 가장 길다. 기본기부터 쌓을 수 있는 유일한 구간",
      "면접관 2 : 학생 1 구조 — 두 면접관이 번갈아 파고드는 흐름에 익숙해지는 훈련",
    ],
    tracks: [
      {
        id: "hy-myeonjeop",
        name: "학생부종합 면접형 의예 (2027 신설)",
        mmi: false,
        announce: "2026-11-13",
        interview: "2026-12-05",
        multiple: "약 7배수",
        weight: "1단계 서류 100 → 2단계 서류 70 + 면접 30",
        minimum: "미적용",
      },
    ],
    sources: [
      { label: "한국경제 — 한양대, 서류 100%로 뽑던 의예과 면접형으로 선발", url: "https://www.hankyung.com/article/2026083014001" },
    ],
  },

  {
    slug: "ajou",
    name: "아주대학교 의과대학",
    short: "아주대",
    region: "경기 수원",
    style: "variant",
    styleLabel: "학생부종합 면접",
    headline: "12월 13일 — 이번 시즌 가장 늦은 면접",
    lede:
      "지역의사선발전형 면접이 12월 13일입니다. 다른 의대 면접이 대부분 끝난 뒤라, 앞선 대학에서 얻은 실전 경험을 그대로 얹을 수 있는 유일한 자리이기도 합니다.",
    format: [
      "1단계 서류 100%(3배수) → 2단계 1단계 70% + 면접 30%",
      "의학과·약학과 면접 12월 13일",
      "수능최저 등급 합 6 이내",
    ],
    drills: [
      "3배수. 이번 시즌 의대 중 가장 좁은 축이다 — 1단계를 통과했다면 합격 확률이 이미 상당히 높다는 뜻이고, 그만큼 면접에서 잃지 않는 게 중요하다",
      "12/13은 다른 의대 면접이 끝난 뒤다. 앞선 면접의 실패 지점을 복기해 그대로 교정하는 세션을 마지막에 배치",
      "1단계 발표 확정일이 아직 공개되지 않았다. 면접일에서 역산해 미리 자리를 확보해 두는 편이 안전하다",
    ],
    tracks: [
      {
        id: "ajou-jiyeokuisa",
        name: "학생부종합 지역의사선발전형 (의학과)",
        mmi: false,
        announce: null,
        announceAssumed: "2026-12-03",
        announceNote: "1단계 발표 확정일 미공지 — 캘린더는 면접 10일 전을 예정 구간으로 표시",
        interview: "2026-12-13",
        interviewNote: "의학과·약학과",
        multiple: "3배수",
        weight: "1단계 서류 100 → 2단계 1단계 70 + 면접 30",
        minimum: "등급 합 6 이내",
      },
    ],
    sources: [
      { label: "주간한국 — 大入수시전략2027 아주대", url: "https://weekly.hankooki.com/news/articleView.html?idxno=7179894" },
    ],
  },
];

/* -------------------------------------------------------------------------
 * 5. 조회 헬퍼
 * ---------------------------------------------------------------------- */

export function getUniv(slug: string): Univ | undefined {
  return UNIVS.find((u) => u.slug === slug);
}

/** 캘린더가 실제로 쓰는 시작일. 확정 발표일이 없으면 추정일, 그것도 없으면 면접 7일 전. */
export function trackStart(t: Track): string | null {
  if (!t.interview) return null;
  return t.announce ?? t.announceAssumed ?? addDays(t.interview, -7);
}

/** 이 전형에서 수업이 가능한 날(발표일 ~ 면접 전날). */
export function trackDays(t: Track): string[] {
  const start = trackStart(t);
  if (!start || !t.interview) return [];
  return classDays(start, t.interview);
}

/** 대학 전체 수업 가능일 — 전형별 구간의 합집합, 오름차순.
 *  이 대학의 '어느' 면접일이든 그 날은 제외한다. 다른 전형의 수업 구간에 걸치더라도
 *  캘린더가 그 칸을 면접일로 칠하기 때문에, 예약표와 캘린더가 어긋나면 안 된다. */
export function univDays(u: Univ): string[] {
  const interviews = new Set(u.tracks.map((t) => t.interview).filter(Boolean));
  const set = new Set<string>();
  for (const t of u.tracks) for (const d of trackDays(t)) if (!interviews.has(d)) set.add(d);
  return [...set].sort();
}

/** 대학 캘린더가 덮어야 하는 전체 구간. 수업 가능일이 없으면 null. */
export function univRange(u: Univ): { start: string; end: string } | null {
  const days = univDays(u);
  const interviews = u.tracks.map((t) => t.interview).filter((v): v is string => Boolean(v));
  if (days.length === 0 || interviews.length === 0) return null;
  return { start: days[0], end: interviews.sort()[interviews.length - 1] };
}

/** 이 날짜에 면접이 있는 전형들. */
export function interviewsOn(u: Univ, date: string): Track[] {
  return u.tracks.filter((t) => t.interview === date);
}

/** 이 날짜에 1단계 발표가 있는 전형들(추정일 포함). */
export function announcesOn(u: Univ, date: string): Track[] {
  return u.tracks.filter((t) => (t.announce ?? t.announceAssumed) === date);
}

/** 가장 짧은 준비 구간(일). 마케팅 문구가 아니라 계산값이다. */
export function shortestWindow(u: Univ): number | null {
  const spans = u.tracks
    .map((t) => {
      const s = trackStart(t);
      return s && t.interview ? diffDays(s, t.interview) : null;
    })
    .filter((v): v is number => v !== null);
  return spans.length ? Math.min(...spans) : null;
}
