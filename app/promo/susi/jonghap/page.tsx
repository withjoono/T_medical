import type { Metadata } from "next";
import {
  FileText,
  Target,
  Layers,
  Compass,
  MessagesSquare,
  Microscope,
  BookOpenCheck,
  ShieldAlert,
  Users,
  MapPin,
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
  title: "의대 학생부종합전형 | T Medi — 생기부·면접·MMI 설계",
  description:
    "2027학년도 의대 학생부종합전형 1,227명(35.0%), 처음으로 최대 전형이 됐습니다. 서류 평가 요소, 세특 설계, MMI·제시문 면접, 학종 수능최저 신설까지 전형 구조를 정리했습니다. tmedi.kr",
};

const EVALUATION = [
  {
    icon: BookOpenCheck,
    title: "학업 역량 — 여전히 1순위",
    body: "학종이라고 내신을 안 보는 것이 아닙니다. 등급 자체보다 과목 선택의 위계(수학·과학 심화 이수)와 성적 추이, 이수 단위를 함께 읽습니다.",
  },
  {
    icon: Microscope,
    title: "탐구의 깊이 — 개수가 아니라 연결",
    body: "주제를 나열한 생기부보다, 한 질문이 학년을 넘어 심화되는 흐름이 강합니다. 생명·화학을 축으로 물리·수학까지 이어지면 설득력이 커집니다.",
  },
  {
    icon: Users,
    title: "의료인 자질 — 태도가 기록에 남는가",
    body: "협업, 책임감, 타인에 대한 태도가 활동 서술 안에서 드러나야 합니다. 봉사 시간의 양보다 역할과 지속성이 읽히는지가 중요합니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접 — 서류를 검증하는 자리",
    body: "제시문 면접은 논리와 윤리 판단을, MMI는 상황 대응과 소통을 봅니다. 서류에 쓰인 내용은 반드시 되물어진다고 전제해야 합니다.",
  },
  {
    icon: Layers,
    title: "1단계 서류 100%",
    body: "대부분 서류만으로 2~5배수를 뽑습니다. 1단계 통과 여부는 생기부 한 권으로 결정되고, 2단계에서 면접이 30~50%까지 반영됩니다.",
  },
  {
    icon: Target,
    title: "수능 최저 — 도입이 늘고 있다",
    body: "성균관대 융합형인재(3개 합 6), 중앙대 성장형인재(3개 합 6) 등 2027학년도에 학종 최저를 새로 둔 사례가 나왔습니다. 한양대는 최저 적용 학종 인원을 확대했습니다.",
  },
];

const SCALE_HEAD = ["구분", "인원", "메모"];
const SCALE_ROWS = [
  ["2027 의대 학종 전체", "1,227명 (35.0%)", "교과·정시를 제치고 처음 최대 전형이 됐습니다."],
  ["일반전형 학종", "628명 (일반전형의 35.7%)", "수도권 학생이 실질적으로 겨루는 규모입니다."],
  ["지역 선발 학종", "599명 (지역 선발의 34.2%)", "지역인재·지역의사 학종을 합한 규모입니다."],
  ["지역의사 학종", "258명 (지역의사 490명 중 52.9%)", "지역의사 선발의 절반 이상이 학종입니다."],
  ["최저 없는 의대 전형", "15개 대학 24개 전형 343명", "서울대 일반, 성균관대·한양대 면접형 등이 포함됩니다."],
];

const RECORD = [
  "생명과학·화학 세특에서 교과서 밖 질문을 던지고, 자료로 검증한 흔적이 남아야 합니다.",
  "학년이 올라갈수록 같은 관심사가 깊어지는 구조 — 1학년의 호기심이 3학년의 심화 탐구로 이어지는 서사.",
  "의학 소재를 쓰되 결론을 '의사가 되고 싶다'로 닫지 않기 — 과정의 사고가 보여야 합니다.",
  "선택과목이 곧 메시지 — 미적분·기하, 화학Ⅱ·생명과학Ⅱ 이수 여부는 학업 의지의 신호로 읽힙니다.",
  "협업 기록: 조별 활동에서 맡은 역할과 갈등 조정 경험이 구체적으로 서술돼야 합니다.",
  "면접에서 되물었을 때 3분간 설명할 수 없는 활동은 생기부에 남아 있어도 위험합니다.",
];

const INTERVIEW = [
  {
    title: "서류 기반 확인 면접",
    body: "생기부에 적힌 탐구·활동을 되묻습니다. 무엇을 왜 했고 어디서 막혔는지를 본인 언어로 설명할 수 있어야 합니다.",
  },
  {
    title: "제시문 면접",
    body: "짧은 지문을 읽고 논리적 해석과 판단을 요구합니다. 의료 윤리·사회 이슈 소재가 잦고, 준비실 시간이 별도로 주어집니다.",
  },
  {
    title: "MMI (다중미니면접)",
    body: "여러 개의 방을 이동하며 상황 대응, 윤리 판단, 소통 능력을 각각 평가합니다. 정답보다 판단의 근거와 태도를 봅니다.",
  },
  {
    title: "인·적성 면접",
    body: "의료인으로서의 가치관과 대인 태도를 확인합니다. 압박 질문에도 일관된 기준을 유지하는지가 관건입니다.",
  },
];

const PLAN = [
  {
    title: "3~4월 · 생기부 진단",
    body: "1~2학년 기록을 평가 요소별로 분해해 강점과 공백을 확인합니다. 3학년 1학기에 채울 수 있는 것과 없는 것을 구분합니다.",
  },
  {
    title: "4~7월 · 3학년 1학기 세특 설계",
    body: "학종에서 실질적으로 손댈 수 있는 마지막 구간입니다. 기존 흐름을 잇는 심화 주제를 과목별로 배치합니다.",
  },
  {
    title: "6~8월 · 최저 적용 여부로 후보군 분리",
    body: "최저가 있는 학종과 없는 학종은 경쟁 구도가 다릅니다. 모평 성적에 맞춰 두 그룹의 비중을 정합니다.",
  },
  {
    title: "9월 · 원서와 동시에 면접 준비 시작",
    body: "1단계 발표를 기다리며 시작하면 늦습니다. 서류 기반 예상 질문과 MMI 유형 훈련을 병행합니다.",
  },
  {
    title: "10~12월 · 면접 실전 · 최저 마무리",
    body: "수능 전후로 면접 일정이 나뉩니다. 최저가 걸린 대학은 수능을 우선에 두고 면접 준비를 분산합니다.",
  },
];

export default function JonghapPage() {
  return (
    <>
      <PromoHero
        badge="수시 · 학생부종합전형"
        title="2027 의대 최대 전형,"
        highlight="학생부종합"
        body="1,227명. 교과와 정시를 넘어 가장 많이 뽑는 전형이 됐습니다. 평가하는 것은 활동의 개수가 아니라, 한 학생이 3년간 무엇을 궁금해했는가입니다."
        primaryHref="#contact"
        primaryLabel="학종 상담하기"
        secondaryHref="/promo/interview"
        secondaryLabel="면접·MMI 수업 보기"
        Icon={FileText}
        stats={[
          { icon: Microscope, label: "생기부 정성 평가" },
          { icon: MessagesSquare, label: "MMI·제시문 면접" },
          { icon: Target, label: "최저 도입 확대" },
        ]}
      />


      <PromoSection
        eyebrow="EVALUATION"
        EyebrowIcon={FileText}
        title="입학사정관이 실제로 보는 것"
        subtitle="학종은 '좋은 활동'을 모으는 게임이 아니라, 기록이 한 사람으로 읽히는지의 문제입니다."
      >
        <FeatureGrid items={EVALUATION} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="SCALE"
        EyebrowIcon={MapPin}
        title="어디에 얼마나 있는가"
        subtitle="같은 학종이라도 일반·지역인재·지역의사로 갈리면 경쟁 구도가 완전히 달라집니다."
        tone="muted"
      >
        <CompareTable
          head={SCALE_HEAD}
          rows={SCALE_ROWS}
          caption="2027학년도 전형계획 집계 기준 전국 의대 합계입니다."
        />
      </PromoSection>

      <PromoSection
        eyebrow="RECORD"
        EyebrowIcon={Microscope}
        title="합격하는 생기부의 공통점"
        subtitle="화려한 소재보다, 질문이 깊어지는 궤적이 강합니다."
      >
        <CheckList items={RECORD} />
      </PromoSection>

      <PromoSection
        eyebrow="INTERVIEW"
        EyebrowIcon={MessagesSquare}
        title="면접 유형 네 가지"
        subtitle="대학마다 조합이 다릅니다. 유형을 먼저 확정하고 준비 방식을 나눠야 합니다."
        tone="muted"
      >
        <StepList steps={INTERVIEW} />
      </PromoSection>

      <PromoSection
        eyebrow="PLAN"
        EyebrowIcon={Compass}
        title="고3 학종 일정"
        subtitle="학종에서 실제로 손댈 수 있는 구간은 생각보다 짧습니다."
      >
        <StepList steps={PLAN} />
      </PromoSection>

      <PromoSection eyebrow="CAUTION" EyebrowIcon={ShieldAlert} title="놓치기 쉬운 지점" tone="muted">
        <NoteBox
          title="학종에서 자주 나오는 오해"
          tone="warn"
          Icon={ShieldAlert}
          items={[
            "'학종은 내신이 약해도 된다' — 의대 학종의 합격선은 여전히 최상위권입니다. 내신은 문턱이고, 생기부는 그 위의 변별입니다.",
            "'최저가 없으니 수능은 안 봐도 된다' — 최저 없는 전형일수록 서류·면접 경쟁이 극단적으로 치열합니다. 정시 대비를 함께 두는 편이 안전합니다.",
            "'활동은 많을수록 좋다' — 연결되지 않는 활동은 면접에서 오히려 약점이 됩니다.",
            "'3학년 기록은 늦었다' — 3학년 1학기 세특은 마지막이자 가장 강한 신호가 될 수 있습니다.",
            "2027학년도에는 학종에 수능 최저를 새로 도입한 대학이 있어, 작년 기준으로 판단하면 어긋납니다.",
          ]}
        />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={Layers} title="이어서 보기">
        <LinkCards
          items={[
            {
              href: "/promo/tamgu",
              icon: Microscope,
              title: "탐구보고서",
              body: "세특의 중심이 되는 탐구 주제 선정과 보고서 작성 과정을 다룹니다.",
            },
            {
              href: "/promo/interview",
              icon: MessagesSquare,
              title: "면접 수업",
              body: "MMI·인적성·제시문 면접을 유형별로 훈련합니다.",
            },
            {
              href: "/promo/susi/gyogwa",
              icon: BookOpenCheck,
              title: "학생부교과전형",
              body: "환산 등급과 수능 최저로 승부하는 정량 트랙.",
            },
          ]}
          columns={3}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "2027학년도 대학입학전형시행계획 및 관련 보도 집계 기준(2026년 9월 정리).",
          "대학별 최저 신설·확대 사례는 발표 시점 기준이며, 확정 내용은 각 대학 수시 모집요강을 따릅니다.",
          "면접 유형·반영 비율은 대학마다 다릅니다. 지원 대학이 정해지면 유형별로 나눠 준비해야 합니다.",
        ]}
      />

      <FinalCTA
        title="내 생기부는 지금 어떤 이야기를 하고 있나요?"
        body="평가 요소별로 분해해 보면 강점과 공백이 분명해집니다. 3학년 1학기에 무엇을 채울지 함께 설계합니다."
        Icon={FileText}
        primaryHref="#contact"
        primaryLabel="학종 상담하기"
      />
    </>
  );
}
