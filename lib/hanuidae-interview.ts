import {
  fieldEarliest,
  fieldTotals,
  type FieldUniv,
} from "./field-interview";

/** =========================================================================
 *  한의예과 면접 — 2027학년도 수시 실측 데이터
 *
 *  출처: 각 대학 2027학년도 수시 모집요강(요강 원문 추출본
 *        `2027_전형별모집단위_요강.json` 의 면접·실기평가 / 전형방법 / 전형일정).
 *
 *  ⚠️ 요강에 적힌 문장만 옮긴다. 다른 계열 데이터로 유추하지 않는다.
 *
 *  ⚠️ 동국대 WISE 는 요강 추출본에 전형방법·면접 필드가 비어 있어
 *     면접 실시 여부를 확정할 수 없다. 'unverified' 로 두고 추정하지 않는다.
 *  ========================================================================= */

export type HanuidaeUniv = FieldUniv;

export const HANUIDAE_UNIVS: FieldUniv[] = [
  {
    slug: "donga-ui",
    short: "동의대",
    name: "동의대학교 한의과대학 한의예과",
    zone: "경상",
    style: "injeokseong",
    styleLabel: "면접 70% · 수능최저 없음",
    headline: "2단계가 사실상 면접 시험이다",
    format: [
      "학교생활우수자(면접)전형 — 1단계 서류평가 100%(6배수, 모집 10명 초과 시 4배수)",
      "2단계는 서류 30% + 면접 70% — 국내 한의대 중 면접 비중이 가장 크다",
      "개별면접, 입학사정관 2인, 1인당 10분 이내, 블라인드",
      "평가요소와 배점이 공개돼 있다: 학업역량(문제해결능력) 180점 + 전공적합성(진로정보탐색능력) 120점",
      "점수 범위는 최고 300점 ~ 최저 210점. 수능 최저학력기준이 없고 수능 미응시자도 지원할 수 있다",
    ],
    drills: [
      "면접 70% 에 수능 최저가 없다. 1단계만 통과하면 사실상 면접 한 번으로 결정된다고 보고 준비량을 잡는다",
      "학업역량이 180점으로 더 크다. 다만 '문제해결능력' 이라는 이름이 붙어 있어, 성적이 아니라 막힌 지점을 어떻게 풀었는지를 묻는다",
      "전공적합성은 '진로정보탐색능력' 이다 — 한의학을 알아보기 위해 실제로 무엇을 찾아보고 만나 봤는지가 드러나야 한다",
      "최저 210점이라 바닥이 높다. 감점 요인을 지우는 것보다 상단 90점 구간에서 변별이 난다",
      "1단계 발표(11/20)에서 면접(11/28)까지 8일이다",
    ],
    tracks: [
      { name: "학교생활우수자(면접)전형", kind: "종합", quota: 9, interview: true,
        weight: "1단계 서류 100%(6배수, 10명 초과 시 4배수) → 2단계 서류 30% + 면접 70%",
        announce: "2026-11-20", date: "2026-11-28", minimum: "없음(수능 미응시자도 지원 가능)" },
      { name: "일반고교과전형", kind: "교과", quota: 9, interview: false,
        weight: "학생부교과 100% 일괄합산", announce: null, date: null,
        minimum: "3개 영역 등급 합 5 이내" },
      { name: "지역인재교과전형", kind: "교과", quota: 17, interview: false,
        weight: "학생부교과 100% 일괄합산", announce: null, date: null,
        minimum: "3개 영역 등급 합 5 이내" },
      { name: "지역인재교과(저소득층)전형", kind: "교과", quota: 1, interview: false,
        weight: "학생부교과 100% 일괄합산", announce: null, date: null,
        minimum: "3개 영역 등급 합 5 이내" },
    ],
  },
  {
    slug: "semyung",
    short: "세명대",
    name: "세명대학교 한의과대학 한의예과",
    zone: "충청",
    style: "injeokseong",
    styleLabel: "면접 47% · 다대다 · 배점 공개",
    headline: "전공적성 230점 — 배점의 절반이 한 축에 있다",
    format: [
      "면접우수자전형 — 학생부 교과 53%(실질 50.5%) + 면접 47%(실질 49.5%), 사정총점 1,000점",
      "면접 배점이 공개돼 있다: 인성 및 태도 120점 + 지원동기 120점 + 전공적성 230점",
      "다대다 방식, 블라인드 평가",
      "면접 고사일은 2026년 10월 24일 — 수능 전이다",
      "수능 최저학력기준이 없다",
    ],
    drills: [
      "전공적성 230점이 면접 배점의 절반이다. 한의학의 무엇을 알고 있고 무엇을 해 봤는지에 준비 시간을 몰아준다",
      "다대다 면접이다. 다른 지원자가 말하는 동안의 태도까지 보인다는 뜻이고, 앞사람 답변에 끌려가지 않는 훈련이 필요하다",
      "수능 전 10월 24일이다. 수능 공부와 면접 준비의 시간 배분을 9월에 미리 정해야 한다",
      "수능 최저가 없어 면접 결과가 그대로 남는다. 최저 탈락을 기대하고 들어가는 구조가 아니다",
    ],
    tracks: [
      { name: "면접우수자전형", kind: "교과", quota: 16, interview: true,
        weight: "학생부 교과 53%(실질 50.5%) + 면접 47%(실질 49.5%), 총 1,000점",
        announce: null, date: "2026-10-24", minimum: "없음" },
      { name: "SMU의료인재전형", kind: "종합", quota: 5, interview: false,
        weight: "서류평가 100%. 학업역량 300 / 진로역량 400 / 공동체역량 300",
        announce: null, date: null, minimum: "국·수(미적분/기하)·영 3개 영역 합 5 이내" },
      { name: "지역인재(기회균형)전형", kind: "교과", quota: 2, interview: false,
        weight: "학생부 교과 100%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 합 5 이내" },
      { name: "특성화고교인재전형", kind: "교과", quota: 3, interview: false,
        weight: "학생부 교과 100%", announce: null, date: null, minimum: "없음" },
    ],
    notes: [
      "면접우수자전형은 최초합격자 발표가 2026년 11월 13일 이전으로, 수능 성적 발표보다 먼저 나옵니다.",
    ],
  },
  {
    slug: "daejeon",
    short: "대전대",
    name: "대전대학교 한의과대학 한의예과",
    zone: "충청",
    style: "jesimun",
    styleLabel: "기본소양문항 · 사전 비공개",
    headline: "전국 한의대 중 면접이 가장 이르다 — 10월 17일",
    format: [
      "교과면접전형 — 1단계 학생부 100%(8배수) → 2단계 실질 교과성적·출결 59.5% + 면접 40.5%",
      "면접고사는 2026년 10월 17일(토) 하루만 실시한다",
      "기본소양문항은 사전 비공개이며, 면접 15분 전 준비실에서 공개된다",
      "1단계 합격자 발표는 10월 12일 — 발표에서 면접까지 5일이다",
    ],
    drills: [
      "문항을 미리 볼 수 없고 준비 시간이 15분이다. 외운 답이 아니라 15분 안에 뼈대를 세우는 훈련이 그대로 점수가 된다",
      "쟁점 한 문장 → 두 입장 → 내 선택과 근거 둘 → 예상 반박 하나. 이 순서를 메모 없이 도는 연습",
      "1단계 8배수로 넓다. 면접에서 대부분이 갈린다고 보고 준비량을 잡는다",
      "수능 한 달 전이다. 10월 12일 발표 이후 5일을 어떻게 쓸지 9월에 미리 정해 둔다",
    ],
    tracks: [
      { name: "교과면접전형", kind: "교과", quota: 18, interview: true,
        weight: "1단계 학생부 100%(8배수) → 2단계 교과·출결 59.5% + 면접 40.5%",
        announce: "2026-10-12", date: "2026-10-17",
        minimum: "수학 포함 3개 영역 등급 합 5 이내 / 한국사 5등급 이내" },
    ],
  },
  {
    slug: "woosuk",
    short: "우석대",
    name: "우석대학교 한의과대학 한의예과",
    zone: "전라",
    style: "jesimun",
    styleLabel: "기본소양문항 선택 + 5분 준비",
    headline: "문항을 고르고 5분 준비해 들어간다",
    format: [
      "학생부교과(교과면접)전형 — 1단계 교과성적 100%(5배수) → 2단계 1단계 70% + 면접 30%",
      "대면 면접. 평가내용은 지원동기, 전공 관심도·적성, 인성·가치관, 의사소통 능력",
      "한의예과는 면접 준비실에서 기본소양문항 1문항을 선택한 뒤 5분간 답변을 준비한다(인성문항은 공통)",
      "1단계 발표 10월 23일 · 면접 10월 30일 — 수능 전이다",
    ],
    drills: [
      "문항을 고를 수 있다는 것이 이 대학의 특징이다. 어떤 유형이 나와도 고를 수 있도록 두세 갈래의 대비가 필요하다",
      "준비 시간이 5분뿐이다. 답변 문장을 만들지 말고 결론과 근거 둘만 고정하는 연습",
      "인성문항은 공통으로 나온다. 여기서는 시간을 벌 수 있으므로 미리 완성해 둔다",
      "면접 30% 에 1단계 5배수다. 교과 성적 차이를 면접으로 좁힐 수 있는 폭이 있다",
    ],
    tracks: [
      { name: "학생부교과(교과면접)전형", kind: "교과", quota: 8, interview: true,
        weight: "1단계 교과 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-10-23", date: "2026-10-30",
        minimum: "수학 포함 3개 영역 합 7 이내" },
      { name: "학생부교과(교과)전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 교과성적 100%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 합 7 이내" },
      { name: "학생부교과(지역인재1·2)전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 교과성적 100%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 합 7 이내" },
    ],
  },
  {
    slug: "khu",
    short: "경희대",
    name: "경희대학교 한의과대학 한의예과",
    zone: "수도권",
    style: "injeokseong",
    styleLabel: "공통질문 + 서류확인 면접",
    headline: "출제문항이 없다 — 인문·자연 모두 같은 면접",
    format: [
      "네오르네상스전형 2단계에서 실시. 출제문항 없는 서류확인 면접이다",
      "공통질문(지원동기 · 가치관 등) + 개인별 서류확인",
      "평가요소는 인성 50% + 전공적합성 50%",
      "1단계 서류 100%(의·약학계열 4배수) → 2단계 1단계 70% + 면접 30%",
      "한의예과는 인문·자연을 나눠 뽑지만 면접 방식은 같다",
    ],
    drills: [
      "공통질문이 먼저다. 지원동기를 90초 안에 끝내지 못하면 생기부를 말할 시간이 사라진다",
      "인문 지원자는 과학 배경이 약한 상태로 한의학 지원동기를 설명해야 한다. 그 간극을 메우는 서사를 미리 만든다",
      "출제문항이 없으므로 외울 기출이 없다. 내 생기부에서 나올 질문을 먼저 소진시키는 것이 유일한 대비다",
      "면접이 12월 5~6일 이틀에 걸쳐 실시된다. 배정일은 1단계 발표 후 확인한다",
    ],
    tracks: [
      { name: "네오르네상스전형", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 100%(의·약학계열 4배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-25", date: "2026-12-05",
        minimum: "3개 영역 등급 합 4 이내 + 한국사 5등급 이내" },
      { name: "지역균형전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 교과·비교과 70% + 교과종합평가 30%", announce: null, date: null,
        minimum: "3개 영역 등급 합 4 이내" },
      { name: "논술우수자전형", kind: "논술", quota: null, interview: false,
        weight: "논술고사 100%. 의·약학계는 수리논술 60% + 과학논술 40%(120분)",
        announce: null, date: "2026-11-21", minimum: "3개 영역 등급 합 4 이내" },
    ],
  },
  {
    slug: "wonkwang",
    short: "원광대",
    name: "원광대학교 한의과대학 한의예과",
    zone: "전라",
    style: "injeokseong",
    styleLabel: "3인 1조 · 전 종합전형 실시",
    headline: "학생부종합 계열 전형 전부가 면접을 본다",
    format: [
      "면접위원 3인 1조 개별면접",
      "1단계 서류 100%(700점, 4~5배수) → 2단계 1단계 70% + 면접 30%, 총 1,000점",
      "학생부종합 · 지역인재종합 · 지역인재기회균형 · 기회균형 · 농어촌 전 전형이 면접 실시",
      "인문·자연을 나눠 뽑으며 양쪽 다 같은 면접을 본다",
      "면접일이 12월 2일 하루로 전 전형이 같다",
    ],
    drills: [
      "3인 1조라 질문 각도가 셋으로 갈린다. 세 관점을 동시에 만족시키는 답변 구조가 필요하다",
      "지역인재종합이 자연 20명·인문 10명으로 규모가 가장 크다. 지역 요건을 먼저 확인한다",
      "전형에 따라 1단계 발표가 11월 20일과 12월 1일로 갈린다. 12월 1일 발표 전형은 면접까지 하루뿐이다",
      "같은 날 치의예과 면접도 함께 치러진다. 복수 지원 시 응시 가능 여부를 확인한다",
    ],
    tracks: [
      { name: "학생부종합전형(자연)", kind: "종합", quota: 8, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-20", date: "2026-12-02", minimum: "수학 포함 3개 영역 합 6 이내" },
      { name: "학생부종합전형(인문)", kind: "종합", quota: 4, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-20", date: "2026-12-02", minimum: "수학 포함 3개 영역 합 6 이내" },
      { name: "지역인재종합전형(자연)", kind: "종합", quota: 20, interview: true,
        weight: "1단계 서류 100%(4배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-12-01", date: "2026-12-02", minimum: "수학 포함 3개 영역 합 6 이내" },
      { name: "지역인재종합전형(인문)", kind: "종합", quota: 10, interview: true,
        weight: "1단계 서류 100%(4배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-12-01", date: "2026-12-02", minimum: "수학 포함 3개 영역 합 6 이내" },
      { name: "지역인재기회균형전형(자연)", kind: "종합", quota: 15, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-12-01", date: "2026-12-02", minimum: "수학 포함 3개 영역 합 6 이내" },
      { name: "농어촌학생전형(자연)", kind: "종합", quota: 3, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-12-01", date: "2026-12-02", minimum: "없음" },
    ],
  },
  {
    slug: "dhu",
    short: "대구한의대",
    name: "대구한의대학교 한의과대학 한의예과",
    zone: "경상",
    style: "none",
    styleLabel: "면접 미실시",
    headline: "교과도 종합도 면접이 없다",
    format: [
      "학생부교과 계열 전형은 교과성적 100%(지역인재는 교과 80% + 출결 20%)",
      "학생부종합 계열 전형도 서류 100% — 학업역량 30% · 전공역량 40% · 공동체역량 30%",
      "요강상 한의예과 전 전형에서 면접을 실시하지 않는다",
      "인문·자연을 나눠 뽑으며 수능 최저가 계열별로 다르다",
    ],
    drills: [
      "면접이 없으므로 제출 시점의 학생부와 수능 최저가 전부다",
      "종합전형은 전공역량 40% 가 최대 배점이다. 서류에서 한의학 관련 활동이 드러나야 한다",
      "인문 지원자는 수학이 확률과통계 기준이라 자연 지원자와 최저 기준이 다르다",
    ],
    tracks: [
      { name: "일반전형(교과·자연)", kind: "교과", quota: 12, interview: false,
        weight: "학생부 교과성적 100%", announce: null, date: null,
        minimum: "상위 3개 영역 등급 합 5 이내" },
      { name: "일반전형(종합·자연)", kind: "종합", quota: 10, interview: false,
        weight: "학생부 종합평가 100%(학업 30 · 전공 40 · 공동체 30)", announce: null, date: null,
        minimum: "상위 3개 영역 등급 합 5 이내" },
      { name: "지역인재전형(교과·자연)", kind: "교과", quota: 14, interview: false,
        weight: "학생부 교과 80% + 출결 20%", announce: null, date: null,
        minimum: "상위 3개 영역 등급 합 5 이내" },
      { name: "지역인재전형(종합·자연)", kind: "종합", quota: 14, interview: false,
        weight: "학생부 종합평가 100%", announce: null, date: null,
        minimum: "상위 3개 영역 등급 합 5 이내" },
    ],
  },
  {
    slug: "sangji",
    short: "상지대",
    name: "상지대학교 한의과대학 한의예과",
    zone: "강원",
    style: "none",
    styleLabel: "면접 미실시 (요강 명시)",
    headline: "학생부종합도 면접을 보지 않는다",
    format: [
      "교과 계열 전형은 교과 100%(0~1,000점)",
      "학생부종합 계열 전형은 교과성적(정량) 20% + 서류평가(정성) 80%",
      "요강에 '학생부종합은 면접 미시행' 이라고 명시돼 있다",
    ],
    drills: [
      "면접이 없으므로 서류와 수능 최저가 전부다",
      "종합전형의 정성평가가 80% 다. 생기부 기재의 밀도가 그대로 점수가 된다",
      "수능 최저가 선택지형이다 — 상위 3개 합 4 이내, 또는 수학(미적분/기하) 반영 시 5 이내",
    ],
    tracks: [
      { name: "종합일반", kind: "종합", quota: 15, interview: false,
        weight: "교과(정량) 20% + 서류평가(정성) 80%", announce: null, date: null,
        minimum: "상위 3개 합 4 이내 또는 수학(미적분/기하) 반영 시 5 이내" },
      { name: "종합강원인재", kind: "종합", quota: 8, interview: false,
        weight: "교과(정량) 20% + 서류평가(정성) 80%", announce: null, date: null,
        minimum: "상위 3개 합 5 이내 또는 수학 반영 시 6 이내" },
      { name: "교과일반", kind: "교과", quota: 7, interview: false,
        weight: "교과 100%", announce: null, date: null,
        minimum: "상위 3개 합 4 이내 또는 수학 반영 시 5 이내" },
      { name: "교과강원인재", kind: "교과", quota: 4, interview: false,
        weight: "교과 100%", announce: null, date: null,
        minimum: "상위 3개 합 5 이내 또는 수학 반영 시 6 이내" },
    ],
  },
  {
    slug: "gachon",
    short: "가천대",
    name: "가천대학교 한의과대학 한의예과",
    zone: "수도권",
    style: "none",
    styleLabel: "면접 미실시 · 논술 실시",
    headline: "면접 대신 논술이다",
    format: [
      "논술전형 논술 100% — 논술고사 2026년 11월 29일",
      "학생부우수자전형은 학생부교과 100%",
      "면접을 실시하는 전형이 없다",
      "수능 최저가 매우 높다 — 2개 영역 각 1등급(과탐 2과목 모두 1등급)",
    ],
    drills: [
      "면접이 아니라 논술이다. 준비물이 통째로 다르다",
      "수능 최저 2개 영역 각 1등급이 실질 관문이다. 충족 가능성부터 계산하고 지원을 정한다",
      "논술은 수능 후 11월 29일이다. 수능 직후 열흘을 논술에 쓸 수 있는지 미리 계획한다",
    ],
    tracks: [
      { name: "논술전형", kind: "논술", quota: 7, interview: false,
        weight: "논술 100%", announce: null, date: "2026-11-29",
        minimum: "2개 영역 각 1등급(과탐 2과목 모두 1등급)" },
      { name: "학생부우수자전형", kind: "교과", quota: 7, interview: false,
        weight: "학생부교과 100%", announce: null, date: null,
        minimum: "2개 영역 각 1등급" },
    ],
  },
  {
    slug: "pusan-han",
    short: "부산대",
    name: "부산대학교 한의학전문대학원 학·석사통합과정",
    zone: "경상",
    style: "none",
    styleLabel: "면접 미실시 · 논술 실시",
    headline: "교과와 논술 두 전형뿐이고 면접이 없다",
    format: [
      "학생부교과전형 — 학생부 교과 80% + 학업역량평가 20%",
      "논술전형 — 논술 80% + 학생부 교과 20%. 논술고사 2026년 11월 28일",
      "면접을 실시하는 전형이 없다",
    ],
    drills: [
      "면접이 없으므로 교과 성적과 수능 최저가 전부다",
      "논술전형은 의·약학계열 별도 문항이 출제된다. 수학 범위를 먼저 확인한다",
      "같은 대학 치의예과는 면접을 보지만 한의학전문대학원은 보지 않는다. 혼동하지 않는다",
    ],
    tracks: [
      { name: "학생부교과전형", kind: "교과", quota: 15, interview: false,
        weight: "학생부 교과 80% + 학업역량평가 20%", announce: null, date: null,
        minimum: "한국사 4등급 이내, 수학 포함 3개 영역 합 4 이내" },
      { name: "논술전형", kind: "논술", quota: 5, interview: false,
        weight: "논술 80% + 학생부 교과 20%", announce: null, date: "2026-11-28",
        minimum: "한국사 4등급 이내, 수학 포함 3개 영역 합 4 이내" },
    ],
  },
  {
    slug: "dsu",
    short: "동신대",
    name: "동신대학교 한의과대학 한의예과",
    zone: "전라",
    style: "none",
    styleLabel: "면접 미실시",
    headline: "요강에서 확인된 전형은 교과 하나뿐",
    format: [
      "농어촌학생전형 — 학생부 100%(교과성적 80% + 출결 20%), 1,000점 환산 후 성적순 선발",
      "이 전형은 면접을 실시하지 않는다",
      "한의예과 합격자 발표가 2026년 12월 16일로 별도 지정돼 있다",
    ],
    drills: [
      "면접이 없으므로 교과 성적과 수능 최저가 전부다",
      "요강 추출본에 잡힌 한의예과 전형이 농어촌 하나다. 다른 전형은 입학처 요강에서 직접 확인한다",
    ],
    tracks: [
      { name: "농어촌학생전형", kind: "교과", quota: 2, interview: false,
        weight: "학생부 100%(교과 80% + 출결 20%)", announce: null, date: null,
        minimum: "상위 3개 영역 등급 합 6 이내" },
    ],
    notes: [
      "요강 추출본에서 한의예과로 잡힌 전형이 농어촌학생전형 하나뿐입니다. 나머지 전형의 면접 여부는 입학처 요강에서 확인해 주세요.",
    ],
  },
];

/** 요강 추출본에 전형방법·면접 필드가 비어 있어 면접 여부를 확정하지 못한 대학. */
export const HANUIDAE_UNVERIFIED = [
  {
    short: "동국대 WISE",
    name: "동국대학교 WISE캠퍼스 한의과대학 한의예과",
    note:
      "교과 7개 · 종합 3개 전형이 확인되지만 요강 추출본에 전형방법과 면접 필드가 비어 있어 면접 실시 여부를 확정할 수 없습니다. 입학처 모집요강에서 직접 확인해 주세요.",
  },
];

export const HANUIDAE_WITH_INTERVIEW = HANUIDAE_UNIVS.filter((u) => u.style !== "none");
export const HANUIDAE_NO_INTERVIEW = HANUIDAE_UNIVS.filter((u) => u.style === "none");
export const hanuidaeEarliest = fieldEarliest;
export const HANUIDAE_TOTALS = fieldTotals(HANUIDAE_UNIVS);

/** 2027학년도 수능일. 수능 전 면접을 가려내는 기준이다. */
export const SUNEUNG_2027 = "2026-11-19";

/** 수능 전에 면접을 치르는 전형. 한의대의 가장 큰 특징이다. */
export function beforeSuneung() {
  const out: { univ: FieldUniv; track: FieldUniv["tracks"][number] }[] = [];
  for (const u of HANUIDAE_UNIVS) {
    for (const t of u.tracks) {
      if (t.interview && t.date && t.date < SUNEUNG_2027) out.push({ univ: u, track: t });
    }
  }
  return out.sort((a, b) => (a.track.date! < b.track.date! ? -1 : 1));
}
