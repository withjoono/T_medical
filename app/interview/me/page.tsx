import type { Metadata } from "next";
import { buildInterviewCatalog } from "@/features/interview-system/catalog";
import { MyInterviewPage } from "@/features/interview-system/my-interview";

/** 내 면접 — 할 일 · 지원 대학 일정 · 수업(로그인 학생 화면). 개인 화면이라 검색에 내지 않는다. */
export const metadata: Metadata = {
  title: "내 면접 — 할 일 · 지원 대학 일정 · 수업 | T Medi",
  description: "지원 대학의 1차 발표일·면접일, 선생님 과제, 면접 수업 일정과 줌 링크를 한곳에서 챙깁니다.",
  alternates: { canonical: "/interview/me" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <MyInterviewPage catalog={buildInterviewCatalog()} />;
}
