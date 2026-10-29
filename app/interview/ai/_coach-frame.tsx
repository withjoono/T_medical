"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COACH_TRACKS, coachSetSrc, coachSrc } from "@/lib/ai-interview";
import type { PickerEntry } from "@/lib/interview-sets";

/** AI 모의면접 iframe + 면접 고르기(학과 → 대학 → 전형).
 *  본체는 Interview 저장소에서 빌드돼 public/ai-interview 에 들어온다(같은 출처).
 *  iframe 문서에 자체 CSP 가 걸려 있어, 이 사이트의 분석 스크립트와 무관하게 영상·음성은 기기 밖으로 나가지 않는다.
 *
 *  대학을 고르면 그 대학 기출로 만든 면접 세트(public/interview-sets, lib/interview-sets.ts)를 `#set=` 으로 넘긴다.
 *  고르지 않으면 학과별 공통 질문(COACH_TRACKS)을 `#q=` 로 넘긴다.
 *  고른 세트는 주소 `?set=<세트 id>` 로 남는다 — 대학 페이지에서 바로 이 세트로 보낼 때도 쓴다. */
const FIELDS = COACH_TRACKS.map((t) => ({ key: t.key, label: t.label }));
const KOREA_MMI = { univ: "고려대", field: "uidae" };

export function CoachFrame({ entries, onMmi }: { entries: PickerEntry[]; onMmi?: () => void }) {
  const [field, setField] = useState(FIELDS[0].key);
  const [univ, setUniv] = useState("");
  const [setId, setSetId] = useState("");
  const [height, setHeight] = useState(900);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const univs = useMemo(() => {
    const total = new Map<string, number>();
    for (const e of entries) if (e.field === field) total.set(e.univ, e.univItems);
    return [...total.entries()].sort((a, b) => a[0].localeCompare(b[0], "ko")).map(([name, n]) => ({ name, n }));
  }, [entries, field]);
  const tracks = useMemo(() => entries.filter((e) => e.field === field && e.univ === univ), [entries, field, univ]);
  const current = tracks.find((e) => e.id === setId) ?? tracks[0];
  const generic = COACH_TRACKS.find((t) => t.key === field) ?? COACH_TRACKS[0];
  const src = current ? coachSetSrc(current.path) : coachSrc(generic.questions);

  // 주소에 ?set= 이 있으면 그 세트로 연다(대학 페이지·공유 링크)
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("set");
    const e = id ? entries.find((x) => x.id === id) : undefined;
    if (!e) return;
    setField(e.field);
    setUniv(e.univ);
    setSetId(e.id);
  }, [entries]);

  const remember = (id: string) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("set", id);
    else url.searchParams.delete("set");
    window.history.replaceState({}, "", url.toString());
  };
  const pickField = (k: string) => {
    setField(k);
    setUniv("");
    setSetId("");
    remember("");
  };
  const pickUniv = (name: string) => {
    setUniv(name);
    const first = entries.find((e) => e.field === field && e.univ === name);
    setSetId(first?.id ?? "");
    remember(first?.id ?? "");
  };
  const pickTrack = (id: string) => {
    setSetId(id);
    remember(id);
  };

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
  }, [src]);

  const chip = (on: boolean) =>
    "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors " +
    (on ? "border-jade-700 bg-jade-700 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-jade-600");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 border border-ink-100 bg-white px-4 py-5 sm:px-6">
        <p className="text-[15px] font-semibold text-ink-900">어떤 면접을 연습할까요?</p>

        <div className="mt-4 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="학과">
          <span className="mr-1 w-full text-[12px] font-semibold text-ink-400 sm:w-auto">1. 학과</span>
          {FIELDS.map((f) => (
            <button key={f.key} type="button" role="radio" aria-checked={f.key === field} onClick={() => pickField(f.key)} className={chip(f.key === field)}>
              {f.label}
            </button>
          ))}
        </div>

        <label className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 w-full text-[12px] font-semibold text-ink-400 sm:w-auto">2. 대학</span>
          <select
            value={univ}
            onChange={(e) => (e.target.value ? pickUniv(e.target.value) : pickField(field))}
            className="min-w-0 flex-1 border border-ink-200 bg-white px-3 py-2 text-[14px] text-ink-900 sm:max-w-sm"
          >
            <option value="">대학을 고르지 않고 공통 질문으로 연습</option>
            {univs.map((u) => (
              <option key={u.name} value={u.name}>
                {u.name} — {u.n}문항
              </option>
            ))}
          </select>
        </label>

        {univ && tracks.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="전형">
            <span className="mr-1 w-full text-[12px] font-semibold text-ink-400 sm:w-auto">3. 전형</span>
            {tracks.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={t.id === current?.id} onClick={() => pickTrack(t.id)} className={chip(t.id === current?.id)}>
                {t.track} <span className="font-normal opacity-75">{t.items}</span>
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
          {current ? (
            <>
              {current.kind === "대학 예시문항"
                ? "대학이 공개한 예시문항입니다(기출 아님). "
                : "대학이 공개한 2025·2026학년도 면접 문항을 요약했습니다. 문항마다 공개 범위(의예과 · 전 계열 공통 등)를 함께 적었습니다. "}
              {current.page && (
                <a href={current.page} className="font-semibold text-jade-700 underline underline-offset-2">
                  {current.univ} 기출 분석 보기
                </a>
              )}
            </>
          ) : (
            <>{generic.label} 면접에서 자주 나오는 공통 질문으로 연습합니다. 지원 대학을 고르면 그 대학 기출로 바뀝니다.</>
          )}
        </p>
        {univ === KOREA_MMI.univ && field === KOREA_MMI.field && onMmi && (
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
            고려대 의학과 인·적성 면접은 AI 면접관이 꼬리질문을 하는{" "}
            <button type="button" onClick={onMmi} className="font-semibold text-jade-700 underline underline-offset-2">
              MMI 실전 모의면접
            </button>
            으로도 연습할 수 있습니다.
          </p>
        )}
      </div>
      <iframe
        ref={frameRef}
        key={src}
        src={src}
        title="AI 모의면접"
        allow="camera; microphone; autoplay"
        className="block w-full rounded-2xl border border-ink-100 bg-white"
        // 테두리(위아래 1px)만큼 더한다 — 빼먹으면 iframe 안에 2px 스크롤바가 생긴다
        style={{ height: height + 2 }}
      />
    </div>
  );
}
