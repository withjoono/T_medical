import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Brain,
  CalendarDays,
  Image as ImageIcon,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  Scale,
  ScrollText,
  Stethoscope,
  Compass,
  Building2,
} from "lucide-react";
import {
  FinalCTA,
  LinkCards,
  NoteBox,
  PromoHero,
  PromoSection,
  SourceNote,
} from "../_site/components";
import { CrossFieldLinks, FieldClassLine, FieldPeerFacts } from "./_crossfield";
import { teachersForField, type FieldTeacherKey } from "@/lib/teachers";
import { crossFieldLinks, fieldPeerContext } from "@/lib/field-crosslinks";
import { gachonGichulFor } from "@/lib/gachon-gichul";
import { GachonGichul } from "./_gichul";
import {
  FieldAxisPair,
  FieldCountdown,
  FieldFormatDrills,
  FieldSiblings,
  FieldTrackTables,
} from "./_field-univ";
import { fieldEarliest, type FieldUniv } from "@/lib/field-interview";
import {
  siblingsOfStyle,
  styleGroupMeta,
  type FieldPage,
} from "@/lib/field-registry";
import { admissionHrefOf } from "@/lib/field-admission";
import { BUNDLE, classPlanFor, formatKo, minutesLabel } from "@/lib/mmi-schedule";
import { JsonLdAll } from "@/components/json-ld";
import { abs, article, breadcrumb, course } from "@/lib/jsonld";

/** =========================================================================
 *  계열 × 대학 상세 페이지의 공용 본문.
 *
 *  왜 대학 단위인가 — 검색어는 "연대치대면접" 처럼 대학 이름으로 들어온다.
 *  유형 일반론(제시문이란 무엇인가)을 찾는 사람은 없다. 그래서 유형 페이지는
 *  의예과용으로 두고, 계열은 허브(유형 분리) → 대학 페이지(요강 전부) 로 보낸다.
 *
 *  ⚠️ 여기에 요강에 없는 값을 쓰지 말 것. 평가 배점이 공개되지 않은 대학은
 *     '요강 미기재' 로 보여 주는 것이 맞다. 추정값은 이 사이트의 신뢰를 깎는다.
 *  ========================================================================= */

/** 대학별 면접 요약 카드 이미지. 네이버가 이미지 중심으로 노출하기 때문에
 *  OG 이미지로만 두지 않고 본문에도 실제로 띄운다(검색 색인 대상이 된다).
 *  이미지는 scripts/interview-og 로 생성해 public/og/interview 에 커밋돼 있다. */
export function fieldUnivCard(field: FieldPage, u: FieldUniv) {
  const src = `/og/interview/${field.key}/${u.slug}.png`;
  const first = fieldEarliest(u);
  const bits = [
    u.styleLabel,
    u.style === "none"
      ? "면접 미실시"
      : first
        ? `면접일 ${formatKo(first)}`
        : "면접일 미공지",
    u.source ? `질문 출처 ${u.source.label}` : "",
    u.scoring ? `평가 배점 ${u.scoring.label}` : "",
  ].filter(Boolean);
  const alt = `${u.short} ${field.unitLabel} 2027학년도 면접 요약 — ${bits.join(", ")}`;
  return { src, alt, bits };
}

export function fieldUnivMetadata(field: FieldPage, u: FieldUniv): Metadata {
  const url = `${field.base}/${u.slug}`;
  const iv = u.tracks.filter((t) => t.interview);
  const first = fieldEarliest(u);
  const noInterview = u.style === "none";

  const title = noInterview
    ? `${u.short} ${field.short} 2027 수시 — 면접 미실시 | T Medi`
    : `${u.short} ${field.short} 면접 2027 — 방식·일정·전형 | T Medi`;

  const description = [
    `${u.name} 2027학년도 수시 면접 안내.`,
    noInterview ? "요강 기준 면접 미실시." : `면접 실시 ${iv.length}개 전형.`,
    u.source ? `질문 출처 ${u.source.label}.` : "",
    u.scoring ? `평가 배점 ${u.scoring.label}.` : "",
    first ? `가장 이른 면접일 ${formatKo(first)}.` : "",
    "전형별 반영비율·수능최저·1단계 발표일까지 요강 기준으로 정리했습니다.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    alternates: { canonical: url },
    title,
    description,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "T메디",
      locale: "ko_KR",
      images: [
        {
          url: abs(fieldUnivCard(field, u).src),
          width: 1200,
          height: 630,
          alt: fieldUnivCard(field, u).alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [abs(fieldUnivCard(field, u).src)],
    },
  };
}

export function FieldUnivPage({ field, univ: u }: { field: FieldPage; univ: FieldUniv }) {
  const meta = styleGroupMeta(field, u.style);
  const iv = u.tracks.filter((t) => t.interview);
  const first = fieldEarliest(u);
  const siblings = siblingsOfStyle(field, u.slug);
  // 면접 미실시 대학은 문구가 통째로 달라진다 — '이 대학의 질문 출처에 맞춰' 같은
  // 문장을 그대로 두면 없는 시험을 파는 페이지가 된다.
  const none = u.style === "none";
  /** 같은 대학의 전형 소개 페이지(/univ/<계열>/<대학>) — 입결 DB 에 없는 대학이면 undefined */
  const admissionHref = admissionHrefOf(field, u);
  const card = fieldUnivCard(field, u);
  const title = fieldUnivMetadata(field, u).title as string;
  const description = fieldUnivMetadata(field, u).description as string;
  const unit = `${u.short} ${field.unitLabel}`;
  const gichul = gachonGichulFor(field.key, u.slug);
  /** 수업 조건 — 가천대는 AI 없이 1회 2시간 30분(lib/mmi-schedule.ts CLASS_PLAN_OVERRIDES) */
  const plan = classPlanFor(`${field.base}/${u.slug}`);
  const peer = fieldPeerContext(field, u);
  const cross = crossFieldLinks(u.short, field.key);
  // 담당 선생님은 lib/teachers.ts 한 곳이 정한다 — 계열 전담이 등록되면 자동 반영
  const teachers = teachersForField(field.key as FieldTeacherKey, u.style);
  // 띠 문구에 이 대학에만 성립하는 조각을 붙인다(50개 띠가 같은 문장이 되지 않게)
  const classContext = [
    first ? `면접 ${formatKo(first)}` : null,
    u.scoring && u.scoring.label !== "요강 미기재" ? u.scoring.label : u.styleLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "의약학 면접", path: "/interview" },
            { name: field.label, path: field.base },
            { name: `${u.short} ${field.unitLabel}`, path: `${field.base}/${u.slug}` },
          ]),
          article({ path: `${field.base}/${u.slug}`, headline: title, description }),
          // 가격은 본문 띠에 실제로 보이므로 마크업한다(안 보이는 것을 넣지 않는 규칙).
          // 본문 글자를 늘리지 않고 검색엔진에만 가격을 전달하는 자리다.
          ...(none
            ? []
            : [
                course({
                  path: `${field.base}/${u.slug}`,
                  name: `${unit} 면접 1:1 수업`,
                  description: `${u.name} 면접에 맞춘 줌 1:1 수업. ${
                    classContext || u.styleLabel
                  }. ${
                    plan.withAi
                      ? "반복은 AI 모의면접이 맡고 선생님 수업은 2회로 끝납니다."
                      : `AI 모의면접 없이 선생님 1:1 수업, 1회 ${minutesLabel(plan.minutes)}.`
                  }`,
                  price: plan.price,
                  bundlePrice: plan.withAi ? BUNDLE.price : undefined,
                  minutes: plan.minutes,
                }),
              ]),
        ]}
      />

      <PromoHero
        badge={`${field.label} · ${u.zone} · ${meta.label}`}
        title={`${u.short} ${field.unitLabel}`}
        highlight={u.headline}
        body={
          none
            ? `${u.name} 는 2027학년도 요강 기준으로 면접을 실시하지 않습니다. 면접 대신 무엇을 준비할지 정리했고, 전형별 모집인원·수능 최저는 전형 안내 페이지에 있습니다.`
            : `${u.name} 의 2027학년도 수시 모집요강에서 면접에 관한 문장만 그대로 옮겼습니다. 면접 전형의 반영비율과 1단계 발표일·면접일이 함께 있습니다.`
        }
        primaryHref="#contact"
        primaryLabel={none ? `${field.short} 면접 수업 문의` : `${u.short} 면접 수업 문의`}
        secondaryHref={admissionHref ?? field.base}
        secondaryLabel={admissionHref ? "전형 안내 보기" : `${field.short} 면접 전체 보기`}
        Icon={Stethoscope}
        stats={[
          { icon: ClipboardCheck, label: u.styleLabel },
          {
            icon: CalendarDays,
            label: first ? `면접 ${formatKo(first)}` : u.style === "none" ? "면접 미실시" : "면접일 미공지",
          },
          { icon: GraduationCap, label: `면접 전형 ${iv.length}개` },
        ]}
      />

      <PromoSection
        eyebrow="SUMMARY"
        EyebrowIcon={ImageIcon}
        title={`${u.short} ${field.unitLabel} 면접 한 장 요약`}
      >
        <figure className="mx-auto max-w-4xl">
          {/* next/image 를 쓰지 않는다 — output:'export' 에서 굳이 거칠 이유가 없고,
              네이버 이미지 검색은 평범한 <img> 의 alt·주변 텍스트를 읽는다. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.src}
            alt={card.alt}
            width={1200}
            height={630}
            className="w-full border border-hair-strong"
          />
          <figcaption className="mt-4 text-center text-[12px] font-light leading-relaxed text-ink-400">
            {u.name} · {card.bits.join(" · ")}
          </figcaption>
        </figure>
      </PromoSection>

      {(u.source || u.scoring) && (
        <PromoSection
          eyebrow="TWO AXES"
          EyebrowIcon={Scale}
          title={`${unit} 면접은 무엇으로 갈리나`}
        >
          <FieldAxisPair univ={u} />
        </PromoSection>
      )}

      <PromoSection
        eyebrow="FORMAT"
        EyebrowIcon={ScrollText}
        title={none ? `${unit} — 요강 문장과 확인할 것` : `${unit} — 요강 문장과 훈련 과제`}
        tone="muted"
      >
        <FieldFormatDrills univ={u} />
      </PromoSection>

      <PromoSection
        eyebrow="TRACKS"
        EyebrowIcon={GraduationCap}
        title={none ? "면접을 보는 전형이 없습니다" : "면접 전형의 반영비율과 일정"}
        subtitle={none ? undefined : `${unit}에서 면접을 보는 전형 ${iv.length}개입니다.`}
      >
        <FieldTrackTables univ={u} admissionHref={admissionHref} />
      </PromoSection>

      {iv.length > 0 && (
        <PromoSection
          eyebrow="TIMELINE"
          EyebrowIcon={CalendarDays}
          title={`${unit} 면접, 언제 시작해야 하나`}
          tone="muted"
        >
          <FieldCountdown univ={u} />
        </PromoSection>
      )}

      {u.notes && u.notes.length > 0 && (
        <PromoSection eyebrow="CAUTION" EyebrowIcon={Brain} title="이 대학에서 먼저 확인할 것">
          <NoteBox
            title={`${u.short} 지원자가 놓치기 쉬운 것`}
            items={u.notes}
            tone="warn"
            Icon={Brain}
          />
        </PromoSection>
      )}

      {/* 공개 기출 분석 — 지금은 가천대만. 의대·약대·한의대가 겹치지 않게 나눠 싣는다 */}
      {gichul && <GachonGichul page={gichul} />}

      <PromoSection
        eyebrow="IN CONTEXT"
        EyebrowIcon={Compass}
        title={`${field.short} ${field.univs.length}곳 안에서 본 ${u.short}`}
        tone={iv.length > 0 ? undefined : "muted"}
      >
        <FieldPeerFacts field={field} ctx={peer} />
      </PromoSection>

      {cross.length > 0 && (
        <PromoSection
          eyebrow="SAME UNIVERSITY"
          EyebrowIcon={Building2}
          title={`${u.short}의 다른 계열 면접`}
          subtitle={`같은 ${u.short}라도 모집단위마다 면접 방식과 날짜가 다릅니다.`}
          tone="muted"
        >
          <CrossFieldLinks links={cross} mine={first} univShort={u.short} />
        </PromoSection>
      )}

      <FieldClassLine
        plan={plan}
        subject={none ? field.label : `${unit} 면접`}
        teachers={teachers}
        context={none ? undefined : classContext}
      />

      {siblings.length > 0 && (
        <PromoSection
          eyebrow="SAME TYPE"
          EyebrowIcon={MessagesSquare}
          title={`${meta.label} — 다른 ${field.short}`}
        >
          <FieldSiblings field={field} univs={siblings} label={meta.label} />
        </PromoSection>
      )}

      <PromoSection eyebrow="MORE" EyebrowIcon={ClipboardCheck} title="함께 보기">
        <LinkCards
          columns={2}
          items={[
            {
              href: field.base,
              icon: MessagesSquare,
              title: `${field.label} 전체`,
              body: `${field.short} ${field.univs.length}곳의 면접일·방식을 면접일 순으로.`,
            },
            admissionHref
              ? {
                  href: admissionHref,
                  icon: GraduationCap,
                  title: `${u.short} ${field.unitLabel} 전형 안내`,
                  body: `${unit}의 전형별 모집인원·수능최저와 공시 입결.`,
                }
              : {
                  href: field.ipkyul,
                  icon: GraduationCap,
                  title: `${field.unitLabel} 입시결과`,
                  body: "대학·전형별 모집인원과 공시된 입결.",
                },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          `${u.name} 2027학년도 수시 모집요강 기준(2026년 9월 확인). 요강에 없는 값은 '요강 미기재' 로 두었고 다른 모집단위 자료로 추정하지 않았습니다. 최종 확인은 입학처 공지를 따르십시오.`,
        ]}
      />

      <FinalCTA
        title={
          none
            ? `${u.short} ${field.unitLabel} 는 면접이 없습니다`
            : `${u.short} ${field.unitLabel} 면접에 맞춰 준비합니다`
        }
        body={
          none
            ? `${unit}는 학생부와 수능 최저가 전부입니다. 면접을 보는 ${field.short}와 함께 지원한다면 그 대학 기준으로 준비를 설계합니다.`
            : `${unit}의 ${u.source ? `질문 출처(${u.source.label})` : "질문 출처"}와 ${u.scoring ? `평가 배점(${u.scoring.label})` : "평가 배점"}에 맞춰 과제와 모의면접을 설계합니다.`
        }
        Icon={Stethoscope}
        primaryHref="#contact"
        primaryLabel={none ? `${field.short} 면접 수업 문의하기` : `${u.short} 면접 수업 문의하기`}
      />
    </>
  );
}

/** 라우트 파일에서 쓰는 공용 조회 — 없는 slug 는 404. */
export function requireUniv(field: FieldPage, slug: string): FieldUniv {
  const u = field.univs.find((x) => x.slug === slug);
  if (!u) notFound();
  return u;
}
