import { fieldEarliest, fieldTotals, type FieldUniv } from "./field-interview";

/** =========================================================================
 *  수의예과 면접 — 2027학년도 수시 실측 데이터
 *
 *  출처: 각 대학 2027학년도 수시 모집요강(요강 원문 추출본
 *        `2027_전형별모집단위_요강.json` 의 면접·실기평가 / 전형방법 / 전형일정).
 *
 *  ⚠️ 요강에 적힌 문장만 옮긴다. 다른 계열 데이터로 유추하지 않는다.
 *     경상국립대처럼 같은 전형 안에서 의예과만 면접을 보고
 *     수의예과는 서류 100% 인 경우가 있다.
 *
 *  ⚠️ 충남대 · 전남대 · 강원대 수의예과는 요강 추출본에 모집단위가 잡히지 않았다.
 *     UNVERIFIED 로 따로 두고 추정하지 않는다.
 *  ========================================================================= */

export type SuuidaeUniv = FieldUniv;

export const SUUIDAE_UNIVS: FieldUniv[] = [
  {
    slug: "konkuk-s",
    short: "건국대",
    name: "건국대학교 수의과대학 수의예과",
    zone: "수도권",
    style: "injeokseong",
    styleLabel: "제출서류 기반 10분 · 수능최저 없음",
    headline: "수의대 중 모집 규모가 가장 크고 최저가 없다",
    format: [
      "KU자기추천전형 — 1단계 서류 100%(3배수) → 2단계 1단계 70% + 면접 30%",
      "제출서류 기초 개별면접, 10분",
      "24명 모집으로 수의예과 종합전형 중 규모가 가장 크다",
      "수능 최저학력기준이 없다",
      "1단계 발표 11월 20일 · 면접 12월 6일",
    ],
    drills: [
      "최저가 없어 면접장에 들어온 사람이 그대로 경쟁자다. 최저 탈락으로 경쟁률이 내려가길 기대할 수 없다",
      "1단계 3배수로 좁다. 서류 차이가 크지 않은 사람들끼리 10분으로 갈린다",
      "1단계 발표(11/20)에서 면접(12/6)까지 16일이고 그 사이에 수능이 있다. 수능 후 2주가 실제 준비 구간이다",
      "'제출서류 기초' 면접이다. 생기부에 쓴 활동 하나하나가 그대로 질문이 된다",
    ],
    tracks: [
      { name: "KU자기추천전형", kind: "종합", quota: 24, interview: true,
        weight: "1단계 서류 100%(3배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-20", date: "2026-12-06", minimum: "없음" },
      { name: "KU지역균형전형", kind: "교과", quota: 5, interview: false,
        weight: "학생부 교과정량 70% + 교과정성 30%", announce: null, date: null,
        minimum: "없음" },
      { name: "기회균형전형", kind: "종합", quota: 3, interview: false,
        weight: "서류 70% + 학생부(교과정량) 30%", announce: null, date: null,
        minimum: "없음" },
      { name: "KU논술우수자전형", kind: "논술", quota: 6, interview: false,
        weight: "논술 100%(자연 100분)", announce: null, date: "2026-11-21",
        minimum: "3개 영역 등급 합 4, 한국사 5등급" },
    ],
  },
  {
    slug: "snu-s",
    short: "서울대",
    name: "서울대학교 수의과대학 수의예과",
    zone: "수도권",
    style: "injeokseong",
    styleLabel: "서류 기반 학업소양 면접",
    headline: "의예과와 달리 서류 기반 10분이다",
    format: [
      "지역균형전형 — 1단계 서류평가 100%(3배수) → 2단계 1단계 70% + 면접 30%",
      "면접은 서류 기반 학업소양 평가, 10분 내외. 수의과대학 면접일은 별도로 공지된다",
      "1단계 발표 11월 27일 · 면접 12월 5일(수의·의과)",
      "수능 최저는 3개 영역 합 7 이내",
    ],
    drills: [
      "의예과는 제시문 다중 스테이션 약 60분이지만 수의예과는 서류 기반 10분이다. 의대 자료를 그대로 쓰면 안 된다",
      "'학업소양' 이다. 생기부의 탐구 활동을 학문적 언어로 설명할 수 있어야 한다",
      "6명 모집이다. 1단계 3배수면 면접장에 들어오는 인원이 매우 적다",
      "1단계 발표(11/27)에서 면접(12/5)까지 8일이다",
    ],
    tracks: [
      { name: "지역균형전형", kind: "종합", quota: 6, interview: true,
        weight: "1단계 서류 100%(3배수) → 2단계 1단계 70% + 면접 30%",
        announce: "2026-11-27", date: "2026-12-05",
        minimum: "국어·수학·영어·탐구 중 3개 영역 합 7 이내" },
    ],
  },
  {
    slug: "gnu-s",
    short: "경상국립대",
    name: "경상국립대학교 수의과대학 수의예과",
    zone: "경상",
    style: "injeokseong",
    styleLabel: "3인 1조 15분 · 배점 공개",
    headline: "일반전형만 면접이고 지역인재는 서류 100%",
    format: [
      "학생부종합(일반전형) 단계선발 — 1단계 서류 100%(3배수) → 2단계 1단계 80%(800점) + 면접 20%(200점, 기본 170점)",
      "개별면접 15분 내외. 전임·교수·위촉사정관·전공교수 3인 1조, 학생부 기반 블라인드",
      "평가요소 배점 공개: 지식탐구 45% · 진로 25% · 자기주도 20% · 공동체 10%",
      "지역인재전형과 지역인재 기초생활수급자등전형은 수의예과가 서류 100% 일괄이라 면접이 없다 — 의예과만 면접을 본다",
      "1단계 발표 11월 13일 · 면접고사 11월 25~26일",
    ],
    drills: [
      "지원 전형부터 확정한다. 같은 대학 안에서 일반전형만 면접이 있고 지역인재는 서류 100% 다",
      "지식탐구 45% 가 거의 절반이다. 탐구 활동 하나를 가설·방법·한계까지 설명할 수 있게 정리한다",
      "면접 배점 200점 중 기본점수가 170점이다. 실질 변별 폭은 30점 구간에서 난다",
      "면접이 수능(11/19) 엿새 뒤다. 수능 직후 컨디션 회복까지 계산해 둔다",
    ],
    tracks: [
      { name: "학생부종합(일반전형) 단계선발", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 100%(3배수) → 2단계 1단계 80%(800점) + 면접 20%(200점, 기본 170점)",
        announce: "2026-11-13", date: "2026-11-25",
        minimum: "수학 필수, 3개 영역 상위 등급 합 7" },
      { name: "학생부종합(지역인재전형)", kind: "종합", quota: null, interview: false,
        weight: "서류 100% 일괄(1,000점, 기본 850점) — 수의예과는 면접 없음",
        announce: null, date: null, minimum: "수학 필수, 3개 영역 합 7" },
      { name: "학생부종합(지역인재 기초생활수급자등전형)", kind: "종합", quota: null, interview: false,
        weight: "서류 100% 일괄 — 수의예과는 면접 없음", announce: null, date: null,
        minimum: "수학 필수, 3개 영역 합 7" },
      { name: "학생부교과(일반·지역인재전형)", kind: "교과", quota: null, interview: false,
        weight: "교과 100%(1,000점, 기본 850점)", announce: null, date: null },
    ],
  },
  {
    slug: "jbnu-s",
    short: "전북대",
    name: "전북대학교 수의과대학 수의예과",
    zone: "전라",
    style: "injeokseong",
    styleLabel: "3인 면접위원 · 익산캠퍼스 면접",
    headline: "수의과대학은 익산 특성화캠퍼스에서 면접을 본다",
    format: [
      "큰사람전형 — 1단계 서류 1,000점(3배수) → 2단계 1단계 800점(80%) + 면접 200점(20%). 면접 11/26(목)",
      "지역인재2유형(전북권) — 수의예과 2명. 같은 구조이며 면접은 2일차 11/28(토)",
      "면접위원 3인, 약 10분, 블라인드 평가",
      "수의과대학 소속은 익산 특성화캠퍼스에서 면접을 실시한다",
      "교과 계열 전형(일반학생·지역인재1·2유형)은 면접이 없다",
    ],
    drills: [
      "면접 장소가 전주가 아니라 익산이다. 이동 시간과 숙박을 미리 계산해 둔다",
      "두 종합전형의 면접일이 이틀 차이다. 복수 지원 시 둘 다 응시해야 할 수 있다",
      "면접 20% 에 1단계 3배수다. 서류 우위를 지키는 쪽에 가깝다",
      "수능 최저가 수학 포함 3개 합 7이다. 면접과 최저의 시간 배분을 먼저 정한다",
    ],
    tracks: [
      { name: "큰사람전형", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 1,000점(3배수) → 2단계 1단계 800점(80%) + 면접 200점(20%)",
        announce: "2026-11-20", date: "2026-11-26",
        minimum: "수학 포함 3개 등급 합 7" },
      { name: "지역인재2유형전형(전북권)", kind: "종합", quota: 2, interview: true,
        weight: "1단계 서류 1,000점(3배수) → 2단계 1단계 800점(80%) + 면접 200점(20%)",
        announce: "2026-11-20", date: "2026-11-28",
        minimum: "수학 포함 3개 등급 합 7" },
      { name: "일반학생전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 1,000점 100%", announce: null, date: null,
        minimum: "수학 포함 3개 합 7" },
      { name: "지역인재1유형전형(호남권)", kind: "교과", quota: null, interview: false,
        weight: "학생부 1,000점 100%", announce: null, date: null,
        minimum: "수학 포함 3개 합 7" },
    ],
  },
  {
    slug: "jeju-s",
    short: "제주대",
    name: "제주대학교 수의과대학 수의예과",
    zone: "제주",
    style: "injeokseong",
    styleLabel: "15분 블라인드 · 배점 공개 · 최저 없음",
    headline: "인성·공동체역량 120점이 최대 배점이다",
    format: [
      "학생부종합(일반학생) — 1단계 서류평가 100%(3배수) → 2단계 1단계 70%(700점) + 면접 30%(300점)",
      "15분 내외 개별 블라인드 면접",
      "평가요소 배점 공개: 학업역량 90 · 진로역량 90 · 인성공동체역량 120 = 총 300점",
      "수능 최저학력기준이 없다",
      "1단계 발표 11월 13일 · 면접평가 12월 4일",
    ],
    drills: [
      "인성·공동체역량 120점이 최대 배점이다. 협업과 태도를 구체적 장면으로 말할 수 있게 준비한다",
      "최저가 없어 면접 결과가 그대로 결과가 된다. 면접 30% 를 온전히 걸고 들어가는 구조다",
      "15분은 긴 편이다. 활동 서너 개를 준비하지 않으면 시간이 빈다",
      "1단계 발표(11/13)에서 면접(12/4)까지 3주다. 수능을 사이에 두고 있어 계획이 필요하다",
    ],
    tracks: [
      { name: "학생부종합(일반학생)", kind: "종합", quota: null, interview: true,
        weight: "1단계 서류 100%(3배수) → 2단계 1단계 70%(700점) + 면접 30%(300점)",
        announce: "2026-11-13", date: "2026-12-04", minimum: "없음" },
      { name: "학생부교과(일반학생)", kind: "교과", quota: null, interview: false,
        weight: "학생부 교과 100%(기본 840점 + 실질 160점)", announce: null, date: null },
    ],
  },
  {
    slug: "cbnu-s",
    short: "충북대",
    name: "충북대학교 수의과대학 수의예과",
    zone: "충청",
    style: "none",
    styleLabel: "면접 미실시",
    headline: "교과도 종합도 면접이 없다",
    format: [
      "학생부종합Ⅰ·Ⅱ전형 — 서류평가 80점 100% 일괄합산, 블라인드 종합평가",
      "학생부교과 · 지역인재전형 — 학생부교과 80점 100% 일괄합산",
      "농어촌학생전형도 서류평가 100%",
      "요강상 수의예과 전 전형에서 면접을 실시하지 않는다",
    ],
    drills: [
      "면접이 없으므로 제출 시점의 학생부와 수능 최저가 전부다",
      "서류평가 80점 중 기본점수가 40점이다. 실질 변별은 40점 구간에서 난다",
      "전형별로 최저가 갈린다 — 종합Ⅰ·농어촌은 없고, 종합Ⅱ·지역인재는 3합 8, 교과는 3합 7이다",
    ],
    tracks: [
      { name: "학생부종합Ⅰ전형", kind: "종합", quota: 8, interview: false,
        weight: "서류평가 80점 100% 일괄", announce: null, date: null, minimum: "없음" },
      { name: "학생부종합Ⅱ전형", kind: "종합", quota: 7, interview: false,
        weight: "서류평가 80점 100% 일괄", announce: null, date: null,
        minimum: "상위 3개 합 8등급 이내" },
      { name: "학생부교과전형", kind: "교과", quota: 5, interview: false,
        weight: "학생부교과 80점 100% 일괄", announce: null, date: null,
        minimum: "상위 3개 합 7등급 이내" },
      { name: "학생부교과(지역인재전형)", kind: "교과", quota: 12, interview: false,
        weight: "학생부교과 80점 100% 일괄", announce: null, date: null,
        minimum: "상위 3개 합 8등급 이내" },
      { name: "학생부종합(농어촌학생전형)", kind: "종합", quota: 1, interview: false,
        weight: "서류평가 80점 100% 일괄", announce: null, date: null, minimum: "없음" },
    ],
  },
  {
    slug: "knu-s",
    short: "경북대",
    name: "경북대학교 수의과대학 수의예과",
    zone: "경상",
    style: "none",
    styleLabel: "면접 미실시 (요강 확인 범위)",
    headline: "요강에서 확인된 전형은 교과우수자 하나뿐",
    format: [
      "교과우수자전형 — 학생부 교과 400점(80%) + 서류평가(교과이수충실도) 100점(20%) = 500점, 일괄합산",
      "이 전형은 면접을 실시하지 않는다",
      "같은 대학의 의예과 · 치의예과 · 약학과는 지역인재전형에서 면접을 보지만, 요강 추출본에서 수의예과는 그 전형에 포함돼 있지 않다",
    ],
    drills: [
      "요강에서 확인된 범위에서는 면접이 없다. 교과 성적과 수능 최저가 전부다",
      "의예·치의예·약학과 자료를 보고 수의예과도 면접이 있다고 넘겨짚지 않는다",
      "지역인재전형 지원을 고려한다면 입학처 요강에서 수의예과 포함 여부를 직접 확인한다",
    ],
    tracks: [
      { name: "교과우수자전형", kind: "교과", quota: null, interview: false,
        weight: "학생부 교과 400점(80%) + 서류평가 100점(20%) = 500점", announce: null, date: null },
    ],
    notes: [
      "요강 추출본에서 수의예과로 잡힌 전형이 교과우수자전형 하나뿐입니다. 지역인재전형 등 다른 전형의 면접 여부는 입학처 요강에서 확인해 주세요.",
    ],
  },
];

/** 요강 추출본에 수의예과 모집단위가 잡히지 않은 대학. 추정하지 않는다. */
export const SUUIDAE_UNVERIFIED = [
  { short: "충남대", name: "충남대학교 수의과대학 수의예과" },
  { short: "전남대", name: "전남대학교 수의과대학 수의예과" },
  { short: "강원대", name: "강원대학교 수의과대학 수의예과" },
];

export const SUUIDAE_WITH_INTERVIEW = SUUIDAE_UNIVS.filter((u) => u.style !== "none");
export const SUUIDAE_NO_INTERVIEW = SUUIDAE_UNIVS.filter((u) => u.style === "none");
export const suuidaeEarliest = fieldEarliest;
export const SUUIDAE_TOTALS = fieldTotals(SUUIDAE_UNIVS);
