import Link from "next/link";
import { ArrowRight, CalendarDays, MonitorPlay } from "lucide-react";
import { earliestInterview, interviewTrackCount } from "@/lib/univ";
import {
  formatKo,
  AI_IN_CLASS,
  AI_TIERS,
  REFUND_EXAMPLES,
  TUITION,
} from "@/lib/mmi-schedule";
import {
  CLASS_PRICE,
  SESSION_HOURS_LABEL,
  type FinderUniv,
  type MedGlanceRow,
  type TypedUniv,
} from "@/lib/interview-types";

/** =========================================================================
 *  /interview 전용 블록. 전부 서버 컴포넌트다 — 대학·일정이 HTML 에 박혀야 색인된다.
 *
 *  대학 상세 서술은 여기에 싣지 않는다. /univ/<대학> 과 본문이 겹치면
 *  검색엔진이 둘 중 하나를 버린다. 이 표는 '어느 대학이 이 유형인가'까지만 보여주고
 *  나머지는 대학 페이지로 보낸다.
 *  ========================================================================= */

export function TypeUnivTable({
  rows,
  label,
}: {
  rows: TypedUniv[];
  label: string;
}) {
  if (rows.length === 0) return null;
  // 가장 이른 면접일 순(빠른 것부터). 미공지는 맨 아래, 같은 날은 가나다순.
  const sorted = [...rows].sort((a, b) => {
    const da = earliestInterview(a.univ);
    const db = earliestInterview(b.univ);
    if (da && db && da !== db) return da < db ? -1 : 1;
    if (!da !== !db) return da ? -1 : 1;
    return a.univ.short.localeCompare(b.univ.short, "ko");
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[780px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              {["대학", "권역", "요강에 적힌 면접 방식", "면접 전형", "가장 이른 면접일", ""].map(
                (h, i) => (
                  <th
                    key={h || "go"}
                    className={`px-4 py-4 text-[12px] font-semibold tracking-tight ${
                      i > 0 ? "border-l border-white/10" : ""
                    }`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ univ, tag }, i) => {
              const first = earliestInterview(univ);
              const tracks = interviewTrackCount(univ);
              return (
                <tr
                  key={univ.slug}
                  className={`align-top transition-colors hover:bg-jade-50 ${
                    i % 2 === 1 ? "bg-paper-100/60" : ""
                  }`}
                >
                  <td className="border-t border-hair px-4 py-4 font-medium text-ink-900">
                    <Link href={`/interview/uidae/${univ.slug}`} className="link-underline">
                      {univ.short}
                    </Link>
                    {univ.hasClassPage && (
                      <span className="mt-1.5 block text-[11px] font-light tracking-tight text-brass-600">
                        MMI 특강 개설
                      </span>
                    )}
                  </td>
                  <td className="border-t border-hair px-4 py-4 text-[13px] font-light text-ink-500">
                    {univ.zone}
                  </td>
                  <td className="border-t border-hair px-4 py-4 text-[13px] font-light leading-relaxed text-ink-700">
                    {tag ?? univ.interview?.styleLabel ?? "—"}
                  </td>
                  <td className="tnum border-t border-hair px-4 py-4 text-ink-500">
                    {tracks > 0 ? `${tracks}개 전형` : "—"}
                  </td>
                  <td className="tnum border-t border-hair px-4 py-4 font-medium text-jade-700">
                    {first ? (
                      formatKo(first)
                    ) : (
                      <span className="font-normal text-ink-300">미공지</span>
                    )}
                  </td>
                  <td className="border-t border-hair px-4 py-4">
                    <Link
                      href={`/interview/uidae/${univ.slug}`}
                      className="group inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold tracking-tight text-ink-700 hover:text-jade-700"
                    >
                      {univ.hasClassPage ? "일정 · 예약" : "면접 보기"}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        strokeWidth={2}
                      />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 주 유형은 다르지만 이 방식을 함께 다루는 대학 — 표 아래 칩 줄. */
export function AlsoUnivs({
  rows,
  note,
}: {
  rows: TypedUniv[];
  note: string;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="mx-auto mt-10 max-w-5xl border-l border-hair-strong pl-6">
      <p className="eyebrow text-brass-600">함께 보는 대학</p>
      <p className="mt-3 text-[14px] font-light leading-[1.85] text-ink-500">{note}</p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {rows.map(({ univ, tag }) => (
          <Link
            key={univ.slug}
            href={`/interview/uidae/${univ.slug}`}
            className="group border border-hair bg-paper px-3.5 py-2 text-[13px] font-light text-ink-700 transition-colors hover:border-jade-200 hover:bg-jade-50"
          >
            <span className="font-medium text-ink-900">{univ.short}</span>
            {tag && <span className="ml-2 text-[12px] text-ink-400">{tag}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** 유형 3개를 고르게 하는 카드 — 허브 상단. 탭 대신 쓴다(정적 export 라 탭은 JS 가 필요하다). */
export function TypeChooser({
  items,
}: {
  items: {
    href: string;
    name: string;
    short: string;
    tagline: string;
    count: number;
    also: number;
  }[];
}) {
  return (
    <div className="type-picker grid gap-5 sm:grid-cols-3">
      {items.map((t, i) => (
        <Link
          key={t.href}
          href={t.href}
          className="type-card group flex flex-col border border-hair-strong bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-jade-400 hover:shadow-[0_10px_30px_-18px_rgba(6,15,21,0.45)]"
        >
          <div className="flex items-baseline justify-between">
            <span className="display tnum text-sm text-brass-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="tnum text-[12px] font-light text-ink-400">
              실시 <span className="font-semibold text-ink-700">{t.count}</span>개 의대
            </span>
          </div>

          <h3 className="display mt-6 text-[1.25rem] leading-snug text-ink-900">
            {t.name}
          </h3>
          <p className="mt-3 grow text-[14px] font-light leading-[1.8] text-ink-500">
            {t.tagline}
          </p>
          {t.also > 0 && (
            <p className="mt-3 text-[12px] font-light text-brass-600">
              이 방식을 함께 다루는 대학 {t.also}곳 별도
            </p>
          )}

          {/* 클릭 유도 — 카드 안의 '버튼'. 실제로는 카드 전체가 링크다. */}
          <span className="mt-7 inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-[13px] font-medium text-paper transition-colors duration-300 group-hover:bg-jade-700 group-hover:border-jade-700">
            {t.short} 면접 대비 보기
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </span>
        </Link>
      ))}
    </div>
  );
}

/** 면접을 실시하지 않는 대학 — 허브 하단 한 줄. */
export function NoInterviewRow({
  univs,
}: {
  univs: { slug: string; short: string; region: string }[];
}) {
  if (univs.length === 0) return null;
  return (
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3">
      <CalendarDays className="h-4 w-4 text-brass-600" strokeWidth={1.75} />
      {univs.map((u) => (
        <Link
          key={u.slug}
          href={`/interview/uidae/${u.slug}`}
          className="border border-hair bg-paper px-4 py-2 text-[14px] font-light text-ink-700 transition-colors hover:border-jade-200 hover:bg-jade-50"
        >
          <span className="font-medium text-ink-900">{u.short}</span>
          <span className="ml-2 text-[12px] text-ink-400">{u.region}</span>
        </Link>
      ))}
    </div>
  );
}


/** 수업 상품 CTA 밴드 — 유형 페이지에 놓는 얇은 띠.
 *
 *  ⚠️ 수업 절차·포함사항·가격 상세는 /interview 한 곳에만 둔다.
 *     유형 페이지마다 PriceCard 를 반복하면 어느 페이지를 열어도 절반이 같은 내용이 된다.
 *     여기서는 '얼마·얼마나·어디서 자세히' 세 가지만 말하고 보낸다. */
/** 모든 대학·계열 페이지 하단의 수업 CTA.
 *
 *  ⚠️ 컨셉이 여기에 실린다 — 이 밴드가 의대 39개교 + 계열 50개교 + 허브까지
 *     한 번에 깔리므로, 컨셉 문구를 페이지마다 따로 쓰지 말고 여기만 고친다. */
export function ClassCtaBand({ typeName }: { typeName: string }) {
  return (
    <section className="border-t border-hair bg-ink px-6 py-16 text-paper sm:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow text-brass-300">{typeName} 대비</p>
        <p className="display mt-6 text-[1.5rem] leading-snug sm:text-[1.75rem]">
          반복은 <span className="text-brass-300">AI</span> 가, 판단은{" "}
          <span className="text-brass-300">선생님</span>이
        </p>
        <p className="mx-auto mt-5 max-w-xl text-[14px] font-light leading-[1.85] text-paper/70">
          면접은 아는 것을 늘려서 되는 일이 아니라 반복해 몸에 붙이는 일입니다. 그래서 반복은
          AI 모의면접이 맡고, 선생님 시간은 소재를 고르고 설계하는 데만 씁니다.
        </p>

        <div className="mx-auto mt-10 grid max-w-3xl gap-px bg-paper/15 sm:grid-cols-3">
          {[
            { no: "01", t: "AI 모의면접", d: "수업 전에 먼저 · 무제한" },
            { no: "02", t: `선생님 1:1 ${SESSION_HOURS_LABEL}`, d: "AI 기록을 펼치고 교정" },
            { no: "03", t: "1회부터", d: `3회 선결제 시 ${TUITION.pack.savingPerSessionLabel} ↓` },
          ].map((x) => (
            <div key={x.no} className="bg-ink px-5 py-6">
              <p className="tnum text-[11px] font-semibold tracking-[0.2em] text-brass-300">{x.no}</p>
              <p className="mt-3 text-[14px] font-semibold">{x.t}</p>
              <p className="mt-1.5 text-[12px] font-light text-paper/60">{x.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[15px] font-light text-paper/85">
          1회{" "}
          <span className="tnum text-[1.25rem] font-semibold text-brass-300">
            {CLASS_PRICE.label}
          </span>
          <span className="text-paper/55">
            {" "}
            · {TUITION.pack.sessions}회 선결제 {TUITION.pack.priceLabel}(회당{" "}
            {TUITION.pack.perSessionLabel}) · {AI_IN_CLASS.meta}
          </span>
        </p>
        <p className="mt-3 text-[13px] font-light text-paper/55">
          처음이시면 1회만 해 보셔도 됩니다. {TUITION.refund.rule}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 border border-paper bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper-100"
          >
            면접 수업 문의하기
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 border border-paper/30 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-paper/70"
          >
            <MonitorPlay className="h-4 w-4" strokeWidth={1.75} />
            수업 절차 · 비용 자세히
          </Link>
        </div>
      </div>
    </section>
  );
}

/** 대학으로 유형 찾기 — 허브의 1차 진입점.
 *
 *  ⚠️ 방문자는 자기 면접이 MMI 인지 모른다. 아는 것은 지원 대학 이름뿐이다.
 *     그래서 이 블록이 TypeChooser 보다 위에 온다. 누르면 그 대학 페이지로 보낸다. */
export function UnivFinder({
  zones,
}: {
  zones: { zone: string; univs: FinderUniv[] }[];
}) {
  const TONE: Record<string, string> = {
    mmi: "border-jade-200 bg-jade-50 text-jade-700",
    injeokseong: "border-brass-200 bg-brass-50 text-brass-600",
    jesimun: "border-hair-strong bg-paper-100 text-ink-600",
  };
  return (
    <div className="mx-auto max-w-5xl space-y-9">
      {zones.map(({ zone, univs }) => (
        <div key={zone} className="border-t border-hair pt-6">
          <p className="eyebrow text-brass-600">{zone}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {univs.map((u) => (
              <Link
                key={u.slug}
                href={`/interview/uidae/${u.slug}`}
                className="group inline-flex items-center gap-2 border border-hair-strong bg-white px-3.5 py-2.5 text-[13px] transition-colors hover:border-ink-300 hover:bg-paper-50"
              >
                <span className="font-medium tracking-tight text-ink-900">{u.short}</span>
                <span
                  className={`border px-1.5 py-0.5 text-[10px] font-semibold tracking-tight ${
                    u.type ? TONE[u.type.key] : "border-hair bg-paper-100 text-ink-400"
                  }`}
                >
                  {u.type ? u.type.short : "면접 없음"}
                </span>
                {u.hasClassPage && (
                  <CalendarDays
                    className="h-3.5 w-3.5 text-brass-500"
                    strokeWidth={1.75}
                    aria-label="수업 일정 공개"
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-xs font-light leading-relaxed text-ink-400">
        대학 이름을 누르면 그 대학의 전형 구조 · 면접 방식 · 면접 일정을 볼 수 있습니다.
        <CalendarDays className="mx-1.5 inline h-3.5 w-3.5 text-brass-500" strokeWidth={1.75} />
        표시가 있는 대학은 수업 일정과 남은 자리까지 공개합니다.
      </p>
    </div>
  );
}

/** 의예과 면접 한눈에 — 대학 · 방식 · 1차 발표 · 면접일. 계열 페이지의 한눈에 표와 같은 칼럼 순서다. */
export function MedGlanceTable({ rows }: { rows: MedGlanceRow[] }) {
  const SUNEUNG = "2026-11-19";
  const head = ["대학", "권역", "요강에 적힌 면접 방식", "면접 전형", "1차 발표", "면접일"];
  return (
    <div className="mx-auto max-w-5xl">
      <div
        role="region"
        aria-label="의예과 면접 한눈에"
        tabIndex={0}
        className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              {head.map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-4 text-[12px] font-semibold tracking-tight ${
                    i > 0 ? "border-l border-white/10" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ univ, tag, tracks, announce, date }, i) => (
              <tr
                key={univ.slug}
                className={`align-top transition-colors hover:bg-jade-50 ${
                  i % 2 === 1 ? "bg-paper-100/60" : ""
                }`}
              >
                <td className="border-t border-hair px-4 py-4 font-medium text-ink-900">
                  <Link href={`/interview/uidae/${univ.slug}`} className="link-underline">
                    {univ.short}
                  </Link>
                </td>
                <td className="border-t border-l border-hair px-4 py-4 text-[13px] font-light text-ink-500">
                  {univ.zone}
                </td>
                <td className="border-t border-l border-hair px-4 py-4 text-[13px] font-light leading-relaxed text-ink-700">
                  {tag}
                </td>
                <td className="tnum border-t border-l border-hair px-4 py-4 text-ink-500">
                  {tracks > 0 ? `${tracks}개 전형` : "—"}
                </td>
                <td className="tnum border-t border-l border-hair px-4 py-4 text-ink-600">
                  {announce ? formatKo(announce) : <span className="text-ink-300">미공지</span>}
                </td>
                <td className="tnum border-t border-l border-hair px-4 py-4 font-medium text-jade-700">
                  {date ? formatKo(date) : <span className="font-normal text-ink-300">미공지</span>}
                  {date && date < SUNEUNG && (
                    <span className="ml-2 border border-brass-200 bg-brass-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-tight text-brass-600">
                      수능 전
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px] font-light leading-relaxed text-ink-400">
        1차 발표·면접일은 대학별로 가장 이른 면접 전형 기준입니다. 전형별 일정은 대학을 누르면 나옵니다.
      </p>
    </div>
  );
}

/** 의·치·한·약·수 계열 카드 — /interview 허브의 1차 진입점.
 *  허브 → 계열 메인(대학 그리드) → 대학 페이지 3단 중 첫 단이다. 계열 메인에 있는 내용(대학 목록·일정표)은 여기 다시 싣지 않는다. */
export function FieldChooser({
  items,
}: {
  items: {
    href: string;
    name: string;
    unitLabel: string;
    tagline: string;
    count: number;
    first: string | null;
    last: string | null;
  }[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <Link
          key={f.href}
          href={f.href}
          className="group flex flex-col border border-hair-strong bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-jade-400 hover:shadow-[0_10px_30px_-18px_rgba(6,15,21,0.45)]"
        >
          <div className="flex items-baseline justify-between">
            <span className="display tnum text-sm text-brass-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="tnum text-[12px] font-light text-ink-400">
              면접 실시 <span className="font-semibold text-ink-700">{f.count}</span>개교
            </span>
          </div>

          <h3 className="display mt-6 text-[1.25rem] leading-snug text-ink-900">{f.name}</h3>
          <p className="mt-1 text-[12px] font-light text-ink-400">{f.unitLabel}</p>
          <p className="mt-3 grow text-[14px] font-light leading-[1.8] text-ink-500">
            {f.tagline}
          </p>
          {f.first && (
            <p className="tnum mt-4 flex items-center gap-1.5 text-[13px] font-medium text-jade-700">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
              면접일 {formatKo(f.first)}
              {f.last && f.last !== f.first && ` ~ ${formatKo(f.last)}`}
            </p>
          )}

          <span className="mt-7 inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-[13px] font-medium text-paper transition-colors duration-300 group-hover:bg-jade-700 group-hover:border-jade-700">
            대학별로 보기
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </span>
        </Link>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 가격표 — AI 단품 · 선생님 수업 · 묶음
 *
 *  ⚠️ 숫자를 여기에 쓰지 않는다. lib/mmi-schedule.ts 의 AI_TIERS / TUITION /
 *     AI_IN_CLASS 가 SSOT 다. status: "preparing" 인 항목은 '준비 중'으로 나가고
 *     결제 버튼이 붙지 않는다.
 * ---------------------------------------------------------------------- */

export function PriceTiers({ sessionLabel }: { sessionLabel: string }) {
  const preparing = AI_TIERS.filter((t) => t.status === "preparing").length;
  return (
    <div className="mx-auto max-w-4xl">
      {/* 본 상품은 '선생님 수업'이다. AI 단품표를 위에 두면 AI 를 따로 파는 것처럼 읽히므로
          반드시 수업이 먼저 오고, AI 단품은 맨 아래 부록으로 둔다. */}
      <div className="border border-hair-strong bg-white">
        <div className="border-b border-hair bg-paper-100 px-7 py-4">
          <p className="eyebrow text-brass-600">선생님 1:1 수업</p>
          <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-600">
            <strong className="font-semibold text-ink-900">{AI_IN_CLASS.structure}.</strong>{" "}
            {AI_IN_CLASS.why}
          </p>
        </div>
        <ul>
          <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hair px-7 py-4">
            <span className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-[15px] font-medium text-ink-900">1회</span>
              <span className="text-[12px] font-light text-ink-400">
                줌 1:1 · {sessionLabel} · {AI_IN_CLASS.meta}
              </span>
            </span>
            <span className="tnum text-[15px] font-semibold text-ink-900">
              {TUITION.perSessionLabel}
            </span>
          </li>
          <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-jade-50 px-7 py-5">
            <span className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="text-[15px] font-semibold text-ink-900">
                {TUITION.pack.sessions}회 선결제
              </span>
              <span className="text-[12px] font-light text-ink-500">
                회당 {TUITION.pack.perSessionLabel} · {TUITION.pack.savingPerSessionLabel} 할인
                (모두 {TUITION.pack.savingTotalLabel})
              </span>
            </span>
            <span className="tnum text-[15px] font-semibold text-jade-700">
              {TUITION.pack.priceLabel}
            </span>
          </li>
        </ul>

        {/* 환불 규칙 — 선결제를 받는 이상 이 블록이 가격표의 핵심이다 */}
        <div className="border-b border-hair px-7 py-5">
          <p className="text-[13px] font-semibold text-ink-900">
            처음이시면 1회만 해 보셔도 됩니다
          </p>
          <p className="mt-2 text-[13px] font-light leading-[1.8] text-ink-600">
            {TUITION.refund.rule}{" "}
            <span className="text-ink-900">{TUITION.refund.fairness}</span>
          </p>
          <ul className="mt-3 grid gap-px bg-hair sm:grid-cols-3">
            {REFUND_EXAMPLES.map((r) => (
              <li key={r.used} className="bg-white px-4 py-3">
                <p className="text-[12px] font-light text-ink-500">{r.label}</p>
                <p className="tnum mt-1 text-[15px] font-semibold text-ink-900">
                  {r.amount === 0 ? "환불 없음" : `${r.amount / 10000}만원`}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* AI 단품 — 수업을 듣지 않고 AI 만 쓰려는 경우 */}
        <div className="border-b border-hair bg-paper-100 px-7 py-4">
          <p className="eyebrow text-brass-600">AI 모의면접만 따로 쓰실 경우</p>
          <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-600">
            수업을 신청하시면 아래 가격은 적용되지 않습니다 — 수업에는 무제한으로 들어 있습니다.
            수업 없이 AI 만 쓰실 분을 위한 가격표입니다.
          </p>
        </div>
        <ul>
          {AI_TIERS.map((t) => (
            <li
              key={t.key}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hair px-7 py-4"
            >
              <span className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="text-[15px] font-medium text-ink-900">{t.label}</span>
                <span className="text-[12px] font-light text-ink-400">{t.meta}</span>
                {t.status === "preparing" && (
                  <span className="border border-hair bg-paper-100 px-2 py-0.5 text-[11px] font-semibold text-ink-400">
                    준비 중
                  </span>
                )}
              </span>
              <span
                className={`tnum text-[15px] font-semibold ${
                  t.price === 0 ? "text-jade-700" : "text-ink-900"
                }`}
              >
                {t.priceLabel}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 text-[12px] font-light leading-relaxed text-ink-400">
        수업료 외에 교재비·자료비를 따로 받지 않습니다.
        {preparing > 0 &&
          " ‘준비 중’ 인 AI 항목은 아직 과금하지 않습니다 — 지금 여는 실전 모의 형식이 고려대 의학과 하나뿐이고 제시문도 검수 전이라, 형식을 늘리고 검수를 마친 뒤에 엽니다. 그때까지는 무료로 쓰실 수 있습니다."}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 컨셉 한 줄 — 히어로 바로 아래. 본문을 읽기 전에 구조가 보여야 한다.
 * ---------------------------------------------------------------------- */

const CONCEPT_PANELS = [
  {
    no: "01",
    title: "먼저 AI 모의면접",
    body: "수업 전에 지원 대학 형식으로 돌립니다. 답변 구조·말 빠르기·시선·꼬리질문 대응이 기록으로 남습니다. 횟수 제한도 추가 비용도 없습니다.",
  },
  {
    no: "02",
    title: "그 기록으로 수업",
    body: "선생님은 AI 기록을 펼치고 무너진 지점만 짚습니다. 모의면접을 처음부터 돌리지 않으므로 100분을 전부 교정에 씁니다.",
  },
  {
    no: "03",
    title: "그래서 회차가 준다",
    body: "반복을 선생님 시간으로 사지 않습니다. 1회만 해 보고 정하셔도 되고, 3회를 미리 잡으시면 회당 2만원 싸집니다.",
  },
];

export function ConceptStrip({ sessionLabel }: { sessionLabel: string }) {
  return (
    <section className="border-t border-hair bg-ink px-6 py-20 text-paper sm:px-12 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow text-center text-brass-300">왜 회차가 적어도 되는가</p>
        <h2 className="display mt-6 text-center text-[1.75rem] leading-[1.3] sm:text-[2.25rem]">
          면접은 공부가 아니라 <span className="text-brass-300">훈련</span>입니다
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] font-light leading-[1.85] text-paper/70">
          아는 것을 늘려서 되는 일이 아니라, 압박 속에서 같은 구조를 반복해 몸에 붙이는 일입니다.
          그래서 반복과 판단을 갈라 놓았습니다.
        </p>

        <div className="mt-14 grid gap-px bg-paper/15 sm:grid-cols-3">
          {CONCEPT_PANELS.map((p) => (
            <div key={p.no} className="bg-ink px-7 py-8">
              <p className="tnum text-[12px] font-semibold tracking-[0.2em] text-brass-300">{p.no}</p>
              <h3 className="display mt-4 text-[1.0625rem] leading-snug">{p.title}</h3>
              <p className="mt-3 text-[13px] font-light leading-[1.8] text-paper/70">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <ShareCard
            tone="ink"
            src="/og/concept/concept.png"
            alt="면접은 공부가 아니라 훈련입니다 — AI 모의면접을 먼저 보고 그 기록으로 선생님이 수업합니다. 1회 35만원, 3회 선결제 99만원"
            caption="컨셉 한 장 요약 · 저장하거나 공유해서 쓰십시오"
          />
        </div>

        <p className="mt-12 text-center text-[15px] font-light text-paper/80">
          1회 <span className="tnum font-semibold text-brass-300">{CLASS_PRICE.label}</span>
          <span className="text-paper/50">
            {" "}
            · {TUITION.pack.sessions}회 선결제{" "}
            <span className="tnum font-semibold text-brass-300">{TUITION.pack.priceLabel}</span> · 줌
            1:1 {sessionLabel} · {AI_IN_CLASS.meta}
          </span>
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 가격 도식 — AI · 선생님 두 카드가 양옆, 묶음이 아래 가운데.
 * ---------------------------------------------------------------------- */

function PlanCard({
  eyebrow,
  title,
  price,
  priceNote,
  lines,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  price: string;
  priceNote?: string;
  lines: { label: string; value: string; muted?: boolean }[];
  tone?: "default" | "ink";
}) {
  const ink = tone === "ink";
  return (
    <div
      className={`flex flex-col border ${
        ink ? "border-ink bg-ink text-paper" : "border-hair-strong bg-white"
      }`}
    >
      <div className={`px-7 py-6 ${ink ? "border-b border-paper/15" : "border-b border-hair"}`}>
        <p className={`eyebrow ${ink ? "text-brass-300" : "text-brass-600"}`}>{eyebrow}</p>
        <h3 className={`display mt-4 text-[1.125rem] leading-snug ${ink ? "" : "text-ink-900"}`}>
          {title}
        </h3>
        <p className="mt-5 flex items-baseline gap-2">
          <span
            className={`tnum display text-[1.75rem] ${ink ? "text-brass-300" : "text-ink-900"}`}
          >
            {price}
          </span>
          {priceNote && (
            <span className={`text-[12px] font-light ${ink ? "text-paper/60" : "text-ink-400"}`}>
              {priceNote}
            </span>
          )}
        </p>
      </div>
      <ul className="flex-1 px-7 py-5">
        {lines.map((l) => (
          <li
            key={l.label}
            className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-2 text-[13px] ${
              ink ? "text-paper/80" : "text-ink-700"
            }`}
          >
            <span className={`font-light ${l.muted ? (ink ? "text-paper/45" : "text-ink-400") : ""}`}>
              {l.label}
            </span>
            <span
              className={`tnum font-medium ${
                l.muted ? (ink ? "text-paper/45" : "text-ink-400") : ""
              }`}
            >
              {l.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricePlans({ sessionLabel }: { sessionLabel: string }) {
  return (
    <div className="mx-auto max-w-5xl">
      {/* AI 는 선택지가 아니라 전제다 — 카드를 'AI / 선생님' 으로 가르지 않고
          결제 방식(1회 / 3회)으로 가른다. */}
      <div className="border border-hair-strong bg-ink px-7 py-6 text-paper">
        <p className="eyebrow text-brass-300">수업 구조</p>
        <p className="display mt-3 text-[1.25rem] leading-snug">{AI_IN_CLASS.structure}</p>
        <p className="mt-3 text-[13px] font-light leading-[1.8] text-paper/70">
          {AI_IN_CLASS.why} AI 모의면접은 따로 파는 상품이 아니라 수업의 교재입니다 — 수업을
          신청하시면 횟수 제한 없이 쓰십니다.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PlanCard
          eyebrow="처음이라면"
          title="1회"
          price={TUITION.perSessionLabel}
          priceNote={`줌 1:1 · ${sessionLabel}`}
          lines={[
            { label: "AI 모의면접", value: "무제한 포함" },
            { label: "수업 전 과제", value: "포함" },
            { label: "선결제", value: "없음" },
            { label: "먼저 해 보고 결정", value: "가능" },
          ]}
        />
        <PlanCard
          tone="ink"
          eyebrow="권장"
          title={`${TUITION.pack.sessions}회 선결제`}
          price={TUITION.pack.priceLabel}
          priceNote={`회당 ${TUITION.pack.perSessionLabel} · ${TUITION.pack.savingPerSessionLabel} 할인`}
          lines={[
            { label: "AI 모의면접", value: "무제한 포함" },
            { label: "아끼는 금액", value: TUITION.pack.savingTotalLabel },
            { label: "중간 환불", value: `회당 ${TUITION.refund.perSessionLabel} 차감` },
            { label: "할인분 반환", value: "없음" },
          ]}
        />
      </div>

      {/* 환불 — 선결제를 권하는 이상 같은 화면에 있어야 한다 */}
      <div className="mt-6 border border-hair-strong bg-white px-7 py-6">
        <p className="text-[14px] font-semibold text-ink-900">중간에 그만두시면</p>
        <p className="mt-2 text-[13px] font-light leading-[1.8] text-ink-600">
          {TUITION.refund.rule} <span className="text-ink-900">{TUITION.refund.fairness}</span>
        </p>
        <ul className="mt-4 grid gap-px bg-hair sm:grid-cols-3">
          {REFUND_EXAMPLES.map((r) => (
            <li key={r.used} className="bg-white px-4 py-3">
              <p className="text-[12px] font-light text-ink-500">{r.label}</p>
              <p className="tnum mt-1 text-[16px] font-semibold text-ink-900">
                {r.amount === 0 ? "환불 없음" : `${r.amount / 10000}만원`}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-[12px] font-light leading-relaxed text-ink-400">
        수업을 신청하지 않고 AI 모의면접만 쓰실 수도 있습니다. 실전 모의면접은 1회 무료로 체험하실 수
        있고, 그 뒤 가격은{" "}
        <Link href="/interview/ai#paths" className="underline underline-offset-2">
          AI 모의면접 페이지
        </Link>
        에 따로 있습니다.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 공유용 카드 이미지 — 네이버가 이미지 중심으로 노출하므로 본문에 실제로 띄운다.
 *  OG 태그로만 두면 이미지 검색에 잡히지 않는다.
 *  생성기: scripts/interview-og/concept.mjs
 * ---------------------------------------------------------------------- */

export function ShareCard({
  src,
  alt,
  caption,
  tone = "default",
}: {
  src: string;
  alt: string;
  caption: string;
  tone?: "default" | "ink";
}) {
  return (
    <figure className="mx-auto max-w-3xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1200}
        height={630}
        className={`w-full border ${tone === "ink" ? "border-paper/20" : "border-hair-strong"}`}
      />
      <figcaption
        className={`mt-4 text-center text-[12px] font-light leading-relaxed ${
          tone === "ink" ? "text-paper/50" : "text-ink-400"
        }`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
