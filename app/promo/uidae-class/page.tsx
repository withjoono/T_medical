import type { Metadata } from "next";
import {
  Stethoscope,
  CalendarDays,
  ClipboardList,
  FileText,
  LineChart,
  BookMarked,
  Users,
  UserCheck,
  Award,
  Clock,
  Target,
  ShieldCheck,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  PriceCard,
  FinalCTA,
} from "../_components";

export const metadata: Metadata = {
  title: "2027 의대 진학반 9월 3일 개강 | T Medi — 내신·모의고사·생기부 통합관리",
  description:
    "의대 합격의 세 축, 내신·모의고사·생기부를 한 반에서 통합 관리합니다. 플래너 학습관리, 생기부 컨설팅(멘토), 모고앱 모의고사 성적관리, 생기북앱 내신관리까지. 3개월 · 소수정원 · 9월 3일(목) 개강. tmedi.kr",
};

/** ===== 4대 통합관리 시스템 (의대반의 핵심 차별점) ===== */
const MANAGEMENT = [
  {
    icon: ClipboardList,
    title: "학습관리 · 플래너 앱",
    body: "학생이 주간 학습 계획과 실행을 플래너 앱에 기록하고, 주 1회 멘토가 직접 확인·코칭합니다. 계획이 실행으로 이어지는지 매주 점검합니다.",
  },
  {
    icon: FileText,
    title: "생기부 컨설팅 · 멘토 담당",
    body: "생명·화학 세특 심화, 의학적 탐구·봉사 경험 설계를 담당 멘토가 직접 컨설팅합니다. 의대 학종이 중시하는 요소 중심으로 생기부 방향을 잡습니다.",
  },
  {
    icon: LineChart,
    title: "모의고사 성적관리 · 모고앱",
    body: "매 모의고사 성적을 모고앱에 누적 관리하며 과목별 추이·취약 단원을 추적합니다. 수능 최저 충족선 대비 현재 위치를 데이터로 점검합니다.",
  },
  {
    icon: BookMarked,
    title: "내신관리 · 생기북앱",
    body: "과목별 내신 등급과 시험 일정을 생기북앱으로 관리합니다. 교과 전형의 핵심인 내신을 학기 중 흐트러지지 않게 반 단위로 챙깁니다.",
  },
];

/** ===== 왜 의대는 통합관리가 필요한가 ===== */
const WHY = [
  "의대는 내신·모의고사·생기부가 모두 최상위여야 하는, 실수 한 번이 치명적인 입시입니다.",
  "세 축을 따로 관리하면 어느 하나가 반드시 무너집니다. 한 반에서 함께 봐야 합니다.",
  "혼자서는 매주 계획을 지키기 어렵습니다. 소수 그룹이 서로의 기준선을 끌어올립니다.",
  "성적과 생기부는 학기 중에 만들어집니다. 개강일부터 3개월, 실행을 붙잡아 드립니다.",
  "담당 멘토가 학습·생기부·성적을 한 사람이 연결해 봅니다. 관리의 공백을 없앱니다.",
  "플래너·모고앱·생기북앱으로 진행 상황을 학생과 학부모가 함께 확인합니다.",
];

/** ===== 그룹반의 장점 ===== */
const GROUP = [
  {
    icon: Users,
    title: "같이 밀어붙이는 소수 그룹",
    body: "서로가 서로를 끌어올립니다. 소수 정원으로 운영해 경쟁이 곧 기준선 상향으로 이어집니다.",
  },
  {
    icon: UserCheck,
    title: "한 멘토가 전원을 봅니다",
    body: "학습·생기부·성적을 담당 멘토가 통합해 관리합니다. 사람마다 흩어지는 관리 공백이 없습니다.",
  },
  {
    icon: ShieldCheck,
    title: "의대 기준으로 삼습니다",
    body: "최상위 내신과 수능 최저, 의학적 탐구 생기부라는 의대 합격 기준을 반 전체의 목표선으로 둡니다.",
  },
];

/** ===== 3개월 진행 과정 ===== */
const STEPS = [
  {
    title: "현재 상황 진단",
    body: "내신 등급, 모의고사 성적대, 생기부 세특·활동 내역을 사전 점검해 학생별 시작점과 우선순위를 설정합니다.",
  },
  {
    title: "통합관리 설계 & 개강",
    body: "플래너 학습 계획, 생기부 방향, 모의고사 목표선, 내신 관리 포인트를 하나의 3개월 로드맵으로 묶어 9월 3일 함께 시작합니다.",
  },
  {
    title: "주간 실행 · 점검",
    body: "매주 플래너 실행을 멘토가 검사·코칭하고, 모고앱·생기북앱으로 성적과 내신 흐름을 추적합니다. 계획이 실행으로 이어지도록 붙잡습니다.",
  },
  {
    title: "성적 · 생기부 반영",
    body: "모의고사·내신 결과를 전략에 반영하고, 생기부 컨설팅 5회로 세특·활동을 학기 흐름에 맞춰 완성해 나갑니다.",
  },
];

/** ===== 포함 사항 ===== */
const INCLUDED = [
  "플래너 앱 학습관리 + 주 1회 멘토 검사·코칭",
  "생기부 컨설팅 5회 (담당 멘토 1:1)",
  "모고앱 모의고사 성적 누적 관리 및 추이 분석",
  "생기북앱 내신 등급·시험 일정 관리",
  "소수 그룹반 운영 + 학부모 진행 상황 공유",
  "수능 최저 충족선 대비 성적 위치 점검",
];

/** ===== 멘토진 ===== */
const MENTORS = [
  {
    icon: FileText,
    name: "생기부 컨설팅 멘토",
    role: "의대 재학·졸업 멘토진",
    body: "생명·화학 세특과 의학적 탐구·봉사 활동을 1:1로 컨설팅합니다. 학종 평가자 관점에서 생기부 방향을 잡습니다.",
  },
  {
    icon: LineChart,
    name: "성적관리 멘토",
    role: "모의고사 · 내신 관리 담당",
    body: "모고앱·생기북앱으로 모의고사와 내신 추이를 추적하고, 수능 최저 충족선 대비 현재 위치를 점검합니다.",
  },
  {
    icon: UserCheck,
    name: "강준호 (거북쌤)",
    role: "반 편성 · 학습관리 총괄",
    body: "T스쿨 대표. 플래너 앱 기반 주간 학습관리와 반 운영을 총괄하며 학생·학부모와 진행 상황을 공유합니다.",
  },
];

export default function UidaeClassPage() {
  return (
    <>
      <PromoHero
        badge="2027 의대 진학반 · 9월 3일(목) 개강"
        title="내신·모의고사·생기부,"
        highlight="한 반에서 통합관리"
        body="의대 합격의 세 축을 따로 관리하면 하나는 반드시 무너집니다. 플래너 학습관리부터 생기부 컨설팅, 모의고사·내신 앱 관리까지 — 담당 멘토가 3개월간 함께 붙잡는 소수정원 반입니다."
        primaryHref="#contact"
        primaryLabel="지금 상담 예약하기"
        secondaryHref="/"
        secondaryLabel="T Medi 먼저 보기"
        Icon={Stethoscope}
        stats={[
          { icon: CalendarDays, label: "9월 3일(목) 개강" },
          { icon: Clock, label: "3개월 과정" },
          { icon: Users, label: "소수정원" },
          { icon: Award, label: "컨설팅 5회 포함" },
        ]}
      />

      {/* 왜 통합관리인가 */}
      <PromoSection
        eyebrow="WHY"
        EyebrowIcon={ShieldCheck}
        title="왜 의대는 통합관리가 필요할까요?"
        subtitle="의대 입시는 내신·모의고사·생기부 어느 하나도 놓칠 수 없습니다. 따로 관리하면 반드시 어딘가 무너집니다."
        tone="muted"
      >
        <CheckList items={WHY} />
      </PromoSection>

      {/* 4대 관리 시스템 — 핵심 차별점 */}
      <PromoSection
        eyebrow="SYSTEM"
        EyebrowIcon={Target}
        title="4대 통합관리 시스템"
        subtitle="학습·생기부·모의고사·내신을 각각의 전용 앱과 담당 멘토가 한 반에서 함께 관리합니다."
      >
        <FeatureGrid items={MANAGEMENT} columns={2} />
      </PromoSection>

      {/* 그룹반의 장점 */}
      <PromoSection
        eyebrow="GROUP"
        EyebrowIcon={Users}
        title="같이 밀어붙이는 반"
        subtitle="혼자서는 매주 계획을 지키기 어렵습니다. 소수 그룹이 서로의 기준선을 끌어올립니다."
        tone="muted"
      >
        <FeatureGrid items={GROUP} columns={3} />
      </PromoSection>

      {/* 3개월 진행 과정 */}
      <PromoSection
        eyebrow="PROCESS"
        EyebrowIcon={Clock}
        title="3개월 진행 과정"
        subtitle="개강일부터 성적·생기부가 만들어지는 학기 중 3개월, 실행을 붙잡습니다."
      >
        <StepList steps={STEPS} />
      </PromoSection>

      {/* 멘토진 */}
      <PromoSection
        eyebrow="MENTORS"
        EyebrowIcon={UserCheck}
        title="담당 멘토진"
        subtitle="한 멘토가 학습·생기부·성적을 연결해 봅니다."
        tone="muted"
      >
        <div className="grid border-l border-t border-hair bg-paper-50 sm:grid-cols-2 lg:grid-cols-3">
          {MENTORS.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.name}
                className="group relative border-b border-r border-hair p-8 transition-colors duration-300 hover:bg-white"
              >
                <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />
                <span className="flex h-11 w-11 items-center justify-center border border-hair-strong bg-white text-jade-600 transition-colors duration-300 group-hover:border-jade-200 group-hover:bg-jade-50">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="display mt-6 text-[1.0625rem] leading-snug text-ink-900">
                  {m.name}
                </h3>
                <p className="eyebrow mt-2 text-brass-600">{m.role}</p>
                <p className="mt-3 text-[14px] font-light leading-[1.8] text-ink-500">
                  {m.body}
                </p>
              </div>
            );
          })}
        </div>
      </PromoSection>

      {/* 가격 · 일정 */}
      <PromoSection
        eyebrow="PRICE"
        EyebrowIcon={Award}
        title="수강 안내"
        subtitle="소수정원으로 운영되어 조기 마감될 수 있습니다."
      >
        <PriceCard
          courseName="2027 의대 진학반"
          price="98만원"
          priceSuffix="/ 3개월"
          badge="9월 3일(목) 개강 · 소수정원"
          BadgeIcon={CalendarDays}
          items={INCLUDED}
          notes={[
            { icon: Clock, label: "3개월 과정" },
            { icon: Award, label: "생기부 컨설팅 5회 포함" },
            { icon: Target, label: "4대 앱 통합관리" },
          ]}
          href="#contact"
          label="지금 상담 예약하기"
        />
      </PromoSection>

      <FinalCTA
        title="9월 3일, 의대 진학반과 함께 시작하세요"
        body="내신·모의고사·생기부를 한 반에서. 소수정원으로 조기 마감될 수 있으니 지금 상담을 예약하세요."
        Icon={Stethoscope}
        primaryHref="#contact"
        primaryLabel="상담 예약하기"
      />
    </>
  );
}
