/** 팝업(클라이언트 컴포넌트)이 쓰는 수업 요약값.
 *
 *  lib/mmi-schedule.ts 는 예약 슬롯 생성 등 서버 전용 로직이 커서, 클라이언트
 *  번들에 통째로 끌려 들어가지 않도록 필요한 값만 여기로 모아 다시 내보낸다.
 *  숫자의 SSOT 는 여전히 mmi-schedule 이다 — 여기서 새로 적지 않는다. */
import {
  AI_IN_CLASS,
  AI_TIERS,
  REFUND_EXAMPLES,
  SESSION_MINUTES,
  TUITION,
} from "./mmi-schedule";

export { AI_TIERS, AI_IN_CLASS, REFUND_EXAMPLES, TUITION };
export type { ClassPlan } from "./mmi-schedule";

/** 1회 결제가 */
export const CLASS_PRICE_LABEL = TUITION.perSessionLabel;
/** 3회 선결제가 */
export const PACK_PRICE_LABEL = TUITION.pack.priceLabel;
export const PACK_PER_SESSION_LABEL = TUITION.pack.perSessionLabel;
export const PACK_SAVING_LABEL = TUITION.pack.savingPerSessionLabel;
export const REFUND_PER_SESSION_LABEL = TUITION.refund.perSessionLabel;

export const SESSION_LABEL = `${Math.floor(SESSION_MINUTES / 60)}시간 ${SESSION_MINUTES % 60}분`;

/** 원 → "66만원" 처럼 쓰기 위한 변환. 만 단위로 떨어지지 않으면 콤마 표기로 떨어뜨린다. */
export function wonLabel(won: number): string {
  return won % 10000 === 0 ? `${won / 10000}만원` : `${won.toLocaleString("ko-KR")}원`;
}
