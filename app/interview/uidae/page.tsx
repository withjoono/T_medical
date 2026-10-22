import type { Metadata } from "next";
import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessagesSquare,
  MonitorPlay,
  Scale,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import {
  FeatureGrid,
  FinalCTA,
  LinkCards,
  PromoHero,
  PromoSection,
  SourceNote,
} from "../../_site/components";
import { UnivStatRow } from "../../univ/_univ";
import {
  ClassCtaBand,
  MedGlanceTable,
  NoInterviewRow,
  TypeChooser,
  UnivFinder,
} from "../_interview";
import {
  finderByZone,
  medGlanceRows,
  INTERVIEW_TYPES,
  noInterviewUnivs,
  SESSION_HOURS_LABEL,
  typeCounts,
} from "@/lib/interview-types";
import { UNIV_TOTALS } from "@/lib/univ";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/interview/uidae" },
  title: "의대 면접 대비 | T Medi — MMI·인적성·제시문 유형별 실시 대학·일정",
  description:
    "의대 면접은 대학마다 다른 시험입니다. MMI(다중미니면접)·인적성(생기부 기반)·제시문 세 유형으로 나눠 실시 대학과 준비법, 2027학년도 의예과 1차 발표일·면접일을 요강 기준으로 정리했습니다. tmedi.kr",
};

/** 의예과 면접에만 해당하는 공통 사실. 의·치·한·약·수 공통인 수업 안내는 /interview 허브에 둔다. */
const COMMON = [
  {
    icon: Scale,
    title: "면접 비중이 곧 역전 폭입니다",
    body:
      "면접 5%인 대학과 50%인 대학이 함께 있습니다. 1단계 성적을 뒤집을 수 있는 폭이 대학마다 몇 배씩 차이 나므로, 지원 조합을 짤 때 반영비율부터 봐야 합니다.",
  },
  {
    icon: TriangleAlert,
    title: "과락 규정이 있는 대학이 있습니다",
    body:
      "전남대·제주대·계명대·경북대처럼 특정 영역에서 최하 등급을 받거나 기준 점수에 못 미치면 전형총점과 관계없이 불합격시키는 대학이 있습니다.",
  },
  {
    icon: FileText,
    title: "블라인드가 기본입니다",
    body:
      "교복 착용, 출신 고교·부모 직업·거주 지역 언급이 대부분의 대학에서 금지됩니다. 습관적으로 학교 이름을 말하면 그 자체로 감점됩니다.",
  },
  {
    icon: CalendarDays,
    title: "1차 발표와 면접일 사이가 준비 기간의 전부입니다",
    body:
      "대부분 일주일에서 열흘입니다. 그 기간에 처음 시작하면 유형을 익히다 끝나므로, 1차 발표 전에 유형별 기본기를 만들어 두어야 합니다.",
  },
  {
    icon: Brain,
    title: "아는 것과 말할 수 있는 것은 다릅니다",
    body:
      "내용을 알아도 두괄식으로 5분 안에 정리해 말하는 것은 별개의 기술입니다. 말로 꺼내 보는 횟수가 그대로 점수가 됩니다.",
  },
  {
    icon: ClipboardCheck,
    title: "결시는 곧 불합격입니다",
    body:
      "면접 결시자를 불합격 처리한다고 요강에 명시한 대학이 대부분입니다. 같은 날 다른 대학 면접과 겹치는지 지원 전에 확인해야 합니다.",
  },
];

export default function UidaeInterviewPage() {
  const chooser = INTERVIEW_TYPES.map((t) => {
    const c = typeCounts(t.key);
    return {
      href: t.href,
      name: t.name,
      short: t.short,
      tagline: t.tagline,
      count: c.primary,
      also: c.also,
    };
  });
  const noInterview = noInterviewUnivs();
  const withInterview = UNIV_TOTALS.withInterview - UNIV_TOTALS.noInterview;

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "의약학 면접", path: "/interview" },
            { name: "의대 면접", path: "/interview/uidae" },
          ]),
          article({
            path: "/interview/uidae",
            headline: metadata.title as string,
            description: metadata.description as string,
          }),
        ]}
      />
      <PromoHero
        badge="계열별 면접 · 의예과"
        title="의대 면접은"
        highlight="대학마다 다른 시험입니다"
        body="어떤 대학은 면접실을 세 번 옮기고, 어떤 대학은 생기부만 놓고 10분 대화하며, 어떤 대학은 그 자리에서 제시문을 읽힙니다. 준비 방법이 완전히 다릅니다. 지원 대학이 어느 유형인지부터 확인하고, 그 유형에 맞춰 훈련하세요."
        primaryHref="#contact"
        primaryLabel="의대 면접 수업 문의"
        secondaryHref="#univ"
        secondaryLabel="대학별로 보기"
        Icon={MessagesSquare}
        stats={[
          { icon: GraduationCap, label: `면접 실시 ${withInterview}개 의대` },
          { icon: ClipboardCheck, label: "요강 기준 방식 · 일정 수록" },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      <div id="univ" className="scroll-mt-24" />
      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={GraduationCap}
        title="지원 대학부터 고르세요"
        subtitle="요강마다 부르는 이름이 달라 유형이 헷갈리는 것이 정상입니다. 지원 대학을 누르면 그 대학의 면접 방식과 전형별 1차 발표일·면접일이 바로 나옵니다."
      >
        <UnivFinder zones={finderByZone()} />
      </PromoSection>

      <div id="types" className="scroll-mt-24" />
      <PromoSection
        eyebrow="TYPES"
        EyebrowIcon={MessagesSquare}
        title="유형으로 보기"
        subtitle="의대 면접은 셋 중 하나입니다. 하나를 누르면 그 방식으로 면접을 보는 대학과 전형, 준비 방법이 모두 나옵니다."
        tone="muted"
      >
        <TypeChooser items={chooser} />
      </PromoSection>

      <PromoSection
        eyebrow="AT A GLANCE"
        EyebrowIcon={CalendarDays}
        title="의예과 면접 한눈에"
        subtitle="각 대학 2027학년도 수시 모집요강에서 확인된 내용만 정리했습니다. 면접일이 이른 순서이고, 1차 발표일을 면접일 앞에 두었습니다."
      >
        <MedGlanceTable rows={medGlanceRows()} />
      </PromoSection>

      <UnivStatRow
        items={[
          {
            label: "면접 정리 대학",
            value: String(UNIV_TOTALS.withInterview),
            unit: "개교",
            sub: "요강 기준 면접 방식·일정 수록",
          },
          {
            label: "면접 실시",
            value: String(withInterview),
            unit: "개교",
            sub: "2027학년도 수시 의예과",
          },
          {
            label: "면접 미실시",
            value: String(UNIV_TOTALS.noInterview),
            unit: "개교",
            sub: "면접 준비가 필요 없는 대학",
          },
          {
            label: "MMI 특강 개설",
            value: String(UNIV_TOTALS.withClass),
            unit: "개교",
            sub: "1단계 발표일 기준 수업 캘린더 운영",
          },
        ]}
        caption="2027학년도 수시 모집요강 기준. 대학별 근거와 출처는 각 대학 페이지 하단에 있습니다."
      />

      <PromoSection
        eyebrow="COMMON"
        EyebrowIcon={ClipboardCheck}
        title="유형과 상관없이 공통인 것"
        subtitle="어느 의대를 쓰든 먼저 확인해야 하는 여섯 가지입니다."
        tone="muted"
      >
        <FeatureGrid items={COMMON} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="NO INTERVIEW"
        EyebrowIcon={TriangleAlert}
        title="2027학년도에 면접이 없는 의대"
        subtitle="이 두 대학은 의예과 수시 전 전형에서 면접을 실시하지 않습니다. 준비의 무게중심이 교과·서류로 완전히 옮겨 갑니다."
      >
        <NoInterviewRow univs={noInterview} />
      </PromoSection>

      <ClassCtaBand typeName="의대 면접" />

      <PromoSection eyebrow="MORE" EyebrowIcon={Stethoscope} title="함께 보기" tone="muted">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/interview",
              icon: MessagesSquare,
              title: "의약학 면접 — 계열 전체",
              body: "의·치·한·약·수 다섯 계열의 면접 실시 대학과 면접일 범위, 수업 안내를 한 곳에.",
            },
            {
              href: "/interview/mmi",
              icon: CalendarDays,
              title: "MMI 면접 대비",
              body: "실시 대학과 방식, 최저점 관리 훈련, 대학별 수업 일정까지 한 페이지에.",
            },
            {
              href: "/ipkyul/uiye",
              icon: GraduationCap,
              title: "의예과 입시결과",
              body: "대학·전형별 모집인원과 공시된 입결을 한 페이지에.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "면접 방식·일정은 각 대학 2027학년도 수시 모집요강에서 정리했습니다. 대학별 근거와 출처는 각 대학 페이지 하단에 있습니다.",
          "유형 분류는 요강에 적힌 면접 방식 문장을 기준으로 했습니다. 한 대학이 두 방식을 함께 쓰는 경우 주된 형식으로 분류하고, 나머지 유형 페이지에는 '함께 보는 대학'으로 실었습니다.",
          "요강에서 확인되지 않은 날짜·시간·면접위원 수는 비워 두었습니다. 추정치로 채우지 않습니다.",
          "모집인원과 일정은 대학 사정에 따라 변경될 수 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title="의대 면접장에서 흔들리지 않도록"
        body={`지원 대학의 면접 유형에 맞춰 과제와 모의면접을 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={MessagesSquare}
        primaryHref="#contact"
        primaryLabel="의대 면접 수업 문의하기"
      />
    </>
  );
}
