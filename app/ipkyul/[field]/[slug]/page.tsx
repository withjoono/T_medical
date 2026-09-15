import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, CalendarDays, Database, Scale, TriangleAlert } from "lucide-react";
import { PromoHero, PromoSection, FinalCTA, SourceNote, LinkCards } from "../../../_site/components";
import { ProgramTables, MeasuredOnlyNote } from "../../_ipkyul";
import { FIELD_BY_KEY, getField, measuredUnits } from "@/lib/ipkyul";
import { getUniv as getMmiUniv } from "@/lib/mmi-schedule";

/** 대학별 페이지는 의예과만 만든다(사용자 확정 범위).
 *  다른 계열은 계열 페이지의 요약표에서 다룬다. */
export function generateStaticParams() {
  return FIELD_BY_KEY.uiye.univs.map((u) => ({ field: "uiye", slug: u.slug }));
}

function find(field: string, slug: string) {
  const f = getField(field);
  const u = f?.univs.find((x) => x.slug === slug);
  return f && u ? { f, u } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ field: string; slug: string }>;
}): Promise<Metadata> {
  const { field, slug } = await params;
  const hit = find(field, slug);
  if (!hit) return { title: "입시결과 | T Medi" };
  const { f, u } = hit;
  const best = measuredUnits(u).map((x) => x.cut?.g50).filter((v): v is number => v != null);
  const cut = best.length ? `최우수 50%컷 ${Math.min(...best).toFixed(2)}등급. ` : "";
  return {
    alternates: { canonical: `/ipkyul/${f.key}/${u.slug}` },
    title: `2027 ${u.name} ${f.label} 입시결과 | T Medi — 전형별 등급컷`,
    description: `${u.name} ${f.label} 2027학년도 수시 ${u.units.length}개 전형 ${u.quota}명. ${cut}전형별 모집인원·최종등록자 등급컷·수능최저를 한 표에 정리했습니다. tmedi.kr`,
  };
}

export default async function UnivIpkyulPage({
  params,
}: {
  params: Promise<{ field: string; slug: string }>;
}) {
  const { field, slug } = await params;
  const hit = find(field, slug);
  if (!hit) notFound();
  const { f, u } = hit;

  const measured = measuredUnits(u);
  const bests = measured.map((x) => x.cut?.g50).filter((v): v is number => v != null);
  const best = bests.length ? Math.min(...bests) : undefined;
  const mmi = getMmiUniv(u.slug);
  const siblings = f.univs.filter((x) => x.slug !== u.slug).slice(0, 10);

  return (
    <>
      <PromoHero
        badge={`2027 ${u.name} ${f.label} 입시결과`}
        title={`${u.name} ${f.label},`}
        highlight={best != null ? `50%컷 ${best.toFixed(2)}등급부터` : "전형별로 펼쳐 봅니다"}
        body={
          measured.length > 0
            ? `2027학년도 수시 ${u.units.length}개 전형 ${u.quota}명. 이 가운데 ${measured.length}개 전형의 최종등록자 성적이 공시됐습니다. 나머지는 대학이 결과를 공개하지 않아 빈칸으로 둡니다.`
            : `2027학년도 수시 ${u.units.length}개 전형 ${u.quota}명. ${u.name}는 최종등록자 성적을 공시하지 않아 등급컷은 비어 있습니다. 모집인원과 전형 구조만 확인하실 수 있습니다.`
        }
        primaryHref="#contact"
        primaryLabel={`${u.name} 지원 상담하기`}
        secondaryHref={`/ipkyul/${f.key}`}
        secondaryLabel={`${f.label} 전체 보기`}
        Icon={BarChart3}
        stats={[
          { icon: Database, label: `${u.units.length}개 전형` },
          { icon: Scale, label: `${u.quota}명 모집` },
          { icon: BarChart3, label: measured.length ? `공시 입결 ${measured.length}건` : "입결 미공시" },
        ]}
      />

      <PromoSection
        eyebrow="BY PROGRAM"
        EyebrowIcon={Database}
        title="전형별 모집인원과 등급컷"
        subtitle="50%컷은 최종등록자의 중간값입니다. 합격 하한선이 아닙니다."
      >
        <ProgramTables univ={u} />
      </PromoSection>

      <PromoSection eyebrow="CAUTION" EyebrowIcon={TriangleAlert} title="이 표를 읽을 때" tone="muted">
        <MeasuredOnlyNote />
      </PromoSection>

      {mmi && (
        <PromoSection
          eyebrow="NEXT"
          EyebrowIcon={CalendarDays}
          title={`${u.name} 면접은 언제인가`}
          subtitle="1단계 발표부터 면접까지의 구간과 수업 일정을 따로 정리해 두었습니다."
        >
          <LinkCards
            items={[
              {
                href: `/mmi/${u.slug}`,
                icon: CalendarDays,
                title: `${u.name} 면접 일정과 대비`,
                body: `${mmi.styleLabel}. ${mmi.headline}`,
              },
              {
                href: "/susi",
                icon: Scale,
                title: "수시 전형 총정리",
                body: "교과·종합·논술 전형의 구조와 지원 전략. 등급만으로 판단하기 전에 전형 구조를 확인하세요.",
              },
            ]}
          />
        </PromoSection>
      )}

      <section className="border-t border-hair bg-paper-100 px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display text-[1.25rem] text-ink-900">다른 대학 입시결과</h2>
            <Link href={`/ipkyul/${f.key}`} className="link-underline inline-flex items-center gap-2 text-[13px] font-medium text-ink-600">
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              {f.label} 전체
            </Link>
          </div>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {siblings.map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/ipkyul/${f.key}/${x.slug}`}
                  className="inline-block border border-hair-strong bg-paper-50 px-4 py-2 text-[13px] font-medium tracking-tight text-ink-700 transition-colors hover:border-jade-600 hover:bg-jade-50 hover:text-jade-700"
                >
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA
        title={`${u.name} ${f.label}, 지금 성적으로 가능한가`}
        body="공시된 등급컷은 출발점일 뿐입니다. 반영 교과와 환산식을 적용한 본인 점수로 따져야 실제 지원 가능 여부가 나옵니다."
        Icon={BarChart3}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />

      <SourceNote
        lines={[
          `${u.name} 모집인원·전형 구조는 2027학년도 수시 모집요강 기준입니다.`,
          "등급컷은 대학이 공시한 최종등록자 성적(50%·70%컷)입니다. 공시가 없는 전형은 빈칸이며 추정치로 채우지 않았습니다.",
          "표의 등급은 대학 자체 반영 기준으로 산출된 값이라, 다른 대학의 등급과 같은 척도가 아닙니다.",
          "충원(추가합격)으로 실제 합격선은 표의 값보다 내려갈 수 있습니다.",
          "최종 확인은 대학 입학처 공지를 따르십시오.",
        ]}
      />
    </>
  );
}
