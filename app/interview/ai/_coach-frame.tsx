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

    // iframe 은 정적 HTML 에 들어 있어 하이드레이션 전에 이미 높이를 보냈을 수 있다(그 메시지는 놓친다).
    // 같은 출처라 직접 잴 수 있으니, 붙는 즉시 + load 때 한 번 더 잰다. 이후 변화는 메시지로 받는다.
    const frame = frameRef.current;
    const measure = () => {
      const h = frame?.contentDocument?.documentElement.scrollHeight;
      if (h) setHeight(Math.max(600, h));
    };
    measure();
    frame?.addEventListener("load", measure);
    return () => {
      window.removeEventListener("message", onMessage);
      frame?.removeEventListener("load", measure);
    };
  }, [current.key]);

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
        // 테두리(위아래 1px)만큼 더한다 — 빼먹으면 iframe 안에 2px 스크롤바가 생긴다
        style={{ height: height + 2 }}
      />
    </div>
  );
}
