/** =========================================================================
 *  면접 시스템 — 수시앱(Susi susi-front `components/services/interview/`)에서 가져온 것 (2026-11-02)
 *
 *  ⚠️ 이 폴더는 **나중에 면접 앱(Interview)으로 떼어 간다.** 그래서
 *     - 서버는 따로 만들지 않고 수시 서버(susi-back)의 면접 공용 API 를 그대로 쓴다
 *       (예약·수업 일정·선생님 연결·과제·보낸 결과 — 선생님은 같은 선생님앱에서 T메디 학생도 본다).
 *       T메디 로그인 토큰(Hub 발급)은 서버 라우트의 @AcceptHubToken 으로 통과한다.
 *     - T메디 페이지·데이터를 직접 import 하지 않는다. 대학 목록·가격은 페이지(서버 컴포넌트)가
 *       만들어 props 로 넘긴다(catalog.ts 의 buildInterviewCatalog). 옮길 때 그 함수만 바꾸면 된다.
 *     - 로그인은 lib/auth.ts(Hub SSO, medical_token) 한 곳만 본다.
 *  ========================================================================= */

/** 면접 공용 API 서버 — 지금은 수시 백엔드. 면접 앱으로 분리하면 이 값만 바꾼다 */
export const INTERVIEW_API_URL = (
  process.env.NEXT_PUBLIC_INTERVIEW_API_URL ||
  process.env.NEXT_PUBLIC_SIM_API_URL ||
  "https://susi-backend-dot-ts-back-nest-479305.du.r.appspot.com"
).replace(/\/+$/, "");

/** 공용 AI 면접 앱 — 선생님 과제(제시문·문항 지정·예상문제 세트)는 여기서 한다. 같은 T스쿨 계정 */
export const TINTERVIEW_URL = "https://tinterview.kr";

/**
 * 선생님 과제 하는 곳 — 공용 AI 면접 앱. 예상문제 세트는 과제 링크(/t/<코드>),
 * 제시문·문항 지정 과제는 같은 출처의 수시앱 AI 면접 화면(?assign=)으로 연다(tinterview.kr 은 /susi/… 를 그대로 통과시킨다).
 * T메디 AI 면접(/interview/ai)은 기기 안 분석 엔진이라 선생님 과제·결과 보내기를 아직 받지 못한다.
 */
export function assignmentUrl(id: string, setCode: string | null | undefined): string {
  return setCode ? `${TINTERVIEW_URL}/t/${encodeURIComponent(setCode)}` : `${TINTERVIEW_URL}/susi/interview/ai?assign=${encodeURIComponent(id)}`;
}

/** 선생님앱 — 학생 목록·과제 내기·제출 결과 */
export const TEACHER_APP_URL = "https://teacher-front.web.app/interview";

/** 수업 문의 전화 — 사이트 풋터와 같은 번호 */
export const CONTACT_PHONE = "010-2518-7139";

/** 계좌이체 예약 계좌 — 수시앱 면접 수업과 같은 계좌·같은 입금 장부(susi-back bank-deposit) */
export const BANK = { name: "하나은행", account: "637-910013-44904", holder: "주식회사 거북스쿨" };

/** 이 기기에 남기는 값의 키 접두사 — 수시앱(susi-interview:)과 섞이지 않게 */
export const STORAGE_PREFIX = "medi-interview:";

/** 면접 메뉴 4칸 — 수시앱 「내 면접 · 대학별 면접 · AI 면접 · 면접 수업」과 같은 순서 */
export const INTERVIEW_MENU = [
  { key: "me", href: "/interview/me", label: "내 면접" },
  { key: "univ", href: "/interview", label: "대학별 면접" },
  { key: "ai", href: "/interview/ai", label: "AI 면접" },
  { key: "class", href: "/interview/class", label: "면접 수업" },
] as const;

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
export const todayKst = () => new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);

/** 한국 시간 「11월 8일 (토) 오후 3:00」 */
export const kstDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short", hour: "numeric", minute: "2-digit" });

/** 마감 표시 — 「11월 8일(토)」 */
export function dueLabel(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short" }).format(d);
}
