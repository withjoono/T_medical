import type { Metadata } from "next";
import {
  Globe2,
  Plane,
  Stethoscope,
  ShieldAlert,
  ScrollText,
  Languages,
  Wallet,
  Compass,
  Layers,
  GraduationCap,
  FileCheck2,
  Building2,
  Target,
  Users,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  CompareTable,
  NoteBox,
  RouteTimeline,
  LinkCards,
  SourceNote,
  FinalCTA,
} from "../_components";

export const metadata: Metadata = {
  title: "해외 의대 진학 · 국내 의사면허 경유 루트 | T Medi",
  description:
    "외국 의대 진학과 한국 의사면허까지의 경로 정리. 보건복지부 인정 외국 의대 38개국 159개교, 예비시험·의사국가시험 절차, 국내 의대 편입·재외국민 특별전형까지 제도 기준으로 안내합니다. tmedi.kr",
};

const REGIONS_HEAD = ["권역", "대표 국가", "특징", "확인해야 할 것"];
const REGIONS_ROWS = [
  [
    "유럽",
    "헝가리 · 폴란드 · 체코 등",
    "영어 트랙 6년제가 자리 잡혀 있고, 한국 학생 진학 사례와 국내 면허 취득 사례가 가장 많은 권역입니다.",
    "졸업까지의 유급·중도포기 비율, 영어 트랙 정원, EU 면허와 한국 면허의 분리 문제",
  ],
  [
    "중앙아시아 · 동남아",
    "우즈베키스탄 · 필리핀 등",
    "학비와 생활비 부담이 상대적으로 낮고 입학 문턱이 넓은 편입니다. 필리핀은 인정 대학 수가 미국 다음으로 많습니다.",
    "같은 나라라도 인정 대학과 비인정 대학이 갈립니다 — 학교 단위로 확인이 필수",
  ],
  [
    "미국 · 캐나다",
    "미국(MD·DO)",
    "학부 4년 후 진학하는 대학원 과정이라 기간과 비용이 가장 큽니다. 인정 대학 수는 26개로 가장 많습니다.",
    "MCAT·학부 이수, 국제학생 선발 규모, 졸업 후 레지던시 매칭 가능성",
  ],
  [
    "일본 · 영국 · 기타",
    "일본 15개교 · 영국 14개교",
    "현지 언어·현지 입시 체계를 그대로 통과해야 하는 구조로, 사실상 현지 진학에 가깝습니다.",
    "국제학생 모집 여부, 언어 요건, 현지 면허 취득 후 귀국 시 절차",
  ],
];

const ROUTE_A = [
  {
    stage: "STEP 1",
    title: "인정 외국 의대 진학",
    body: "보건복지부장관이 인정하는 외국 의과대학에 입학합니다. 인정 목록에 없는 학교를 졸업하면 국내 시험 응시 자격 자체가 생기지 않습니다.",
    meta: "38개국 159개교",
  },
  {
    stage: "STEP 2",
    title: "졸업 및 현지 의사면허",
    body: "현지 과정을 마치고 학위를 취득합니다. 국가에 따라 현지 면허 취득이 별도로 요구되거나 권장됩니다.",
    meta: "통상 6년",
  },
  {
    stage: "STEP 3",
    title: "응시자격 인정 심사 신청",
    body: "한국보건의료인국가시험원에 외국학교 인정 심사를 신청합니다. 위원회 심의를 거쳐 복지부가 최종 승인하며, 불인정 시 재심의 접수가 가능합니다.",
    meta: "국시원 접수 · 연 1회 공고",
  },
  {
    stage: "STEP 4",
    title: "예비시험 합격",
    body: "의사·치과의사·약사 직종에만 있는 관문입니다. 1차 필기와 2차 실기로 나뉘며, 한국 의학용어와 국내 진료 상황에 대한 적응이 실질 난관입니다.",
    meta: "1차 필기 + 2차 실기",
  },
  {
    stage: "STEP 5",
    title: "의사 국가시험 합격",
    body: "예비시험을 통과하면 국내 의대 졸업생과 같은 국가시험을 치릅니다.",
    meta: "국내 졸업생과 동일 시험",
  },
  {
    stage: "STEP 6",
    title: "면허 교부",
    body: "국가시험 합격자에 한해 사실조회를 거쳐 의사면허가 교부됩니다. 이후 수련 과정은 국내 졸업생과 같은 경쟁에 놓입니다.",
    meta: "합격 후 교부",
  },
];

const ROUTE_B = [
  {
    title: "국내 의대 편입학",
    body: "국내·외 4년제 대학에서 2학년 이상(4학기 이상)을 수료하면 지원 자격이 생깁니다. 해외 의대에서 2년 이상 이수한 학생도 대상이 됩니다. 최근 기준 16개 안팎의 의대가 편입 모집을 실시했고, 다수 대학이 1단계 필기시험(생물·화학·영어 등)과 서류·공인영어를 보고 2단계에서 면접을 봅니다. 대학별 선수과목 인정 범위가 달라 사전 확인이 필수입니다.",
  },
  {
    title: "재외국민 특별전형 (정원 외)",
    body: "해외 학교 재학 이력이 자격 요건인 정원 외 전형입니다. 최근 연도 기준 12개 의대가 29명 규모로 모집했습니다. 정원 외 인원은 해당 입학정원의 2%, 모집단위 기준 5%를 넘지 못하도록 제한돼 규모 자체가 작습니다. 12년 특례 등 자격 유형에 따라 지원 가능 대학이 달라집니다.",
  },
  {
    title: "해외 학부 후 국내 대학원·연구 트랙",
    body: "임상의가 목표가 아니라면 해외 생명과학·보건 계열 학부 후 국내 의과학 대학원으로 진입하는 경로도 있습니다. 면허가 필요한 진료와는 다른 길이라는 점을 분명히 하고 선택해야 합니다.",
  },
];

const RISK = [
  {
    icon: ShieldAlert,
    title: "인정 목록은 고정값이 아니다",
    body: "인정 대학 현황은 주기적으로 갱신되며 재심사에서 빠질 수 있습니다. 입학 시점에 인정 대학이어도 졸업 시점에 달라질 위험을 감안해야 합니다.",
  },
  {
    icon: Languages,
    title: "언어가 두 번 문제가 된다",
    body: "현지에서는 영어(또는 현지어)로 6년을 버텨야 하고, 귀국해서는 한국어 의학용어로 시험을 봐야 합니다. 영어로 배운 개념을 한국어 용어로 다시 익히는 과정이 예비시험의 실질 장벽입니다.",
  },
  {
    icon: Users,
    title: "졸업률이 곧 진짜 경쟁률",
    body: "입학은 상대적으로 열려 있어도 유급·중도포기 비율이 높은 학교가 있습니다. 입학 정원이 아니라 6년 뒤 졸업 인원을 물어봐야 합니다.",
  },
  {
    icon: Wallet,
    title: "총비용은 6년 단위로 계산",
    body: "학비뿐 아니라 체류비, 항공, 보험, 유급 시 추가 연차까지 포함해야 실제 규모가 보입니다. 국가·도시에 따라 차이가 큽니다.",
  },
  {
    icon: Stethoscope,
    title: "면허 이후가 또 하나의 관문",
    body: "면허를 받아도 수련 과정에서는 국내 졸업생과 같은 조건으로 경쟁합니다. 국내 병원 네트워크가 약하다는 점을 미리 계산해야 합니다.",
  },
  {
    icon: Target,
    title: "국내 입시와 동시에 저울질할 것",
    body: "해외 진학은 국내 입시의 대체재가 아니라 병렬 선택지입니다. 정시·재수 가능성과 함께 놓고 비교했을 때만 합리적인 판단이 나옵니다.",
  },
];

const CHECKLIST = [
  "지원하려는 학교가 현재 보건복지부 인정 목록에 있는지 — 국가가 아니라 학교 단위로 확인",
  "그 학교의 최근 한국인 졸업자 수와 예비시험 응시·합격 실적",
  "영어 트랙 여부와 실제 수업·실습 언어 (계약서·요강 기준으로 확인)",
  "입학 정원 대비 6년 뒤 졸업 인원 — 유급·중도포기 비율",
  "현지 임상실습의 범위와, 귀국 후 인정 여부",
  "6년 총비용 추정 (학비 + 체류 + 유급 시 추가 비용)",
  "귀국 시점의 예비시험·국가시험 일정과 준비 기간 확보 계획",
  "국내 재수·정시와 비교했을 때의 기회비용",
];

export default function OverseasPage() {
  return (
    <>
      <PromoHero
        badge="해외 의대 · 국내 면허 경유 루트"
        title="밖에서 시작해"
        highlight="한국 의사로 돌아오는 길"
        body="외국 의대 진학은 '우회로'가 아니라 별도의 제도 위에 있는 경로입니다. 어떤 학교가 인정되는지, 예비시험이라는 관문이 실제로 무엇을 요구하는지부터 확인하세요."
        primaryHref="#contact"
        primaryLabel="해외 진학 상담하기"
        secondaryHref="/promo/jungsi"
        secondaryLabel="국내 정시와 비교하기"
        Icon={Globe2}
        stats={[
          { icon: Building2, label: "인정 38개국 159개교" },
          { icon: FileCheck2, label: "예비시험 + 국가시험" },
          { icon: Plane, label: "편입 · 재외국민 루트" },
        ]}
      />


      <PromoSection
        eyebrow="ROUTE A"
        EyebrowIcon={Compass}
        title="외국 의대 → 한국 의사면허, 여섯 단계"
        subtitle="국내 의대와 다른 점은 '예비시험'이라는 관문이 하나 더 있다는 것입니다."
      >
        <RouteTimeline steps={ROUTE_A} />
      </PromoSection>


      <PromoSection
        eyebrow="REGIONS"
        EyebrowIcon={Globe2}
        title="권역별 특징"
        subtitle="같은 '해외 의대'라도 제도와 비용, 귀국 후 경로가 전혀 다릅니다."
      >
        <CompareTable
          head={REGIONS_HEAD}
          rows={REGIONS_ROWS}
          caption="인정 대학 수는 보건복지부 인정 외국학교 현황 기준입니다. 같은 국가라도 학교별로 인정 여부가 다르므로 반드시 최신 고시를 확인하세요."
        />
      </PromoSection>

      <PromoSection
        eyebrow="ROUTE B"
        EyebrowIcon={GraduationCap}
        title="국내 의대로 들어오는 다른 경로"
        subtitle="졸업 후 면허 경로 외에, 재학 중 국내로 진입하는 길도 있습니다."
        tone="muted"
      >
        <StepList steps={ROUTE_B} />
        <div className="mt-10">
          <NoteBox
            title="편입·재외국민 루트를 검토할 때"
            tone="info"
            Icon={ScrollText}
            items={[
              "의대 편입 모집 대학과 인원은 해마다 바뀌고, 아예 모집하지 않는 해도 있습니다.",
              "편입 필기시험 과목(생물·화학·영어 등)과 선수과목 인정 범위가 대학마다 다릅니다.",
              "재외국민 특별전형은 정원 외 2% 제한이 걸려 있어 의대 모집 규모 자체가 매우 작습니다.",
              "두 경로 모두 '해외에서 2년 버티면 열린다'는 성격이 아니라, 국내 편입 경쟁을 별도로 치르는 구조입니다.",
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="RISK"
        EyebrowIcon={ShieldAlert}
        title="먼저 계산해야 할 위험"
        subtitle="해외 의대 상담에서 가장 많이 생략되는 부분을 그대로 적었습니다."
      >
        <FeatureGrid items={RISK} columns={3} />
      </PromoSection>

      <PromoSection
        eyebrow="CHECKLIST"
        EyebrowIcon={Layers}
        title="진학 전 체크리스트"
        subtitle="아래 항목에 모두 답할 수 있어야 결정할 준비가 된 것입니다."
        tone="muted"
      >
        <CheckList items={CHECKLIST} />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={Compass} title="국내 경로와 함께 비교하세요">
        <LinkCards
          items={[
            {
              href: "/promo/susi",
              icon: Layers,
              title: "고3 수시 총정리",
              body: "교과·종합·논술 세 전형과 지역 선발 구조를 한눈에.",
            },
            {
              href: "/promo/jungsi",
              icon: Target,
              title: "정시 전략",
              body: "재수를 포함한 국내 정시 경로와 기회비용을 비교합니다.",
            },
            {
              href: "/promo/uidae-class",
              icon: GraduationCap,
              title: "의대 진학반",
              body: "국내 진학을 목표로 하는 학생을 위한 장기 관리 프로그램.",
            },
          ]}
          columns={3}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "보건복지부 '외국학교 졸업자의 보건의료인국가시험 응시절차', 한국보건의료인국가시험원 인정 외국학교 현황 및 관련 보도 기준으로 정리했습니다(2026년 9월 기준).",
          "인정 외국 의과대학 목록은 심사에 따라 추가·제외될 수 있습니다. 지원 전 반드시 국시원 최신 공고에서 학교 단위로 확인하세요.",
          "국내 의대 편입 및 재외국민 특별전형의 모집 대학·인원은 해마다 달라집니다. 해당 연도 모집요강이 유일한 기준입니다.",
        ]}
      />

      <FinalCTA
        title="해외 진학, 분위기가 아니라 제도로 결정하세요"
        body="인정 여부·졸업 가능성·예비시험 준비 부담·총비용을 국내 경로와 나란히 놓고 비교해 드립니다. 결론이 '국내 재수'로 나오는 경우도 많습니다."
        Icon={Globe2}
        primaryHref="#contact"
        primaryLabel="해외 진학 상담하기"
      />
    </>
  );
}
