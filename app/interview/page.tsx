import type { Metadata } from "next";
import {
  BarChart3,
  Brain,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HeartHandshake,
  MessagesSquare,
  MonitorPlay,
  Scale,
  ScrollText,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  FeatureGrid,
  FinalCTA,
  LinkCards,
  PriceCard,
  PromoHero,
  PromoSection,
  SourceNote,
  StepList,
} from "../_site/components";
import { UnivStatRow } from "../univ/_univ";
import { NoInterviewRow, TypeChooser, UnivFinder } from "./_interview";
import { TeacherCards } from "../univ/_booking";
import {
  CLASS_FLOW,
  CLASS_INCLUDES,
  CLASS_PRICE,
  finderByZone,
  INTERVIEW_TYPES,
  noInterviewUnivs,
  SESSION_HOURS_LABEL,
  typeCounts,
} from "@/lib/interview-types";
import { UNIV_TOTALS } from "@/lib/univ";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/interview" },
  title: "의대 면접 수업 | T Medi — MMI·인적성·제시문 유형별 대비",
  description:
    "의대 면접은 대학마다 다른 시험입니다. MMI(다중미니면접)·인적성(생기부 기반)·제시문 세 유형으로 나눠 실시 대학과 준비법을 정리했습니다. 1:1 줌 면접 수업은 1회 2시간 30분. tmedi.kr",
};

/** 유형과 무관하게 모든 의대 면접에 공통인 부분. 유형별 내용은 하위 페이지로 보낸다. */
const COMMON = [
  {
    icon: Scale,
    title: "면접 비중이 곧 역전 폭입니다",
    body:
      "면접 5%인 대학과 50%인 대학이 함께 있습니다. 1단계 성적을 뒤집을 수 있는 폭이 대학마다 몇 배씩 차이 나므로, 지원 조합을 짤 때 반영비율부터 봐야 합니다.",
  },
  {
    icon: TriangleAlert,
    title: "과락 규정이 있는 대학이 있습니다",
    body:
      "전남대·제주대·계명대·경북대처럼 특정 영역에서 최하 등급을 받거나 기준 점수에 못 미치면 전형총점과 관계없이 불합격시키는 대학이 있습니다.",
  },
  {
    icon: FileText,
    title: "블라인드가 기본입니다",
    body:
      "교복 착용, 출신 고교·부모 직업·거주 지역 언급이 대부분의 대학에서 금지됩니다. 습관적으로 학교 이름을 말하면 그 자체로 감점됩니다.",
  },
  {
    icon: CalendarDays,
    title: "1차 발표와 면접일 사이가 준비 기간의 전부입니다",
    body:
      "대부분 일주일에서 열흘입니다. 그 기간에 처음 시작하면 유형을 익히다 끝나므로, 1차 발표 전에 유형별 기본기를 만들어 두어야 합니다.",
  },
  {
    icon: Brain,
    title: "아는 것과 말할 수 있는 것은 다릅니다",
    body:
      "내용을 알아도 두괄식으로 5분 안에 정리해 말하는 것은 별개의 기술입니다. 말로 꺼내 보는 횟수가 그대로 점수가 됩니다.",
  },
  {
    icon: ClipboardCheck,
    title: "결시는 곧 불합격입니다",
    body:
      "면접 결시자를 불합격 처리한다고 요강에 명시한 대학이 대부분입니다. 같은 날 다른 대학 면접과 겹치는지 지원 전에 확인해야 합니다.",
  },
];

const PREP_STEPS = [
  {
    title: "지원 대학의 면접 유형 확인",
    body:
      "같은 '학생부종합 면접'이라도 대학마다 형식이 다릅니다. 지원할 대학이 MMI인지, 생기부 기반 인·적성인지, 제시문인지부터 확정합니다.",
  },
  {
    title: "유형별 기본기",
    body:
      "유형에 맞는 답변 골격을 먼저 만듭니다. 제시문 독해 루틴, MMI 스테이션 대응, 생기부 예상 질문 정리 — 유형이 다르면 훈련도 다릅니다.",
  },
  {
    title: "생기부 전수 점검",
    body:
      "어떤 유형이든 생기부 질문은 나옵니다. 3년치 기재 내용을 문장 단위로 끊어 예상 질문과 답변 근거를 만들어 둡니다.",
  },
  {
    title: "대학별 빈출 문항 실전 연습",
    body:
      "지원 대학의 기출·빈출 문항으로 반복합니다. 반박과 꼬리질문 대응, 시간 관리 감각을 여기서 만듭니다.",
  },
  {
    title: "1차 발표 후 실전 모의면접",
    body:
      "발표 직후부터 면접 전날까지 실전과 동일한 조건으로 모의면접을 돌리고, 표현·논리·태도를 즉시 교정합니다.",
  },
];

export default function InterviewPage() {
  const chooser = INTERVIEW_TYPES.map((t) => {
    const c = typeCounts(t.key);
    return {
      href: t.href,
      name: t.name,
      tagline: t.tagline,
      count: c.primary,
      also: c.also,
    };
  });
  const noInterview = noInterviewUnivs();
  const withInterview = UNIV_TOTALS.withInterview - UNIV_TOTALS.noInterview;

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([{ name: "면접 수업", path: "/interview" }]),
          article({
            path: "/interview",
            headline: "의대 면접 수업 — MMI·인적성·제시문 유형별 대비",
            description:
              "의대 면접은 대학마다 다른 시험입니다. MMI(다중미니면접)·인적성(생기부 기반)·제시문 세 유형으로 나눠 실시 대학과 준비법을 정리했습니다.",
          }),
        ]}
      />
      <PromoHero
        badge="의대 면접 수업 · 유형별 대비"
        title="의대 면접은"
        highlight="대학마다 다른 시험입니다"
        body="어떤 대학은 면접실을 세 번 옮기고, 어떤 대학은 생기부만 놓고 10분 대화하며, 어떤 대학은 그 자리에서 제시문을 읽힙니다. 준비 방법이 완전히 다릅니다. 지원 대학이 어느 유형인지부터 확인하고, 그 유형에 맞춰 훈련하세요."
        primaryHref="#contact"
        primaryLabel="면접 수업 문의하기"
        secondaryHref="/univ"
        secondaryLabel="대학별 전형 보기"
        Icon={MessagesSquare}
        stats={[
          { icon: Users, label: "MMI" },
          { icon: HeartHandshake, label: "인·적성" },
          { icon: ScrollText, label: "제시문" },
        ]}
      />

      <PromoSection
        eyebrow="FIND"
        EyebrowIcon={GraduationCap}
        title="지원 대학부터 찾으세요"
        subtitle="내 면접이 무슨 유형인지 모르는 것이 정상입니다. 대학을 누르면 그 대학의 면접 방식과 일정이 나옵니다."
      >
        <UnivFinder zones={finderByZone()} />
      </PromoSection>

      <PromoSection
        eyebrow="TYPES"
        EyebrowIcon={MessagesSquare}
        title="유형부터 보고 싶다면"
        subtitle="세 유형 중 하나를 고르면 그 방식으로 면접을 보는 대학과 전형, 준비 방법을 볼 수 있습니다."
        tone="muted"
      >
        <TypeChooser items={chooser} />
      </PromoSection>

      <UnivStatRow
        items={[
          {
            label: "면접 정리 대학",
            value: String(UNIV_TOTALS.withInterview),
            unit: "개교",
            sub: "요강 기준 면접 방식·일정 수록",
          },
          {
            label: "면접 실시",
            value: String(withInterview),
            unit: "개교",
            sub: "2027학년도 수시 의예과",
          },
          {
            label: "면접 미실시",
            value: String(UNIV_TOTALS.noInterview),
            unit: "개교",
            sub: "면접 준비가 필요 없는 대학",
          },
          {
            label: "MMI 특강 개설",
            value: String(UNIV_TOTALS.withClass),
            unit: "개교",
            sub: "1단계 발표일 기준 수업 캘린더 운영",
          },
        ]}
        caption="2027학년도 수시 모집요강 기준. 대학별 근거와 출처는 각 대학 페이지 하단에 있습니다."
      />

      <PromoSection
        eyebrow="COMMON"
        EyebrowIcon={ClipboardCheck}
        title="유형과 상관없이 공통인 것"
        subtitle="어느 대학을 쓰든 먼저 확인해야 하는 여섯 가지입니다."
      >
        <FeatureGrid items={COMMON} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="PROCESS"
        EyebrowIcon={Brain}
        title="준비 순서"
        subtitle="유형 확인에서 실전 모의면접까지, 다섯 단계로 쌓습니다."
        tone="muted"
      >
        <StepList steps={PREP_STEPS} />
      </PromoSection>

      <PromoSection
        eyebrow="CLASS"
        EyebrowIcon={MonitorPlay}
        title="면접 수업은 이렇게 진행합니다"
        subtitle={`예약부터 과제까지 한 사이클입니다. 1회 ${SESSION_HOURS_LABEL}, 줌으로 1:1 진행합니다. 수업 안내는 이 페이지 한 곳에 모아 두었습니다.`}
      >
        <StepList steps={CLASS_FLOW} />
        <div className="mt-16">
          <PriceCard
            courseName="의대 면접 1:1 수업"
            price={CLASS_PRICE.label}
            priceSuffix={CLASS_PRICE.suffix}
            badge={CLASS_PRICE.unit}
            BadgeIcon={MonitorPlay}
            items={CLASS_INCLUDES}
            notes={[
              { icon: MonitorPlay, label: `줌 온라인 · 1회 ${SESSION_HOURS_LABEL}` },
              { icon: ClipboardCheck, label: "수업 전·후 과제 포함" },
              { icon: CalendarDays, label: "묶음·선납 없음" },
            ]}
            href="#contact"
            label="면접 수업 문의하기"
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="INSTRUCTORS"
        EyebrowIcon={Users}
        title="담당 강사"
        subtitle="스테이션·문항 성격에 따라 담당을 나눕니다. 두 강사가 같은 학생을 번갈아 보는 구조입니다."
        tone="muted"
      >
        <TeacherCards />
      </PromoSection>

      <PromoSection
        eyebrow="NO INTERVIEW"
        EyebrowIcon={TriangleAlert}
        title="2027학년도에 면접이 없는 의대"
        subtitle="이 두 대학은 의예과 수시 전 전형에서 면접을 실시하지 않습니다. 준비의 무게중심이 교과·서류로 완전히 옮겨 갑니다."
      >
        <NoInterviewRow univs={noInterview} />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={BarChart3} title="함께 보기" tone="muted">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/interview/mmi",
              icon: CalendarDays,
              title: "MMI 면접 대비",
              body: "실시 대학과 방식, 최저점 관리 훈련, 대학별 수업 일정까지 한 페이지에.",
            },
            {
              href: "/univ",
              icon: GraduationCap,
              title: "대학별 전형 · 면접 안내",
              body: "전국 의대의 전형 구조, 모집인원, 수능최저, 전형별 면접 일정을 대학별로.",
            },
            {
              href: "/susi",
              icon: ClipboardCheck,
              title: "수시 전형 총정리",
              body: "교과·종합·논술 전형별 구조와 지원 전략. 면접이 어느 전형에서 반영되는지부터.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "면접 방식·일정은 각 대학 2027학년도 수시 모집요강에서 정리했습니다. 대학별 근거와 출처는 각 대학 페이지 하단에 있습니다.",
          "유형 분류는 요강에 적힌 면접 방식 문장을 기준으로 했습니다. 한 대학이 두 방식을 함께 쓰는 경우 주된 형식으로 분류하고, 나머지 유형 페이지에는 '함께 보는 대학'으로 실었습니다.",
          "요강에서 확인되지 않은 날짜·시간·면접위원 수는 비워 두었습니다. 추정치로 채우지 않습니다.",
          "모집인원과 일정은 대학 사정에 따라 변경될 수 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title="면접장에서 흔들리지 않도록"
        body={`지원 대학의 면접 유형에 맞춰 과제와 모의면접을 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={MessagesSquare}
        primaryHref="#contact"
        primaryLabel="면접 수업 문의하기"
      />
    </>
  );
}
