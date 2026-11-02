"use client";

import { useEffect, useReducer, useState } from "react";
import { AUTH_EVENT, loadAuth, type HubUser } from "@/lib/auth";
import { KEYS, interviewApi, type CoachAssignment, type ClassSession, type InterviewBooking } from "./api";
import { dueLabel } from "./config";

/* ───────────── 로그인 상태 ───────────── */

/** 이 기기의 T메디 로그인. ready 전(첫 렌더·정적 HTML)에는 로그인 전으로 그린다 */
export function useMediAuth(): { ready: boolean; logged: boolean; user: HubUser | null } {
  const [state, setState] = useState<{ ready: boolean; user: HubUser | null; token: string | null }>({ ready: false, user: null, token: null });
  useEffect(() => {
    const read = () => {
      const { token, user } = loadAuth();
      setState({ ready: true, token, user });
    };
    read();
    window.addEventListener(AUTH_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(AUTH_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return { ready: state.ready, logged: !!state.token, user: state.user };
}

/* ───────────── 작은 조회 캐시 (수시앱 react-query 자리) ───────────── */

type Entry = { data?: unknown; error?: Error; at: number; loading?: boolean };
const store = new Map<string, Entry>();
const subs = new Set<() => void>();
const notify = () => subs.forEach((f) => f());

/** 다시 받아야 하는 데이터 — 연결·예약 뒤에 부른다 */
export function invalidate(...keys: string[]) {
  for (const k of keys) store.delete(k);
  notify();
}

if (typeof window !== "undefined") {
  // 다른 계정으로 바뀌면 받은 것을 모두 버린다
  window.addEventListener(AUTH_EVENT, () => invalidate(...store.keys()));
}

/** staleMs 안에서는 다시 받지 않는다(0 이하로 두지 말 것 — 받을 때마다 다시 그리므로 끝없이 돈다) */
export function useRemote<T>(key: string, fn: () => Promise<T>, enabled: boolean, staleMs = 60_000) {
  const [tick, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    subs.add(force);
    return () => {
      subs.delete(force);
    };
  }, []);
  useEffect(() => {
    if (!enabled) return;
    const e = store.get(key);
    if (e && (e.loading || Date.now() - e.at < staleMs)) return;
    store.set(key, { ...e, at: Date.now(), loading: true });
    fn().then(
      (data) => store.set(key, { data, at: Date.now() }),
      (error: Error) => store.set(key, { error, at: Date.now() }),
    ).finally(notify);
    // fn 은 매 렌더 새로 만들어지므로 의존성에서 뺀다 — key 가 같으면 같은 조회다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, tick, staleMs]);
  const e = enabled ? store.get(key) : undefined;
  return {
    data: e && "data" in e ? (e.data as T) : undefined,
    error: e?.error,
    pending: enabled && !(e && ("data" in e || e.error)),
  };
}

/* ───────────── 예약 학생인가 (수시앱 useBookedStudent) ───────────── */

/**
 * 예약 학생 = 계좌이체 예약이 살아 있거나, 운영진이 지정한 면접 강사와 연결된 학생(전화 예약 등).
 * 수시앱에서 예약한 것도 같은 계정이면 함께 보인다(장부가 하나).
 */
export function useBookedStudent() {
  const { ready, logged } = useMediAuth();
  const bookings = useRemote(KEYS.bookings, interviewApi.bookings, logged);
  const quota = useRemote(KEYS.quota, interviewApi.quota, logged, 30_000);
  const u = quota.data?.unlimited;
  const instructor = u?.source === "instructor" && !u.self ? u : null;
  const list: InterviewBooking[] = bookings.data ?? [];
  return {
    loading: !ready || (logged && (bookings.pending || quota.pending)),
    booked: list.length > 0 || !!instructor,
    booking: list[0] ?? null,
    bookings: list,
    instructorName: instructor ? instructor.teacherName : null,
    error: bookings.error,
  };
}

/* ───────────── 지금 할 일 (수시앱 todo.tsx useInterviewTodo) ───────────── */

export type InterviewTodo =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "teacher" }
  | { kind: "assignment"; a: CoachAssignment; due: string | null; code: string | null; count: number }
  | { kind: "class"; next: ClassSession | null; nextNo: number; total: number | null; teacherName: string | null }
  | { kind: "free" };

/**
 * 상태 → 카드 한 장. 과제는 예약하지 않고 코드로만 연결된 학생도 받으므로 예약 여부보다 먼저 본다.
 *   로그인 전 → 지원 대학 담기 / 선생님 → 선생님앱 / 과제 → 과제 하러 / 수업 학생 → 다음 수업 / 그 밖 → AI 면접
 */
export function useInterviewTodo(): InterviewTodo {
  const { ready, logged, user } = useMediAuth();
  const me = useBookedStudent();
  const isTeacher = logged && user?.memberType === "teacher";
  const student = logged && !isTeacher;
  const assignQ = useRemote(KEYS.assignments, interviewApi.assignments, student);
  const setsQ = useRemote(KEYS.sets, interviewApi.sets, student);
  const sessionsQ = useRemote(KEYS.sessions, interviewApi.sessions, student && me.booked);

  if (!ready) return { kind: "loading" };
  if (!logged) return { kind: "anon" };
  if (isTeacher) return { kind: "teacher" };
  if (me.loading || assignQ.pending) return { kind: "loading" };

  const pending = (assignQ.data ?? []).filter((a) => !a.doneAt);
  if (pending.length) {
    const setOf = (a: CoachAssignment) => setsQ.data?.find((s) => s.assignmentId === a.id);
    // 마감이 있는 세트 과제를 먼저, 그다음 오래된 과제부터
    const first = [...pending].sort(
      (x, y) => (setOf(x)?.dueAt ?? "9999").localeCompare(setOf(y)?.dueAt ?? "9999") || x.createdAt.localeCompare(y.createdAt),
    )[0];
    return { kind: "assignment", a: first, due: dueLabel(setOf(first)?.dueAt), code: setOf(first)?.code ?? null, count: pending.length };
  }
  if (me.booked) {
    const sessions = sessionsQ.data ?? [];
    const next = sessions.find((x) => !x.doneAt) ?? null;
    return {
      kind: "class",
      next,
      nextNo: next ? sessions.indexOf(next) + 1 : 0,
      total: me.booking?.sessions ?? (sessions.length || null),
      teacherName: next?.teacherName ?? me.instructorName,
    };
  }
  return { kind: "free" };
}
