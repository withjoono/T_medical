"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { AI_TIERS, BUNDLE, CLASS_PRICE_LABEL, SESSION_LABEL } from "@/lib/class-summary";
import { TEACHER_PROFILES } from "@/lib/teachers";

/** =========================================================================
 *  수업 상세 팝업.
 *
 *  ⚠️ 내용은 **열어야 비로소 DOM 에 생긴다.** 미리 렌더해 두면 강사 프로필과
 *     가격표가 192개 페이지 HTML 에 똑같이 박혀서, 2026-10-24 에 걷어낸
 *     본문 중복이 그대로 되살아난다(치·한·약·수 색인 0건의 원인이었다).
 *     문자열은 이 클라이언트 청크 한 파일에만 들어가므로 페이지마다 복제되지
 *     않는다. 조건부 렌더(open && ...)를 hidden 클래스로 바꾸지 말 것.
 *
 *  내용은 요약만 담고 더 깊은 것은 /interview 로 보낸다.
 *  ========================================================================= */

export function ClassDetailButton({ label = "수업·강사 자세히" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-brass-300 bg-brass-300/10 px-5 py-2.5 text-sm font-semibold text-brass-300 transition-colors hover:bg-brass-300 hover:text-ink"
      >
        {label}
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="면접 수업 안내"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-0 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto bg-paper text-ink-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-hair px-7 py-5">
              <div>
                <p className="eyebrow text-brass-600">면접 수업</p>
                <h2 className="display mt-2 text-[1.25rem] leading-snug">
                  반복은 AI 가, 판단은 선생님이
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="-mr-2 p-2 text-ink-400 hover:text-ink-900"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="px-7 py-6">
              <p className="text-[14px] font-light leading-[1.85] text-ink-600">
                면접은 아는 것을 늘려서 되는 일이 아니라 반복해 몸에 붙이는 일입니다. 반복은 AI
                모의면접이 맡고, 선생님 시간은 소재를 고르고 설계하는 데만 씁니다. 그래서 선생님
                수업이 2회로 끝납니다.
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "1회차 — 진단과 설계. 생기부에서 쓸 소재를 고르고 지원 대학 평가축에 맞춰 뼈대를 세웁니다",
                  "AI 훈련 — 선생님이 회차를 처방합니다. 부족하면 추가 처방이 나가고 추가 비용은 없습니다",
                  "2회차 — 실전 점검. 지원 대학 형식 그대로 모의면접을 돌리고 즉시 교정합니다",
                ].map((x) => (
                  <li key={x} className="flex gap-2.5 text-[13px] font-light leading-[1.8] text-ink-700">
                    <Check className="mt-1.5 h-3.5 w-3.5 shrink-0 text-jade-600" strokeWidth={2} />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border border-hair-strong">
                <div className="flex items-baseline justify-between bg-ink px-5 py-4 text-paper">
                  <span className="text-[14px] font-semibold">선생님 1회 + AI 무제한</span>
                  <span className="tnum display text-[1.375rem] text-brass-300">
                    {BUNDLE.priceLabel}
                  </span>
                </div>
                <ul className="px-5 py-3">
                  <li className="flex items-baseline justify-between py-1.5 text-[13px]">
                    <span className="font-light text-ink-600">선생님 1:1 · 줌 {SESSION_LABEL}</span>
                    <span className="tnum font-medium">{CLASS_PRICE_LABEL}</span>
                  </li>
                  {AI_TIERS.filter((t) => t.price === 0).map((t) => (
                    <li key={t.key} className="flex items-baseline justify-between py-1.5 text-[13px]">
                      <span className="font-light text-ink-600">
                        AI {t.label} · {t.meta}
                      </span>
                      <span className="tnum font-medium text-jade-700">{t.priceLabel}</span>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-hair px-5 py-3 text-[12px] font-light text-ink-400">
                  묶음 결제나 선납은 없습니다. 회차는 필요한 만큼만 잡습니다.
                </p>
              </div>

              <div className="mt-7">
                <p className="eyebrow text-brass-600">담당 선생님</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {Object.values(TEACHER_PROFILES).map((t) => (
                    <div key={t.id} className="border border-hair bg-white p-5">
                      <p className="display text-[15px] text-ink-900">{t.name}</p>
                      <p className="mt-2 text-[12px] font-light leading-relaxed text-ink-500">
                        {t.credential}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-ink-800"
                >
                  수업 문의하기
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
                <Link
                  href="/interview"
                  className="inline-flex items-center gap-2 border border-hair-strong px-6 py-3 text-sm font-light text-ink-700 hover:border-ink"
                >
                  수업 절차·가격 전체 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
