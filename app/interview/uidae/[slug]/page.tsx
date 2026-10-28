import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Image as ImageIcon,
  Clock,
  ListChecks,
  MessagesSquare,
  Repeat,
  Scale,
  Target,
  Users,
  Building2,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  NoteBox,
  LinkCards,
  FinalCTA,
  SourceNote,
} from "@/app/_site/components";
import {
  InterviewTable,
  FactList,
  UnivStatRow,
  UnverifiedNotice,
  InterviewDates,
} from "@/app/univ/_univ";
import { UNIV_PAGES, getUnivPage, quotaByType } from "@/lib/univ";
import {
  BookingBoard,
  LeakageNotice,
  ScheduleCalendar,
  TeacherCards,
  Timetable,
} from "@/app/univ/_booking";
import { CrossFieldLinks, FieldClassLine } from "../../_crossfield";
import { crossFieldLinks } from "@/lib/field-crosslinks";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb, course } from "@/lib/jsonld";
import {
  BUNDLE,
  formatKo,
  getUniv as getMmiUniv,
  summarize,
  TUITION,
  univDays,
  UNIV_TEACHER_GROUPS,
} from "@/lib/mmi-schedule";
import { teachersForField } from "@/lib/teachers";
import { univTeacherKeys } from "@/lib/interview-types";

/** =========================================================================
 *  /interview/uidae/[slug] — 대학별 의대 **면접** 페이지 (2026-10-23 분리)
 *
 *  전형 소개는 /univ/[slug], 면접·면접 수업·예약은 여기. 두 페이지는 서로 링크한다.
 *  옛 주소 /mmi/:slug · /promo/mmi/:slug 는 firebase.json 301 로 이 페이지에 온다.
 *  데이터는 /univ 와 같은 SSOT(lib/univ, lib/mmi-schedule)를 쓴다.
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
  if (!u) return { title: "대학별 의대 면접 | T Medi" };

  const tracks = u.interview?.tracks ?? [];
  const first = tracks.find((t) => t.interview);
  const noInterview = u.hasInterview === false;

  const sentences = [
    noInterview
      ? `${u.name} 2027학년도 수시는 면접을 실시하지 않습니다. 면접 대신 준비할 것을 정리했습니다.`
      : `${u.name} 2027학년도 수시 면접 안내.`,
    !noInterview && u.interview?.styleLabel ? `${u.interview.styleLabel}.` : "",
    !noInterview && tracks.length > 0 ? `면접 실시 ${tracks.length}개 전형.` : "",
    first?.interview ? `면접 ${formatKo(first.interview)}.` : "",
    noInterview ? "" : "면접 방식·일정과 대학별 대비 포인트, 1:1 면접 수업 일정까지 정리했습니다.",
  ].filter(Boolean);
  const description = sentences.join(" ");

  // 실제 검색어는 "○○대 의대 면접" — 제목 앞머리에 그대로 둔다(2026-10-21 노출 점검).
  const title = noInterview
    ? `${u.short} 의대 면접 2027 — 면접 미실시 | T Medi`
    : `${u.short} 의대 면접 2027 — 방식·일정·대비 | T Medi`;
  const url = `/interview/uidae/${u.slug}`;

  return {
    alternates: { canonical: url },
    title,
    description,
    // openGraph 는 layout 과 얕게 병합된다 — 하위에서 쓰면 통째로 바뀌므로 images 등도 다시 적는다.
    openGraph: {
      type: "website",
      siteName: "T메디",
      locale: "ko_KR",
      title,
      description,
      url,
      images: [
        {
          url: `https://tmedi.kr/og/univ/${u.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${u.short} 의예과 2027학년도 면접 요약 — ${
            noInterview ? "면접 미실시" : u.interview?.styleLabel ?? "면접 실시"
          }`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png?v=2"],
    },
  };
}

export default async function UidaeInterviewUnivPage({
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
  /** 특강 일정·예약 블록은 mmi-schedule SSOT 에 데이터가 있는 대학만 렌더한다. */
  const mmiUniv = u.hasClassPage ? getMmiUniv(u.slug) : undefined;
  const booking = mmiUniv ? summarize(univDays(mmiUniv)) : undefined;
  const unverified = u.confidence === "low";

  const interviewDays = [
    ...new Set(tracks.map((t) => t.interview).filter((d): d is string => Boolean(d))),
  ].sort();
  /** 같은 대학의 치·한·약·수 면접 페이지 — 색인된 의대 면접 페이지에서 건너가는 길 */
  const cross = crossFieldLinks(u.short, "uidae");

  /** 이 대학 면접을 누가 맡는가 — lib/interview-types.ts 가 판단한다 */
  const teacherKeys = univTeacherKeys(u.slug);

  /** 담당 선생님은 lib/teachers.ts 한 곳이 정한다 — 계열 전담이 등록되면 자동 반영.
   *  제시문 면접을 보는 대학은 제시문 전담이 맡는다(univTeacherKeys 가 판단). */
  const classTeachers = noInterview
    ? []
    : (() => {
        const list = (teacherKeys.length > 0 ? teacherKeys : ["uidae"]).flatMap((k) =>
          teachersForField("uidae", k === "jesimun" ? "jesimun" : undefined),
        );
        return list.filter((t, i) => list.findIndex((x) => x.id === t.id) === i);
      })();
  /** 띠 문구에 이 대학에만 성립하는 조각을 붙인다(39개 띠가 같은 문장이 되지 않게) */
  const classContext = [
    interviewDays.length > 0 ? `면접 ${formatKo(interviewDays[0])}` : null,
    iv?.styleLabel ?? null,
  ]
    .filter(Boolean)
    .join(" · ");

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
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "의약학 면접", path: "/interview" },
            { name: "의대 면접", path: "/interview/uidae" },
            { name: `${u.short} 의예과 면접`, path: `/interview/uidae/${u.slug}` },
          ]),
          article({
            path: `/interview/uidae/${u.slug}`,
            headline: `${u.short} 의대 면접 2027 — 방식·일정·대비`,
            description: `${u.name} 2027학년도 수시 면접. ${
              noInterview ? "면접 미실시" : iv?.styleLabel ?? "면접 실시"
            }.`,
          }),
          // 가격은 본문 띠(FieldClassLine)에 실제로 보이므로 마크업한다
          // (안 보이는 것을 넣지 않는 규칙 — lib/jsonld.ts 머리말).
          ...(noInterview
            ? []
            : [
                course({
                  path: `/interview/uidae/${u.slug}`,
                  name: `${u.short} 의예과 면접 1:1 수업`,
                  description: `${u.name} 의대 면접에 맞춘 줌 1:1 수업. ${
                    classContext || iv?.styleLabel || "면접 실시"
                  }. 반복은 AI 모의면접이 맡고 선생님 수업은 2회로 끝납니다.`,
                  price: TUITION.perSession,
                  bundlePrice: BUNDLE.price,
                }),
              ]),
        ]}
      />

      <PromoHero
        badge={`2027 ${u.short} 의예과 면접 · ${u.region}`}
        title={`${u.short} 의대 면접,`}
        highlight={iv?.headline ?? (noInterview ? "올해는 면접이 없습니다" : "방식부터 확인하세요")}
        body={
          iv?.lede ??
          `${u.name}의 2027학년도 수시 면접을 정리했습니다. 면접 방식과 일정, 이 대학을 겨냥한 대비 포인트를 확인하세요.`
        }
        primaryHref="#contact"
        primaryLabel={`${u.short} 면접 수업 문의`}
        secondaryHref={`/univ/${u.slug}`}
        secondaryLabel="전형 안내 보기"
        Icon={MessagesSquare}
        stats={[
          { icon: MessagesSquare, label: noInterview ? "면접 미실시" : `면접 ${tracks.length}개 전형` },
          ...(interviewDays.length > 0 ? [{ icon: CalendarDays, label: `면접 ${formatKo(interviewDays[0])}` }] : []),
          ...(u.hasClassPage ? [{ icon: Users, label: "MMI 특강 개설" }] : []),
        ]}
      />

      <UnivStatRow
        items={stats}
        caption="2027학년도 수시 모집요강 및 T스쿨 수시 DB 기준. 최종 수치는 각 대학 모집요강에서 확정됩니다."
      />

      <PromoSection
        eyebrow="SUMMARY"
        EyebrowIcon={ImageIcon}
        title={`${u.short} 의예과 면접 한 장 요약`}
        subtitle="저장하거나 공유해서 쓰십시오. 요강에서 확인된 값만 담았습니다."
      >
        <figure className="mx-auto max-w-4xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/og/univ/${u.slug}.png`}
            alt={`${u.short} 의예과 2027학년도 면접 요약 — ${
              noInterview ? "면접 미실시" : u.interview?.styleLabel ?? "면접 실시"
            }, 면접 ${tracks.length}개 전형`}
            width={1200}
            height={630}
            className="w-full border border-hair-strong"
          />
          <figcaption className="mt-4 text-center text-[12px] font-light leading-relaxed text-ink-400">
            {u.name} · 2027학년도 수시 모집요강 기준
          </figcaption>
        </figure>
      </PromoSection>

      {unverified && (
        <PromoSection>
          <UnverifiedNotice univ={u} />
        </PromoSection>
      )}

      {/* ===== 2. 면접 안내 ===== */}
      <div id="interview" className="scroll-mt-24" />
      <PromoSection
        eyebrow="INTERVIEW"
        EyebrowIcon={MessagesSquare}
        title={noInterview ? "면접을 실시하지 않습니다" : "면접 안내"}
        subtitle={
          noInterview
            ? `${u.short} 의예과는 2027학년도 수시 전 전형에서 면접을 실시하지 않습니다. 준비의 무게중심이 달라집니다.`
            : iv
              ? `${iv.styleLabel} — 요강에서 확인된 사실만 옮겼습니다.`
              : "면접 정보를 준비 중입니다."
        }
        tone="muted"
      >
        {iv ? (
          <div className="space-y-12">
            <FactList items={iv.format} />
            {tracks.length > 0 && (
              <>
                <InterviewDates univ={u} />
                <InterviewTable univ={u} />
              </>
            )}
            {iv.notes && iv.notes.length > 0 && (
              <NoteBox
                title="이 대학에서 특히 헷갈리는 지점"
                tone="warn"
                Icon={ListChecks}
                items={iv.notes}
              />
            )}
          </div>
        ) : (
          <p className="mx-auto max-w-2xl text-center text-sm font-light leading-[1.9] text-ink-500">
            이 대학의 면접 정보는 아직 정리되지 않았습니다. 상담으로 문의해 주세요.
          </p>
        )}
      </PromoSection>

      {/* ===== 3. 면접 수업 안내 ===== */}
      <PromoSection
        eyebrow="CLASS"
        EyebrowIcon={Target}
        title={noInterview ? `${u.short} 지원자는 무엇을 준비하나` : `${u.short} 대비 훈련 포인트`}
        subtitle={
          noInterview
            ? "면접이 없는 대학은 준비 시간을 다른 곳에 씁니다. 그 방향을 정리했습니다."
            : "대학마다 묻는 방식이 다릅니다. 이 대학을 겨냥한 훈련만 적었습니다."
        }
      >
        {iv ? (
          <div className="space-y-12">
            <FactList items={iv.drills} />

            {u.hasClassPage && mmiUniv ? (
              <div className="mx-auto max-w-3xl border border-hair-strong bg-paper-50 p-8 text-center">
                <p className="eyebrow text-brass-600">대학별 1:1 특강</p>
                <h3 className="display mt-4 text-[1.375rem] leading-snug text-ink-900">
                  {u.short} 전용 커리큘럼이 열려 있습니다
                </h3>
                <p className="mt-3 text-[14px] font-light leading-[1.85] text-ink-500">
                  1단계 발표일부터 면접 전날까지의 구간에 맞춰 짜인 커리큘럼입니다. 아래에 이 대학의
                  수업 캘린더와 남은 자리를 그대로 공개합니다.
                </p>
              </div>
            ) : noInterview ? (
              <NoteBox
                title="면접이 없는 대학의 준비 순서"
                tone="info"
                Icon={BookOpenCheck}
                items={[
                  "교과 성적과 서류가 최종 점수다 — 제출 시점의 학생부가 곧 결과다.",
                  "수능 최저 충족이 실질 관문이 된다. 모의고사 기준으로 충족 가능성을 먼저 계산한다.",
                  "면접으로 뒤집을 구간이 없으므로 지원 위치를 보수적으로 잡는다.",
                  "면접 준비에 쓸 시간을 최저 과목과 생기부 마무리에 재배치한다.",
                ]}
              />
            ) : (
              <div className="mx-auto max-w-3xl border border-hair-strong bg-paper-50 p-8 text-center">
                <p className="eyebrow text-brass-600">면접 수업</p>
                <h3 className="display mt-4 text-[1.375rem] leading-snug text-ink-900">
                  {u.short} 면접은 1:1 맞춤 편성으로 진행합니다
                </h3>
                <p className="mt-3 text-[14px] font-light leading-[1.85] text-ink-500">
                  이 대학은 정규 특강반이 아니라, 1단계 발표일과 면접일에 맞춰 개별 일정으로 편성합니다.
                  위 훈련 포인트를 기준으로 커리큘럼을 짜고 모의면접을 반복합니다. 편성 가능 일정은 상담에서
                  확인해 주세요.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-800"
                  >
                    <MessagesSquare className="h-4 w-4" strokeWidth={1.75} />
                    {u.short} 면접 수업 문의
                  </Link>
                  <Link
                    href="/interview"
                    className="inline-flex items-center gap-2 border border-hair-strong px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink"
                  >
                    면접 수업 전체 보기
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </PromoSection>

      {/* ===== 담당 강사 — 의대 출신 두 분 + (제시문 면접이면) 제시문 전담 =====
          약력(detailed)은 켜지 않는다. 39개 대학 페이지에 같은 약력이 깔리면
          2026-10-24 에 걷어낸 본문 중복이 그대로 되살아난다 — /interview 로 보낸다. */}
      {!noInterview && teacherKeys.length > 0 && (
        <PromoSection
          eyebrow="INSTRUCTOR"
          EyebrowIcon={Users}
          title="담당 강사"
          subtitle={
            teacherKeys.includes("jesimun")
              ? `${u.short} 면접은 제시문 면접이라, 의대 출신 두 분과 제시문 전담 박은우 선생님이 나눠 맡습니다. 약력과 수업 방식은 아래 수업 안내에서 펼쳐 보실 수 있습니다.`
              : `${u.short} 면접은 의대 출신 류지연·이세인 선생님이 맡습니다. 약력과 수업 방식은 아래 수업 안내에서 펼쳐 보실 수 있습니다.`
          }
        >
          <TeacherCards teachers={teacherKeys.flatMap((k) => UNIV_TEACHER_GROUPS[k])} />
        </PromoSection>
      )}

      {/* ===== 이어보기 ===== */}
      {mmiUniv && booking && (
        <>
          <PromoSection
            eyebrow="CALENDAR"
            EyebrowIcon={CalendarDays}
            title="수업 캘린더"
            subtitle="1차 발표일부터 면접 전날까지 열려 있는 자리입니다. 숫자는 그 날의 잔여 회차입니다."
            tone="muted"
          >
            <ScheduleCalendar univ={mmiUniv} />
          </PromoSection>

          <PromoSection
            eyebrow="AVAILABILITY"
            EyebrowIcon={Clock}
            title="예약 현황"
            subtitle={`${u.short} 구간 전체 ${booking.total}회 중 ${
              booking.booked + booking.waitlist
            }회가 찼습니다. 남은 자리는 아래와 같습니다.`}
          >
            <BookingBoard univ={mmiUniv} />
          </PromoSection>

          <PromoSection
            eyebrow="TIMETABLE"
            EyebrowIcon={ListChecks}
            title="수업 일정표"
            subtitle="세로가 타임, 가로가 날짜입니다. 칸 안의 표시가 강사별 예약 상태입니다."
            tone="muted"
          >
            <Timetable univ={mmiUniv} />
          </PromoSection>

          <PromoSection
            eyebrow="WAITLIST"
            EyebrowIcon={Repeat}
            title="1차 불합격으로 풀리는 자리"
          >
              <LeakageNotice univ={mmiUniv} />
          </PromoSection>
        </>
      )}

      {/* 수업 띠는 MMI 특강 개설 여부와 무관하게 모든 대학 페이지에 깔린다(예약 보드만
          mmiUniv 에 걸려 있다). ⚠️ 여기에 ClassCtaBand 같은 큰 공통 블록을 되돌리지 말 것 —
          같은 문단이 39개 의대 페이지에 박혀 2026-10-24 에 걷어낸 중복이 되살아난다.
          절차·강사 학력·가격 상세는 팝업과 /interview 가 맡는다. */}
      <FieldClassLine
        subject={noInterview ? "의대 면접" : `${u.short} 의예과 면접`}
        teachers={classTeachers}
        context={noInterview ? undefined : classContext}
      />

      {cross.length > 0 && (
        <PromoSection
          eyebrow="SAME UNIVERSITY"
          EyebrowIcon={Building2}
          title={`${u.short}의 다른 계열 면접`}
          subtitle={`${u.short}에 함께 지원한다면 — 치·한·약·수 면접은 방식과 날짜가 의예과와 다릅니다.`}
        >
          <CrossFieldLinks links={cross} mine={interviewDays[0] ?? null} univShort={u.short} />
        </PromoSection>
      )}

      <PromoSection eyebrow="MORE" EyebrowIcon={BarChart3} title="이어서 보기" tone="muted">
        <LinkCards
          items={[
            {
              href: `/univ/${u.slug}`,
              icon: ClipboardCheck,
              title: `${u.short} 의예과 전형 안내`,
              body: "전형별 모집인원·수능최저·선발모형을 유형별로 정리했습니다. 면접이 몇 단계에 들어가는지도 여기서 확인하세요.",
            },
            ...(u.admission
              ? [
                  {
                    href: `/ipkyul/uiye/${u.slug}`,
                    icon: BarChart3,
                    title: `${u.short} 입시결과`,
                    body: "전형별 최종등록자 등급컷(50%·70%)을 공시된 값만 정리했습니다.",
                  },
                ]
              : []),
            {
              href: "/interview/uidae",
              icon: GraduationCap,
              title: "다른 의대 면접 보기",
              body: "전국 의대 면접을 방식·일정별로 모아 두었습니다.",
            },
          ]}
          columns={3}
        />
      </PromoSection>

      <SourceNote
        lines={[
          `면접 데이터는 ${u.short} 2027학년도 수시 모집요강에서 정리했습니다.`,
          ...(iv?.sources ?? []).map((s) => `출처 — ${s.label}: ${s.url}`),
          "면접 일정·방식은 대학 사정에 따라 변경될 수 있습니다. 반드시 해당 대학 최종 모집요강과 입학처 공지를 확인하세요.",
          ...(unverified
            ? ["⚠️ 이 대학은 입학처 요강 원문을 확인하지 못했습니다. 페이지의 수치를 그대로 신뢰하지 마세요."]
            : []),
        ]}
      />

      <FinalCTA
        title={noInterview ? `${u.short} 지원, 면접 대신 무엇을 채울지 정해 드립니다` : `${u.short} 면접, 이 대학 방식으로 연습하세요`}
        body={
          noInterview
            ? "면접이 없는 대학은 교과·서류·수능최저가 전부입니다. 지금 성적과 생기부로 어디에 시간을 쓸지 함께 정리합니다."
            : "1단계 발표일과 면접일에 맞춰 이 대학 면접 방식 그대로 모의면접을 반복합니다. 일정과 남은 자리를 상담에서 바로 확인하세요."
        }
        Icon={MessagesSquare}
        primaryHref="#contact"
        primaryLabel={`${u.short} 면접 상담하기`}
      />

      <div className="border-t border-hair bg-paper px-6 py-10 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/interview/uidae"
            className="inline-flex items-center gap-2 text-sm font-light text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            의대 면접 전체 보기
          </Link>
        </div>
      </div>
    </>
  );
}
