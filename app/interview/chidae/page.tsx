import type { Metadata } from "next";
import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  MonitorPlay,
  Scale,
  ScrollText,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import {
  CompareTable,
  FeatureGrid,
  FinalCTA,
  LinkCards,
  NoteBox,
  PromoHero,
  PromoSection,
  SourceNote,
} from "../../_site/components";
import { FactList } from "../../univ/_univ";
import { ClassCtaBand } from "../_interview";
import { ChidaeUnivCards } from "./_chidae";
import {
  CHIDAE_NO_INTERVIEW,
  CHIDAE_TOTALS,
  CHIDAE_UNIVS,
  CHIDAE_WITH_INTERVIEW,
  chidaeEarliest,
} from "@/lib/chidae-interview";
import { SESSION_HOURS_LABEL } from "@/lib/interview-types";
import { formatKo } from "@/lib/mmi-schedule";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/interview/chidae" },
  title: "치대 면접 대비 | T Medi — 치의예과 면접 실시 대학·전형·일정",
  description:
    "2027학년도 치의예과 면접을 실시하는 대학과 전형, 면접 방식과 면접일을 요강 기준으로 정리했습니다. 연세대 제시문 면접, 경북대 면접 60% 과락 규정, 강원대 인성40·적성60 배점까지. 1:1 줌 면접 수업 안내. tmedi.kr",
};

/** 치대 면접에서만 나오는 공통 사실. 의예과 데이터로 유추하지 않는다. */
const COMMON = [
  {
    icon: Scale,
    title: "면접 반영이 20~40% 로 갈립니다",
    body:
      "연세대와 강원대는 2단계 면접이 40%, 경북대·경희대·단국대·원광대·조선대는 30%, 부산대와 전북대는 20% 입니다. 같은 치대라도 뒤집을 수 있는 폭이 두 배 차이납니다. 지원 조합을 짤 때 여기부터 봐야 합니다.",
  },
  {
    icon: TriangleAlert,
    title: "경북대에는 과락 규정이 있습니다",
    body:
      "면접 점수가 배점의 60% 미만이면 총점과 관계없이 불합격입니다. 고득점을 노리기 전에 침묵·동문서답·태도 문제를 먼저 제거해야 하는 대학입니다.",
  },
  {
    icon: ScrollText,
    title: "제시문 면접은 연세대 하나뿐입니다",
    body:
      "나머지 대학은 전부 생활기록부를 놓고 묻는 서류 기반 면접입니다. 연세대만 현장 녹화 방식으로 제시문을 읽고 논리적 사고력과 의사소통능력을 평가합니다. 준비물이 통째로 다릅니다.",
  },
  {
    icon: CalendarDays,
    title: "면접일이 11월 하순에서 12월 초에 몰립니다",
    body:
      "11월 21일(경북대) · 22일(연세대) · 26일(전북대) · 27일(강원대) · 28일(단국대), 그리고 12월 2일(원광대) · 5일(부산대·경희대). 복수 지원 시 같은 날이 겹치는지 먼저 확인해야 합니다.",
  },
  {
    icon: Brain,
    title: "같은 대학이라도 의예과와 다릅니다",
    body:
      "부산대는 의예과에만 잠재역량 공통문제가 붙고 치의예과는 탐구역량·사회역량 두 축입니다. 의대 면접 자료를 그대로 가져다 쓰면 없는 것을 준비하게 됩니다.",
  },
  {
    icon: ClipboardCheck,
    title: "면접이 없는 전형이 더 많습니다",
    body:
      "교과 계열 전형은 대부분 면접을 보지 않습니다. 같은 대학 안에서 면접형과 교과형이 갈리므로(단국대·조선대) 지원 전형을 먼저 확정하지 않으면 준비가 헛돕니다.",
  },
];

const DRILLS = [
  {
    icon: Stethoscope,
    title: "지원동기를 치의학으로 좁히기",
    body:
      "의대 지원자와 같은 답을 하면 '왜 치대인가' 에서 막힙니다. 손으로 하는 술기, 한 환자를 길게 보는 진료 구조, 심미와 기능이 함께 걸리는 판단 — 치의학에만 있는 것으로 이유를 좁혀야 합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "생기부를 내가 먼저 소진시키기",
    body:
      "연세대를 제외하면 질문의 출처는 전부 학교생활기록부입니다. 3년치 기재를 문장 단위로 끊어 '왜 했는지 / 무엇을 배웠는지 / 그래서 무엇이 바뀌었는지' 를 붙여 두면 실제 질문의 대부분을 미리 덮습니다.",
  },
  {
    icon: Scale,
    title: "대학별 평가 축에 맞춰 앞세우기",
    body:
      "강원대는 인성 40 · 적성 60, 경희대는 인성 50 · 전공적합성 50, 부산대는 탐구역량 · 사회역량, 경북대는 학업 · 진로 · 공동체입니다. 같은 생기부라도 무엇을 먼저 꺼낼지가 달라집니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접위원이 여럿일 때의 답변 설계",
    body:
      "원광대와 전북대는 3인, 부산대는 다수 평가자가 함께 봅니다. 한 사람을 설득하는 화법이 아니라, 세 관점 어디서 들어도 같은 결론에 닿는 구조가 필요합니다.",
  },
  {
    icon: ScrollText,
    title: "연세대 지원자는 제시문 루틴을 따로",
    body:
      "쟁점 한 문장 → 대립하는 두 입장 → 내 선택과 근거 둘 → 예상 반박 하나. 답변 문장을 통째로 만들지 않고 이 뼈대만 세우는 훈련입니다. 현장 녹화라 카메라 앞 습관도 함께 잡습니다.",
  },
  {
    icon: CalendarDays,
    title: "발표에서 면접까지를 역산",
    body:
      "원광대 지역인재는 1단계 발표 다음 날이 면접이고, 전북대는 6일, 단국대는 8일입니다. 이 구간에 처음 시작하면 유형을 익히다 끝납니다. 발표 전에 기본기를 만들어 두어야 합니다.",
  },
];

const PITFALLS = [
  "의대 면접 준비 자료를 그대로 쓰는 것 — 평가영역과 배점이 다른 대학이 많습니다",
  "'왜 의대가 아니라 치대인가' 에 답을 준비하지 않는 것 — 거의 모든 대학에서 나옵니다",
  "면접 반영비율을 확인하지 않는 것 — 20% 인 대학과 40% 인 대학의 준비량은 같을 수 없습니다",
  "같은 대학의 면접형·교과형을 혼동하는 것 — 단국대·조선대는 전형에 따라 면접 유무가 갈립니다",
  "복수 지원 대학의 면접일이 겹치는지 확인하지 않는 것 — 12월 5일에 부산대와 경희대가 함께 있습니다",
];

export default function ChidaePage() {
  const rows = CHIDAE_WITH_INTERVIEW.map((u) => {
    const d = chidaeEarliest(u);
    return [
      u.short,
      u.zone,
      u.styleLabel,
      `${u.tracks.filter((t) => t.interview).length}개 전형`,
      d ? formatKo(d) : "미공지",
    ];
  });

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "면접 수업", path: "/interview" },
            { name: "치대 면접", path: "/interview/chidae" },
          ]),
          article({
            path: "/interview/chidae",
            headline: metadata.title as string,
            description: metadata.description as string,
          }),
        ]}
      />

      <PromoHero
        badge="계열별 면접 · 치의예과"
        title="치대 면접은"
        highlight="의대 면접과 다른 시험입니다"
        body="같은 대학이라도 치의예과는 평가영역과 배점이 따로 정해져 있습니다. 2027학년도 수시에서 치의예과 면접을 실시하는 대학과 전형, 요강에 적힌 면접 방식과 면접일을 그대로 정리했습니다."
        primaryHref="#contact"
        primaryLabel="치대 면접 수업 문의"
        secondaryHref="#univ"
        secondaryLabel="대학별로 보기"
        Icon={Stethoscope}
        stats={[
          { icon: GraduationCap, label: `면접 실시 ${CHIDAE_TOTALS.withInterview}개 치대` },
          { icon: ClipboardCheck, label: `면접 전형 ${CHIDAE_TOTALS.interviewTracks}개` },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      <PromoSection
        eyebrow="AT A GLANCE"
        EyebrowIcon={Scale}
        title="치의예과 면접 한눈에"
        subtitle="각 대학 2027학년도 수시 모집요강에서 확인된 내용만 정리했습니다."
      >
        <CompareTable
          head={["대학", "권역", "요강에 적힌 면접 방식", "면접 전형", "가장 이른 면접일"]}
          rows={rows}
          caption={`면접을 실시하지 않는 대학: ${CHIDAE_NO_INTERVIEW.map((u) => u.short).join(" · ")}`}
        />
      </PromoSection>

      <PromoSection
        eyebrow="COMMON"
        EyebrowIcon={ClipboardCheck}
        title="치대 면접에서 먼저 확인할 것"
        subtitle="의대 면접과 겹치지 않는 부분만 골랐습니다."
        tone="muted"
      >
        <FeatureGrid items={COMMON} columns={3} />
      </PromoSection>

      <div id="univ" className="scroll-mt-24" />
      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={GraduationCap}
        title="대학별 면접 방식과 일정"
        subtitle="요강에서 확인된 문장만 옮겼습니다. 전형별 반영비율과 면접일이 함께 있습니다."
      >
        <ChidaeUnivCards univs={CHIDAE_UNIVS} />
      </PromoSection>

      <PromoSection
        eyebrow="PREPARATION"
        EyebrowIcon={Brain}
        title="무엇을 훈련해야 하나"
        subtitle="치대 면접에서만 점수가 되는 것들입니다."
        tone="muted"
      >
        <FeatureGrid items={DRILLS} columns={2} />
      </PromoSection>

      <PromoSection
        eyebrow="PITFALLS"
        EyebrowIcon={TriangleAlert}
        title="이 계열에서 자주 깎이는 것"
      >
        <NoteBox
          title="치대 면접에서 흔한 실수"
          items={PITFALLS}
          tone="warn"
          Icon={TriangleAlert}
        />
      </PromoSection>

      <ClassCtaBand typeName="치대 면접" />

      <PromoSection eyebrow="MORE" EyebrowIcon={MessagesSquare} title="함께 보기" tone="muted">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/interview",
              icon: MessagesSquare,
              title: "의대 면접 — 유형별 대비",
              body: "MMI · 인·적성 · 제시문 세 유형과 실시 대학. 치대 면접도 같은 틀로 준비합니다.",
            },
            {
              href: "/ipkyul/chiuiye",
              icon: GraduationCap,
              title: "치의예과 입시결과",
              body: "대학·전형별 모집인원과 공시된 입결을 한 페이지에.",
            },
            {
              href: "/susi",
              icon: ClipboardCheck,
              title: "수시 전형 총정리",
              body: "교과·종합·논술 전형별 구조. 면접이 어느 전형에서 반영되는지부터.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "면접 방식·반영비율·일정은 각 대학 2027학년도 수시 모집요강에서 정리했습니다(2026년 9월 확인). 대학 사정으로 변경될 수 있으므로 최종 확인은 해당 입학처 공지를 따르십시오.",
          "요강에 적힌 문장만 옮겼습니다. 같은 대학의 의예과 자료로 치의예과를 추정하지 않았습니다.",
          "조선대는 요강에 면접일이 기재돼 있지 않아 비워 두었습니다. 1단계 합격자 발표 공지에서 확인하세요.",
          "서울대는 이번 요강 추출본에 치의학 모집단위가 잡히지 않아 목록에서 제외했습니다. 학부 모집 여부는 입학처에서 확인해 주세요.",
          "전남대는 치의학전문대학원 수시 모집이 교과 1명이며 면접을 실시하지 않습니다.",
        ]}
      />

      <FinalCTA
        title="치대 면접도 대학마다 다른 시험입니다"
        body={`지원 대학의 평가영역과 반영비율에 맞춰 과제와 모의면접을 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={Stethoscope}
        primaryHref="#contact"
        primaryLabel="치대 면접 수업 문의하기"
      />
    </>
  );
}
