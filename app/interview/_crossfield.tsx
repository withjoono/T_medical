import Link from "next/link";
import { ArrowRight, CalendarDays, Link2 } from "lucide-react";
import {
  relativeDateNote,
  type CrossFieldLink,
  type PeerContext,
} from "@/lib/field-crosslinks";
import type { FieldPage } from "@/lib/field-registry";
import { BUNDLE, formatKo } from "@/lib/mmi-schedule";
import { CLASS_PRICE, SESSION_HOURS_LABEL } from "@/lib/interview-types";

/** =========================================================================
 *  대학 면접 페이지의 '맥락' 블록 — 2026-10-24 검색 노출 개선.
 *
 *  1) CrossFieldLinks — 같은 대학의 다른 계열 면접으로 건너가는 링크.
 *     이미 색인된 페이지(/univ/<slug>, /interview/uidae/<slug>)에서 치·한·약·수
 *     페이지로 가는 길을 만든다. 검색엔진의 발견 경로이자 복수 지원자의 동선이다.
 *  2) FieldPeerFacts — 같은 계열 대학들과 비교한 사실(lib/field-crosslinks).
 *     공통 문구 대신 이 페이지에만 성립하는 문장을 싣는 자리다.
 *  3) FieldClassLine — 공통 수업 안내를 한 줄로. 89개 페이지에 같은 큰 블록을
 *     되풀이하던 ClassCtaBand 의 자리를 대신한다(상세는 /interview).
 *  전부 서버 컴포넌트다.
 *  ========================================================================= */

export function CrossFieldLinks({
  links,
  mine,
  univShort,
}: {
  links: CrossFieldLink[];
  /** 지금 페이지의 가장 이른 면접일 — 있으면 다른 계열과 며칠 차이인지 붙인다 */
  mine?: string | null;
  univShort: string;
}) {
  if (links.length === 0) return null;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-px bg-hair sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => {
          const note = mine === undefined ? (l.none ? "면접 없음" : l.first ? formatKo(l.first) : "면접일 미공지") : relativeDateNote(mine, l);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col bg-white p-6 transition-colors duration-300 hover:bg-paper-50"
            >
              <p className="eyebrow text-brass-600">{l.fieldShort} 면접</p>
              <p className="display mt-3 text-[1.0625rem] leading-snug text-ink-900">
                {univShort} {l.unitLabel}
              </p>
              <p className="mt-2 text-[13px] font-light text-ink-600">{l.styleLabel}</p>
              <p className="mt-4 flex items-center gap-1.5 text-[12px] font-light text-ink-400">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-jade-600" strokeWidth={1.75} />
                {note}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-ink-900">
                면접 페이지
                <ArrowRight
                  className="h-3.5 w-3.5 text-brass-600 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function FieldPeerFacts({
  field,
  ctx,
}: {
  field: FieldPage;
  ctx: PeerContext;
}) {
  if (ctx.facts.length === 0) return null;
  return (
    <div className="mx-auto max-w-4xl">
      <dl className="divide-y divide-hair border-y border-hair">
        {ctx.facts.map((f) => (
          <div key={f.label} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="eyebrow pt-0.5 text-brass-600">{f.label}</dt>
            <dd className="text-[14px] font-light leading-[1.8] text-ink-700">{f.text}</dd>
          </div>
        ))}
      </dl>
      {ctx.sameDay.length > 0 && (
        <div className="mt-6">
          <p className="text-[13px] font-light text-ink-600">
            같은 날 면접이 있는 {field.short} — 복수 지원이라면 둘 중 하나를 고르게 됩니다.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ctx.sameDay.map((s) => (
              <Link
                key={s.slug}
                href={`${field.base}/${s.slug}`}
                className="inline-flex items-center gap-1.5 border border-hair-strong bg-white px-3.5 py-2 text-[13px] font-light text-ink-700 transition-colors hover:border-jade-600 hover:text-ink-900"
              >
                <Link2 className="h-3.5 w-3.5 text-jade-600" strokeWidth={1.75} />
                {s.short} {field.unitLabel}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 공통 수업 안내 한 줄 — 상세(절차·강사·비용)는 /interview 에 한 번만 둔다. */
export function FieldClassLine({
  subject,
  teacher,
}: {
  /** "경희대 치의예과 면접" */
  subject: string;
  /** 담당 선생님 이름. 면접 미실시면 생략 */
  teacher?: string;
}) {
  return (
    <section className="border-t border-hair bg-ink px-6 py-10 text-paper sm:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] font-light leading-[1.8] text-paper/85">
          <span className="font-semibold text-paper">{subject} 수업</span>
          {teacher ? ` · ${teacher} 선생님` : ""} · 줌 1:1 {SESSION_HOURS_LABEL} · 선생님 1회 + AI 무제한{" "}
          <span className="tnum font-semibold text-brass-300">{BUNDLE.priceLabel}</span>
          <span className="text-paper/55"> (수업만 {CLASS_PRICE.label})</span>
        </p>
        <div className="flex shrink-0 gap-3">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 border border-paper bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-paper-100"
          >
            문의하기
          </Link>
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 border border-paper/40 px-5 py-2.5 text-sm font-light text-paper hover:border-paper"
          >
            수업 절차·강사
          </Link>
        </div>
      </div>
    </section>
  );
}
