/** =========================================================================
 *  치의예과 면접 — 2027학년도 수시 실측 데이터
 *
 *  출처: 각 대학 2027학년도 수시 모집요강(요강 원문에서 추출한
 *        `2027_전형별모집단위_요강.json` 의 면접·실기평가 / 전형방법 / 전형일정 필드).
 *
 *  ⚠️ 요강에 적힌 문장만 옮긴다. 의예과 데이터로 유추하지 않는다.
 *     같은 대학이라도 의예과와 치의예과의 면접 방식·일정은 다를 수 있다.
 *
 *  ⚠️ 서울대는 이 요강 추출본에 치의학 모집단위가 잡히지 않아 제외했다.
 *     학부 모집 여부를 입학처에서 확인한 뒤에 추가할 것. 추정으로 넣지 말 것.
 *  ========================================================================= */

export type ChidaeStyle = "jesimun" | "injeokseong" | "none";

export type ChidaeTrack = {
  /** 요강에 적힌 전형명 */
  name: string;
  kind: "교과" | "종합";
  /** 요강 기준 모집인원. 묶음 표기라 개별 인원이 없으면 null */
  quota: number | null;
  /** 이 전형이 면접을 실시하는가 */
  interview: boolean;
  /** 단계별 반영 비율 — 요강 문장에서 옮긴다 */
  weight: string;
  /** 1단계 합격자 발표일(ISO). 요강 미기재면 null */
  announce: string | null;
  /** 면접고사일(ISO). 요강 미기재면 null */
  date: string | null;
  minimum?: string;
};

export type ChidaeUniv = {
  slug: string;
  short: string;
  name: string;
  zone: string;
  style: ChidaeStyle;
  styleLabel: string;
  headline: string;
  /** 요강에서 확인된 면접 방식 문장 */
  format: string[];
  /** 이 대학을 겨냥한 훈련 포인트 */
  drills: string[];
  tracks: ChidaeTrack[];
  notes?: string[];
};

export const CHIDAE_UNIVS: ChidaeUniv[] = [
  {
    slug: "yonsei",
    short: "연세대",
    name: "연세대학교 치과대학 치의예과",
    zone: "수도권",
    style: "jesimun",
    styleLabel: "제시문 면접 · 현장 녹화",
    headline: "치대 중 유일하게 제시문을 읽고 답한다",
    format: [
      "현장 녹화 면접 — 제시문 기반으로 논리적 사고력과 의사소통능력을 평가한다",
      "학생부종합 활동우수형: 1단계 서류 100%(4배수) → 2단계 1단계 60% + 면접 40%",
      "면접 반영 40% 로 치대 중 가장 크다",
      "기회균형전형도 같은 제시문 면접이며 일정만 다르다(1단계 10/26 · 면접 11/1)",
    ],
    drills: [
      "면접 40% 는 1단계 서류 차이를 뒤집을 수 있는 폭이다. 서류가 앞서도 방심할 구간이 아니다",
      "제시문 면접이므로 생기부 복기만으로는 준비가 되지 않는다. 쟁점 특정 → 두 입장 → 내 선택과 근거 → 예상 반박 순서를 시간 안에 도는 훈련",
      "현장 녹화 방식이다. 카메라 앞에서 시선이 흔들리거나 말이 빨라지는 습관을 미리 잡아 둔다",
      "치의학 맥락(의료 윤리 · 환자 대응 · 술기와 판단)을 제시문 해석에 얹는 연습",
    ],
    tracks: [
      { name: "학생부종합[활동우수형]", kind: "종합", quota: 21, interview: true,
        weight: "1단계 서류 100%(4배수) → 2단계 1단계 60% + 면접 40%",
        announce: "2026-11-16", date: "2026-11-22",
        minimum: "국어·수학 중 1개 포함 1등급 2개 이상, 영어 3등급 이내, 한국사 4등급 이내" },
      { name: "학생부종합[기회균형]", kind: "종합", quota: 2, interview: true,
        weight: "1단계 서류 100%(3배수) → 2단계 1단계 60% + 면접 40%",
        announce: "2026-10-26", date: "2026-11-01", minimum: "없음" },
      { name: "학생부교과[추천형]", kind: "교과", quota: 10, interview: false,
        weight: "일괄합산 학생부교과(정량평가) 100%", announce: null, date: null,
        minimum: "국어·수학 중 1개 포함 1등급 2개 이상, 영어 3등급 이내, 한국사 4등급 이내" },
    ],
  },
  {
    slug: "knu",
    short: "경북대",
    name: "경북대학교 치과대학 치의예과",
    zone: "경상",
    style: "injeokseong",
    styleLabel: "서류 기반 면접 · 과락 규정 있음",
    headline: "면접 60% 미만이면 총점과 무관하게 불합격",
    format: [
      "개인별 10분 내외. 다수 평가위원이 150점 만점으로 매긴 점수의 평균",
      "학업역량 · 진로역량 · 공동체역량을 종합평가",
      "1단계 서류 350점(치의예과는 5배수) → 2단계 1단계 70% + 면접 30%",
      "면접 60% 미만자는 불합격 — 요강에 명시된 과락 규정이다",
    ],
    drills: [
      "고득점보다 과락 회피가 먼저다. 침묵 · 동문서답 · 태도 문제를 먼저 제거한 뒤 점수를 올린다",
      "평가위원이 여러 명이고 점수를 평균한다. 한 사람을 설득하는 화법이 아니라 누가 들어도 같은 결론에 닿는 답변 구조가 필요하다",
      "학업 · 진로 · 공동체 세 축에 내 활동을 미리 분류해 둔다. 10분 안에 세 축을 고르게 보여야 한다",
      "지역인재 학교장추천전형은 치의예과 3명 모집이다. 경쟁 규모를 감안해 일정을 일찍 잡는다",
    ],
    tracks: [
      { name: "지역인재전형", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 350점(치의예 5배수) → 2단계 1단계 70% + 면접 30%. 면접 60% 미만 불합격",
        announce: "2026-11-06", date: "2026-11-21",
        minimum: "수학 포함 3개 영역 등급 합 4 이내" },
      { name: "지역인재 학교장추천전형", kind: "종합", quota: 3, interview: true,
        weight: "1단계 서류 350점(5배수) → 2단계 1단계 70% + 면접 30%. 면접 60% 미만 불합격",
        announce: "2026-11-06", date: "2026-11-21",
        minimum: "수학 포함 3개 영역 등급 합 4 이내, 한국사 응시" },
      { name: "교과우수자전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 교과 400점(80%) + 서류평가(교과이수충실도) 100점(20%)",
        announce: null, date: null },
      { name: "농어촌학생전형", kind: "종합", quota: null, interview: false,
        weight: "서류평가 500점 100%. 서류평가 40% 미만 불합격", announce: null, date: null },
    ],
  },
  {
    slug: "khu",
    short: "경희대",
    name: "경희대학교 치과대학 치의예과",
    zone: "수도권",
    style: "injeokseong",
    styleLabel: "공통질문 + 서류확인 면접",
    headline: "출제문항이 없다 — 공통질문과 생기부가 전부",
    format: [
      "네오르네상스전형 2단계에서 실시. 출제문항 없는 서류확인 면접이다",
      "공통질문(지원동기 · 가치관 등) + 개인별 서류확인",
      "평가요소는 인성 50% + 전공적합성 50%",
      "1단계 서류 100%(의·약학계열 4배수) → 2단계 1단계 70% + 면접 30%",
    ],
    drills: [
      "공통질문이 먼저 나온다. 지원동기를 90초 안에 끝내지 못하면 생기부를 말할 시간이 사라진다",
      "인성 50% 가 절반이다. 협업 · 갈등 조정 경험을 장면 하나로 구체화해 둔다",
      "출제문항이 없으므로 기출을 외울 대상이 없다. 내 생기부에서 나올 질문을 먼저 소진시키는 쪽이 유일한 대비다",
      "면접이 12월 5~6일 이틀에 걸쳐 실시된다. 배정일은 1단계 발표 후 확인한다",
    ],
    tracks: [
      { name: "네오르네상스전형", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 100%(의·약학계열 4배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-25", date: "2026-12-05",
        minimum: "국·수·영·탐(2과목) 중 3개 영역 등급 합 4 이내 + 한국사 5등급 이내" },
      { name: "지역균형전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 교과·비교과 70% + 교과종합평가 30%", announce: null, date: null,
        minimum: "3개 영역 등급 합 4 이내 + 한국사 5등급 이내" },
      { name: "논술우수자전형", kind: "교과", quota: 13, interview: false,
        weight: "논술고사 100%. 의·약학계는 수리논술 60% + 과학논술 40%(120분)",
        announce: null, date: "2026-11-21" },
    ],
    notes: [
      "논술우수자전형은 면접이 아니라 논술고사입니다. 수학 필수, 과학은 물리·화학·생명과학 중 1과목을 선택합니다.",
    ],
  },
  {
    slug: "pusan",
    short: "부산대",
    name: "부산대학교 치의학전문대학원 학·석사통합과정 치의학과",
    zone: "경상",
    style: "injeokseong",
    styleLabel: "학생부 기반 면접 · 다대일",
    headline: "탐구역량과 사회역량 두 축으로 10분",
    format: [
      "학생부 기반 면접 10분 내외. 다수 평가자가 지원자 1인을 대면한다",
      "평가영역은 탐구역량 · 사회역량 (의예과에만 붙는 잠재역량 공통문제는 없다)",
      "1단계 서류평가 100%(치의예 4배수) → 2단계 1단계 80% + 면접 20%",
      "지역인재전형 20명으로 모집 규모가 가장 크다",
    ],
    drills: [
      "면접 20% 는 크지 않지만 1단계 4배수라 면접장에 들어오는 인원이 많다. 변별은 결국 면접에서 난다",
      "탐구역량 — 탐구활동 하나를 골라 가설 · 방법 · 한계까지 말할 수 있게 정리한다",
      "사회역량 — 협업과 배려를 추상어가 아니라 장면으로 말한다",
      "의예과와 평가영역이 다르다. 의대 면접 자료를 그대로 쓰면 잠재역량 공통문제를 준비하느라 시간을 버린다",
    ],
    tracks: [
      { name: "학생부종합전형", kind: "종합", quota: 8, interview: true,
        weight: "1단계 서류 100%(치의예 4배수) → 2단계 1단계 80% + 면접 20%",
        announce: "2026-12-01", date: "2026-12-05",
        minimum: "한국사 4등급 이내, 수학 포함 3개 영역 등급 합 5 이내" },
      { name: "지역인재전형", kind: "종합", quota: 20, interview: true,
        weight: "1단계 서류 100%(치의예 4배수) → 2단계 1단계 80% + 면접 20%",
        announce: "2026-12-01", date: "2026-12-05",
        minimum: "한국사 4등급 이내, 수학 포함 3개 영역 등급 합 5 이내" },
      { name: "학생부교과전형", kind: "교과", quota: 20, interview: false,
        weight: "학생부 교과 80% + 학업역량평가 20%", announce: null, date: null,
        minimum: "한국사 4등급 이내, 수학 포함 3개 영역 등급 합 4 이내" },
      { name: "지역인재 저소득층학생전형", kind: "종합", quota: 2, interview: false,
        weight: "서류평가 100%", announce: null, date: null },
    ],
  },
  {
    slug: "kangwon",
    short: "강원대",
    name: "강원대학교 치과대학 치의예과",
    zone: "강원",
    style: "injeokseong",
    styleLabel: "인·적성면접 · 2대1 블라인드",
    headline: "인성 40 · 적성 60 으로 배점이 공개돼 있다",
    format: [
      "인·적성면접 — 면접관 2인 대 지원자 1인 개별 면접, 블라인드, 1인당 10분 내외",
      "평가요소 배점이 공개돼 있다: 인성 40% · 적성 60%",
      "1단계 서류평가 100%(5배수) → 2단계 서류 60%(120점) + 면접 40%(80점), 총 200점",
      "면접 반영 40% 로 연세대와 함께 치대 중 가장 크다",
    ],
    drills: [
      "적성 60% 가 더 크다. 치의학을 택한 이유와 그 준비 과정을 활동의 연쇄로 설명하는 쪽에 시간을 더 쓴다",
      "블라인드다 — 교복 · 출신 고교 · 부모 직업 언급이 금지된다. 습관적으로 나오는 표현을 미리 지운다",
      "10분 개별면접이라 서론이 길면 활동 하나를 제대로 말하지 못하고 끝난다",
      "미래인재면접Ⅰ · 기회균형면접 · 농어촌 세 전형의 면접일이 11월 27일로 같다",
    ],
    tracks: [
      { name: "미래인재면접Ⅰ전형", kind: "종합", quota: 12, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 서류 60% + 인·적성면접 40%",
        announce: "2026-11-20", date: "2026-11-27",
        minimum: "국어·수학(필수)·영어·과탐(우수1과목) 중 3개 영역 합 6등급 이내" },
      { name: "기회균형면접전형", kind: "종합", quota: 2, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 서류 60% + 인·적성면접 40%",
        announce: "2026-11-20", date: "2026-11-27",
        minimum: "3개 영역 합 6등급 이내(수학 필수)" },
      { name: "농어촌학생전형", kind: "종합", quota: 2, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 서류 60% + 인·적성면접 40%",
        announce: "2026-11-20", date: "2026-11-27",
        minimum: "3개 영역 합 6등급 이내(수학 필수)" },
      { name: "지역교과Ⅰ전형", kind: "교과", quota: null, interview: false,
        weight: "학생부교과 100%(1,000점)", announce: null, date: null,
        minimum: "치의예과: 3개 영역 합 6등급 이내" },
    ],
  },
  {
    slug: "dankook",
    short: "단국대",
    name: "단국대학교(천안) 치과대학 치의예과",
    zone: "충청",
    style: "injeokseong",
    styleLabel: "DKU인재 면접형",
    headline: "면접형과 교과형이 갈린다 — 지원 전형부터 확인",
    format: [
      "DKU인재(면접형) 2단계에서 면접 실시. 의·약학계열 면접일은 2026년 11월 28일",
      "1단계 학생부 100%(3배수) → 2단계 1단계 70% + 면접 30%",
      "농어촌학생전형도 같은 날 같은 방식으로 면접을 본다(1단계 5배수)",
      "학생부교과우수자 · 지역메디바이오인재는 면접이 없는 교과 전형이다",
    ],
    drills: [
      "같은 대학 안에서 면접형과 교과형이 갈린다. 지원 전형을 먼저 확정하지 않으면 준비가 헛돈다",
      "1단계 3배수로 좁다. 면접장에 들어가면 서류 차이가 크지 않은 사람들끼리 겨룬다는 뜻이다",
      "수능 최저가 수학 포함 3개 영역 합 5등급으로 높다. 면접 준비와 최저 준비의 시간 배분을 먼저 정한다",
      "1단계 발표(11/20)에서 면접(11/28)까지 8일이다. 이 구간에 맞춰 회차를 역산한다",
    ],
    tracks: [
      { name: "DKU인재(면접형)", kind: "종합", quota: 21, interview: true,
        weight: "1단계 학생부 100%(3배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-20", date: "2026-11-28",
        minimum: "수학(미적분/기하) 포함 3개 영역 합 5등급 이내" },
      { name: "농어촌학생전형", kind: "종합", quota: 1, interview: true,
        weight: "1단계 학생부 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-20", date: "2026-11-28",
        minimum: "수학 포함 3개 영역 합 5등급 이내" },
      { name: "학생부교과우수자전형", kind: "교과", quota: 21, interview: false,
        weight: "교과 95% + 비교과(출결) 5%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 합 5등급 이내" },
      { name: "지역메디바이오인재전형", kind: "교과", quota: 21, interview: false,
        weight: "교과 95% + 비교과(출결) 5%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 합 5등급 이내" },
    ],
  },
  {
    slug: "wonkwang",
    short: "원광대",
    name: "원광대학교 치과대학 치의예과",
    zone: "전라",
    style: "injeokseong",
    styleLabel: "3인 1조 면접 · 전 종합전형 실시",
    headline: "학생부종합 계열 전형 전부가 면접을 본다",
    format: [
      "면접위원 3인 1조 개별면접",
      "1단계 서류 100%(700점, 4~5배수) → 2단계 1단계 70% + 면접 30%, 총 1,000점",
      "학생부종합 · 지역인재종합 · 지역인재기회균형 · 기회균형 · 농어촌 전 전형이 면접 실시",
      "자연계열과 인문계열을 나눠 뽑는다 — 인문 지원자도 같은 면접을 본다",
      "면접일이 12월 2일 하루로 전 전형이 같다",
    ],
    drills: [
      "3인 1조라 질문 각도가 셋으로 갈린다. 한 사람을 설득하는 화법이 아니라 세 관점을 동시에 만족시키는 구조가 필요하다",
      "지역인재종합 18명으로 모집 규모가 가장 크다. 지역 요건을 먼저 확인한다",
      "전형에 따라 1단계 발표가 11월 20일과 12월 1일로 갈린다. 12월 1일 발표 전형은 면접까지 하루뿐이다",
      "인문계열 지원자는 과학 배경이 약한 상태로 치의학 지원동기를 설명해야 한다. 그 간극을 메우는 서사를 미리 만든다",
    ],
    tracks: [
      { name: "학생부종합전형(자연)", kind: "종합", quota: 4, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-20", date: "2026-12-02",
        minimum: "수학 포함 3개 영역 등급 합 6 이내" },
      { name: "학생부종합전형(인문)", kind: "종합", quota: 2, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-20", date: "2026-12-02",
        minimum: "수학 포함 3개 영역 등급 합 6 이내" },
      { name: "지역인재종합전형(자연)", kind: "종합", quota: 18, interview: true,
        weight: "1단계 서류 100%(4배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-12-01", date: "2026-12-02",
        minimum: "수학 포함 3개 영역 등급 합 6 이내" },
      { name: "지역인재기회균형전형(자연)", kind: "종합", quota: 8, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-12-01", date: "2026-12-02",
        minimum: "수학 포함 3개 영역 등급 합 6 이내" },
      { name: "농어촌학생전형(자연)", kind: "종합", quota: 2, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-12-01", date: "2026-12-02", minimum: "없음" },
    ],
  },
  {
    slug: "jbnu",
    short: "전북대",
    name: "전북대학교 치과대학 치의예과",
    zone: "전라",
    style: "injeokseong",
    styleLabel: "3인 면접위원 · 블라인드 10분",
    headline: "큰사람전형 하나만 면접을 본다",
    format: [
      "면접위원 3인, 약 10분, 블라인드 평가",
      "1단계 서류평가 1,000점(3배수) → 2단계 1단계 800점(80%) + 면접 200점(20%)",
      "각 단계 평가에서 학교폭력 가해학생 조치사항을 정성평가로 반영한다",
      "교과 계열 전형(일반학생 · 지역인재1·2유형)은 면접이 없다",
    ],
    drills: [
      "면접을 보는 전형은 큰사람전형 하나다. 나머지 전형 지원자는 면접 준비 시간을 수능 최저로 돌리는 편이 낫다",
      "면접 20% 에 1단계 3배수다. 서류가 앞선 상태로 들어가면 지키는 면접, 뒤진 상태면 뒤집는 면접이 된다",
      "블라인드 10분 — 출신 고교나 지역이 드러나는 표현을 미리 걷어낸다",
      "1단계 발표(11/20)에서 면접(11/26)까지 6일이다",
    ],
    tracks: [
      { name: "큰사람전형", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 1,000점(3배수) → 2단계 1단계 800점(80%) + 면접 200점(20%)",
        announce: "2026-11-20", date: "2026-11-26",
        minimum: "수학 포함 3개 영역 등급 합 6" },
      { name: "일반학생전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 1,000점 100%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 등급 합 6" },
      { name: "지역인재1유형전형(호남권)", kind: "교과", quota: null, interview: false,
        weight: "학생부 1,000점 100%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 등급 합 6" },
      { name: "지역인재2유형전형(전북권)", kind: "교과", quota: null, interview: false,
        weight: "학생부 1,000점 100%", announce: null, date: null,
        minimum: "수학 포함 3개 영역 등급 합 6" },
    ],
  },
  {
    slug: "chosun",
    short: "조선대",
    name: "조선대학교 치과대학 치의예과",
    zone: "전라",
    style: "injeokseong",
    styleLabel: "학생부종합 면접전형",
    headline: "인성·가치관과 전공 학업열의 두 덩어리",
    format: [
      "학생부종합(면접전형) 2단계에서 실시",
      "1단계 서류평가 100%(5배수) → 2단계 1단계 70% + 면접평가 30%",
      "면접은 인성 및 가치관, 전공 및 적성영역에 대한 학업열의를 포괄적으로 평가",
      "학생부종합(서류전형) · 교과 계열 전형은 면접이 없다",
    ],
    drills: [
      "면접전형과 서류전형이 나뉜다. 서류전형 지원자는 면접이 없으므로 준비 방향이 완전히 다르다",
      "'학업열의' 가 평가 문구에 들어 있다. 치의학을 배우기 위해 무엇을 미리 해 봤는지가 드러나야 한다",
      "1단계 5배수로 넓다. 면접에서 대부분이 갈린다고 보고 준비량을 잡는다",
      "면접일이 요강에 명시돼 있지 않다. 1단계 발표 공지를 반드시 확인한다",
    ],
    tracks: [
      { name: "학생부종합(면접전형)", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 100%(5배수) → 2단계 1단계 70% + 면접 30%",
        announce: null, date: null,
        minimum: "3개 영역 합 5등급 이내(수학 의무반영)" },
      { name: "학생부종합(서류전형)", kind: "종합", quota: null, interview: false,
        weight: "일괄합산 서류평가 100%", announce: null, date: null,
        minimum: "3개 영역 합 5등급 이내" },
      { name: "학생부교과(지역인재전형)", kind: "교과", quota: null, interview: false,
        weight: "학생부 100%", announce: null, date: null,
        minimum: "3개 영역 합 5등급 이내" },
      { name: "학생부교과(지역기회균형전형)", kind: "교과", quota: null, interview: false,
        weight: "학생부 100%", announce: null, date: null,
        minimum: "3개 영역 합 6등급 이내" },
    ],
    notes: [
      "면접일이 요강에 기재돼 있지 않습니다. 1단계 합격자 발표 공지에서 확인해야 합니다.",
    ],
  },
  {
    slug: "jnu",
    short: "전남대",
    name: "전남대학교 치의학전문대학원",
    zone: "전라",
    style: "none",
    styleLabel: "면접 미실시",
    headline: "수시 모집이 교과 1명뿐이고 면접이 없다",
    format: [
      "학생부교과(지역균형) 치의학전문대학원 1명 — 일괄선발 학생부 100%",
      "면접을 실시하지 않는다",
      "수능 최저: 3개 영역 합 7등급 이내",
    ],
    drills: [
      "면접이 없으므로 제출 시점의 학생부와 수능 최저가 전부다",
      "모집 1명이다. 지원 위치를 보수적으로 잡고 다른 대학과의 조합을 먼저 설계한다",
    ],
    tracks: [
      { name: "학생부교과(지역균형)", kind: "교과", quota: 1, interview: false,
        weight: "일괄선발 학생부 100%(1,000점)", announce: null, date: null,
        minimum: "3개 영역 합 7등급 이내" },
    ],
  },
];

/* -------------------------------------------------------------------------
 * 집계 — 페이지에서 숫자를 하드코딩하지 않는다
 * ---------------------------------------------------------------------- */

export const CHIDAE_WITH_INTERVIEW = CHIDAE_UNIVS.filter((u) => u.style !== "none");
export const CHIDAE_NO_INTERVIEW = CHIDAE_UNIVS.filter((u) => u.style === "none");

export function chidaeInterviewTracks(u: ChidaeUniv) {
  return u.tracks.filter((t) => t.interview);
}

/** 그 대학의 가장 이른 면접일(ISO). 미공지면 null */
export function chidaeEarliest(u: ChidaeUniv): string | null {
  const ds = u.tracks.filter((t) => t.interview && t.date).map((t) => t.date!);
  return ds.length ? ds.sort()[0] : null;
}

export const CHIDAE_TOTALS = {
  univs: CHIDAE_UNIVS.length,
  withInterview: CHIDAE_WITH_INTERVIEW.length,
  noInterview: CHIDAE_NO_INTERVIEW.length,
  interviewTracks: CHIDAE_UNIVS.reduce(
    (n, u) => n + u.tracks.filter((t) => t.interview).length,
    0,
  ),
};
