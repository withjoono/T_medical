import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock, UserRound } from "lucide-react";
import {
  type Track,
  type Univ,
  TEACHERS,
  addDays,
  announcesOn,
  diffDays,
  dow,
  formatKo,
  interviewsOn,
  isHolidaySchedule,
  SLOT_TIMES,
  slotsAt,
  slotsForDate,
  summarize,
  toDate,
  trackStart,
  univDays,
  univRange,
} from "@/lib/mmi-schedule";

/** =========================================================================
 *  /mmi 전용 블록.
 *  전부 서버 컴포넌트다 — 숫자가 HTML 에 그대로 박혀야 검색엔진이 읽는다.
 *  (예약 현황은 lib/mmi-schedule.ts 의 결정적 해시로 만들어지므로
 *   클라이언트 상태가 필요 없다)
 *  ========================================================================= */

const DOW_HEAD = ["일", "월", "화", "수", "목", "금", "토"];

/* -------------------------------------------------------------------------
 * 배지 · 작은 조각
 * ---------------------------------------------------------------------- */

export function StyleBadge({ univ }: { univ: Univ }) {
  const tone =
    univ.style === "core"
      ? "border-jade-600 bg-jade-50 text-jade-700"
      : univ.style === "variant"
        ? "border-brass-400 bg-brass-50 text-brass-600"
        : "border-hair-strong bg-paper-100 text-ink-500";
  return (
    <span className={`inline-flex items-center border px-3 py-1 text-[11px] font-semibold tracking-tight ${tone}`}>
      {univ.styleLabel}
    </span>
  );
}

function Stat({ label, value, unit, tone = "default" }: { label: string; value: string; unit?: string; tone?: "default" | "accent" }) {
  return (
    <div className="border-b border-r border-hair px-6 py-7">
      <p className="eyebrow text-brass-600">{label}</p>
      <p className={`display tnum mt-3 text-[2rem] leading-none ${tone === "accent" ? "text-jade-700" : "text-ink-900"}`}>
        {value}
        {unit && <span className="ml-1.5 align-middle text-sm font-light text-ink-400">{unit}</span>}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 전형별 일정표
 * ---------------------------------------------------------------------- */

export function TrackTable({ univ }: { univ: Univ }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div role="region" aria-label="대학별 전형 일정표" tabIndex={0} className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              {["전형", "면접 방식", "1단계 발표", "면접일", "준비 기간", "선발배수 · 반영비율", "수능최저"].map((h, i) => (
                <th key={h} className={`px-4 py-4 text-[12px] font-semibold tracking-tight ${i > 0 ? "border-l border-white/10" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {univ.tracks.map((t, ri) => {
              const start = trackStart(t);
              const span = start && t.interview ? diffDays(start, t.interview) : null;
              const estimated = !t.announce && Boolean(t.announceAssumed ?? t.interview);
              return (
                <tr key={t.id} className={ri % 2 === 1 ? "bg-paper-100/60" : ""}>
                  <td className="border-t border-hair px-4 py-4 align-top">
                    <span className="font-semibold tracking-tight text-ink-900">{t.name}</span>
                    {t.mmi && (
                      <span className="ml-2 inline-block border border-jade-200 bg-jade-50 px-1.5 py-0.5 text-[10px] font-semibold text-jade-700">
                        MMI
                      </span>
                    )}
                  </td>
                  <td className="border-l border-t border-hair px-4 py-4 align-top text-[13px] font-light text-ink-600">
                    {t.interviewNote ?? (t.mmi ? "다면 스테이션" : "개별 면접")}
                  </td>
                  <td className="tnum border-l border-t border-hair px-4 py-4 align-top text-[13px] text-ink-700">
                    {t.announce ? (
                      formatKo(t.announce)
                    ) : (
                      <span className="text-ink-400">
                        미공지
                        {t.announceAssumed && <span className="block text-[11px]">({formatKo(t.announceAssumed)} 예정)</span>}
                      </span>
                    )}
                    {t.announceNote && <span className="mt-1 block text-[11px] font-light text-ink-400">{t.announceNote}</span>}
                  </td>
                  <td className="tnum border-l border-t border-hair px-4 py-4 align-top text-[13px] font-semibold text-ink-900">
                    {t.interview ? formatKo(t.interview) : <span className="font-normal text-ink-400">미공지</span>}
                  </td>
                  <td className="tnum border-l border-t border-hair px-4 py-4 align-top">
                    {span !== null ? (
                      <span className={`display text-[1.25rem] ${span <= 6 ? "text-brass-600" : "text-ink-900"}`}>
                        {span}
                        <span className="ml-1 text-[11px] font-light text-ink-400">일</span>
                        {estimated && <span className="ml-1 text-[10px] font-light text-ink-400">(예정)</span>}
                      </span>
                    ) : (
                      <span className="text-[13px] text-ink-400">—</span>
                    )}
                  </td>
                  <td className="border-l border-t border-hair px-4 py-4 align-top text-[13px] font-light leading-[1.7] text-ink-600">
                    {t.multiple && <span className="block font-medium text-ink-700">{t.multiple}</span>}
                    {t.weight ?? "—"}
                  </td>
                  <td className="border-l border-t border-hair px-4 py-4 align-top text-[13px] font-light leading-[1.7] text-ink-600">
                    {t.minimum ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-xs font-light text-ink-400">
        준비 기간 = 1단계 발표일부터 면접 전날까지 실제로 수업을 넣을 수 있는 날수.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 캘린더 — 1단계 발표일과 면접일 사이를 월 그리드로
 * ---------------------------------------------------------------------- */

function monthsBetween(start: string, end: string): { year: number; month: number }[] {
  const out: { year: number; month: number }[] = [];
  const s = toDate(start);
  const e = toDate(end);
  let y = s.getUTCFullYear();
  let m = s.getUTCMonth();
  while (y < e.getUTCFullYear() || (y === e.getUTCFullYear() && m <= e.getUTCMonth())) {
    out.push({ year: y, month: m });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return out;
}

function Legend() {
  const items = [
    { cls: "border-jade-600 bg-jade-100", label: "수업 가능 (잔여 표시)" },
    { cls: "border-brass-400 bg-brass-200", label: "1차 합격자 발표" },
    { cls: "border-ink bg-ink", label: "면접일", dark: true },
  ];
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-2.5 text-[12px] font-light text-ink-500">
          <span className={`h-4 w-4 border ${i.cls}`} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

export function ScheduleCalendar({ univ }: { univ: Univ }) {
  const range = univRange(univ);
  if (!range) {
    return (
      <p className="mx-auto max-w-2xl text-center text-[15px] font-light leading-[1.85] text-ink-500">
        이 대학은 아직 1단계 발표일·면접일이 공개되지 않았습니다. 요강이 확정되는 대로 캘린더를 채웁니다.
      </p>
    );
  }

  const classSet = new Set(univDays(univ));
  const months = monthsBetween(range.start, range.end);

  return (
    <div>
      <div className={`grid gap-10 ${months.length > 1 ? "lg:grid-cols-2" : "mx-auto max-w-2xl"}`}>
        {months.map(({ year, month }) => {
          const first = new Date(Date.UTC(year, month, 1));
          const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
          const lead = first.getUTCDay();
          const cells: (string | null)[] = [
            ...Array.from({ length: lead }, () => null),
            ...Array.from({ length: daysInMonth }, (_, i) => `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`),
          ];
          while (cells.length % 7 !== 0) cells.push(null);

          return (
            <div key={`${year}-${month}`} className="border border-hair-strong bg-paper-50">
              <div className="border-b border-hair-strong bg-ink px-5 py-3">
                <p className="display tnum text-[15px] tracking-tight text-white">
                  {year}년 {month + 1}월
                </p>
              </div>
              <div className="grid grid-cols-7 border-b border-hair bg-paper-100">
                {DOW_HEAD.map((d, i) => (
                  <div key={d} className={`py-2 text-center text-[11px] font-semibold ${i === 0 ? "text-brass-600" : "text-ink-500"}`}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((iso, i) => {
                  if (!iso) return <div key={`e${i}`} className="min-h-[72px] border-b border-r border-hair bg-paper-100/40" />;

                  const interviews = interviewsOn(univ, iso);
                  const announces = announcesOn(univ, iso);
                  const isClass = classSet.has(iso);
                  const day = toDate(iso).getUTCDate();

                  if (interviews.length > 0) {
                    return (
                      <div key={iso} className="min-h-[72px] border-b border-r border-hair bg-ink p-2 text-white">
                        <p className="display tnum text-[15px] leading-none">{day}</p>
                        <p className="mt-2 text-[10px] font-semibold leading-tight text-jade-400">면접일</p>
                        {/* 전형명은 좁은 화면에서 줄바꿈이 지저분해진다 — 데스크톱에서만 노출 */}
                        <p className="mt-0.5 hidden text-[9px] font-light leading-tight text-ink-300 sm:block">
                          {interviews.length > 1 ? `${interviews.length}개 전형` : interviews[0].name.slice(0, 10)}
                        </p>
                      </div>
                    );
                  }

                  if (announces.length > 0) {
                    const estimated = !announces[0].announce;
                    const open = isClass ? slotsForDate(iso).filter((s) => s.state === "open").length : 0;
                    return (
                      <div key={iso} className="min-h-[72px] border-b border-r border-hair bg-brass-50 p-2">
                        <p className="display tnum text-[15px] leading-none text-ink-900">{day}</p>
                        <p className="mt-2 text-[10px] font-semibold leading-tight text-brass-600">
                          1차 발표{estimated ? " (예정)" : ""}
                        </p>
                        {isClass && <p className="tnum mt-0.5 text-[9px] font-light text-ink-500">잔여 {open}</p>}
                      </div>
                    );
                  }

                  if (isClass) {
                    const slots = slotsForDate(iso);
                    const open = slots.filter((s) => s.state === "open").length;
                    const wait = slots.filter((s) => s.state === "waitlist").length;
                    const pct = Math.round(((slots.length - open) / slots.length) * 100);
                    return (
                      <div key={iso} className="min-h-[72px] border-b border-r border-hair bg-jade-50 p-2">
                        <p className="display tnum text-[15px] leading-none text-ink-900">{day}</p>
                        <div className="mt-2 h-1 w-full bg-jade-100">
                          <div className="h-full bg-jade-600" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="tnum mt-1.5 text-[10px] font-semibold leading-tight text-jade-700">잔여 {open}</p>
                        {wait > 0 && <p className="tnum text-[9px] font-light leading-tight text-brass-600">대기 {wait}</p>}
                      </div>
                    );
                  }

                  return (
                    <div key={iso} className="min-h-[72px] border-b border-r border-hair bg-paper-50 p-2">
                      <p className="tnum text-[13px] font-light leading-none text-ink-300">{day}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Legend />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 수업 일정표 — 주 단위 시간표 격자
 *   세로축 = 타임(1회 2시간 30분), 가로축 = 날짜.
 *   칸마다 강사 두 명의 예약 상태를 그대로 보여 준다.
 * ---------------------------------------------------------------------- */

/** 일요일 시작 주 단위로 쪼갠다.
 *  구간 밖의 날은 잘라낸다 — 안 그러면 첫 블록이 빈 칸으로 시작해서
 *  모바일에서 옆으로 밀어야 첫 수업일이 보인다. 요일은 헤더에 적히므로
 *  칸을 비워 두며 정렬할 이유가 없다. */
function weekBlocks(start: string, end: string, classSet: Set<string>): string[][] {
  const first = addDays(start, -toDate(start).getUTCDay());
  const blocks: string[][] = [];
  for (let w = first; diffDays(w, end) >= 0; w = addDays(w, 7)) {
    const week = Array.from({ length: 7 }, (_, i) => addDays(w, i)).filter(
      (d) => diffDays(start, d) >= 0 && diffDays(d, end) >= 0,
    );
    if (week.some((d) => classSet.has(d))) blocks.push(week);
  }
  return blocks;
}

function SlotChip({ teacher, state }: { teacher: string; state: string }) {
  const tone =
    state === "open"
      ? "border-jade-600 bg-jade-50 text-jade-700"
      : state === "waitlist"
        ? "border-brass-400 bg-brass-50 text-brass-600"
        : "border-ink-200 bg-ink-100 text-ink-400 line-through";
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center border text-[10px] font-semibold ${tone}`}
      title={`${teacher} · ${state === "open" ? "예약 가능" : state === "waitlist" ? "1차 결과 대기" : "예약 확정"}`}
    >
      {teacher.slice(0, 1)}
    </span>
  );
}

export function TimetableLegend() {
  const items = [
    { cls: "border-jade-600 bg-jade-50 text-jade-700", label: "예약 가능" },
    { cls: "border-brass-400 bg-brass-50 text-brass-600", label: "1차 결과 대기 (누수 접수)" },
    { cls: "border-ink-200 bg-ink-100 text-ink-400 line-through", label: "예약 확정" },
  ];
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-2.5 text-[12px] font-light text-ink-500">
          <span className={`inline-flex h-5 w-5 items-center justify-center border text-[10px] font-semibold ${i.cls}`}>박</span>
          {i.label}
        </span>
      ))}
      <span className="text-[12px] font-light text-ink-400">박 = 박은우 · 강 = 강정규</span>
    </div>
  );
}

export function Timetable({ univ }: { univ: Univ }) {
  const range = univRange(univ);
  if (!range) return null;
  const classSet = new Set(univDays(univ));
  const blocks = weekBlocks(range.start, range.end, classSet);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="space-y-8">
        {blocks.map((week) => (
          <div key={week[0]} role="region" aria-label={`${week[0]} 주간 수업 시간표`} tabIndex={0} className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="w-[104px] border-b border-r border-hair-strong bg-ink px-3 py-3 text-[11px] font-semibold tracking-tight text-paper">
                    시간 · 2H30
                  </th>
                  {week.map((d) => {
                    const isInterview = interviewsOn(univ, d).length > 0;
                    const isAnnounce = announcesOn(univ, d).length > 0;
                    const inRange = classSet.has(d) || isInterview || isAnnounce;
                    const head = isInterview
                      ? "bg-ink text-white"
                      : isAnnounce
                        ? "bg-brass-50 text-ink-900"
                        : inRange
                          ? "bg-paper-100 text-ink-900"
                          : "bg-paper-100/40 text-ink-300";
                    return (
                      <th key={d} className={`border-b border-r border-hair px-2 py-2.5 text-center ${head}`}>
                        <span className="display tnum block text-[15px] leading-none">{toDate(d).getUTCDate()}</span>
                        <span className={`mt-1 block text-[10px] font-medium ${dow(d) === "일" ? "text-brass-600" : "opacity-70"}`}>
                          {dow(d)}
                        </span>
                        {isInterview && <span className="mt-1 block text-[9px] font-semibold text-jade-400">면접</span>}
                        {isAnnounce && <span className="mt-1 block text-[9px] font-semibold text-brass-600">1차 발표</span>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {SLOT_TIMES.map((slot) => (
                  <tr key={slot.id}>
                    <th className="tnum border-b border-r border-hair bg-paper-100 px-3 py-3 text-left text-[11px] font-medium tracking-tight text-ink-600">
                      {slot.label}
                      {slot.holidayOnly && <span className="mt-0.5 block text-[9px] font-light text-ink-400">휴일만</span>}
                    </th>
                    {week.map((d) => {
                      if (!classSet.has(d)) {
                        const isInterview = interviewsOn(univ, d).length > 0;
                        return (
                          <td
                            key={d + slot.id}
                            className={`border-b border-r border-hair text-center ${isInterview ? "bg-ink/90" : "bg-paper-100/40"}`}
                          />
                        );
                      }
                      const cell = slotsAt(d, slot.id);
                      if (cell.length === 0) {
                        return (
                          <td key={d + slot.id} className="border-b border-r border-hair bg-paper-100/60 px-2 py-3 text-center">
                            <span className="text-[11px] font-light text-ink-300">—</span>
                          </td>
                        );
                      }
                      return (
                        <td key={d + slot.id} className="border-b border-r border-hair bg-white px-2 py-3 text-center">
                          <span className="inline-flex gap-1">
                            {cell.map((x) => (
                              <SlotChip key={x.teacherId} teacher={x.teacher} state={x.state} />
                            ))}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <TimetableLegend />
      <p className="mt-5 text-center text-xs font-light leading-[1.8] text-ink-400">
        1회 수업 2시간 30분 · 식사 시간(11:00–12:00 / 17:00–18:00) 제외. 평일은 저녁 2타임, 토·일·공휴일은 5타임을 엽니다.
        칸이 비어 있는 날은 수업 구간 밖이거나 면접일입니다.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 예약 현황
 * ---------------------------------------------------------------------- */

export function BookingBoard({ univ }: { univ: Univ }) {
  const days = univDays(univ);
  const s = summarize(days);
  if (days.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl">
      {/* 요약 */}
      <div className="grid border-l border-t border-hair bg-paper-50 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="개설 슬롯" value={String(s.total)} unit="회" />
        <Stat label="예약 확정" value={String(s.booked)} unit="회" />
        <Stat label="1차 결과 대기" value={String(s.waitlist)} unit="회" />
        <Stat label="지금 예약 가능" value={String(s.open)} unit="회" tone="accent" />
      </div>

      {/* 충원율 바 */}
      <div className="mt-8 border border-hair-strong bg-white px-7 py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="display text-[15px] text-ink-900">전체 충원율</p>
          <p className="display tnum text-[1.75rem] leading-none text-ink-900">
            {s.rate}
            <span className="ml-1 align-middle text-sm font-light text-ink-400">%</span>
          </p>
        </div>
        <div className="mt-4 flex h-3 w-full overflow-hidden bg-paper-200">
          <div className="h-full bg-ink" style={{ width: `${(s.booked / s.total) * 100}%` }} />
          <div className="h-full bg-brass-400" style={{ width: `${(s.waitlist / s.total) * 100}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2 text-[12px] font-light text-ink-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-ink" />예약 확정 {s.booked}회
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-brass-400" />1차 결과 대기 {s.waitlist}회
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-paper-200" />예약 가능 {s.open}회
          </span>
        </div>
      </div>

      <p className="mt-6 text-center text-xs font-light leading-[1.8] text-ink-400">
        {formatKo(days[0])} 기준으로 집계한 값입니다. 날짜·타임별 잔여는 아래 수업 일정표에서 확인하세요.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 누수 예약 안내
 * ---------------------------------------------------------------------- */

export function LeakageNotice({ univ }: { univ: Univ }) {
  const s = summarize(univDays(univ));
  return (
    <div className="mx-auto flex max-w-4xl bg-brass-50">
      <span className="w-[3px] shrink-0 bg-brass" />
      <div className="px-7 py-7">
        <h3 className="display text-[1.0625rem] text-ink-900">1차 불합격 누수 — 대기 예약을 함께 받습니다</h3>
        <p className="mt-4 text-[14px] font-light leading-[1.85] text-ink-600">
          지금 차 있는 자리 중 <span className="tnum font-semibold text-brass-600">{s.waitlist}회</span>는 1단계 결과를 기다리는 예약입니다. 1차에서
          탈락하면 그 자리가 그대로 풀립니다. {univ.short}는 1단계 배수가 넓은 전형일수록 누수가 크게 납니다.
        </p>
        <ul className="mt-5 space-y-3">
          {[
            "대기 순번을 걸어 두면, 자리가 풀리는 즉시 순번대로 연락드립니다.",
            "대기 접수에는 비용이 발생하지 않습니다. 자리가 확정된 뒤에 결제합니다.",
            "본인이 1차에서 탈락한 경우, 예약금 없이 전액 취소됩니다.",
            "확정 예약이 우선입니다. 일정이 이미 정해졌다면 대기보다 확정 자리를 먼저 잡는 편이 안전합니다.",
          ].map((t) => (
            <li key={t} className="flex gap-3 text-[14px] font-light leading-[1.8] text-ink-700">
              <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-600" strokeWidth={2.25} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 강사
 * ---------------------------------------------------------------------- */

export function TeacherCards() {
  return (
    <div className="feature-grid grid sm:grid-cols-2">
      {TEACHERS.map((t) => (
        <div key={t.id} className="feature-card p-8">
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center border border-hair-strong bg-white text-jade-600">
              <UserRound className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <span className="eyebrow text-brass-600">1:1</span>
          </div>
          <h3 className="display mt-6 text-[1.25rem] leading-snug text-ink-900">{t.name}</h3>
          <p className="mt-1.5 text-[13px] font-semibold tracking-tight text-jade-700">{t.role}</p>
          <p className="mt-4 border-t border-hair pt-4 text-[13px] font-light leading-[1.8] text-ink-500">{t.credential}</p>
          <p className="mt-4 text-[14px] font-light leading-[1.85] text-ink-600">{t.focus}</p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 대학 카드 (허브)
 * ---------------------------------------------------------------------- */

export function UnivCards({ univs }: { univs: Univ[] }) {
  return (
    <div className="link-grid grid sm:grid-cols-2 lg:grid-cols-3">
      {univs.map((u) => {
        const days = univDays(u);
        const s = summarize(days);
        const next = u.tracks.map((t) => t.interview).filter((v): v is string => Boolean(v)).sort()[0];
        return (
          <Link
            key={u.slug}
            href={`/univ/${u.slug}`}
            className="link-card group relative flex flex-col p-7 transition-colors duration-300"
          >
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />
            <div className="flex items-start justify-between gap-3">
              <h3 className="display flex items-center gap-2 text-[1.125rem] leading-snug text-ink-900">
                <span className="link-underline">{u.short}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-brass-600 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
              </h3>
            </div>
            <p className="mt-2 text-[12px] font-light text-ink-400">{u.region}</p>
            <div className="mt-4">
              <StyleBadge univ={u} />
            </div>
            <p className="mt-5 flex-1 text-[13px] font-light leading-[1.8] text-ink-500">{u.headline}</p>
            <dl className="mt-6 grid grid-cols-2 gap-px border-t border-hair bg-hair pt-px text-center">
              <div className="bg-paper-50 px-2 py-3">
                <dt className="text-[10px] font-medium tracking-wide text-ink-400">최초 면접일</dt>
                <dd className="tnum display mt-1 text-[13px] text-ink-900">
                  {next ? `${toDate(next).getUTCMonth() + 1}.${toDate(next).getUTCDate()}` : "미공지"}
                </dd>
              </div>
              <div className="bg-paper-50 px-2 py-3">
                <dt className="text-[10px] font-medium tracking-wide text-ink-400">예약 가능</dt>
                <dd className="tnum display mt-1 text-[13px] text-jade-700">{s.open}회</dd>
              </div>
            </dl>
          </Link>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 히어로 아래 숫자 줄 (대학 상세)
 * ---------------------------------------------------------------------- */

export function UnivStatBar({ univ }: { univ: Univ }) {
  const days = univDays(univ);
  const s = summarize(days);
  const range = univRange(univ);
  const spans = univ.tracks
    .map((t) => {
      const st = trackStart(t);
      return st && t.interview ? diffDays(st, t.interview) : null;
    })
    .filter((v): v is number => v !== null);
  const shortest = spans.length ? Math.min(...spans) : null;

  return (
    <div className="grid border-l border-t border-hair bg-paper-50 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="최단 준비 기간" value={shortest !== null ? String(shortest) : "—"} unit="일" tone="accent" />
      <Stat label="수업 가능일" value={String(days.length)} unit="일" />
      <Stat label="충원율" value={`${s.rate}`} unit="%" />
      <Stat label="예약 가능" value={String(s.open)} unit="회" tone="accent" />
      {range && (
        <div className="col-span-full border-b border-r border-hair bg-paper-100 px-6 py-4">
          <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-light text-ink-500">
            <CalendarDays className="h-3.5 w-3.5 text-jade-600" strokeWidth={1.75} />
            수업 구간 <span className="tnum font-semibold text-ink-800">{formatKo(range.start)}</span>
            <span className="text-ink-300">—</span>
            <span className="tnum font-semibold text-ink-800">{formatKo(addDays(range.end, -1))}</span>
            <span className="text-ink-300">·</span>
            <Clock className="h-3.5 w-3.5 text-jade-600" strokeWidth={1.75} />
            1회 2시간 30분 · 평일 저녁 2타임(18:00–23:00) / 토·일·공휴일 5타임(08:30–11:00 · 12:00–17:00 · 18:00–23:00)
          </p>
        </div>
      )}
    </div>
  );
}

export type { Track, Univ };
