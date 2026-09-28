import type { Metadata } from "next";
import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  MapPin,
  MessagesSquare,
  MonitorPlay,
  PawPrint,
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
  SUUIDAE_NO_INTERVIEW,
  SUUIDAE_TOTALS,
  SUUIDAE_UNIVS,
  SUUIDAE_UNVERIFIED,
  SUUIDAE_WITH_INTERVIEW,
  suuidaeEarliest,
} from "@/lib/suuidae-interview";
import { SESSION_HOURS_LABEL } from "@/lib/interview-types";
import { formatKo } from "@/lib/mmi-schedule";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/interview/suuidae" },
  title: "수의대 면접 대비 | T Medi — 수의예과 면접 실시 대학·전형·일정",
  description:
    "2027학년도 수의예과 면접을 실시하는 대학과 전형, 면접 방식과 면접일을 요강 기준으로 정리했습니다. 건국대·제주대는 수능 최저 없이 면접 30%, 전북대는 익산캠퍼스 면접, 경상국립대는 일반전형만 면접. 1:1 줌 면접 수업 안내. tmedi.kr",
};

const COMMON = [
  {
    icon: Scale,
    title: "면접 반영은 20~30% 로 좁습니다",
    body:
      "건국대·서울대·제주대가 30%, 경상국립대·전북대가 20% 입니다. 약대(20~60%)나 한의대(30~70%)처럼 벌어지지 않습니다. 대신 1단계가 전부 3배수라 면접장에 들어오는 인원이 적고, 서류 차이가 크지 않은 사람들끼리 겨룹니다.",
  },
  {
    icon: TriangleAlert,
    title: "수능 최저가 없는 대학이 둘입니다",
    body:
      "건국대 KU자기추천과 제주대 학생부종합(일반학생)에는 수능 최저학력기준이 없습니다. 최저 탈락으로 경쟁률이 내려가길 기대할 수 없고, 면접 결과가 그대로 결과가 됩니다.",
  },
  {
    icon: ClipboardCheck,
    title: "같은 대학 안에서 전형에 따라 갈립니다",
    body:
      "경상국립대는 일반전형만 수의예과 면접이 있고, 지역인재전형과 지역인재 기초생활수급자등전형은 서류 100% 입니다. 그 전형들에서 면접을 보는 건 의예과뿐입니다. 지원 전형부터 확정해야 합니다.",
  },
  {
    icon: MapPin,
    title: "전북대는 익산에서 면접을 봅니다",
    body:
      "수의과대학 소속은 전주가 아니라 익산 특성화캠퍼스에서 면접을 실시합니다. 이동 시간과 숙박을 미리 계산해 두어야 합니다.",
  },
  {
    icon: Brain,
    title: "의예과와 방식이 다릅니다",
    body:
      "서울대는 의예과가 제시문 다중 스테이션 약 60분이지만 수의예과는 서류 기반 학업소양 면접 10분입니다. 의대 면접 자료를 그대로 가져다 쓰면 없는 것을 준비하게 됩니다.",
  },
  {
    icon: CalendarDays,
    title: "면접이 수능 뒤에 몰립니다",
    body:
      "경상국립대 11월 25~26일, 전북대 11월 26일·28일, 제주대 12월 4일, 서울대 12월 5일, 건국대 12월 6일. 전부 수능(11월 19일) 이후입니다. 수능 후 2~3주가 실제 준비 구간입니다.",
  },
];

const DRILLS = [
  {
    icon: PawPrint,
    title: "지원동기를 수의학으로 좁히기",
    body:
      "'동물을 좋아해서' 는 거의 모든 지원자가 말합니다. 말하지 못하는 환자를 진단하는 일, 축산·공중보건과 이어지는 역할, 반려동물 임상과 연구의 갈래 — 수의학에만 있는 것으로 이유를 좁혀야 합니다.",
  },
  {
    icon: Scale,
    title: "대학별 배점 축에 맞춰 앞세우기",
    body:
      "경상국립대는 지식탐구 45%, 제주대는 인성공동체 120점이 최대입니다. 같은 생기부라도 경상국립대에는 탐구 하나를 가설·방법·한계까지, 제주대에는 협업 장면을 앞에 놓아야 합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "생기부를 내가 먼저 소진시키기",
    body:
      "수의예과 면접은 전부 서류 기반입니다. 제시문을 내는 대학이 없습니다. 3년치 기재에 '왜 했는지 / 무엇을 배웠는지 / 그래서 무엇이 바뀌었는지' 를 붙여 두면 실제 질문의 대부분을 미리 덮습니다.",
  },
  {
    icon: CalendarDays,
    title: "수능 후 2~3주를 설계하기",
    body:
      "1단계 발표는 11월 13일~27일, 면접은 11월 25일~12월 6일입니다. 수능이 끝난 뒤에 준비 시간이 있는 계열이지만, 그때 처음 시작하면 유형을 익히다 끝납니다. 수능 전에 기본기를 만들어 둬야 합니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접 길이에 맞춘 준비량",
    body:
      "건국대·서울대는 10분, 경상국립대·제주대는 15분입니다. 10분이면 활동 두세 개를 깊게, 15분이면 서너 개를 준비해야 시간이 비지 않습니다.",
  },
  {
    icon: TriangleAlert,
    title: "최저가 있는 대학과 없는 대학 구분",
    body:
      "건국대·제주대는 최저가 없고, 서울대는 3합 7, 경상국립대·전북대는 수학 포함 3합 7입니다. 최저가 없는 대학에 지원한다면 면접 준비 비중을 더 올려야 합니다.",
  },
];

const PITFALLS = [
  "'동물을 좋아해서' 로 지원동기를 시작하는 것 — 변별이 되지 않습니다",
  "의대 면접 자료를 그대로 쓰는 것 — 서울대는 의예과와 수의예과의 방식이 다릅니다",
  "같은 대학의 면접 있는 전형·없는 전형을 혼동하는 것 — 경상국립대는 일반전형만 면접입니다",
  "전북대 면접 장소를 전주로 알고 가는 것 — 수의과대학은 익산 특성화캠퍼스입니다",
  "수능 최저가 없는 전형에서 최저 탈락을 기대하는 것 — 건국대·제주대에는 최저가 없습니다",
];

export default function SuuidaePage() {
  const rows = SUUIDAE_WITH_INTERVIEW.map((u) => {
    const d = suuidaeEarliest(u);
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
            { name: "수의대 면접", path: "/interview/suuidae" },
          ]),
          article({
            path: "/interview/suuidae",
            headline: metadata.title as string,
            description: metadata.description as string,
          }),
        ]}
      />

      <PromoHero
        badge="계열별 면접 · 수의예과"
        title="수의대 면접은"
        highlight="수능이 끝난 뒤에 옵니다"
        body="경상국립대 11월 25일부터 건국대 12월 6일까지, 수의예과 면접은 전부 수능 뒤에 있습니다. 준비 시간이 있는 대신 1단계가 모두 3배수라 서류 차이가 크지 않은 사람들끼리 겨룹니다. 요강에 적힌 방식과 일정을 그대로 정리했습니다."
        primaryHref="#contact"
        primaryLabel="수의대 면접 수업 문의"
        secondaryHref="#univ"
        secondaryLabel="대학별로 보기"
        Icon={PawPrint}
        stats={[
          { icon: GraduationCap, label: `면접 실시 ${SUUIDAE_TOTALS.withInterview}개 수의대` },
          { icon: ClipboardCheck, label: `면접 전형 ${SUUIDAE_TOTALS.interviewTracks}개` },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      <PromoSection
        eyebrow="AT A GLANCE"
        EyebrowIcon={Scale}
        title="수의예과 면접 한눈에"
        subtitle="각 대학 2027학년도 수시 모집요강에서 확인된 내용만 정리했습니다."
      >
        <CompareTable
          head={["대학", "권역", "요강에 적힌 면접 방식", "면접 전형", "가장 이른 면접일"]}
          rows={rows}
          caption={`요강 확인 범위에서 면접을 실시하지 않는 대학: ${SUUIDAE_NO_INTERVIEW.map((u) => u.short).join(" · ")}`}
        />
      </PromoSection>

      <PromoSection
        eyebrow="COMMON"
        EyebrowIcon={ClipboardCheck}
        title="수의대 면접에서 먼저 확인할 것"
        subtitle="의대·약대 면접과 겹치지 않는 부분만 골랐습니다."
        tone="muted"
      >
        <FeatureGrid items={COMMON} columns={3} />
      </PromoSection>

      <div id="univ" className="scroll-mt-24" />
      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={GraduationCap}
        title="대학별 면접 방식과 일정"
        subtitle="요강에서 확인된 문장만 옮겼습니다. 면접을 실시하지 않는 대학도 함께 넣었습니다."
      >
        <FieldUnivCards univs={SUUIDAE_UNIVS} />
        <div className="mt-12">
          <NoteBox
            title="요강에서 확인하지 못한 대학"
            tone="warn"
            Icon={TriangleAlert}
            items={[
              `${SUUIDAE_UNVERIFIED.map((u) => u.short).join(" · ")} 수의예과는 이번 요강 추출본에 모집단위가 잡히지 않았습니다.`,
              "면접 실시 여부를 확인하지 못했으므로 목록에 넣지 않았습니다. 추정으로 채우지 않습니다.",
              "해당 대학 지원을 고려한다면 입학처 모집요강에서 직접 확인해 주세요.",
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="PREPARATION"
        EyebrowIcon={Brain}
        title="무엇을 훈련해야 하나"
        subtitle="수의대 면접에서만 점수가 되는 것들입니다."
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
          title="수의대 면접에서 흔한 실수"
          items={PITFALLS}
          tone="warn"
          Icon={TriangleAlert}
        />
      </PromoSection>

      <ClassCtaBand typeName="수의대 면접" />

      <PromoSection eyebrow="MORE" EyebrowIcon={MessagesSquare} title="함께 보기" tone="muted">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/interview/yakdae",
              icon: MessagesSquare,
              title: "약대 면접 대비",
              body: "면접 실시 22개교. 반영비율이 20~60% 로 갈리는 계열.",
            },
            {
              href: "/ipkyul/suuiye",
              icon: GraduationCap,
              title: "수의예과 입시결과",
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
          "요강에 적힌 문장만 옮겼습니다. 의예과 자료로 수의예과를 추정하지 않았습니다 — 서울대는 같은 대학 안에서 방식이 다르고, 경상국립대는 같은 전형 안에서 의예과만 면접을 봅니다.",
          "충남대 · 전남대 · 강원대 수의예과는 요강 추출본에 모집단위가 잡히지 않아 목록에서 제외했습니다.",
          "경북대는 요강 추출본에서 수의예과로 잡힌 전형이 교과우수자전형 하나뿐이라, 그 범위에서 면접 미실시로 표기했습니다.",
          "서울대 수의과대학 면접일은 요강에 '별도 공지' 로 적혀 있습니다. 12월 5일은 수의·의과 공통 표기 기준입니다.",
        ]}
      />

      <FinalCTA
        title="수의대는 수능 뒤 2~3주가 준비 구간입니다"
        body={`시간이 있는 계열이지만 그때 처음 시작하면 유형을 익히다 끝납니다. 지원 대학의 배점과 면접 길이에 맞춰 회차를 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={PawPrint}
        primaryHref="#contact"
        primaryLabel="수의대 면접 수업 문의하기"
      />
    </>
  );
}
