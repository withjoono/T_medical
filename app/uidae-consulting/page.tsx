import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Stethoscope,
  CalendarDays,
  ClipboardList,
  FileText,
  LineChart,
  BookMarked,
  UserCheck,
  Unlink,
  Target,
  Layers,
  Compass,
  Pencil,
  CalendarCheck,
  BarChart3,
  Repeat2,
  Clock,
  Scale,
  FlaskConical,
  GraduationCap,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  CheckList,
  RouteTimeline,
  PriceCard,
  NoteBox,
  LinkCards,
  FinalCTA,
} from "../_site/components";
import { JsonLdAll } from "@/components/json-ld";
import { abs, breadcrumb, SITE_URL } from "@/lib/jsonld";
import {
  UIDAE_CONSULTING,
  UIDAE_CONSULTING_PATH,
  UIDAE_CONSULTING_PERIOD,
  UIDAE_CONSULTING_PRICE,
  UIDAE_CONSULTING_PRICE_WON,
  UIDAE_CONSULTING_SESSIONS,
} from "@/lib/consulting";

/** =========================================================================
 *  고1·고2 의대 컨설팅 — 프로모 페이지 (2026-11-05)
 *
 *  컨셉: 생기부 컨설팅만이 아니라 학습 플래너 · 내신(생기북 앱) · 모의고사(모고 앱)까지
 *        담당 선생님 한 명이 전부 관리한다.
 *  참조: T과기원 /sanggibu-consulting(구성) + app/promo/_study-care.tsx(주간 관리 루프)
 *  가격·기간·회차는 lib/consulting.ts 가 SSOT — 이 파일에 숫자를 적지 않는다.
 *
 *  ⚠️ 문구 원칙 (개정 초·중등교육법, 2026-07-29 시행 — 학생부 상업적 이용 금지)
 *    · 생기부 컨설팅은 '무엇을 언제 할지 설계·점검'으로만 쓴다.
 *      학생부를 받아 분석·보관·AI 처리한다거나, 학교 선생님께 기재를 요청한다는 표현을 넣지 않는다.
 *    · 생기북 앱은 '생기부 관리'가 아니라 '내신 성적관리'로 쓴다.
 *    · 합격률·합격 사례·합격 보장 문구를 넣지 않는다.
 *  ========================================================================= */

const { months, plannerCheck } = UIDAE_CONSULTING;

const DESCRIPTION = `생기부만 봐주는 컨설팅이 아닙니다. 담당 선생님 한 명이 ${UIDAE_CONSULTING_SESSIONS}부터 학습 플래너 ${plannerCheck} 검사, 생기북 앱 내신 성적관리, 모고 앱 모의고사 관리까지 ${months}개월 동안 직접 관리합니다. 고1·고2 대상, ${UIDAE_CONSULTING_PERIOD} ${UIDAE_CONSULTING_PRICE}.`;

export const metadata: Metadata = {
  alternates: { canonical: UIDAE_CONSULTING_PATH },
  title: `고1·고2 의대 컨설팅 — 생기부·플래너·내신·모의고사 ${UIDAE_CONSULTING_PERIOD} 관리 | T Medi`,
  description: DESCRIPTION,
  openGraph: {
    title: "고1·고2 의대 컨설팅 | T Medi",
    description: `생기부 · 플래너 · 내신 · 모의고사, 선생님 한 명이 ${UIDAE_CONSULTING_PERIOD} 동안 전부 관리합니다.`,
    url: UIDAE_CONSULTING_PATH,
    type: "website",
  },
};

/** 문제 — 따로 맡기면 끊기는 지점 */
const PROBLEMS = [
  {
    icon: FileText,
    title: "생기부 컨설팅만 받으면",
    body: "탐구 주제와 활동 방향은 잡히지만, 그걸 실행할 시간이 주간 계획에 들어 있지 않으면 학기 말까지 밀립니다. 실행되지 않은 설계는 세특에 남지 않습니다.",
  },
  {
    icon: BookMarked,
    title: "내신을 따로 관리하면",
    body: "시험 기간과 탐구·수행평가 마감이 겹치는 주를 아무도 미리 보지 못합니다. 결국 그 주에는 둘 중 하나를 포기하게 됩니다.",
  },
  {
    icon: LineChart,
    title: "모의고사를 고3에 처음 챙기면",
    body: "의대 수시에는 수능 최저학력기준이 걸린 전형이 많습니다. 고1·고2 성적 흐름이 쌓여 있지 않으면 고3에 최저를 맞출 수 있을지 판단할 근거가 없습니다.",
  },
  {
    icon: Unlink,
    title: "매주 확인하는 사람이 없으면",
    body: "계획은 세우는 것보다 지키는 게 어렵습니다. 점검하는 사람이 없으면 계획표는 금방 멈추고, 멈춘 사실도 학기 말에야 알게 됩니다.",
  },
];

/** 선생님이 직접 관리하는 네 가지 */
const SYSTEM = [
  {
    icon: FileText,
    title: "생기부 컨설팅 — 무엇을 언제 할지 설계",
    body: "학생부종합전형이 보는 학업역량·진로역량·공동체역량을 기준으로, 이번 학기 교과 세특에 이어 갈 탐구 주제와 진로·동아리 활동 방향을 함께 정합니다. 활동은 학생이 하고 기록은 학교 선생님이 씁니다. 저희는 무엇을 언제 할지 설계하고 진행을 점검합니다.",
  },
  {
    icon: ClipboardList,
    title: `학습 플래너 — 계획을 짜 주고 ${plannerCheck} 검사`,
    body: `내신·수행평가 일정과 탐구 일정을 한 화면에 놓고, 과목별 주간 계획을 선생님이 짜 줍니다. 학생은 플래너 앱에 실행을 기록하고, 선생님이 ${plannerCheck} 검사해 밀린 원인을 짚고 다음 주 계획에 바로 반영합니다.`,
  },
  {
    icon: BookMarked,
    title: "내신 — 생기북 앱으로 성적관리",
    body: "학기별 과목 등급을 생기북 앱에 쌓아 과목별 흐름과 약한 과목을 선생님과 함께 봅니다. 흔들린 과목은 다음 주 학습 비중을 바로 올립니다.",
  },
  {
    icon: LineChart,
    title: "모의고사 — 모고 앱으로 성적관리",
    body: "모의고사를 볼 때마다 성적을 모고 앱에 누적해 영역별 추이와 약한 영역을 추적합니다. 목표 의대의 수능 최저학력기준과 지금 성적 사이의 거리를 숫자로 확인합니다.",
  },
];

/** 매주 도는 관리 루프 */
const LOOP: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: Pencil, label: "학습계획 설계", sub: "선생님이 짜 드림" },
  { icon: ClipboardList, label: "실행 · 기록", sub: "플래너 앱" },
  { icon: CalendarCheck, label: `${plannerCheck} 검사`, sub: "밀린 원인 점검" },
  { icon: BarChart3, label: "성적 확인", sub: "생기북 앱 · 모고 앱" },
  { icon: Repeat2, label: "다음 주 조정", sub: "바로 반영" },
];

/** 왜 고1·고2부터인가 */
const WHY_NOW = [
  "수시에는 고3 1학기까지의 학생부가 반영됩니다. 고1·고2 기록은 고3이 되어 다시 채울 수 없습니다.",
  "현 고1·고2는 내신 5등급제와 선택과목 없는 통합형 수능으로 대입을 치릅니다. 1등급이 상위 10%까지 넓어져, 등급만으로는 차이를 내기 어려워집니다.",
  "탐구는 한 학기에 끝나지 않습니다. 고1에 잡은 관심이 고2 심화로 이어질 때 진로역량이 드러납니다.",
  "모의고사 성적 흐름은 쌓아야 보입니다. 고1·고2 성적이 있어야 고3에 수능 최저 충족 가능성을 판단할 수 있습니다.",
];

/** 3개월 흐름 — 회차가 아니라 달 단위로 적는다(회차는 lib/consulting.ts) */
const TIMELINE = [
  {
    stage: "1개월차",
    title: "진단과 설계",
    body: "지금까지의 내신·모의고사 성적과 진행 중인 활동을 함께 보고, 목표와 남은 학기를 기준으로 계획을 세웁니다. 이번 학기 탐구 주제 후보를 정하고 첫 주간 계획을 선생님이 짜 드립니다.",
  },
  {
    stage: "2개월차",
    title: "실행과 매주 점검",
    body: `플래너 검사를 ${plannerCheck} 받으며 계획을 실행합니다. 탐구는 주제에서 방법·자료 정리로 나아가고, 시험·수행평가 일정에 맞춰 순서를 조정합니다.`,
  },
  {
    stage: "3개월차",
    title: "성적 반영과 다음 학기 설계",
    body: "그동안 쌓인 내신·모의고사 성적을 보고 약한 과목의 비중을 다시 잡습니다. 다음 학기와 방학에 이어 갈 탐구 방향과 학습 계획을 정리해 마무리합니다.",
  },
];

/** 이런 학생에게 */
const FOR_WHOM = [
  {
    icon: Target,
    title: "의대를 목표로 하는 고1·고2",
    body: "의대를 생각하지만 지금 어디쯤인지, 무엇부터 해야 할지 정리되지 않은 학생.",
  },
  {
    icon: Layers,
    title: "공부량은 많은데 관리가 없는 학생",
    body: "수업과 학원은 많은데 주간 계획과 점검이 없어 공부한 시간이 성적으로 이어지지 않는 학생.",
  },
  {
    icon: Compass,
    title: "탐구 주제가 막연한 학생",
    body: "생명·의학에 관심은 있지만 교과 세특에 이어질 구체적인 탐구 질문으로 발전시키지 못한 학생.",
  },
];

/** 가격 카드 포함 사항 */
const INCLUDED = [
  `${UIDAE_CONSULTING_SESSIONS} — 세특·탐구·진로활동 설계`,
  "학습계획 설계 — 담당 선생님이 직접",
  `스터디플래너 ${plannerCheck} 검사 · 코칭`,
  "생기북 앱 내신 성적관리",
  "모고 앱 모의고사 성적 누적 · 추이 관리",
  "수능 최저 대비 현재 위치 점검",
];

/** 범위를 정직하게 */
const HONEST = [
  "활동과 공부는 학생이 합니다. 대신 써 드리거나 대신 해 드리지 않습니다.",
  "학교생활기록부는 학교 선생님이 관찰해 씁니다. 저희는 어떤 활동을 언제 할지 설계하고, 계획대로 가고 있는지 점검합니다.",
  `합격을 보장하지 않습니다. 저희가 약속하는 것은 ${months}개월 동안의 설계와 매주 점검입니다.`,
];

const RELATED = [
  {
    href: "/tamgu",
    icon: FlaskConical,
    title: "탐구보고서 컨설팅",
    body: "탐구보고서 하나를 깊게 다듬는 데 집중하고 싶다면 — 과학고 눈높이의 탐구 지도.",
  },
  {
    href: "/susi/jonghap",
    icon: GraduationCap,
    title: "학생부종합전형 안내",
    body: "의대 학생부종합전형이 무엇을 보고 어떻게 선발하는지 전형 구조부터 정리했습니다.",
  },
  {
    href: "/ipkyul/uiye",
    icon: LineChart,
    title: "의예과 입시결과",
    body: "대학이 공시한 의예과 전형별 입결과 수능 최저학력기준을 한곳에서 봅니다.",
  },
];

const COURSE_LD = {
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": `${abs(UIDAE_CONSULTING_PATH)}#course`,
  name: "고1·고2 의대 컨설팅",
  description: DESCRIPTION,
  inLanguage: "ko-KR",
  url: abs(UIDAE_CONSULTING_PATH),
  provider: { "@id": `${SITE_URL}/#organization` },
  offers: [
    {
      "@type": "Offer",
      price: String(UIDAE_CONSULTING_PRICE_WON),
      priceCurrency: "KRW",
      category: `${UIDAE_CONSULTING_PERIOD} 관리`,
      availability: "https://schema.org/InStock",
      url: abs(UIDAE_CONSULTING_PATH),
    },
  ],
};

/** 매주 도는 관리 루프 — 헤어라인으로 나눈 다섯 칸. 모바일은 세로로 쌓인다. */
function WeekLoop() {
  return (
    <div className="mx-auto max-w-5xl">
      <ol className="grid border-l border-t border-hair-strong bg-paper-50 sm:grid-cols-5">
        {LOOP.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={s.label}
              className="relative flex items-center gap-4 border-b border-r border-hair-strong px-6 py-5 sm:flex-col sm:items-start sm:gap-0 sm:px-5 sm:py-7"
            >
              <span className="display tnum w-6 shrink-0 text-sm text-brass-600 sm:absolute sm:right-5 sm:top-7 sm:w-auto">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon className="h-5 w-5 shrink-0 text-jade-600" strokeWidth={1.5} />
              <div className="sm:mt-5">
                <p className="display text-[1rem] leading-snug text-ink-900">{s.label}</p>
                <p className="mt-1 text-[13px] font-light text-ink-500">{s.sub}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 flex items-center justify-center gap-2 text-center text-[13px] font-light text-ink-500">
        <Repeat2 className="h-4 w-4 shrink-0 text-jade-600" strokeWidth={1.5} />
        다섯 단계가 끝나면 다음 주 계획으로 다시 돌아갑니다.
      </p>
    </div>
  );
}

export default function UidaeConsultingPage() {
  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([{ name: "고1·고2 의대 컨설팅", path: UIDAE_CONSULTING_PATH }]),
          COURSE_LD,
        ]}
      />

      <PromoHero
        badge="고1·고2 의대 컨설팅"
        title="생기부·플래너·내신·모의고사,"
        highlight="선생님 한 명이 전부 관리합니다"
        body={`의대 입시는 학생부·내신·모의고사 어느 하나도 비워 둘 수 없습니다. 그런데 생기부 컨설팅, 내신 공부, 모의고사 관리를 따로 맡기면 서로의 일정을 모릅니다. T메디 의대 컨설팅은 담당 선생님 한 명이 활동 설계부터 주간 학습계획, 내신·모의고사 성적까지 ${months}개월 동안 함께 봅니다.`}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
        secondaryHref="#price"
        secondaryLabel="구성 · 비용 보기"
        Icon={Stethoscope}
        stats={[
          { icon: CalendarDays, label: `${UIDAE_CONSULTING_PERIOD} 관리` },
          { icon: FileText, label: UIDAE_CONSULTING_SESSIONS },
          { icon: ClipboardList, label: `플래너 ${plannerCheck} 검사` },
          { icon: LineChart, label: "내신 · 모의고사 관리" },
        ]}
      />

      {/* 문제 — 따로 맡기면 끊긴다 */}
      <PromoSection
        eyebrow="PROBLEM"
        EyebrowIcon={Unlink}
        title="따로 맡기면, 의대 준비는 어딘가에서 끊깁니다"
        subtitle="생기부·내신·모의고사는 각각 다른 곳에 맡기기 쉽습니다. 그런데 셋은 같은 시간표 안에서 서로 부딪칩니다."
        tone="muted"
      >
        <FeatureGrid items={PROBLEMS} columns={2} />
        <p className="mx-auto mt-12 max-w-2xl text-center text-[15px] font-light leading-[1.85] text-ink-500">
          그래서 T메디 의대 컨설팅은 이 넷을 선생님 한 명에게 맡깁니다.
        </p>
      </PromoSection>

      {/* 선생님이 관리하는 네 가지 */}
      <PromoSection
        eyebrow="WHAT WE MANAGE"
        EyebrowIcon={UserCheck}
        title="선생님이 직접 관리하는 네 가지"
        subtitle="생기부 컨설팅에 학습 플래너·내신·모의고사 관리가 함께 들어 있습니다. 따로 결제하는 항목은 없습니다."
      >
        <FeatureGrid items={SYSTEM} columns={2} />
      </PromoSection>

      {/* 매주 도는 루프 + 왜 한 사람인가 */}
      <PromoSection
        eyebrow="EVERY WEEK"
        EyebrowIcon={CalendarCheck}
        title="매주 이렇게 돌아갑니다"
        subtitle="계획을 짜 주는 사람과 검사하는 사람, 성적을 보는 사람이 같습니다."
        tone="muted"
      >
        <WeekLoop />

        {/* 강조 콜아웃 — 좌측 제이드 바 (app/tamgu 와 같은 문법) */}
        <div className="mx-auto mt-12 flex max-w-5xl bg-jade-50">
          <span className="w-[3px] shrink-0 bg-jade-600" />
          <div className="flex flex-col items-start gap-5 px-7 py-6 sm:flex-row sm:items-center">
            <UserCheck className="h-8 w-8 shrink-0 text-jade-600" strokeWidth={1.25} />
            <div>
              <h3 className="display text-[1.0625rem] leading-snug text-ink-900">
                왜 한 선생님이 전부 볼까요?
              </h3>
              <p className="mt-2.5 text-[14px] font-light leading-[1.85] text-ink-600">
                탐구 일정과 내신 일정을 따로 관리하면 서로 부딪칩니다. 한 사람이 전부 보기 때문에 시험 기간 전에는
                탐구 일정을 앞당기고, 모의고사에서 약한 영역이 보이면 그 과목의 주간 비중을 올리고, 수행평가 마감
                주에는 학습량을 조절합니다. 무엇을 줄이고 무엇을 당길지를 한 사람이 정합니다.
              </p>
            </div>
          </div>
        </div>
      </PromoSection>

      {/* 왜 고1·고2부터 */}
      <PromoSection
        eyebrow="WHY NOW"
        EyebrowIcon={Clock}
        title="고3에는 다시 채울 수 없는 것들이 있습니다"
        subtitle="학생부와 성적 흐름은 학년마다 쌓이고, 지나간 학기는 돌아오지 않습니다."
      >
        <CheckList items={WHY_NOW} />
      </PromoSection>

      {/* 3개월 흐름 */}
      <PromoSection
        eyebrow="PROCESS"
        EyebrowIcon={CalendarDays}
        title={`${UIDAE_CONSULTING_PERIOD}, 이렇게 진행됩니다`}
        subtitle="진단하고, 매주 실행을 붙잡고, 쌓인 성적으로 다음 학기를 설계합니다."
        tone="muted"
      >
        <RouteTimeline steps={TIMELINE} />
      </PromoSection>

      {/* 이런 학생에게 */}
      <PromoSection
        eyebrow="FOR WHOM"
        EyebrowIcon={Target}
        title="이런 학생에게 필요합니다"
      >
        <FeatureGrid items={FOR_WHOM} columns={3} />
      </PromoSection>

      {/* 비용 */}
      <div id="price" className="scroll-mt-32">
        <PromoSection
          eyebrow="PRICE"
          EyebrowIcon={Scale}
          title="구성과 비용"
          subtitle={`생기부 컨설팅과 학습 플래너·내신·모의고사 관리가 모두 들어 있는 ${UIDAE_CONSULTING_PERIOD} 가격입니다.`}
          tone="muted"
        >
          <PriceCard
            courseName="고1·고2 의대 컨설팅"
            price={UIDAE_CONSULTING_PRICE}
            priceSuffix={`/ ${UIDAE_CONSULTING_PERIOD}`}
            badge="담당 선생님 한 명이 전부 관리"
            BadgeIcon={UserCheck}
            items={INCLUDED}
            notes={[
              { icon: CalendarDays, label: `${UIDAE_CONSULTING_PERIOD} 관리` },
              { icon: ClipboardList, label: `플래너 ${plannerCheck} 검사` },
              { icon: LineChart, label: "내신 · 모의고사 앱 관리" },
            ]}
            href="#contact"
            label="상담 신청하기"
          />
          <div className="mt-12">
            <NoteBox
              title="할 수 있는 범위를 정직하게 말씀드립니다"
              items={HONEST}
              Icon={Scale}
            />
          </div>
        </PromoSection>
      </div>

      {/* 함께 보면 좋은 안내 */}
      <PromoSection
        eyebrow="MORE"
        EyebrowIcon={Compass}
        title="함께 보면 좋은 안내"
      >
        <LinkCards items={RELATED} columns={3} />
      </PromoSection>

      <FinalCTA
        title="고1·고2, 기록이 쌓이기 전에 설계하세요"
        body="지금 학년과 최근 내신·모의고사 성적, 관심 있는 분야를 알려 주시면 무엇부터 잡을지 상담에서 함께 정리해 드립니다."
        Icon={Stethoscope}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />
    </>
  );
}
