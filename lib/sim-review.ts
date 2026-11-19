/** =========================================================================
 *  MMI 실전 모의면접 — 복기 카드 · 질문 없는 방(질문 예상) · 지난 수업 과제 (2026-11-19)
 *
 *  ⚠️ 전부 **이 브라우저(localStorage)에만** 저장한다. 서버(susi-back /interview-sim)에는 아직 받는 곳이 없다.
 *     선생님은 학생이 '복기 요약 복사'로 보낸 글이나 수업 중 화면 공유로 본다.
 *     서버로 옮길 때의 규격과 남은 일은 docs/context/sim-review.md.
 *
 *  원칙 (docs/context/business-decisions.md)
 *   · 고치는 주체는 선생님이다. 여기서는 학생의 판단과 점검 결과를 나란히 놓기만 하고, 점수를 새로 만들지 않는다.
 *   · 질문 예상은 채점하지 않는다 — 결과 화면에서 실제 질문과 나란히 보여 줄 뿐이다.
 *   · 계정마다 따로 둔다(같은 PC 를 형제가 함께 쓰는 경우).
 *  ========================================================================= */
import { loadAuth } from "@/lib/auth";
import type { RubricItem, RubricStatus, SimSession, SimTurn } from "@/lib/interview-sim-api";

/** 기준별 자기 판단 — 점검 결과(충족·약함·없음)와 같은 세 칸 */
export type SelfMark = "did" | "unsure" | "missed";
export const SELF_MARKS: { key: SelfMark; label: string }[] = [
  { key: "did", label: "해냈다" },
  { key: "unsure", label: "애매하다" },
  { key: "missed", label: "못 했다" },
];
export const selfLabel = (m: SelfMark) => SELF_MARKS.find((x) => x.key === m)?.label ?? "";

export type ReviewBase = {
  sessionId: string;
  roomIdx: number;
  formatId: string;
  promptId: string | null;
  promptTitle: string;
  roomLabel: string;
};

export type RoomReview = ReviewBase & {
  /** 질문 없는 방 — 면접관 질문을 보기 전에 말한 쟁점·예상 질문 */
  prediction?: string;
  /** 가장 막힌 면접관 질문(원문). 없었다고 답하면 빈 문자열 */
  hardest?: string;
  /** 내 답의 결론 한 줄 */
  conclusion?: string;
  /** 다시 답한다면 바꿀 한 가지 */
  redo?: string;
  /** 기준 key → 자기 판단 */
  self?: Record<string, SelfMark>;
  /** 복기 카드를 저장한 때(질문 예상만 있고 카드는 건너뛰었으면 없음) */
  savedAt?: string;
  updatedAt: string;
};

export type StatusSnap = { key: string; label: string; status: RubricStatus };

/** 지난 수업 과제 — 수업에서 선생님이 짚은 문항. 다음 모의면접이 이 문항을 다시 답하는 것으로 시작한다 */
export type ClassTask = {
  id: string;
  formatId: string;
  promptId: string;
  promptTitle: string;
  roomLabel: string;
  fromSessionId: string;
  fromRoomIdx: number;
  /** 실전 회차에서 고른 문항이면 다시 답할 때 그 방 번호를 서버에 함께 넘긴다(연습 회차는 문항만) */
  fromMode: "real" | "practice";
  /** 선생님이 해 준 말 한 줄 — 학생이 받아 적는다 */
  note: string;
  /** 과제로 정할 때의 점검 결과 */
  before: StatusSnap[];
  createdAt: string;
  attempts: { sessionId: string; at: string; statuses: StatusSnap[] }[];
  doneAt?: string;
};

type SessionOpts = { predict?: boolean; taskId?: string; at: string };
type Store = {
  v: 1;
  reviews: Record<string, RoomReview>;
  tasks: ClassTask[];
  sessions: Record<string, SessionOpts>;
  predictPref: Record<string, boolean>;
};

const KEY_PREFIX = "medical_sim_review";
/** 복기·회차 설정을 이 브라우저에 두는 기간. 서버 기록은 학년도 말에 지워진다 */
const KEEP_DAYS = 150;

const empty = (): Store => ({ v: 1, reviews: {}, tasks: [], sessions: {}, predictPref: {} });
const nowIso = () => new Date().toISOString();

function storeKey(): string {
  let id: string | number = "anon";
  try {
    id = loadAuth().user?.id ?? "anon";
  } catch {
    /* 로그인 정보를 못 읽으면 공용 칸에 둔다 */
  }
  return `${KEY_PREFIX}:${id}`;
}

function read(): Store {
  try {
    const raw = localStorage.getItem(storeKey());
    if (!raw) return empty();
    const v = JSON.parse(raw);
    if (v?.v !== 1) return empty();
    return {
      v: 1,
      reviews: v.reviews && typeof v.reviews === "object" ? v.reviews : {},
      tasks: Array.isArray(v.tasks) ? v.tasks : [],
      sessions: v.sessions && typeof v.sessions === "object" ? v.sessions : {},
      predictPref: v.predictPref && typeof v.predictPref === "object" ? v.predictPref : {},
    };
  } catch {
    return empty();
  }
}

function write(s: Store) {
  try {
    const cut = Date.now() - KEEP_DAYS * 86400_000;
    const old = (iso?: string) => !iso || new Date(iso).getTime() < cut;
    for (const k of Object.keys(s.reviews)) if (old(s.reviews[k].updatedAt)) delete s.reviews[k];
    for (const k of Object.keys(s.sessions)) if (old(s.sessions[k].at)) delete s.sessions[k];
    localStorage.setItem(storeKey(), JSON.stringify(s));
  } catch {
    /* 저장 못 해도(사생활 보호 모드 등) 모의면접은 그대로 진행한다 */
  }
}

const reviewKey = (sessionId: string, roomIdx: number) => `${sessionId}:${roomIdx}`;

// ------------------------------------------------------------------ 복기 카드

export function getReview(sessionId: string, roomIdx: number): RoomReview | null {
  return read().reviews[reviewKey(sessionId, roomIdx)] ?? null;
}

/** 있는 복기에 덮어 쓴다(질문 예상을 먼저 적고, 방이 끝난 뒤 카드를 더한다) */
export function patchReview(base: ReviewBase, patch: Partial<Omit<RoomReview, keyof ReviewBase | "updatedAt">>): RoomReview {
  const s = read();
  const k = reviewKey(base.sessionId, base.roomIdx);
  const next: RoomReview = { ...(s.reviews[k] ?? {}), ...base, ...patch, updatedAt: nowIso() };
  s.reviews[k] = next;
  write(s);
  return next;
}

export const hasReviewCard = (r: RoomReview | null): r is RoomReview => !!r?.savedAt;

/** 면접관이 실제로 한 질문 — 첫 질문 + 꼬리질문 */
export function interviewerQuestions(firstQuestion: string | null | undefined, turns: SimTurn[]): string[] {
  const out = firstQuestion ? [firstQuestion] : [];
  for (const t of turns) if (t.role === "interviewer" && t.text && !out.includes(t.text)) out.push(t.text);
  return out;
}

export type Gap = { key: string; label: string; self: SelfMark; status: RubricStatus; kind: "over" | "under" };

/** 내 판단과 점검 결과가 엇갈린 기준.
 *  over  = 해냈다고 봤는데 점검은 약함·없음  → 수업에서 가장 먼저 볼 곳
 *  under = 못 했다고 봤는데 점검은 충족
 *  '보류'(받아쓰기에서 근거를 못 찾음)는 비교하지 않는다. */
export function gaps(review: RoomReview | null, items: RubricItem[] | undefined): Gap[] {
  if (!review?.self || !items) return [];
  const out: Gap[] = [];
  for (const it of items) {
    const self = review.self[it.key];
    if (!self || it.status === "보류") continue;
    if (self === "did" && (it.status === "약함" || it.status === "없음")) out.push({ key: it.key, label: it.label, self, status: it.status, kind: "over" });
    else if (self === "missed" && it.status === "충족") out.push({ key: it.key, label: it.label, self, status: it.status, kind: "under" });
  }
  return out;
}

// ------------------------------------------------------------------ 회차 설정 · 질문 없는 방

export function sessionOpts(sessionId: string): { predict: boolean; taskId: string | null } {
  const o = read().sessions[sessionId];
  return { predict: !!o?.predict, taskId: o?.taskId ?? null };
}

export function setSessionOpts(sessionId: string, opts: { predict?: boolean; taskId?: string }) {
  const s = read();
  s.sessions[sessionId] = { ...opts, at: nowIso() };
  write(s);
}

/** 제시문만 주고 질문을 주지 않는 것으로 알려진 대학 — 이 형식은 '질문 없는 방'이 기본으로 켜진다.
 *  근거: lib/gichul-data/snu.json(2025·2026 공개 제시문 18개에 질문 없음 + 응시 후기). 다른 대학을 넣으려면 근거를 먼저 적는다. */
export const isQuestionless = (univ: string) => /서울대/.test(univ);

/** 이 형식에서 '질문 없는 방'을 켤지 — 학생이 고른 값이 있으면 그것, 없으면 대학 기본값 */
export function predictPref(formatId: string, univ: string): boolean {
  const p = read().predictPref[formatId];
  return typeof p === "boolean" ? p : isQuestionless(univ);
}

export function setPredictPref(formatId: string, on: boolean) {
  const s = read();
  s.predictPref[formatId] = on;
  write(s);
}

/** 실제 회차에 적용할지. 질문이 가려지지 않는 대학의 **실전**은 대학 형식 그대로 둔다(훈련 장치는 연습에서만) */
export function predictFor(formatId: string, univ: string, mode: "real" | "practice"): boolean {
  if (mode === "real" && !isQuestionless(univ)) return false;
  return predictPref(formatId, univ);
}

// ------------------------------------------------------------------ 지난 수업 과제

export const snap = (items: RubricItem[] | undefined): StatusSnap[] => (items ?? []).map(({ key, label, status }) => ({ key, label, status }));

export function listTasks(): ClassTask[] {
  return read().tasks;
}

/** 아직 끝내지 않은 과제 — 오래된 것부터 */
export function pendingTasks(): ClassTask[] {
  return read()
    .tasks.filter((t) => !t.doneAt)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function taskById(id: string | null | undefined): ClassTask | null {
  return id ? (read().tasks.find((t) => t.id === id) ?? null) : null;
}

export function taskFor(sessionId: string, roomIdx: number): ClassTask | null {
  return read().tasks.find((t) => t.fromSessionId === sessionId && t.fromRoomIdx === roomIdx && !t.doneAt) ?? null;
}

export function addTask(input: Omit<ClassTask, "id" | "createdAt" | "attempts" | "doneAt">): ClassTask {
  const s = read();
  const task: ClassTask = { ...input, id: `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, createdAt: nowIso(), attempts: [] };
  // 같은 문항을 두 번 짚으면 조언만 바꾼다
  s.tasks = s.tasks.filter((t) => !(t.promptId === task.promptId && t.formatId === task.formatId && !t.doneAt));
  s.tasks.push(task);
  write(s);
  return task;
}

export function removeTask(id: string) {
  const s = read();
  s.tasks = s.tasks.filter((t) => t.id !== id);
  write(s);
}

export function finishTask(id: string) {
  const s = read();
  const t = s.tasks.find((x) => x.id === id);
  if (t) t.doneAt = nowIso();
  write(s);
}

/** 과제 문항을 다시 답한 결과를 남긴다(같은 회차는 한 번만) */
export function recordAttempt(taskId: string, sessionId: string, items: RubricItem[] | undefined): ClassTask | null {
  const s = read();
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t || !items?.length) return t ?? null;
  if (!t.attempts.some((a) => a.sessionId === sessionId)) {
    t.attempts.push({ sessionId, at: nowIso(), statuses: snap(items) });
    write(s);
  }
  return t;
}

export type CompareRow = { key: string; label: string; before: RubricStatus | null; after: RubricStatus | null };

/** 지난번 → 이번. 기준표가 바뀌어 한쪽에만 있는 기준은 빈칸으로 둔다 */
export function compare(before: StatusSnap[], after: StatusSnap[]): CompareRow[] {
  const rows: CompareRow[] = after.map((a) => ({ key: a.key, label: a.label, before: before.find((b) => b.key === a.key)?.status ?? null, after: a.status }));
  for (const b of before) if (!rows.some((r) => r.key === b.key)) rows.push({ key: b.key, label: b.label, before: b.status, after: null });
  return rows;
}

/** 지난번에 약함·없음이던 기준 가운데 이번에 충족으로 바뀐 수 — 사실만 센다(고쳐졌는지 판단은 선생님 몫) */
export function movedUp(rows: CompareRow[]): { weakBefore: number; nowMet: number } {
  const weak = rows.filter((r) => r.before === "약함" || r.before === "없음");
  return { weakBefore: weak.length, nowMet: weak.filter((r) => r.after === "충족").length };
}

// ------------------------------------------------------------------ 지우기

/** 서버 기록을 지울 때 이 브라우저의 복기·과제도 함께 지운다 */
export function forgetSession(sessionId: string) {
  const s = read();
  for (const k of Object.keys(s.reviews)) if (s.reviews[k].sessionId === sessionId) delete s.reviews[k];
  delete s.sessions[sessionId];
  s.tasks = s.tasks.filter((t) => t.fromSessionId !== sessionId);
  write(s);
}

export function forgetAll() {
  const s = read();
  write({ ...empty(), predictPref: s.predictPref });
}

// ------------------------------------------------------------------ 선생님께 보낼 요약

/** 수업 전에 선생님께 보내는 글. 답변 원문은 넣지 않는다 — 선생님은 기록 화면에서 본다 */
export function summaryText(session: SimSession): string {
  const day = new Date(session.createdAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
  const lines: string[] = [`[T메디 MMI 실전 모의면접 복기] ${session.format?.univ ?? ""} · ${session.mode === "real" ? "실전" : "연습"} · ${day}`];
  for (const r of session.rooms) {
    const rv = getReview(session.id, r.idx);
    if (!rv) continue;
    lines.push("", `■ ${r.label} — ${r.prompt?.title ?? ""}`);
    if (rv.prediction) lines.push(`· 질문을 보기 전에 예상한 것: ${rv.prediction}`);
    if (rv.savedAt) {
      lines.push(`· 가장 막힌 질문: ${rv.hardest || "없었다"}`);
      if (rv.conclusion) lines.push(`· 내 답의 결론: ${rv.conclusion}`);
      if (rv.redo) lines.push(`· 다시 답한다면: ${rv.redo}`);
      const g = gaps(rv, r.feedback?.items);
      if (g.length) lines.push(`· 내 판단과 점검이 다른 곳: ${g.map((x) => `${x.label}(내 판단 ‘${selfLabel(x.self)}’ → 점검 ‘${x.status}’)`).join(", ")}`);
    }
  }
  return lines.join("\n");
}

/** 요약에 실을 복기가 하나라도 있는가 */
export const hasAnyReview = (session: SimSession) => session.rooms.some((r) => !!getReview(session.id, r.idx));
