import type { Metadata } from "next";
import {
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  MapPin,
  MessagesSquare,
  Scale,
  Target,
  TriangleAlert,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  LinkCards,
  FinalCTA,
  SourceNote,
} from "../_site/components";
import { UnivCard, UnivStatRow } from "./_univ";
import { byZone, UNIV_TOTALS } from "@/lib/univ";

export const metadata: Metadata = {
  alternates: { canonical: "/univ" },
  title: "대학별 의대 전형·면접 안내 | T Medi — 전국 의대 한눈에",
  description:
    "전국 의과대학의 2027학년도 전형 구조, 면접 방식과 일정, 면접 수업 안내를 대학별로 정리했습니다. 권역별로 골라 전형별 모집인원·수능최저·면접 반영비율을 한 페이지에서 확인하세요. tmedi.kr",
};

const READING = [
  {
    icon: ClipboardCheck,
    title: "전형 구조를 먼저 봅니다",
    body: "같은 의대라도 교과·종합·논술의 비중이 완전히 다릅니다. 대학 페이지는 유형별로 전형을 끊어, 모집인원과 수능 최저를 한 표에 놓습니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접은 대학마다 다른 시험입니다",
    body: "제시문 면접, 서류확인 면접, MMI, 영상 업로드까지 방식이 갈립니다. 요강에서 확인된 면접 방식과 반영비율만 싣습니다.",
  },
  {
    icon: MapPin,
    title: "면접이 아예 없는 대학도 있습니다",
    body: "2027학년도에는 충북대와 가톨릭관동대처럼 의예과 면접을 실시하지 않는 대학이 있습니다. 준비의 무게중심이 완전히 달라집니다.",
  },
  {
    icon: Target,
    title: "일정 충돌을 먼저 확인하세요",
    body: "면접일이 같은 주말에 몰립니다. 같은 날 오전·오후로 갈리는 대학도 있어, 지원 조합을 짤 때 날짜부터 맞춰 봐야 합니다.",
  },
  {
    icon: Scale,
    title: "반영비율이 곧 역전 가능성입니다",
    body: "면접 5%인 대학과 50%인 대학이 함께 있습니다. 1단계 성적을 뒤집을 수 있는 폭이 대학마다 몇 배씩 차이 납니다.",
  },
  {
    icon: TriangleAlert,
    title: "빈칸은 추정하지 않습니다",
    body: "요강에서 확인하지 못한 날짜와 수치는 비워 둡니다. 확인하지 못한 대학은 페이지 상단에 경고를 띄웁니다.",
  },
];

export default function UnivHubPage() {
  const zones = byZone();

  return (
    <>
      <PromoHero
        badge="대학별 의대 전형 · 면접 · 수업"
        title="어느 의대를 쓰든,"
        highlight="그 대학의 규칙부터"
        body="전국 의과대학의 전형 구조와 면접 방식을 대학별로 한 페이지에 모았습니다. 전형별 모집인원과 수능 최저, 1단계 발표일과 면접일, 면접 반영비율까지 요강 기준으로 정리했습니다."
        primaryHref="#contact"
        primaryLabel="지원 대학 상담하기"
        secondaryHref="/ipkyul/uiye"
        secondaryLabel="의예과 입시결과 보기"
        Icon={GraduationCap}
        stats={[
          { icon: GraduationCap, label: `${UNIV_TOTALS.univs}개 의대` },
          { icon: MessagesSquare, label: `면접 정리 ${UNIV_TOTALS.withInterview}개교` },
          { icon: Target, label: `MMI 특강 ${UNIV_TOTALS.withClass}개교` },
        ]}
      />

      <UnivStatRow
        items={[
          { label: "수록 대학", value: String(UNIV_TOTALS.univs), unit: "개교", sub: "전국 의과대학" },
          { label: "전형 데이터", value: String(UNIV_TOTALS.withAdmission), unit: "개교", sub: "의예과 전형 구조·모집인원" },
          { label: "면접 데이터", value: String(UNIV_TOTALS.withInterview), unit: "개교", sub: "요강 기준 면접 방식·일정" },
          { label: "면접 미실시", value: String(UNIV_TOTALS.noInterview), unit: "개교", sub: "2027학년도 기준" },
        ]}
        caption="2027학년도 수시 모집요강 및 T스쿨 수시 DB 기준으로 정리했습니다."
      />

      {zones.map((g, i) => (
        <PromoSection
          key={g.zone}
          eyebrow={g.zone}
          EyebrowIcon={MapPin}
          title={`${g.zone} ${g.univs.length}개 의대`}
          tone={i % 2 === 1 ? "muted" : "default"}
        >
          <div className="link-grid grid sm:grid-cols-2 lg:grid-cols-4">
            {g.univs.map((u) => (
              <UnivCard key={u.slug} univ={u} />
            ))}
          </div>
        </PromoSection>
      ))}

      <PromoSection
        eyebrow="HOW TO READ"
        EyebrowIcon={ClipboardCheck}
        title="대학 페이지를 읽는 법"
        subtitle="같은 이름의 전형이라도 대학이 다르면 다른 시험입니다."
        tone="muted"
      >
        <FeatureGrid items={READING} columns={3} />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={BarChart3} title="함께 보기">
        <LinkCards
          items={[
            {
              href: "/ipkyul/uiye",
              icon: BarChart3,
              title: "의예과 입시결과",
              body: "대학·전형별 최종등록자 등급컷을 공시된 값만 모았습니다.",
            },
            {
              href: "/mmi",
              icon: MessagesSquare,
              title: "대학별 MMI 특강",
              body: "면접 일정에 맞춰 짜인 대학별 커리큘럼과 예약 현황.",
            },
            {
              href: "/susi",
              icon: ClipboardCheck,
              title: "수시 전형 총정리",
              body: "교과·종합·논술 세 전형의 구조와 지역 선발을 한눈에.",
            },
          ]}
          columns={3}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "전형 데이터는 T스쿨 수시 DB(2027학년도 기준), 면접 데이터는 각 대학 2027학년도 수시 모집요강에서 정리했습니다.",
          "요강에서 확인되지 않은 날짜·배수·최저는 비워 두었습니다. 계열 평균 등 추정치로 채우지 않습니다.",
          "모집인원과 일정은 대학 사정에 따라 변경될 수 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title="지원할 대학이 정해지면, 규칙부터 맞춥니다"
        body="전형 구조와 면접 방식이 다르면 준비도 달라야 합니다. 지원 조합에 맞춰 대학별 준비 순서를 함께 짜 드립니다."
        Icon={GraduationCap}
        primaryHref="#contact"
        primaryLabel="지원 대학 상담하기"
      />
    </>
  );
}
