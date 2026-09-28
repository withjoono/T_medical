"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CALENDAR_EVENTS,
  CALENDAR_TOTALS,
  COMMON_IDS,
  FIELDS,
  KINDS,
  type CalEvent,
  type EventKind,
  type FieldKey,
  type KindKey,
} from "@/lib/admissions-calendar";

/** =========================================================================
 *  메인 입시 캘린더 — 의 · 치 · 한 · 약 · 수 전 계열.
 *
 *  ⚠️ 날짜는 lib/admissions-calendar.ts 가 계열별 SSOT 에서 합쳐 온다.
 *     이 파일에는 하드코딩된 날짜가 없다.
 *
 *  ⚠️ 계열을 고르면 그 계열만 남는다. 대교협 공통 일정(수능·합격 발표 마감 등)은
 *     계열과 무관하므로 항상 보인다.
 *  ========================================================================= */

const KIND_TONE: Record<EventKind, string> = {
  announce: "cal-kind-announce",
  interview: "cal-kind-interview",
  final: "cal-kind-final",
  common: "cal-kind-common",
};

const KIND_LABEL: Record<EventKind, string> = {
  announce: "1차 발표",
  interview: "면접",
  final: "합격 발표",
  common: "공통",
};

const MONTHS = [10, 11, 12] as const;
const WEEK = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function AdmissionsCalendar() {
  const [month, setMonth] = useState<number>(11);
  const [field, setField] = useState<FieldKey | "all">("all");
  const [kind, setKind] = useState<KindKey | "all">("all");
  const [day, setDay] = useState<string | null>(null);

  const prefix = `2026-${String(month).padStart(2, "0")}`;

  const filtered = useMemo(() => {
    return CALENDAR_EVENTS.filter((e) => {
      if (!e.date.startsWith(prefix)) return false;
      if (kind !== "all" && e.kind !== kind && e.kind !== "common") return false;
      // 공통 일정은 계열 필터를 타지 않는다
      if (field !== "all" && !COMMON_IDS.has(e.id) && e.field !== field) return false;
      return true;
    });
  }, [prefix, field, kind]);

  const visible = day ? filtered.filter((e) => e.date === day) : [];

  /** 날짜 미선택 시에는 전체를 나열하지 않고 날짜별 한 줄로 접는다.
   *  11월만 200건이 넘어 그대로 펼치면 '한눈에' 가 되지 않는다. */
  const summary = useMemo(() => {
    if (day) return [];
    const map = new Map<string, CalEvent[]>();
    for (const e of filtered) {
      const list = map.get(e.date);
      if (list) list.push(e);
      else map.set(e.date, [e]);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered, day]);
  const offset = new Date(Date.UTC(2026, month - 1, 1)).getUTCDay();
  const count = new Date(Date.UTC(2026, month, 0)).getUTCDate();

  const fieldLabel =
    field === "all" ? "의·치·한·약·수 전체" : FIELDS.find((f) => f.key === field)!.label;

  return (
    <section className="admissions-calendar" aria-labelledby="admissions-calendar-title">
      <div className="calendar-heading">
        <div>
          <p className="eyebrow text-brass-600">ADMISSIONS CALENDAR</p>
          <h2 id="admissions-calendar-title">
            2027 의·치·한·약·수
            <br />
            1차 발표 · 면접 · 합격 발표
          </h2>
        </div>
        <p>
          계열을 고르면 그 계열 일정만 남습니다.
          <br />
          2027학년도 수시 · 실제 고사일은 2026년입니다.
        </p>
      </div>

      <div className="calendar-controls">
        <div className="calendar-month">
          <button
            type="button"
            disabled={month === MONTHS[0]}
            aria-label="이전 달"
            onClick={() => {
              setMonth(month - 1);
              setDay(null);
            }}
          >
            ←
          </button>
          <h3 aria-live="polite">2026년 {month}월</h3>
          <button
            type="button"
            disabled={month === MONTHS[MONTHS.length - 1]}
            aria-label="다음 달"
            onClick={() => {
              setMonth(month + 1);
              setDay(null);
            }}
          >
            →
          </button>
        </div>

        <div className="calendar-filters" aria-label="계열">
          <button
            type="button"
            aria-pressed={field === "all"}
            onClick={() => {
              setField("all");
              setDay(null);
            }}
          >
            전체
          </button>
          {FIELDS.map((f) => (
            <button
              type="button"
              key={f.key}
              aria-pressed={field === f.key}
              onClick={() => {
                setField(f.key);
                setDay(null);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-filters calendar-filters-kind" aria-label="일정 종류">
        <button
          type="button"
          aria-pressed={kind === "all"}
          onClick={() => {
            setKind("all");
            setDay(null);
          }}
        >
          전체 일정
        </button>
        {KINDS.map((k) => (
          <button
            type="button"
            key={k.key}
            aria-pressed={kind === k.key}
            onClick={() => {
              setKind(k.key);
              setDay(null);
            }}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="calendar-week" aria-hidden="true">
        {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="calendar-days">
        {Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, index) => {
          const date = index - offset + 1;
          if (date < 1 || date > count) return <div key={index} className="calendar-empty" />;
          const iso = `${prefix}-${String(date).padStart(2, "0")}`;
          const entries = filtered.filter((e) => e.date === iso);
          const byKind = ([...KINDS.map((k) => k.key), "common"] as EventKind[])
            .map((k) => ({ k, n: entries.filter((e) => e.kind === k).length }))
            .filter((x) => x.n > 0);
          const names = [...new Set(entries.filter((e) => e.univ).map((e) => e.univ!))];
          return (
            <button
              type="button"
              key={iso}
              className="calendar-day"
              aria-pressed={day === iso}
              aria-label={`${month}월 ${date}일, 일정 ${entries.length}개${
                names.length ? `, ${names.join(", ")}` : ""
              }`}
              onClick={() => setDay(day === iso ? null : iso)}
            >
              <span className="calendar-date">{date}</span>
              {byKind.length > 0 && (
                <span className="calendar-chips">
                  {byKind.map(({ k, n }) => (
                    <span key={k} className={`calendar-chip ${KIND_TONE[k]}`}>
                      {KIND_LABEL[k]} {n}
                    </span>
                  ))}
                </span>
              )}
              {names.length > 0 && <span className="calendar-names">{names.join(" · ")}</span>}
            </button>
          );
        })}
      </div>

      <div className="calendar-agenda" aria-live="polite">
        <div className="calendar-agenda-heading">
          <h3>
            {day ? `${month}월 ${Number(day.slice(-2))}일` : `${month}월 전체`} · {fieldLabel} ·{" "}
            {filtered.length}건
          </h3>
          {day && (
            <button type="button" onClick={() => setDay(null)}>
              월 전체 보기
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="calendar-no-events">
            선택한 계열·종류에 해당하는 일정이 이 달에 없습니다.
          </p>
        ) : day ? (
          <ul>
            {visible.map((event: CalEvent) => (
              <li key={event.id}>
                <time dateTime={event.date}>
                  {Number(event.date.slice(5, 7))}.{Number(event.date.slice(8))}
                </time>
                <div>
                  {event.href && event.univ ? (
                    <Link href={event.href}>
                      <strong>{event.univ}</strong> · {event.track} ↗
                    </Link>
                  ) : (
                    <strong>{event.track}</strong>
                  )}
                  {event.note && <p>{event.note}</p>}
                </div>
                <span className={`calendar-type ${KIND_TONE[event.kind]}`}>
                  {KIND_LABEL[event.kind]}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className="calendar-summary">
              {summary.map(([date, list]) => {
                const names = [...new Set(list.filter((e) => e.univ).map((e) => e.univ!))];
                const commons = list.filter((e) => !e.univ).map((e) => e.track);
                return (
                  <li key={date}>
                    <time dateTime={date}>
                      {Number(date.slice(5, 7))}.{Number(date.slice(8))}
                      <span>{WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()]}</span>
                    </time>
                    <div>
                      <span className="calendar-chips-row">
                        {([...KINDS.map((k) => k.key), "common"] as EventKind[]).map((k) => {
                          const n = list.filter((e) => e.kind === k).length;
                          return n ? (
                            <span key={k} className={`calendar-chip ${KIND_TONE[k]}`}>
                              {KIND_LABEL[k]} {n}
                            </span>
                          ) : null;
                        })}
                      </span>
                      {commons.length > 0 && <p className="calendar-common">{commons.join(" · ")}</p>}
                      {names.length > 0 && <p>{names.join(" · ")}</p>}
                    </div>
                    <button type="button" onClick={() => setDay(date)}>
                      자세히
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="calendar-hint">
              날짜를 누르면 그 날의 전형명과 대학 링크가 펼쳐집니다.
            </p>
          </>
        )}
      </div>

      <p className="calendar-disclaimer">
        각 대학 2027학년도 수시 모집요강에서 확인된 날짜만 표시합니다 — 의예{" "}
        {CALENDAR_TOTALS.byField.uiye}교 · 치의예 {CALENDAR_TOTALS.byField.chiuiye}교 · 한의예{" "}
        {CALENDAR_TOTALS.byField.hanuiye}교 · 약학 {CALENDAR_TOTALS.byField.yakhak}교 · 수의예{" "}
        {CALENDAR_TOTALS.byField.suuiye}교. 요강에 날짜가 없는 전형은 표시하지 않으며, 그것이
        &lsquo;일정 없음&rsquo;이나 &lsquo;미실시&rsquo;를 뜻하지는 않습니다. 수능일과 합격자 발표
        마감은 대교협 공통 일정이라 계열과 무관하게 항상 표시됩니다. 고사 시간·장소·변경 사항은 반드시
        대학 입학처의 최종 공지로 확인하세요.
      </p>
    </section>
  );
}
