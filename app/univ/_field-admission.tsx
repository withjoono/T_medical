import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  GraduationCap,
  Image as ImageIcon,
  MessagesSquare,
  Scale,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  LinkCards,
  FinalCTA,
  SourceNote,
} from "../_site/components";
import { UnivStatRow } from "./_univ";
import { ProgramTables, MeasuredOnlyNote } from "../ipkyul/_ipkyul";
import { byType } from "@/lib/ipkyul";
import { FIELD_PAGES, type FieldPageKey } from "@/lib/field-registry";
import { fieldEarliest } from "@/lib/field-interview";
import {
  admissionBase,
  admissionUnivs,
  getAdmissionUniv,
  interviewOf,
  IPKYUL_KEY,
  ipkyulField,
} from "@/lib/field-admission";
import { formatKo } from "@/lib/mmi-schedule";

/** =========================================================================
 *  /univ/{chidae,hanuidae,yakdae,suuidae}/[slug] — 치·한·약·수 대학별 **전형 소개** 공용 본문.
 *  2026-10-23 신설. 의대(/univ/[slug])와 같은 구조: 전형 → 면접은 배너로 면접 페이지에 넘긴다.
 *  면접 본문(방식·대비 포인트·강사)을 여기에 다시 싣지 말 것.
 *  전형표는 /ipkyul 의 ProgramTables 를 그대로 쓴다(실측 입결만, 5등급 환산 포함).
 *  ========================================================================= */

export function fieldAdmissionParams(fp: FieldPageKey) {
  return admissionUnivs(fp).map((u) => ({ slug: u.slug }));
}

export function fieldAdmissionMetadata(fp: FieldPageKey, slug: string): Metadata {
  const field = FIELD_PAGES[fp];
  const u = getAdmissionUniv(fp, slug);
  if (!u) return { title: `대학별 ${field.short} 전형 안내 | T Medi` };
  const iv = interviewOf(fp, u);
  const groups = byType(u.units);
  const title = `${u.name} ${field.short} 수시 전형 2027 — 모집인원·수능최저 | T Medi`;
  const description = [
    `${u.name} ${field.unitLabel} 2027학년도 수시 전형 안내.`,
    `수시 ${u.units.length}개 전형 ${u.quota}명 (${groups.map((g) => `${g.type} ${g.units.reduce((a, x) => a + (x.quota || 0), 0)}명`).join(", ")}).`,
    iv ? (iv.style === "none" ? "2027학년도 면접 미실시." : `면접 실시 ${iv.tracks.filter((t) => t.interview).length}개 전형.`) : "",
    "전형별 모집인원·수능최저·선발모형과 공시 입결을 한 표에서 비교할 수 있습니다.",
  ]
    .filter(Boolean)
    .join(" ");
  const url = `${admissionBase(fp)}/${u.slug}`;
  // 전형안내 카드 — scripts/interview-og/ipkyul-cards.mjs 가 굽는다. 면접 카드와 숫자가
  // 겹치지 않아야 네이버 이미지 검색에서 중복으로 접히지 않는다.
  const cardUrl = `https://tmedi.kr/og/ipkyul/${IPKYUL_KEY[fp]}/${u.slug}.png`;
  const cardAlt = `${u.name} ${field.unitLabel} 2027학년도 수시 전형 요약 — 모집 ${u.quota}명, ${u.units.length}개 전형`;
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
      images: [{ url: cardUrl, width: 1200, height: 630, alt: cardAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [cardUrl] },
  };
}

export function FieldAdmissionPage({ fp, slug }: { fp: FieldPageKey; slug: string }) {
  const field = FIELD_PAGES[fp];
  const ipk = ipkyulField(fp);
  const u = getAdmissionUniv(fp, slug);
  if (!u) notFound();

  const iv = interviewOf(fp, u);
  const interviewHref = iv ? `${field.base}/${iv.slug}` : undefined;
  const noInterview = iv?.style === "none";
  const ivTracks = iv ? iv.tracks.filter((t) => t.interview).length : 0;
  const first = iv ? fieldEarliest(iv) : null;
  const groups = byType(u.units);
  const unit = field.unitLabel;

  const stats = [
    { label: "수시 모집", value: String(u.quota), unit: "명", sub: `${u.units.length}개 전형` },
    {
      label: "전형 구성",
      value: String(groups.length),
      unit: "종",
      sub: groups.map((g) => `${g.type} ${g.units.reduce((a, x) => a + (x.quota || 0), 0)}`).join(" · "),
    },
    u.measured > 0
      ? { label: "공시 입결", value: String(u.measured), unit: "개 전형", sub: "실측값만 게시" }
      : { label: "공시 입결", value: "—", sub: "대학 미공개" },
    !iv
      ? { label: "면접", value: "—", sub: "면접 정보 준비 중" }
      : noInterview
        ? { label: "면접", value: "없음", sub: "2027학년도 미실시" }
        : { label: "면접 실시", value: String(ivTracks), unit: "개 전형", sub: first ? `첫 면접 ${formatKo(first)}` : iv.styleLabel },
  ];

  return (
    <>
      <PromoHero
        badge={`2027 ${u.name} ${unit}${u.region ? ` · ${u.region}` : ""}`}
        title={`${u.name} ${unit},`}
        highlight="수시 전형부터 확인하세요"
        body={`${u.name} ${unit}의 2027학년도 수시 전형 구조를 정리했습니다. 전형별 모집인원과 수능 최저, 선발 모형, 공시된 입결을 한 표에서 비교하실 수 있습니다.`}
        primaryHref="#contact"
        primaryLabel={`${u.name} 지원 상담하기`}
        secondaryHref={interviewHref ?? `/ipkyul/${ipk.key}`}
        secondaryLabel={interviewHref ? (noInterview ? "면접 미실시 안내" : "면접 안내 보기") : `${unit} 입시결과 전체`}
        Icon={GraduationCap}
        stats={[
          { icon: Scale, label: `수시 ${u.quota}명` },
          { icon: ClipboardCheck, label: `${u.units.length}개 전형` },
          ...(iv ? [{ icon: MessagesSquare, label: noInterview ? "면접 미실시" : `면접 ${ivTracks}개 전형` }] : []),
        ]}
      />

      <UnivStatRow
        items={stats}
        caption="2027학년도 T스쿨 수시 DB 기준. 최종 수치는 각 대학 모집요강에서 확정됩니다."
      />

      {/* 카드 이미지는 OG 태그로만 두면 이미지 검색에 잡히지 않는다 — 본문에 실제로 띄운다.
          생성기: scripts/interview-og/ipkyul-cards.mjs (네 칸 모두 아래 표에 있는 값이다) */}
      <PromoSection
        eyebrow="SUMMARY"
        EyebrowIcon={ImageIcon}
        title={`${u.name} ${unit} 전형 한 장 요약`}
        subtitle="저장하거나 공유해서 쓰십시오. 요강·공시에서 확인된 값만 담았습니다."
      >
        <figure className="mx-auto max-w-4xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/og/ipkyul/${IPKYUL_KEY[fp]}/${u.slug}.png`}
            alt={`${u.name} ${unit} 2027학년도 수시 전형 요약 — 모집 ${u.quota}명, ${u.units.length}개 전형, ${groups
              .map((g) => `${g.type} ${g.units.length}개`)
              .join(" · ")}`}
            width={1200}
            height={630}
            className="w-full border border-hair-strong"
          />
          <figcaption className="mt-4 text-center text-[12px] font-light leading-relaxed text-ink-400">
            {u.name} {unit} · 2027학년도 수시 전형 · T스쿨 수시 DB 기준
          </figcaption>
        </figure>
      </PromoSection>

      {/* ===== 면접 배너 — 면접 페이지로 보내는 주 진입로 ===== */}
      {iv && interviewHref && (
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
                  {noInterview ? "INTERVIEW · 미실시" : `INTERVIEW · ${ivTracks}개 전형`}
                </p>
                <h2 className="display mt-2 text-[1.375rem] leading-snug text-paper sm:text-[1.625rem]">
                  {noInterview
                    ? `${u.name} ${field.short}는 올해 면접이 없습니다`
                    : `${u.name} ${field.short} 면접, 따로 준비하셔야 합니다`}
                </h2>
                <p className="mt-2 text-[14px] font-light leading-[1.8] text-paper/70">
                  {noInterview
                    ? "면접 대신 무엇을 채울지 면접 페이지에 정리했습니다."
                    : `${iv.styleLabel}${first ? ` · 첫 면접 ${formatKo(first)}` : ""} — 방식·대비 포인트·1:1 수업까지 한 페이지에.`}
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center justify-center gap-2 bg-paper px-7 py-4 text-[15px] font-semibold text-ink transition-colors group-hover:bg-brass-200">
              {noInterview ? "면접 미실시 안내" : `${u.name} 면접 보러 가기`}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </span>
          </Link>
        </section>
      )}

      <PromoSection
        eyebrow="ADMISSION"
        EyebrowIcon={ClipboardCheck}
        title="전형 안내"
        subtitle={`${u.name} ${unit}가 2027학년도 수시에서 뽑는 ${u.units.length}개 전형입니다. 유형별로 끊어 정리했습니다.`}
      >
        <ProgramTables univ={u} />
        <div className="mt-12">
          <MeasuredOnlyNote />
        </div>
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={BarChart3} title="이어서 보기" tone="muted">
        <LinkCards
          columns={3}
          items={[
            ...(interviewHref
              ? [
                  {
                    href: interviewHref,
                    icon: MessagesSquare,
                    title: `${u.name} ${field.short} 면접`,
                    body: noInterview
                      ? "면접이 없는 대학의 준비 순서를 정리했습니다."
                      : "요강의 면접 방식과 일정, 이 대학을 겨냥한 대비 포인트.",
                  },
                ]
              : [
                  {
                    href: field.base,
                    icon: MessagesSquare,
                    title: `${field.label} 전체`,
                    body: `유형별로 나눈 ${field.short} 면접 실시 대학과 일정.`,
                  },
                ]),
            {
              href: `/ipkyul/${ipk.key}`,
              icon: BarChart3,
              title: `${unit} 입시결과 전체`,
              body: "대학별 최우수 50%컷을 한 표에서 비교합니다.",
            },
            {
              href: "/susi",
              icon: ClipboardCheck,
              title: "수시 전형 총정리",
              body: "교과·종합·논술 세 전형의 구조와 지역 선발을 한눈에 정리했습니다.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "전형 데이터는 T스쿨 수시 DB(2027학년도 기준)에서 정리했습니다. 입결은 대학이 공개한 실측값만 싣고, 없는 전형은 비워 둡니다.",
          "모집인원·수능최저는 대학 사정에 따라 변경될 수 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title={`${u.name} ${field.short} 지원, 가능한 전형부터 추려 드립니다`}
        body="내신·모의고사·생기부를 이 대학 전형 구조에 대입하면 어느 전형이 현실적인지 분명해집니다."
        Icon={GraduationCap}
        primaryHref="#contact"
        primaryLabel={`${u.name} 상담하기`}
      />

      <div className="border-t border-hair bg-paper px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/ipkyul/${ipk.key}`}
            className="inline-flex items-center gap-2 text-sm font-light text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            {unit} 대학 전체 보기
          </Link>
        </div>
      </div>
    </>
  );
}
