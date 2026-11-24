/** MMI 실전 모의면접(/interview/ai → 'MMI 실전' 탭) — 서버 호출.
 *
 *  서버는 면접 공용 엔진(/interview-sim)이다. 로그인은 T메디의 T스쿨 계정 토큰을 그대로 보낸다.
 *  학생 답변은 글(받아쓰기)만 보낸다 — 음성은 보내지 않는다. */
import { loadAuth } from "@/lib/auth";

export const SIM_API_URL = (process.env.NEXT_PUBLIC_SIM_API_URL || "https://susi-backend-dot-ts-back-nest-479305.du.r.appspot.com").replace(/\/+$/, "");

export type RubricStatus = "충족" | "약함" | "없음" | "보류";
export type RubricItem = { key: string; label: string; status: RubricStatus; evidence: string; question: string };
export type SpeechStats = {
  firstSpeakSec: number | null;
  speakingSec: number;
  totalSec: number;
  longSilences: number;
  overtime: boolean;
  stt: "browser" | "typed";
};
export type RoomFeedback = { items: RubricItem[]; summary: string; speech: SpeechStats | null; createdAt: string; model: string };
export type SimTurn = { role: "interviewer" | "student"; text: string; at: number };
/** passage = 상황·제시문 · doc = 서류 확인(학생부 기반, 제시문 없음) · solve = 수학 구술 */
export type SimPromptKind = "passage" | "doc" | "solve";
export type SimPrompt = { id: string; title: string; tags: string[]; text: string; firstQuestion: string; draft: boolean; kind?: SimPromptKind };
export type SimRoom = {
  idx: number;
  label: string;
  answerSec: number;
  prepSec: number;
  prompt: SimPrompt | null;
  turns: SimTurn[];
  followUps: number;
  followUpsLeft: number;
  startedAt: string | null;
  finishedAt: string | null;
  feedback: RoomFeedback | null;
};
export type SimSession = {
  id: string;
  formatId: string;
  format: { univ: string; track: string; label: string } | null;
  mode: "real" | "practice";
  status: "active" | "done";
  createdAt: string;
  rooms: SimRoom[];
};
export type SimFormat = {
  id: string;
  univ: string;
  track: string;
  label: string;
  rooms: { label: string; answerSec: number; prepSec: number }[];
  notes: string[];
  source: { label: string; url: string };
  /** T메디 의·치·한·약·수 형식 — 'medi'. 없으면 공용(고려대 등) */
  site?: "medi";
  /** 학과 — 없으면 의대로 본다 */
  field?: SimField;
  /** 모집단위(의예과·치의예과…) */
  unit?: string;
  /** 면접일(YYYY-MM-DD) — 모두 지나면 목록에서 숨긴다 */
  dates?: string[];
  promptCount: number;
  draft: boolean;
};

export type SimField = "uidae" | "chidae" | "hanuidae" | "yakdae" | "suuidae";
export const SIM_FIELDS: { key: SimField; label: string }[] = [
  { key: "uidae", label: "의대" },
  { key: "chidae", label: "치대" },
  { key: "hanuidae", label: "한의대" },
  { key: "yakdae", label: "약대" },
  { key: "suuidae", label: "수의대" },
];
export const fieldOf = (f: SimFormat): SimField => f.field ?? "uidae";

/** 오늘(한국 시간) YYYY-MM-DD */
export function kstToday(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 3600_000).toISOString().slice(0, 10);
}
/** 면접일이 모두 지났는가 — 면접일이 없는 형식은 지나지 않은 것으로 본다 */
export const isPastFormat = (f: SimFormat, today: string) => !!f.dates?.length && f.dates.every((d) => d < today);
/** 오늘 이후 가장 가까운 면접일 */
export const nextDate = (f: SimFormat, today: string) => f.dates?.find((d) => d >= today) ?? null;
/** "11/25(수)" */
export function dateLabel(d: string): string {
  const [y, m, day] = d.split("-").map(Number);
  return `${m}/${day}(${"일월화수목금토"[new Date(Date.UTC(y, m - 1, day)).getUTCDay()]})`;
}
/** 학과 하나의 형식 — 지난 면접은 빼고 가까운 면접일 순(면접일이 없는 형식은 맨 뒤) */
export function formatsFor(formats: SimFormat[], field: SimField, today: string): SimFormat[] {
  return formats
    .filter((f) => fieldOf(f) === field && !isPastFormat(f, today))
    .sort((a, b) => (nextDate(a, today) ?? "9999").localeCompare(nextDate(b, today) ?? "9999") || a.univ.localeCompare(b.univ, "ko"));
}
export type SimConfig = {
  enabled: boolean;
  consentVersion: string;
  consentItems: { id: string; label: string }[];
  provider: { name: string; country: string; retention: string; training: string; policyUrl: string };
  formats: SimFormat[];
  limits: { sessionsPerDay: number; followUpsPerRoom: number };
  retention: { until: string; rule: string };
};
export type SimListItem = {
  id: string;
  formatId: string;
  mode: "real" | "practice";
  status: string;
  createdAt: string;
  rooms: { label: string; promptTitle: string; done: boolean; held: number; missing: number }[];
};

export class SimApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token } = loadAuth();
  if (!token) throw new SimApiError("로그인이 필요해요.", 401);
  let res: Response;
  try {
    res = await fetch(`${SIM_API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers || {}) },
    });
  } catch {
    throw new SimApiError("서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.", 0);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    const msg = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new SimApiError(typeof msg === "string" && msg ? msg : "잠시 뒤 다시 시도해 주세요.", res.status);
  }
  return (body?.data ?? body) as T;
}

export const simApi = {
  config: () => call<SimConfig>("/interview-sim/config"),
  list: () => call<SimListItem[]>("/interview-sim/sessions"),
  get: (id: string) => call<SimSession>(`/interview-sim/sessions/${id}`),
  start: (body: { formatId: string; mode: "real" | "practice"; promptId?: string; roomIdx?: number; consentVersion: string; consentItems: string[] }) =>
    call<SimSession>("/interview-sim/sessions", { method: "POST", body: JSON.stringify(body) }),
  turn: (id: string, idx: number, text: string, elapsedSec: number) =>
    call<{ followUp: string | null; followUpsLeft: number; remainingSec: number }>(`/interview-sim/sessions/${id}/rooms/${idx}/turns`, {
      method: "POST",
      body: JSON.stringify({ text, elapsedSec }),
    }),
  finish: (id: string, idx: number, speech?: SpeechStats) =>
    call<{ feedback: RoomFeedback; status: string }>(`/interview-sim/sessions/${id}/rooms/${idx}/finish`, {
      method: "POST",
      body: JSON.stringify(speech ? { speech } : {}),
    }),
  remove: (id: string) => call<{ deleted: number }>(`/interview-sim/sessions/${id}`, { method: "DELETE" }),
  removeAll: () => call<{ deleted: number }>("/interview-sim/sessions", { method: "DELETE" }),
};

/** 동의 기록(버전·항목)은 이 브라우저에만 둔다 — 서버는 회차마다 다시 받는다 */
const CONSENT_KEY = "medical_sim_consent";
export function loadConsent(version: string): string[] | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v?.version === version && Array.isArray(v.items) ? v.items : null;
  } catch {
    return null;
  }
}
export function saveConsent(version: string, items: string[]) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ version, items }));
  } catch {
    /* 저장 못 해도 다음에 다시 동의받으면 된다 */
  }
}
