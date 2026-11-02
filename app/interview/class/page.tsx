import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buildInterviewCatalog } from "@/features/interview-system/catalog";
import { ClassBookingPanel } from "@/features/interview-system/booking";
import { CLASS_PRICE_LABEL, PACK_PER_SESSION_LABEL, PACK_PRICE_LABEL, SESSION_LABEL } from "@/lib/class-summary";
import { TUITION } from "@/lib/mmi-schedule";

/** =========================================================================
 *  면접 수업 — 예약 화면 (/interview/class, 면접 메뉴 넷째)
 *
 *  수업 설명·강사·비용 비교의 정본은 /interview 다. 여기는 **예약 폼**과 세 줄 요약만 둔다 —
 *  같은 본문을 두 주소에 깔면 2026-10-24 에 걷어낸 본문 중복이 되살아난다(색인 0건의 원인).
 *  그래서 검색에도 내지 않는다(noindex). 가격 문자열은 lib/class-summary.ts 에서만 가져온다.
 *  ========================================================================= */

export const metadata: Metadata = {
  title: "면접 수업 예약 — 계좌이체로 바로 예약 | T Medi",
  description: `의·치·한·약·수 면접 1:1 줌 수업을 계좌이체로 바로 예약합니다. 1회 ${CLASS_PRICE_LABEL}, ${TUITION.pack.sessions}회 선결제 ${PACK_PRICE_LABEL}. 입금 신청을 남기면 「내 면접」에 수업이 열립니다.`,
  alternates: { canonical: "/interview/class" },
  robots: { index: false, follow: true },
};

const POINTS = [
  `선생님 1:1 줌 수업 · 1회 ${SESSION_LABEL}`,
  `1회 ${CLASS_PRICE_LABEL} · ${TUITION.pack.sessions}회 선결제 ${PACK_PRICE_LABEL}(회당 ${PACK_PER_SESSION_LABEL})`,
  "수업 학생은 AI 모의면접 무제한 — 선생님이 지원 대학 기출로 과제를 냅니다",
];

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-16 pt-8 sm:px-6">
      <header>
        <p className="eyebrow text-brass-600">면접 수업</p>
        <h1 className="display mt-2 text-[1.7rem] leading-snug text-ink-900 sm:text-[2rem]">예약하고, 과제 받고, 줌으로 1:1</h1>
        <ul className="mt-4 space-y-1.5 text-[15px] text-ink-700">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <Check className="mt-1 h-4 w-4 shrink-0 text-jade-700" /> {p}
            </li>
          ))}
        </ul>
        <Link href="/interview" className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-jade-700 hover:underline">
          수업 진행 방식 · 강사 · 비용 자세히 <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <ClassBookingPanel catalog={buildInterviewCatalog()} />

      <p className="text-[13px] leading-relaxed text-ink-500">
        예약 뒤에는 「
        <Link href="/interview/me" className="font-semibold underline">
          내 면접
        </Link>
        」에서 담당 선생님 연결, 수업 일정·줌 링크, 받은 과제를 확인합니다. 선생님이 보낸 초대 링크를 열고 「연결하기」를 누르면 과제가 이어집니다.
      </p>
    </div>
  );
}
