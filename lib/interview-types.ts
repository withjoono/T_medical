import { SESSION_MINUTES, TUITION } from "./mmi-schedule";
import { UNIV_PAGES, type UnivPage } from "./univ";

/** =========================================================================
 *  면접 유형 SSOT — /interview 하위 3개 유형 페이지가 쓰는 데이터.
 *
 *  ⚠️ 이 파일은 대학 데이터를 만들지 않는다. 분류만 한다.
 *     대학별 전형·면접 방식·일정의 원본은 그대로 두 곳이다:
 *       lib/mmi-schedule.ts  (MMI 특강 15개교)
 *       lib/univ-interview.ts (나머지 24개교)
 *     → 수치를 고치려면 저 두 곳을 고친다. 여기는 '어느 유형인가'만 정한다.
 *
 *  ⚠️ 분류 근거는 각 대학 format[] 에 적힌 요강 확인 문장이다. 추정하지 않는다.
 *     요강이 "MMI 아님"이라고 못박은 대학은 면접실이 2개여도 mmi 로 넣지 않는다.
 *  ========================================================================= */

export type InterviewTypeKey = "mmi" | "injeokseong" | "jesimun";

export type InterviewType = {
  key: InterviewTypeKey;
  href: string;
  /** 페이지 제목에 쓰는 정식 명칭 */
  name: string;
  /** 표·배지에 쓰는 짧은 이름 */
  short: string;
  /** 한 줄 정의 — 허브 카드와 히어로 배지 */
  tagline: string;
  /** 히어로 본문 */
  lede: string;
  /** 이 방식이 무엇인가 — 요강에서 확인되는 공통 특징 */
  what: string[];
  /** 준비 포인트 */
  drills: { title: string; body: string }[];
  /** 흔한 실수 */
  pitfalls: string[];
  metaTitle: string;
  metaDescription: string;
};

export const INTERVIEW_TYPES: InterviewType[] = [
  {
    key: "mmi",
    href: "/interview/mmi",
    name: "다중미니면접 (MMI)",
    short: "MMI",
    tagline: "면접실을 옮겨 다니며 여러 번 평가받는 방식",
    lede:
      "MMI(Multiple Mini Interview)는 한 번의 면접으로 끝나지 않습니다. 성격이 다른 면접실을 순서대로 옮겨 다니고, 방마다 다른 면접위원이 따로 채점합니다. 한 방에서 무너져도 다음 방에서 회복할 수 있지만, 반대로 한 방만 잘해서는 점수가 오르지 않습니다.",
    what: [
      "면접실(스테이션) 2~3개를 순서대로 통과한다. 방마다 주제와 면접위원이 다르다",
      "방 하나당 7~10분 내외. 대학에 따라 총 20분에서 60분까지 편차가 크다",
      "인성 · 상황판단 · 모의상황이 기본 조합이고, 대학에 따라 제시문 방이 섞인다",
      "방마다 독립 채점이다 — 계명대처럼 면접위원 6명 중 2명 이상에게 최하점을 받으면 불합격시키는 규정을 둔 대학도 있다",
      "요강에 'MMI'라는 이름 대신 '다면평가' · '다면인적성면접' · '2개 면접실 이동'으로 적는 대학이 많다",
    ],
    drills: [
      {
        title: "방이 바뀌어도 판단 기준은 하나",
        body:
          "스테이션마다 주제가 달라도 답의 축은 같아야 합니다. 환자의 자율성, 이익형량, 정직처럼 원칙 몇 개를 정해 두고 어떤 상황에도 같은 축으로 답하는 훈련을 합니다.",
      },
      {
        title: "7분 안에 끝나는 답변 골격",
        body:
          "두괄식 결론 → 근거 둘 → 반대 입장 인정 → 마무리. 방마다 시간이 짧아 이 골격이 몸에 붙어 있지 않으면 결론을 말하기 전에 끊깁니다.",
      },
      {
        title: "꼬리질문을 버티는 힘",
        body:
          "MMI는 첫 답변보다 반박 뒤의 태도를 봅니다. 면접관이 반대 근거로 파고들 때 말을 통째로 바꾸지 않으면서 수정할 부분만 인정하는 화법을 훈련합니다.",
      },
      {
        title: "방 사이 30초 리셋",
        body:
          "직전 방을 망쳤다는 감각을 다음 방까지 끌고 가면 연쇄로 무너집니다. 이동하는 동안 감정을 끊는 절차를 미리 만들어 둡니다.",
      },
    ],
    pitfalls: [
      "모범답안을 외워 가는 것 — 스테이션이 여러 개라 외운 답은 세 번째 방에서 드러납니다",
      "'모르겠습니다'로 끊는 것 — 아는 범위까지 말하고 경계를 정직하게 긋는 편이 언제나 점수가 높습니다",
      "방마다 다른 사람이 되는 것 — 같은 지원자로 보이지 않으면 인성 항목에서 감점됩니다",
      "시간 초과 — 결론을 마지막에 배치하면 대부분 결론을 말하지 못하고 끝납니다",
    ],
    metaTitle: "의대 MMI 면접 대비 | T Medi — 다중미니면접 실시 대학·전형·수업",
    metaDescription:
      "의대 MMI(다중미니면접)를 실시하는 대학과 전형, 면접 방식과 면접일을 요강 기준으로 정리했습니다. 스테이션별 대응법과 1:1 줌 면접 수업 안내까지. tmedi.kr",
  },

  {
    key: "injeokseong",
    href: "/interview/injeokseong",
    name: "인 · 적성 면접 (생기부 기반)",
    short: "인·적성",
    tagline: "제출한 생활기록부를 놓고 사람됨과 준비도를 확인하는 면접",
    lede:
      "가장 많은 의대가 쓰는 방식입니다. 별도 제시문 없이, 지원자가 낸 학교생활기록부를 면접위원 2~3인이 놓고 질문합니다. 요강에는 '서류확인 면접' · '학생부 기반 면접' · '인성면접'처럼 서로 다른 이름으로 적혀 있지만, 질문의 출처가 생기부라는 점에서 준비 방법은 같습니다.",
    what: [
      "면접위원 2~3인 : 지원자 1인의 개별면접. 10~15분이 가장 흔하다",
      "질문의 출처가 학교생활기록부다 — 제시문도, 사전 출제문항도 없다",
      "평가요소와 배점을 요강에 숫자로 공개한 대학이 많다(예: 인성 50% + 전공적합성 50%)",
      "전 과정 블라인드 — 교복 착용, 출신 고교 · 부모 직업 언급이 금지된다",
      "전남대 · 제주대 · 고신대처럼 특정 영역에서 최하 등급을 받으면 총점과 무관하게 불합격시키는 규정을 둔 대학이 있다",
    ],
    drills: [
      {
        title: "생기부 한 줄마다 질문 만들기",
        body:
          "3년치 기재 내용을 문장 단위로 끊어 '왜 했는지 / 무엇을 배웠는지 / 그래서 무엇이 바뀌었는지' 세 질문을 붙입니다. 실제 면접 질문의 대부분이 여기서 나옵니다.",
      },
      {
        title: "과장하지 않는 훈련",
        body:
          "'답변의 진실성'을 평가항목으로 명시한 대학이 있습니다. 기재에 없는 이야기를 만들면 꼬리질문 두 번이면 드러나고, 그때부터는 내용이 아니라 태도가 깎입니다.",
      },
      {
        title: "대학이 쓴 평가요소 언어로 말하기",
        body:
          "진로역량 · 공동체역량 · 의사소통능력처럼 요강에 공개된 평가요소를 답변에 그대로 실어, 면접위원이 채점표에 옮겨 적기 쉽게 만듭니다.",
      },
      {
        title: "10분 안에 핵심만",
        body:
          "짧은 면접일수록 서론이 길면 활동 하나를 제대로 말하지 못하고 끝납니다. 첫 문장에 결론을 놓는 연습을 반복합니다.",
      },
    ],
    pitfalls: [
      "생기부를 다시 읽지 않고 들어가는 것 — 1학년 기재 내용을 되묻는 경우가 흔합니다",
      "모든 활동을 의대에 억지로 연결하는 것 — 연결이 부자연스러우면 진실성 점수가 깎입니다",
      "봉사 · 배려를 추상적으로만 말하는 것 — 장면 하나를 구체적으로 말하는 쪽이 항상 낫습니다",
      "면접 비중을 과소평가하는 것 — 가천대는 2단계 면접 50%, 동아대는 전형총점의 40%입니다",
    ],
    metaTitle: "의대 인적성 · 생기부 기반 면접 대비 | T Medi — 실시 대학·전형·수업",
    metaDescription:
      "생활기록부를 바탕으로 인성과 적성을 묻는 의대 면접(서류확인 면접·학생부 기반 면접)을 실시하는 대학과 전형, 평가요소를 요강 기준으로 정리했습니다. 1:1 줌 면접 수업 안내. tmedi.kr",
  },

  {
    key: "jesimun",
    href: "/interview/jesimun",
    name: "제시문 면접",
    short: "제시문",
    tagline: "그 자리에서 받은 지문을 읽고 논리를 세워야 하는 면접",
    lede:
      "대기실에서 제시문을 받아 10분 안팎으로 읽고, 들어가서 자기 해석을 말합니다. 생기부를 아무리 잘 준비해도 이 방식에서는 크게 도움이 되지 않습니다. 짧은 시간에 쟁점을 잡고, 근거를 붙이고, 반박을 받아내는 훈련이 그대로 점수가 됩니다.",
    what: [
      "숙지 시간(보통 10분) → 면접 시간(5~10분)의 2단계 구조",
      "제시문은 생명윤리 · 의료 상황 · 사회 쟁점이거나, 자료 · 그래프 해석이다",
      "서울대처럼 제시문 여러 개를 스테이션으로 이어 약 60분간 진행하는 대학도 있다",
      "건국대 글로컬 · 영남대처럼 서류확인 면접과 제시문 면접을 함께 실시하는 대학이 있다",
      "연세대 미래는 기출문제와 선행학습영향평가결과보고서를 공개한다 — 출제 범위를 직접 확인할 수 있다",
    ],
    drills: [
      {
        title: "10분 독해 루틴",
        body:
          "쟁점 한 문장 → 대립하는 두 입장 → 내 선택과 근거 둘 → 예상 반박 하나. 메모 없이 머릿속으로 이 순서를 도는 연습을 반복합니다.",
      },
      {
        title: "결론부터 말하기",
        body:
          "면접 시간이 5~10분입니다. 배경 설명을 앞에 붙이면 근거를 말하기 전에 시간이 끝납니다.",
      },
      {
        title: "자료 · 그래프를 근거로 인용하기",
        body:
          "제시문 안의 수치를 직접 인용하면 채점자가 '읽었다'를 확인합니다. 과학 개념이 얽힌 지문은 개념을 틀리지 않는 것이 우선입니다.",
      },
      {
        title: "반대 입장을 먼저 세우기",
        body:
          "내 입장의 약점을 스스로 먼저 말하면 꼬리질문의 힘이 빠집니다. 면접관이 준비한 반박을 미리 소진시키는 방식입니다.",
      },
    ],
    pitfalls: [
      "배경지식을 자랑하는 것 — 제시문 밖 지식을 끌어오면 대부분 감점 요인이 됩니다",
      "찬반을 끝까지 정하지 않는 것 — 양비론은 논리적 사고력 항목에서 점수가 나오지 않습니다",
      "윤리 문제를 감정으로 푸는 것 — '안타깝다'가 아니라 원칙과 이익형량의 언어로 말해야 합니다",
      "숙지 시간에 답변 문장을 통째로 만드는 것 — 시간이 모자라고, 꼬리질문에 버티지 못합니다",
    ],
    metaTitle: "의대 제시문 면접 대비 | T Medi — 실시 대학·전형·출제 방식·수업",
    metaDescription:
      "제시문을 읽고 답하는 의대 면접을 실시하는 대학과 전형, 숙지 시간과 면접 시간, 출제 방식을 요강 기준으로 정리했습니다. 10분 독해 루틴과 1:1 줌 면접 수업 안내. tmedi.kr",
  },
];

export function getInterviewType(key: string): InterviewType | undefined {
  return INTERVIEW_TYPES.find((t) => t.key === key);
}

/* -------------------------------------------------------------------------
 * 대학 → 유형 분류
 *
 *   primary : 그 대학 면접의 주된 형식. 대학 하나는 반드시 하나만 갖는다.
 *   also    : 함께 다루는 형식. 유형 페이지 아래쪽 '함께 보는 대학'에 들어간다.
 *   tag     : 표에 붙는 짧은 단서. 요강 문장에서 그대로 끌어온다.
 * ---------------------------------------------------------------------- */

type Assign = {
  primary: InterviewTypeKey;
  also?: InterviewTypeKey[];
  tag?: string;
};

const ASSIGN: Record<string, Assign> = {
  /* --- MMI : 면접실(스테이션)을 옮겨 다니는 대학 ------------------------ */
  snu: { primary: "mmi", also: ["jesimun"], tag: "제시문 다중 스테이션 · 약 60분" },
  korea: { primary: "mmi", also: ["jesimun"], tag: "제시문 면접 + 인·적성 MMI 2회" },
  ulsan: { primary: "mmi", also: ["jesimun"], tag: "다대일 다면평가 · 학생부 + 제시문" },
  hallym: { primary: "mmi", tag: "3개 면접실 — 인성 / 상황 / 모의상황" },
  keimyung: { primary: "mmi", tag: "3개 고사실 · 미흡 판정 시 불합격 규정" },
  inje: { primary: "mmi", tag: "전 전형 MMI · 문항 비공개" },
  "daegu-catholic": { primary: "mmi", also: ["jesimun"], tag: "다면인적성면접 · 제시문 공개" },
  konyang: { primary: "mmi", also: ["jesimun"], tag: "준비실 자료 숙지 후 다수 면접실 통과" },
  catholic: { primary: "mmi", tag: "인·적성면접 10분 / 20분(다면 구성)" },
  inha: { primary: "mmi", tag: "2개 면접실 이동 · 총 15분" },
  pusan: { primary: "mmi", also: ["jesimun"], tag: "2개 고사실 순회 — 공통문제 + 학생부" },

  /* --- 제시문 : 별도 지문·출제문항을 읽고 답하는 대학 -------------------- */
  yonsei: { primary: "jesimun", tag: "제시문 기반 면접 (MMI 아님)" },
  "yonsei-mirae": { primary: "jesimun", tag: "숙지 10분 + 면접 10분 · 의학적 인성" },
  "konkuk-glocal": { primary: "jesimun", tag: "서류확인 면접 + 제시문 면접 병행" },
  yeungnam: { primary: "jesimun", tag: "학생부 + 제시문 (전형별 상이)" },

  /* --- 인·적성 : 생기부·서류를 놓고 묻는 대학 ---------------------------- */
  kangwon: { primary: "injeokseong", tag: "2027부터 MMI 폐지 · 확인면접 1개 면접실" },
  skku: { primary: "injeokseong", tag: "학생부종합 면접 (다면 구성)" },
  cau: { primary: "injeokseong", tag: "학생부종합 면접" },
  hanyang: { primary: "injeokseong", tag: "학생부 기반 인성면접 · 2027 신설" },
  ajou: { primary: "injeokseong", tag: "학생부종합 면접" },
  chosun: { primary: "injeokseong", tag: "인성 · 적성 2영역 · 10분" },
  cnu: { primary: "injeokseong", tag: "서류확인 면접 · 2대1 15분 이내" },
  dankook: { primary: "injeokseong", tag: "다대일 서류면접 10분 이내" },
  donga: { primary: "injeokseong", tag: "2회 분리 면접 (각 7분) · 총점의 40%" },
  "dongguk-wise": { primary: "injeokseong", tag: "서류평가 기반 확인면접" },
  eulji: { primary: "injeokseong", tag: "정원외 2개 전형만 인성면접 · 5%" },
  ewha: { primary: "injeokseong", tag: "제출서류 기반 일반면접 · 30%" },
  gachon: { primary: "injeokseong", tag: "서류 기반 개별면접 · 2단계 면접 50%" },
  gnu: { primary: "injeokseong", tag: "3인 1조 개별면접 15분 · 제시문 없음" },
  jbnu: { primary: "injeokseong", tag: "3인 면접위원 서류확인 면접 10분" },
  jeju: { primary: "injeokseong", tag: "블라인드 개별면접 15분 · 과락 규정" },
  jnu: { primary: "injeokseong", tag: "2인 면접관 개별면접 15분 이내" },
  khu: { primary: "injeokseong", tag: "공통질문 + 서류확인 · 2대1 10분" },
  knu: { primary: "injeokseong", tag: "서류확인 면접 10분 · 지역의사전형은 인적성 고사장 별도" },
  kosin: { primary: "injeokseong", tag: "학종 대면 심층면접 / 교과 영상업로드" },
  sch: { primary: "injeokseong", tag: "지역의사선발전형만 인·적성 면접 10분" },
  wonkwang: { primary: "injeokseong", tag: "서류확인 개별면접 · 의예과 3인 1조" },
};

/** 2027학년도에 의예과 면접을 실시하지 않는 대학. */
export const NO_INTERVIEW_SLUGS = ["catholic-kwandong", "cbnu"] as const;

export type TypedUniv = {
  univ: UnivPage;
  /** 표에 붙는 짧은 단서 */
  tag?: string;
  /** 이 유형이 그 대학의 주된 형식인가 */
  primary: boolean;
};

/** 그 유형을 주된 형식으로 쓰는 대학. UNIV_PAGES 순서(권역 → 가나다)를 그대로 따른다. */
export function univsOfType(key: InterviewTypeKey): TypedUniv[] {
  return UNIV_PAGES.filter((u) => ASSIGN[u.slug]?.primary === key).map((u) => ({
    univ: u,
    tag: ASSIGN[u.slug]?.tag,
    primary: true,
  }));
}

/** 주 형식은 다르지만 이 유형을 함께 다루는 대학. */
export function alsoUnivsOfType(key: InterviewTypeKey): TypedUniv[] {
  return UNIV_PAGES.filter((u) => ASSIGN[u.slug]?.also?.includes(key)).map((u) => ({
    univ: u,
    tag: ASSIGN[u.slug]?.tag,
    primary: false,
  }));
}

/** 허브 카드에 찍는 숫자. */
export function typeCounts(key: InterviewTypeKey): { primary: number; also: number } {
  return { primary: univsOfType(key).length, also: alsoUnivsOfType(key).length };
}

/** 면접을 실시하지 않는 대학 페이지. */
export function noInterviewUnivs(): UnivPage[] {
  return UNIV_PAGES.filter((u) =>
    (NO_INTERVIEW_SLUGS as readonly string[]).includes(u.slug),
  );
}

/** 면접 데이터는 있는데 아직 어느 유형에도 넣지 않은 대학 — 데이터 갱신 누락 점검용. */
export const UNCLASSIFIED = UNIV_PAGES.filter(
  (u) =>
    u.interview &&
    !ASSIGN[u.slug] &&
    !(NO_INTERVIEW_SLUGS as readonly string[]).includes(u.slug),
).map((u) => u.slug);

/* -------------------------------------------------------------------------
 * 면접 수업 — 절차 · 조건 (사용자 확정, 2026-09-19)
 *
 *   금액·수업 길이의 SSOT 는 lib/mmi-schedule.ts 의 TUITION / SESSION_MINUTES 다.
 *   여기서 숫자를 다시 적지 않는다.
 * ---------------------------------------------------------------------- */

export const SESSION_HOURS_LABEL = `${Math.floor(SESSION_MINUTES / 60)}시간 ${
  SESSION_MINUTES % 60
}분`;

export const CLASS_FLOW: { title: string; body: string }[] = [
  {
    title: "예약",
    body:
      "지원 대학과 면접일을 알려주시면 남은 기간에 맞춰 수업 횟수와 날짜를 잡습니다. 1단계 발표 전이라면 결과를 기다리는 자리로 먼저 잡아 둘 수 있습니다.",
  },
  {
    title: "수업 전 과제 부여",
    body:
      "수업 전에 과제를 먼저 드립니다. 생기부 기반 예상 질문 정리, 제시문 풀이, 답변 녹음 등 지원 대학의 면접 유형에 맞춰 나갑니다. 준비된 상태에서 시작하므로 수업 시간을 전부 실전에 씁니다.",
  },
  {
    title: `줌 온라인 1:1 수업 · 1회 ${SESSION_HOURS_LABEL}`,
    body:
      "줌으로 강사 1명 : 학생 1명으로 진행합니다. 실전과 같은 조건으로 모의면접을 돌리고, 답변 논리와 표현 · 태도 · 시선을 그 자리에서 교정합니다.",
  },
  {
    title: "다음 수업 과제",
    body:
      "그날 드러난 약점을 다음 과제로 바꿔 드립니다. 다음 수업은 그 과제를 확인하는 데서 시작하므로, 회차가 쌓일수록 같은 실수가 줄어듭니다.",
  },
];

export const CLASS_INCLUDES: string[] = [
  "1:1 개인지도 — 강사 1명 : 학생 1명",
  `줌 온라인 수업 · 1회 ${SESSION_HOURS_LABEL}`,
  "수업 전 과제 → 수업 → 다음 과제로 이어지는 반복 구조",
  "지원 대학의 면접 유형과 빈출 문항으로 실전 모의면접",
  "생기부 기반 예상 질문 예측 · 정리",
  "답변 논리 · 표현 · 태도 · 시선 즉시 교정",
];

export const CLASS_PRICE = {
  label: TUITION.perSessionLabel,
  suffix: "/ 1회",
  unit: TUITION.unit,
} as const;
