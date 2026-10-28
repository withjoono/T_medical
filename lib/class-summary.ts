/** 팝업(클라이언트 컴포넌트)이 쓰는 수업 요약값.
 *
 *  lib/mmi-schedule.ts 는 예약 슬롯 생성 등 서버 전용 로직이 커서, 클라이언트
 *  번들에 통째로 끌려 들어가지 않도록 필요한 값만 여기로 모아 다시 내보낸다.
 *  숫자의 SSOT 는 여전히 mmi-schedule 이다 — 여기서 새로 적지 않는다. */
import { AI_TIERS, BUNDLE, SESSION_MINUTES, TUITION } from "./mmi-schedule";

export { AI_TIERS, BUNDLE };
export type { ClassPlan } from "./mmi-schedule";
export const CLASS_PRICE_LABEL = TUITION.perSessionLabel;
export const SESSION_LABEL = `${Math.floor(SESSION_MINUTES / 60)}시간 ${SESSION_MINUTES % 60}분`;
