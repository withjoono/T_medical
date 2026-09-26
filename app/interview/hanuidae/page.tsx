import type { Metadata } from "next";
import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Leaf,
  MessagesSquare,
  MonitorPlay,
  Scale,
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
import { ClassCtaBand } from "../_interview";
import { FieldUnivCards } from "../_field";
import {
  beforeSuneung,
  HANUIDAE_NO_INTERVIEW,
  HANUIDAE_TOTALS,
  HANUIDAE_UNIVS,
  HANUIDAE_UNVERIFIED,
  HANUIDAE_WITH_INTERVIEW,
  hanuidaeEarliest,
} from "@/lib/hanuidae-interview";
import { SESSION_HOURS_LABEL } from "@/lib/interview-types";
import { formatKo } from "@/lib/mmi-schedule";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/interview/hanuidae" },
  title: "한의대 면접 대비 | T Medi — 한의예과 면접 실시 대학·전형·일정",
  description:
    "한의대 면접은 수능 전에 끝나는 대학이 있습니다. 2027학년도 한의예과 면접 실시 대학과 전형, 면접 방식과 면접일을 요강 기준으로 정리했습니다. 동의대 면접 70%, 세명대 전공적성 230점, 대전대 10월 17일까지. 1:1 줌 면접 수업 안내. tmedi.kr",
};

const COMMON = [
  {
    icon: CalendarDays,
    title: "수능 전에 끝나는 면접이 셋입니다",
    body:
      "대전대 10월 17일, 세명대 10월 24일, 우석대 10월 30일. 2027 수능(11월 19일)보다 앞섭니다. 수능 공부가 한창인 시기에 면접을 치러야 하므로, 9월에 시간 배분을 정해 두지 않으면 둘 다 흔들립니다.",
  },
  {
    icon: Scale,
    title: "면접 반영이 30~70% 로 벌어집니다",
    body:
      "동의대는 2단계 면접 70%, 세명대는 47%, 대전대는 40.5%, 경희대·우석대·원광대는 30% 입니다. 의대나 치대보다 편차가 훨씬 큽니다. 지원 조합을 짤 때 여기부터 봐야 합니다.",
  },
  {
    icon: TriangleAlert,
    title: "수능 최저가 없는 면접 전형이 있습니다",
    body:
      "동의대 학교생활우수자(면접)전형과 세명대 면접우수자전형은 수능 최저학력기준이 없습니다. 최저 탈락으로 경쟁률이 내려가길 기대할 수 없다는 뜻이고, 면접 결과가 그대로 결과가 됩니다.",
  },
  {
    icon: Brain,
    title: "문항을 미리 볼 수 없는 대학이 있습니다",
    body:
      "대전대는 기본소양문항을 면접 15분 전 준비실에서 공개하고, 우석대는 준비실에서 문항 1개를 고른 뒤 5분간 답변을 준비합니다. 외운 답이 아니라 짧은 시간에 뼈대를 세우는 능력이 그대로 점수입니다.",
  },
  {
    icon: Leaf,
    title: "인문 계열로도 뽑습니다",
    body:
      "경희대·원광대·대구한의대는 한의예과를 인문과 자연으로 나눠 뽑습니다. 인문 지원자는 과학 배경이 약한 상태로 한의학 지원동기를 설명해야 하므로, 그 간극을 메우는 서사를 따로 준비해야 합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "면접이 아예 없는 대학이 더 많습니다",
    body:
      "대구한의대·상지대·가천대·부산대·동신대는 한의예과 면접을 실시하지 않습니다. 상지대는 요강에 '학생부종합도 면접 미시행' 이라고 못박았습니다. 지원 대학을 정하면 준비 범위가 절반으로 줄어듭니다.",
  },
];

const DRILLS = [
  {
    icon: Leaf,
    title: "지원동기를 한의학으로 좁히기",
    body:
      "의대 지원자와 같은 답을 하면 '왜 한의학인가' 에서 막힙니다. 몸 전체를 하나로 보는 진단 관점, 환자를 길게 따라가는 진료 구조, 현대의학과의 접점 — 한의학에만 있는 것으로 이유를 좁혀야 합니다.",
  },
  {
    icon: Scale,
    title: "대학별 배점 축에 맞춰 앞세우기",
    body:
      "동의대는 학업역량 180 · 전공적합성 120, 세명대는 인성 120 · 지원동기 120 · 전공적성 230 입니다. 같은 생기부라도 어느 축을 먼저 꺼낼지가 달라집니다. 전공적성이 가장 큰 세명대에는 한의학을 알아본 과정을 앞에 놓습니다.",
  },
  {
    icon: Brain,
    title: "짧은 준비 시간에 뼈대 세우기",
    body:
      "대전대 15분, 우석대 5분. 답변 문장을 만들려 들면 시간이 끝납니다. 쟁점 한 문장 → 두 입장 → 내 선택과 근거 둘 → 예상 반박 하나만 고정하는 연습을 타이머를 걸고 반복합니다.",
  },
  {
    icon: MessagesSquare,
    title: "다대다·다인 면접 대응",
    body:
      "세명대는 다대다, 원광대는 3인 1조, 동의대는 입학사정관 2인입니다. 다대다는 다른 지원자가 말하는 동안의 태도까지 보이고, 앞사람 답변에 끌려가지 않는 훈련이 따로 필요합니다.",
  },
  {
    icon: CalendarDays,
    title: "수능과 면접의 시간 배분",
    body:
      "10월 면접 대학에 지원한다면 수능 공부를 멈추지 않으면서 면접을 준비해야 합니다. 면접 준비를 하루 단위로 쪼개 붙이고, 1단계 발표 이후 5~7일만 집중 구간으로 잡는 편이 현실적입니다.",
  },
  {
    icon: ClipboardCheck,
    title: "생기부를 내가 먼저 소진시키기",
    body:
      "대전대·우석대를 제외하면 질문의 출처는 생활기록부입니다. 3년치 기재에 '왜 했는지 / 무엇을 배웠는지 / 그래서 무엇이 바뀌었는지' 를 붙여 두면 실제 질문의 대부분을 미리 덮습니다.",
  },
];

const PITFALLS = [
  "면접일이 수능 전이라는 것을 뒤늦게 아는 것 — 대전대·세명대·우석대는 10월에 끝납니다",
  "'왜 의대가 아니라 한의대인가' 에 답을 준비하지 않는 것 — 거의 모든 대학에서 나옵니다",
  "면접 반영비율을 확인하지 않는 것 — 30% 인 대학과 70% 인 대학의 준비량은 같을 수 없습니다",
  "수능 최저가 없는 전형에서 최저 탈락을 기대하는 것 — 동의대·세명대 면접 전형에는 최저가 없습니다",
  "인문 계열로 지원하면서 자연 계열 지원동기를 그대로 쓰는 것",
];

export default function HanuidaePage() {
  const rows = HANUIDAE_WITH_INTERVIEW.map((u) => {
    const d = hanuidaeEarliest(u);
    return [
      u.short,
      u.zone,
      u.styleLabel,
      `${u.tracks.filter((t) => t.interview).length}개 전형`,
      d ? formatKo(d) : "미공지",
    ];
  });
  const early = beforeSuneung();

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "면접 수업", path: "/interview" },
            { name: "한의대 면접", path: "/interview/hanuidae" },
          ]),
          article({
            path: "/interview/hanuidae",
            headline: metadata.title as string,
            description: metadata.description as string,
          }),
        ]}
      />

      <PromoHero
        badge="계열별 면접 · 한의예과"
        title="한의대 면접은"
        highlight="수능보다 먼저 옵니다"
        body="대전대 10월 17일, 세명대 10월 24일, 우석대 10월 30일. 수능(11월 19일)보다 앞서 끝나는 면접이 셋입니다. 2027학년도 한의예과 면접을 실시하는 대학과 전형, 요강에 적힌 방식과 일정을 그대로 정리했습니다."
        primaryHref="#contact"
        primaryLabel="한의대 면접 수업 문의"
        secondaryHref="#univ"
        secondaryLabel="대학별로 보기"
        Icon={Leaf}
        stats={[
          { icon: GraduationCap, label: `면접 실시 ${HANUIDAE_TOTALS.withInterview}개 한의대` },
          { icon: CalendarDays, label: `수능 전 면접 ${early.length}개 전형` },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      <PromoSection
        eyebrow="BEFORE 수능"
        EyebrowIcon={CalendarDays}
        title="수능 전에 치르는 면접"
        subtitle="2027 수능은 2026년 11월 19일입니다. 아래 전형은 그보다 앞서 면접이 끝납니다."
      >
        <CompareTable
          head={["면접일", "대학", "전형", "면접 반영", "1단계 발표"]}
          rows={early.map(({ univ, track }) => [
            formatKo(track.date!),
            univ.short,
            track.name,
            track.weight,
            track.announce ? formatKo(track.announce) : "미공지",
          ])}
          caption="수능 공부와 면접 준비가 겹치는 구간입니다. 1단계 발표 이후 며칠을 집중 구간으로 쓸지 미리 정해 두세요."
        />
      </PromoSection>

      <PromoSection
        eyebrow="AT A GLANCE"
        EyebrowIcon={Scale}
        title="한의예과 면접 한눈에"
        subtitle="각 대학 2027학년도 수시 모집요강에서 확인된 내용만 정리했습니다."
        tone="muted"
      >
        <CompareTable
          head={["대학", "권역", "요강에 적힌 면접 방식", "면접 전형", "가장 이른 면접일"]}
          rows={rows}
          caption={`면접을 실시하지 않는 대학: ${HANUIDAE_NO_INTERVIEW.map((u) => u.short).join(" · ")}`}
        />
      </PromoSection>

      <PromoSection
        eyebrow="COMMON"
        EyebrowIcon={ClipboardCheck}
        title="한의대 면접에서 먼저 확인할 것"
        subtitle="의대·치대 면접과 겹치지 않는 부분만 골랐습니다."
      >
        <FeatureGrid items={COMMON} columns={3} />
      </PromoSection>

      <div id="univ" className="scroll-mt-24" />
      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={GraduationCap}
        title="대학별 면접 방식과 일정"
        subtitle="요강에서 확인된 문장만 옮겼습니다. 면접을 실시하지 않는 대학도 함께 넣었습니다."
        tone="muted"
      >
        <FieldUnivCards univs={HANUIDAE_UNIVS} />
        <div className="mt-12">
          <NoteBox
            title="요강에서 확인하지 못한 대학"
            tone="warn"
            Icon={TriangleAlert}
            items={HANUIDAE_UNVERIFIED.map((u) => `${u.short} — ${u.note}`)}
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="PREPARATION"
        EyebrowIcon={Brain}
        title="무엇을 훈련해야 하나"
        subtitle="한의대 면접에서만 점수가 되는 것들입니다."
      >
        <FeatureGrid items={DRILLS} columns={2} />
      </PromoSection>

      <PromoSection
        eyebrow="PITFALLS"
        EyebrowIcon={TriangleAlert}
        title="이 계열에서 자주 깎이는 것"
        tone="muted"
      >
        <NoteBox
          title="한의대 면접에서 흔한 실수"
          items={PITFALLS}
          tone="warn"
          Icon={TriangleAlert}
        />
      </PromoSection>

      <ClassCtaBand typeName="한의대 면접" />

      <PromoSection eyebrow="MORE" EyebrowIcon={MessagesSquare} title="함께 보기">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/interview/chidae",
              icon: MessagesSquare,
              title: "치대 면접 대비",
              body: "치의예과 면접 실시 대학과 전형, 요강에 적힌 방식과 일정.",
            },
            {
              href: "/ipkyul/hanuiye",
              icon: GraduationCap,
              title: "한의예과 입시결과",
              body: "대학·전형별 모집인원과 공시된 입결을 한 페이지에.",
            },
            {
              href: "/interview",
              icon: ClipboardCheck,
              title: "의대 면접 — 유형별 대비",
              body: "MMI · 인·적성 · 제시문 세 유형과 실시 대학.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "면접 방식·반영비율·일정은 각 대학 2027학년도 수시 모집요강에서 정리했습니다(2026년 9월 확인). 대학 사정으로 변경될 수 있으므로 최종 확인은 해당 입학처 공지를 따르십시오.",
          "요강에 적힌 문장만 옮겼습니다. 다른 계열 자료로 한의예과를 추정하지 않았습니다.",
          "동국대 WISE 는 요강 추출본에 전형방법·면접 필드가 비어 있어 면접 실시 여부를 확정하지 못했습니다. 목록에 넣지 않고 따로 표시했습니다.",
          "동신대는 요강 추출본에서 한의예과로 잡힌 전형이 농어촌학생전형 하나뿐입니다. 나머지 전형은 입학처 요강에서 확인하세요.",
          "2027학년도 수능일은 2026년 11월 19일 기준입니다.",
        ]}
      />

      <FinalCTA
        title="한의대 면접은 시기부터 다릅니다"
        body={`10월 면접 대학은 수능 공부와 겹칩니다. 지원 대학의 일정과 배점에 맞춰 회차와 과제를 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={Leaf}
        primaryHref="#contact"
        primaryLabel="한의대 면접 수업 문의하기"
      />
    </>
  );
}
