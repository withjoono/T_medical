import type { Metadata } from "next";
import {
  Users,
  Target,
  Repeat,
  Layers,
  CalendarDays,
  MessagesSquare,
  Clock,
  UserRound,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  NoteBox,
  PriceCard,
  FinalCTA,
  SourceNote,
} from "../_site/components";
import { UnivCards, TeacherCards } from "./_mmi";
import { UNIVS, TUITION, slotsForDate, univDays } from "@/lib/mmi-schedule";

export const metadata: Metadata = {
  alternates: { canonical: "/mmi" },
  title: "2027 의대 MMI 면접 특강 | T Medi — 대학별 1:1 실전 대비",
  description:
    "2027학년도 의대 면접, 1차 발표부터 면접일까지의 짧은 구간에 맞춘 대학별 1:1 MMI 특강. 서울대·고려대·울산대·한림대·계명대·인제대 등 15개 의대의 실제 일정으로 수업 캘린더와 예약 현황을 공개합니다. 박은우·강정규 담당. tmedi.kr",
};

const KEYS = [
  {
    icon: Target,
    title: "답이 아니라 판단 프레임",
    body: "MMI는 정답을 맞히는 시험이 아니라, 어떤 원칙으로 이해관계를 저울질하는지를 봅니다. 모범답안 암기는 꼬리질문에서 그대로 무너집니다. 쟁점 특정 → 당사자 열거 → 판단 기준 → 결론 → 한계 인정. 이 골격이 준비 2분 안에 자동으로 나오게 만듭니다.",
  },
  {
    icon: Repeat,
    title: "꼬리질문 내성 — 1:1인 이유",
    body: "변별은 첫 답변이 아니라 면접관이 반박한 다음에 갈립니다. 고득점은 버티기가 아니라, 새 정보가 들어오면 근거를 대고 입장을 조정하는 쪽입니다. 단체 수업은 한 사람당 꼬리질문 서너 개가 한계입니다. 1:1이라 한 문항을 끝까지 파고듭니다.",
  },
  {
    icon: Layers,
    title: "대학별 방 구조가 전부",
    body: "서울대는 제시문 여러 개로 약 60분, 고려대는 인적성 8분 두 번, 한림·계명은 세 방을 각 10분씩 돕니다. 방 개수와 시간이 다르면 훈련 설계가 통째로 달라집니다. 일반론 MMI 강의로는 메울 수 없는 간격입니다.",
  },
  {
    icon: CalendarDays,
    title: "기간이 곧 상품이다",
    body: "1차 발표부터 면접까지 짧게는 3일, 길어야 3주입니다. 이 구간의 밀도가 결과를 정합니다. 대학별로 발표일에서 역산한 커리큘럼을 짜고, 남은 자리를 이 페이지에 그대로 공개합니다.",
  },
  {
    icon: MessagesSquare,
    title: "모의상황은 혼자 못 한다",
    body: "인성·상황 방은 혼자 연습이 가능하지만, 모의상황 방은 상대역이 있어야 성립합니다. 환자·보호자·동료 역을 맡은 상대에게 실제로 말을 건네는 훈련을 세션마다 넣습니다.",
  },
  {
    icon: Users,
    title: "생기부는 면접의 절반",
    body: "여러 대학이 방 하나를 서류 기반으로 씁니다. 제출한 생기부에서 나올 질문을 먼저 소진시켜 두면, 그 방은 점수를 잃지 않는 방이 됩니다.",
  },
];

export default function MmiHubPage() {
  // 대학별 구간은 서로 겹친다. 단순 합산하면 같은 자리를 여러 번 세게 되므로
  // 전체 수치는 날짜 합집합에서 한 번만 센다.
  const allDays = [...new Set(UNIVS.flatMap((u) => univDays(u)))];
  const totalOpen = allDays.reduce(
    (acc, d) => acc + slotsForDate(d).filter((s) => s.state === "open").length,
    0,
  );
  const core = UNIVS.filter((u) => u.style === "core");
  const others = UNIVS.filter((u) => u.style !== "core");

  return (
    <>
      <PromoHero
        badge="2027 의대 면접 특강 · 대학별 1:1"
        title="1차 발표부터 면접까지,"
        highlight="그 사이가 전부입니다"
        body="의대 면접은 벼락치기가 안 되는 시험이지만, 실제로 주어지는 시간은 짧게는 사흘입니다. T메디는 15개 의대의 실제 1단계 발표일과 면접일에 맞춰 수업 구간을 열어 두고, 남은 자리를 그대로 공개합니다. 1:1 개인지도이며, 1차 불합격으로 풀리는 자리의 대기 예약도 함께 받습니다."
        primaryHref="#contact"
        primaryLabel="대학별 자리 문의하기"
        secondaryHref="/interview"
        secondaryLabel="면접 수업 전체 보기"
        Icon={Users}
        stats={[
          { icon: CalendarDays, label: "15개 의대" },
          { icon: UserRound, label: "1:1 개인지도" },
          { icon: Clock, label: `예약 가능 ${totalOpen}회` },
        ]}
      />

      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={Layers}
        title="MMI 실시 의대"
        subtitle="스테이션을 도는 다면·다중 면접을 실시하는 대학입니다. 방 개수와 시간이 대학마다 다릅니다."
      >
        <UnivCards univs={core} />
      </PromoSection>

      <PromoSection
        eyebrow="ALSO"
        EyebrowIcon={MessagesSquare}
        title="제시문 · 인성면접 실시 의대"
        subtitle="MMI는 아니지만 면접 비중이 큰 대학입니다. MMI 커리큘럼을 그대로 쓰면 안 되는 곳들이라 따로 묶었습니다."
        tone="muted"
      >
        <UnivCards univs={others} />
      </PromoSection>

      <PromoSection
        eyebrow="WHAT MATTERS"
        EyebrowIcon={Target}
        title="MMI 수업의 핵심은 무엇인가"
        subtitle="문항을 많이 푸는 것이 아닙니다. 어떤 문항이 나와도 무너지지 않는 구조를 만드는 일입니다."
      >
        <FeatureGrid items={KEYS} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="INSTRUCTORS"
        EyebrowIcon={UserRound}
        title="담당 강사"
        subtitle="스테이션 성격에 따라 담당을 나눕니다. 두 강사가 같은 학생을 번갈아 보는 구조입니다."
        tone="muted"
      >
        <TeacherCards />
      </PromoSection>

      <PromoSection
        eyebrow="TUITION"
        EyebrowIcon={Clock}
        title="수업료"
        subtitle="1:1 개인지도이며 회차 단위로 결제합니다. 묶음 결제나 선납을 요구하지 않습니다."
      >
        <PriceCard
          courseName="의대 MMI 면접 특강"
          price={TUITION.perSessionLabel}
          priceSuffix={`/ ${TUITION.unit}`}
          badge="대기 예약은 무료 · 자리 확정 후 결제"
          BadgeIcon={CalendarDays}
          items={[
            "강사 1명 : 학생 1명, 1회 2시간 30분. 한 문항을 끝까지 파고드는 꼬리질문 훈련",
            "지원 대학의 방 구성·시간에 맞춘 실전 리허설",
            "제출 생기부 기반 예상 질문 도출 및 답변 정리",
            "세션마다 영상 기록 + 표현·태도·시선 교정",
            "박은우(제시문·구술) · 강정규(인성·상황·모의면접) 분담",
            "1차 발표일 기준 역산 커리큘럼 설계",
          ]}
          notes={[
            { icon: Clock, label: "1회 2시간 30분 · 1:1" },
            { icon: CalendarDays, label: "평일 18:00–23:00 2타임 / 휴일 08:30–23:00 5타임" },
          ]}
          href="#contact"
          label="자리 확인하고 상담하기"
        />
      </PromoSection>

      <PromoSection
        eyebrow="WAITLIST"
        EyebrowIcon={Repeat}
        title="1차 불합격 누수 예약"
        subtitle="차 있는 자리 중 일부는 1단계 결과를 기다리는 예약입니다. 탈락이 확정되면 그 자리가 풀립니다."
        tone="muted"
      >
        <NoteBox
          title="대기 예약은 이렇게 운영합니다"
          tone="warn"
          Icon={Repeat}
          items={[
            "대기 순번을 걸어 두면 자리가 풀리는 즉시 순번대로 연락드립니다. 접수에 비용이 들지 않습니다.",
            "선발배수가 넓은 전형일수록(계명대 최대 20배수, 대구가톨릭대 10배수) 누수가 크게 납니다.",
            "본인이 1차에서 탈락한 경우, 이미 잡아 둔 자리는 전액 취소됩니다.",
            "일정이 확정된 학생은 대기보다 확정 자리를 먼저 잡는 편이 안전합니다. 짧은 구간의 좋은 시간대가 먼저 나갑니다.",
          ]}
        />
      </PromoSection>

      <FinalCTA
        title="지원한 대학의 자리부터 확인하세요"
        body="대학별 페이지에 1단계 발표일·면접일과 그 사이 남은 자리가 그대로 있습니다. 상담은 전화나 아래 연락처로 바로 연결됩니다."
        Icon={Users}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />

      <SourceNote
        lines={[
          "일정은 각 대학 2027학년도 수시 모집요강 및 입학처 공지 기준입니다(2026년 9월 확인). 대학 사정으로 변경될 수 있으므로 최종 확인은 해당 입학처 공지를 따르십시오.",
          "1단계 합격자 발표 확정일이 공개되지 않은 대학(가톨릭대·아주대·대구가톨릭대)은 캘린더에 '예정'으로 표시했습니다.",
          "강원대는 2027학년도부터 MMI가 폐지되고 학생부 기반 확인 면접으로 변경되었습니다.",
          "고려대 학업우수전형은 2027학년도에 면접을 실시하지 않습니다.",
          "예약 현황은 집계 시점 기준이며 실시간이 아닙니다. 실제 잔여는 상담 시 확인해 드립니다.",
        ]}
      />
    </>
  );
}
