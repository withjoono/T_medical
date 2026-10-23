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
  Users,
} from "lucide-react";
import {
  FinalCTA,
  LinkCards,
  NoteBox,
  PromoHero,
  PromoSection,
  SourceNote,
} from "../_site/components";
import { ClassCtaBand } from "./_interview";
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
import { SESSION_HOURS_LABEL } from "@/lib/interview-types";
import { admissionHrefOf } from "@/lib/field-admission";
import { formatKo, UNIV_TEACHERS } from "@/lib/mmi-schedule";
import { TeacherCards } from "../univ/_booking";
import { JsonLdAll } from "@/components/json-ld";
import { abs, article, breadcrumb } from "@/lib/jsonld";

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
        ]}
      />

      <PromoHero
        badge={`${field.label} · ${u.zone} · ${meta.label}`}
        title={`${u.short} ${field.unitLabel}`}
        highlight={u.headline}
        body={
          none
            ? `${u.name} 는 2027학년도 요강 기준으로 면접을 실시하지 않습니다. 대신 지원 가능한 전형과 선발 방법, 수능 최저를 요강에서 그대로 옮겼습니다.`
            : `${u.name} 의 2027학년도 수시 모집요강에서 면접에 관한 문장만 그대로 옮겼습니다. 전형별 반영비율과 1단계 발표일·면접일이 함께 있습니다.`
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
        subtitle="저장하거나 공유해서 쓰십시오. 요강에서 확인된 값만 담았습니다."
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
          title="이 면접은 무엇으로 갈리나"
          subtitle="질문 출처와 평가 배점은 서로 다른 축입니다. 둘을 따로 확인해야 준비물이 정해집니다."
        >
          <FieldAxisPair univ={u} />
        </PromoSection>
      )}

      <PromoSection
        eyebrow="FORMAT"
        EyebrowIcon={ScrollText}
        title={none ? "요강에 적힌 것과, 그래서 확인할 것" : "요강에 적힌 것과, 그래서 훈련할 것"}
        subtitle="왼쪽은 요강 문장입니다. 오른쪽은 그 문장에서 바로 나오는 준비 과제입니다."
        tone="muted"
      >
        <FieldFormatDrills univ={u} />
      </PromoSection>

      <PromoSection
        eyebrow="TRACKS"
        EyebrowIcon={GraduationCap}
        title="전형별 반영비율과 일정"
        subtitle="같은 대학 안에서도 전형에 따라 면접 유무가 갈립니다. 지원 전형을 먼저 확정해야 준비가 헛돌지 않습니다."
      >
        <FieldTrackTables univ={u} />
      </PromoSection>

      {iv.length > 0 && (
        <PromoSection
          eyebrow="TIMELINE"
          EyebrowIcon={CalendarDays}
          title="언제 시작해야 하나"
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

      {!none && (
        <PromoSection
          eyebrow="INSTRUCTOR"
          EyebrowIcon={Users}
          title="담당 강사"
          subtitle={
            u.style === "jesimun"
              ? `${u.short} ${field.unitLabel} 면접은 제시문 면접이라 박은우 선생님이 맡습니다.`
              : `${u.short} ${field.unitLabel} 면접은 제시문이 없는 면접이라 이세인 선생님이 맡습니다.`
          }
          tone="muted"
        >
          <TeacherCards
            teachers={[u.style === "jesimun" ? UNIV_TEACHERS.jesimun : UNIV_TEACHERS.general]}
          />
        </PromoSection>
      )}

      <ClassCtaBand typeName={none ? field.label : `${u.short} ${field.unitLabel} 면접`} />

      {siblings.length > 0 && (
        <PromoSection
          eyebrow="SAME TYPE"
          EyebrowIcon={MessagesSquare}
          title="같은 유형의 다른 대학"
          subtitle={`${meta.label} 묶음에 함께 있는 대학입니다. 복수 지원이라면 면접일이 겹치는지 먼저 확인하세요.`}
          tone="muted"
        >
          <FieldSiblings field={field} univs={siblings} label={meta.label} />
        </PromoSection>
      )}

      <PromoSection eyebrow="MORE" EyebrowIcon={ClipboardCheck} title="함께 보기">
        <LinkCards
          columns={3}
          items={[
            {
              href: field.base,
              icon: MessagesSquare,
              title: `${field.label} 전체`,
              body: `유형별로 나눈 ${field.short} 면접 실시 대학과 일정을 한 페이지에.`,
            },
            admissionHref
              ? {
                  href: admissionHref,
                  icon: GraduationCap,
                  title: `${u.short} ${field.unitLabel} 전형 안내`,
                  body: "전형별 모집인원·수능최저·선발모형과 공시 입결.",
                }
              : {
                  href: field.ipkyul,
                  icon: GraduationCap,
                  title: `${field.unitLabel} 입시결과`,
                  body: "대학·전형별 모집인원과 공시된 입결.",
                },
            {
              href: "/interview",
              icon: ClipboardCheck,
              title: "면접 수업 절차",
              body: `1회 ${SESSION_HOURS_LABEL} 줌 1:1 수업의 진행 방식과 포함 사항.`,
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          `면접 방식·반영비율·일정은 ${u.name} 2027학년도 수시 모집요강에서 정리했습니다(2026년 9월 확인). 대학 사정으로 변경될 수 있으므로 최종 확인은 해당 입학처 공지를 따르십시오.`,
          "요강에 적힌 문장만 옮겼습니다. 같은 대학의 다른 모집단위(의예과 등) 자료로 이 모집단위를 추정하지 않았습니다.",
          "평가 배점이 '요강 미기재' 로 표시된 항목은 요강에 공개되지 않은 것입니다. 없는 값을 추정해 넣지 않았습니다.",
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
            ? `이 모집단위는 제출 시점의 학생부와 수능 최저가 전부입니다. 면접을 보는 ${field.short}와 함께 지원한다면, 그 대학의 평가 축에 맞춰 준비를 설계해 드립니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`
            : `이 대학의 질문 출처와 평가 배점에 맞춰 과제와 모의면접을 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`
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
