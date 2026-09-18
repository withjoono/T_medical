import Link from "next/link";
import { CalendarDays, Check, TriangleAlert } from "lucide-react";
import type { UnivPage } from "@/lib/univ";
import { quotaByType } from "@/lib/univ";
import { formatKo } from "@/lib/mmi-schedule";

/** =========================================================================
 *  /univ 전용 블록. 전부 서버 컴포넌트다 — 숫자가 HTML 에 박혀야 검색엔진이 읽는다.
 *  ========================================================================= */

/* -------------------------------------------------------------------------
 * 숫자 줄
 * ---------------------------------------------------------------------- */

export function UnivStatRow({
  items,
  caption,
}: {
  items: { label: string; value: string; unit?: string; sub?: string }[];
  caption?: string;
}) {
  return (
    <section className="border-t border-hair bg-paper px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid border-l border-t border-hair sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <div key={s.label} className="border-b border-r border-hair px-6 py-7">
              <p className="eyebrow text-brass-600">{s.label}</p>
              <p className="display tnum mt-3 text-[2rem] leading-none text-ink-900">
                {s.value}
                {s.unit && (
                  <span className="ml-1.5 align-middle text-sm font-light text-ink-400">
                    {s.unit}
                  </span>
                )}
              </p>
              {s.sub && (
                <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-500">
                  {s.sub}
                </p>
              )}
            </div>
          ))}
        </div>
        {caption && (
          <p className="mt-5 text-xs font-light text-ink-400">{caption}</p>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 전형 안내 — 유형별 표
 * ---------------------------------------------------------------------- */

function dash(v?: string | number | null) {
  if (v === null || v === undefined || v === "" || v === "0") return "—";
  return String(v);
}

export function AdmissionTables({ univ }: { univ: UnivPage }) {
  const a = univ.admission;
  if (!a) {
    return (
      <p className="mx-auto max-w-2xl text-center text-sm font-light leading-[1.9] text-ink-500">
        이 대학의 의예과 전형 데이터는 아직 수집되지 않았습니다. 면접 정보만 아래에서 확인하실 수 있습니다.
      </p>
    );
  }

  const groups = quotaByType(univ);

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      {groups.map((g) => {
        const units = a.units.filter((u) => (u.type ?? "기타") === g.type);
        return (
          <div key={g.type}>
            <div className="flex items-baseline justify-between border-b border-hair-strong pb-3">
              <h3 className="display text-[1.25rem] text-ink-900">
                {g.type}전형
              </h3>
              <p className="tnum text-[13px] font-light text-ink-500">
                {g.programs}개 전형 · {g.quota}명
              </p>
            </div>
            <div
              role="region"
              aria-label={`${univ.short} ${g.type}전형 목록`}
              tabIndex={0}
              className="comparison-scroll mt-4 overflow-x-auto border border-hair bg-paper-50"
            >
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink text-paper">
                    {["전형명", "모집", "선발모형", "1단계", "수능최저"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3.5 text-[12px] font-semibold tracking-tight ${
                          i > 0 ? "border-l border-white/10" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {units.map((u, i) => (
                    <tr
                      key={(u.program ?? "") + i}
                      className={`align-top transition-colors hover:bg-jade-50 ${
                        i % 2 === 1 ? "bg-paper-100/60" : ""
                      }`}
                    >
                      <td className="border-t border-hair px-4 py-3.5 font-medium text-ink-900">
                        {u.program ?? "—"}
                        {u.unit && u.unit !== "의예과" && (
                          <span className="ml-1.5 text-[12px] font-light text-ink-400">
                            ({u.unit})
                          </span>
                        )}
                      </td>
                      <td className="tnum border-t border-hair px-4 py-3.5 text-ink-700">
                        {u.quota ? `${u.quota}명` : "—"}
                      </td>
                      <td className="border-t border-hair px-4 py-3.5 text-ink-500">
                        {dash(u.model)}
                      </td>
                      <td className="tnum border-t border-hair px-4 py-3.5 text-ink-500">
                        {u.ratio && u.ratio !== 100 ? `${u.ratio}%` : dash(u.model === "일괄합산" ? "일괄" : null)}
                      </td>
                      <td className="border-t border-hair px-4 py-3.5 text-[13px] font-light leading-relaxed text-ink-500">
                        {u.minimum ? u.minimum : <span className="text-ink-300">공시 없음</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 면접 안내 — 전형별 일정표
 * ---------------------------------------------------------------------- */

export function InterviewTable({ univ }: { univ: UnivPage }) {
  const tracks = univ.interview?.tracks ?? [];
  if (tracks.length === 0) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <div
        role="region"
        aria-label={`${univ.short} 면접 전형별 일정`}
        tabIndex={0}
        className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              {["전형", "1단계 발표", "면접일", "선발배수", "반영비율", "수능최저"].map(
                (h, i) => (
                  <th
                    key={h}
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
            {tracks.map((t, i) => (
              <tr
                key={t.id}
                className={`align-top transition-colors hover:bg-jade-50 ${
                  i % 2 === 1 ? "bg-paper-100/60" : ""
                }`}
              >
                <td className="border-t border-hair px-4 py-4 font-medium text-ink-900">
                  {t.name}
                  {t.interviewNote && (
                    <span className="mt-1 block text-[12px] font-light leading-relaxed text-ink-400">
                      {t.interviewNote}
                    </span>
                  )}
                </td>
                <td className="tnum border-t border-hair px-4 py-4 text-ink-700">
                  {t.announce ? formatKo(t.announce) : <span className="text-ink-300">미공지</span>}
                  {t.announceNote && (
                    <span className="mt-1 block text-[12px] font-light text-ink-400">
                      {t.announceNote}
                    </span>
                  )}
                </td>
                <td className="tnum border-t border-hair px-4 py-4 font-medium text-jade-700">
                  {t.interview ? formatKo(t.interview) : <span className="font-normal text-ink-300">미공지</span>}
                </td>
                <td className="tnum border-t border-hair px-4 py-4 text-ink-500">
                  {dash(t.multiple)}
                </td>
                <td className="border-t border-hair px-4 py-4 text-[13px] font-light leading-relaxed text-ink-500">
                  {dash(t.weight)}
                </td>
                <td className="border-t border-hair px-4 py-4 text-[13px] font-light leading-relaxed text-ink-500">
                  {dash(t.minimum)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 작은 조각
 * ---------------------------------------------------------------------- */

export function FactList({ items }: { items: string[] }) {
  return (
    <ul className="mx-auto max-w-3xl space-y-3">
      {items.map((f) => (
        <li key={f} className="flex gap-3 border-b border-hair pb-3 last:border-0">
          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-jade-600" strokeWidth={2.5} />
          <span className="text-[14px] font-light leading-[1.85] text-ink-700">{f}</span>
        </li>
      ))}
    </ul>
  );
}

/** 요강 미확인 경고 — confidence 가 low 인 대학에만 띄운다. */
export function UnverifiedNotice({ univ }: { univ: UnivPage }) {
  return (
    <div className="mx-auto max-w-3xl border-l-2 border-brass bg-brass-50 px-6 py-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-brass-600">
        <TriangleAlert className="h-4 w-4" strokeWidth={1.75} />
        요강 원문을 확인하지 못했습니다
      </p>
      <p className="mt-2 text-[13px] font-light leading-[1.8] text-ink-600">
        {univ.short}는 입학처 공개 자료에 접근하지 못해 일정·전형 수치를 확정하지 못했습니다. 이 페이지의 내용은
        참고용이며, 지원 전 반드시 해당 대학 입학처 모집요강에서 직접 확인하세요.
      </p>
    </div>
  );
}

/** 면접일 한 줄 요약 — 히어로 아래 배치. */
export function InterviewDates({ univ }: { univ: UnivPage }) {
  const days = [
    ...new Set(
      (univ.interview?.tracks ?? [])
        .map((t) => t.interview)
        .filter((d): d is string => Boolean(d)),
    ),
  ].sort();
  if (days.length === 0) return null;
  return (
    <p className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-light text-ink-500">
      <CalendarDays className="h-3.5 w-3.5 text-brass-600" strokeWidth={1.75} />
      면접일
      {days.map((d) => (
        <span key={d} className="tnum border border-hair bg-paper px-2.5 py-1 text-ink-700">
          {formatKo(d)}
        </span>
      ))}
    </p>
  );
}

/** 대학 카드 — 허브에서 권역별로 나열한다. */
export function UnivCard({ univ }: { univ: UnivPage }) {
  const tracks = univ.interview?.tracks ?? [];
  const quota = univ.admission?.quota;
  return (
    <Link
      href={`/univ/${univ.slug}`}
      className="link-card group relative flex flex-col p-6 transition-colors duration-300"
    >
      <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />
      <h3 className="display text-[1.0625rem] leading-snug text-ink-900">
        <span className="link-underline">{univ.short}</span>
      </h3>
      <p className="mt-1.5 text-[12px] font-light text-ink-400">{univ.region}</p>
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-light text-ink-500">
        {quota != null && <span className="tnum">수시 {quota}명</span>}
        {univ.hasInterview === false ? (
          <span className="text-ink-400">면접 미실시</span>
        ) : tracks.length > 0 ? (
          <span className="tnum text-jade-700">면접 {tracks.length}개 전형</span>
        ) : null}
        {univ.hasClassPage && <span className="text-brass-600">MMI 특강</span>}
      </div>
    </Link>
  );
}
