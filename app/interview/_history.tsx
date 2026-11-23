import Link from "next/link";
import { ArrowRight, History, Repeat2, Lock, Target } from "lucide-react";
import {
  HISTORY_GRADE_LABEL,
  type HistoryGrade,
  type HistorySource,
  type InterviewShift,
  type UnivHistory,
} from "@/lib/uidae-interview-history";

/** =========================================================================
 *  의대 면접 변천 블록 (2026-11-23) — 데이터는 lib/uidae-interview-history.ts
 *   · InterviewShifts   — /interview/uidae HISTORY 섹션(바뀌어 온 흐름)
 *   · UnivHistoryBlock  — 대학 페이지의 연도별 변천사(현재 서울대)
 *   · UnivShiftBox      — 그 밖의 대학 페이지 '흐름 속 이 대학' 상자
 *  전부 서버 컴포넌트다.
 *  ========================================================================= */

function SourceLinks({ sources }: { sources: HistorySource[] }) {
  if (sources.length === 0) return null;
  return (
    <ul className="space-y-1">
      {sources.map((s) => (
        <li key={s.url} className="text-[12px] font-light leading-[1.7] text-ink-400">
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function InterviewShifts({ shifts }: { shifts: InterviewShift[] }) {
  return (
    <ol className="mx-auto max-w-5xl space-y-6">
      {shifts.map((s, i) => (
        <li
          key={s.id}
          id={`history-${s.id}`}
          className="scroll-mt-28 border border-hair-strong bg-white px-6 py-7 sm:px-8"
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="tnum text-[12px] font-semibold text-brass-600">{String(i + 1).padStart(2, "0")}</span>
            <span className="eyebrow text-ink-400">{s.period}</span>
          </div>
          <h3 className="display mt-3 text-[1.25rem] leading-snug text-ink-900">{s.title}</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="eyebrow text-ink-400">예전</p>
              <p className="mt-2 text-[14px] font-light leading-[1.85] text-ink-600">{s.then}</p>
            </div>
            <div>
              <p className="eyebrow text-jade-700">지금</p>
              <p className="mt-2 text-[14px] font-light leading-[1.85] text-ink-700">{s.now}</p>
            </div>
          </div>
          <div className="mt-5 border-l-2 border-brass-400 bg-brass-50 px-5 py-4">
            <p className="text-[13px] font-medium text-ink-900">준비에 주는 뜻 · T메디 판단</p>
            <p className="mt-1.5 text-[14px] font-light leading-[1.8] text-ink-700">{s.meaning}</p>
          </div>
          <div className="mt-4">
            <SourceLinks sources={s.sources} />
          </div>
        </li>
      ))}
    </ol>
  );
}

const GRADE_TONE: Record<HistoryGrade, string> = {
  official: "border-jade-600/40 bg-jade-50 text-jade-700",
  guide: "border-jade-600/40 bg-jade-50 text-jade-700",
  topic: "border-brass-400 bg-brass-50 text-brass-600",
  paper: "border-hair-strong bg-paper-50 text-ink-600",
  report: "border-hair-strong bg-paper-50 text-ink-500",
  none: "border-dashed border-hair-strong bg-white text-ink-400",
};

export function UnivHistoryBlock({ h }: { h: UnivHistory }) {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="mx-auto max-w-3xl text-center text-[14px] font-light leading-[1.85] text-ink-600">{h.lead}</p>

      <ol className="mt-10 border-t border-hair-strong">
        {h.rows.map((r) => (
          <li
            key={r.year}
            className="grid gap-2 border-b border-hair py-5 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
          >
            <div className="flex items-center gap-3 sm:block">
              <p className="display tnum text-[1.25rem] leading-none text-ink-900">{r.year}</p>
              <span
                className={`inline-block border px-2 py-0.5 text-[11px] font-medium sm:mt-2.5 ${GRADE_TONE[r.grade]}`}
              >
                {HISTORY_GRADE_LABEL[r.grade]}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-medium leading-[1.7] text-ink-900">{r.rooms}</p>
              <p className="mt-1 text-[14px] font-light leading-[1.8] text-ink-600">{r.feature}</p>
              {r.sources.length > 0 && (
                <div className="mt-2">
                  <SourceLinks sources={r.sources} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="border border-hair-strong bg-white px-6 py-6">
          <p className="eyebrow flex items-center gap-2 text-jade-700">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
            10년 넘게 그대로인 것
          </p>
          <ul className="mt-4 space-y-4">
            {h.kept.map((k) => (
              <li key={k.point} className="text-[14px] font-light leading-[1.8] text-ink-700">
                <span className="block font-medium text-ink-900">{k.point}</span>
                {k.detail}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-hair-strong bg-white px-6 py-6">
          <p className="eyebrow flex items-center gap-2 text-brass-600">
            <Repeat2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            바뀐 것
          </p>
          <ul className="mt-4 space-y-4">
            {h.changed.map((c) => (
              <li key={c.point} className="text-[14px] font-light leading-[1.8] text-ink-700">
                <span className="block font-medium text-ink-900">{c.point}</span>
                {c.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 border-l-2 border-brass-400 bg-brass-50 px-6 py-5">
        <p className="flex items-center gap-2 text-[14px] font-medium text-ink-900">
          <Target className="h-4 w-4 text-brass-600" strokeWidth={1.75} />
          2027 준비에 주는 뜻 · T메디 판단
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] font-light leading-[1.8] text-ink-700">
          {h.meaning.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>

      <ul className="mt-6 list-disc space-y-1 pl-5 text-[12px] font-light leading-[1.7] text-ink-500">
        {h.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

/** 대학 페이지의 짧은 상자 — 그 대학에만 성립하는 문장(notes)을 앞에, 유형별 흐름 한 줄(shifts)을 뒤에 */
export function UnivShiftBox({
  univShort,
  tag,
  notes,
  shifts,
}: {
  univShort: string;
  tag?: string | null;
  notes: string[];
  shifts: InterviewShift[];
}) {
  return (
    <div className="mx-auto max-w-4xl border border-hair-strong bg-white px-6 py-7 sm:px-8">
      <p className="eyebrow flex items-center gap-2 text-brass-600">
        <History className="h-3.5 w-3.5" strokeWidth={1.75} />
        의대 면접의 흐름 속 {univShort}
      </p>
      {tag && (
        <p className="display mt-3 text-[1.125rem] leading-snug text-ink-900">
          2027 {univShort} 면접 — {tag}
        </p>
      )}
      <ul className="mt-5 space-y-3">
        {notes.map((n) => (
          <li key={n} className="flex gap-3 text-[14px] font-light leading-[1.8] text-ink-700">
            <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-brass-400" />
            <span>{n}</span>
          </li>
        ))}
        {shifts.map((s) => (
          <li key={s.id} className="flex gap-3 text-[14px] font-light leading-[1.8] text-ink-700">
            <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-jade-400" />
            <span>
              <Link href={`/interview/uidae#history-${s.id}`} className="font-medium text-ink-900 underline-offset-4 hover:underline">
                {s.title}
              </Link>
              {" — "}
              {s.short}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/interview/uidae#history"
        className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-jade-700 underline-offset-4 hover:underline"
      >
        의대 면접이 바뀌어 온 흐름 전체 보기
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Link>
    </div>
  );
}
