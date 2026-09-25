import Link from "next/link";
import {
  AlarmClock,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  MonitorPlay,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  FeatureGrid,
  FinalCTA,
  LinkCards,
  NoteBox,
  PriceCard,
  PromoHero,
  PromoSection,
  SourceNote,
  StepList,
} from "../_site/components";
import { FactList } from "../univ/_univ";
import {
  ALL_DAYS,
  AVG_GAP,
  BLOCKS,
  daysOf,
  PRE_SUNEUNG,
  RANGE_LABEL,
  SUNEUNG,
  TIGHTEST,
  TOTAL,
  TRACK_COUNT,
  UNIV_COUNT,
} from "@/lib/chuseok-class";
import {
  CLASS_FLOW,
  CLASS_INCLUDES,
  CLASS_PRICE,
  SESSION_HOURS_LABEL,
} from "@/lib/interview-types";
import { formatKo, slotsForDate, SLOT_TIMES, TEACHERS, TUITION } from "@/lib/mmi-schedule";
import { JsonLdAll } from "@/components/json-ld";
import { breadcrumb, course } from "@/lib/jsonld";

/** =========================================================================
 *  /interview/chuseok — 수능 전 연휴 면접 특강.
 *
 *  전부 서버 컴포넌트다. 날짜·회차가 HTML 에 박혀야 색인된다.
 *  숫자는 lib/chuseok-class.ts 에서만 온다 — 여기에 손으로 적지 않는다.
 *  ========================================================================= */

/** 연휴 구간별 일자 · 회차 표 */
function BlockTable() {
  return (
    <div className="mx-auto max-w-5xl">
      <div
        role="region"
        aria-label="수능 전 연휴 특강 구간"
        tabIndex={0}
        className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">
            2027학년도 수능 전 연휴 의대 면접 특강 구간별 일정과 남은 자리
          </caption>
          <thead>
            <tr className="bg-ink text-paper">
              {["구간", "기간", "일수", "근거 공휴일", "총 회차", "남은 자리"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-4 text-[12px] font-semibold tracking-tight ${
                      i > 0 ? "border-l border-white/10" : ""
                    }`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {BLOCKS.map((b) => {
              const days = daysOf(b);
              const s = summaryFor(days);
              return (
                <tr key={b.id} className="align-top">
                  <td className="border-t border-hair px-4 py-4 font-medium text-ink-900">
                    {b.name}
                  </td>
                  <td className="tnum border-t border-hair px-4 py-4 text-[13px] font-light text-ink-700">
                    {formatKo(b.start)} ~ {formatKo(b.end)}
                  </td>
                  <td className="tnum border-t border-hair px-4 py-4 text-ink-500">
                    {days.length}일
                  </td>
                  <td className="border-t border-hair px-4 py-4 text-[13px] font-light text-ink-500">
                    {b.reason}
                  </td>
                  <td className="tnum border-t border-hair px-4 py-4 text-ink-500">
                    {s.total}회
                  </td>
                  <td className="tnum border-t border-hair px-4 py-4 font-medium text-jade-700">
                    {s.open}회
                  </td>
                </tr>
              );
            })}
            <tr className="bg-paper-100 align-top">
              <td className="border-t border-hair-strong px-4 py-4 font-semibold text-ink-900">
                합계
              </td>
              <td className="tnum border-t border-hair-strong px-4 py-4 text-[13px] font-light text-ink-700">
                {RANGE_LABEL}
              </td>
              <td className="tnum border-t border-hair-strong px-4 py-4 font-medium text-ink-700">
                {ALL_DAYS.length}일
              </td>
              <td className="border-t border-hair-strong px-4 py-4 text-[13px] font-light text-ink-500">
                연휴 3구간
              </td>
              <td className="tnum border-t border-hair-strong px-4 py-4 font-medium text-ink-700">
                {TOTAL.total}회
              </td>
              <td className="tnum border-t border-hair-strong px-4 py-4 font-semibold text-jade-700">
                {TOTAL.open}회
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-[12px] font-light text-ink-500">
        남은 자리는 강사 2명 기준입니다. 같은 날짜의 잔여는 대학별 MMI 페이지와 같은 값입니다.
      </p>
    </div>
  );
}

function summaryFor(days: string[]) {
  let total = 0;
  let open = 0;
  for (const d of days) {
    for (const s of slotsForDate(d)) {
      total += 1;
      if (s.state === "open") open += 1;
    }
  }
  return { total, open };
}

/** 하루 5타임 시간표 */
function DayTimetable() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="border border-hair-strong bg-paper-50">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">연휴 하루 수업 타임 5개</caption>
          <thead>
            <tr className="bg-ink text-paper">
              <th className="px-4 py-4 text-[12px] font-semibold tracking-tight">타임</th>
              <th className="border-l border-white/10 px-4 py-4 text-[12px] font-semibold tracking-tight">
                시간
              </th>
              <th className="border-l border-white/10 px-4 py-4 text-[12px] font-semibold tracking-tight">
                동시 수업
              </th>
            </tr>
          </thead>
          <tbody>
            {SLOT_TIMES.map((t, i) => (
              <tr key={t.id}>
                <td className="tnum border-t border-hair px-4 py-3.5 font-medium text-ink-900">
                  {i + 1}타임
                </td>
                <td className="tnum border-t border-hair px-4 py-3.5 text-ink-700">
                  {t.label}
                </td>
                <td className="border-t border-hair px-4 py-3.5 text-[13px] font-light text-ink-500">
                  강사 {TEACHERS.length}명 · 최대 {TEACHERS.length}명 동시
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-[12px] font-light text-ink-500">
        연휴에는 낮 타임까지 5개를 엽니다. 식사 시간(11:00–12:00 · 17:00–18:00)은
        타임에서 뺐습니다. 1회 {SESSION_HOURS_LABEL}.
      </p>
    </div>
  );
}

/** 수능 전 면접을 보는 전형 — 실측 */
function PreSuneungTable() {
  if (PRE_SUNEUNG.length === 0) return null;
  return (
    <div className="mx-auto max-w-4xl">
      <div className="border border-hair-strong bg-paper-50">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">수능일보다 먼저 면접을 보는 의대 전형</caption>
          <thead>
            <tr className="bg-ink text-paper">
              <th className="px-4 py-4 text-[12px] font-semibold tracking-tight">대학</th>
              <th className="border-l border-white/10 px-4 py-4 text-[12px] font-semibold tracking-tight">
                전형
              </th>
              <th className="border-l border-white/10 px-4 py-4 text-[12px] font-semibold tracking-tight">
                1단계 발표
              </th>
              <th className="border-l border-white/10 px-4 py-4 text-[12px] font-semibold tracking-tight">
                면접일
              </th>
            </tr>
          </thead>
          <tbody>
            {PRE_SUNEUNG.map((f) => (
              <tr key={`${f.slug}-${f.track}`} className="align-top">
                <td className="border-t border-hair px-4 py-4 font-medium text-ink-900">
                  <Link href={`/mmi/${f.slug}`} className="underline-offset-4 hover:underline">
                    {f.univ}
                  </Link>
                </td>
                <td className="border-t border-hair px-4 py-4 text-[13px] font-light leading-relaxed text-ink-700">
                  {f.track}
                </td>
                <td className="tnum border-t border-hair px-4 py-4 text-ink-500">
                  {f.announce ? formatKo(f.announce) : "미공지"}
                </td>
                <td className="tnum border-t border-hair px-4 py-4 font-medium text-jade-700">
                  {formatKo(f.interview)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-[12px] font-light text-ink-500">
        수능일은 {formatKo(SUNEUNG)}입니다. 위 전형은 수능보다 면접이 먼저입니다.
      </p>
    </div>
  );
}

export function ChuseokPage() {
  const tightest = TIGHTEST[0];

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "면접 수업", path: "/interview" },
            { name: "추석 연휴 의대 면접반", path: "/interview/chuseok" },
          ]),
          course({
            path: "/interview/chuseok",
            name: "추석 연휴 의대 면접반 — 수능 전 연휴 면접 특강 (1:1)",
            description: `추석·개천절·한글날 연휴 ${ALL_DAYS.length}일 동안 하루 5타임을 여는 줌 1:1 의대 면접 특강.`,
            price: TUITION.perSession,
            startDate: ALL_DAYS[0],
            endDate: ALL_DAYS[ALL_DAYS.length - 1],
          }),
        ]}
      />
      <PromoHero
        badge={`수능 전 연휴 특강 · ${RANGE_LABEL}`}
        title="추석 연휴 의대 면접반"
        highlight="수능 전에 끝내는 면접 준비"
        body={`1단계 발표에서 면접까지는 평균 ${AVG_GAP}일입니다. 발표를 보고 시작하면 준비가 아니라 벼락치기가 됩니다. 추석·개천절·한글날 연휴 ${ALL_DAYS.length}일 동안 낮 타임까지 열어 1:1로 골격을 먼저 만듭니다.`}
        primaryHref="#contact"
        primaryLabel="연휴 자리 문의하기"
        secondaryHref="/mmi"
        secondaryLabel="대학별 면접 일정 보기"
        Icon={CalendarRange}
        stats={[
          { icon: CalendarDays, label: `연휴 ${ALL_DAYS.length}일` },
          { icon: ClipboardCheck, label: `남은 자리 ${TOTAL.open}회` },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      <PromoSection
        eyebrow="WHY NOW"
        EyebrowIcon={AlarmClock}
        title="발표를 보고 시작하면 늦습니다"
        subtitle={`T메디가 정리한 ${UNIV_COUNT}개 의대 ${TRACK_COUNT}개 전형의 실제 일정에서 나온 숫자입니다.`}
      >
        <FactList
          items={[
            `1단계 합격자 발표에서 면접까지 평균 ${AVG_GAP}일입니다. 그 사이에 원서 준비와 수능 마무리가 함께 들어갑니다.`,
            `가장 짧은 구간은 ${tightest.univ} ${tightest.track}으로 발표 다음 날이 면접입니다(${tightest.gap}일).`,
            `${PRE_SUNEUNG.length}개 전형은 수능(${formatKo(SUNEUNG)})보다 면접이 먼저입니다. 수능 뒤로 미룰 수 있는 구조가 아닙니다.`,
            "수시 원서접수와 경쟁률 확인이 끝난 시점이라, 실제로 면접을 볼 대학이 좁혀진 상태에서 시작할 수 있습니다.",
            "면접 답변의 골격은 한 번에 만들어지지 않습니다. 만들고 → 돌려보고 → 고치는 사이클에 최소 세 구간이 필요합니다.",
          ]}
        />
      </PromoSection>

      <PromoSection
        eyebrow="PRE-CSAT"
        EyebrowIcon={TriangleAlert}
        title="수능보다 면접이 먼저인 전형"
        subtitle="이 전형에 지원했다면 연휴가 사실상 유일한 준비 구간입니다."
        tone="muted"
      >
        <PreSuneungTable />
      </PromoSection>

      <PromoSection
        eyebrow="SCHEDULE"
        EyebrowIcon={CalendarDays}
        title={`수능 전에 남은 연휴는 ${BLOCKS.length}구간 ${ALL_DAYS.length}일입니다`}
        subtitle="세 구간 전부 휴일 시간표로 엽니다. 평일 저녁 2타임이 아니라 낮까지 5타임입니다."
      >
        <BlockTable />
        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          {BLOCKS.map((b) => (
            <div key={b.id} className="border-l-2 border-jade-600 pl-5">
              <p className="text-[13px] font-semibold text-ink-900">
                {b.name} · {formatKo(b.start)} ~ {formatKo(b.end)}
              </p>
              <p className="mt-2 text-[13px] font-light leading-[1.85] text-ink-700">
                {b.note}
              </p>
            </div>
          ))}
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="TIMETABLE"
        EyebrowIcon={MonitorPlay}
        title="연휴에는 하루 5타임을 엽니다"
        subtitle={`평일에는 저녁 2타임만 열지만 연휴에는 낮 타임까지 5개를 엽니다. 강사 ${TEACHERS.length}명이므로 한 타임에 최대 ${TEACHERS.length}명입니다.`}
        tone="muted"
      >
        <DayTimetable />
      </PromoSection>

      <PromoSection
        eyebrow="PLAN"
        EyebrowIcon={Users}
        title="연휴 3구간을 이렇게 씁니다"
        subtitle="한 구간에서 끝내는 설계가 아닙니다. 구간마다 목표가 다릅니다."
      >
        <FeatureGrid
          columns={3}
          items={[
            {
              icon: CalendarDays,
              title: "1구간 · 추석 — 골격 만들기",
              body: "지원한 대학의 면접 방식부터 확정합니다. 생기부에서 나올 질문을 먼저 소진시키고, 두괄식 답변 골격을 몸에 붙입니다. 이 구간의 목표는 완성도가 아니라 형태입니다.",
            },
            {
              icon: MessagesSquare,
              title: "2구간 · 개천절 — 실전으로 돌리기",
              body: "만든 골격을 실전 조건으로 돌립니다. 제시문 스테이션은 읽기 시간 안에 골격까지 세우는 메모법으로, 인성·상황은 꼬리질문을 버티는 구조로 훈련합니다.",
            },
            {
              icon: ClipboardCheck,
              title: "3구간 · 한글날 — 약점만 고치기",
              body: "두 구간에서 드러난 약점만 남깁니다. 표현·태도·시선까지 교정하고, 수능 이후에 바로 이어붙일 수 있는 상태로 마감합니다.",
            },
          ]}
        />
      </PromoSection>

      <PromoSection
        eyebrow="CLASS"
        EyebrowIcon={MonitorPlay}
        title="수업은 이렇게 진행합니다"
        subtitle={`예약부터 과제까지 한 사이클입니다. 1회 ${SESSION_HOURS_LABEL}, 줌으로 1:1 진행합니다.`}
        tone="muted"
      >
        <StepList steps={CLASS_FLOW} />
      </PromoSection>

      <PromoSection
        eyebrow="NOTICE"
        EyebrowIcon={TriangleAlert}
        title="예약 전에 확인해 주세요"
      >
        <NoteBox
          title="연휴 특강 운영 조건"
          items={[
            `연휴 ${ALL_DAYS.length}일 전체가 휴일 시간표(5타임)입니다. 2026년 추석은 토요일과만 겹쳐 대체공휴일이 없어 9월 28일(월)은 평일 시간표로 돌아갑니다.`,
            "1:1 개인지도이며 묶음·선납이 없습니다. 필요한 회차만 잡습니다.",
            "강사가 2명이라 같은 타임에 최대 2명입니다. 남은 자리는 대학별 MMI 페이지의 잔여와 같은 값입니다.",
            "1단계 발표 전이라도 결과를 기다리는 자리로 먼저 잡아 둘 수 있습니다.",
          ]}
          tone="warn"
          Icon={TriangleAlert}
        />
      </PromoSection>

      <PromoSection
        eyebrow="CONTACT"
        EyebrowIcon={MessagesSquare}
        title="연휴 자리 문의"
        subtitle="지원 대학과 면접일을 알려주시면 연휴 3구간에 맞춰 회차와 날짜를 잡아 드립니다."
        tone="muted"
      >
        <PriceCard
          courseName="수능 전 연휴 면접 특강 · 1:1"
          price={CLASS_PRICE.label}
          priceSuffix={CLASS_PRICE.suffix}
          badge={CLASS_PRICE.unit}
          BadgeIcon={MonitorPlay}
          items={CLASS_INCLUDES}
          notes={[
            { icon: MonitorPlay, label: `줌 온라인 · 1회 ${SESSION_HOURS_LABEL}` },
            { icon: CalendarDays, label: `연휴 ${ALL_DAYS.length}일 · 하루 5타임` },
            { icon: ClipboardCheck, label: "묶음·선납 없음" },
          ]}
          href="#contact"
          label="연휴 자리 문의하기"
        />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={GraduationCap} title="함께 보기">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/mmi",
              icon: CalendarDays,
              title: "2027 대학별 MMI 특강 일정",
              body: "1단계 발표일에서 역산한 대학별 수업 캘린더와 남은 자리.",
            },
            {
              href: "/interview",
              icon: MessagesSquare,
              title: "의대 면접 유형",
              body: "MMI · 인적성 · 제시문 — 어느 방식으로 보는지부터 확인하세요.",
            },
            {
              href: "/univ",
              icon: GraduationCap,
              title: "대학별 전형 · 면접 안내",
              body: "전국 의대의 전형 구조와 면접 방식을 대학별로 한 페이지에.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "연휴 날짜는 「관공서의 공휴일에 관한 규정」 기준입니다. 2026년 추석은 9월 25일(금)이고, 연휴가 토요일과만 겹쳐 대체공휴일이 지정되지 않았습니다.",
          `1단계 발표일·면접일은 각 대학 2027학년도 수시 모집요강과 입학처 공지에서 확인된 값만 썼습니다. 평균 ${AVG_GAP}일은 이 페이지가 다루는 ${UNIV_COUNT}개 의대 ${TRACK_COUNT}개 전형 중 발표일이 공지된 전형만으로 계산했습니다.`,
          `수능일(${formatKo(SUNEUNG)})은 2027학년도 대학수학능력시험 시행 기본계획 기준입니다.`,
          "대학별 근거와 출처 URL 은 각 대학 페이지 하단에 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title="연휴가 지나면 남는 건 발표까지의 며칠뿐입니다"
        body={`추석·개천절·한글날 ${ALL_DAYS.length}일. 낮 타임까지 열어 둔 구간에서 골격부터 만들어 두세요. 현재 남은 자리 ${TOTAL.open}회.`}
        Icon={CalendarRange}
        primaryHref="#contact"
        primaryLabel="연휴 자리 문의하기"
      />
    </>
  );
}
