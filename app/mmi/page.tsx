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
  Scale,
  DoorOpen,
  Gauge,
  Video,
  Ban,
  Monitor,
  MapPin,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  CompareTable,
  NoteBox,
  PriceCard,
  FinalCTA,
  SourceNote,
} from "../_site/components";
import { UnivCards, TeacherCards } from "./_mmi";
import { UNIVS, TUITION, slotsForDate, univDays } from "@/lib/mmi-schedule";
import { JsonLdAll } from "@/components/json-ld";
import { breadcrumb, course } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "/mmi" },
  title: "2027 의대 MMI 면접 특강 | T Medi — 대학별 1:1 실전 대비",
  description:
    "MMI는 잘한 방의 평균이 아니라 무너진 방의 최저점으로 떨어집니다. 2027학년도 의대 MMI 면접을 1차 발표일에서 역산한 대학별 1:1 특강 — 서울대·고려대·울산대·한림대·계명대·인제대 등 15개 의대의 실제 일정으로 수업 캘린더와 남은 자리를 공개합니다. 박은우·강정규 담당. tmedi.kr",
};

/* -------------------------------------------------------------------------
 * 1. MMI 한 줄 요약 — 재는 것 / 갈리는 지점 / 훈련의 핵심
 * ---------------------------------------------------------------------- */

const SUMMARY_HEAD = ["방식", "재는 것", "갈리는 지점", "훈련의 핵심"];
const SUMMARY_ROWS = [["MMI", "판단의 일관성", "꼬리질문", "최저점 관리"]];

/* -------------------------------------------------------------------------
 * 2. 최저점 관리 — 훈련의 세 축
 * ---------------------------------------------------------------------- */

const PILLARS = [
  {
    icon: Scale,
    title: "판단 골격 하나를 여러 상황에 반복 적용",
    body: "쟁점 특정 → 당사자 열거 → 판단 기준 제시 → 결론 → 한계 인정. 문항 100개를 푸는 것이 목표가 아니라, 이 뼈대가 2분 준비 시간 안에 자동으로 나오게 만드는 것이 목표입니다. 방이 바뀌어도 축이 같으면 답변 내용이 달라도 채점자에게는 같은 사람으로 읽힙니다.",
  },
  {
    icon: Repeat,
    title: "꼬리질문 내성 — 버티기가 아니라 조정하기",
    body: "첫 답변은 대부분 비슷합니다. 면접관이 반박했을 때 ① 버티기 ② 무너지기 ③ 근거 대고 조정하기 중 ③만 점수를 얻습니다. '버티면 일관성'이라고 가르치는 곳이 많은데, 새 정보가 들어왔는데도 안 바꾸는 것은 일관성이 아니라 경직성으로 읽힙니다.",
  },
  {
    icon: DoorOpen,
    title: "방 전환 — 모드를 바꾸고, 직전 방을 잊기",
    body: "인성방(가치관) → 상황방(판단) → 모의상황방(연기·대응)은 요구하는 모드가 다릅니다. 한 세션에 연속으로 돌려 전환을 체화해야 합니다. 그리고 직전 방을 잊는 것 자체가 기술입니다 — 다음 방 면접관은 앞에서 무슨 일이 있었는지 모릅니다.",
  },
];

/* -------------------------------------------------------------------------
 * 3. 1:1 온라인이 학원 단체수업 대비 갖는 것
 * ---------------------------------------------------------------------- */

const EDGES = [
  {
    icon: Gauge,
    title: "① 꼬리질문 밀도 — 훈련 대상 자체가 다릅니다",
    body: "단체 8명 2시간이면 1인당 발화는 15분, 꼬리질문은 3~4개입니다. 1:1 2시간 30분이면 발화 90분 이상, 꼬리질문은 수십 개입니다. 그런데 MMI의 변별이 바로 꼬리질문에서 납니다. 양의 차이가 아닙니다 — 단체수업은 첫 답변을 훈련하고, 1:1은 반박 이후를 훈련합니다.",
  },
  {
    icon: CalendarDays,
    title: "② 일정 — 고정 시간표로는 구조상 안 되는 구간",
    body: "1차 발표부터 면접까지가 대구가톨릭대 3일(발표 예정일 기준), 성균관대 5일, 한림대 6일입니다. 고정 시간표를 가진 단체 수업은 이 구간에 커리큘럼을 넣을 수 없습니다. 1:1은 발표 다음 날 저녁에 잡을 수 있고, 온라인이라 이동 시간이 0이어서 하루 2타임도 가능합니다.",
  },
  {
    icon: Layers,
    title: "③ 대학별 리허설이 실제로 가능",
    body: "단체는 수강생이 서로 다른 대학을 지원하니 최대공약수 커리큘럼을 짤 수밖에 없습니다. 그런데 계명대 3개 방 각 10분과 서울대 약 60분은 다른 시험입니다. 1:1은 지원 대학의 방 개수 · 시간 · 배점을 그대로 놓고 돌립니다.",
  },
  {
    icon: Video,
    title: "④ 녹화 — 온라인만의 이점",
    body: "대면 학원은 보통 녹화를 하지 않습니다. 다른 수강생의 초상권이 걸리기 때문입니다. 1:1 온라인은 세션 전체가 자연스럽게 남고, 학생이 자기 시선 · 말버릇 · 군더더기를 직접 봅니다. 면접 교정에서 '지적받기'와 '영상으로 보기'는 효과 차이가 큽니다.",
  },
];

const WEAK_HEAD = ["1:1 온라인의 약점", "왜 생기나", "어떻게 보완하나"];
const WEAK_ROWS = [
  [
    "실전 긴장이 재현 안 됨",
    "익숙한 선생님, 익숙한 방에서 봅니다. 처음 보는 면접관 앞에 앉는 압박과 같지 않습니다.",
    "마지막 1~2회는 처음 보는 강사로 배치합니다(박은우 ↔ 강정규 교차). 복장을 갖춰 입고 타이머를 강제하며, 화면을 끄고 시작해 입실하듯 켭니다.",
  ],
  [
    "또래 비교가 없음",
    "'쟤는 저렇게 하는구나'가 자기 수준 감각을 만드는데, 1:1에는 그 기회가 없습니다.",
    "익명 처리한 다른 학생의 답변 영상 · 전사를 교재로 드립니다. 원하면 마지막 1회만 2:1 합동 모의면접으로 진행합니다.",
  ],
  [
    "비언어 신호 일부가 죽음",
    "화면에 잡히지 않는 전신 자세, 손, 입퇴실 동작이 보이지 않습니다.",
    "특정 세션은 전신이 보이는 카메라 세팅을 요구하고, 입실 · 착석 · 퇴실 리허설을 따로 돌립니다.",
  ],
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
      <JsonLdAll
        items={[
          breadcrumb([{ name: "대학별 MMI 면접 특강", path: "/mmi" }]),
          course({
            path: "/mmi",
            name: "2027 의대 MMI 면접 특강 (대학별 1:1)",
            description:
              "2027학년도 의대 면접을 대학별 1단계 발표~면접일 구간에 맞춰 준비하는 줌 1:1 수업. 15개 의대의 실제 일정 기준.",
            price: TUITION.perSession,
          }),
        ]}
      />
      <PromoHero
        badge="2027 의대 면접 특강 · 대학별 1:1"
        title="MMI는 잘한 방이 아니라"
        highlight="무너진 방으로 떨어집니다"
        body="여러 방에서 서로 다른 면접관이 보는 구조는, 평가자 편차를 상쇄해 '이 사람의 판단 성향'을 뽑아내려는 설계입니다. 그래서 평균이 아니라 최저점이 당락을 만듭니다. T메디는 15개 의대의 실제 1단계 발표일과 면접일에 맞춰 수업 구간을 열어 두고, 남은 자리를 그대로 공개합니다. 1:1 개인지도이며, 1차 불합격으로 풀리는 자리의 대기 예약도 함께 받습니다."
        primaryHref="#contact"
        primaryLabel="대학별 자리 문의하기"
        secondaryHref="/interview/mmi"
        secondaryLabel="MMI 방식부터 보기"
        Icon={Users}
        stats={[
          { icon: CalendarDays, label: "15개 의대" },
          { icon: UserRound, label: "1:1 개인지도" },
          { icon: Clock, label: `예약 가능 ${totalOpen}회` },
        ]}
      />

      <PromoSection
        eyebrow="AT A GLANCE"
        EyebrowIcon={Target}
        title="MMI는 무엇을 재는 시험인가"
        subtitle="면접 방식마다 재는 능력이 다르고, 그래서 훈련 설계도 달라집니다. MMI 한 줄만 떼어 보면 이렇습니다."
      >
        <CompareTable
          head={SUMMARY_HEAD}
          rows={SUMMARY_ROWS}
          caption="인·적성 면접과 제시문 면접은 재는 것이 다릅니다 — 유형별 정리는 /interview 에 있습니다."
        />
      </PromoSection>

      <PromoSection
        eyebrow="WHAT MATTERS"
        EyebrowIcon={Scale}
        title="평균이 아니라 최저점이 떨어뜨립니다"
        subtitle="여러 방에서 서로 다른 면접관이 보는 구조는, 평가자 편차를 상쇄해 '이 사람의 판단 성향'을 뽑아내려는 설계입니다. 그래서 한 방을 잘하는 것보다 어느 방에서도 무너지지 않는 것이 먼저입니다. 계명대가 이걸 규정으로 못 박았습니다 — 세 고사실의 면접위원 6명 중 2명 이상이 미흡(0점)으로 판정하면 총점과 무관하게 불합격입니다. 훈련해야 할 것은 셋입니다."
        tone="muted"
      >
        <FeatureGrid items={PILLARS} columns={3} />
        <div className="mt-14">
          <NoteBox
            title="흔한 오답 — 기출 암기"
            tone="warn"
            Icon={Ban}
            items={[
              "암기한 답은 꼬리질문 두 번이면 드러납니다. 스테이션이 여러 개라 들키는 지점도 그만큼 많고, 같은 사람으로 보이지 않는 순간 인성 항목이 먼저 깎입니다.",
              "인제대처럼 문항카드를 아예 공개하지 않는 대학도 있습니다. 외울 기출 자체가 없다는 뜻입니다.",
              "대비는 '무엇이 나오는가'가 아니라 '어떤 문항이 나와도 같은 기준으로 답하는가'로 설계해야 합니다.",
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="WHY 1:1 ONLINE"
        EyebrowIcon={Monitor}
        title="1:1 온라인이 학원 단체수업 대비 갖는 것"
        subtitle="수업 형태를 먼저 정해 놓고 이유를 붙인 것이 아닙니다. MMI의 변별 지점과 이 시기의 일정 구조를 보면 1:1 외에는 맞출 수 있는 방식이 거의 없습니다."
      >
        <FeatureGrid items={EDGES} columns={2} />
        <div className="mt-14">
          <NoteBox
            title="여기에 지역 문제가 얹힙니다"
            Icon={MapPin}
            items={[
              "지역인재전형 지원자는 정의상 지방 거주입니다. 그런데 의대 면접을 전문으로 하는 강사는 수도권에 몰려 있습니다.",
              "온라인이면 이 불일치가 사라집니다. 발표 다음 날 저녁 자리를 지방에서도 그대로 쓸 수 있습니다.",
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="TRADE-OFF"
        EyebrowIcon={MessagesSquare}
        title="그래도 1:1 온라인이 약한 지점"
        subtitle="숨기면 학부모가 먼저 묻습니다. 이 방식이 구조적으로 약한 세 가지와, 그걸 수업 설계로 어떻게 메우는지를 그대로 적습니다."
        tone="muted"
      >
        <CompareTable
          head={WEAK_HEAD}
          rows={WEAK_ROWS}
          caption="대면 리허설이 반드시 필요하다고 판단되는 학생은 상담 때 따로 안내해 드립니다."
        />
      </PromoSection>

      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={Layers}
        title="MMI 실시 의대"
        subtitle="스테이션을 도는 다면·다중 면접을 실시하는 대학입니다. 방 개수와 시간이 대학마다 다릅니다. 대학을 고르면 1단계 발표일·면접일과 그 사이 남은 자리가 그대로 나옵니다."
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
        eyebrow="INSTRUCTORS"
        EyebrowIcon={UserRound}
        title="담당 강사"
        subtitle="스테이션 성격에 따라 담당을 나눕니다. 두 강사가 같은 학생을 번갈아 보는 구조이며, 이것이 1:1의 긴장 재현을 메우는 장치이기도 합니다."
      >
        <TeacherCards />
      </PromoSection>

      <PromoSection
        eyebrow="TUITION"
        EyebrowIcon={Clock}
        title="수업료"
        subtitle="1:1 개인지도이며 회차 단위로 결제합니다. 묶음 결제나 선납을 요구하지 않습니다."
        tone="muted"
      >
        <PriceCard
          courseName="의대 MMI 면접 특강"
          price={TUITION.perSessionLabel}
          priceSuffix={`/ ${TUITION.unit}`}
          badge="대기 예약은 무료 · 자리 확정 후 결제"
          BadgeIcon={CalendarDays}
          items={[
            "강사 1명 : 학생 1명, 1회 2시간 30분. 한 문항에 반박을 대여섯 번씩 거는 꼬리질문 훈련",
            "지원 대학의 방 개수·시간 제한을 그대로 재현한 실전 리허설",
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
          "1단계 합격자 발표 확정일이 공개되지 않은 대학(가톨릭대·아주대·대구가톨릭대)은 캘린더에 '예정'으로 표시했으며, 본문의 '발표 3일 전' 같은 구간 길이도 그 예정일 기준입니다.",
          "계명대의 최하점 관련 규정, 인제대의 문항카드 미공개는 각 대학 2027학년도 모집요강에 기재된 내용입니다.",
          "강원대는 2027학년도부터 MMI가 폐지되고 학생부 기반 확인 면접으로 변경되었습니다.",
          "고려대 학업우수전형은 2027학년도에 면접을 실시하지 않습니다.",
          "예약 현황은 집계 시점 기준이며 실시간이 아닙니다. 실제 잔여는 상담 시 확인해 드립니다.",
        ]}
      />
    </>
  );
}
