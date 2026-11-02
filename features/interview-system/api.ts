import { loadAuth } from "@/lib/auth";
import { INTERVIEW_API_URL } from "./config";

/** =========================================================================
 *  면접 공용 API (susi-back) — 수시앱 class-booking-api · coach-share-api · prep-api · questions-api 중
 *  T메디 학생 화면이 쓰는 것만. 응답 모양은 수시앱과 같다(서버가 하나).
 *  ========================================================================= */

export class InterviewApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function call<T>(method: "GET" | "POST" | "DELETE", path: string, body?: unknown, auth = true): Promise<T> {
  const { token } = loadAuth();
  if (auth && !token) throw new InterviewApiError("로그인이 필요해요.", 401);
  let res: Response;
  try {
    res = await fetch(`${INTERVIEW_API_URL}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new InterviewApiError("서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.", 0);
  }
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) throw new InterviewApiError("로그인이 만료됐어요. 다시 로그인해 주세요.", 401);
  if (!res.ok || json?.success === false) {
    const raw = json?.error ?? json?.message;
    const msg = Array.isArray(raw) ? raw[0] : raw;
    throw new InterviewApiError(typeof msg === "string" && msg ? msg : "잠시 뒤 다시 시도해 주세요.", res.status);
  }
  return (json?.data ?? json) as T;
}

/* ───────────── 면접 수업 예약(계좌이체) ───────────── */

export interface InterviewBooking {
  id: number;
  /** CHARGED: 입금 확인 전(이미 예약 학생) · GRANTED: 입금 확인됨 */
  status: "CHARGED" | "GRANTED";
  product: string;
  productNm: string;
  sessions: number;
  track: "record" | "essay";
  amount: number;
  depositorName: string;
  depositDate: string;
  createdAt: string;
  university: string | null;
  trackName: string | null;
  department: string | null;
}

export interface BookingRequest {
  product: string;
  depositorName: string;
  phone: string;
  depositDate: string;
  university: string;
  trackName?: string;
  department?: string;
  memo?: string;
}

/** 예약 화면에 보일 이름 — 「고려대학교 · T메디 3회」 */
export const bookingLabel = (b: InterviewBooking) => [b.university, b.productNm.replace("면접 수업 · ", "")].filter(Boolean).join(" · ");

/* ───────────── 수업 일정 · 선생님 연결 ───────────── */

export interface ClassSession {
  id: number;
  teacherId: string;
  teacherName: string;
  startsAt: string;
  minutes: number;
  zoomUrl: string | null;
  note: string | null;
  doneAt: string | null;
  /** 어느 면접(예약)의 회차인지. null 이면 전체 */
  bookingId: number | null;
}

export interface LinkedTeacher {
  id: string;
  name: string;
  via: "code" | "share" | string;
}

/* ───────────── 과제 · 예상문제 세트 · 보낸 결과 ───────────── */

export interface CoachAssignment {
  id: string;
  title: string | null;
  questions: string[];
  createdAt: string;
  doneAt: string | null;
  teacherId: string;
  teacherName: string;
  bookingId?: number | null;
  essay?: { title: string; university: string | null; readSec: number } | null;
}

export interface PrepSet {
  assignmentId: string;
  /** 과제 링크 코드 — tinterview.kr/t/<코드> */
  code: string;
  round: number | null;
  dueAt: string | null;
  items: { question: string; points: string | null }[];
  createdAt: string;
  doneAt: string | null;
  teacherName: string;
}

export interface SentCoachResult {
  id: string;
  teacherName: string;
  answerCount: number;
  videoCount: number;
  createdAt: string;
  viewedAt: string | null;
  expiresAt: string;
}

/** AI 면접 이용 장부 — T메디는 무제한 여부(면접 강사와 연결된 학생)만 본다. 횟수·가격은 T메디가 따로 정한다 */
export interface CoachQuota {
  unlimited?: { teacherName: string; self: boolean; source?: "instructor" | "booking" } | null;
}

export const interviewApi = {
  bookings: () => call<InterviewBooking[]>("GET", "/bank-deposit/interview-bookings"),
  book: (body: BookingRequest) => call<unknown>("POST", "/bank-deposit", body),

  sessions: () => call<{ sessions: ClassSession[] }>("GET", "/susi/interview-questions/class-sessions").then((r) => r.sessions),
  teachers: () => call<{ accounts: LinkedTeacher[] }>("GET", "/susi/interview-questions/teachers").then((r) => r.accounts),
  classPreview: (code: string) =>
    call<{ teacherName: string; connected: boolean; self: boolean }>("GET", `/susi/interview-questions/class-code/${encodeURIComponent(code)}`),
  classConnect: (code: string) =>
    call<{ teacherId: string; teacherName: string; already: boolean }>("POST", "/susi/interview-questions/class-links", { code: code.trim() }),
  classDisconnect: (teacherId: string) => call<{ deleted: number }>("DELETE", `/susi/interview-questions/class-links/${encodeURIComponent(teacherId)}`),

  assignments: () => call<{ assignments: CoachAssignment[] }>("GET", "/susi/interview-questions/coach/assignments").then((r) => r.assignments),
  sets: () => call<{ sets: PrepSet[] }>("GET", "/susi/interview-questions/coach/sets").then((r) => r.sets),
  results: () => call<{ results: SentCoachResult[] }>("GET", "/susi/interview-questions/coach/results").then((r) => r.results),
  deleteResult: (id: string) => call<{ deleted: number }>("DELETE", `/susi/interview-questions/coach/results/${encodeURIComponent(id)}`),

  quota: () => call<CoachQuota>("GET", "/susi/interview-coach/quota"),
};

/** 캐시 키 — 한 화면 안에서 같은 데이터를 한 번만 받는다(hooks.ts) */
export const KEYS = {
  bookings: "bookings",
  sessions: "sessions",
  teachers: "teachers",
  assignments: "assignments",
  sets: "sets",
  results: "results",
  quota: "quota",
} as const;
