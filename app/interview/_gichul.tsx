import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileSearch, ListChecks, TrendingUp, Users } from "lucide-react";
import { PromoSection } from "../_site/components";
import {
  GACHON_CONCEPT,
  GACHON_INSEONG,
  GACHON_PAGES,
  GACHON_PREP,
  GACHON_QUESTIONS,
  GACHON_SOURCES,
  GACHON_TREND,
  questionsFor,
  type GichulPage,
  type GichulQuestion,
} from "@/lib/gachon-gichul";

/** =========================================================================
 *  가천의약학 면접 기출 분석 블록 (2026-10-28) — 데이터는 lib/gachon-gichul.ts.
 *
 *  의대·약대·한의대 세 페이지가 **서로 다른 몫**을 싣는다(본문 중복 방지).
 *   · 의대   — 생명과학 3 + 의료 불평등 1, 기출 출처·한계, 2025→2026 경향표
 *   · 약대   — 화학 4, 내 생기부로 예상 질문 만드는 순서
 *   · 한의대 — 확률과 통계 1 + 생성형 AI 윤리 1, 인성 기출 10문항
 *  각 블록 끝에서 나머지 두 페이지로 보낸다. 전부 서버 컴포넌트다.
 *  ========================================================================= */

const INTRO: Record<GichulPage, string> = {
  uidae:
    "가천대가 공개한 가천의약학 면접 기출(2025·2026학년도 의약계열 10문항) 가운데 생명과학 3문항과 의료 불평등 1문항입니다. 질문은 전부 학생부 한 줄을 집어 그 밑의 교과 개념이나 근거를 묻습니다.",
  yakdae:
    "가천대가 공개한 가천의약학 면접 기출(2025·2026학년도 의약계열 10문항) 가운데 화학 4문항입니다. 화학 평형과 반응 속도는 2025학년도에 나란히 나와, 둘을 헷갈리는지 확인하는 한 쌍으로 읽힙니다.",
  hanuidae:
    "가천대가 공개한 가천의약학 면접 기출 가운데 확률과 통계 1문항, 생성형 AI 윤리 1문항, 그리고 계열 공통으로 공개된 인성 질문 10문항입니다.",
};

function QuestionCard({ q, n }: { q: GichulQuestion; n: number }) {
  return (
    <article className="border border-hair-strong bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="tnum text-[11px] font-semibold tracking-[0.2em] text-brass-600">
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="display text-[1.125rem] leading-snug text-ink-900">{q.topic}</h3>
        <span className="text-[12px] font-light text-ink-400">
          {q.year}학년도 · {q.subject}
        </span>
      </div>

      <dl className="mt-5 space-y-3 text-[14px] font-light leading-[1.8] text-ink-700">
        <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
          <dt className="eyebrow pt-1 text-brass-600">근거 기록</dt>
          <dd>{q.record}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
          <dt className="eyebrow pt-1 text-brass-600">질문</dt>
          <dd className="text-ink-900">{q.ask}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
          <dt className="eyebrow pt-1 text-brass-600">보는 것</dt>
          <dd>{q.focus}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
          <dt className="eyebrow pt-1 text-brass-600">답변 골격</dt>
          <dd>
            <ol className="list-decimal space-y-1 pl-5">
              {q.frame.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ol>
          </dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
          <dt className="eyebrow pt-1 text-brass-600">꼬리질문</dt>
          <dd>{q.followups.map((f) => `“${f}”`).join(" / ")}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
          <dt className="eyebrow pt-1 text-brass-600">감점</dt>
          <dd>{q.pitfall}</dd>
        </div>
      </dl>
    </article>
  );
}

function OtherPages({ page }: { page: GichulPage }) {
  const others = (Object.keys(GACHON_PAGES) as GichulPage[]).filter((k) => k !== page);
  const extra: Record<GichulPage, string> = {
    uidae: "기출 출처 · 출제 경향 변화",
    yakdae: "예상 질문 만드는 순서",
    hanuidae: "인성 기출 10문항",
  };
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <p className="text-[13px] font-light text-ink-600">
        나머지 기출 분석은 같은 가천의약학 면접의 다른 페이지에 나눠 실었습니다.
      </p>
      <div className="mt-3 grid gap-px bg-hair sm:grid-cols-2">
        {others.map((k) => {
          const qs = GACHON_QUESTIONS.filter((q) => q.page === k);
          return (
            <Link
              key={k}
              href={GACHON_PAGES[k].href}
              className="group flex items-center justify-between gap-4 bg-white px-5 py-4 transition-colors hover:bg-paper-50"
            >
              <span>
                <span className="block text-[14px] font-medium text-ink-900">{GACHON_PAGES[k].label}</span>
                <span className="mt-1 block text-[12px] font-light text-ink-500">
                  {qs.map((q) => q.topic).join(" · ")} · {extra[k]}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-brass-600 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Sources() {
  return (
    <p className="mx-auto mt-6 max-w-4xl text-[12px] font-light leading-relaxed text-ink-400">
      출처:{" "}
      {GACHON_SOURCES.map((s, i) => (
        <span key={s.url}>
          {i > 0 ? " · " : ""}
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {s.label}
          </a>
        </span>
      ))}
      . 질문은 보고서 문장을 요약했고, 보고서가 의예·한의예·약학을 나누지 않아 학과 배치는 과목 성격에 따른 것입니다.
    </p>
  );
}

export function GachonGichul({ page }: { page: GichulPage }) {
  const qs = questionsFor(page);
  const unit = GACHON_PAGES[page].unit;

  return (
    <>
      <PromoSection
        eyebrow="PAST QUESTIONS"
        EyebrowIcon={FileSearch}
        title={`가천대 ${unit} 면접 기출 분석`}
        subtitle={INTRO[page]}
      >
        {page === "hanuidae" && (
          <div className="mx-auto mb-8 max-w-4xl border-l-2 border-brass-400 bg-brass-50 px-5 py-4 text-[13px] font-light leading-[1.8] text-ink-700">
            2027학년도 가천대 한의예과는 면접을 보는 전형이 없습니다(논술·교과). 아래는 2026학년도까지 한의예과가 의예·약학과와 함께
            치른 가천의약학 면접의 공개 기출로, 가천대 의대·약대를 함께 지원한다면 그대로 해당됩니다.
          </div>
        )}
        {page === "uidae" && (
          <div className="mx-auto mb-8 max-w-4xl border border-hair-strong bg-white px-6 py-6">
            <p className="eyebrow text-brass-600">한마디로</p>
            <p className="display mt-3 text-[1.25rem] leading-snug text-ink-900">{GACHON_CONCEPT.oneLine}</p>
            <p className="mt-3 text-[13px] font-light leading-[1.8] text-ink-600">{GACHON_CONCEPT.evidence}</p>
          </div>
        )}
        {page === "uidae" && (
          <div className="mx-auto mb-8 max-w-4xl space-y-3 text-[14px] font-light leading-[1.85] text-ink-700">
            <p>
              기출은 가천대가 매년 공개하는 선행학습 영향평가 보고서의 &lsquo;학교생활기록부 기반 면접 질문 사례&rsquo;에서 가져왔습니다.
              보고서에 의약계열 표가 따로 있어, 2025·2026학년도 각 5문항이 가천의약학 면접 기출입니다. 면접은 제시문·공통 문항 없이
              서류평가 때 만든 지원자별 질문으로 진행되고, 면접위원은 내신 성적을 받지 않습니다.
            </p>
            <p>
              지원자 한 명의 생기부에 맞춘 질문을 복원한 사례라 같은 질문이 다시 나오지는 않습니다. 반복되는 것은 &lsquo;기록 한 줄 + 그 밑의
              교과 개념 하나&rsquo;라는 형식입니다.
            </p>
          </div>
        )}
        <div className="mx-auto max-w-4xl space-y-5">
          {qs.map((q, i) => (
            <QuestionCard key={q.id} q={q} n={i + 1} />
          ))}
        </div>
        {page === "hanuidae" ? null : (
          <>
            <OtherPages page={page} />
            <Sources />
          </>
        )}
      </PromoSection>

      {page === "uidae" && (
        <PromoSection
          eyebrow="TREND"
          EyebrowIcon={TrendingUp}
          title="2025 → 2026 가천의약학 출제 변화"
          subtitle="'탐구한 내용을 먼저 말해 보라' 는 단계가 사라졌습니다. 2025학년도 5문항 중 3문항이 탐구 설명부터 시켰지만 2026학년도에는 0문항입니다."
          tone="muted"
        >
          <div className="mx-auto max-w-4xl overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-hair-strong text-ink-500">
                  <th className="py-3 pr-4 font-medium">항목</th>
                  <th className="py-3 pr-4 font-medium">2025학년도</th>
                  <th className="py-3 font-medium">2026학년도</th>
                </tr>
              </thead>
              <tbody className="font-light text-ink-700">
                {GACHON_TREND.map((r) => (
                  <tr key={r.item} className="border-b border-hair align-top">
                    <td className="py-3 pr-4 font-medium text-ink-900">{r.item}</td>
                    <td className="py-3 pr-4">{r.y2025}</td>
                    <td className="py-3">{r.y2026}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ol className="mx-auto mt-8 max-w-4xl list-decimal space-y-2 pl-5 text-[14px] font-light leading-[1.8] text-ink-700">
            <li>
              <strong className="font-medium text-ink-900">개념이 출발점이다.</strong> 탐구 주제(노화, 당뇨병)는 질문을 여는 단서일 뿐이고
              점수는 그 밑의 교과서 개념에서 나옵니다. 2027 요강은 &lsquo;활동의 출발점이 된 수업에서 배운 내용&rsquo;을 질문 범위로 처음 적었습니다.
            </li>
            <li>
              <strong className="font-medium text-ink-900">화학·생명과학이 중심이고 수학도 나온다.</strong> 10문항 중 7문항이 화학·생명과학입니다.
              다만 질문은 생기부를 따라가므로 수학·물리 세특이 길면 그 과목에서 나옵니다.
            </li>
            <li>
              <strong className="font-medium text-ink-900">세특 밖 기록도 개념으로 묻는다.</strong> 2026학년도에는 독서 기록과 진로활동에서도
              문항이 나왔고, 독서는 &lsquo;교과 개념과 연결해&rsquo;라는 조건이 붙었습니다.
            </li>
          </ol>
        </PromoSection>
      )}

      {page === "yakdae" && (
        <PromoSection
          eyebrow="PREPARE"
          EyebrowIcon={ListChecks}
          title="내 생기부로 같은 형식의 질문 만들기"
          subtitle="기출의 형식이 '기록 한 줄 + 그 밑의 교과 개념 하나' 로 고정돼 있어, 내 생기부로 예상 질문을 직접 뽑을 수 있습니다."
          tone="muted"
        >
          <ol className="mx-auto max-w-4xl space-y-4">
            {GACHON_PREP.map((p, i) => (
              <li key={p.step} className="flex gap-4">
                <span className="tnum mt-0.5 text-[12px] font-semibold text-brass-600">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[14px] font-light leading-[1.8] text-ink-700">
                  <span className="font-medium text-ink-900">{p.step}</span> — {p.detail}
                </span>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-6 max-w-4xl text-[14px] font-light leading-[1.8] text-ink-700">
            답의 순서는 항상 물은 것에 먼저 답하고 탐구 이야기는 뒤에 붙입니다. 면접위원은 내신을 모르므로 개념 설명의 정확도가 공부를 확인하는 거의 유일한 단서입니다.
          </p>
        </PromoSection>
      )}

      {page === "hanuidae" && (
        <PromoSection
          eyebrow="CHARACTER"
          EyebrowIcon={Users}
          title="가천대 인성 기출 10문항"
          subtitle="인성 질문은 계열 구분 없이 공개됩니다. 10문항 모두 '학생부에 이렇게 적혀 있는데' 로 시작해 그 행동의 이유·기준·방법을 물었고, 상황·가치관을 따로 던지는 질문은 없었습니다."
          tone="muted"
        >
          <div className="mx-auto max-w-5xl overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-hair-strong text-ink-500">
                  <th className="py-3 pr-3 font-medium">학년도</th>
                  <th className="py-3 pr-3 font-medium">근거 기록</th>
                  <th className="py-3 pr-3 font-medium">묻는 것</th>
                  <th className="py-3 pr-3 font-medium">유형</th>
                  <th className="py-3 font-medium">답변 포인트</th>
                </tr>
              </thead>
              <tbody className="font-light text-ink-700">
                {GACHON_INSEONG.map((r) => (
                  <tr key={`${r.year}-${r.record}`} className="border-b border-hair align-top">
                    <td className="tnum py-3 pr-3">{r.year}</td>
                    <td className="py-3 pr-3">{r.record}</td>
                    <td className="py-3 pr-3">{r.ask}</td>
                    <td className="py-3 pr-3 whitespace-nowrap">{r.kind}</td>
                    <td className="py-3">{r.point}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-6 max-w-4xl text-[14px] font-light leading-[1.8] text-ink-700">
            <BookOpenCheck className="mr-1.5 inline h-4 w-4 align-[-3px] text-jade-600" strokeWidth={1.75} />
            세 유형 모두 답의 순서는 같습니다. 장면 하나(언제·무엇) → 내가 한 행동 → 그때 중요하게 본 기준 → 결과나 바뀐 점입니다.
          </p>
          <OtherPages page={page} />
          <Sources />
        </PromoSection>
      )}
    </>
  );
}
