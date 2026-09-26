import { CalendarDays, Check } from "lucide-react";
import { formatKo } from "@/lib/mmi-schedule";
import type { ChidaeUniv } from "@/lib/chidae-interview";

/** =========================================================================
 *  /interview/chidae 전용 블록. 전부 서버 컴포넌트다 —
 *  대학·전형·일정이 HTML 에 박혀야 색인된다.
 *  ========================================================================= */

const TONE: Record<ChidaeUniv["style"], string> = {
  jesimun: "border-jade-200 bg-jade-50 text-jade-700",
  injeokseong: "border-brass-200 bg-brass-50 text-brass-600",
  none: "border-hair bg-paper-100 text-ink-400",
};

export function ChidaeUnivCards({ univs }: { univs: ChidaeUniv[] }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {univs.map((u) => {
        const iv = u.tracks.filter((t) => t.interview);
        return (
          <article key={u.slug} className="border border-hair-strong bg-white p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="display text-[1.25rem] leading-snug text-ink-900">{u.short}</h3>
              <span className="text-[12px] font-light text-ink-400">{u.zone}</span>
              <span
                className={`border px-2 py-0.5 text-[11px] font-semibold tracking-tight ${TONE[u.style]}`}
              >
                {u.styleLabel}
              </span>
            </div>

            <p className="mt-3 text-[15px] font-light leading-[1.8] text-ink-700">{u.headline}</p>
            <p className="mt-1 text-[12px] font-light text-ink-400">{u.name}</p>

            <div className="mt-7 grid gap-8 lg:grid-cols-2">
              <div>
                <p className="eyebrow text-brass-600">요강에 적힌 면접 방식</p>
                <ul className="mt-4 space-y-2.5">
                  {u.format.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2.5 text-[13px] font-light leading-[1.75] text-ink-600"
                    >
                      <Check
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-jade-600"
                        strokeWidth={2}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow text-brass-600">훈련 포인트</p>
                <ul className="mt-4 space-y-2.5">
                  {u.drills.map((d) => (
                    <li
                      key={d}
                      className="flex gap-2.5 text-[13px] font-light leading-[1.75] text-ink-600"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass-400" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {iv.length > 0 && (
              <div
                role="region"
                aria-label={`${u.short} 면접 실시 전형`}
                tabIndex={0}
                className="comparison-scroll mt-8 overflow-x-auto border border-hair"
              >
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-paper-100">
                      {["면접 실시 전형", "모집", "반영 비율", "1단계 발표", "면접일"].map((h) => (
                        <th
                          key={h}
                          className="border-b border-hair px-4 py-3 text-[12px] font-semibold tracking-tight text-ink-700"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {iv.map((t) => (
                      <tr key={t.name} className="align-top">
                        <td className="border-b border-hair px-4 py-3 font-medium text-ink-900">
                          {t.name}
                          <span className="ml-1.5 text-[11px] font-light text-ink-400">
                            {t.kind}
                          </span>
                        </td>
                        <td className="tnum border-b border-hair px-4 py-3 text-ink-600">
                          {t.quota === null ? "—" : `${t.quota}명`}
                        </td>
                        <td className="border-b border-hair px-4 py-3 text-[12px] font-light leading-relaxed text-ink-600">
                          {t.weight}
                        </td>
                        <td className="tnum border-b border-hair px-4 py-3 text-ink-500">
                          {t.announce ? formatKo(t.announce) : "미공지"}
                        </td>
                        <td className="tnum border-b border-hair px-4 py-3 font-medium text-jade-700">
                          {t.date ? formatKo(t.date) : "미공지"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {u.notes?.map((n) => (
              <p
                key={n}
                className="mt-5 flex gap-2.5 bg-brass-50 px-5 py-3 text-[12px] font-light leading-relaxed text-ink-600"
              >
                <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass-600" strokeWidth={1.75} />
                <span>{n}</span>
              </p>
            ))}
          </article>
        );
      })}
    </div>
  );
}
