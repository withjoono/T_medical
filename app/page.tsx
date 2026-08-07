import type { Metadata } from "next";
import { PromoChrome } from "./promo/_chrome";
import PromoHome from "./promo/_home";

export const metadata: Metadata = {
  title: "T Medi | 의치한약수 진학 전문 포털 — 의대·치대·한의대·약대·수의대",
  description:
    "의대·치대·한의대·약대·수의대(의치한약수) 진학 전문 포털 T Medi. 계열별 전략, 수능 최저 관리, 면접·MMI·인적성 대비, 생기부·학종 설계를 한 곳에서. tmedi.kr",
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
