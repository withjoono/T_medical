import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { AI_IN_CLASS, AI_TIERS, TUITION } from "@/lib/mmi-schedule";
import { SESSION_LABEL } from "@/lib/class-summary";
import { CONTACT_ANCHOR } from "../../_site/chrome";

/** =========================================================================
 *  /interview/ai — 체험 뒤의 두 갈래 (2026-10-29 사용자 요청)
 *
 *    A. AI 모의면접만 — 혼자 반복. 가격은 AI_TIERS(단품)
 *    B. 선생님 1:1 수업 — **학생이 본 AI 모의면접 결과를 가지고 선생님이 피드백**하는 수업.
 *       가격은 TUITION, AI 모의면접 무제한 포함(AI_TIERS 가 적용되지 않는다)
 *
 *  ⚠️ 숫자를 여기 쓰지 않는다 — lib/mmi-schedule.ts 가 SSOT.
 *  ⚠️ B 를 'AI 대신 선생님'으로 읽히게 쓰지 말 것. 선생님 수업은 AI 모의면접을 전제로 한다
 *     (AI_IN_CLASS 주석 참고). 그래서 카드 위에 수업 구조 띠를 먼저 둔다.
 *  ⚠️ AI 기록이 선생님에게 자동으로 넘어간다고 쓰지 않는다 — 그런 연동은 아직 없다.
 * ========================================================================= */

const PAID_TIERS = AI_TIERS.filter((t) => t.price > 0);
const OPEN_PAID = PAID_TIERS.filter((t) => t.status === "open");
/** 유료 항목이 하나도 열리지 않았으면 지금은 AI 가 전부 무료다 */
const AI_FREE_NOW = OPEN_PAID.length === 0;
const AI_HEADLINE = AI_FREE_NOW
  ? "지금은 무료"
  : `${[...OPEN_PAID].sort((a, b) => a.price - b.price)[0].priceLabel}부터`;

/** 선생님 수업 흐름 — 수업 구조 띠에 깐다 */
const CLASS_STEPS = [
  {
    no: "01",
    title: "학생이 AI 모의면접을 봅니다",
    body: "지원 대학 형식으로 AI 면접관의 꼬리질문에 답하고, 말하기·태도 연습으로 시선·말 빠르기를 확인합니다. 횟수 제한이 없습니다.",
  },
  {
    no: "02",
    title: "그 결과로 선생님이 피드백합니다",
    body: "답변 기록과 기준별 점검 결과를 펼쳐 놓고, 어디서 무너졌는지를 짚습니다. 수업 시간에 모의면접을 처음부터 돌리지 않습니다.",
  },
  {
    no: "03",
    title: "다음 과제는 다시 AI 로",
    body: "선생님이 고칠 곳과 과제를 정해 주면, 학생은 AI 로 몇 번이든 다시 연습합니다. 다음 수업은 그 기록에서 시작합니다.",
  },
];

type PathCard = {
  key: "ai" | "teacher";
  letter: string;
  eyebrow: string;
  title: string;
  price: string;
  priceNote: string;
  pros: string[];
  limits?: string[];
  fits: string[];
};

const PATHS: PathCard[] = [
  {
    key: "ai",
    letter: "A",
    eyebrow: "혼자 반복하기",
    title: "AI 모의면접만",
    price: AI_HEADLINE,
    priceNote: AI_FREE_NOW
      ? "유료 항목은 준비 중이라 아직 과금하지 않습니다"
      : "말하기·태도 연습은 계속 무료",
    pros: [
      "비용 부담이 거의 없습니다.",
      "언제든, 몇 번이든 — 1단계 발표 다음 날 새벽에도 바로 연습할 수 있습니다.",
      "대학 면접 형식 그대로 AI 면접관이 꼬리질문을 던집니다.",
      "말하기·태도 연습은 영상이 기기 밖으로 나가지 않습니다.",
    ],
    limits: [
      "AI 는 답변 구조·분량·말 빠르기·시선을 봅니다. 생기부에서 어떤 소재를 꺼낼지, 답이 진정성 있게 들리는지는 판단하지 못합니다.",
      "점수·합격 가능성·모범답안은 주지 않습니다.",
    ],
    fits: [
      "답변 소재와 뼈대가 이미 정리돼 있고, 반복만 더 필요한 학생",
      "수업을 정하기 전에 면접이 어떤 것인지 먼저 겪어 보고 싶은 학생",
    ],
  },
  {
    key: "teacher",
    letter: "B",
    eyebrow: "AI 결과로 피드백받기",
    title: "선생님 1:1 수업",
    price: TUITION.perSessionLabel,
    priceNote: `1회 · 줌 1:1 ${SESSION_LABEL} · ${AI_IN_CLASS.meta}`,
    pros: [
      "수업 시간을 모의면접 녹화에 쓰지 않습니다. 모의면접은 AI 로 미리 보고, 선생님 시간은 전부 교정에 씁니다.",
      "AI 가 못 보는 것을 봅니다 — 소재 선택·서사·진정성·태도.",
      "지원 대학이 무엇을 평가하는지에 맞춰 답변 뼈대를 함께 세웁니다.",
      "예상문제를 수업 전 과제로 미리 받습니다.",
      "AI 모의면접이 수업에 무제한으로 들어 있어, 선생님이 '더 해 오세요' 해도 추가 비용이 없습니다.",
      "의대 면접은 의대 출신 선생님이 맡습니다. 줌 온라인이라 지역과 상관없습니다.",
    ],
    fits: [
      "AI 로 몇 번 해 봤는데 무엇이 문제인지 스스로 찾기 어려운 학생",
      "생기부에서 무엇을 꺼내 말할지 아직 정하지 못한 학생",
      "면접 반영 비율이 큰 대학에 지원한 학생",
    ],
  },
];

/** 한눈에 비교 — 행마다 [항목, A, B] */
const COMPARE_ROWS: [string, string, string][] = [
  [
    "비용",
    AI_FREE_NOW ? "지금은 무료 (유료 항목 준비 중)" : AI_HEADLINE,
    `1회 ${TUITION.perSessionLabel} · ${TUITION.pack.sessions}회 선결제 ${TUITION.pack.priceLabel}`,
  ],
  ["AI 모의면접", "단품 가격표 적용", "무제한 포함 — 단품 가격 없음"],
  ["피드백하는 사람", "AI", "선생님 (학생이 본 AI 결과를 보고)"],
  ["보는 것", "구조 · 분량 · 말 빠르기 · 시선", "여기에 더해 소재 선택 · 서사 · 진정성 · 태도"],
  ["시간", "상시, 혼자", `예약 · 줌 1:1 ${SESSION_LABEL}`],
];

export function TwoPaths() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* 수업 구조 — B 가 'AI 대신'이 아니라 'AI 결과로' 라는 점을 카드보다 먼저 보인다 */}
      <div className="border border-ink bg-ink px-7 py-8 text-paper sm:px-10">
        <p className="eyebrow text-brass-300">선생님 수업은 이렇게 합니다</p>
        <p className="display mt-4 text-[1.25rem] leading-snug sm:text-[1.5rem]">
          {AI_IN_CLASS.structure}
        </p>
        <p className="mt-3 max-w-3xl text-[13px] font-light leading-[1.8] text-paper/70">
          선생님 수업은 AI 모의면접을 대신하는 것이 아닙니다. {AI_IN_CLASS.why}
        </p>
        <ol className="mt-8 grid gap-px bg-paper/15 sm:grid-cols-3">
          {CLASS_STEPS.map((s) => (
            <li key={s.no} className="bg-ink px-5 py-6 sm:px-6">
              <p className="tnum text-[12px] font-semibold tracking-[0.2em] text-brass-300">{s.no}</p>
              <p className="mt-3 text-[15px] font-semibold leading-snug">{s.title}</p>
              <p className="mt-2 text-[13px] font-light leading-[1.75] text-paper/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* 두 갈래 */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {PATHS.map((p) => (
          <PathCardView key={p.key} p={p} />
        ))}
      </div>

      {/* 한눈에 비교 */}
      <div className="mt-8 overflow-x-auto border border-hair-strong bg-white">
        <table className="w-full min-w-[560px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-hair bg-paper-100">
              <th className="w-[22%] px-5 py-3 font-semibold text-ink-500">한눈에 비교</th>
              <th className="px-5 py-3 font-semibold text-ink-900">A. AI 모의면접만</th>
              <th className="px-5 py-3 font-semibold text-jade-700">B. 선생님 1:1 수업</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map(([label, a, b]) => (
              <tr key={label} className="border-b border-hair last:border-b-0">
                <th className="px-5 py-3 font-medium text-ink-500">{label}</th>
                <td className="px-5 py-3 font-light text-ink-700">{a}</td>
                <td className="px-5 py-3 font-medium text-ink-900">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mx-auto mt-6 max-w-3xl text-center text-[13px] font-light leading-[1.8] text-ink-500">
        AI 만으로 시작했다가 나중에 수업을 더하셔도 됩니다. MMI 실전 모의면접 기록은 계정에 남아 있으므로,
        그동안 본 결과가 그대로 첫 수업의 재료가 됩니다.
      </p>
    </div>
  );
}

function PathCardView({ p }: { p: PathCard }) {
  const teacher = p.key === "teacher";
  return (
    <div
      className={`flex flex-col border bg-white ${
        teacher ? "border-jade-700 ring-1 ring-jade-700" : "border-hair-strong"
      }`}
    >
      <div className={`border-b px-7 py-6 ${teacher ? "border-jade-700/30 bg-jade-50" : "border-hair"}`}>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-7 w-7 items-center justify-center text-[13px] font-bold ${
              teacher ? "bg-jade-700 text-white" : "bg-ink-900 text-white"
            }`}
          >
            {p.letter}
          </span>
          <p className={`eyebrow ${teacher ? "text-jade-700" : "text-brass-600"}`}>{p.eyebrow}</p>
        </div>
        <h3 className="display mt-4 text-[1.25rem] leading-snug text-ink-900">{p.title}</h3>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className={`tnum display text-[1.75rem] ${teacher ? "text-jade-700" : "text-ink-900"}`}>
            {p.price}
          </span>
          <span className="text-[12px] font-light text-ink-500">{p.priceNote}</span>
        </p>
        {!teacher && (
          <ul className="mt-4 border-t border-hair">
            {AI_TIERS.map((t) => (
              <li
                key={t.key}
                className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-hair py-2 text-[13px]"
              >
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-medium text-ink-800">{t.label}</span>
                  <span className="text-[11.5px] font-light text-ink-400">{t.meta}</span>
                  {t.status === "preparing" && (
                    <span className="border border-hair bg-paper-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-ink-400">
                      준비 중
                    </span>
                  )}
                </span>
                <span className={`tnum font-semibold ${t.price === 0 ? "text-jade-700" : "text-ink-900"}`}>
                  {t.priceLabel}
                </span>
              </li>
            ))}
          </ul>
        )}
        {teacher && (
          <p className="mt-2 text-[13px] font-medium text-ink-700">
            {TUITION.pack.sessions}회 선결제 {TUITION.pack.priceLabel}
            <span className="font-light text-ink-500">
              {" "}
              · 회당 {TUITION.pack.perSessionLabel}, {TUITION.pack.savingPerSessionLabel} 할인
            </span>
          </p>
        )}
      </div>

      <div className="flex-1 px-7 py-6">
        <p className="text-[12px] font-semibold tracking-wide text-ink-400">장점</p>
        <ul className="mt-3 space-y-2.5">
          {p.pros.map((t) => (
            <li key={t} className="flex gap-2.5 text-[13.5px] leading-[1.7] text-ink-700">
              <Check className="mt-1 h-4 w-4 shrink-0 text-jade-700" strokeWidth={2} />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        {p.limits && (
          <>
            <p className="mt-6 text-[12px] font-semibold tracking-wide text-ink-400">AI 만으로는 어려운 것</p>
            <ul className="mt-3 space-y-2.5">
              {p.limits.map((t) => (
                <li key={t} className="flex gap-2.5 text-[13.5px] leading-[1.7] text-ink-500">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-ink-300" strokeWidth={2} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-6 text-[12px] font-semibold tracking-wide text-ink-400">이런 학생께 맞습니다</p>
        <ul className="mt-3 space-y-1.5">
          {p.fits.map((t) => (
            <li key={t} className="text-[13.5px] leading-[1.7] text-ink-700">
              · {t}
            </li>
          ))}
        </ul>

        {teacher && (
          <p className="mt-6 border-t border-hair pt-4 text-[12.5px] font-light leading-[1.75] text-ink-500">
            처음이시면 1회만 해 보셔도 됩니다. {TUITION.refund.rule}{" "}
            <span className="text-ink-800">{TUITION.refund.fairness}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-hair px-7 py-5">
        {teacher ? (
          <>
            <Link
              href={CONTACT_ANCHOR}
              className="inline-flex items-center gap-2 bg-jade-700 px-5 py-3 text-[14px] font-semibold text-white hover:bg-jade-600"
            >
              수업 문의하기 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/interview#fields"
              className="inline-flex items-center border border-hair-strong px-5 py-3 text-[14px] font-semibold text-ink-700 hover:border-ink-900"
            >
              대학별 수업·일정 보기
            </Link>
          </>
        ) : (
          <a
            href="#coach"
            className="inline-flex items-center gap-2 bg-ink-900 px-5 py-3 text-[14px] font-semibold text-white hover:bg-ink-800"
          >
            AI 모의면접 계속하기 <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
