"use client";

import { useEffect, useState } from "react";
import { Camera, MessagesSquare } from "lucide-react";
import { CoachFrame } from "./_coach-frame";
import { MmiSim } from "./_mmi-sim";
import type { PickerEntry } from "@/lib/interview-sets";

/** /interview/ai 의 두 모드.
 *  - 말하기·태도: Interview 저장소 코치(iframe, 기기 안 분석, 로그인 없음)
 *  - MMI 실전: 대학 형식 모의면접 + AI 꼬리질문 + 기준표 피드백(로그인, 서버) — _mmi-sim.tsx
 *  주소에 ?mode=mmi 가 있으면 MMI 실전 탭으로 연다(로그인 후 돌아올 때). */
const TABS = [
  { key: "coach", label: "말하기·태도 연습", sub: "카메라 · 로그인 없이", Icon: Camera },
  { key: "mmi", label: "MMI 실전 모의면접", sub: "AI 꼬리질문 · 답변 피드백", Icon: MessagesSquare },
] as const;
type TabKey = (typeof TABS)[number]["key"];

/** entries: 면접 세트 목록(lib/interview-sets.ts setIndex) — 말하기·태도 탭의 면접 고르기에 쓴다 */
export function AiTabs({ entries }: { entries: PickerEntry[] }) {
  const [tab, setTab] = useState<TabKey>("coach");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("mode") === "mmi" || window.location.hash === "#mmi") setTab("mmi");
  }, []);

  const pick = (k: TabKey) => {
    setTab(k);
    const url = new URL(window.location.href);
    if (k === "mmi") url.searchParams.set("mode", "mmi");
    else url.searchParams.delete("mode");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div>
      <div className="mx-auto mb-6 grid max-w-5xl grid-cols-2 gap-px border border-ink-100 bg-ink-100" role="tablist" aria-label="AI 모의면접 모드">
        {TABS.map((t) => {
          const on = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => pick(t.key)}
              className={`flex items-center gap-3 px-4 py-4 text-left transition-colors sm:px-6 ${on ? "bg-white" : "bg-paper-50 hover:bg-white"}`}
            >
              <t.Icon className={`h-5 w-5 shrink-0 ${on ? "text-jade-700" : "text-ink-400"}`} strokeWidth={1.75} />
              <span className="min-w-0">
                <span className={`block text-[14px] font-semibold sm:text-[15px] ${on ? "text-ink-900" : "text-ink-500"}`}>{t.label}</span>
                <span className="mt-0.5 block text-[11.5px] text-ink-400 sm:text-[12px]">{t.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
      {tab === "coach" ? <CoachFrame entries={entries} onMmi={() => pick("mmi")} /> : <MmiSim />}
    </div>
  );
}
