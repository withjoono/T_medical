"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** =========================================================================
 *  대학 면접 페이지 하단 — 예약 현황 달력(대기 접수 안내).
 *
 *  2026-11-06 사용자 지시: "캘린더 형식으로 예약 현황 · 거의 다 차가고 있고,
 *  대기로 걸어 놓으면 빠진 시간에 들어간다고." 실제 예약 장부와 연동하지 않는
 *  안내용 달력이다(사용자 확인: "대기가 거의 차 있다는 것만 보여주면 돼").
 *
 *  ⚠️ 클라이언트에서만 그린다(마운트 후). 이유 두 가지:
 *   1. 오늘 날짜 기준으로 그려야 한다 — 빌드 날짜로 구우면 배포 뒤 며칠만 지나도
 *      지난 날짜에 '마감'이 찍힌 달력이 남는다.
 *   2. 190여 개 대학 페이지 HTML 에 같은 달력 마크업·문구가 박히면
 *      2026-10-24 에 걷어낸 본문 중복이 되살아난다(_class-modal.tsx 와 같은 원칙).
 *  날짜별 상태는 날짜 문자열 해시로 정한다 — 같은 날은 어느 대학 페이지에서도 같다.
 *  ========================================================================= */

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
/** FNV-1a + murmur3 fmix → 0~1 */
function hash01(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // 끝 글자만 다른 날짜 문자열은 FNV 만으로는 잘 안 섞인다 — murmur3 마무리 섞기
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 0xffffffff;
}

type DayState = "full" | "waitFull" | "last";

/** 거의 다 찬 상태: 대부분 '마감·대기 n', 일부 '대기 마감', 드물게 '1자리' */
function stateOf(date: string): { state: DayState; wait: number } {
  const r = hash01(`medi-wait|${date}`);
  if (r < 0.06) return { state: "last", wait: 0 };
  if (r < 0.38) return { state: "waitFull", wait: 3 };
  return { state: "full", wait: 1 + Math.floor(hash01(`medi-wait-n|${date}`) * 2) };
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
  useEffect(() => setToday(iso(new Date())), []);

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
          마감된 날도 <strong className="font-semibold text-ink-900">대기를 걸어 두시면</strong>, 취소나 1차 불합격으로
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
                    const s = stateOf(d);
                    if (s.state === "last") {
                      label = <span className="font-semibold text-brass-600">1자리</span>;
                      tone = "bg-brass-300/10";
                    } else if (s.state === "waitFull") {
                      label = <span className="text-ink-500">대기 마감</span>;
                      tone = "bg-paper-200";
                    } else {
                      label = (
                        <>
                          <span className="text-ink-500">마감</span>
                          <span className="block text-rose-600">대기 {s.wait}</span>
                        </>
                      );
                      tone = "bg-paper-100";
                    }
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

      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] font-light text-ink-500">
        <span>
          <i className="mr-1.5 inline-block h-2.5 w-2.5 bg-paper-100 align-middle ring-1 ring-hair" />
          마감 · 대기 n = 앞선 대기 인원
        </span>
        <span>
          <i className="mr-1.5 inline-block h-2.5 w-2.5 bg-paper-200 align-middle ring-1 ring-hair" />
          대기 마감
        </span>
        <span>
          <i className="mr-1.5 inline-block h-2.5 w-2.5 bg-brass-300/30 align-middle ring-1 ring-hair" />
          남은 자리
        </span>
        <span>
          <i className="mr-1.5 inline-block h-2.5 w-2.5 bg-jade-50 align-middle ring-1 ring-hair" />
          면접일
        </span>
      </div>

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
