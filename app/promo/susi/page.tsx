import type { Metadata } from "next";
import {
  ClipboardCheck,
  Target,
  FileText,
  Layers,
  Compass,
  BookOpenCheck,
  GraduationCap,
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
  title: "의대 수시 컨설팅 | T Medi — 학종·교과·논술 전형 설계",
  description:
    "의대·치대·한의대·약대·수의대 수시 종합 컨설팅. 학종·교과·논술 전형 구조 분석, 생기부 방향 설계, 수능 최저 점검, 수시 6장 지원 조합까지 담당 멘토가 1:1로 설계합니다. tmedi.kr",
};

const SCOPE = [
  {
    icon: Target,
    title: "전형 진단 · 지원 전략",
    body: "현재 내신·모의고사·생기부를 기준으로 학종·교과·논술 중 유리한 전형을 진단하고 계열별 지원 방향을 잡습니다.",
  },
  {
    icon: FileText,
    title: "생기부 · 학종 설계",
    body: "생명·화학 세특 심화, 의학적 탐구·봉사 경험 등 의대 학종 평가 요소 중심으로 생기부 방향과 활동을 설계합니다.",
  },
  {
    icon: Layers,
    title: "수능 최저 점검",
    body: "대학·전형별 수능 최저학력기준을 정리하고, 모의고사 성적 기반으로 충족 가능성을 현실적으로 점검합니다.",
  },
  {
    icon: BookOpenCheck,
    title: "논술 전형 대응",
    body: "수리·과학 논술을 요구하는 의약학 논술 전형의 출제 경향을 정리하고, 최저 충족과 병행하는 준비 플랜을 제시합니다.",
  },
  {
    icon: Compass,
    title: "수시 6장 지원 조합",
    body: "교과·종합·논술을 계열·대학별로 비교해, 상향·적정·안정을 균형 있게 배분한 수시 6장 조합을 시뮬레이션합니다.",
  },
  {
    icon: GraduationCap,
    title: "계열별 맞춤 전략",
    body: "의대·치대·한의대·약대·수의대 각 계열의 전형 구조와 요구 역량 차이에 맞춰 지원 우선순위를 정리합니다.",
  },
];

const STEPS = [
  {
    title: "현황 진단",
    body: "내신 등급, 모의고사 성적대, 생기부 세특·활동 내역을 정리해 현재 위치와 강·약점을 파악합니다.",
  },
  {
    title: "목표 계열 · 전형 확정",
    body: "목표 계열과 유리한 전형(학종·교과·논술)을 확정하고, 수능 최저 충족선을 함께 설정합니다.",
  },
  {
    title: "생기부 · 활동 방향 설계",
    body: "학종 평가 요소에 맞춰 세특·탐구·활동 방향을 잡고, 학기 흐름에 맞는 실행 계획을 세웁니다.",
  },
  {
    title: "지원 조합 설계",
    body: "수시 6장을 상향·적정·안정으로 배분해 지원 조합을 확정하고, 대학·전형별 서류 방향을 정리합니다.",
  },
  {
    title: "서류 · 마무리 점검",
    body: "자기소개(해당 시)·서류 방향을 최종 점검하고, 면접 전형까지의 연결 계획을 함께 정리합니다.",
  },
];

const FEATURES = [
  "담당 멘토 1:1 컨설팅 (컨설팅 5회 기준, 상황별 조정)",
  "의대·치대·한의대·약대·수의대 계열별 전형 구조 분리 분석",
  "대학·전형별 수능 최저 데이터 기반 충족 점검",
  "생기부·세특 방향 설계와 학기 중 실행 관리",
  "수시 6장 상향·적정·안정 지원 조합 시뮬레이션",
  "면접·MMI 수업과 연계한 지원 전 마무리 점검",
];

export default function SusiConsultingPage() {
  return (
    <>
      <PromoHero
        badge="의대 수시 종합 컨설팅"
        title="의대 수시,"
        highlight="전형 설계부터 다릅니다"
        body="학종·교과·논술 중 무엇이 유리한지, 생기부는 어디로 향해야 하는지, 수능 최저는 충족 가능한지 — 담당 멘토가 현재 성적과 생기부를 기준으로 수시 6장 전체를 1:1로 설계합니다."
        primaryHref="#contact"
        primaryLabel="수시 컨설팅 상담하기"
        secondaryHref="/promo/interview"
        secondaryLabel="면접 수업 보기"
        Icon={ClipboardCheck}
        stats={[
          { icon: FileText, label: "학종·교과·논술" },
          { icon: Layers, label: "수능 최저 점검" },
          { icon: Compass, label: "수시 6장 조합" },
        ]}
      />

      <PromoSection
        eyebrow="SCOPE"
        EyebrowIcon={Target}
        title="컨설팅 범위"
        subtitle="전형 진단부터 지원 조합까지, 의대 수시의 전 과정을 다룹니다."
      >
        <FeatureGrid items={SCOPE} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="PROCESS"
        EyebrowIcon={Compass}
        title="진행 과정"
        subtitle="현황 진단부터 지원 조합 확정까지 5단계로 진행합니다."
        tone="muted"
      >
        <StepList steps={STEPS} />
      </PromoSection>

      <PromoSection
        eyebrow="FEATURES"
        EyebrowIcon={ClipboardCheck}
        title="컨설팅 특징"
        subtitle="합격을 가르는 요소를 데이터와 멘토의 시선으로 함께 점검합니다."
      >
        <CheckList items={FEATURES} />
      </PromoSection>

      <FinalCTA
        title="의대 수시, 지금 전략부터 시작하세요"
        body="목표 계열과 현재 성적·생기부 상황을 기준으로, 합격까지의 수시 경로를 담당 멘토가 함께 설계합니다."
        Icon={ClipboardCheck}
        primaryHref="#contact"
        primaryLabel="수시 컨설팅 상담하기"
      />
    </>
  );
}
