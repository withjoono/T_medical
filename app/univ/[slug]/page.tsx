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
  Clock,
  ListChecks,
  MessagesSquare,
  Repeat,
  Scale,
  Target,
  Users,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  NoteBox,
  LinkCards,
  FinalCTA,
  SourceNote,
} from "../../_site/components";
import {
  AdmissionTables,
  InterviewTable,
  FactList,
  UnivStatRow,
  UnverifiedNotice,
  InterviewDates,
} from "../_univ";
import { UNIV_PAGES, getUnivPage, quotaByType } from "@/lib/univ";
import {
  BookingBoard,
  LeakageNotice,
  ScheduleCalendar,
  Timetable,
} from "../_booking";
import { ClassCtaBand } from "../../interview/_interview";
import {
  formatKo,
  getUniv as getMmiUniv,
  summarize,
  univDays,
} from "@/lib/mmi-schedule";

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

  const tracks = u.interview?.tracks ?? [];
  const first = tracks.find((t) => t.interview);
  const when = first?.interview ? ` 면접 ${formatKo(first.interview)}.` : "";
  const quota = u.admission ? `수시 ${u.admission.units.length}개 전형 ${u.admission.quota}명.` : "";
  const iv =
    u.hasInterview === false
      ? " 2027학년도 면접 미실시."
      : tracks.length > 0
        ? ` 면접 실시 ${tracks.length}개 전형.`
        : "";

  return {
    alternates: { canonical: `/univ/${u.slug}` },
    title: `${u.short} 의예과 전형·면접 안내 | T Medi`,
    description: `${u.name} 2027학년도 전형 안내. ${quota}${iv}${when} 전형별 모집인원·수능최저·선발모형과 면접 방식, 면접 수업까지 한 페이지에 정리했습니다. tmedi.kr`,
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
  /** 특강 일정·예약 블록은 mmi-schedule SSOT 에 데이터가 있는 대학만 렌더한다. */
  const mmiUniv = u.hasClassPage ? getMmiUniv(u.slug) : undefined;
  const booking = mmiUniv ? summarize(univDays(mmiUniv)) : undefined;
  const unverified = u.confidence === "low";

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
        highlight={iv?.headline ?? "전형부터 확인하세요"}
        body={
          iv?.lede ??
          `${u.name}의 2027학년도 수시 전형 구조를 정리했습니다. 전형별 모집인원과 수능 최저, 선발 모형을 한 표에서 비교하실 수 있습니다.`
        }
        primaryHref="#contact"
        primaryLabel={`${u.short} 지원 상담하기`}
        secondaryHref={u.admission ? `/ipkyul/uiye/${u.slug}` : "/univ"}
        secondaryLabel={u.admission ? "입시결과 보기" : "다른 대학 보기"}
        Icon={GraduationCap}
        stats={[
          { icon: Scale, label: u.admission ? `수시 ${u.admission.quota}명` : "전형 준비 중" },
          { icon: MessagesSquare, label: noInterview ? "면접 미실시" : `면접 ${tracks.length}개 전형` },
          ...(u.hasClassPage ? [{ icon: Users, label: "MMI 특강 개설" }] : []),
        ]}
      />

      <UnivStatRow
        items={stats}
        caption="2027학년도 수시 모집요강 및 T스쿨 수시 DB 기준. 최종 수치는 각 대학 모집요강에서 확정됩니다."
      />

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

      {/* ===== 2. 면접 안내 ===== */}
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
            subtitle="세로가 타임, 가로가 날짜입니다. 칸 안의 박·강이 강사별 예약 상태입니다."
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

          <ClassCtaBand typeName={`${u.short} 면접`} />
        </>
      )}

      <PromoSection eyebrow="MORE" EyebrowIcon={BarChart3} title="이어서 보기" tone="muted">
        <LinkCards
          items={[
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
              href: "/univ",
              icon: GraduationCap,
              title: "다른 의대 보기",
              body: "권역별로 전국 의대를 모아 두었습니다. 전형과 면접을 나란히 비교하세요.",
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
          `전형 데이터는 T스쿨 수시 DB(2027학년도 기준), 면접 데이터는 ${u.short} 2027학년도 수시 모집요강에서 정리했습니다.`,
          ...(iv?.sources ?? []).map((s) => `출처 — ${s.label}: ${s.url}`),
          "모집인원·수능최저·면접 일정은 대학 사정에 따라 변경될 수 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
          ...(unverified
            ? ["⚠️ 이 대학은 입학처 요강 원문을 확인하지 못했습니다. 페이지의 수치를 그대로 신뢰하지 마세요."]
            : []),
        ]}
      />

      <FinalCTA
        title={`${u.short} 지원, 가능한 전형부터 추려 드립니다`}
        body="내신·모의고사·생기부를 이 대학 전형 구조에 대입하면 어느 전형이 현실적인지 분명해집니다. 면접 일정까지 함께 설계합니다."
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
