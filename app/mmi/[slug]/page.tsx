import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  ClipboardCheck,
  Clock,
  ListChecks,
  Repeat,
  Target,
  UserRound,
  ArrowLeft,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  CheckList,
  NoteBox,
  PriceCard,
  FinalCTA,
  SourceNote,
} from "../../_site/components";
import {
  ScheduleCalendar,
  BookingBoard,
  Timetable,
  LeakageNotice,
  TrackTable,
  TeacherCards,
  UnivStatBar,
  StyleBadge,
} from "../_mmi";
import {
  UNIVS,
  TUITION,
  getUniv,
  formatKo,
  summarize,
  univDays,
  shortestWindow,
} from "@/lib/mmi-schedule";

/** 정적 export(output: 'export')라 동적 라우트에는 generateStaticParams 가 필수다. */
export function generateStaticParams() {
  return UNIVS.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = getUniv(slug);
  if (!u) return { title: "의대 면접 특강 | T Medi" };

  const s = summarize(univDays(u));
  const first = u.tracks.find((t) => t.interview);
  const when = first?.interview ? `면접 ${formatKo(first.interview)}` : "면접일 미공지";

  return {
    alternates: { canonical: `/mmi/${u.slug}` },
    title: `2027 ${u.short} 의대 면접 특강 | T Medi — ${u.styleLabel}`,
    description: `${u.short} 의예과 ${u.styleLabel}. ${when}, 1단계 발표부터 면접까지 ${shortestWindow(u) ?? "-"}일. 이 구간에 맞춘 1:1 실전 수업 캘린더와 예약 현황(현재 예약 가능 ${s.open}회)을 공개합니다. 박은우·강정규 담당. tmedi.kr`,
  };
}

export default async function UnivMmiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const univ = getUniv(slug);
  if (!univ) notFound();

  const days = univDays(univ);
  const s = summarize(days);
  const shortest = shortestWindow(univ);
  const nextInterview = univ.tracks
    .map((t) => t.interview)
    .filter((v): v is string => Boolean(v))
    .sort()[0];

  const siblings = UNIVS.filter((u) => u.slug !== univ.slug).slice(0, 8);

  return (
    <>
      <PromoHero
        badge={`2027 ${univ.short} 의대 면접 특강`}
        title={`${univ.short} 면접,`}
        highlight={univ.headline}
        body={univ.lede}
        primaryHref="#contact"
        primaryLabel={`${univ.short} 자리 문의하기`}
        secondaryHref="/mmi"
        secondaryLabel="다른 대학 보기"
        Icon={Users}
        stats={[
          { icon: CalendarDays, label: nextInterview ? `면접 ${formatKo(nextInterview)}` : "면접일 미공지" },
          { icon: Clock, label: shortest !== null ? `준비 ${shortest}일` : "일정 미공지" },
          { icon: UserRound, label: `예약 가능 ${s.open}회` },
        ]}
      />

      {/* 숫자 줄 */}
      <section className="border-t border-hair bg-paper px-6 py-14 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <StyleBadge univ={univ} />
            <span className="text-[13px] font-light text-ink-400">{univ.name} · {univ.region}</span>
          </div>
          <UnivStatBar univ={univ} />
        </div>
      </section>

      {/* 면접 방식 */}
      <PromoSection
        eyebrow="FORMAT"
        EyebrowIcon={ListChecks}
        title={`${univ.short} 면접은 이렇게 진행됩니다`}
        subtitle="2027학년도 모집요강과 입학처 공지에서 확인된 내용만 적었습니다."
        tone="muted"
      >
        <CheckList items={univ.format} />
      </PromoSection>

      {/* 전형별 일정 */}
      <PromoSection
        eyebrow="SCHEDULE"
        EyebrowIcon={CalendarDays}
        title="전형별 일정과 준비 기간"
        subtitle="1단계 발표일과 면접일 사이가 실제로 수업을 넣을 수 있는 전부입니다."
      >
        <TrackTable univ={univ} />
        {univ.notes && univ.notes.length > 0 && (
          <div className="mt-10">
            <NoteBox title="지원 전 확인할 것" items={univ.notes} tone="warn" Icon={ClipboardCheck} />
          </div>
        )}
      </PromoSection>

      {/* 캘린더 */}
      <PromoSection
        eyebrow="CALENDAR"
        EyebrowIcon={CalendarDays}
        title="수업 캘린더"
        subtitle="1차 발표일부터 면접 전날까지 열려 있는 자리입니다. 숫자는 그 날의 잔여 회차입니다."
        tone="muted"
      >
        <ScheduleCalendar univ={univ} />
      </PromoSection>

      {/* 예약 현황 */}
      <PromoSection
        eyebrow="AVAILABILITY"
        EyebrowIcon={Clock}
        title="예약 현황"
        subtitle={`${univ.short} 구간 전체 ${s.total}회 중 ${s.booked + s.waitlist}회가 찼습니다. 남은 자리는 아래와 같습니다.`}
      >
        <BookingBoard univ={univ} />
      </PromoSection>

      {/* 수업 일정표 */}
      <PromoSection
        eyebrow="TIMETABLE"
        EyebrowIcon={ListChecks}
        title="수업 일정표"
        subtitle="세로가 타임, 가로가 날짜입니다. 칸 안의 박·강이 강사별 예약 상태입니다."
        tone="muted"
      >
        <Timetable univ={univ} />
      </PromoSection>

      {/* 누수 */}
      <PromoSection
        eyebrow="WAITLIST"
        EyebrowIcon={Repeat}
        title="1차 불합격으로 풀리는 자리"
        tone="muted"
      >
        <LeakageNotice univ={univ} />
      </PromoSection>

      {/* 훈련 포인트 */}
      <PromoSection
        eyebrow="DRILLS"
        EyebrowIcon={Target}
        title={`${univ.short} 지원자에게 실제로 필요한 훈련`}
        subtitle="일반론이 아니라 이 대학의 방 구성·반영비율·일정에서 나온 결론입니다."
      >
        <CheckList items={univ.drills} />
      </PromoSection>

      {/* 강사 */}
      <PromoSection
        eyebrow="INSTRUCTORS"
        EyebrowIcon={UserRound}
        title="담당 강사"
        subtitle="스테이션 성격에 따라 담당을 나눕니다. 두 강사가 같은 학생을 번갈아 봅니다."
        tone="muted"
      >
        <TeacherCards />
      </PromoSection>

      {/* 수업료 */}
      <PromoSection eyebrow="TUITION" EyebrowIcon={Clock} title="수업료">
        <PriceCard
          courseName={`${univ.short} 면접 특강 · 1:1`}
          price={TUITION.perSessionLabel}
          priceSuffix={`/ ${TUITION.unit}`}
          badge="대기 예약은 무료 · 자리 확정 후 결제"
          BadgeIcon={CalendarDays}
          items={[
            "강사 1명 : 학생 1명, 1회 2시간 30분 — 한 문항을 끝까지 파고드는 꼬리질문 훈련",
            `${univ.short}의 방 구성·시간에 맞춘 실전 리허설`,
            "제출 생기부 기반 예상 질문 도출 및 답변 정리",
            "세션마다 영상 기록 + 표현·태도·시선 교정",
            "박은우(제시문·구술) · 강정규(인성·상황·모의면접) 분담",
            shortest !== null
              ? `1단계 발표일에서 역산한 ${shortest}일 커리큘럼 설계`
              : "1단계 발표일에서 역산한 커리큘럼 설계",
          ]}
          notes={[
            { icon: Clock, label: "1회 2시간 30분 · 1:1" },
            { icon: CalendarDays, label: "평일 18:00–23:00 2타임 / 휴일 5타임" },
          ]}
          href="#contact"
          label={`${univ.short} 자리 확인하고 상담하기`}
        />
      </PromoSection>

      {/* 다른 대학 */}
      <section className="border-t border-hair bg-paper-100 px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display text-[1.25rem] text-ink-900">다른 대학 면접 특강</h2>
            <Link href="/mmi" className="link-underline inline-flex items-center gap-2 text-[13px] font-medium text-ink-600">
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              전체 대학 보기
            </Link>
          </div>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {siblings.map((u) => (
              <li key={u.slug}>
                <Link
                  href={`/mmi/${u.slug}`}
                  className="inline-block border border-hair-strong bg-paper-50 px-4 py-2 text-[13px] font-medium tracking-tight text-ink-700 transition-colors hover:border-jade-600 hover:bg-jade-50 hover:text-jade-700"
                >
                  {u.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA
        title={`${univ.short} 면접, 남은 자리부터 잡으세요`}
        body={
          shortest !== null
            ? `1차 발표 후 면접까지 ${shortest}일입니다. 이 구간에서 새로 배울 수 있는 건 없습니다. 지금 자리를 잡고, 발표 전에 기본기를 끝내 두는 편이 맞습니다.`
            : "일정이 공개되는 대로 이 페이지를 갱신합니다. 먼저 상담으로 준비 시점을 잡아 두세요."
        }
        Icon={Users}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />

      <SourceNote
        lines={[
          `${univ.short} 일정은 2027학년도 수시 모집요강 및 입학처 공지 기준입니다(2026년 9월 확인). 대학 사정으로 변경될 수 있으므로 최종 확인은 입학처 공지를 따르십시오.`,
          ...univ.sources.map((src) => `출처 — ${src.label}: ${src.url}`),
          "예약 현황은 집계 시점 기준이며 실시간이 아닙니다. 실제 잔여는 상담 시 확인해 드립니다.",
        ]}
      />
    </>
  );
}
