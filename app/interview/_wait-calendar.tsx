"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** 면접일과 대기 접수 안내. 날짜별 예약 수는 생성하지 않는다. */
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

function iso(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function fromIso(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(s: string, n: number) {
  const d = fromIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}
function monthsBetween(start: string, end: string) {
  const s = fromIso(start);
  const e = fromIso(end);
  const out: { y: number; m: number }[] = [];
  for (let y = s.getFullYear(), m = s.getMonth(); y < e.getFullYear() || (y === e.getFullYear() && m <= e.getMonth()); ) {
    out.push({ y, m });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return out.slice(0, 3);
}

export function WaitCalendar({ univShort, interviewDays }: { univShort: string; interviewDays: string[] }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())), []);

  if (!today) return <div className="min-h-[420px]" aria-hidden />;

  const future = interviewDays.filter((d) => d > today).sort();
  // 다가오는 면접이 있으면 마지막 면접일까지, 없으면 앞으로 4주
  const end = future.length ? future[future.length - 1] : addDays(today, 27);
  const ivSet = new Set(interviewDays);
  const months = monthsBetween(today, end);

  return (
    <div>
      <div className="mx-auto max-w-3xl border border-brass-300 bg-brass-300/10 px-6 py-5 text-center">
        <p className="text-[15px] font-semibold text-ink-900">
          {future.length
            ? `${univShort} 면접 전까지 수업 자리가 거의 다 찼습니다`
            : "앞으로 4주 수업 자리가 거의 다 찼습니다"}
        </p>
        <p className="mt-2 text-[13.5px] font-light leading-[1.8] text-ink-600">
          원하는 일정에 <strong className="font-semibold text-ink-900">대기를 걸어 두시면</strong>, 1단계 결과나 수능최저 충족 여부에 따른 취소로
          빠진 시간에 대기 순서대로 들어갑니다. 대기 접수는 무료이고, 자리가 확정된 뒤에 결제합니다.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {months.map(({ y, m }) => {
          const first = new Date(y, m, 1);
          const daysIn = new Date(y, m + 1, 0).getDate();
          const cells: (string | null)[] = Array(first.getDay()).fill(null);
          for (let d = 1; d <= daysIn; d++) cells.push(iso(new Date(y, m, d)));
          while (cells.length % 7) cells.push(null);
          return (
            <div key={`${y}-${m}`} className="border border-hair bg-white">
              <p className="border-b border-hair px-4 py-3 text-[14px] font-semibold text-ink-900">
                {y}년 {m + 1}월
              </p>
              <div className="grid grid-cols-7 text-center text-[11px] text-ink-400">
                {DOW.map((d, i) => (
                  <div key={d} className={`py-2 ${i === 0 ? "text-rose-500" : ""}`}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 border-t border-hair">
                {cells.map((d, i) => {
                  if (!d) return <div key={i} className="min-h-[58px] border-b border-r border-hair bg-paper-100/50" />;
                  const day = Number(d.slice(8));
                  const isIv = ivSet.has(d);
                  const inRange = d >= today && d < end;
                  let label: React.ReactNode = null;
                  let tone = "bg-white text-ink-300";
                  if (isIv) {
                    label = <span className="font-semibold text-jade-700">면접</span>;
                    tone = "bg-jade-50";
                  } else if (inRange) {
                    label = <span className="text-ink-500">대기 문의</span>;
                    tone = "bg-paper-100";
                  }
                  return (
                    <div key={d} className={`min-h-[58px] border-b border-r border-hair px-1 py-1.5 text-[10.5px] leading-tight ${tone}`}>
                      <span className={`block text-[12px] ${inRange || isIv ? "text-ink-900" : "text-ink-300"}`}>{day}</span>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[12px] leading-relaxed text-ink-500">면접일은 초록색으로 표시됩니다. 달력은 대기 접수 기간 안내이며, 날짜별 예약 가능 시간은 상담 후 확인됩니다.</p>

      <div className="mt-8 text-center">
        <Link
          href="#contact"
          className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-ink-800"
        >
          대기 걸어 두기
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
