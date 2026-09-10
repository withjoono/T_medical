import {
  Stethoscope,
  Target,
  GraduationCap,
  ClipboardCheck,
  MessagesSquare,
  BookOpenCheck,
  Newspaper,
  Activity,
  FileText,
  ShieldCheck,
  Globe2,
  Compass,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  CheckList,
  LinkCards,
  FinalCTA,
} from "./_components";
import { CONTACT_ANCHOR } from "./_chrome";

/** 의약학 계열별 전략 카드 (링크 아님 — 정보성 섹션) */
const TRACKS = [
  {
    icon: Stethoscope,
    title: "의대 (의예과)",
    body: "최상위 내신과 의학적 탐구 역량이 핵심. 생명·화학 세특 심화, MMI 면접, 수능 최저까지 전 전형 대비 전략을 안내합니다.",
  },
  {
    icon: Activity,
    title: "치대 (치의예과)",
    body: "교과·학종 중심 전략과 손기술·공간지각을 어필하는 활동 설계. 면접 빈출 문항과 계열 적합성 포인트를 정리합니다.",
  },
  {
    icon: GraduationCap,
    title: "한의대",
    body: "한의학 관심과 인문·자연 융합 역량 어필이 관건. 논술·면접·수능 최저 조합별 유불리를 계열 특성에 맞춰 제시합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "약대 (통합 6년제)",
    body: "화학·생명 심화 세특과 학업 역량 중심 학종·교과 전략. 지역·전형별 최저 기준과 복수지원 조합을 관리합니다.",
  },
  {
    icon: ShieldCheck,
    title: "수의대",
    body: "동물·생명 탐구 특화 활동과 봉사 경험 설계. 생명과학 심화 세특, 수의학 면접 대비 포인트를 계열별로 안내합니다.",
  },
  {
    icon: Target,
    title: "정시·수능 최저 통합",
    body: "의치한약수 모든 계열의 수능 최저 기준을 한눈에. 과탐 조합 최적화와 정시 배치 전략을 계열별로 비교합니다.",
  },
];

/** 핵심 기능 카드 (정보성 섹션) */
const FEATURES = [
  {
    icon: Target,
    title: "계열별 맞춤 전략",
    body: "의대·치대·한의대·약대·수의대 각 계열의 전형 구조와 요구 역량이 다릅니다. 목표 계열을 고르면 그에 맞춘 로드맵을 제시합니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접·MMI·인적성 대비",
    body: "다중미니면접(MMI), 인·적성 면접, 제시문 면접 등 계열·대학별 면접 유형을 분석하고 실전 질문과 답변 프레임을 훈련합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "수능 최저 관리",
    body: "의약학 수시의 당락을 가르는 수능 최저학력기준. 대학·전형별 최저 기준을 정리하고 충족 가능성을 성적 기반으로 점검합니다.",
  },
  {
    icon: FileText,
    title: "생기부·학종 설계",
    body: "생명·화학 세특 깊이, 의학적 탐구·봉사 경험 등 의약학 입학사정관이 중시하는 요소 중심으로 생기부 방향을 잡습니다.",
  },
  {
    icon: BookOpenCheck,
    title: "수시·정시 통합 전략",
    body: "교과·종합·논술·정시를 계열별로 비교해 지원 조합을 설계합니다. 6장의 수시와 정시 3장을 낭비 없이 배분합니다.",
  },
  {
    icon: GraduationCap,
    title: "논술 전형 대응",
    body: "수리·과학 논술을 요구하는 의약학 논술 전형의 출제 경향을 정리하고, 최저 충족과 병행하는 준비 플랜을 제공합니다.",
  },
];

const STRENGTHS = [
  "의대·치대·한의대·약대·수의대 계열별 전형 구조 완전 분리 분석",
  "대학·전형별 수능 최저학력기준 데이터 정리",
  "다중미니면접(MMI)·인적성·제시문 면접 유형별 대비",
  "생명·화학 세특 등 의약학 특화 생기부 방향 설계",
  "수리·과학 논술 전형 출제 경향 및 최저 병행 플랜",
  "수시 6장 + 정시 3장 지원 조합 시뮬레이션",
];

export default function PromoHome() {
  return (
    <>
      <PromoHero
        badge="의대 진학 전문 · 의치한약수 포털"
        title="의대로 가는 모든 길,"
        highlight="T Medi 하나로"
        body="수시 교과·종합·논술, 정시, 그리고 해외 의대를 거쳐 국내 면허까지 — 의대로 이어지는 모든 경로를 한자리에서 비교하고 설계합니다."
        primaryHref={CONTACT_ANCHOR}
        primaryLabel="상담 신청하기"
        secondaryHref="/promo/susi"
        secondaryLabel="고3 수시 전형 보기"
        Icon={Stethoscope}
        stats={[
          { icon: ClipboardCheck, label: "수시 교과·종합·논술" },
          { icon: Target, label: "정시 전략" },
          { icon: Globe2, label: "해외 의대 경유" },
          { icon: MessagesSquare, label: "면접·MMI" },
        ]}
      />


      {/* 의대 진학 경로 — 이 사이트의 핵심 축 */}
      <PromoSection
        eyebrow="ROUTES"
        EyebrowIcon={Compass}
        title="의대로 가는 네 갈래"
        subtitle="지금 내 성적표와 상황에서 실제로 열려 있는 문이 어디인지부터 확인하세요."
      >
        <LinkCards
          items={[
            {
              href: "/promo/susi",
              icon: ClipboardCheck,
              title: "고3 수시 총정리",
              body: "교과·종합·논술 세 전형의 구조와 모집 규모, 지역인재·지역의사제, 수능 최저까지 한눈에.",
            },
            {
              href: "/promo/susi/jonghap",
              icon: FileText,
              title: "학생부종합전형",
              body: "1,227명으로 2027 의대 최대 전형. 생기부의 깊이와 MMI 면접이 당락을 가릅니다.",
            },
            {
              href: "/promo/jungsi",
              icon: Target,
              title: "정시 전략",
              body: "수능 100%가 깨진 2027 정시. 영역별 반영 비율과 군별 3장 조합을 설계합니다.",
            },
            {
              href: "/promo/overseas",
              icon: Globe2,
              title: "해외 의대 · 경유 루트",
              body: "인정 외국 의대 38개국 159개교, 예비시험을 거쳐 국내 면허까지 가는 경로를 숫자로.",
            },
          ]}
        />
      </PromoSection>

      {/* 강점 축 */}
      <PromoSection
        eyebrow="WHY"
        EyebrowIcon={ShieldCheck}
        title="왜 의약학은 별도 전략이 필요할까요?"
        subtitle="의치한약수 입시는 일반 대학 입시와 경쟁 구조·평가 요소가 다릅니다. T Medi는 이 차이를 정면으로 다룹니다."
        tone="muted"
      >
        <CheckList items={STRENGTHS} />
      </PromoSection>

      {/* 기능 소개 축 */}
      <PromoSection
        eyebrow="FEATURES"
        EyebrowIcon={Target}
        title="핵심 기능"
        subtitle="계열 선택부터 면접 대비까지, 의약학 진학의 전 과정을 지원합니다."
      >
        <FeatureGrid items={FEATURES} columns={3} />
      </PromoSection>

      {/* 계열별 전략 */}
      <PromoSection
        eyebrow="TRACKS"
        EyebrowIcon={GraduationCap}
        title="계열별 진학 전략"
        subtitle="의대·치대·한의대·약대·수의대, 그리고 정시 최저까지. 각 계열의 특성에 맞춘 접근을 확인하세요."
        tone="muted"
      >
        <FeatureGrid items={TRACKS} columns={3} />
      </PromoSection>

      {/* 다른 promo 페이지로 연결 */}
      <PromoSection eyebrow="MORE" EyebrowIcon={Newspaper} title="더 알아보기">
        <LinkCards
          items={[
            {
              href: "/promo/susi/gyogwa",
              icon: BookOpenCheck,
              title: "학생부교과전형",
              body: "환산 등급과 수능 최저로 승부하는 정량 트랙. 1단계 배수 축소 흐름까지 정리했습니다.",
            },
            {
              href: "/promo/susi/nonsul",
              icon: Target,
              title: "논술전형",
              body: "121명뿐인 좁은 문. 수리·과학 논술과 높은 최저를 동시에 요구합니다.",
            },
            {
              href: "/promo/guide",
              icon: Compass,
              title: "사용법",
              body: "가입부터 목표 계열 선택, 성적·생기부 준비, 수시·정시 전략, 면접·MMI 대비까지 단계별 시작 가이드.",
            },
            {
              href: "/promo/blog",
              icon: Newspaper,
              title: "블로그",
              body: "의약학 입시 트렌드, MMI 면접 실전, 수능 최저 전략, 계열 선택 인사이트를 담은 콘텐츠.",
            },
          ]}
        />
      </PromoSection>

      <FinalCTA
        title="의약학 진학, 지금 전략부터 시작하세요"
        body="목표 계열을 고르고 나의 성적·생기부 상황을 입력하면, T Medi가 합격까지의 경로를 함께 설계합니다."
        Icon={Stethoscope}
        primaryHref="#contact"
        primaryLabel="무료로 시작하기"
      />
    </>
  );
}
