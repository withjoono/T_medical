import type { Metadata } from "next";
import {
  Beaker,
  Brain,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
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
  YAKDAE_NO_INTERVIEW_NAMES,
  YAKDAE_TOTALS,
  YAKDAE_UNIVS,
  YAKDAE_WITH_INTERVIEW,
  yakdaeBeforeSuneung,
  yakdaeEarliest,
} from "@/lib/yakdae-interview";
import { SESSION_HOURS_LABEL } from "@/lib/interview-types";
import { formatKo } from "@/lib/mmi-schedule";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/interview/yakdae" },
  title: "약대 면접 대비 | T Medi — 약학과 면접 실시 대학·전형·일정",
  description:
    "2027학년도 약학과 면접을 실시하는 22개 대학과 전형, 면접 방식과 면접일을 요강 기준으로 정리했습니다. 동덕여대 면접 60%, 가천대 50%, 경북대 60% 과락, 연세대 제시문 면접까지. 1:1 줌 면접 수업 안내. tmedi.kr",
};

const COMMON = [
  {
    icon: Scale,
    title: "면접 반영이 20~60% 로 갈립니다",
    body:
      "동덕여대 60%, 가천대 50%, 덕성여대·삼육대·연세대 40%, 대부분 30%, 부산대·인제대·전북대 20%. 계열 중 편차가 가장 큽니다. 같은 서류 성적이어도 어느 대학에 쓰느냐에 따라 뒤집을 수 있는 폭이 세 배 차이납니다.",
  },
  {
    icon: CalendarDays,
    title: "면접 시기가 10월부터 12월까지 퍼져 있습니다",
    body:
      "삼육대는 10월 11일에 시작하고 동국대는 12월 12일에 끝납니다. 의대처럼 한 구간에 몰려 있지 않아, 복수 지원하면 두 달 내내 면접 일정이 이어질 수 있습니다.",
  },
  {
    icon: TriangleAlert,
    title: "면접을 아예 안 보는 대학이 16곳입니다",
    body:
      "성균관대·숙명여대·영남대·충남대·충북대·전남대 등은 약학과 면접을 실시하지 않습니다. 지원 대학 목록이 정해지면 준비 범위가 크게 줄어듭니다.",
  },
  {
    icon: ClipboardCheck,
    title: "같은 대학 안에서도 전형에 따라 갈립니다",
    body:
      "중앙대는 탐구형·성장형만 면접을 보고 융합형인재는 약학부에 면접이 없습니다. 부산대는 학생부종합만 면접이고 논술전형은 논술입니다. 지원 전형부터 확정해야 합니다.",
  },
  {
    icon: Brain,
    title: "의예과와 방식이 다른 대학이 있습니다",
    body:
      "인제대는 같은 전형에서 의예과가 다중미니면접(6실 60분), 약학과는 심층면접(10분)입니다. 서울대도 의예과는 제시문 약 60분이지만 약학계열은 서류 기반 10분입니다. 의대 자료를 그대로 쓰면 안 됩니다.",
  },
  {
    icon: Beaker,
    title: "전공이 나뉜 대학이 있습니다",
    body:
      "이화여대는 약학전공과 미래산업약학전공, 연세대는 약학과와 첨단약과학과를 따로 뽑습니다. 산업·개발 쪽 전공은 지원동기의 결이 달라야 설득됩니다.",
  },
];

const DRILLS = [
  {
    icon: Beaker,
    title: "지원동기를 약학으로 좁히기",
    body:
      "의대 지원자와 같은 답을 하면 '왜 약사인가' 에서 막힙니다. 약물이 몸에서 작동하는 방식에 대한 관심, 복약 상담이라는 접점, 신약 개발이라는 경로 — 약학에만 있는 것으로 이유를 좁혀야 합니다.",
  },
  {
    icon: Scale,
    title: "대학별 배점 축에 맞춰 앞세우기",
    body:
      "가천대는 인성 40·진학의지 40, 가톨릭대는 진로 50, 동덕여대는 진로역량 40, 제주대는 인성공동체 120, 아주대는 서류신뢰도 80. 같은 생기부라도 무엇을 먼저 꺼낼지가 완전히 달라집니다.",
  },
  {
    icon: ClipboardCheck,
    title: "생기부를 내가 먼저 소진시키기",
    body:
      "연세대를 제외하면 질문의 출처는 전부 생활기록부입니다. 3년치 기재에 '왜 했는지 / 무엇을 배웠는지 / 그래서 무엇이 바뀌었는지' 를 붙여 두면 실제 질문의 대부분을 미리 덮습니다.",
  },
  {
    icon: CalendarDays,
    title: "수능을 사이에 둔 일정 설계",
    body:
      "10월 면접(삼육대·동덕여대)은 수능 공부와 겹치고, 11월 하순 면접(덕성여대·이화여대)은 수능 사흘 뒤입니다. 12월 면접(동국대·아주대)은 수능 후에 시간이 있습니다. 지원 조합에 따라 준비 전략이 정반대가 됩니다.",
  },
  {
    icon: MessagesSquare,
    title: "짧은 면접의 시간 배분",
    body:
      "삼육대 8분, 가톨릭대·동국대·아주대·차의과학대 10분. 서론이 길면 활동 하나를 제대로 말하지 못하고 끝납니다. 첫 문장에 결론을 놓고 활동은 두세 개만 깊게 준비합니다.",
  },
  {
    icon: TriangleAlert,
    title: "면접 뒤에도 남는 수능 최저",
    body:
      "삼육대는 10월에 면접이 끝나지만 최종합격은 수능 최저를 적용해 12월 15일에 나옵니다. 가천대는 반대로 수능 최저 충족자만 면접 대상자가 됩니다. 최저와 면접의 순서를 대학별로 확인해야 합니다.",
  },
];

const PITFALLS = [
  "의대 면접 자료를 그대로 쓰는 것 — 인제대·서울대는 의예과와 약학과의 면접 방식이 다릅니다",
  "'왜 의대가 아니라 약대인가' 에 답을 준비하지 않는 것 — 거의 모든 대학에서 나옵니다",
  "면접 반영비율을 확인하지 않는 것 — 20% 인 대학과 60% 인 대학의 준비량은 같을 수 없습니다",
  "같은 대학의 면접 있는 전형·없는 전형을 혼동하는 것 — 중앙대 융합형인재는 약학부에 면접이 없습니다",
  "면접일이 겹치는지 확인하지 않는 것 — 12월 5일에 가톨릭대·경희대·부산대·중앙대가 함께 있습니다",
];

export default function YakdaePage() {
  const rows = YAKDAE_WITH_INTERVIEW.map((u) => {
    const d = yakdaeEarliest(u);
    return [
      u.short,
      u.zone,
      u.styleLabel,
      `${u.tracks.filter((t) => t.interview).length}개 전형`,
      d ? formatKo(d) : "미공지",
    ];
  });
  const early = yakdaeBeforeSuneung();

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "면접 수업", path: "/interview" },
            { name: "약대 면접", path: "/interview/yakdae" },
          ]),
          article({
            path: "/interview/yakdae",
            headline: metadata.title as string,
            description: metadata.description as string,
          }),
        ]}
      />

      <PromoHero
        badge="계열별 면접 · 약학과"
        title="약대 면접은"
        highlight="반영비율이 세 배 차이납니다"
        body="동덕여대는 2단계 면접이 60%, 부산대는 20% 입니다. 면접 시기도 10월부터 12월까지 퍼져 있습니다. 2027학년도 약학과 면접을 실시하는 대학과 전형, 요강에 적힌 방식과 일정을 그대로 정리했습니다."
        primaryHref="#contact"
        primaryLabel="약대 면접 수업 문의"
        secondaryHref="#univ"
        secondaryLabel="대학별로 보기"
        Icon={Beaker}
        stats={[
          { icon: GraduationCap, label: `면접 실시 ${YAKDAE_TOTALS.withInterview}개 약대` },
          { icon: ClipboardCheck, label: `면접 전형 ${YAKDAE_TOTALS.interviewTracks}개` },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      <PromoSection
        eyebrow="AT A GLANCE"
        EyebrowIcon={Scale}
        title="약학과 면접 한눈에"
        subtitle="각 대학 2027학년도 수시 모집요강에서 확인된 내용만 정리했습니다."
      >
        <CompareTable
          head={["대학", "권역", "요강에 적힌 면접 방식", "면접 전형", "가장 이른 면접일"]}
          rows={rows}
          caption={`면접을 실시하지 않는 대학(${YAKDAE_NO_INTERVIEW_NAMES.length}곳): ${YAKDAE_NO_INTERVIEW_NAMES.join(" · ")}`}
        />
      </PromoSection>

      <PromoSection
        eyebrow="BEFORE 수능"
        EyebrowIcon={CalendarDays}
        title="수능 전에 치르는 면접"
        subtitle="2027 수능은 2026년 11월 19일입니다. 아래 전형은 그보다 앞서 면접이 끝납니다."
        tone="muted"
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
          caption="수능 공부와 면접 준비가 겹치는 구간입니다. 삼육대는 면접이 10월에 끝나도 최종합격은 수능 최저를 적용해 12월에 나옵니다."
        />
      </PromoSection>

      <PromoSection
        eyebrow="COMMON"
        EyebrowIcon={ClipboardCheck}
        title="약대 면접에서 먼저 확인할 것"
        subtitle="의대 면접과 겹치지 않는 부분만 골랐습니다."
      >
        <FeatureGrid items={COMMON} columns={3} />
      </PromoSection>

      <div id="univ" className="scroll-mt-24" />
      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={GraduationCap}
        title="대학별 면접 방식과 일정"
        subtitle="요강에서 확인된 문장만 옮겼습니다. 전형별 반영비율과 면접일이 함께 있습니다."
        tone="muted"
      >
        <FieldUnivCards univs={YAKDAE_UNIVS} />
      </PromoSection>

      <PromoSection
        eyebrow="PREPARATION"
        EyebrowIcon={Brain}
        title="무엇을 훈련해야 하나"
        subtitle="약대 면접에서만 점수가 되는 것들입니다."
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
          title="약대 면접에서 흔한 실수"
          items={PITFALLS}
          tone="warn"
          Icon={TriangleAlert}
        />
      </PromoSection>

      <ClassCtaBand typeName="약대 면접" />

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
              href: "/interview/hanuidae",
              icon: MessagesSquare,
              title: "한의대 면접 대비",
              body: "수능보다 먼저 끝나는 면접이 셋. 한의예과 실시 대학과 일정.",
            },
            {
              href: "/ipkyul/yakhak",
              icon: GraduationCap,
              title: "약학과 입시결과",
              body: "대학·전형별 모집인원과 공시된 입결을 한 페이지에.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "면접 방식·반영비율·일정은 각 대학 2027학년도 수시 모집요강에서 정리했습니다(2026년 9월 확인). 대학 사정으로 변경될 수 있으므로 최종 확인은 해당 입학처 공지를 따르십시오.",
          "모집단위가 약학과 · 약학부 · 약학대학인 전형만 담았습니다. 같은 대학의 바이오의약학과 · 첨단바이오의약학과 · AI신약학과 등은 약학과가 아니므로 제외했습니다.",
          "요강에 적힌 문장만 옮겼습니다. 의예과 자료로 약학과를 추정하지 않았습니다 — 인제대·서울대는 같은 대학 안에서 방식이 다릅니다.",
          "조선대는 요강에 면접일이 기재돼 있지 않아 '미공지' 로 표기했습니다.",
          "전국 약대는 이 목록보다 많을 수 있습니다. 요강 추출본에서 약학과 모집단위가 확인된 대학만 실었습니다.",
        ]}
      />

      <FinalCTA
        title="약대는 지원 조합에 따라 준비가 달라집니다"
        body={`면접 반영이 20% 인 대학과 60% 인 대학을 같이 준비할 수는 없습니다. 지원 대학의 배점과 일정에 맞춰 회차를 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={Beaker}
        primaryHref="#contact"
        primaryLabel="약대 면접 수업 문의하기"
      />
    </>
  );
}
