"use client";

import { useState } from "react";
import Link from "next/link";

export type CalendarEvent = { id: string; date: string; university: string; track: string; note?: string; href: string; sources: { label: string; url: string }[] };

export function AdmissionsCalendar({ events, pending }: { events: CalendarEvent[]; pending: string[] }) {
  const [month, setMonth] = useState(11);
  const [kind, setKind] = useState("all");
  const [day, setDay] = useState<string | null>(null);
  const prefix = `2026-${String(month).padStart(2, "0")}`;
  const monthly = kind === "essay" ? [] : events.filter((event) => event.date.startsWith(prefix));
  const visible = day ? monthly.filter((event) => event.date === day) : monthly;
  const offset = new Date(Date.UTC(2026, month - 1, 1)).getUTCDay();
  const count = new Date(Date.UTC(2026, month, 0)).getUTCDate();
  return <section className="admissions-calendar" aria-labelledby="admissions-calendar-title">
    <div className="calendar-heading"><div><p className="eyebrow text-brass-600">ADMISSIONS CALENDAR</p><h2 id="admissions-calendar-title">2027학년도 의대<br />면접·논술 전형일</h2></div><p>지원 대학의 일정을 한눈에 확인하세요.<br />2027학년도 수시 · 실제 고사일은 2026년입니다.</p></div>
    <div className="calendar-controls"><div className="calendar-month"><button type="button" disabled={month === 10} aria-label="이전 달" onClick={() => { setMonth(month - 1); setDay(null); }}>←</button><h3 aria-live="polite">2026년 {month}월</h3><button type="button" disabled={month === 12} aria-label="다음 달" onClick={() => { setMonth(month + 1); setDay(null); }}>→</button></div><div className="calendar-filters" aria-label="전형 종류">{[{id:"all",label:"전체"},{id:"interview",label:"면접"},{id:"essay",label:"논술"}].map((item) => <button type="button" key={item.id} aria-pressed={kind === item.id} onClick={() => { setKind(item.id); setDay(null); }}>{item.label}</button>)}</div></div>
    <p className="calendar-notice">논술 고사일은 사이트 내 날짜 자료가 아직 등록되지 않았습니다. ‘일정 없음’이나 ‘미실시’를 뜻하지 않습니다. <Link href="/susi/nonsul">논술전형 안내 →</Link></p>
    <div className="calendar-week" aria-hidden="true">{["일","월","화","수","목","금","토"].map((label) => <span key={label}>{label}</span>)}</div>
    <div className="calendar-days">{Array.from({length: Math.ceil((offset + count) / 7) * 7}, (_, index) => {
      const date = index - offset + 1;
      if (date < 1 || date > count) return <div key={index} className="calendar-empty" />;
      const iso = `${prefix}-${String(date).padStart(2,"0")}`;
      const entries = monthly.filter((event) => event.date === iso);
      const names = [...new Set(entries.map((event) => event.university))];
      return <button type="button" key={iso} className="calendar-day" aria-pressed={day === iso} aria-label={`${month}월 ${date}일, 면접 ${entries.length}개 전형${names.length ? `, ${names.join(", ")}` : ""}`} onClick={() => setDay(day === iso ? null : iso)}><span className="calendar-date">{date}</span>{entries.length > 0 && <><span className="calendar-count">면접 {entries.length}</span><span className="calendar-names">{names.join(" · ")}</span></>}</button>;
    })}</div>
    <div className="calendar-agenda" aria-live="polite"><div className="calendar-agenda-heading"><h3>{day ? `${month}월 ${Number(day.slice(-2))}일` : `${month}월 전체`} 일정 · {visible.length}개 전형</h3>{day && <button type="button" onClick={() => setDay(null)}>월 전체 보기</button>}</div>
      {visible.length ? <ul>{visible.map((event) => <li key={event.id}><time dateTime={event.date}>{Number(event.date.slice(5,7))}.{Number(event.date.slice(8))}</time><div><Link href={event.href}><strong>{event.university}</strong> · {event.track} ↗</Link>{event.note && <p>{event.note}</p>}<div className="calendar-sources">{event.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div></div><span className="calendar-type">면접</span></li>)}</ul> : <p className="calendar-no-events">{kind === "essay" ? "논술 날짜 자료가 등록되면 이곳에 표시됩니다." : "선택한 기간에 사이트에 등록된 일정이 없습니다."}</p>}
    </div>
    <p className="calendar-disclaimer">사이트에 등록된 15개 의대의 면접 일정 기준이며, 전국 의대 전체 일정은 아닙니다. 기간형 일정은 시작일에 표시하므로 세부 안내를 확인하세요. 고사 시간·장소·변경 사항은 반드시 대학 입학처의 최종 공지로 확인하세요.{pending.length > 0 && ` 날짜 미등록: ${pending.join(", ")}.`}</p>
  </section>;
}
