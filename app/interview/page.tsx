import type { Metadata } from "next";
import {
  BotMessageSquare,
  Brain,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  MonitorPlay,
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
import { FieldChooser } from "./_interview";
import { TeacherCards } from "../univ/_booking";
import { UNIV_TEACHERS } from "@/lib/mmi-schedule";
import {
  CLASS_FEATURES,
  CLASS_FLOW,
  CLASS_INCLUDES,
  CLASS_PRICE,
  SESSION_HOURS_LABEL,
} from "@/lib/interview-types";
import { UNIV_PAGES, UNIV_TOTALS } from "@/lib/univ";
import { FIELD_PAGES } from "@/lib/field-registry";
import { fieldTotals } from "@/lib/field-interview";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/interview" },
  title: "의대·치대·한의대·약대·수의대 면접 수업 | T Medi — 의약학 면접 대학별 대비",
  description:
    "의대 면접부터 치대·한의대·약대·수의대 면접까지, 2027학년도 수시 면접을 실시하는 대학과 면접일을 계열별로 정리했습니다. 계열을 고르면 대학별 면접 방식·1차 발표일·면접일이 나옵니다. 1:1 줌 면접 수업은 1회 1시간 40분. tmedi.kr",
};

/** 계열 카드 소개 문구. 대학 수·면접일은 데이터에서 계산한다. */
const TAGLINES: Record<string, string> = {
  uidae: "MMI · 인적성 · 제시문 세 유형이 대학마다 갈립니다. 유형부터 확인해야 하는 계열입니다.",
  chidae: "같은 대학이라도 의예과와 평가영역·배점이 따로입니다. 제시문은 연세대 하나뿐입니다.",
  hanuidae: "면접이 없는 대학이 절반 가까이 됩니다. 실시 대학은 현장 문항형과 생기부 기반으로 나뉘고, 수능 전에 끝나는 면접도 있습니다.",
  yakdae: "면접 반영이 20~60%로 갈리고, 면접일이 10월부터 12월까지 퍼져 있습니다. 대부분 생기부를 놓고 묻습니다.",
  suuidae: "면접 반영은 20~30%로 좁고, 생기부 기반 면접이 대부분입니다. 면접이 없는 대학도 있습니다.",
};

/** 계열과 무관하게 같은 준비 순서. 계열별 차이는 각 계열 메인에 있다. */
const PREP_STEPS = [
  {
    title: "계열과 지원 대학 확정",
    body:
      "같은 대학이라도 의예과·치의예과·한의예과·약학과·수의예과의 면접 방식과 배점이 따로 정해져 있습니다. 계열을 고르고, 그 안에서 지원 대학의 면접 형식부터 확인합니다.",
  },
  {
    title: "유형별 기본기",
    body:
      "제시문 독해 루틴, MMI 스테이션 대응, 생기부 예상 질문 정리 — 유형이 다르면 훈련도 다릅니다. 유형에 맞는 답변 골격을 먼저 만듭니다.",
  },
  {
    title: "생기부 전수 점검",
    body:
      "어떤 계열이든 생기부 질문은 나옵니다. 3년치 기재 내용을 문장 단위로 끊어 예상 질문과 답변 근거를 만들어 둡니다.",
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

function range(days: string[]) {
  const s = [...days].sort();
  return { first: s[0] ?? null, last: s[s.length - 1] ?? null };
}

export default function InterviewHubPage() {
  const uidae = {
    href: "/interview/uidae",
    name: "의대 면접",
    unitLabel: "의예과",
    tagline: TAGLINES.uidae,
    count: UNIV_TOTALS.withInterview - UNIV_TOTALS.noInterview,
    ...range(
      UNIV_PAGES.flatMap((u) => (u.interview?.tracks ?? []).map((t) => t.interview)).filter(
        (d): d is string => Boolean(d),
      ),
    ),
  };
  const fields = Object.values(FIELD_PAGES).map((f) => ({
    href: f.base,
    name: f.label,
    unitLabel: f.unitLabel,
    tagline: TAGLINES[f.key],
    count: fieldTotals(f.univs).withInterview,
    ...range(
      f.univs.flatMap((u) => u.tracks.filter((t) => t.interview && t.date).map((t) => t.date!)),
    ),
  }));
  const items = [uidae, ...fields];
  const totalUnivs = items.reduce((n, f) => n + f.count, 0);

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([{ name: "의약학 면접", path: "/interview" }]),
          article({
            path: "/interview",
            headline: "의대·치대·한의대·약대·수의대 면접 — 계열별 대학 면접 대비",
            description:
              "2027학년도 수시 의·치·한·약·수 면접을 실시하는 대학과 면접일을 계열별로 정리했습니다. 계열을 고르면 대학별 면접 방식과 일정이 나옵니다.",
          }),
        ]}
      />
      <PromoHero
        badge="의약학 면접 수업 · 의·치·한·약·수"
        title="의약학 면접은"
        highlight="계열마다, 대학마다 다른 시험입니다"
        body="같은 대학 안에서도 의예과와 치의예과, 한의예과의 면접 방식과 배점이 따로 정해져 있습니다. 계열을 먼저 고르세요. 그 계열의 면접 실시 대학이 면접일 순으로 나오고, 대학을 누르면 요강 기준 면접 방식과 일정이 전부 나옵니다."
        primaryHref="#fields"
        primaryLabel="계열 고르기"
        secondaryHref="#contact"
        secondaryLabel="면접 수업 문의하기"
        Icon={MessagesSquare}
        stats={[
          { icon: GraduationCap, label: `5개 계열 · 면접 실시 ${totalUnivs}개 모집단위` },
          { icon: ClipboardCheck, label: "요강 기준 방식 · 일정 수록" },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      <div id="fields" className="scroll-mt-24" />
      <PromoSection
        eyebrow="STEP 1"
        EyebrowIcon={GraduationCap}
        title="계열을 고르세요"
        subtitle="계열을 누르면 면접을 실시하는 대학이 면접일 순으로 나옵니다. 거기서 지원 대학을 고르면 전형별 면접 방식·1차 발표일·면접일이 나옵니다."
      >
        <FieldChooser items={items} />
      </PromoSection>

      <PromoSection
        eyebrow="PROCESS"
        EyebrowIcon={Brain}
        title="준비 순서"
        subtitle="계열이 달라도 쌓는 순서는 같습니다. 계열 확인에서 실전 모의면접까지 다섯 단계입니다."
        tone="muted"
      >
        <StepList steps={PREP_STEPS} />
      </PromoSection>

      <PromoSection
        eyebrow="CLASS"
        EyebrowIcon={MonitorPlay}
        title="면접 수업은 이렇게 진행합니다"
        subtitle={`예약부터 과제까지 한 사이클입니다. 1회 ${SESSION_HOURS_LABEL}, 줌으로 1:1 진행합니다. 의·치·한·약·수 모든 계열의 수업 안내는 이 페이지 한 곳에 모아 두었습니다.`}
      >
        <FeatureGrid items={CLASS_FEATURES} columns={2} />
        <div className="mt-16">
          <StepList steps={CLASS_FLOW} />
        </div>
        <div className="mt-16">
          <PriceCard
            courseName="의약학 면접 1:1 수업"
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
        subtitle="제시문 면접은 박은우 선생님, 그 밖의 면접(인성·서류 기반·MMI)은 이세인 선생님이 맡습니다. 의·치·한·약·수 모두 같은 기준이며, 대학별 담당은 각 대학 페이지에 있습니다."
        tone="muted"
      >
        <TeacherCards teachers={[UNIV_TEACHERS.general, UNIV_TEACHERS.jesimun]} />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={MessagesSquare} title="함께 보기">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/interview/ai",
              icon: BotMessageSquare,
              title: "AI 모의면접",
              body: "혼자 말로 꺼내 보는 연습. 질문을 받고 답한 뒤 바로 피드백을 받습니다.",
            },
            {
              href: "/univ",
              icon: GraduationCap,
              title: "대학별 전형 · 면접 안내",
              body: "전국 의대의 전형 구조, 모집인원, 수능최저, 전형별 면접 일정을 대학별로.",
            },
            {
              href: "/ipkyul",
              icon: ClipboardCheck,
              title: "의치한약수 입시결과",
              body: "계열·대학·전형별 모집인원과 공시된 입결을 한 곳에.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "계열별 면접 실시 대학 수와 면접일 범위는 각 대학 2027학년도 수시 모집요강에서 정리한 자료로 계산했습니다. 대학별 근거와 출처는 각 대학 페이지 하단에 있습니다.",
          "면접일이 요강에 기재되지 않은 대학은 면접일 범위 계산에서 빠집니다. 추정치로 채우지 않습니다.",
          "모집인원과 일정은 대학 사정에 따라 변경될 수 있습니다. 지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title="면접장에서 흔들리지 않도록"
        body={`지원 계열과 대학의 면접 방식에 맞춰 과제와 모의면접을 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={MessagesSquare}
        primaryHref="#contact"
        primaryLabel="면접 수업 문의하기"
      />
    </>
  );
}
