"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Check, Monitor, Phone, Stethoscope, UserRound, X } from "lucide-react";
import {
  AI_IN_CLASS,
  PRICE_BENCHMARK,
  REFUND_EXAMPLES,
  TUITION,
  wonLabel,
  type ClassPlan,
} from "@/lib/class-summary";
import { profile, type TeacherProfile } from "@/lib/teachers";
import { CONTACT_PHONE, CONTACT_TEL } from "@/lib/contact";

/** =========================================================================
 *  대학 면접 페이지의 '수업' 섹션 — 왜 다른가 · 강사 · 절차 · 수업료 · 상담.
 *
 *  2026-11-07 사용자 지시: "정보 전달은 잘 되는데 수업 설명이 거의 없다. 강사, 절차,
 *  수업료, 무엇보다 T메디 수업이 왜 다른지가 빠졌다."
 *   · 의대 면접은 지식이 아니라 상황 대처 훈련이다.
 *   · 그 훈련을 선생님이 하나하나 하면 비용이 천정부지 → AI 면접이 상황 훈련을 맡고,
 *     선생님이 그 기록·피드백을 모두 보고 들어와 수업에서 고친다. 수업료는 줄고 훈련량은 는다.
 *   · 강사진은 현직 의사(lib/teachers.ts doctor). 모든 수업은 온라인.
 *   · 학원 대비 수업료를 강조(lib/mmi-schedule.ts PRICE_BENCHMARK, 보도로 확인한 값만).
 *
 *  ⚠️ 마운트 뒤에만 그린다(_class-modal.tsx · _wait-calendar.tsx 와 같은 원칙).
 *     이 섹션은 190여 개 대학 페이지에 똑같이 들어간다. 정적 HTML 에 박으면
 *     2026-10-24 에 걷어낸 본문 중복이 되살아난다. 대학마다 다른 한 줄(제목·부제)은
 *     서버가 PromoSection 으로 그리고, 공통 본문만 여기서 그린다.
 *     긴 문장은 props 로 넘기지 말 것 — props 는 페이지 HTML(RSC 데이터)에 실린다.
 *  ⚠️ 숫자는 SSOT(TUITION · PRICE_BENCHMARK · REFUND_EXAMPLES)에서만. 시간당 단가는 쓰지 않는다.
 *  ========================================================================= */

export type ClassStoryProps = {
  /** "경희대" */
  univShort: string;
  /** 이 대학 면접 형식 — "서류확인 면접", "MMI" 등. 절차 2단계 문장에 들어간다 */
  format?: string | null;
  plan: ClassPlan;
  /** 담당 선생님 id(lib/teachers.ts) */
  teacherIds: readonly string[];
};

export function ClassStory(props: ClassStoryProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="min-h-[1600px] sm:min-h-[1200px]" aria-hidden />;
  return <ClassStoryBody {...props} />;
}

function ClassStoryBody({ univShort, format, plan, teacherIds }: ClassStoryProps) {
  const teachers = teacherIds
    .map((id) => profile(id))
    .filter((t): t is TeacherProfile => Boolean(t))
    // 오른쪽을 보는 분이 왼쪽 칸에 와야 둘이 마주본다(TeacherCards 와 같은 규칙)
    .sort((a, b) => Number(b.facing === "right") - Number(a.facing === "right"));
  const doctors = teachers.filter((t) => t.doctor);
  const teacherWord = doctors.length > 0 ? "현직 의사 선생님" : "담당 선생님";

  return (
    <div className="mx-auto max-w-5xl space-y-16 sm:space-y-20">
      {plan.withAi ? <WhyTraining teacherWord={teacherWord} /> : <WhyConcept univShort={univShort} />}

      {teachers.length > 0 && <Teachers teachers={teachers} doctors={doctors.length} />}

      <Process univShort={univShort} format={format} plan={plan} teacherWord={teacherWord} />

      <Pricing plan={plan} />

      <Contact univShort={univShort} />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 1. 왜 다른가
 * ---------------------------------------------------------------------- */

function WhyTraining({ teacherWord }: { teacherWord: string }) {
  return (
    <div className="bg-ink px-6 py-10 text-paper sm:px-12 sm:py-14">
      <p className="eyebrow text-brass-300">WHY T메디</p>
      <h3 className="display mt-5 text-[1.625rem] leading-[1.35] sm:text-[2rem]">
        의대 면접은 지식이 아니라 <span className="text-brass-300">훈련</span>입니다
      </h3>
      <div className="mt-6 max-w-3xl space-y-4 text-[15px] font-light leading-[1.9] text-paper/80">
        <p>
          MMI와 의대 면접은 아는 것을 묻지 않습니다. 화가 난 보호자, 실수한 동료, 정답이 없는 윤리
          문제처럼 처음 보는 상황에서 어떻게 판단하고 말하는지를 봅니다. 외워서 되는 일이 아니라, 비슷한
          상황을 여러 번 겪어 봐야 몸에 붙습니다.
        </p>
        <p>
          문제는 비용입니다. 그 상황을 선생님과 하나하나 1:1로 연습하면 수업 시간이 끝없이 늘어나고,
          수업료도 함께 올라갑니다.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="border border-paper/15 p-6 sm:p-7">
          <p className="text-[13px] font-semibold text-paper/60">선생님과만 연습하면</p>
          <ul className="mt-4 space-y-3">
            {[
              "모의면접 한 번에 수업 시간 절반이 사라집니다",
              "연습 횟수 = 수업 횟수 — 더 하려면 수업을 더 사야 합니다",
              "다음 수업까지는 혼자, 피드백 없이 연습합니다",
            ].map((x) => (
              <li key={x} className="flex gap-3 text-[14px] font-light leading-[1.75] text-paper/65">
                <X className="mt-1 h-4 w-4 shrink-0 text-paper/40" strokeWidth={2} />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-brass-300 bg-brass-300/10 p-6 sm:p-7">
          <p className="text-[13px] font-semibold text-brass-300">T메디는</p>
          <ul className="mt-4 space-y-3">
            {[
              "상황 면접은 AI 면접으로 — 꼬리질문까지, 횟수 제한 없이 반복합니다",
              `${teacherWord}이 AI 면접 기록과 피드백을 모두 보고 수업에 들어옵니다`,
              "수업 100분은 모의면접이 아니라 무너진 곳을 고치는 데만 씁니다",
            ].map((x) => (
              <li key={x} className="flex gap-3 text-[14px] leading-[1.75] text-paper">
                <Check className="mt-1 h-4 w-4 shrink-0 text-brass-300" strokeWidth={2.25} />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="display mt-10 text-center text-[1.25rem] leading-snug sm:text-[1.5rem]">
        수업료는 줄이고, 훈련량은 늘립니다
      </p>
      <p className="mt-3 text-center text-[13px] font-light text-paper/55">{AI_IN_CLASS.structure}</p>
    </div>
  );
}

/** 가천대처럼 AI 를 쓰지 않는 교과 개념 면접 */
function WhyConcept({ univShort }: { univShort: string }) {
  return (
    <div className="bg-ink px-6 py-10 text-paper sm:px-12 sm:py-14">
      <p className="eyebrow text-brass-300">WHY T메디</p>
      <h3 className="display mt-5 text-[1.625rem] leading-[1.35] sm:text-[2rem]">
        {univShort} 면접은 <span className="text-brass-300">개념 설명 훈련</span>입니다
      </h3>
      <div className="mt-6 max-w-3xl space-y-4 text-[15px] font-light leading-[1.9] text-paper/80">
        <p>
          세특에 적힌 수학·화학·생명과학 개념을 교과서 수준으로 다시 묻습니다. 아는 것과 1분 안에
          설명하는 것은 다른 일이라, 말로 꺼내 보는 연습이 필요합니다.
        </p>
        <p>
          그래서 한 선생님이 세 과목을 이어서 맡고, 회차마다 낸 과제를 다음 회차에 직접 검사합니다.
          과목마다 선생님이 바뀌면 과제를 검사할 사람이 없습니다.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 2. 강사
 * ---------------------------------------------------------------------- */

function Teachers({ teachers, doctors }: { teachers: TeacherProfile[]; doctors: number }) {
  return (
    <div>
      <SubHead
        eyebrow="INSTRUCTORS"
        title={doctors > 0 ? "현직 의사가 직접 가르칩니다" : "담당 선생님"}
        body={
          doctors > 0
            ? "의대 면접이 끝내 확인하는 것은 '이 학생이 의사로서 어떻게 판단할 사람인가'입니다. 환자 앞의 판단, 동료와의 갈등, 의료윤리 — 의료 현장을 아는 현직 의사 선생님이 그 기준으로 답을 고칩니다."
            : undefined
        }
      />
      <div className={`mt-8 grid gap-5 ${teachers.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-xl"}`}>
        {teachers.map((t) => {
          const img = t.halfPhoto ?? t.photo;
          return (
            <div key={t.id} className="border border-hair-strong bg-white p-6 sm:p-7">
              <div className={`flex items-start gap-5 ${t.facing === "left" ? "flex-row-reverse" : ""}`}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={`${t.name} 선생님`}
                    width={140}
                    height={175}
                    loading="lazy"
                    className="h-[150px] w-[120px] shrink-0 border border-hair-strong bg-paper-200 object-cover object-top sm:h-[175px] sm:w-[140px]"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-hair-strong bg-paper-100 text-jade-600">
                    <UserRound className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                )}
                <div className={`min-w-0 flex-1 ${t.facing === "left" ? "text-right" : ""}`}>
                  {t.doctor ? (
                    <span className="inline-flex items-center gap-1.5 bg-jade-700 px-2.5 py-1 text-[11px] font-semibold text-white">
                      <Stethoscope className="h-3.5 w-3.5" strokeWidth={2} />
                      현직 의사
                    </span>
                  ) : (
                    <span className="inline-flex border border-hair-strong px-2.5 py-1 text-[11px] font-semibold text-ink-600">
                      제시문 전담
                    </span>
                  )}
                  <p className="display mt-3 text-[1.375rem] leading-snug text-ink-900">{t.name} 선생님</p>
                  <p className="mt-2 text-[13px] font-light leading-[1.7] text-ink-500">{t.credential}</p>
                </div>
              </div>
              {t.career && t.career.length > 0 && (
                <ul className="mt-5 space-y-1.5 border-t border-hair pt-4">
                  {t.career.map((c) => (
                    <li key={c} className="flex gap-2.5 text-[13px] font-light leading-[1.7] text-ink-600">
                      <span aria-hidden className="mt-[10px] h-px w-3 shrink-0 bg-brass-600" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 3. 절차
 * ---------------------------------------------------------------------- */

function Process({
  univShort,
  format,
  plan,
  teacherWord,
}: {
  univShort: string;
  format?: string | null;
  plan: ClassPlan;
  teacherWord: string;
}) {
  const mins = minutesText(plan.minutes);
  const steps = plan.withAi
    ? [
        {
          icon: Phone,
          title: "상담",
          body: "지원 대학과 1단계 발표일, 생기부 상황을 듣고 수업 일정을 잡습니다. 발표 전이라도 대기를 걸어 둘 수 있습니다.",
        },
        {
          icon: Bot,
          title: "AI 모의면접",
          body: `${univShort} ${format ? `${format} ` : ""}형식으로 AI 면접을 먼저 봅니다. 꼬리질문까지 이어지고, 횟수 제한이 없습니다.`,
        },
        {
          icon: Stethoscope,
          title: "선생님 검토",
          body: `${teacherWord}이 수업 전에 AI 면접 기록과 피드백을 모두 봅니다. 무엇이 무너졌는지 정해 두고 들어갑니다.`,
        },
        {
          icon: Monitor,
          title: `1:1 수업 ${mins}`,
          body: "줌으로 만나 무너진 곳만 고칩니다. 수업 끝에 다음 AI 훈련을 처방합니다.",
        },
        {
          icon: Check,
          title: "반복 · 실전 점검",
          body: "처방대로 AI로 다시 연습하고, 다음 회차에 이 대학 형식 그대로 실전 점검을 합니다.",
        },
      ]
    : [
        {
          icon: Phone,
          title: "상담",
          body: "지원 대학과 1단계 발표일, 세특 과목을 듣고 수업 일정을 잡습니다.",
        },
        {
          icon: Monitor,
          title: `1:1 수업 ${mins}`,
          body: "줌으로 만나 세특 속 개념을 정의 → 원리 → 내 탐구와의 연결 순서로 설명하는 연습을 합니다.",
        },
        {
          icon: Check,
          title: "과제",
          body: "개념별 1분 설명을 정리해 옵니다.",
        },
        {
          icon: Stethoscope,
          title: "다음 회차 · 과제 검사",
          body: "같은 선생님이 지난 과제를 먼저 검사하고 다음 과목으로 넘어갑니다.",
        },
      ];
  return (
    <div>
      <SubHead
        eyebrow="PROCESS"
        title="수업은 이렇게 진행합니다"
        body="모든 수업은 온라인입니다. 줌으로 1:1로 만나므로 사는 지역과 상관없이 같은 수업을 받습니다."
      />
      <ol className={`mt-8 grid gap-px border border-hair bg-hair sm:grid-cols-2 ${steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="bg-paper-50 p-6">
            <div className="flex items-center gap-3">
              <span className="tnum display flex h-8 w-8 items-center justify-center bg-ink text-[14px] text-paper">
                {i + 1}
              </span>
              <s.icon className="h-4 w-4 text-brass-600" strokeWidth={1.75} />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-ink-900">{s.title}</p>
            <p className="mt-2 text-[13px] font-light leading-[1.75] text-ink-600">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 4. 수업료
 * ---------------------------------------------------------------------- */

function Pricing({ plan }: { plan: ClassPlan }) {
  const mins = minutesText(plan.minutes);
  const pack = plan.pack;
  const max = Math.max(...PRICE_BENCHMARK.rows.map((r) => r.price));
  return (
    <div>
      <SubHead
        eyebrow="TUITION"
        title="수업료"
        body={
          plan.withAi
            ? "반복을 AI가 맡기 때문에 선생님 회차가 줄고, 그만큼 수업료가 내려갑니다. AI 모의면접은 따로 사지 않습니다 — 수업료에 무제한으로 들어 있습니다."
            : "가격은 다른 대학과 같습니다. 처음이시면 1회만 해 보셔도 됩니다."
        }
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="border border-hair-strong bg-white p-7">
          <p className="text-[13px] font-semibold text-ink-500">1회</p>
          <p className="tnum display mt-3 text-[2.25rem] leading-none text-ink-900">{plan.priceLabel}</p>
          <p className="mt-4 text-[14px] font-light leading-[1.75] text-ink-600">
            선생님 1:1 · {mins}
            {plan.withAi ? ` · ${AI_IN_CLASS.meta}` : ""}
          </p>
          <p className="mt-2 text-[13px] font-medium text-jade-700">처음이시면 1회만 먼저 해 보세요</p>
        </div>
        {pack && (
          <div className="border-2 border-brass-400 bg-brass-50 p-7">
            <p className="text-[13px] font-semibold text-brass-600">{pack.sessions}회 선결제</p>
            <p className="tnum display mt-3 text-[2.25rem] leading-none text-ink-900">{pack.priceLabel}</p>
            <p className="mt-4 text-[14px] font-light leading-[1.75] text-ink-600">
              회당 {pack.perSessionLabel} · {pack.savingPerSessionLabel} 할인
              {plan.withAi ? ` · ${AI_IN_CLASS.meta}` : ""}
            </p>
            <p className="mt-2 text-[13px] font-light leading-[1.7] text-ink-500">
              중간에 그만두시면 들은 회차만 회당 {TUITION.refund.perSessionLabel}으로 빼고 나머지를 전액
              돌려드립니다 —{" "}
              {REFUND_EXAMPLES.filter((r) => r.used > 0)
                .map((r) => `${r.label} ${wonLabel(r.amount)}`)
                .join(", ")}
              .
            </p>
          </div>
        )}
      </div>

      {plan.withAi && pack && (
        <div className="mt-8 border border-hair bg-paper-50 p-6 sm:p-8">
          <p className="text-[14px] font-semibold text-ink-900">학원 MMI 수업료와 비교</p>
          <ul className="mt-5 space-y-4">
            {PRICE_BENCHMARK.rows.map((r) => (
              <li key={r.label}>
                <div className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="font-light text-ink-600">
                    {r.label} <span className="text-ink-400">({r.hours})</span>
                  </span>
                  <span className="tnum font-semibold text-ink-700">{r.priceLabel}</span>
                </div>
                <div className="mt-1.5 h-3 bg-paper-200">
                  <div className="h-3 bg-ink-400" style={{ width: `${(r.price / max) * 100}%` }} />
                </div>
              </li>
            ))}
            <li>
              <div className="flex items-baseline justify-between gap-3 text-[13px]">
                <span className="font-semibold text-ink-900">
                  T메디 <span className="font-light text-ink-500">(선생님 {mins} × {pack.sessions}회 + AI 모의면접 무제한)</span>
                </span>
                <span className="tnum font-semibold text-jade-700">{pack.priceLabel}</span>
              </div>
              <div className="mt-1.5 h-3 bg-paper-200">
                <div className="h-3 bg-jade-600" style={{ width: `${(pack.price / max) * 100}%` }} />
              </div>
            </li>
          </ul>
          <p className="mt-5 text-[12px] font-light leading-[1.7] text-ink-400">
            학원 수업료는 {PRICE_BENCHMARK.source} 기준입니다. 선생님과만 반복하면 연습한 시간만큼 수업료가
            늘어납니다 — T메디는 반복을 AI가 맡아 선생님 회차를 줄였습니다.
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 5. 상담
 * ---------------------------------------------------------------------- */

function Contact({ univShort }: { univShort: string }) {
  return (
    <div className="border-t border-hair pt-12 text-center">
      <p className="display text-[1.375rem] leading-snug text-ink-900 sm:text-[1.625rem]">
        {univShort} 면접, 1회부터 시작할 수 있습니다
      </p>
      <p className="mt-3 text-[14px] font-light text-ink-500">
        지원 대학과 1단계 발표일만 알려 주시면 일정과 수업 방향을 바로 안내해 드립니다.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a
          href={CONTACT_TEL}
          className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper hover:bg-ink-800"
        >
          <Phone className="h-4 w-4" strokeWidth={2} />
          전화 상담 {CONTACT_PHONE}
        </a>
        <Link
          href="/interview/class#booking"
          className="inline-flex items-center gap-2 border border-hair-strong bg-white px-6 py-3.5 text-[15px] font-medium text-ink-800 hover:border-ink"
        >
          수업 예약하기
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 조각
 * ---------------------------------------------------------------------- */

function SubHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div>
      <p className="eyebrow text-brass-600">{eyebrow}</p>
      <h3 className="display mt-4 text-[1.5rem] leading-snug text-ink-900 sm:text-[1.75rem]">{title}</h3>
      {body && <p className="mt-4 max-w-3xl text-[15px] font-light leading-[1.85] text-ink-600">{body}</p>}
    </div>
  );
}

function minutesText(m: number) {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}시간 ${r}분` : `${h}시간`;
}
