import type { ReactNode } from "react";
import { InterviewMenu } from "@/features/interview-system/menu";

/** /interview 아래 모든 페이지에 면접 메뉴 4칸(내 면접 · 대학별 면접 · AI 면접 · 면접 수업)을 한 번 씌운다.
 *  사이트 크롬(상단 네비·풋터)은 app/layout.tsx 의 SiteChrome 이 이미 씌우므로 여기서는 메뉴만. */
export default function InterviewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <InterviewMenu />
      {children}
    </>
  );
}
