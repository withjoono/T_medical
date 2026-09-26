import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, Database, Scale, TriangleAlert } from "lucide-react";
import { PromoHero, PromoSection, FinalCTA, SourceNote } from "../../_site/components";
import { FieldStats, UnivSummaryTable, MeasuredOnlyNote } from "../_ipkyul";
import { FIELDS, fieldTotals, getField } from "@/lib/ipkyul";

export function generateStaticParams() {
  return FIELDS.map((f) => ({ field: f.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ field: string }> }): Promise<Metadata> {
  const { field } = await params;
  const f = getField(field);
  if (!f) return { title: "입시결과 | T Medi" };
  const t = fieldTotals(f);
  return {
    alternates: { canonical: `/ipkyul/${f.key}` },
    title: `2027 ${f.label} 입시결과 | T Medi — ${t.univs}개 대학 등급컷`,
    description: `${f.label} ${t.univs}개 대학의 2027학년도 수시 모집인원 ${t.quota.toLocaleString()}명과 최종등록자 교과 등급컷(50%·70%)을 전형별로 정리했습니다. 대학이 공시한 실측값 ${t.measured}건만 싣습니다. tmedi.kr`,
  };
}

export default async function FieldPage({ params }: { params: Promise<{ field: string }> }) {
  const { field } = await params;
  const f = getField(field);
  if (!f) notFound();
  const t = fieldTotals(f);
  const others = FIELDS.filter((x) => x.key !== f.key);

  return (
    <>
      <PromoHero
        badge={`2027 ${f.label} 입시결과`}
        title={`${f.label},`}
        highlight={`${t.univs}개 대학 등급컷`}
        body={`${f.college} ${t.univs}개교의 2027학년도 수시 모집 ${t.quota.toLocaleString()}명을 전형 단위로 펼쳤습니다. 이 가운데 ${t.measuredUnivs}개 대학이 최종등록자 성적을 공시했고, 공시가 없는 전형은 빈칸으로 둡니다.`}
        primaryHref="#contact"
        primaryLabel="입결 해석 상담하기"
        secondaryHref="/ipkyul"
        secondaryLabel="다른 계열 보기"
        Icon={BarChart3}
        stats={[
          { icon: Database, label: `${t.univs}개 대학` },
          { icon: BarChart3, label: `${t.programs}개 전형` },
          { icon: Scale, label: `공시 입결 ${t.measured}건` },
        ]}
      />

      <section className="border-t border-hair bg-paper px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <FieldStats field={f} />
        </div>
      </section>

      <PromoSection
        eyebrow="BY UNIVERSITY"
        EyebrowIcon={Database}
        title="대학별 요약"
        subtitle="가장 낮은 50%컷 순으로 정렬했습니다. 등급은 낮을수록 우수합니다."
        tone="muted"
      >
        <UnivSummaryTable field={f} />
      </PromoSection>

      <PromoSection eyebrow="CAUTION" EyebrowIcon={TriangleAlert} title="이 숫자를 읽는 법">
        <MeasuredOnlyNote />
      </PromoSection>

      <section className="border-t border-hair bg-paper-100 px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display text-[1.25rem] text-ink-900">다른 계열</h2>
            <Link href="/ipkyul" className="link-underline inline-flex items-center gap-2 text-[13px] font-medium text-ink-600">
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              입시결과 전체
            </Link>
          </div>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {others.map((x) => (
              <li key={x.key}>
                <Link
                  href={`/ipkyul/${x.key}`}
                  className="inline-block border border-hair-strong bg-paper-50 px-4 py-2 text-[13px] font-medium tracking-tight text-ink-700 transition-colors hover:border-jade-600 hover:bg-jade-50 hover:text-jade-700"
                >
                  {x.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/interview/mmi"
                className="inline-block border border-hair-strong bg-paper-50 px-4 py-2 text-[13px] font-medium tracking-tight text-ink-700 transition-colors hover:border-jade-600 hover:bg-jade-50 hover:text-jade-700"
              >
                대학별 면접 일정
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <FinalCTA
        title={`${f.label} 지원, 숫자만으로는 정해지지 않습니다`}
        body="반영 교과와 환산식이 대학마다 달라 같은 등급도 결과가 갈립니다. 본인 성적으로 어느 전형이 현실적인지 함께 보겠습니다."
        Icon={BarChart3}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />

      <SourceNote
        lines={[
          `${f.label} 모집인원·전형 구조는 각 대학 2027학년도 수시 모집요강 기준입니다.`,
          "등급컷은 대학이 공시한 최종등록자 성적입니다. 공시가 없는 전형은 빈칸이며, 추정치로 채우지 않았습니다.",
          "대학별 반영 교과·학년 비율·환산식이 달라 등급을 대학 간에 직접 비교할 수 없습니다.",
          "최종 확인은 각 대학 입학처 공지를 따르십시오.",
        ]}
      />
    </>
  );
}
