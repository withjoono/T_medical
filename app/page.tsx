import type { Metadata } from "next";
import Home from "./_site/home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "T Medi | 의대 진학 전문 포털 — 수시·정시·해외 의대 경유 루트",
  description:
    "의대 진학 전문 포털 T Medi. 고3 수시(교과·종합·논술), 정시 전략, 해외 의대를 거쳐 국내 의사면허까지 — 의대로 이어지는 모든 경로를 2027학년도 기준으로 정리했습니다. 치대·한의대·약대·수의대까지 함께. tmedi.kr",
};

/** 루트(/) — 사이트의 정본(canonical) 랜딩.
 *  상단 네비·풋터는 app/layout.tsx 의 SiteChrome 이 씌운다. */
export default function Page() {
  return <Home />;
}
