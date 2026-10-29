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
  Wallet,
} from "lucide-react";
import {
  CompareTable,
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
import { AdmissionsCalendar } from "../_site/admissions-calendar";
import { ConceptStrip, FieldChooser, PricePlans, ShareCard } from "./_interview";
import { TeacherCards } from "../univ/_booking";
import { UNIV_TEACHER_GROUPS } from "@/lib/mmi-schedule";
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
  // 블로그·메신저 공유와 네이버 노출용. 본문에도 같은 이미지를 띄운다(ShareCard).
  openGraph: {
    type: "website",
    url: "/interview",
    siteName: "T메디",
    locale: "ko_KR",
    images: [
      {
        url: "https://tmedi.kr/og/concept/concept.png",
        width: 1200,
        height: 630,
        alt: "AI 모의면접을 먼저 보고, 그 기록으로 선생님이 수업합니다 — 1회 35만원, 3회 선결제 99만원",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["https://tmedi.kr/og/concept/concept.png"] },
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

/** 면접은 공부가 아니라 훈련이다 — AI 가 반복(임계량)을 맡고 선생님이 판단을 맡는
 *  구조. 네 단계 중 둘만 유료 수업이다. 계열이 달라도 순서는 같다. */
const PREP_STEPS = [
  {
    title: "사전 과제 — 수업 아님",
    body:
      "생기부를 올리고 지원 대학·전형을 확정한 뒤, AI 말하기 연습을 세 번 해 둡니다. 이걸 해 두어야 1회차가 정보 수집이 아니라 진단으로 시작합니다. 미완료 상태로는 1회차를 잡지 않습니다.",
  },
  {
    title: "1회차 — 진단과 설계",
    body:
      "짧은 진단 모의로 무너지는 지점을 먼저 특정합니다. 그다음 생기부에서 쓸 소재를 고르고, 지원 대학의 평가축에 맞춰 답변 뼈대를 세웁니다. 강원대는 적성 60, 경희대는 인성 50·전공적합성 50 — 같은 생기부라도 무엇을 먼저 꺼낼지가 달라집니다.",
  },
  {
    title: "AI 훈련 — 임계량 채우기",
    body:
      "선생님이 회차를 처방합니다. 회차는 최소치이고 통과 기준은 따로 있습니다 — 카드별로 60초 안에 결론·근거·사례·배움 구조가 세 번 연속 나와야 합니다. 부족하면 추가 처방이 나가고, 추가 비용은 없습니다.",
  },
  {
    title: "2회차 — 실전 점검",
    body:
      "지원 대학 형식 그대로 모의면접을 돌리고 즉시 교정합니다. 취약한 소재를 다시 손보고, 당일 입실 동선과 모르는 질문이 나왔을 때의 처리까지 맞춰 둡니다.",
  },
  {
    title: "3회차 — 당일 리허설 (선택)",
    body:
      "면접 직전에 복장을 갖추고 실제 시간표대로 한 번 더 돌립니다. 3회 선결제를 하신 분은 이 회차가 포함되고, 1회씩 결제하신 분은 필요할 때만 잡으시면 됩니다.",
  },
];

/** AI 와 선생님의 역할 분담. 이 경계가 흐려지면 '싼 모의면접'이 된다. */
const ROLE_ROWS = [
  ["무엇을 보나", "구조 · 분량 · 말 빠르기 · 시선", "소재 선택 · 서사 · 진정성 · 태도"],
  ["횟수", "무제한 — 수업에 포함", "1회부터 · 보통 2~3회"],
  ["언제", "수업 전에 먼저, 수업 사이에도 계속", "AI 기록이 쌓인 뒤에"],
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

      <AdmissionsCalendar
        id="interview-calendar"
        kinds={["announce", "interview"]}
        eyebrow="INTERVIEW CALENDAR"
        title={
          <>
            2027 의·치·한·약·수
            <br />
            1차 발표 · 면접일
          </>
        }
        lead={
          <>
            계열을 고르면 그 계열 일정만 남습니다. 날짜를 누르면 대학과 전형이 나옵니다.
            <br />
            2027학년도 수시 · 실제 고사일은 2026년입니다.
          </>
        }
      />

      <ConceptStrip sessionLabel={SESSION_HOURS_LABEL} />

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
        title="AI 모의면접을 보고, 그 기록으로 수업합니다"
        subtitle="수업 시간에 모의면접을 처음 돌리면 100분 중 절반이 녹화로 사라집니다. 모의면접은 AI 가 미리 받아 두고, 선생님은 그 기록에서 무엇이 무너졌는지만 짚습니다. AI 는 따로 파는 상품이 아니라 수업의 교재입니다."
        tone="muted"
      >
        <StepList steps={PREP_STEPS} />
        <div className="mt-16">
          <CompareTable
            head={["", "AI 모의면접", "선생님 1:1"]}
            rows={ROLE_ROWS}
            caption="경계를 이렇게 나눕니다. AI 는 '자연스러움' 을 점수로 매기지 않습니다 — 점수를 올리는 방향으로 훈련하면 매끄럽지만 외운 티가 나는 답변이 나오고, 그건 면접위원이 깎는 지점입니다."
          />
        </div>
        <div className="mt-14">
          <NoteBox
            title="실전 점검 회차의 시점은 대학이 정합니다"
            items={[
              "의대 72개 전형의 1단계 발표에서 면접까지는 중앙값 9일이지만 편차가 큽니다.",
              "3~4일인 대학(을지대·연세대 미래·부산대·인하대 등)은 발표를 보고 시작하면 유형을 익히다 끝납니다. 2회차를 발표 전에 끝내야 합니다.",
              "발표 전에 하면 떨어질 수도 있는 상태에서 비용을 쓰게 됩니다. 이 선택은 먼저 설명드리고 함께 정합니다.",
              "5~8일이면 발표 직후, 9일 이상이면 발표 뒤에 여유 있게 잡습니다.",
            ]}
            tone="warn"
            Icon={CalendarDays}
          />
        </div>
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
              { icon: ClipboardCheck, label: CLASS_PRICE.aiMeta },
              {
                icon: CalendarDays,
                label: `${CLASS_PRICE.packSuffix.replace("/ ", "")} ${CLASS_PRICE.packLabel} · ${CLASS_PRICE.packUnit}`,
              },
            ]}
            href="#contact"
            label="면접 수업 문의하기"
          />
          <p className="mx-auto mt-6 max-w-2xl text-center text-[12px] font-light leading-[1.8] text-ink-500">
            처음이시면 1회만 해 보셔도 됩니다. {CLASS_PRICE.refundRule}
          </p>
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="PRICING"
        EyebrowIcon={Wallet}
        title="비용"
        subtitle="AI 모의면접이 반복을 맡으면 선생님 회차가 줄고 비용이 내려갑니다. 대치동 의대 MMI 특강은 6시간 180만원, 1:1 12시간은 240만원 선입니다. 저희는 1회 35만원이고, 3회를 미리 잡으시면 회당 2만원 싸집니다."
      >
        <PricePlans sessionLabel={SESSION_HOURS_LABEL} />
        <div className="mt-16">
          <ShareCard
            src="/og/concept/compare.png"
            alt="의약학 면접 수업 비교 — 대형 학원 1:1 은 12시간 240만원, T메디는 선생님 100분 1회 35만원에 AI 모의면접 무제한 포함. 3회 선결제는 99만원으로 회당 33만원입니다"
            caption="1회만 해 보고 판단하셔도 됩니다 · 비교 수치는 2026년 언론 보도 기준"
          />
        </div>
        <div className="mt-16">
          <ShareCard
            src="/og/concept/pricing.png"
            alt="T메디 의약학 면접 수업 비용 — 선생님 1:1 100분 1회 35만원, 3회 선결제 99만원(회당 33만원), AI 모의면접 무제한 포함"
            caption="비용 한 장 요약 · 저장하거나 공유해서 쓰십시오"
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="INSTRUCTORS"
        EyebrowIcon={Users}
        title="담당 강사"
        subtitle="의대 면접은 의대 출신 류지연·이세인 선생님이 맡고, 제시문 면접은 과목 특성상 박은우 선생님이 따로 맡습니다. 대학별 담당은 각 대학 페이지에 있습니다."
        tone="muted"
      >
        {/* 약력(detailed)은 이 페이지와 수업 팝업에서만 펼친다 — 대학 페이지에 깔면 본문 중복이 된다 */}
        <TeacherCards
          teachers={[...UNIV_TEACHER_GROUPS.uidae, ...UNIV_TEACHER_GROUPS.jesimun]}
          detailed
        />
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
