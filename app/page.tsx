import type { Metadata } from "next";
import { PromoChrome } from "./promo/_chrome";
import PromoHome from "./promo/_home";

export const metadata: Metadata = {
  title: "T Medi | 의대 진학 전문 포털 — 수시·정시·해외 의대 경유 루트",
  description:
    "의대 진학 전문 포털 T Medi. 고3 수시(교과·종합·논술), 정시 전략, 해외 의대를 거쳐 국내 의사면허까지 — 의대로 이어지는 모든 경로를 2027학년도 기준으로 정리했습니다. 치대·한의대·약대·수의대까지 함께. tmedi.kr",
};

/** 루트(/) — promo 홈을 메인 랜딩으로 사용한다.
 *  /promo/* 하위 페이지는 app/promo/layout.tsx 가 동일한 PromoChrome 을 씌운다. */
export default function Page() {
  return (
    <PromoChrome>
      <PromoHome />
    </PromoChrome>
  );
}
