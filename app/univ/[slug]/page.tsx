import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  Scale,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  LinkCards,
  FinalCTA,
  SourceNote,
} from "../../_site/components";
import { AdmissionTables, UnivStatRow, UnverifiedNotice } from "../_univ";
import { UNIV_PAGES, getUnivPage, quotaByType } from "@/lib/univ";
import { formatKo } from "@/lib/mmi-schedule";

/** =========================================================================
 *  /univ/[slug] — 대학별 의대 **전형 소개** 페이지
 *
 *  2026-10-23 면접을 /interview/uidae/[slug] 로 분리했다. 이 페이지는 전형 구조만 다룬다.
 *  면접 내용(방식·대비 포인트·강사·수업 예약)을 여기에 다시 붙이지 말 것 — 면접 페이지로 링크한다.
 *  ========================================================================= */

/** 정적 export(output: 'export')라 동적 라우트에는 generateStaticParams 가 필수다. */
export function generateStaticParams() {
  return UNIV_PAGES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = getUnivPage(slug);
  if (!u) return { title: "대학별 의대 전형 안내 | T Medi" };

  const groups = quotaByType(u);
  const noInterview = u.hasInterview === false;
  const tracks = u.interview?.tracks ?? [];

  const sentences = [
    `${u.name} 2027학년도 수시 전형 안내.`,
    u.admission ? `수시 ${u.admission.units.length}개 전형 ${u.admission.quota}명.` : "",
    groups.length > 0 ? `${groups.map((g) => `${g.type} ${g.quota}명`).join(", ")}.` : "",
    noInterview ? "2027학년도 면접 미실시." : tracks.length > 0 ? `면접 실시 ${tracks.length}개 전형.` : "",
    "전형별 모집인원·수능최저·선발모형을 한 표에서 비교할 수 있습니다.",
  ].filter(Boolean);
  const description = sentences.join(" ");

  const title = `${u.short} 의대 수시 전형 2027 — 모집인원·수능최저 | T Medi`;
  const url = `/univ/${u.slug}`;

  return {
    alternates: { canonical: url },
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "T메디",
      locale: "ko_KR",
      title,
      description,
      url,
      images: ["/og-image.png?v=2"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png?v=2"],
    },
  };
}

export default async function UnivPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const u = getUnivPage(slug);
  if (!u) notFound();

  const iv = u.interview;
  const tracks = iv?.tracks ?? [];
  const groups = quotaByType(u);
  const noInterview = u.hasInterview === false;
  const unverified = u.confidence === "low";
  const interviewHref = `/interview/uidae/${u.slug}`;

  const interviewDays = [
    ...new Set(tracks.map((t) => t.interview).filter((d): d is string => Boolean(d))),
  ].sort();

  const stats = [
    u.admission
      ? { label: "수시 모집", value: String(u.admission.quota), unit: "명", sub: `${u.admission.units.length}개 전형` }
      : { label: "수시 모집", value: "—", sub: "전형 데이터 준비 중" },
    groups.length > 0
      ? {
          label: "전형 구성",
          value: String(groups.length),
          unit: "종",
          sub: groups.map((g) => `${g.type} ${g.quota}`).join(" · "),
        }
      : { label: "전형 구성", value: "—", sub: "—" },
    noInterview
      ? { label: "면접", value: "없음", sub: "2027학년도 전 전형 미실시" }
      : { label: "면접 실시", value: String(tracks.length), unit: "개 전형", sub: iv?.styleLabel ?? "확인 필요" },
    interviewDays.length > 0
      ? { label: "면접일", value: formatKo(interviewDays[0]).replace(/\(.\)$/, ""), sub: interviewDays.length > 1 ? `외 ${interviewDays.length - 1}일` : "단일 일정" }
      : { label: "면접일", value: "—", sub: noInterview ? "면접 없음" : "미공지" },
  ];

  return (
    <>
      <PromoHero
        badge={`2027 ${u.short} 의예과 · ${u.region}`}
        title={`${u.short} 의예과,`}
        highlight="수시 전형부터 확인하세요"
        body={`${u.name}의 2027학년도 수시 전형 구조를 정리했습니다. 전형별 모집인원과 수능 최저, 선발 모형을 한 표에서 비교하실 수 있습니다.`}
        primaryHref="#contact"
        primaryLabel={`${u.short} 지원 상담하기`}
        secondaryHref={interviewHref}
        secondaryLabel={noInterview ? "면접 미실시 안내" : "면접 안내 보기"}
        Icon={GraduationCap}
        stats={[
          { icon: Scale, label: u.admission ? `수시 ${u.admission.quota}명` : "전형 준비 중" },
          { icon: ClipboardCheck, label: u.admission ? `${u.admission.units.length}개 전형` : "—" },
          { icon: MessagesSquare, label: noInterview ? "면접 미실시" : `면접 ${tracks.length}개 전형` },
        ]}
      />

      <UnivStatRow
        items={stats}
        caption="2027학년도 수시 모집요강 및 T스쿨 수시 DB 기준. 최종 수치는 각 대학 모집요강에서 확정됩니다."
      />

      {/* ===== 면접 배너 — 면접 페이지(/interview/uidae/[slug])로 보내는 주 진입로 ===== */}
      <section className="border-y border-ink bg-ink px-6 py-10 text-paper sm:px-12">
        <Link
          href={interviewHref}
          className="group mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 bg-white/5">
              <MessagesSquare className="h-5 w-5 text-brass-300" strokeWidth={1.75} />
            </span>
            <div>
              <p className="eyebrow text-brass-300">
                {noInterview ? "INTERVIEW · 미실시" : `INTERVIEW · ${tracks.length}개 전형`}
              </p>
              <h2 className="display mt-2 text-[1.375rem] leading-snug text-paper sm:text-[1.625rem]">
                {noInterview ? `${u.short} 의대는 올해 면접이 없습니다` : `${u.short} 의대 면접, 따로 준비하셔야 합니다`}
              </h2>
              <p className="mt-2 text-[14px] font-light leading-[1.8] text-paper/70">
                {noInterview
                  ? "면접 대신 무엇을 채울지 면접 페이지에 정리했습니다."
                  : `${iv?.styleLabel ?? "면접 방식"}${
                      interviewDays.length > 0 ? ` · 첫 면접 ${formatKo(interviewDays[0])}` : ""
                    } — 방식·대비 포인트·1:1 수업 일정까지 한 페이지에.`}
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 bg-paper px-7 py-4 text-[15px] font-semibold text-ink transition-colors group-hover:bg-brass-200">
            {noInterview ? "면접 미실시 안내" : `${u.short} 면접 보러 가기`}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
          </span>
        </Link>
      </section>

      {unverified && (
        <PromoSection>
          <UnverifiedNotice univ={u} />
        </PromoSection>
      )}

      {/* ===== 1. 전형 안내 ===== */}
      <PromoSection
        eyebrow="ADMISSION"
        EyebrowIcon={ClipboardCheck}
        title="전형 안내"
        subtitle={
          u.admission
            ? `${u.short} 의예과가 2027학년도 수시에서 뽑는 ${u.admission.units.length}개 전형입니다. 유형별로 끊어 정리했습니다.`
            : "전형 데이터를 준비 중입니다."
        }
      >
        <AdmissionTables univ={u} />
        {u.admission && (
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs font-light leading-[1.9] text-ink-400">
            수능최저가 &lsquo;공시 없음&rsquo;인 전형은 최저가 없다는 뜻이 아니라, 저희 데이터에 값이
            수집되지 않았다는 뜻입니다. 추정으로 채우지 않습니다 — 해당 전형은 모집요강에서 직접 확인하세요.
          </p>
        )}
      </PromoSection>

      {/* ===== 2. 면접 — 요약만, 본문은 면접 페이지 ===== */}
      <PromoSection
        eyebrow="INTERVIEW"
        EyebrowIcon={MessagesSquare}
        title={noInterview ? "면접을 실시하지 않습니다" : "면접은 따로 정리했습니다"}
        tone="muted"
      >
        <div className="mx-auto max-w-3xl border border-hair-strong bg-paper-50 p-8 text-center">
          <p className="text-[14px] font-light leading-[1.85] text-ink-600">
            {noInterview
              ? `${u.short} 의예과는 2027학년도 수시 전 전형에서 면접을 실시하지 않습니다. 면접 대신 무엇을 준비할지 면접 페이지에 정리했습니다.`
              : `${u.short} 의예과는 ${tracks.length}개 전형에서 면접을 봅니다${
                  iv?.styleLabel ? ` — ${iv.styleLabel}` : ""
                }${interviewDays.length > 0 ? `, 첫 면접일 ${formatKo(interviewDays[0])}` : ""}. 면접 방식·대비 포인트·수업 일정은 면접 페이지에서 확인하세요.`}
          </p>
          <Link
            href={interviewHref}
            className="mt-6 inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-800"
          >
            {u.short} 의대 면접 보기
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={BarChart3} title="이어서 보기">
        <LinkCards
          items={[
            ...(u.admission
              ? [
                  {
                    href: `/ipkyul/uiye/${u.slug}`,
                    icon: BarChart3,
                    title: `${u.short} 입시결과`,
                    body: "전형별 최종등록자 등급컷(50%·70%)을 공시된 값만 정리했습니다. 5등급 환산값도 함께 봅니다.",
                  },
                ]
              : []),
            {
              href: "/univ",
              icon: GraduationCap,
              title: "다른 의대 보기",
              body: "권역별로 전국 의대를 모아 두었습니다. 전형 구조를 나란히 비교하세요.",
            },
            {
              href: "/susi",
              icon: ClipboardCheck,
              title: "수시 전형 총정리",
              body: "교과·종합·논술 세 전형의 구조와 지역 선발을 한눈에 정리했습니다.",
            },
          ]}
          columns={3}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "전형 데이터는 T스쿨 수시 DB(2027학년도 기준)에서 정리했습니다.",
          "모집인원·수능최저는 대학 사정에 따라 변경될 수 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
          ...(unverified
            ? ["⚠️ 이 대학은 입학처 요강 원문을 확인하지 못했습니다. 페이지의 수치를 그대로 신뢰하지 마세요."]
            : []),
        ]}
      />

      <FinalCTA
        title={`${u.short} 지원, 가능한 전형부터 추려 드립니다`}
        body="내신·모의고사·생기부를 이 대학 전형 구조에 대입하면 어느 전형이 현실적인지 분명해집니다."
        Icon={GraduationCap}
        primaryHref="#contact"
        primaryLabel={`${u.short} 상담하기`}
      />

      <div className="border-t border-hair bg-paper px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/univ"
            className="inline-flex items-center gap-2 text-sm font-light text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            대학별 안내 전체 보기
          </Link>
        </div>
      </div>
    </>
  );
}
