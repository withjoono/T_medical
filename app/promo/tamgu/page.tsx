import type { Metadata } from "next";
import Link from "next/link";
import {
  Microscope,
  FlaskConical,
  PenLine,
  Layers,
  Copy,
  Unlink,
  Award,
  GitMerge,
  Scale,
  ArrowRight,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  PriceCard,
} from "../_components";

export const metadata: Metadata = {
  title: "의대 지망 탐구보고서, 과학고 눈높이로 | T Medi 탐구 컨설팅",
  description:
    "의대 학종·세특에서 변별력을 만드는 건 글쓰기가 아니라 탐구의 깊이입니다. 과학고 R&E까지 감수하는 전 과목 선생님이 의대 지망생의 탐구보고서를 한 단계 위 깊이로 지도합니다. 컨설팅 5회 + 학습관리 병행. tmedi.kr",
};

/** 문제 — 왜 티가 안 나는가 */
const PROBLEMS = [
  {
    icon: PenLine,
    title: "대부분 '글쓰기 첨삭'에서 멈춥니다",
    body: "많은 곳이 문장을 다듬어주지만, 정작 탐구의 내용과 논리의 깊이는 봐주지 못합니다.",
  },
  {
    icon: Layers,
    title: "지도자가 전 과목을 다 보긴 어렵습니다",
    body: "물·화·생·수학을 넘나드는 융합 주제, 특히 의대가 중시하는 생명·화학 심화를 제대로 지도받기 어렵습니다.",
  },
  {
    icon: Copy,
    title: "주제가 남들과 비슷합니다",
    body: "검색하면 나오는 흔한 의학 주제로는 학종·세특에서 변별력이 생기지 않습니다.",
  },
  {
    icon: Unlink,
    title: "탐구가 일회성으로 끝납니다",
    body: "탐구 따로, 내신 따로 흘러가면 학습의 흐름이 이어지지 않습니다.",
  },
];

/** 차별점 — 첫 항목은 featured 콜아웃, 나머지는 그리드 */
const FEATURED = {
  icon: Award,
  title: "희귀한 이력",
  body: "물·화·생과 수학 전 영역을, 과학고생 대상 AP 수준까지 가르치는 선생님이 직접 지도합니다. 일반고 환경에서는 만나기 어려운 시선입니다.",
};
const DIFFERENCE = [
  {
    icon: Microscope,
    title: "과학고 눈높이의 깊이로",
    body: "과학고 R&E까지 감수하는 선생님이, 의대 지망생의 탐구를 한 단계 위 깊이로 끌어올립니다.",
  },
  {
    icon: GitMerge,
    title: "융합·교차 주제까지 커버",
    body: "생명·화학을 중심으로 물·화·생·수학을 한 사람이 다루기에, 과목을 넘나드는 융합 탐구도 의학적 맥락으로 연결합니다.",
  },
  {
    icon: Scale,
    title: "할 수 있는 범위를 정직하게",
    body: "데이터와 실행은 학생의 몫입니다. 우리는 주제 설정·논리 전개·데이터 해석·서술 완성도를 지도합니다.",
  },
];

/** 진행 과정 */
const STEPS = [
  {
    title: "주제 · 현재 상황 진단",
    body: "학생의 주제와 진행 상황을 먼저 보고, 지도 가능한 범위와 끌어올릴 수 있는 지점을 정직하게 알려드립니다.",
  },
  {
    title: "차별화된 주제 · 설계 잡기",
    body: "흔하지 않은 탐구 질문을 함께 설계해 뼈대를 세웁니다. 의대 세특에서 눈에 띌 방향으로 주제를 다듬습니다.",
  },
  {
    title: "논리 · 데이터 해석 점검",
    body: "개념 정확성, 논리 전개, 데이터 처리·통계·오차 해석을 전 과목 시선으로 검토합니다.",
  },
  {
    title: "서술 완성도 다듬기",
    body: "세특에 담겼을 때 탐구의 깊이가 드러나도록 구성과 서술을 최종 정리합니다.",
  },
];

/** 지도 범위 */
const COVERAGE = [
  "과학고 수준의 논리·분석 깊이로 탐구 감수",
  "생명·화학 심화 등 의대 학종이 중시하는 세특 방향 설계",
  "차별화된 탐구 주제·연구 질문 설계",
  "데이터 처리·통계·오차 해석 및 논리 전개 점검",
  "물·화·생·수학 융합·교차 주제 통합 지도",
  "탐구와 내신을 함께 잡는 학습관리 병행 (플래너 앱)",
];

/** 가격 포함 사항 */
const INCLUDED = [
  "탐구보고서 컨설팅 5회 (전 과목 통합 지도)",
  "차별화된 주제 설계 · 데이터 해석 지도",
  "학습관리 병행 — 플래너 앱 기재, 주 1회 선생님 검사",
  "검토–수정 반복으로 서술 완성도까지",
];

export default function TamguPage() {
  return (
    <>
      <PromoHero
        badge="의대 지망 탐구보고서 컨설팅"
        title="의대 지망 탐구보고서,"
        highlight="과학고 눈높이로"
        body="대부분의 일반고 탐구는 글쓰기 첨삭에서 멈춥니다. 하지만 의대 학종·세특에서 변별력을 만드는 건 내용의 깊이입니다. 과학고 R&E까지 감수하는 전 과목 선생님이, 의대 지망생의 탐구를 한 단계 위 깊이로 끌어올립니다."
        primaryHref="/"
        primaryLabel="탐구보고서 상담하기"
        secondaryHref="/promo"
        secondaryLabel="왜 다른지 보기"
        Icon={FlaskConical}
        stats={[
          { icon: Microscope, label: "과학고 눈높이" },
          { icon: Award, label: "컨설팅 5회" },
          { icon: Clock, label: "학습관리 병행" },
        ]}
      />

      {/* 문제 */}
      <PromoSection
        eyebrow="PROBLEM"
        EyebrowIcon={PenLine}
        title="왜 의대 지망 탐구는 티가 안 날까요?"
        subtitle="문장을 다듬는 것과, 탐구의 깊이를 끌어올리는 것은 다릅니다."
        tone="muted"
      >
        <FeatureGrid items={PROBLEMS} columns={2} />
        <p className="mx-auto mt-10 max-w-2xl text-center text-slate-600">
          그래서 의대 지망 탐구는, 열심히 해도 세특에서 티가 안 나는 경우가
          많습니다.
        </p>
      </PromoSection>

      {/* 차별점 */}
      <PromoSection
        eyebrow="DIFFERENCE"
        EyebrowIcon={Award}
        title="우리는 무엇이 다를까요?"
        subtitle="일반고에서도 과학고 수준의 탐구 지도를 받을 수 있기 때문입니다."
      >
        {/* featured 콜아웃 */}
        <div className="mx-auto mb-5 max-w-5xl">
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 to-cyan-50 p-7 shadow-sm sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25">
              <FEATURED.icon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {FEATURED.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                {FEATURED.body}
              </p>
            </div>
          </div>
        </div>
        <FeatureGrid items={DIFFERENCE} columns={3} />
      </PromoSection>

      {/* 진행 과정 */}
      <PromoSection
        eyebrow="PROCESS"
        EyebrowIcon={FlaskConical}
        title="탐구보고서 지도, 이렇게 진행됩니다"
        subtitle="데이터는 학생이 만들고, 그 위의 설계·해석·서술을 함께 다듬습니다."
        tone="muted"
      >
        <StepList steps={STEPS} />
      </PromoSection>

      {/* 지도 범위 */}
      <PromoSection
        eyebrow="COVERAGE"
        EyebrowIcon={Scale}
        title="우리가 지도하는 범위"
        subtitle="탐구의 깊이부터 내신과의 연결까지, 한 흐름으로 관리합니다."
      >
        <CheckList items={COVERAGE} />
      </PromoSection>

      {/* 가격 */}
      <PromoSection
        eyebrow="PRICE"
        EyebrowIcon={Award}
        title="탐구보고서 컨설팅 비용"
        subtitle="컨설팅 5회 · 학습관리 병행"
        tone="muted"
      >
        <PriceCard
          courseName="의대 지망 탐구보고서 컨설팅"
          price="96만원"
          badge="컨설팅 5회 · 학습관리 병행"
          BadgeIcon={Award}
          items={INCLUDED}
          href="/"
          label="탐구보고서 상담하기"
        />
      </PromoSection>

      {/* 마무리 + 연락처 (다크) */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950" />
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-44 -right-32 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:px-12 sm:py-28">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30">
            <Microscope className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            일반고에서도, 남다른 탐구는 가능합니다
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            같은 시간을 써도, 어떤 시선으로 지도받느냐에 따라 탐구의 깊이는
            달라집니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:brightness-110"
            >
              상담하기
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-teal-400" /> 010-2518-7139
              <span className="text-slate-500">(06:00~22:00)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-teal-400" /> withjuno@naver.com
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
