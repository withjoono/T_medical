import type { Metadata } from "next";
import {
  Rocket,
  Target,
  FileText,
  Layers,
  MessagesSquare,
  Compass,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  StepList,
  FeatureGrid,
  CheckList,
  FinalCTA,
} from "../_components";

export const metadata: Metadata = {
  title: "사용법 | T Medi — 의치한약수 진학 전문 포털",
  description:
    "T Medi 빠른 시작 가이드. 가입부터 목표 계열 선택, 성적·생기부 준비, 수시·정시 전략 수립, 면접·MMI 대비까지 단계별로 안내합니다.",
};

const STEPS = [
  {
    title: "가입 & 목표 설정",
    body: "Hub(T Skool) 계정으로 간편 로그인합니다. 학년, 현재 내신·모의고사 성적대를 입력해 시작점을 설정합니다.",
  },
  {
    title: "목표 계열 선택",
    body: "의대·치대·한의대·약대·수의대 중 목표 계열을 고릅니다. 계열별로 전형 구조와 요구 역량이 달라 전략의 출발점이 됩니다.",
  },
  {
    title: "성적 · 생기부 준비",
    body: "내신 등급, 모의고사 성적, 생기부 세특·활동 내역을 정리합니다. 의약학이 중시하는 생명·화학 세특 방향을 점검합니다.",
  },
  {
    title: "수시 · 정시 전략 수립",
    body: "교과·종합·논술·정시를 계열별로 비교해 지원 조합을 설계합니다. 수능 최저 충족 가능성을 함께 확인합니다.",
  },
  {
    title: "면접 · MMI 대비",
    body: "대학·계열별 면접 유형(MMI·인적성·제시문)을 분석하고 실전 질문으로 훈련합니다. 최종 지원 전 마무리 점검을 진행합니다.",
  },
];

const MENUS = [
  {
    icon: Target,
    title: "계열 전략",
    body: "목표 계열을 선택하면 해당 계열의 전형 구조, 경쟁 특성, 준비 우선순위를 정리해 보여줍니다.",
  },
  {
    icon: FileText,
    title: "생기부 · 학종",
    body: "생명·화학 세특 깊이, 의학적 탐구·봉사 경험 등 의약학 학종 평가 요소 중심으로 생기부 방향을 잡습니다.",
  },
  {
    icon: Layers,
    title: "수능 최저 · 정시",
    body: "대학·전형별 수능 최저 기준과 정시 배치 정보를 정리해 충족 여부와 지원 가능선을 점검합니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접 · MMI",
    body: "다중미니면접·인적성·제시문 면접 유형별 빈출 문항과 답변 프레임을 제공하고 실전 연습을 지원합니다.",
  },
  {
    icon: Compass,
    title: "지원 조합",
    body: "수시 6장 + 정시 3장의 지원 조합을 계열·전형별로 시뮬레이션해 균형 잡힌 배치를 돕습니다.",
  },
  {
    icon: Lightbulb,
    title: "블로그 · 인사이트",
    body: "의약학 입시 트렌드와 실전 노하우 콘텐츠를 통해 최신 흐름을 놓치지 않도록 합니다.",
  },
];

const TIPS = [
  "목표 계열은 하나로 좁히기 전, 2~3개 계열의 전형을 비교해 유불리를 먼저 파악하세요.",
  "수능 최저는 수시 당락의 핵심입니다. 지원 전형을 정할 때 최저부터 역산하세요.",
  "생기부는 학기 중에 채워집니다. 세특 방향을 미리 잡아 활동을 연결하세요.",
  "MMI·인적성 면접은 벼락치기가 어렵습니다. 최소 두 달 전부터 실전 훈련을 시작하세요.",
  "정시 대비 과탐 조합은 목표 대학 반영 방식에 맞춰 일찍 확정하세요.",
];

const FAQ = [
  {
    q: "의대·치대·한의대·약대·수의대를 동시에 준비할 수 있나요?",
    a: "가능합니다. 계열별 전형과 요구 역량을 비교해 우선순위를 정하고, 생기부·수능 최저처럼 공통되는 부분은 함께 준비하도록 안내합니다.",
  },
  {
    q: "내신이 낮은데 의약학 진학이 가능한가요?",
    a: "교과 전형은 어렵더라도 학종·논술·정시 등 다른 경로가 있습니다. 현재 성적대에 맞는 현실적 전형 조합을 제시합니다.",
  },
  {
    q: "MMI 면접은 어떻게 대비하나요?",
    a: "다중미니면접의 스테이션별 유형(윤리·상황·인성 등)을 분석하고, 대학별 빈출 문항으로 실전 답변 훈련을 진행합니다.",
  },
  {
    q: "수능 최저는 어디서 확인하나요?",
    a: "수능 최저 · 정시 메뉴에서 대학·전형별 최저 기준을 정리해 제공하며, 나의 모의고사 성적 기반으로 충족 가능성을 점검합니다.",
  },
  {
    q: "비용이 드나요?",
    a: "핵심 전략 진단은 무료로 시작할 수 있습니다. 심화 컨설팅 여부는 계열·상황에 따라 안내됩니다.",
  },
];

export default function GuidePage() {
  return (
    <>
      <PromoHero
        badge="빠른 시작 가이드"
        title="처음이어도 괜찮아요,"
        highlight="5단계면 충분합니다"
        body="가입부터 목표 계열 선택, 성적·생기부 준비, 수시·정시 전략, 면접·MMI 대비까지 — T Medi를 200% 활용하는 방법을 정리했습니다."
        primaryHref="/"
        primaryLabel="바로 시작하기"
        secondaryHref="/promo/blog"
        secondaryLabel="블로그 보기"
        Icon={Rocket}
        stats={[
          { icon: Target, label: "목표 계열 선택" },
          { icon: FileText, label: "생기부 설계" },
          { icon: MessagesSquare, label: "면접·MMI" },
        ]}
      />

      <PromoSection
        eyebrow="START"
        EyebrowIcon={Rocket}
        title="빠른 시작 5단계"
        subtitle="순서대로 따라오면 목표 계열까지의 전략이 완성됩니다."
      >
        <StepList steps={STEPS} />
      </PromoSection>

      <PromoSection
        eyebrow="MENU"
        EyebrowIcon={Compass}
        title="메뉴별 사용법"
        subtitle="각 메뉴가 의약학 진학의 어떤 부분을 책임지는지 확인하세요."
        tone="muted"
      >
        <FeatureGrid items={MENUS} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="TIPS"
        EyebrowIcon={Lightbulb}
        title="활용 팁"
        subtitle="합격생들이 놓치지 않았던 실전 포인트를 정리했습니다."
      >
        <CheckList items={TIPS} />
      </PromoSection>

      <PromoSection
        eyebrow="FAQ"
        EyebrowIcon={HelpCircle}
        title="자주 묻는 질문"
        tone="muted"
      >
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-start gap-3 text-base font-semibold text-slate-900">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                <span>{item.q}</span>
              </summary>
              <p className="mt-3 pl-8 text-sm leading-relaxed text-slate-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </PromoSection>

      <FinalCTA
        title="이제 나만의 의약학 전략을 만들 차례"
        body="목표 계열을 고르고 5단계를 따라가면, 합격까지의 경로가 그려집니다."
        Icon={Target}
        primaryHref="/"
        primaryLabel="시작하기"
      />
    </>
  );
}
