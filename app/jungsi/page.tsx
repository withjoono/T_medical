import type { Metadata } from "next";
import {
  Target,
  Layers,
  Compass,
  Calculator,
  FlaskConical,
  CalendarClock,
  ShieldAlert,
  BarChart3,
  MapPin,
  Users,
  FileText,
  PenLine,
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
  alternates: { canonical: "/jungsi" },
  title: "의대 정시 전략 | T Medi — 2027 수능 반영·군별 3장 조합",
  description:
    "2027학년도 의대 정시 983명(28.0%) 분석. '수능 100%'가 깨진 정시 변화, 영역별 반영 비율과 탐구 가산점, 가·나·다군 3장 조합, 지역인재 정시까지 정리했습니다. tmedi.kr",
};

const CHANGE = [
  {
    icon: FileText,
    title: "'수능 100%' 시대가 끝나간다",
    body: "연세대는 수능 90~95%에 학생부 5~10%를 더하고, 한양대는 수능 90% + 학생부 종합평가 10%를 반영합니다. 정시에서도 학교 기록이 점수가 되는 구조가 생겼습니다.",
  },
  {
    icon: ShieldAlert,
    title: "출결·비교과도 들어온다",
    body: "중앙대는 정시에서 출결 등 비교과를 반영합니다. 미인정 결석이 정시 점수에서 감점으로 작동할 수 있다는 뜻입니다.",
  },
  {
    icon: Calculator,
    title: "영역별 반영 비율이 곧 유불리",
    body: "같은 표준점수 총합이라도 수학 비중이 높은 대학과 탐구 비중이 높은 대학에서 환산 결과가 갈립니다. 내 성적 구조에 맞는 대학을 찾는 게 핵심입니다.",
  },
  {
    icon: FlaskConical,
    title: "탐구 처리 방식이 변수",
    body: "과탐 가산점 유무, 사탐 응시 인정 여부, 2과목 평균 vs 상위 1과목, 변환표준점수 적용 방식이 대학마다 다릅니다.",
  },
  {
    icon: MapPin,
    title: "정시에도 지역 몫이 있다",
    body: "지역 선발 인원 중 정시가 258명(14.7%)이고, 지역의사 선발 490명 중에서도 30명(6.1%)이 정시로 배정됩니다.",
  },
  {
    icon: Users,
    title: "면접을 보는 정시도 있다",
    body: "일부 의대는 정시에서도 인·적성 면접이나 MMI를 실시합니다. 대체로 결격 판단 성격이지만, 준비 없이 가면 위험합니다.",
  },
];

const RATIO_HEAD = ["확인 항목", "왜 중요한가", "점검 방법"];
const RATIO_ROWS = [
  [
    "영역별 반영 비율",
    "수학·탐구 비중이 높은 대학이 많아, 강점 과목에 따라 유리한 대학이 달라집니다.",
    "지원 후보 대학 환산식에 내 표준점수를 직접 대입해 비교합니다.",
  ],
  [
    "점수 척도",
    "표준점수·백분위·변환표준점수 중 무엇을 쓰는지에 따라 탐구의 실질 영향력이 달라집니다.",
    "탐구를 변환표준점수로 쓰는 대학은 과목 간 유불리가 줄어듭니다.",
  ],
  [
    "탐구 과목 조건",
    "과탐 가산·사탐 인정 여부가 응시 전략 자체를 바꿉니다.",
    "가산점 비율과 적용 시점(환산 전·후)까지 확인해야 합니다.",
  ],
  [
    "영어 반영 방식",
    "등급별 감점 폭이 대학마다 크게 다릅니다. 1등급과 2등급 차가 0.5점인 곳과 5점인 곳이 있습니다.",
    "영어 2등급이라면 감점이 작은 대학을 우선 후보로 둡니다.",
  ],
  [
    "학생부·비교과 반영",
    "2027학년도부터 수능 외 요소를 반영하는 대학이 생겼습니다.",
    "반영 비율과 산출 방식(정량 vs 종합평가)을 구분해 확인합니다.",
  ],
];

const COMBO = [
  "가·나·다군 각 1장씩, 총 3장. 의대 대부분이 가군·나군에 몰려 있어 다군은 선택지가 좁습니다.",
  "상향 1 · 적정 1 · 안정 1이 기본이지만, 재수 여부와 수시 합격 카드 유무에 따라 무게중심이 달라집니다.",
  "수시에 합격하면 정시 지원 자체가 불가합니다 — 수시 6장을 쓸 때 정시 목표선을 함께 정해야 합니다.",
  "군별로 같은 대학이라도 모집단위·인원이 다르므로 군 배치를 먼저 확정하고 대학을 채웁니다.",
  "지역인재·지역의사 자격이 있다면 정시에서도 별도 트랙으로 계산해 경쟁 모수를 줄일 수 있습니다.",
  "추가 합격(충원) 흐름은 군과 대학에 따라 크게 다릅니다. 전년도 충원율을 함께 봐야 실제 합격선이 보입니다.",
];

const TIMELINE = [
  {
    title: "9월 · 수시 원서와 함께 정시 목표선 확정",
    body: "수시 합격은 정시 포기와 같습니다. 9월 모평 성적으로 정시 기대선을 먼저 계산한 뒤 수시 상향 폭을 정합니다.",
  },
  {
    title: "10~11월 · 반영 비율 기준 후보군 압축",
    body: "내 성적 구조(수학 강세/탐구 강세/영어 약세)에 맞는 환산식을 가진 대학을 미리 추려 둡니다.",
  },
  {
    title: "11월 · 수능 직후 가채점 배치",
    body: "가채점 기준으로 군별 시나리오를 세 가지 정도 준비합니다. 이때 면접 실시 대학 여부도 함께 확인합니다.",
  },
  {
    title: "12월 · 성적표 기준 최종 환산",
    body: "실제 표준점수·백분위가 나오면 후보 대학 환산 점수를 다시 계산합니다. 가채점과 순위가 뒤집히는 일이 흔합니다.",
  },
  {
    title: "12월 말~1월 · 원서 접수와 충원 대기",
    body: "경쟁률 마감 흐름과 전년도 충원율을 함께 보고 최종 결정합니다. 추가 합격 기간의 연락 대응도 준비해 둡니다.",
  },
];

export default function JungsiPage() {
  return (
    <>
      <PromoHero
        badge="정시 · 2027학년도"
        title="정시는 이제"
        highlight="수능 100%가 아닙니다"
        body="983명, 전체의 28%. 그 안에서도 학생부와 출결을 반영하는 대학이 생겼고, 영역별 반영 비율에 따라 같은 점수가 다른 결과를 만듭니다."
        primaryHref="#contact"
        primaryLabel="정시 전략 상담하기"
        secondaryHref="/susi"
        secondaryLabel="수시 전형 보기"
        Icon={Target}
        stats={[
          { icon: Calculator, label: "영역별 반영비율" },
          { icon: FlaskConical, label: "탐구 가산·변환점수" },
          { icon: BarChart3, label: "군별 3장 조합" },
        ]}
      />


      <PromoSection
        eyebrow="CHANGES"
        EyebrowIcon={CalendarClock}
        title="2027 정시에서 달라진 것"
        subtitle="작년 기준으로 판단하면 어긋나는 지점들이 생겼습니다."
      >
        <FeatureGrid items={CHANGE} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="REFLECT"
        EyebrowIcon={Calculator}
        title="반영 구조 다섯 가지를 확인하세요"
        subtitle="정시는 '점수가 몇 점인가'보다 '이 대학 환산식에서 몇 점인가'의 게임입니다."
        tone="muted"
      >
        <CompareTable
          head={RATIO_HEAD}
          rows={RATIO_ROWS}
          caption="반영 비율·가산점·척도는 대학마다 다르며 해마다 바뀝니다. 지원 대학 정시 모집요강 기준으로 계산하세요."
        />
      </PromoSection>

      <PromoSection
        eyebrow="COMBO"
        EyebrowIcon={BarChart3}
        title="가·나·다군 3장 설계"
        subtitle="정시는 세 장뿐입니다. 군 배치가 곧 전략입니다."
      >
        <CheckList items={COMBO} />
      </PromoSection>

      <PromoSection
        eyebrow="TIMELINE"
        EyebrowIcon={Compass}
        title="9월부터 1월까지"
        subtitle="정시는 수능 이후에 시작되는 게 아니라, 수시 원서를 쓰는 순간부터 시작됩니다."
        tone="muted"
      >
        <StepList steps={TIMELINE} />
      </PromoSection>

      <PromoSection eyebrow="CAUTION" EyebrowIcon={ShieldAlert} title="정시에서 놓치기 쉬운 것">
        <NoteBox
          title="지원 전 반드시 확인"
          tone="warn"
          Icon={ShieldAlert}
          items={[
            "수시 합격 = 정시 지원 불가. 수시 상향 카드를 쓸 때 정시 기대선을 먼저 계산해야 합니다.",
            "'백분위 총합'으로 판단하는 것 — 대학 환산식으로 계산하면 순위가 바뀝니다.",
            "탐구 두 과목의 조합 — 표준점수 편차가 큰 해에는 과목 선택만으로 몇 점씩 손해가 납니다.",
            "정시 면접 실시 여부 — 준비 없이 가면 결격 판정 위험이 있습니다.",
            "지역의사 정시는 10년 의무복무가 조건입니다. 점수만 보고 지원할 사안이 아닙니다.",
            "충원율을 무시한 안정 지원 — 전년도 추가합격 흐름까지 봐야 실제 합격선이 보입니다.",
          ]}
        />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={Layers} title="함께 보기" tone="muted">
        <LinkCards
          items={[
            {
              href: "/susi",
              icon: Layers,
              title: "고3 수시 총정리",
              body: "교과·종합·논술 세 전형의 구조와 지역 선발을 한눈에.",
            },
            {
              href: "/susi/nonsul",
              icon: PenLine,
              title: "논술전형",
              body: "정시형 학생이 수시에서 함께 쥘 수 있는 상향 카드.",
            },
            {
              href: "/overseas",
              icon: Target,
              title: "해외 의대 · 경유 루트",
              body: "국내 정시로 어렵다면, 밖에서 들어오는 경로도 함께 검토합니다.",
            },
          ]}
          columns={3}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "2027학년도 대학입학전형시행계획 및 관련 보도 집계 기준(2026년 9월 정리).",
          "정시 반영 비율·탐구 가산·면접 실시 여부는 각 대학 정시 모집요강이 최종 기준입니다.",
          "지역의사 선발전형은 면허 취득 후 10년 의무복무가 조건이며, 미이행 시 지원금 반환 절차가 따릅니다.",
        ]}
      />

      <FinalCTA
        title="같은 점수로 갈 수 있는 의대는 대학마다 다릅니다"
        body="영역별 반영 비율에 내 성적을 대입해 보면 후보군이 확 달라집니다. 군별 3장 조합까지 함께 설계해 드립니다."
        Icon={Target}
        primaryHref="#contact"
        primaryLabel="정시 전략 상담하기"
      />
    </>
  );
}
