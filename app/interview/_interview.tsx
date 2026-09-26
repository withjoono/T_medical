import Link from "next/link";
import { ArrowRight, CalendarDays, MonitorPlay } from "lucide-react";
import { earliestInterview, interviewTrackCount } from "@/lib/univ";
import { formatKo } from "@/lib/mmi-schedule";
import {
  CLASS_PRICE,
  SESSION_HOURS_LABEL,
  type FinderUniv,
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
            {rows.map(({ univ, tag }, i) => {
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
                    <Link href={`/univ/${univ.slug}`} className="link-underline">
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
                      href={`/univ/${univ.slug}`}
                      className="group inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold tracking-tight text-ink-700 hover:text-jade-700"
                    >
                      {univ.hasClassPage ? "일정 · 예약" : "전형 보기"}
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
            href={`/univ/${univ.slug}`}
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
    tagline: string;
    count: number;
    also: number;
  }[];
}) {
  return (
    <div className="link-grid grid sm:grid-cols-3">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="link-card group relative flex flex-col p-8 transition-colors duration-300"
        >
          <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />
          <p className="tnum display text-[2.25rem] leading-none text-ink-900">
            {t.count}
            <span className="ml-1.5 align-middle text-sm font-light text-ink-400">
              개 의대
            </span>
          </p>
          <h3 className="display mt-5 flex items-center gap-2 text-[1.0625rem] leading-snug text-ink-900">
            <span className="link-underline">{t.name}</span>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-brass-600 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.75}
            />
          </h3>
          <p className="mt-3 text-[14px] font-light leading-[1.8] text-ink-500">
            {t.tagline}
          </p>
          {t.also > 0 && (
            <p className="mt-4 text-[12px] font-light text-brass-600">
              이 방식을 함께 다루는 대학 {t.also}곳 별도
            </p>
          )}
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
          href={`/univ/${u.slug}`}
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
export function ClassCtaBand({ typeName }: { typeName: string }) {
  return (
    <section className="border-t border-hair bg-ink px-6 py-14 text-paper sm:px-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
        <p className="eyebrow text-brass-300">{typeName} 대비 1:1 수업</p>
        <p className="display text-[1.5rem] leading-snug sm:text-[1.75rem]">
          줌 온라인 1:1 · 1회 {SESSION_HOURS_LABEL} ·{" "}
          <span className="tnum text-brass-300">{CLASS_PRICE.label}</span>
          <span className="text-[1rem] font-light text-paper/70"> {CLASS_PRICE.suffix}</span>
        </p>
        <p className="max-w-xl text-[14px] font-light leading-[1.85] text-paper/70">
          지원 대학과 면접일을 알려주시면 남은 기간에 맞춰 회차와 날짜를 잡아 드립니다.
          묶음 결제나 선납은 없습니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
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
            수업 절차 · 포함사항 자세히
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
                href={`/univ/${u.slug}`}
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
