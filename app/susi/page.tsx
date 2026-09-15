import type { Metadata } from "next";
import {
  ClipboardCheck,
  Target,
  FileText,
  Layers,
  Compass,
  BookOpenCheck,
  GraduationCap,
  MapPin,
  ShieldAlert,
  PenLine,
  Users,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  CompareTable,
  NoteBox,
  LinkCards,
  SourceNote,
  FinalCTA,
} from "../_site/components";

export const metadata: Metadata = {
  alternates: { canonical: "/susi" },
  title: "고3 의대 수시 총정리 | T Medi — 교과·종합·논술 전형 한눈에",
  description:
    "2027학년도 의대 수시 전형 총정리. 학생부교과·학생부종합·논술 세 전형의 구조와 모집 규모, 지역인재·지역의사제, 수능 최저학력기준까지 고3이 지금 알아야 할 것만 정리했습니다. tmedi.kr",
};

/** 세 전형 상세 페이지로 보내는 카드 */
const TRACK_LINKS = [
  {
    href: "/susi/gyogwa",
    icon: BookOpenCheck,
    title: "학생부교과전형",
    body: "내신 등급이 곧 점수. 1,176명(33.5%)을 뽑는 최대 규모 축이지만, 수능 최저 충족이 실질 관문입니다.",
  },
  {
    href: "/susi/jonghap",
    icon: FileText,
    title: "학생부종합전형",
    body: "2027학년도 의대 최대 전형(1,227명·35.0%). 생기부의 깊이와 면접이 당락을 가릅니다.",
  },
  {
    href: "/susi/nonsul",
    icon: PenLine,
    title: "논술전형",
    body: "121명(3.5%)뿐인 좁은 문. 수리·과학 논술 실력과 높은 수능 최저를 동시에 요구합니다.",
  },
];

const COMPARE_HEAD = [
  "구분",
  "학생부교과",
  "학생부종합",
  "논술",
];

const COMPARE_ROWS = [
  [
    "2027 모집인원",
    "1,176명 (33.5%)",
    "1,227명 (35.0%)",
    "121명 (3.5%)",
  ],
  [
    "핵심 평가 요소",
    "교과 성적(내신 등급) 정량 평가",
    "생기부 정성 평가 + 면접",
    "대학별 논술 고사 성적",
  ],
  [
    "1단계 방식",
    "교과 100% 또는 교과+출결로 배수 선발",
    "서류 100%로 2~5배수 선발",
    "논술 성적 위주(교과 소폭 반영)",
  ],
  [
    "면접",
    "실시 대학 다수(2단계 20~30%)",
    "대부분 실시 · MMI·제시문 비중 큼",
    "대체로 없음",
  ],
  [
    "수능 최저",
    "거의 전 대학 적용 · 충족률이 실질 경쟁률",
    "적용 대학 확대 추세 · 미적용 전형도 존재",
    "적용 대학 대부분 · 기준이 가장 높은 편",
  ],
  [
    "유리한 학생",
    "내신이 최상위권으로 안정적인 학생",
    "내신 대비 생기부·면접 경쟁력이 큰 학생",
    "내신 열세를 실력으로 뒤집으려는 재학·N수생",
  ],
];

const REGION = [
  {
    icon: MapPin,
    title: "지역인재전형 — 지방 의대의 기본값",
    body: "26개 지방 의대에서 1,702명을 지역인재로 선발합니다. 지역의사 선발까지 합치면 지방 의대 모집의 약 70%가 지역 선발입니다.",
  },
  {
    icon: ShieldAlert,
    title: "지역의사 선발전형 — 2027 신설",
    body: "비수도권 32개 의대에서 490명을 새로 선발합니다. 면허 취득 후 지정 지역에서 10년 의무복무가 조건이며, 미이행 시 지원금 반환 절차가 따릅니다.",
  },
  {
    icon: Users,
    title: "자격은 '거주'가 아니라 '학적'",
    body: "중·고교를 해당 권역에서 입학·졸업하고 재학 기간 내내 그 지역에 거주해야 합니다. 지역의사 선발은 지역인재보다 요건이 더 엄격합니다.",
  },
  {
    icon: Target,
    title: "일반전형은 오히려 좁아졌다",
    body: "정원은 늘었지만 일반전형은 1,757명으로 전년 대비 27명 줄었습니다. 수도권 학생 기준 체감 경쟁은 더 치열해집니다.",
  },
];

const MINIMUM = [
  "의대 수시의 당락은 상당수가 '수능 최저 충족 여부'에서 갈립니다 — 원서 경쟁률과 실질 경쟁률이 크게 다른 이유입니다.",
  "최저를 요구하지 않는 의대 전형은 15개 대학 24개 전형, 343명 규모입니다(서울대 일반, 성균관대 면접형, 한양대 면접형 등).",
  "최저가 없다는 것은 곧 내신·생기부·면접만으로 승부한다는 뜻이라, 오히려 서류 경쟁이 극단적으로 치열합니다.",
  "2027학년도에는 성균관대 융합형인재, 중앙대 성장형인재처럼 학종에 최저를 새로 도입한 사례가 늘었습니다.",
  "과목 조합(국·수·영·탐 중 몇 개, 탐구 2과목 평균 여부)은 대학마다 다르므로 반드시 모집요강 기준으로 계산해야 합니다.",
];

const PLAN = [
  {
    title: "3~5월 · 현재 위치 확정",
    body: "1~2학년 내신 산출, 모의고사 성적대, 생기부 세특 밀도를 함께 놓고 교과·종합·논술 중 어디에 무게를 둘지 1차 결정합니다.",
  },
  {
    title: "6~7월 · 최저 충족선 설정",
    body: "6월 모평 결과로 수능 최저 충족 가능성을 현실적으로 계산하고, 지원 후보군의 최저 기준을 기준선으로 확정합니다.",
  },
  {
    title: "7~8월 · 지역인재·지역의사 자격 점검",
    body: "학적·거주 요건을 서류로 확인합니다. 자격이 되면 지원 가능 대학 수가 크게 늘어나므로 조합 설계의 출발점이 됩니다.",
  },
  {
    title: "8월 · 수시 6장 조합 확정",
    body: "교과·종합·논술을 상향·적정·안정으로 배분합니다. 면접 일정과 논술 일정이 겹치지 않는지도 이 단계에서 확인합니다.",
  },
  {
    title: "9~12월 · 서류·면접·논술 실행",
    body: "원서 접수 후에도 수능 최저 준비가 최우선입니다. 대학별 고사는 수능 전후 일정에 맞춰 분리해 준비합니다.",
  },
];

const CONSULTING = [
  "담당 멘토 1:1 컨설팅 (컨설팅 5회 기준, 상황별 조정)",
  "교과·종합·논술 세 전형의 유불리를 성적표 기준으로 진단",
  "대학·전형별 수능 최저 데이터 기반 충족 가능성 점검",
  "지역인재·지역의사 선발 자격 확인과 지원 우선순위 설계",
  "생기부·세특 방향 설계와 학기 중 실행 관리",
  "수시 6장 상향·적정·안정 지원 조합 시뮬레이션",
];

export default function SusiHubPage() {
  return (
    <>
      <PromoHero
        badge="고3 의대 수시 · 2027학년도"
        title="의대 수시는"
        highlight="세 갈래로 갈립니다"
        body="교과, 종합, 논술 — 같은 '수시'라는 이름 아래 평가하는 것도, 필요한 준비도 완전히 다릅니다. 내 성적표에서 어느 문이 실제로 열려 있는지부터 확인하세요."
        primaryHref="#contact"
        primaryLabel="수시 전략 상담하기"
        secondaryHref="/jungsi"
        secondaryLabel="정시 전략 보기"
        Icon={ClipboardCheck}
        stats={[
          { icon: BookOpenCheck, label: "교과 1,176명" },
          { icon: FileText, label: "종합 1,227명" },
          { icon: PenLine, label: "논술 121명" },
          { icon: MapPin, label: "지역의사 490명" },
        ]}
      />


      <PromoSection
        eyebrow="TRACKS"
        EyebrowIcon={Compass}
        title="전형별 상세 보기"
        subtitle="세 전형은 경쟁 상대도, 준비 기간도 다릅니다. 각 전형의 구조와 대비 전략을 따로 정리했습니다."
      >
        <LinkCards items={TRACK_LINKS} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="COMPARE"
        EyebrowIcon={Layers}
        title="한 장으로 보는 세 전형"
        subtitle="같은 내신, 같은 생기부라도 전형에 따라 평가 결과가 정반대로 나옵니다."
        tone="muted"
      >
        <CompareTable
          head={COMPARE_HEAD}
          rows={COMPARE_ROWS}
          caption="모집인원은 2027학년도 전형계획 기준 전국 의대 합계입니다. 면접·최저 적용 여부는 대학별로 다릅니다."
        />
      </PromoSection>

      <PromoSection
        eyebrow="REGION"
        EyebrowIcon={MapPin}
        title="2027 최대 변수 — 지역 선발"
        subtitle="정원은 늘었지만 늘어난 자리의 대부분이 지역 몫입니다. 자격 유무가 전략의 출발점입니다."
      >
        <FeatureGrid items={REGION} columns={2} />
      </PromoSection>

      <PromoSection
        eyebrow="MINIMUM"
        EyebrowIcon={Target}
        title="수능 최저 — 수시의 진짜 관문"
        subtitle="의대 수시에서 원서 경쟁률과 실질 경쟁률이 갈리는 지점입니다."
        tone="muted"
      >
        <CheckList items={MINIMUM} />
      </PromoSection>

      <PromoSection
        eyebrow="PLAN"
        EyebrowIcon={Compass}
        title="고3 1년 로드맵"
        subtitle="지금 시점에 무엇을 확정해야 하는지 학기 흐름에 맞춰 정리했습니다."
      >
        <StepList steps={PLAN} />
      </PromoSection>

      <PromoSection
        eyebrow="CONSULTING"
        EyebrowIcon={ClipboardCheck}
        title="수시 컨설팅으로 이어집니다"
        subtitle="전형 진단부터 수시 6장 조합 확정까지, 담당 멘토가 1:1로 설계합니다."
        tone="muted"
      >
        <CheckList items={CONSULTING} />
        <div className="mt-10">
          <NoteBox
            title="상담 전에 준비하면 좋은 자료"
            tone="info"
            Icon={FileText}
            items={[
              "1~3학년 1학기 교과 성적 산출표(원점수·표준편차 포함)",
              "최근 모의고사 성적표 2회분 이상 — 최저 충족 계산의 기준이 됩니다.",
              "생기부 사본 또는 세특·창체 활동 요약 — 학종 방향 판단에 필요합니다.",
              "지역인재·지역의사 지원 여부 확인을 위한 중·고교 학적 정보",
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={GraduationCap} title="함께 보기">
        <LinkCards
          items={[
            {
              href: "/jungsi",
              icon: Target,
              title: "정시 전략",
              body: "수능 100% 시대가 끝난 2027 정시. 반영 구조와 3장 조합을 정리했습니다.",
            },
            {
              href: "/overseas",
              icon: GraduationCap,
              title: "해외 의대 · 경유 루트",
              body: "외국 의대 진학과 예비시험을 거쳐 국내 면허까지 가는 경로를 실제 수치로 정리했습니다.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "2027학년도 대학입학전형시행계획 및 관련 보도 집계 기준으로 정리했습니다(2026년 9월 기준).",
          "의대 모집인원은 정책·대학 사정에 따라 조정될 수 있으며, 확정 수치는 각 대학 수시 모집요강이 기준입니다.",
          "수능 최저, 면접 실시 여부, 지역인재 자격 요건은 대학·전형마다 다릅니다. 지원 전 반드시 해당 대학 요강을 확인하세요.",
        ]}
      />

      <FinalCTA
        title="세 개의 문 중, 내게 열린 문부터"
        body="내신·모의고사·생기부를 한 번에 놓고 보면 어느 전형이 현실적인지 금방 드러납니다. 담당 멘토가 함께 확인해 드립니다."
        Icon={ClipboardCheck}
        primaryHref="#contact"
        primaryLabel="수시 전략 상담하기"
      />
    </>
  );
}
