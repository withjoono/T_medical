import type { Metadata } from "next";
import {
  PenLine,
  Target,
  Layers,
  Compass,
  Calculator,
  FlaskConical,
  CalendarClock,
  ShieldAlert,
  BookOpenCheck,
  FileText,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  StatBand,
  CompareTable,
  NoteBox,
  LinkCards,
  SourceNote,
  FinalCTA,
} from "../../_components";

export const metadata: Metadata = {
  title: "의대 논술전형 | T Medi — 수리·과학 논술과 수능최저 동시 공략",
  description:
    "2027학년도 의대 논술전형 121명(3.5%). 실시 대학과 논술 유형(수리·과학·의학논술), 수능 최저 기준, 수능 전후 일정 배치, 준비 전략까지 정리했습니다. tmedi.kr",
};

const NATURE = [
  {
    icon: Calculator,
    title: "내신 영향력이 가장 작은 전형",
    body: "교과 반영이 있어도 등급 간 점수 차가 작게 설계돼 사실상 논술 성적으로 순위가 정해집니다. 내신 열세를 뒤집을 수 있는 거의 유일한 수시 경로입니다.",
  },
  {
    icon: FlaskConical,
    title: "수리 중심, 대학에 따라 과학 추가",
    body: "가천대·성균관대·이화여대처럼 수리논술만 보는 곳이 있고, 아주대·경희대처럼 수리+과학을 함께 보는 곳, 경북대처럼 의학 소재 논술을 더하는 곳이 있습니다.",
  },
  {
    icon: Target,
    title: "최저 기준이 가장 높은 축",
    body: "3개 영역 합 4 이내를 요구하는 대학이 있을 만큼 기준이 높습니다. 논술을 잘 써도 최저를 놓치면 그대로 끝납니다.",
  },
  {
    icon: CalendarClock,
    title: "수능 전·후로 갈리는 일정",
    body: "수능 전 논술과 수능 후 논술이 나뉩니다. 수능 전 논술은 수능 준비와 충돌하므로 지원 자체를 신중히 판단해야 합니다.",
  },
  {
    icon: Layers,
    title: "경쟁률은 높고 실질 경쟁은 다르다",
    body: "명목 경쟁률이 수십 대 일이지만 최저 충족자와 실제 응시자를 걸러내면 크게 줄어듭니다. 결시율을 감안한 판단이 필요합니다.",
  },
  {
    icon: PenLine,
    title: "채점은 과정을 본다",
    body: "답만 맞아서는 점수가 나오지 않습니다. 조건 확인, 근거 제시, 표기의 일관성까지 포함해 '풀이의 서술'이 평가 대상입니다.",
  },
];

const UNIV_HEAD = ["논술 유형", "주요 실시 대학", "준비 포인트"];
const UNIV_ROWS = [
  [
    "수리논술 중심",
    "가천대 · 성균관대 · 이화여대",
    "미적분·확통 심화 서술. 계산보다 논증 구조와 조건 처리의 완결성이 점수를 만듭니다.",
  ],
  [
    "수리 + 과학논술",
    "아주대 · 경희대",
    "과학은 대체로 화학·생명 중 선택 구조. 실험 상황 해석과 개념 적용을 함께 봅니다.",
  ],
  [
    "수리 + 의학·통합형",
    "경북대 · 중앙대(창의형)",
    "의학·생명 소재의 자료 해석형. 배경지식보다 제시 자료를 읽어내는 훈련이 우선입니다.",
  ],
  [
    "논술 고배점형",
    "가톨릭대 · 한양대 · 인하대",
    "논술 반영 비중이 80~100%. 단일 시험으로 결정되므로 실전 시간 배분이 곧 실력입니다.",
  ],
  [
    "지역인재 논술",
    "부산대 등",
    "지역 자격이 있으면 경쟁 모수가 줄어듭니다. 일반 논술과 별도로 확인하세요.",
  ],
];

const MIN_HEAD = ["최저 수준", "해당 대학 예시", "체감 난도"];
const MIN_ROWS = [
  ["3개 영역 합 4 이내", "가천대 · 경희대 · 한양대", "사실상 두 과목 1등급 + 한 과목 2등급 수준"],
  ["3개 영역 각 1등급", "인하대", "탐구 포함 세 과목 모두 1등급 — 가장 빡빡한 축"],
  ["4개 영역 합 5 이내", "가톨릭대 · 성균관대 · 이화여대", "영어 포함 네 영역 관리가 필요"],
  ["4개 영역 합 6 이내", "아주대", "상대적으로 여유 있으나 여전히 최상위권"],
  ["최저 미적용", "중앙대 창의형 등", "최저가 없는 만큼 논술 경쟁이 극단적으로 몰립니다"],
];

const PREP = [
  {
    title: "6~7월 · 기출로 유형 확정",
    body: "지원 후보 대학의 최근 3개년 기출과 예시 답안을 풀어 유형을 확정합니다. 대학별 출제 색이 뚜렷해 범용 준비는 효율이 낮습니다.",
  },
  {
    title: "7~8월 · 서술 훈련",
    body: "답을 아는 문제를 '채점자가 읽는 글'로 다시 쓰는 훈련을 합니다. 조건 명시, 논거 배치, 기호 정의가 점수를 만듭니다.",
  },
  {
    title: "8월 · 최저 기준으로 후보 압축",
    body: "모평 성적 기준으로 충족 가능한 최저 구간을 정하고, 그 위 대학은 과감히 제외합니다.",
  },
  {
    title: "9~10월 · 수능 우선, 논술 유지",
    body: "최저가 곧 자격이므로 수능이 1순위입니다. 논술은 주 1~2회 실전 세트로 감각만 유지합니다.",
  },
  {
    title: "11~12월 · 수능 후 집중",
    body: "수능 직후부터 논술 고사까지가 실질 승부 구간입니다. 시험 시간과 동일한 조건으로 반복합니다.",
  },
];

const FIT = [
  "내신은 밀리지만 모의고사 성적이 안정적으로 최상위권인 학생",
  "수학 서술형에서 풀이 과정을 논리적으로 쓰는 데 강점이 있는 학생",
  "수시 6장 중 1~2장을 상향 카드로 배치하려는 학생",
  "학종 준비가 늦어 생기부 경쟁력이 부족하다고 판단되는 학생",
  "재수·N수생으로 생기부 보완이 사실상 불가능한 경우",
  "수능 최저를 안정적으로 충족할 수 있다는 근거(모평 2회 이상)가 있는 학생",
];

export default function NonsulPage() {
  return (
    <>
      <PromoHero
        badge="수시 · 논술전형"
        title="121명,"
        highlight="가장 좁고 가장 빠른 문"
        body="의대 수시 전체의 3.5%. 내신을 거의 보지 않는 대신 논술 실력과 높은 수능 최저를 동시에 요구합니다. 냉정한 판단이 먼저입니다."
        primaryHref="#contact"
        primaryLabel="논술전형 상담하기"
        secondaryHref="/promo/susi"
        secondaryLabel="수시 전형 한눈에"
        Icon={PenLine}
        stats={[
          { icon: Calculator, label: "수리논술" },
          { icon: FlaskConical, label: "과학·의학논술" },
          { icon: Target, label: "높은 수능 최저" },
        ]}
      />

      <StatBand
        items={[
          {
            value: "121명",
            label: "2027 의대 논술 모집",
            sub: "전체 모집의 3.5% · 네 전형 중 최소",
          },
          {
            value: "111명",
            label: "일반전형 논술",
            sub: "일반전형 1,757명 중 6.3%",
          },
          {
            value: "10여 개",
            label: "논술 실시 의대",
            sub: "대학별 유형·반영 비율이 크게 다릅니다",
          },
          {
            value: "3개 합 4",
            label: "가장 높은 최저 수준",
            sub: "대학에 따라 3개 영역 각 1등급을 요구하기도",
          },
        ]}
        caption="2027학년도 전형계획 집계 기준. 대학별 인원과 최저는 최종 모집요강에서 확정됩니다."
      />

      <PromoSection
        eyebrow="NATURE"
        EyebrowIcon={PenLine}
        title="논술전형의 성격"
        subtitle="'내신이 약해도 되는 전형'이라는 말은 절반만 맞습니다."
      >
        <FeatureGrid items={NATURE} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="TYPES"
        EyebrowIcon={FlaskConical}
        title="유형별 실시 대학"
        subtitle="같은 '의대 논술'이라도 요구하는 능력이 다릅니다. 유형을 먼저 고르고 대학을 좁히세요."
        tone="muted"
      >
        <CompareTable
          head={UNIV_HEAD}
          rows={UNIV_ROWS}
          caption="실시 대학과 유형은 2027학년도 전형계획 발표 시점 기준 정리입니다. 대학별 모집인원·반영 비율·시행 여부는 최종 모집요강을 반드시 확인하세요."
        />
      </PromoSection>

      <PromoSection
        eyebrow="MINIMUM"
        EyebrowIcon={Target}
        title="수능 최저 수준별 분류"
        subtitle="논술 준비보다 먼저 결정해야 하는 것이 '어느 최저까지 감당할 수 있는가'입니다."
      >
        <CompareTable
          head={MIN_HEAD}
          rows={MIN_ROWS}
          caption="최저 기준은 대학·전형별로 다르고 해마다 바뀝니다. 표는 유형 이해를 돕기 위한 정리이며, 지원 판단은 해당 대학 모집요강 기준으로 하세요."
        />
      </PromoSection>

      <PromoSection
        eyebrow="FIT"
        EyebrowIcon={Compass}
        title="논술이 맞는 학생"
        subtitle="아래 중 서너 개 이상 해당한다면 상향 카드로 검토할 만합니다."
        tone="muted"
      >
        <CheckList items={FIT} />
      </PromoSection>

      <PromoSection
        eyebrow="PREP"
        EyebrowIcon={CalendarClock}
        title="준비 일정"
        subtitle="수능이 1순위라는 원칙 아래, 논술은 감각을 유지하다 수능 직후 집중합니다."
      >
        <StepList steps={PREP} />
      </PromoSection>

      <PromoSection eyebrow="CAUTION" EyebrowIcon={ShieldAlert} title="지원 전 확인" tone="muted">
        <NoteBox
          title="논술전형에서 자주 나오는 판단 착오"
          tone="warn"
          Icon={ShieldAlert}
          items={[
            "경쟁률만 보고 포기하거나 지원하는 것 — 최저 충족자와 실제 응시자를 기준으로 보면 숫자가 완전히 달라집니다.",
            "수능 전 논술 지원 — 수능 직전 주말을 통째로 쓰는 셈이라, 최저가 아슬아슬하면 손해가 큽니다.",
            "'논술 학원만 다니면 된다' — 최저 미충족으로 탈락하는 인원이 매년 가장 많습니다.",
            "여러 대학을 한 번에 준비하는 것 — 출제 유형이 다르면 준비 시간이 분산돼 어느 쪽도 완성되지 않습니다.",
            "논술 일정 중복 — 같은 날 오전·오후로 겹치는 경우가 있어 원서 단계에서 확인해야 합니다.",
          ]}
        />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={Layers} title="다른 경로도 함께">
        <LinkCards
          items={[
            {
              href: "/promo/jungsi",
              icon: Target,
              title: "정시 전략",
              body: "논술을 준비하는 학생은 정시와 함께 설계할 때 안전해집니다.",
            },
            {
              href: "/promo/susi/gyogwa",
              icon: BookOpenCheck,
              title: "학생부교과전형",
              body: "내신이 받쳐준다면 안정 카드로 함께 검토하세요.",
            },
            {
              href: "/promo/susi/jonghap",
              icon: FileText,
              title: "학생부종합전형",
              body: "2027 의대 최대 전형. 생기부 경쟁력이 있다면 우선순위가 달라집니다.",
            },
          ]}
          columns={3}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "2027학년도 대학입학전형시행계획 및 관련 보도 집계 기준(2026년 9월 정리).",
          "논술 실시 대학·모집인원·수능 최저는 대학별 최종 모집요강에서 확정되며, 집계 기준에 따라 수치가 달라질 수 있습니다.",
          "표에 적힌 대학 예시는 유형 이해를 위한 정리입니다. 지원 판단은 반드시 해당 연도 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title="논술, 상향 카드로 쓸 수 있을까요?"
        body="모평 성적과 내신을 함께 보면 논술이 기회인지 낭비인지 비교적 분명하게 갈립니다. 지원 여부부터 함께 판단해 드립니다."
        Icon={PenLine}
        primaryHref="#contact"
        primaryLabel="논술전형 상담하기"
      />
    </>
  );
}
