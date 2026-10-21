"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** 브라우저 음성 인식(Web Speech API)으로 받아쓰기.
 *  크롬·엣지는 Google, 사파리는 Apple 서버에서 음성을 글로 바꾼다 — 동의 화면에 그대로 적는다.
 *  지원하지 않는 브라우저(파이어폭스 등)는 supported=false → 화면이 글 입력으로 바꾼다.
 *
 *  말하기 지표(대략값): 첫 인식까지 걸린 시간, 3초 넘는 침묵 횟수, 말한 시간. */

type Rec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

function getCtor(): (new () => Rec) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export type SpeechMetrics = { firstHeardAt: number | null; lastHeardAt: number | null; longSilences: number; speakingMs: number };

export function useSpeechTranscript() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const rec = useRef<Rec | null>(null);
  const want = useRef(false);
  const metrics = useRef<SpeechMetrics>({ firstHeardAt: null, lastHeardAt: null, longSilences: 0, speakingMs: 0 });

  useEffect(() => {
    setSupported(!!getCtor());
    return () => {
      want.current = false;
      rec.current?.abort();
    };
  }, []);

  const heard = () => {
    const now = Date.now();
    const m = metrics.current;
    if (m.firstHeardAt == null) m.firstHeardAt = now;
    if (m.lastHeardAt != null) {
      const gap = now - m.lastHeardAt;
      if (gap > 3000) m.longSilences += 1;
      m.speakingMs += Math.min(gap, 1500);
    }
    m.lastHeardAt = now;
  };

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) return;
    setError(null);
    want.current = true;
    const r = new Ctor();
    r.lang = "ko-KR";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e: any) => {
      heard();
      let fin = "";
      let mid = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) fin += res[0].transcript;
        else mid += res[0].transcript;
      }
      if (fin) setFinalText((t) => `${t}${t && !t.endsWith(" ") ? " " : ""}${fin.trim()}`);
      setInterim(mid);
    };
    r.onerror = (e: any) => {
      if (e?.error === "no-speech" || e?.error === "aborted") return;
      want.current = false;
      setError(
        e?.error === "not-allowed" || e?.error === "service-not-allowed"
          ? "마이크 사용이 막혀 있어요. 주소창 옆 자물쇠에서 마이크를 허용하거나, 글로 답해 주세요."
          : "음성 인식이 끊겼어요. 다시 눌러 주세요.",
      );
    };
    // 크롬은 침묵이 길면 스스로 끝난다 — 듣는 중이면 다시 켠다
    r.onend = () => {
      setInterim("");
      if (want.current) {
        try {
          r.start();
          return;
        } catch {
          /* 이미 시작됨 */
        }
      }
      setListening(false);
    };
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setError("음성 인식을 시작하지 못했어요.");
    }
  }, []);

  const stop = useCallback(() => {
    want.current = false;
    rec.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setFinalText("");
    setInterim("");
  }, []);

  const resetMetrics = useCallback(() => {
    metrics.current = { firstHeardAt: null, lastHeardAt: null, longSilences: 0, speakingMs: 0 };
  }, []);

  return { supported, listening, finalText, setFinalText, interim, error, start, stop, reset, metrics, resetMetrics };
}

/** 면접관 질문 읽어 주기(브라우저 내장 음성). 지원하지 않으면 조용히 넘어간다 */
export function speakKo(text: string) {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = 1;
    const ko = window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith("ko"));
    if (ko) u.voice = ko;
    window.speechSynthesis.speak(u);
  } catch {
    /* 무시 */
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* 무시 */
  }
}
