import type { Metadata } from "next";
import { JiyeokUisaPage } from "./_jiyeok-uisa";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb, faqPage } from "@/lib/jsonld";
import { AS_OF, COMPETITION_TOTAL, DUTY, FAQ, SCALE, YEAR } from "@/lib/jiyeok-uisa";

const TITLE = "지역의사제란? 지원자격·10년 의무복무 총정리 | T Medi";
const DESCRIPTION = `지역의사 선발전형은 면허 취득 후 ${DUTY.years}년 지역 의무복무를 조건으로 선발하는 의대 전형입니다. ${YEAR} ${SCALE.univs}개 의대 ${SCALE.total}명 첫 선발. 지역인재전형과 자격이 어떻게 다른지(중학교 광역권 요건), 의무복무 10년 산정 방식, 학비 지원과 반환 조건, 첫 수시 경쟁률 ${COMPETITION_TOTAL.rate}대 1까지 출처와 함께 정리했습니다. tmedi.kr`;

export const metadata: Metadata = {
  alternates: { canonical: "/jiyeok-uisa" },
  title: TITLE,
  description: DESCRIPTION,
};

export default function Page() {
  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([{ name: "지역의사 선발전형", path: "/jiyeok-uisa" }]),
          article({
            path: "/jiyeok-uisa",
            headline: "지역의사제란 — 지원자격과 10년 의무복무 총정리",
            description: DESCRIPTION,
            modified: AS_OF,
          }),
          faqPage(FAQ),
        ]}
      />
      <JiyeokUisaPage />
    </>
  );
}
