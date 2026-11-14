import type { Metadata } from "next";
import {
  Snowflake,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  CalendarX,
  ClipboardList,
  Grid3x3,
  Gauge,
  Repeat2,
  Layers,
  Sun,
  LifeBuoy,
  Flag,
  TrendingDown,
  Hourglass,
  Plane,
  Trophy,
  Users,
  Flame,
  Stethoscope,
  Scale,
  Compass,
  FlaskConical,
  UserCheck,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CompareTable,
  NoteBox,
  LinkCards,
  InkButton,
  FinalCTA,
} from "../_site/components";
import { JsonLdAll } from "@/components/json-ld";
import { breadcrumb } from "@/lib/jsonld";

/** =========================================================================
 *  겨울방학 플래너 — 프로모 페이지 (2026-11-13)
 *
 *  컨셉: 방학은 시작일과 끝나는 날이 정해진 통이다. 목표를 넣기 전에 쓸 수 있는 '칸'을 먼저 세고,
 *        장기 → 주간 → 하루 3단으로 나눠 매일 다시 계산한다. (기획: 겨울방학 플래너 기획서 2026-11-13)
 *  의대반: 별도 모집. 전교권 학생들끼리 매일 학습량 등으로 경쟁하는 구조 (2026-11-13 사용자).
 *          = 2028 의대준비반(/uidae-junbi)의 두 축 중 하나. 이 페이지의 의대반 섹션은 거기로 보낸다.
 *
 *  ⚠️ 이 파일에 없는 것 — 확정되면 넣는다. 추정으로 채우지 말 것.
 *    · 의대반 가격·정원·모집 기간·선발 기준, 방학 플래너 이용료
 *    · 아래 표·그리드의 숫자는 기획서의 '예시'다. 화면에도 예시라고 적는다.
 *  ⚠️ 문구 원칙: 합격률·합격 보장 문구를 넣지 않는다.
 *  ========================================================================= */

const PATH = "/winter-planner";
const MED_CLASS_PATH = "/uidae-junbi";
const PLANNER_URL = "https://studyplanner.kr";

const DESCRIPTION =
  "겨울방학 계획이 2주 차에 무너지는 건 목표를 욕심껏 넣기 때문입니다. T플래너의 방학 플래너는 방학 전체에 쓸 수 있는 칸을 먼저 세고, 교재별로 한 칸에 몇 쪽인지 보여 준 뒤, 매일 남은 분량을 다시 나눕니다. 전교권 학생들이 매일 학습량으로 겨루는 의대반은 별도 모집 중입니다.";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: "겨울방학 플래너 — 칸부터 세는 방학 계획 · 의대반 별도 모집 | T Medi",
  description: DESCRIPTION,
  openGraph: {
    title: "겨울방학 플래너 | T Medi",
    description:
      "방학에 쓸 수 있는 칸을 먼저 세고, 매일 남은 분량을 다시 나눕니다. 의대반 별도 모집 중.",
    url: PATH,
    type: "website",
  },
};

/** 문제 — 방학 계획이 무너지는 지점 */
const PROBLEMS = [
  {
    icon: TrendingDown,
    title: "목표를 욕심껏 넣습니다",
    body: "방학은 끝나는 날이 정해져 있습니다. 그런데 쓸 수 있는 시간을 세지 않고 교재부터 쌓으면, 하루에 해야 할 분량이 처음부터 감당할 수 없는 크기가 됩니다. 보통 2주 차에 무너집니다.",
  },
  {
    icon: Plane,
    title: "빠지는 날이 계획에 없습니다",
    body: "여행, 설 연휴, 캠프, 학원 특강. 겨울방학에는 빠지는 날이 많습니다. 계획이 날짜에 묶여 있으면 하루가 빠질 때마다 뒤가 통째로 어긋납니다.",
  },
  {
    icon: Hourglass,
    title: "밀린 분량을 그대로 둡니다",
    body: "방학 계획은 중간에 반드시 밀립니다. 문제는 밀린 것이 아니라, 밀린 분량을 어떻게 할지 정하지 않고 쌓아 두다가 계획 전체를 포기하는 것입니다.",
  },
  {
    icon: Flag,
    title: "시험 같은 마감이 없습니다",
    body: "학기 중에는 시험이 마감 역할을 합니다. 방학에는 그게 없어서 긴장이 풀리고, 개학 직전에야 남은 분량을 확인하게 됩니다.",
  },
];

/** 장기 → 주간 → 하루 3단 */
const THREE_STEPS = [
  {
    icon: CalendarRange,
    title: "장기 — 칸을 먼저 세고 목표를 담습니다",
    body: "방학 기간, 하루 칸 수, 빠지는 날을 넣으면 방학 전체에 쓸 수 있는 칸이 나옵니다. 그 안에 교재와 범위를 담고, 넘치면 시작하기 전에 알려 줍니다.",
  },
  {
    icon: Grid3x3,
    title: "주간 — 주 패턴 하나를 반복합니다",
    body: "6~8주를 날짜별로 일일이 짜지 않습니다. 요일과 칸으로 된 기본 주 패턴 하나를 앱이 먼저 채워 보여 주고, 승인하면 방학 내내 반복합니다. 주차별 목표가 중간 마감이 됩니다.",
  },
  {
    icon: Sun,
    title: "하루 — 오늘 분량을 매일 다시 계산합니다",
    body: "오늘 분량은 남은 분량을 남은 칸으로 나눠 정합니다. 어제 덜 했으면 오늘부터 조금씩 나눠 담고, 더 했으면 줄어듭니다. 확인하고 확정하면 오늘의 미션이 됩니다.",
  },
];

/** 용량 점검 예시 — 기획서 예시(총 89칸, 가중치 상3·중2·하1) */
const CAPACITY_HEAD = ["목표", "비중", "배정", "범위", "한 칸 분량"];
const CAPACITY_ROWS = [
  ["수학 선행 · 개념서", "상", "22칸", "320쪽", "약 15쪽"],
  ["영어 · 구문 인강", "상", "22칸", "60강", "약 3강"],
  ["수학 복습 · 문제집", "중", "15칸", "450문제", "30문제 ⚠"],
  ["국어 · 문학 개념", "중", "15칸", "240쪽", "16쪽"],
  ["과학 선행", "하", "8칸", "120쪽", "15쪽"],
  ["독서", "하", "7칸", "범위 없음", "—"],
];

/** 기본 주 패턴 예시 — [오전, 오후, 저녁] × 월~토, 일요일은 예비일 */
const WEEK_DAYS = ["월", "화", "수", "목", "금", "토"];
const WEEK_SLOTS = ["오전", "오후", "저녁"];
const WEEK_PATTERN: (string | null)[][] = [
  ["수학 선행", "수학 선행", "수학 선행", "영어", "수학 선행", "수학 복습"],
  ["영어", "국어", "영어", "국어", "영어", "국어"],
  ["수학 복습", null, "수학 복습", null, "과학", "독서"],
];

/** 밀렸을 때 */
const RECOVERY = [
  {
    icon: CalendarX,
    title: "빠지는 날은 0칸으로",
    body: "여행·설 연휴는 0칸, 학원 특강처럼 매주 반복되는 날은 칸을 줄여 등록합니다. 분량은 매일 다시 계산되므로 뒤 일정이 어긋나지 않습니다.",
  },
  {
    icon: LifeBuoy,
    title: "주 1회 예비일",
    body: "일주일에 하루(기본 일요일)는 계획을 넣지 않습니다. 밀린 분량이 있으면 그것만 따라잡고, 없으면 쉬는 날입니다.",
  },
  {
    icon: CalendarCheck,
    title: "주간 점검에서 밀린 분량을 정합니다",
    body: "주의 마지막 날, 목표 대비 실제 진도를 한 화면에서 봅니다. 밀린 분량은 남은 기간에 나눠 담을지, 예비일에 따라잡을지, 범위를 줄일지 고릅니다.",
  },
  {
    icon: Flag,
    title: "마지막 며칠은 마무리 기간",
    body: "방학 끝 며칠에는 새 진도를 넣지 않습니다. 못 끝낸 분량을 정리하고 개학을 준비하는 데 씁니다.",
  },
];

/** 의대반 */
const MED_CLASS = [
  {
    icon: Users,
    title: "전교권 학생들끼리 한 반",
    body: "의대를 목표로 하는 전교권 학생들만 따로 모읍니다. 기준이 비슷한 학생끼리 모여야 서로의 하루가 자극이 됩니다.",
  },
  {
    icon: Flame,
    title: "매일 학습량으로 겨룹니다",
    body: "각자 방학 플래너에 확정하고 끝낸 그날의 학습량이 반 안에서 비교됩니다. 방학이 끝날 때가 아니라 매일 결과가 나옵니다.",
  },
  {
    icon: Trophy,
    title: "혼자서는 생기지 않는 긴장",
    body: "방학에는 시험이라는 마감이 없습니다. 의대반에서는 같은 목표를 가진 경쟁자의 오늘이 그 마감 역할을 합니다.",
  },
];

/** 시작 순서 */
const START_STEPS = [
  {
    title: "방학 기간과 하루 칸 수를 넣습니다",
    body: "시작일과 종료일, 하루 칸 수(기본 오전·오후·저녁 3칸), 예비일, 빠지는 날을 입력합니다. 입력이 끝나면 방학 전체의 총 칸 수가 바로 나옵니다.",
  },
  {
    title: "목표를 교재 단위로 넣습니다",
    body: "지난 학기 복습, 새 학년 선행, 약점 보완, 독서. 과목이 아니라 교재별로 범위와 비중(상·중·하)을 정합니다.",
  },
  {
    title: "한 칸 분량을 보고 조절합니다",
    body: "앱이 비중에 따라 칸을 나눠 교재별 한 칸 분량을 보여 줍니다. 무리한 목표는 범위를 줄이거나 비중을 옮겨 시작 전에 고칩니다.",
  },
  {
    title: "주 패턴을 확인하고 승인합니다",
    body: "자동으로 채워진 주 패턴을 보고 필요한 칸만 바꿉니다. 비중이 높은 목표가 오전 칸에 먼저 놓입니다.",
  },
  {
    title: "매일 오늘 분량을 확정하고 결과를 남깁니다",
    body: "아침에 오늘 제안을 확인해 확정하고, 공부한 뒤 실제 분량을 입력합니다. 그 결과가 내일 분량에 반영됩니다.",
  },
];

/** 범위를 정직하게 */
const HONEST = [
  "플래너는 분량을 나눠 줄 뿐입니다. 공부는 학생이 합니다.",
  "이 페이지의 칸 수와 분량은 설명을 위한 예시입니다. 실제 숫자는 학생이 넣은 방학 기간과 목표에 따라 달라집니다.",
  "의대반은 일반 방학 플래너와 따로 모집합니다. 모집 기준과 일정은 상담에서 안내해 드립니다.",
  "합격을 보장하지 않습니다. 저희가 드리는 것은 지킬 수 있는 방학 계획과, 그 계획을 끝까지 끌고 갈 구조입니다.",
];

const RELATED = [
  {
    href: MED_CLASS_PATH,
    icon: Stethoscope,
    title: "2028 의대준비반",
    body: "전교권 학생들의 반 — 겨울방학 플래너와 생기부 컨설팅 반을 함께.",
  },
  {
    href: "/uidae-consulting",
    icon: UserCheck,
    title: "고1·고2 의대 컨설팅",
    body: "생기부·플래너·내신·모의고사를 담당 선생님 한 명이 함께 관리합니다.",
  },
  {
    href: "/tamgu",
    icon: FlaskConical,
    title: "탐구보고서 컨설팅",
    body: "방학에 탐구보고서 하나를 깊게 다듬고 싶다면 — 과학고 눈높이의 탐구 지도.",
  },
];

/** 기본 주 패턴 예시 — 헤어라인 그리드. 좁은 화면에서는 가로로 스크롤한다. */
function WeekPattern() {
  return (
    <div className="mx-auto max-w-5xl">
      <div
        role="region"
        aria-label="기본 주 패턴 예시"
        tabIndex={0}
        className="overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[680px] table-fixed border-collapse text-center text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              <th scope="col" className="w-16 px-3 py-3 text-[13px] font-medium">
                <span className="sr-only">칸</span>
              </th>
              {WEEK_DAYS.map((d) => (
                <th key={d} scope="col" className="px-3 py-3 text-[13px] font-medium">
                  {d}
                </th>
              ))}
              <th scope="col" className="px-3 py-3 text-[13px] font-medium">
                일
              </th>
            </tr>
          </thead>
          <tbody>
            {WEEK_SLOTS.map((slot, r) => (
              <tr key={slot} className="border-t border-hair-strong">
                <th
                  scope="row"
                  className="display px-3 py-4 text-[13px] font-normal text-brass-600"
                >
                  {slot}
                </th>
                {WEEK_PATTERN[r].map((goal, c) => (
                  <td
                    key={`${slot}-${WEEK_DAYS[c]}`}
                    className="border-l border-hair-strong px-2 py-4 text-[14px] text-ink-900"
                  >
                    {goal ?? <span className="font-light text-ink-500">학원</span>}
                  </td>
                ))}
                {r === 0 && (
                  <td
                    rowSpan={WEEK_SLOTS.length}
                    className="border-l border-hair-strong bg-jade-50 px-2 py-4 align-middle"
                  >
                    <p className="display text-[15px] text-jade-600">예비일</p>
                    <p className="mt-1.5 text-[12px] font-light leading-relaxed text-ink-500">
                      밀린 분량만
                      <br />
                      없으면 쉬는 날
                    </p>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-[13px] font-light text-ink-500">
        <Repeat2 className="h-4 w-4 shrink-0 text-jade-600" strokeWidth={1.5} />
        예시입니다. 화·목은 학원 가는 날이라 2칸으로 줄였습니다. 이 패턴 하나가 방학 내내 반복됩니다.
      </p>
    </div>
  );
}

export default function WinterPlannerPage() {
  return (
    <>
      <JsonLdAll items={[breadcrumb([{ name: "겨울방학 플래너", path: PATH }])]} />

      <PromoHero
        badge="2026 겨울방학 플래너"
        title="겨울방학 계획,"
        highlight="목표보다 칸을 먼저 셉니다"
        body="방학은 시작일과 끝나는 날이 정해져 있습니다. 그 안에 쓸 수 있는 시간을 세지 않고 목표부터 넣으면 2주 차에 무너집니다. 방학 플래너는 쓸 수 있는 칸을 먼저 세고, 교재별로 한 칸에 얼마나 해야 하는지 보여 준 뒤, 매일 남은 분량을 다시 나눠 줍니다."
        primaryHref="#medi-class"
        primaryLabel="2028 의대준비반 안내"
        secondaryHref="#how"
        secondaryLabel="계획 짜는 방식 보기"
        Icon={Snowflake}
        stats={[
          { icon: Layers, label: "장기 · 주간 · 하루 3단" },
          { icon: Gauge, label: "시작 전 용량 점검" },
          { icon: Repeat2, label: "매일 분량 재계산" },
          { icon: Trophy, label: "의대반 별도 모집" },
        ]}
      />

      {/* 문제 */}
      <PromoSection
        eyebrow="PROBLEM"
        EyebrowIcon={TrendingDown}
        title="방학 계획은 왜 2주 차에 무너질까요"
        subtitle="의지가 약해서가 아닙니다. 방학이라는 기간의 특성을 계획에 넣지 않았기 때문입니다."
        tone="muted"
      >
        <FeatureGrid items={PROBLEMS} columns={2} />
      </PromoSection>

      {/* 3단 */}
      <div id="how" className="scroll-mt-32">
        <PromoSection
          eyebrow="HOW IT WORKS"
          EyebrowIcon={Layers}
          title="장기 · 주간 · 하루, 세 단으로 나눕니다"
          subtitle="앱이 먼저 채워서 보여 주고, 학생은 승인하거나 고칩니다. 시각을 정하지 않고 오전·오후·저녁 '칸'으로만 나눕니다."
        >
          <FeatureGrid items={THREE_STEPS} columns={3} />
        </PromoSection>
      </div>

      {/* 용량 점검 */}
      <PromoSection
        eyebrow="CAPACITY CHECK"
        EyebrowIcon={Gauge}
        title="한 칸에 얼마나 해야 하는지부터 봅니다"
        subtitle="학생은 칸 수가 아니라 한 칸 분량을 보고 판단합니다. 무리한 목표는 방학이 시작되기 전에 드러납니다."
        tone="muted"
      >
        <CompareTable
          head={CAPACITY_HEAD}
          rows={CAPACITY_ROWS}
          caption="용량 점검 예시 — 6주 방학, 총 89칸"
        />
        <p className="mx-auto mt-5 max-w-5xl text-[13px] font-light leading-[1.85] text-ink-500">
          예시 — 6주(42일) 방학에서 일요일 6일을 예비일로, 여행 3일을 빼면 공부하는 날은 33일입니다.
          그중 학원 가는 날 10일은 2칸, 나머지 23일은 3칸이면 모두 89칸입니다. 비중(상 3 · 중 2 · 하 1)에
          따라 칸을 나눕니다.
        </p>

        <div className="mx-auto mt-10 flex max-w-5xl bg-jade-50">
          <span className="w-[3px] shrink-0 bg-jade-600" />
          <div className="flex flex-col items-start gap-5 px-7 py-6 sm:flex-row sm:items-center">
            <Gauge className="h-8 w-8 shrink-0 text-jade-600" strokeWidth={1.25} />
            <div>
              <h3 className="display text-[1.0625rem] leading-snug text-ink-900">
                ⚠ 평소보다 많으면 미리 알려 줍니다
              </h3>
              <p className="mt-2.5 text-[14px] font-light leading-[1.85] text-ink-600">
                한 칸 분량이 그 학생이 평소 해 온 분량보다 눈에 띄게 많으면 경고가 뜹니다. 그때 고를 수 있는
                방법은 세 가지입니다. 범위를 줄이거나, 그 목표의 비중을 올려 다른 목표에서 칸을 가져오거나,
                하루 칸 수를 늘립니다.
              </p>
            </div>
          </div>
        </div>
      </PromoSection>

      {/* 주 패턴 */}
      <PromoSection
        eyebrow="WEEKLY PATTERN"
        EyebrowIcon={Grid3x3}
        title="주 패턴 하나로 방학 전체를 채웁니다"
        subtitle="같은 목표는 하루에 한 칸, 요일에 고르게. 비중이 높은 목표는 오전에 먼저 놓습니다."
      >
        <WeekPattern />
      </PromoSection>

      {/* 밀렸을 때 */}
      <PromoSection
        eyebrow="WHEN YOU FALL BEHIND"
        EyebrowIcon={LifeBuoy}
        title="밀리는 것을 전제로 짭니다"
        subtitle="방학 계획은 반드시 밀립니다. 밀렸을 때 계획이 깨지지 않도록 처음부터 여유를 넣어 둡니다."
        tone="muted"
      >
        <FeatureGrid items={RECOVERY} columns={2} />
      </PromoSection>

      {/* 의대반 */}
      <div id="medi-class" className="scroll-mt-32">
        <PromoSection
          eyebrow="MEDICAL CLASS · 별도 모집"
          EyebrowIcon={Stethoscope}
          title="2028 의대준비반 — 전교권 학생들이 매일 학습량으로 겨룹니다"
          subtitle="방학 플래너 위에서 운영하는 반입니다. 일반 이용과 따로 모집하고 있습니다."
        >
          <FeatureGrid items={MED_CLASS} columns={3} />

          <div className="mx-auto mt-12 flex max-w-5xl bg-jade-50">
            <span className="w-[3px] shrink-0 bg-jade-600" />
            <div className="flex w-full flex-col items-start gap-6 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="display text-[1.0625rem] leading-snug text-ink-900">
                  2028 의대준비반은 지금 모집 중입니다
                </h3>
                <p className="mt-2.5 text-[14px] font-light leading-[1.85] text-ink-600">
                  겨울방학 플래너는 의대준비반의 두 축 중 하나입니다. 생기부 컨설팅 반까지 포함한 전체
                  구성을 확인해 보세요.
                </p>
              </div>
              <InkButton href={MED_CLASS_PATH} label="2028 의대준비반 보기" className="shrink-0" />
            </div>
          </div>
        </PromoSection>
      </div>

      {/* 시작 순서 */}
      <PromoSection
        eyebrow="GET STARTED"
        EyebrowIcon={ClipboardList}
        title="방학 시작 전에 한 번, 그다음은 매일 확인만"
        subtitle="처음 설정은 한 번입니다. 방학 중에는 아침에 오늘 분량을 확정하고 저녁에 결과를 남기면 됩니다."
        tone="muted"
      >
        <StepList steps={START_STEPS} />
        <div className="mt-12 flex justify-center">
          <InkButton href={PLANNER_URL} label="T플래너 열기" />
        </div>
        <div className="mt-12">
          <NoteBox
            title="할 수 있는 범위를 정직하게 말씀드립니다"
            items={HONEST}
            Icon={Scale}
          />
        </div>
      </PromoSection>

      {/* 함께 보면 좋은 안내 */}
      <PromoSection eyebrow="MORE" EyebrowIcon={Compass} title="함께 보면 좋은 안내">
        <LinkCards items={RELATED} columns={3} />
      </PromoSection>

      <FinalCTA
        title="이번 겨울방학, 지킬 수 있는 계획으로 시작하세요"
        body="의대반 모집이나 방학 계획에 대해 궁금한 점을 알려 주세요. 학년과 방학 목표를 듣고 어디서부터 잡을지 함께 정리해 드립니다."
        Icon={CalendarDays}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />
    </>
  );
}
