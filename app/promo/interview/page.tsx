import type { Metadata } from "next";
import {
  MessagesSquare,
  Users,
  Brain,
  FileText,
  ScrollText,
  HeartHandshake,
  ClipboardCheck,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  FinalCTA,
} from "../_components";

export const metadata: Metadata = {
  title: "의대 면접 수업 | T Medi — MMI·인적성·제시문 실전 대비",
  description:
    "의대 면접의 당락은 실전 훈련에서 갈립니다. 다중미니면접(MMI), 인·적성 면접, 제시문 면접을 유형별로 분석하고 대학별 빈출 문항으로 실전 연습합니다. 담당 멘토의 피드백까지. tmedi.kr",
};

const TYPES = [
  {
    icon: Users,
    title: "다중미니면접 (MMI)",
    body: "윤리·상황·인성 등 스테이션별 유형을 분석하고, 짧은 시간에 논리적으로 답하는 구조를 실전으로 훈련합니다.",
  },
  {
    icon: HeartHandshake,
    title: "인 · 적성 면접",
    body: "의사로서의 가치관·태도를 묻는 인적성 문항에 진정성 있게, 그러나 흔들리지 않는 프레임으로 답하도록 연습합니다.",
  },
  {
    icon: ScrollText,
    title: "제시문 면접",
    body: "제시문을 빠르게 독해하고 핵심을 잡아 논리적으로 전개하는 훈련. 반박·추가 질문에 대응하는 법까지 다룹니다.",
  },
  {
    icon: FileText,
    title: "생기부 기반 면접",
    body: "제출한 생기부·세특을 기반으로 나올 수 있는 질문을 예측하고, 활동의 의미를 설득력 있게 설명하도록 준비합니다.",
  },
  {
    icon: Brain,
    title: "답변 프레임 훈련",
    body: "말문이 막히지 않도록 두괄식·근거·마무리로 이어지는 답변 프레임을 체화합니다. 표현·태도·시선까지 코칭합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "대학별 실전 모의면접",
    body: "지원 대학의 면접 유형과 빈출 문항으로 실전과 동일하게 모의면접을 진행하고, 즉시 피드백을 제공합니다.",
  },
];

const STEPS = [
  {
    title: "유형 진단",
    body: "지원 대학·계열의 면접 유형(MMI·인적성·제시문)을 파악하고, 현재 말하기 습관과 강·약점을 진단합니다.",
  },
  {
    title: "유형별 기본기",
    body: "유형별 접근법과 답변 프레임을 익힙니다. 제시문 독해, MMI 스테이션 대응 등 기본 구조를 잡습니다.",
  },
  {
    title: "빈출 문항 실전 연습",
    body: "대학별 빈출 문항으로 반복 연습하며, 반박·추가 질문 대응과 시간 관리 감각을 키웁니다.",
  },
  {
    title: "실전 모의면접 · 피드백",
    body: "실전과 동일한 조건으로 모의면접을 진행하고, 표현·논리·태도를 즉시 교정합니다.",
  },
  {
    title: "지원 전 마무리 점검",
    body: "생기부 기반 예상 질문까지 최종 점검해, 면접장에서 흔들리지 않도록 마무리합니다.",
  },
];

const FEATURES = [
  "MMI·인적성·제시문·생기부 기반 면접 전 유형 대응",
  "대학·계열별 빈출 문항으로 실전 반복 연습",
  "두괄식 답변 프레임과 표현·태도·시선까지 코칭",
  "실전과 동일한 조건의 모의면접 + 즉시 피드백",
  "제출 생기부 기반 예상 질문 예측·대비",
  "수시 컨설팅과 연계한 지원 전 마무리 점검",
];

export default function InterviewPage() {
  return (
    <>
      <PromoHero
        badge="의대 면접 수업 · MMI·인적성·제시문"
        title="의대 면접,"
        highlight="실전에서 갈립니다"
        body="면접은 벼락치기가 어렵습니다. 다중미니면접(MMI), 인·적성, 제시문, 생기부 기반 면접을 유형별로 분석하고, 대학별 빈출 문항으로 실전처럼 반복 훈련합니다. 표현·태도·논리까지 담당 멘토가 즉시 교정합니다."
        primaryHref="/"
        primaryLabel="면접 수업 상담하기"
        secondaryHref="/promo/susi"
        secondaryLabel="수시 컨설팅 보기"
        Icon={MessagesSquare}
        stats={[
          { icon: Users, label: "MMI" },
          { icon: HeartHandshake, label: "인·적성" },
          { icon: ScrollText, label: "제시문" },
        ]}
      />

      <PromoSection
        eyebrow="TYPES"
        EyebrowIcon={MessagesSquare}
        title="다루는 면접 유형"
        subtitle="대학·계열마다 다른 면접 유형을, 유형별 접근법으로 나눠 대비합니다."
      >
        <FeatureGrid items={TYPES} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="PROCESS"
        EyebrowIcon={Brain}
        title="수업 진행 과정"
        subtitle="유형 진단부터 실전 모의면접까지 5단계로 실력을 쌓습니다."
        tone="muted"
      >
        <StepList steps={STEPS} />
      </PromoSection>

      <PromoSection
        eyebrow="FEATURES"
        EyebrowIcon={ClipboardCheck}
        title="수업 특징"
        subtitle="아는 것과 말할 수 있는 것은 다릅니다. 실전 감각을 만듭니다."
      >
        <CheckList items={FEATURES} />
      </PromoSection>

      <FinalCTA
        title="면접장에서 흔들리지 않도록"
        body="지원 대학의 면접 유형과 빈출 문항으로 실전처럼 훈련하고, 담당 멘토의 피드백으로 완성하세요."
        Icon={MessagesSquare}
        primaryHref="/"
        primaryLabel="면접 수업 상담하기"
      />
    </>
  );
}
