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
    title: "판단 골격 — 방이 바뀌어도 축은 하나",
    body: "쟁점 특정 → 당사자 열거 → 판단 기준 → 결론 → 한계 인정. 이 순서가 준비 시간 2분 안에 자동으로 나와야 합니다. 환자의 자율성, 이익형량, 정직처럼 자기 원칙을 서너 개로 줄여 두고 어떤 상황에나 같은 축으로 대면, 답변 내용이 달라도 채점자에게는 같은 사람으로 읽힙니다.",
  },
  {
    icon: Repeat,
    title: "꼬리질문 내성 — 버티는 게 아니라 조정하는 것",
    body: "변별은 첫 답변이 아니라 면접관이 반박한 다음에 생깁니다. 고득점은 끝까지 버티는 쪽이 아니라, 새 근거가 들어오면 그것을 인정하고 결론을 다듬는 쪽입니다. 말을 통째로 뒤집지 않으면서 수정할 부분만 정확히 인정하는 화법을 한 문항에 반박 대여섯 번씩 걸어 훈련합니다.",
  },
  {
    icon: DoorOpen,
    title: "방 전환 — 최저점을 둘로 만들지 않기",
    body: "직전 방을 망쳤다는 감각을 다음 방까지 들고 가면 최저점이 하나가 아니라 둘이 됩니다. 이동하는 30초 동안 감정을 끊는 절차를 미리 정해 두고, 모의면접에서 일부러 한 방을 무너뜨린 뒤 다음 방을 정상으로 되돌리는 복구 훈련을 넣습니다.",
  },
];

/* -------------------------------------------------------------------------
 * 3. 1:1 온라인이 학원 단체수업 대비 갖는 것
 * ---------------------------------------------------------------------- */

const EDGES = [
  {
    icon: Gauge,
    title: "꼬리질문 밀도",
    body: "MMI의 변별은 꼬리질문에서 납니다. 그런데 단체 수업은 구조상 한 사람당 꼬리질문 서너 개가 한계입니다. 1:1은 한 문항을 답이 바뀔 때까지 파고들 수 있어, 같은 2시간 30분에 들어가는 반박 횟수가 몇 배로 벌어집니다. 이 페이지가 1:1만 운영하는 이유가 여기 있습니다.",
  },
  {
    icon: CalendarDays,
    title: "일정 — 구간 자체가 며칠뿐이다",
    body: "1단계 발표부터 면접까지가 대구가톨릭대는 3일(발표 예정일 기준), 성균관대는 5일, 한림대와 연세대는 6일입니다. 정해진 요일에 열리는 단체 강의로는 이 구간을 맞출 수 없습니다. 1:1은 대학별 발표일에서 역산해 남은 날짜에 회차를 붙이고, 평일 야간 2타임·휴일 5타임 중 비어 있는 자리를 그대로 씁니다.",
  },
  {
    icon: Layers,
    title: "대학별 리허설",
    body: "서울대는 제시문 여러 개로 약 60분, 고려대는 인적성 8분을 두 번, 한림대와 계명대는 세 개의 방을 각각 돕니다. 방 개수와 시간이 다르면 훈련 설계가 통째로 달라집니다. 단체반은 평균적인 MMI를 가르칠 수밖에 없지만, 1:1은 지원한 대학의 방 구성과 시간 제한을 그대로 재현해 돌립니다.",
  },
  {
    icon: Video,
    title: "녹화 — 지적 열 번보다 본인 영상 한 번",
    body: "줌 수업은 그대로 기록이 남습니다. 본인의 답변을 다시 보는 쪽이 말로 듣는 지적보다 빠르게 고쳐지고, 회차가 쌓이면 시선·말버릇·손동작이 줄어드는 것을 눈으로 확인할 수 있습니다. 강의실 단체 수업에는 남지 않는 자료입니다.",
  },
];

const WEAK_HEAD = ["1:1 온라인의 약점", "왜 생기나", "어떻게 보완하나"];
const WEAK_ROWS = [
  [
    "실전 긴장 재현",
    "화면 너머의 강사 한 명은, 처음 보는 면접관 여러 명 앞에 앉는 압박과 같지 않습니다.",
    "두 강사가 같은 학생을 번갈아 봅니다. 예고 없이 담당을 바꾸고, 방 이동과 답변 시간에 실제 제한을 걸어 압박 조건을 만듭니다.",
  ],
  [
    "또래 비교 없음",
    "옆 사람의 답변을 들으며 내 위치를 가늠할 기회가 없습니다.",
    "같은 문항에서 다른 지원자들이 흔히 내놓는 답변 유형을 강사가 재현해 보여 주고, 채점자 입장에서 어디가 갈리는지를 짚습니다.",
  ],
  [
    "비언어 신호",
    "카메라 프레임 밖의 자세·손동작·다리 떨림이 강사에게 보이지 않습니다.",
    "상반신 전체가 들어오는 각도로 카메라를 고정하고 실제 면접과 같은 착석 자세로 진행합니다. 녹화본으로 프레임 밖 습관까지 함께 점검합니다.",
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
        subtitle="한 방을 특별히 잘하는 것보다, 어느 방에서도 무너지지 않는 쪽이 점수가 됩니다. 계명대처럼 면접위원 여섯 명 중 두 명 이상에게 최하점을 받으면 총점과 무관하게 불합격시키는 규정을 둔 대학도 있습니다. 훈련은 잘하는 방을 더 잘하게 만드는 쪽이 아니라, 가장 약한 방을 끌어올리는 쪽으로 짭니다."
        tone="muted"
      >
        <FeatureGrid items={PILLARS} columns={3} />
        <div className="mt-14">
          <NoteBox
            title="흔한 오답 — 기출 암기"
            tone="warn"
            Icon={Ban}
            items={[
              "스테이션이 여러 개라 외워 온 답은 세 번째 방에서 드러납니다. 같은 사람으로 보이지 않는 순간 인성 항목이 먼저 깎입니다.",
              "인제대는 의예과 전 전형이 MMI인데 문항카드와 채점기준을 공개하지 않습니다. 외울 기출 자체가 없는 대학이 있다는 뜻입니다.",
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
      </PromoSection>

      <PromoSection
        eyebrow="TRADE-OFF"
        EyebrowIcon={MessagesSquare}
        title="그래도 1:1 온라인이 약한 지점"
        subtitle="장점만 말하면 준비 설계가 어긋납니다. 이 방식이 구조적으로 약한 세 가지와, 수업에서 어떻게 메우는지를 그대로 적습니다."
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
