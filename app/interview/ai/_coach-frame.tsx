"use client";

import { useEffect, useRef, useState } from "react";
import { COACH_TRACKS, coachSrc } from "@/lib/ai-interview";

/** AI 모의면접 iframe + 계열 선택.
 *  본체는 Interview 저장소에서 빌드돼 public/ai-interview 에 들어온다(같은 출처).
 *  iframe 문서에 자체 CSP 가 걸려 있어, 이 사이트의 분석 스크립트와 무관하게 영상·음성은 기기 밖으로 나가지 않는다. */
export function CoachFrame() {
  const [track, setTrack] = useState(COACH_TRACKS[0].key);
  const [height, setHeight] = useState(900);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const current = COACH_TRACKS.find((t) => t.key === track) ?? COACH_TRACKS[0];

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow) return;
      const data = e.data as { type?: string; height?: number };
      if (data?.type === "ai-coach:height" && typeof data.height === "number") {
        setHeight(Math.max(600, data.height));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="연습 질문 계열">
        <span className="mr-1 text-sm font-semibold text-ink-700">연습 질문</span>
        {COACH_TRACKS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === track}
            onClick={() => setTrack(t.key)}
            className={
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors " +
              (t.key === track
                ? "border-jade-700 bg-jade-700 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-jade-600")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <iframe
        ref={frameRef}
        key={current.key}
        src={coachSrc(current.questions)}
        title="AI 모의면접"
        allow="camera; microphone; autoplay"
        className="block w-full rounded-2xl border border-ink-100 bg-white"
        style={{ height }}
      />
    </div>
  );
}
