import type { Metadata } from "next";
import { BarChart3, Database, Scale, Search, TriangleAlert, Users } from "lucide-react";
import { PromoHero, PromoSection, FeatureGrid, FinalCTA, SourceNote } from "../_site/components";
import { FieldCards, MeasuredOnlyNote } from "./_ipkyul";
import { FIELDS, fieldTotals } from "@/lib/ipkyul";

export const metadata: Metadata = {
  alternates: { canonical: "/ipkyul" },
  title: "2027 의치한약수 입시결과 | T Medi — 대학별 공시 입결컷",
  description:
    "의예·치의예·한의예·수의예·약학 102개 대학의 2027학년도 수시 모집인원과 최종등록자 교과 등급컷(50%·70%)을 대학·전형별로 정리했습니다. 대학이 공시한 실측값만 싣습니다. tmedi.kr",
};

const READING = [
  {
    icon: Scale,
    title: "등급을 대학 간에 비교하지 마세요",
    body: "반영 교과도, 학년별 비율도, 등급 환산식도 대학마다 다릅니다. A대 1.3과 B대 1.3은 같은 성적이 아닙니다. 같은 대학 안에서 전형끼리 비교하는 것이 그나마 안전합니다.",
  },
  {
    icon: BarChart3,
    title: "50%컷은 하한선이 아닙니다",
    body: "최종등록자의 중간값입니다. 절반은 이보다 좋았고 절반은 이보다 낮았다는 뜻입니다. 합격 커트라인으로 읽으면 실제보다 문을 좁게 보게 됩니다.",
  },
  {
    icon: Users,
    title: "충원을 감안해야 실제 합격선입니다",
    body: "의약학계열은 중복 합격이 많아 추가합격이 길게 돕니다. 공개된 컷보다 실제 최종 합격선이 내려가는 경우가 흔합니다. 70%컷이 그 실마리입니다.",
  },
  {
    icon: TriangleAlert,
    title: "빈칸은 '낮다'가 아니라 '모른다'입니다",
    body: "대학이 그 전형의 결과를 공개하지 않았다는 뜻입니다. 저희는 그 자리를 계열 평균 같은 추정치로 메우지 않습니다. 빈칸으로 두는 편이 정직합니다.",
  },
  {
    icon: Database,
    title: "공시 실측만 싣습니다",
    body: "원본 데이터에는 빈칸을 계열 평균으로 채운 추정 행이 60~70% 섞여 있습니다. 전부 걷어내고 대학이 실제로 공시한 값만 남겼습니다.",
  },
  {
    icon: Search,
    title: "전형 구조를 함께 보세요",
    body: "같은 등급이라도 단계별 전형이면 면접이, 일괄합산이면 교과 산출식이 당락을 가릅니다. 표에 선발모형과 수능최저를 함께 실은 이유입니다.",
  },
];

export default function IpkyulHubPage() {
  const t = FIELDS.map(fieldTotals);
  const univs = t.reduce((a, x) => a + x.univs, 0);
  const quota = t.reduce((a, x) => a + x.quota, 0);
  const measured = t.reduce((a, x) => a + x.measured, 0);

  return (
    <>
      <PromoHero
        badge="2027 의치한약수 입시결과"
        title="공시된 숫자만,"
        highlight="있는 그대로"
        body={`의예·치의예·한의예·수의예·약학 ${univs}개 대학의 2027학년도 수시 모집인원과 최종등록자 교과 등급컷을 대학·전형 단위로 정리했습니다. 대학이 공시하지 않은 전형은 빈칸으로 둡니다 — 추정치로 채우지 않습니다.`}
        primaryHref="#contact"
        primaryLabel="입결 해석 상담하기"
        secondaryHref="/mmi"
        secondaryLabel="면접 일정 보기"
        Icon={BarChart3}
        stats={[
          { icon: Database, label: `${univs}개 대학` },
          { icon: Users, label: `${quota.toLocaleString()}명 모집` },
          { icon: BarChart3, label: `공시 입결 ${measured}건` },
        ]}
      />

      <PromoSection
        eyebrow="FIELDS"
        EyebrowIcon={Database}
        title="계열별 입시결과"
        subtitle="계열을 고르면 대학별 모집인원과 등급컷이 한 표에 정렬됩니다."
      >
        <FieldCards fields={FIELDS} />
      </PromoSection>

      <PromoSection
        eyebrow="HOW TO READ"
        EyebrowIcon={Scale}
        title="입결을 잘못 읽는 여섯 가지"
        subtitle="숫자보다 숫자를 읽는 법이 먼저입니다. 여기서 어긋나면 지원 판단이 통째로 틀어집니다."
        tone="muted"
      >
        <FeatureGrid items={READING} columns={3} />
      </PromoSection>

      <PromoSection eyebrow="CAUTION" EyebrowIcon={TriangleAlert} title="표를 보기 전에">
        <MeasuredOnlyNote />
      </PromoSection>

      <FinalCTA
        title="숫자는 해석이 필요합니다"
        body="같은 1.3도 대학에 따라 지원 가능 여부가 갈립니다. 본인 성적과 생기부를 놓고 어느 전형이 현실적인지 함께 봐 드립니다."
        Icon={BarChart3}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />

      <SourceNote
        lines={[
          "모집인원·전형 구조는 각 대학 2027학년도 수시 모집요강 기준입니다.",
          "등급컷은 대학이 공시한 최종등록자 성적(50%·70%컷)이며, 공시가 없는 전형은 빈칸으로 두었습니다. 추정치는 싣지 않습니다.",
          "대학마다 반영 교과와 등급 환산식이 달라 등급을 대학 간에 직접 비교할 수 없습니다.",
          "경쟁률은 아직 포함하지 않았습니다. 확보되는 대로 각 표에 열을 추가합니다.",
          "최종 확인은 각 대학 입학처 공지를 따르십시오.",
        ]}
      />
    </>
  );
}
