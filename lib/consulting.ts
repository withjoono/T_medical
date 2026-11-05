/** =========================================================================
 *  고1·고2 의대 컨설팅 — 가격·기간 SSOT (2026-11-05 사용자 확정)
 *
 *  페이지(app/uidae-consulting/page.tsx)는 숫자를 다시 적지 않고 여기만 읽는다.
 *  구성: 생기부 컨설팅 + 학습 플래너 관리 + 생기북 앱 내신 성적관리 + 모고 앱 모의고사 관리.
 *        네 가지를 담당 선생님 한 명이 전부 관리한다 — 이 상품의 핵심.
 *  참조: T과기원(Kwakiwon) /sanggibu-consulting · app/promo/_study-care.tsx
 *  ========================================================================= */

export const UIDAE_CONSULTING = {
  /** 가격(만원) — 3개월 전체. 2026-11-05 사용자: "96인지 98인지 헷갈리니 일단 98" → 확정되면 이 숫자만 고친다 */
  priceManwon: 98,
  /** 관리 기간(개월) */
  months: 3,
  /** 스터디플래너 검사 주기. T과기원·T메디 탐구 상품과 같은 운영 */
  plannerCheck: "주 1회",
  /** 생기부 컨설팅 회차 (2026-11-05 사용자 확정 5회). 가격 카드·히어로에 '생기부 컨설팅 N회'로 붙는다 */
  sessions: 5 as number | null,
};

export const UIDAE_CONSULTING_PATH = "/uidae-consulting";

/** 화면 표시용 라벨 — 페이지에 숫자를 다시 적지 말 것 */
export const UIDAE_CONSULTING_PRICE = `${UIDAE_CONSULTING.priceManwon}만원`;
export const UIDAE_CONSULTING_PERIOD = `${UIDAE_CONSULTING.months}개월`;
export const UIDAE_CONSULTING_SESSIONS = UIDAE_CONSULTING.sessions
  ? `생기부 컨설팅 ${UIDAE_CONSULTING.sessions}회`
  : "생기부 컨설팅";

/** 구조화 데이터용 원 단위 정수 — 가격 카드에 실제로 보이는 값과 같아야 한다 */
export const UIDAE_CONSULTING_PRICE_WON = UIDAE_CONSULTING.priceManwon * 10000;
