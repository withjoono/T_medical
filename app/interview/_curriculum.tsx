import { ClipboardCheck, Layers, NotebookPen, UserCheck } from "lucide-react";
import { PromoSection } from "../_site/components";
import { curriculumFor } from "@/lib/class-curriculum";

/** 대학별 수업 회차 구성 — 데이터는 lib/class-curriculum.ts. 해당 없는 대학은 아무것도 그리지 않는다. */
export function ClassCurriculum({ path }: { path: string }) {
  const c = curriculumFor(path);
  if (!c) return null;
  return (
    <PromoSection eyebrow="CURRICULUM" EyebrowIcon={Layers} title={c.title} subtitle={c.summary}>
      <p className="mx-auto max-w-3xl text-center text-[15px] font-light leading-[1.9] text-ink-600">
        {c.lede}
      </p>

      <ol className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
        {c.sessions.map((s) => (
          <li key={s.title} className="flex flex-col border border-hair-strong bg-paper-50">
            <div className="border-b border-hair px-6 py-5">
              <p className="display text-[1.125rem] leading-snug text-ink-900">{s.title}</p>
              <p className="mt-1.5 text-[12px] font-medium text-brass-600">{s.teacher}</p>
            </div>
            <div className="flex flex-1 flex-col gap-4 px-6 py-5">
              {s.checks && (
                <p className="flex gap-2 text-[13px] leading-[1.75] text-jade-700">
                  <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                  <span>
                    <span className="font-semibold">검사</span> — {s.checks}
                  </span>
                </p>
              )}
              <ul className="space-y-2.5">
                {s.does.map((d) => (
                  <li key={d} className="text-[13px] font-light leading-[1.8] text-ink-700">
                    · {d}
                  </li>
                ))}
              </ul>
              {s.homework && (
                <p className="mt-auto flex gap-2 border-t border-hair pt-4 text-[13px] leading-[1.75] text-ink-600">
                  <NotebookPen className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" strokeWidth={1.75} />
                  <span>
                    <span className="font-semibold">과제</span> — {s.homework}
                  </span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 max-w-3xl border-2 border-brass bg-ink px-7 py-7 text-paper">
        <p className="flex items-center gap-2 text-[15px] font-semibold">
          <UserCheck className="h-5 w-5 text-brass-300" strokeWidth={1.75} />
          {c.why.title}
        </p>
        <div className="mt-4 space-y-3">
          {c.why.body.map((b) => (
            <p key={b} className="text-[14px] font-light leading-[1.85] text-paper/85">
              {b}
            </p>
          ))}
        </div>
      </div>
    </PromoSection>
  );
}
