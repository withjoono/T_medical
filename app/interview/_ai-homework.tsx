"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeworkLoop, type AiLoop, type HomeworkKind } from "@/lib/ai-homework";

/** 숙제로 보는 AI 모의면접 한 번의 순서 — 카드와 주의 문구.
 *  서울대 의대는 _curriculum.tsx 가 정적으로 그리고(aiLoop), 그 밖의 대학 페이지는 HomeworkSteps 를
 *  **마운트 뒤에만** 그린다(공통 본문 중복 방지 — lib/ai-homework.ts 머리말). 제목·부제는 페이지(서버)가 그린다. */

export function AiLoopBody({ loop, showHead }: { loop: AiLoop; showHead: boolean }) {
  return (
    <div className="mx-auto max-w-5xl">
      {showHead && <p className="mx-auto max-w-3xl text-center text-[15px] font-light leading-[1.9] text-ink-600">{loop.lede}</p>}

      <ol className={`mt-10 grid gap-5 ${loop.steps.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {loop.steps.map((s) => (
          <li key={s.title} className="flex flex-col border border-hair-strong bg-white">
            <div className="border-b border-hair bg-paper-50 px-6 py-5">
              <p className="display text-[1.125rem] leading-snug text-ink-900">{s.title}</p>
              <p className="mt-1.5 text-[12px] font-medium text-brass-600">{s.when}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-3 px-6 py-5">
              {s.body.map((b) => (
                <li key={b} className="text-[13px] font-light leading-[1.85] text-ink-700">
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <ul className="mx-auto mt-8 max-w-3xl space-y-2 border-l-2 border-brass-400 pl-5">
        {loop.notes.map((n) => (
          <li key={n} className="text-[13px] font-light leading-[1.85] text-ink-600">
            {n}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center">
        <Link href="/interview/ai?mode=mmi" className="inline-flex items-center gap-2 text-[14px] font-semibold text-jade-700 underline underline-offset-4">
          MMI 실전 모의면접에서 직접 해 보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </p>
    </div>
  );
}

/** 서울대 의대 외 대학 페이지 — 마운트 뒤에만 그린다 */
export function HomeworkSteps({ kind }: { kind: HomeworkKind }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const loop = homeworkLoop(kind);
  if (!loop) return null;
  if (!ready) return <div className="min-h-[640px]" aria-hidden />;
  return <AiLoopBody loop={loop} showHead />;
}
