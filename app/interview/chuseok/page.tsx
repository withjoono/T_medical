import type { Metadata } from "next";
import { ChuseokPage } from "../_chuseok";
import { ALL_DAYS, AVG_GAP, RANGE_LABEL, TOTAL } from "@/lib/chuseok-class";

export const metadata: Metadata = {
  alternates: { canonical: "/interview/chuseok" },
  title:
    "추석 연휴 의대 면접 특강 | T Medi — 수능 전 면접반 (연휴 3구간 · 1:1)",
  description:
    `2027 의대 면접, 1단계 발표에서 면접까지 평균 ${AVG_GAP}일입니다. 추석·개천절·한글날 연휴 ${ALL_DAYS.length}일(${RANGE_LABEL}) 동안 낮 타임까지 하루 5타임을 엽니다. 수능보다 면접이 먼저인 전형, 대학별 발표~면접 간격, 구간별 남은 자리(${TOTAL.open}회)를 정리했습니다. 줌 1:1. tmedi.kr`,
};

export default function Page() {
  return <ChuseokPage />;
}
