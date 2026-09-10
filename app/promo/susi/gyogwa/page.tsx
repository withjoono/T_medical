import type { Metadata } from "next";
import {
  BookOpenCheck,
  Target,
  Layers,
  Compass,
  Calculator,
  MapPin,
  MessagesSquare,
  ShieldAlert,
  FileText,
  TrendingDown,
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
} from "../../_components";

export const metadata: Metadata = {
  title: "의대 학생부교과전형 | T Medi — 내신·수능최저·면접 완전 분석",
  description:
    "2027학년도 의대 학생부교과전형 1,176명(33.5%) 분석. 교과 반영 방식, 진로선택과목 환산, 1단계 배수 축소, 수능 최저 충족률, 지역인재 교과까지 고3이 확인해야 할 기준을 정리했습니다. tmedi.kr",
};

const STRUCTURE = [
  {
    icon: Calculator,
    title: "교과 성적이 곧 점수",
    body: "정성 평가 요소가 거의 없습니다. 반영 교과·학년별 가중치·이수 단위로 환산한 등급이 그대로 순위가 되므로, 소수점 단위의 차이가 당락을 만듭니다.",
  },
  {
    icon: Layers,
    title: "반영 교과는 대체로 국·수·영·과",
    body: "의대는 수학·과학 비중을 높게 두는 대학이 많습니다. 전 과목 반영 대학과 주요 교과만 반영하는 대학의 환산 결과가 크게 달라집니다.",
  },
  {
    icon: FileText,
    title: "진로선택과목 환산 방식이 변수",
    body: "성취도(A·B·C)를 등급으로 바꾸는 기준이 대학마다 다릅니다. 2027학년도에는 가톨릭대처럼 환산 등급 기준을 손본 사례가 있어 재계산이 필요합니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접을 두는 대학이 많다",
    body: "1단계 교과 100%로 배수를 뽑고 2단계에서 면접 20~30%를 반영하는 구조가 일반적입니다. 인·적성과 의학 상황 판단을 함께 봅니다.",
  },
  {
    icon: TrendingDown,
    title: "1단계 배수가 좁아지는 추세",
    body: "건국대(글로컬) 지역인재 5배수→3배수, 대구가톨릭대 10→7배수, 계명대 12→10배수, 울산대 지역교과 5→4배수 등 내신 영향력을 키우는 방향입니다.",
  },
  {
    icon: ShieldAlert,
    title: "출결·비교과가 붙기 시작했다",
    body: "가톨릭관동대는 교과 100%에서 교과 93.1% + 출결 6.9%로 바뀌었습니다. 미인정 결석 관리가 실제 점수에 반영되는 구조입니다.",
  },
];

const MINIMUM_HEAD = ["체크 포인트", "확인해야 할 것"];
const MINIMUM_ROWS = [
  [
    "반영 영역 개수",
    "3개 영역 합 / 4개 영역 합 중 어느 쪽인지 — 같은 성적도 결과가 갈립니다.",
  ],
  [
    "탐구 처리 방식",
    "2과목 평균인지, 상위 1과목인지, 과탐만 인정인지 확인이 필요합니다.",
  ],
  [
    "영어 등급 취급",
    "합산에 포함하는 대학과 별도 기준(예: 영어 2등급 이내)을 두는 대학이 있습니다.",
  ],
  [
    "한국사 조건",
    "합산에서 제외하되 최소 등급 조건을 별도로 두는 경우가 많습니다.",
  ],
  [
    "완화·강화 여부",
    "2027학년도에는 가톨릭관동대(3개 합 4→5, 지역인재 5→6) 등 완화 사례가 있어 커트라인 상승 요인이 됩니다.",
  ],
];

const REGION = [
  "지역 선발에서 교과전형 비중이 가장 큽니다 — 지역 선발 인원의 절반가량이 교과로 뽑힙니다.",
  "지역의사 선발전형 490명 중 교과 비중은 약 41%(200명) 수준입니다.",
  "자격은 해당 권역 중·고교 입학·졸업과 재학 기간 거주가 기본입니다. 지역의사는 요건이 더 엄격합니다.",
  "같은 대학이라도 일반 교과와 지역인재 교과의 최저·배수·면접 반영이 다를 수 있습니다.",
  "지역 자격이 있다면 내신 커트라인이 일반전형보다 완만한 경우가 많아 조합의 중심축이 됩니다.",
  "지역의사 선발은 면허 취득 후 10년 의무복무가 조건입니다 — 진로 설계와 함께 판단해야 합니다.",
];

const STEPS = [
  {
    title: "환산 등급부터 직접 계산",
    body: "지원 후보 대학의 반영 교과·가중치 기준으로 내 등급을 각각 환산합니다. 대학마다 0.1~0.3등급씩 결과가 달라집니다.",
  },
  {
    title: "진로선택·성취도 과목 재확인",
    body: "A/B/C 환산표를 대학별로 대입해 유불리를 확인합니다. 여기서 순위가 뒤집히는 경우가 적지 않습니다.",
  },
  {
    title: "수능 최저 충족선을 기준선으로",
    body: "최저를 못 맞추면 내신이 아무리 좋아도 탈락입니다. 6·9월 모평 기준으로 충족 가능한 최저 구간을 먼저 정합니다.",
  },
  {
    title: "면접 실시 여부로 전략 분리",
    body: "면접이 있는 대학은 1단계 통과 후의 역전 가능성을 고려해 상향 카드로, 교과 100% 대학은 안정 카드로 배치합니다.",
  },
  {
    title: "지역 자격을 포함해 6장 배분",
    body: "일반·지역인재·지역의사를 함께 놓고 상향·적정·안정을 배분합니다. 면접 일정 중복도 이 단계에서 걸러냅니다.",
  },
];

export default function GyogwaPage() {
  return (
    <>
      <PromoHero
        badge="수시 · 학생부교과전형"
        title="교과전형은"
        highlight="숫자가 먼저 말합니다"
        body="생기부의 서사보다 환산 등급 한 자리가 앞섭니다. 다만 최종 관문은 수능 최저입니다 — 붙는 사람은 내신과 최저를 동시에 잡은 사람입니다."
        primaryHref="#contact"
        primaryLabel="교과전형 상담하기"
        secondaryHref="/promo/susi"
        secondaryLabel="수시 전형 한눈에"
        Icon={BookOpenCheck}
        stats={[
          { icon: Calculator, label: "교과 정량 평가" },
          { icon: Target, label: "수능 최저 필수" },
          { icon: MapPin, label: "지역인재 최대 축" },
        ]}
      />


      <PromoSection
        eyebrow="STRUCTURE"
        EyebrowIcon={BookOpenCheck}
        title="교과전형은 이렇게 굴러갑니다"
        subtitle="같은 내신 1.0도 대학에 따라 환산 결과가 달라집니다. 구조를 알면 지원 가능 범위가 바뀝니다."
      >
        <FeatureGrid items={STRUCTURE} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="MINIMUM"
        EyebrowIcon={Target}
        title="수능 최저 — 여기서 절반이 걸러집니다"
        subtitle="교과전형은 최저 충족자만 놓고 보면 경쟁률이 원서 경쟁률의 몇 분의 일로 떨어집니다."
        tone="muted"
      >
        <CompareTable
          head={MINIMUM_HEAD}
          rows={MINIMUM_ROWS}
          caption="최저 기준은 대학·전형별로 다르며 매년 변동합니다. 반드시 지원 대학 모집요강 기준으로 계산하세요."
        />
      </PromoSection>

      <PromoSection
        eyebrow="REGION"
        EyebrowIcon={MapPin}
        title="지역인재 · 지역의사 교과"
        subtitle="교과전형에서 지역 자격은 사실상 별도의 트랙입니다."
      >
        <CheckList items={REGION} />
      </PromoSection>

      <PromoSection
        eyebrow="STRATEGY"
        EyebrowIcon={Compass}
        title="지원 전략 5단계"
        subtitle="환산 계산 → 최저 확정 → 면접 유무 분리 → 지역 자격 반영 → 6장 배분 순서로 좁혀갑니다."
        tone="muted"
      >
        <StepList steps={STEPS} />
      </PromoSection>

      <PromoSection
        eyebrow="CAUTION"
        EyebrowIcon={ShieldAlert}
        title="흔히 놓치는 지점"
      >
        <NoteBox
          title="교과전형에서 자주 나오는 실수"
          tone="warn"
          Icon={ShieldAlert}
          items={[
            "학교 산출 등급을 그대로 쓰는 것 — 대학 환산식으로 다시 계산해야 실제 지원 위치를 알 수 있습니다.",
            "최저를 '되겠지'로 두는 것 — 최저 미충족은 교과전형 불합격 사유 1위입니다.",
            "면접을 배점만 보고 가볍게 여기는 것 — 1단계 동점자가 몰리는 구간에서는 면접이 사실상 결정합니다.",
            "미인정 결석·지각 누적 — 출결을 반영하는 대학이 생기고 있어 뒤늦게 손쓸 수 없습니다.",
            "전형명 변경을 놓치는 것 — 영남대 '의학창의인재'→'창의인재', 동국대(WISE) 교과→'학업성적우수자' 등 명칭이 바뀐 사례가 있습니다.",
          ]}
        />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={Layers} title="다른 전형도 확인하세요" tone="muted">
        <LinkCards
          items={[
            {
              href: "/promo/susi/jonghap",
              icon: FileText,
              title: "학생부종합전형",
              body: "내신이 조금 밀려도 생기부와 면접으로 뒤집는 트랙. 2027 의대 최대 전형입니다.",
            },
            {
              href: "/promo/susi/nonsul",
              icon: Compass,
              title: "논술전형",
              body: "내신 반영이 가장 약한 전형. 대신 논술 실력과 높은 최저가 필요합니다.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "2027학년도 대학입학전형시행계획 및 관련 보도 집계 기준(2026년 9월 정리).",
          "1단계 배수·반영 비율·최저 기준의 개별 사례는 발표 시점 기준이며, 최종 확정치는 각 대학 수시 모집요강을 따릅니다.",
          "환산 등급 계산은 대학별 환산식에 따라 달라집니다. 상담 시 성적표 원본을 기준으로 재계산해 드립니다.",
        ]}
      />

      <FinalCTA
        title="내 내신, 어느 의대에서 몇 등급인가요?"
        body="대학별 환산식으로 다시 계산하면 지원 가능 범위가 달라집니다. 성적표를 기준으로 현실적인 후보군을 함께 잡아 드립니다."
        Icon={BookOpenCheck}
        primaryHref="#contact"
        primaryLabel="교과전형 상담하기"
      />
    </>
  );
}
