/** =========================================================================
 *  MMI 실전 모의면접(서버 susi-back /interview-sim)에 올리는 의·치·한·약·수 카탈로그
 *
 *  · 서버의 형식(format) 하나 = T메디 세트 하나(대학 × 학과 × 전형 묶음). 방(room) 하나 = 문항 하나 + AI 꼬리질문.
 *  · 문항(prompt)은 방에 묶인다(room). 실전 모드는 방마다 그 방에 묶인 문항 가운데 하나를 고른다.
 *  · 서버는 이 파일을 직접 읽지 못한다(다른 저장소). scripts/export-sim-catalog.ts 가 이 결과를
 *    susi-back/src/modules/interview-sim/lib/medi-catalog.generated.ts 로 써 준다 — 문항을 고치면 다시 내보낸다.
 *  · 여기 실리는 세트: 수능 이후 면접 의대 중 2026-11-25 이후 면접 12곳(uidae-after-suneung.ts) + 13곳(uidae-late.ts)
 *    + 서울대 의대 2전형(snu-mmi.ts) + 치·한·약·수 31개(field-sets.ts).
 *  ========================================================================= */

import { FIELD_MOCKS } from "./field-sets";
import { BANDS, RANKING, RED_FLAG_CAP, RED_FLAG_PENALTY, RED_FLAGS, SNU_MOCK_STATIONS } from "./snu-mmi";
import { UIDAE_LATE } from "./uidae-late";
import {
  FIELD_LABEL,
  RUBRIC_DOC,
  RUBRIC_PASSAGE,
  rubricOf,
  UNIV_MOCKS,
  type MockField,
  type MockItem,
  type Rubric,
  type RubricFactor,
  type SimSpec,
  type UnivMock,
} from "./uidae-after-suneung";
import { CHIDAE_UNIVS } from "../chidae-interview";
import { HANUIDAE_UNIVS } from "../hanuidae-interview";
import { YAKDAE_UNIVS } from "../yakdae-interview";
import { SUUIDAE_UNIVS } from "../suuidae-interview";

export type SimKind = "passage" | "doc" | "solve";

/** 서버 SimFormat 과 같은 모양(+ 의치한약수 칸) */
export type SimCatalogFormat = {
  id: string;
  univ: string;
  track: string;
  label: string;
  rooms: { label: string; answerSec: number; prepSec: number }[];
  notes: string[];
  source: { label: string; url: string };
  site: "medi";
  field: MockField;
  unit: string;
  dates: string[];
};

/** 서버 SimPrompt 와 같은 모양(+ kind · room) */
export type SimCatalogPrompt = {
  id: string;
  formats: string[];
  title: string;
  tags: string[];
  text: string;
  firstQuestion: string;
  memo: { issues: string[]; pitfalls: string[]; followDirections: string[] };
  draft: boolean;
  kind: SimKind;
  room: number;
  /** 점수를 매기는 채점 틀 — MEDI_SCORING.rubrics 의 key */
  scoreRubric: SimKind;
};

/* ───────────── 점수·등급·등수 규칙 (서버로 함께 내보낸다) ───────────── */

/** 수학 구술형 채점 틀 — 서울대 약학(일반) 수학 제시문. 제시문형·서류형은 uidae-after-suneung.ts 의 두 틀 */
export const RUBRIC_SOLVE_SCORE: RubricFactor[] = [
  {
    key: "understand",
    name: "조건 이해",
    weight: 15,
    looksAt: "주어진 조건·가정과 구하는 것을 정확히 잡는가",
    levels: {
      5: "조건·가정·구하는 것을 자기 말로 정확히 정리하고, 숫자와 기호를 틀리지 않는다.",
      3: "조건은 맞게 옮기지만 가정이나 구하는 것의 일부를 놓친다.",
      1: "조건을 잘못 읽어 다른 문제를 푼다.",
    },
  },
  {
    key: "plan",
    name: "식 세우기",
    weight: 20,
    looksAt: "관계식·방법을 왜 그렇게 세웠는지 말하는가",
    levels: {
      5: "관계식을 세운 까닭을 조건에서 끌어와 설명하고, 일반항·극한처럼 다음 단계로 가는 길을 스스로 잡는다.",
      3: "식은 맞지만 왜 그렇게 세웠는지 설명이 없거나, 면접관이 이끌어야 다음 단계로 간다.",
      1: "식을 세우지 못하거나 조건과 맞지 않는 식을 세운다.",
    },
  },
  {
    key: "compute",
    name: "계산·논리",
    weight: 20,
    looksAt: "계산과 논리 단계를 건너뛰지 않고 맞게 이어 가는가",
    levels: {
      5: "계산이 맞고, 단계마다 무엇에서 무엇이 나오는지 이어서 말한다.",
      3: "답은 대체로 맞지만 중간 단계를 건너뛰거나 작은 실수를 스스로 고치지 못한다.",
      1: "계산이나 논리가 틀려 답이 맞지 않는다.",
    },
  },
  {
    key: "explain",
    name: "말로 설명",
    weight: 20,
    looksAt: "듣는 사람이 따라올 수 있게 순서대로 말하는가",
    levels: {
      5: "결론을 먼저 말하고, 처음 듣는 사람도 따라올 수 있게 순서대로 설명한다. 꼬리질문에 바로 답한다.",
      3: "설명은 하지만 순서가 뒤섞이거나 식을 읽기만 한다.",
      1: "답만 말하고 과정을 설명하지 못한다.",
    },
  },
  {
    key: "check",
    name: "검산",
    weight: 10,
    looksAt: "답을 조건에 넣어 보거나 다른 방법으로 확인하는가",
    levels: {
      5: "작은 값을 넣어 보거나 다른 방법으로 답을 스스로 확인한다.",
      3: "면접관이 물으면 확인하지만 스스로는 하지 않는다.",
      1: "확인하지 않거나, 확인을 물어도 답하지 못한다.",
    },
  },
  {
    key: "meaning",
    name: "뜻과 결론",
    weight: 15,
    looksAt: "결과가 문제 상황에서 무엇을 뜻하는지 말하는가",
    levels: {
      5: "결과가 상황(약을 먹는 사람 등)에서 무엇을 뜻하는지 말하고, 모형의 가정과 한계까지 짚는다.",
      3: "뜻을 한 줄로만 말하거나 가정의 한계를 다루지 않는다.",
      1: "계산 결과에서 멈추고 뜻을 말하지 못한다.",
    },
  },
];

/** 동점일 때 먼저 보는 역량 — 방마다 이 순서의 점수를 평균해 비교한다 */
const TIE_BREAK: Record<SimKind, string[]> = {
  passage: [...RANKING.tieBreak],
  doc: ["follow", "understand", "fact"],
  solve: ["explain", "plan", "compute"],
};

export type SimScoreRubric = { label: string; factors: RubricFactor[]; tieBreak: string[] };
export type SimScoring = {
  rubrics: Record<SimKind, SimScoreRubric>;
  redFlags: { key: string; label: string }[];
  redFlagPenalty: number;
  redFlagCap: number;
  bands: { grade: string; min: number; meaning: string }[];
};

/** 서버에 내보내는 점수 규칙 — 방 점수(0~100) = Σ 비중 × (점수 ÷ 5) − 감점, 총점 = 방 점수 평균, 등급 = BANDS */
export function buildSimScoring(): SimScoring {
  const r = (rubric: Rubric, kind: SimKind): SimScoreRubric => ({ label: rubric.label, factors: rubric.factors, tieBreak: TIE_BREAK[kind] });
  return {
    rubrics: {
      passage: r(RUBRIC_PASSAGE, "passage"),
      doc: r(RUBRIC_DOC, "doc"),
      solve: { label: "수학 구술형", factors: RUBRIC_SOLVE_SCORE, tieBreak: TIE_BREAK.solve },
    },
    redFlags: RED_FLAGS.map((f) => ({ key: f.key, label: f.label })),
    redFlagPenalty: RED_FLAG_PENALTY,
    redFlagCap: RED_FLAG_CAP,
    bands: BANDS.map((b) => ({ grade: b.grade, min: b.min, meaning: b.meaning.replace("여섯 역량이", "역량이") })),
  };
}

/* ───────────── 이미 만든 의대 세트(11/25 이후 면접 12곳)의 방 구성 ───────────── */

const r = (label: string, answerSec: number, prepSec: number, items: string[]) => ({ label, answerSec, prepSec, items });
const PREP = "준비 시간은 대학이 밝히지 않아 T메디가 정했습니다.";

/** key → 면접일 · 방 구성. 시간을 밝히지 않은 대학은 note 에 그렇게 적는다 */
const EXISTING_SIM: Record<string, { dates: string[]; sim: SimSpec }> = {
  gnu: {
    dates: ["2026-11-25"],
    sim: {
      label: "학생부 기반 블라인드 면접 · 3인 1조 15분",
      note: "면접위원 3인 1조, 15분 내외, 제시문 없는 서류확인 면접(2027 요강). 15분을 질문 넷으로 나눠 연습합니다.",
      rooms: [
        r("질문 1 · 지원 동기", 230, 0, ["gnu-doc-motive"]),
        r("질문 2 · 탐구 활동", 230, 0, ["gnu-doc-inquiry"]),
        r("질문 3 · 협업", 220, 0, ["gnu-doc-teamwork"]),
        r("질문 4 · 입학 후 계획", 220, 0, ["gnu-doc-plan"]),
      ],
    },
  },
  jbnu: {
    dates: ["2026-11-26"],
    sim: {
      label: "서류확인 면접 · 약 10분",
      note: "면접위원 3인, 약 10분(2027 요강). 10분을 질문 셋으로 나눠 연습합니다.",
      rooms: [r("질문 1 · 탐구 활동", 200, 0, ["jbnu-doc-inquiry"]), r("질문 2 · 지원 동기", 200, 0, ["jbnu-doc-motive"]), r("질문 3 · 협업", 200, 0, ["jbnu-doc-teamwork"])],
    },
  },
  kangwon: {
    dates: ["2026-11-27"],
    sim: {
      label: "학생부 기반 확인 면접 · 면접실 1개",
      note: "2027부터 MMI 를 폐지하고 학생부 기반 확인 면접 1개 면접실로 봅니다(2027 요강). 요강은 시간을 밝히지 않았습니다. 10분은 T메디가 정한 연습 시간입니다.",
      rooms: [
        r("질문 1 · 탐구 활동", 150, 0, ["kangwon-doc-inquiry"]),
        r("질문 2 · 교과 개념", 150, 0, ["kangwon-doc-concept"]),
        r("질문 3 · 성장", 150, 0, ["kangwon-doc-growth"]),
        r("질문 4 · 지원 동기", 150, 0, ["kangwon-doc-motive"]),
      ],
    },
  },
  donga: {
    dates: ["2026-11-27"],
    sim: {
      label: "학생부 기반 개별면접 두 번 · 각 7분",
      note: "1차 학업역량·공동체역량, 2차 진로역량 — 각각 2인 1조 7분 내외(2027 요강). 7분을 질문 둘로 나눠 연습합니다.",
      rooms: [
        r("1차 · 탐구 활동", 210, 0, ["donga-doc-inquiry"]),
        r("1차 · 협업", 210, 0, ["donga-doc-teamwork"]),
        r("2차 · 지원 동기", 210, 0, ["donga-doc-motive"]),
        r("2차 · 입학 후 계획", 210, 0, ["donga-doc-plan"]),
      ],
    },
  },
  ulsan: {
    dates: ["2026-11-28", "2026-12-05"],
    sim: {
      label: "다대일 다면평가 · 상황 제시 + 제출서류 · 약 30분",
      note: `상황 제시 면접과 제출서류 기반 면접을 여러 면접실에서 나눠 약 30분(2027 요강, 지역인재 11/28 · 잠재역량 12/5). 면접실별 시간은 밝히지 않아 30분을 넷으로 나눴습니다. ${PREP}`,
      rooms: [
        r("상황 제시 Ⅰ", 450, 120, ["ulsan-soon"]),
        r("상황 제시 Ⅱ", 450, 120, ["ulsan-med-label"]),
        r("제출서류 · 탐구 활동", 450, 0, ["ulsan-doc-inquiry"]),
        r("제출서류 · 협업", 450, 0, ["ulsan-doc-teamwork"]),
      ],
    },
  },
  konyang: {
    dates: ["2026-11-28"],
    sim: {
      label: "면접준비실 + 여러 면접실 (지역의사 11/28)",
      note: `면접준비실에서 자료를 읽은 뒤 여러 면접실을 돕니다(2027 요강). 면접실별 시간은 밝히지 않아 방마다 8분으로 T메디가 정했습니다. ${PREP}`,
      rooms: [r("면접실 1", 480, 180, ["konyang-or-selfie"]), r("면접실 2", 480, 180, ["konyang-screening-boom"]), r("면접실 3 · 학생부", 480, 0, ["konyang-doc-inquiry"])],
    },
  },
  catholic: {
    dates: ["2026-11-28", "2026-12-05"],
    sim: {
      label: "제출서류 확인 + 인·적성면접 · 개인별 20분",
      note: `학교장추천은 개인별 20분 내외, 상황 숙지 시간을 따로 줄 수 있습니다(2027 요강, 지역균형 11/28 · 학교장추천 12/5). 20분을 셋으로 나눴습니다. ${PREP}`,
      rooms: [r("인·적성 Ⅰ", 400, 180, ["catholic-standard-time"]), r("인·적성 Ⅱ", 400, 180, ["catholic-single-room"]), r("제출서류 확인", 400, 0, ["catholic-doc-motive"])],
    },
  },
  dankook: {
    dates: ["2026-11-28"],
    sim: {
      label: "블라인드 개별면접 · 10분 이내",
      note: "입학사정관 2인 대 지원자 1인, 10분 이내, 블라인드(2027 요강). 10분을 질문 넷으로 나눠 연습합니다.",
      rooms: [
        r("질문 1 · 지원 동기", 150, 0, ["dankook-doc-motive"]),
        r("질문 2 · 입학 후 계획", 150, 0, ["dankook-doc-plan"]),
        r("질문 3 · 탐구 활동", 150, 0, ["dankook-doc-inquiry"]),
        r("질문 4 · 협업", 150, 0, ["dankook-doc-teamwork"]),
      ],
    },
  },
  "konkuk-glocal": {
    dates: ["2026-11-28"],
    sim: {
      label: "서류 확인 면접 + 제시문 면접",
      note: `서류 기반 확인 면접과 별도 출제 제시문 면접(전공 학습역량 및 인·적성)을 함께 봅니다(2027 요강). 문항별 시간은 밝히지 않아 제시문 방 8분 · 서류 방 5분으로 T메디가 정했습니다. ${PREP}`,
      rooms: [r("제시문 Ⅰ", 480, 120, ["kku-last-delivery-room"]), r("제시문 Ⅱ", 480, 120, ["kku-exam-archive"]), r("서류 확인", 300, 0, ["kku-doc-inquiry"])],
    },
  },
  yeungnam: {
    dates: ["2026-11-28"],
    sim: {
      label: "학생부 + 제시문 면접 · 약 15분",
      note: `2026 보고서 기준 면접위원 2인 1팀, 1인당 약 15분 이내. 15분을 제시문 둘(각 6분)과 학생부 하나(3분)로 나눴습니다. ${PREP}`,
      rooms: [r("제시문 Ⅰ", 360, 120, ["yu-migraine-trial"]), r("제시문 Ⅱ", 360, 120, ["yu-night-shift-student"]), r("학생부", 180, 0, ["yu-doc-inquiry"])],
    },
  },
  "yonsei-mirae": {
    dates: ["2026-11-28"],
    sim: {
      label: "의학적 인성 제시문 면접",
      note: `모든 전형이 '의학적 인성(생명윤리·직업윤리)' 제시문 면접입니다(2027 요강). 숙지·면접 시간은 요강에서 확인해야 해서 방마다 준비 5분 · 답변 8분으로 T메디가 정했습니다. ${PREP}`,
      rooms: [r("제시문 Ⅰ · 생명윤리", 480, 300, ["ym-kidney"]), r("제시문 Ⅱ · 직업윤리", 480, 300, ["ym-sponsored"])],
    },
  },
  chosun: {
    dates: ["2026-11-29"],
    sim: {
      label: "학생부 기반 블라인드 면접 · 10분 내외",
      note: "입학사정관 2인, 10분 내외, 블라인드(2027 요강). 10분을 질문 넷으로 나눠 연습합니다.",
      rooms: [
        r("질문 1 · 탐구 활동", 150, 0, ["chosun-doc-inquiry"]),
        r("질문 2 · 지원 동기", 150, 0, ["chosun-doc-motive"]),
        r("질문 3 · 협업", 150, 0, ["chosun-doc-teamwork"]),
        r("질문 4 · 성장", 150, 0, ["chosun-doc-growth"]),
      ],
    },
  },
};

/** 서버에 올리는 T메디 세트 전부 — 면접일 순 */
export function simMocks(): UnivMock[] {
  const existing = UNIV_MOCKS.filter((m) => EXISTING_SIM[m.key]).map((m) => ({ ...m, dates: EXISTING_SIM[m.key].dates, sim: EXISTING_SIM[m.key].sim }));
  return [...existing, ...UIDAE_LATE, ...FIELD_MOCKS].sort((a, b) => (a.dates?.[0] ?? a.firstInterview).localeCompare(b.dates?.[0] ?? b.firstInterview));
}

export const EXISTING_SIM_KEYS = Object.keys(EXISTING_SIM);

/* ───────────── 변환 ───────────── */

const PAGE_DIR: Record<MockField, string> = { uidae: "uidae", chidae: "chidae", hanuidae: "hanuidae", yakdae: "yakdae", suuidae: "suuidae" };
const FIELD_SLUGS: Partial<Record<MockField, string[]>> = {
  chidae: CHIDAE_UNIVS.map((u) => u.slug),
  hanuidae: HANUIDAE_UNIVS.map((u) => u.slug),
  yakdae: YAKDAE_UNIVS.map((u) => u.slug),
  suuidae: SUUIDAE_UNIVS.map((u) => u.slug),
};
const SLUG_ALIAS: Record<string, string> = { dongeui: "donga-ui" };

/** 이 세트의 대학 면접 안내 페이지(없으면 학과 면접 첫 화면) */
export function pageUrl(field: MockField, key: string): string {
  const base = `https://tmedi.kr/interview/${PAGE_DIR[field]}`;
  if (field === "uidae") return `${base}/${key.replace(/-(ilban|jigyun)$/, "")}`;
  const slugs = FIELD_SLUGS[field] ?? [];
  const root = key.replace(/-(ilban|jigyun)$/, "");
  const suffix = { chidae: "", hanuidae: "-han", yakdae: "-y", suuidae: "-s" }[field];
  const found = [SLUG_ALIAS[root], root, `${root}${suffix}`].find((s) => s && slugs.includes(s));
  return found ? `${base}/${found}` : base;
}

export const simFormatId = (field: MockField, key: string) => `medi-${field}-${key}`;

const tagOf = (it: MockItem) => it.kind.split("·")[0].trim();

function docText(it: MockItem): string {
  return [
    `[${it.title}]`,
    "제시문이 없는 서류 확인 질문입니다. 면접관의 첫 질문을 듣고, 내 학교생활기록부에 남은 기록 하나를 골라 그 장면으로 답하세요.",
    "직접 한 일 · 그렇게 한 까닭 · 아쉬웠던 점을 함께 말하면 꼬리질문에 덜 흔들립니다.",
  ].join("\n");
}

function memoOf(it: MockItem) {
  return {
    issues: it.keyPoints.map((k) => k.text),
    pitfalls: it.pitfalls,
    followDirections: [`먼저 주질문을 순서대로 묻는다: ${it.main.join(" / ")}`, ...it.followups],
  };
}

function toPrompt(m: UnivMock, formatId: string, it: MockItem, room: number): SimCatalogPrompt {
  const rubric = rubricOf(m, it);
  const kind: SimKind = it.simKind ?? (rubric.id === "doc" ? "doc" : "passage");
  return {
    id: it.id,
    formats: [formatId],
    title: it.title,
    tags: [tagOf(it)],
    text: it.passage ?? docText(it),
    firstQuestion: it.first,
    memo: memoOf(it),
    draft: true,
    kind,
    room,
    scoreRubric: kind === "solve" ? "solve" : rubric.id,
  };
}

const COMMON_FORMAT_NOTE = "문항은 T메디가 2027 요강 형식과 공개 기출 유형에 맞춰 새로 만든 연습용입니다(기출 아님).";

function mockToCatalog(m: UnivMock): { format: SimCatalogFormat; prompts: SimCatalogPrompt[] } {
  if (!m.sim) throw new Error(`${m.univ}: sim 없음`);
  const field = m.field ?? "uidae";
  const id = simFormatId(field, m.key);
  const byId = new Map(m.items.map((it) => [it.id, it]));
  const prompts = m.sim.rooms.flatMap((room, idx) =>
    room.items.map((iid) => {
      const it = byId.get(iid);
      if (!it) throw new Error(`${m.univ} ${FIELD_LABEL[field].short}: 방 '${room.label}' 의 문항 ${iid} 가 세트에 없다`);
      return toPrompt(m, id, it, idx);
    }),
  );
  return {
    format: {
      id,
      univ: m.univ,
      track: m.track,
      label: m.sim.label,
      rooms: m.sim.rooms.map(({ label, answerSec, prepSec }) => ({ label, answerSec, prepSec })),
      notes: [m.sim.note, ...m.scoring, ...m.notes, COMMON_FORMAT_NOTE],
      source: { label: `T메디 ${m.univ} ${FIELD_LABEL[field].short} 면접 안내`, url: pageUrl(field, m.key) },
      site: "medi",
      field,
      unit: FIELD_LABEL[field].unit,
      dates: m.dates ?? [m.firstInterview],
    },
    prompts,
  };
}

/* ───────────── 서울대 의대(일반 · 지역균형) — snu-mmi.ts 의 방 4개 ───────────── */

function snuCatalog(): { format: SimCatalogFormat; prompts: SimCatalogPrompt[] }[] {
  const tracks = [
    { key: "snu-ilban", track: "일반전형", dates: ["2026-11-28"], stations: SNU_MOCK_STATIONS.ilban },
    { key: "snu-jigyun", track: "지역균형전형", dates: ["2026-12-05"], stations: SNU_MOCK_STATIONS.jigyun },
  ];
  return tracks.map((t) => {
    const id = simFormatId("uidae", t.key);
    return {
      format: {
        id,
        univ: "서울대",
        track: t.track,
        label: "MMI · 상황·제시문 방 4개",
        rooms: t.stations.map((s, i) => ({ label: `${i + 1}번 방 · ${s.type}`, answerSec: 480, prepSec: 120 })),
        notes: [
          "방마다 제시문 읽기 2분 + 문답 8분. 과거 합격생 복기와 2020학년도 방 구성을 따른 T메디 설정이며, 2027 요강은 '복수 면접실 60분 내외'만 밝힙니다.",
          "실제 면접에는 서류 기반 면접 방이 더 있습니다. 이 모의면접은 상황·제시문 방만 다룹니다.",
          COMMON_FORMAT_NOTE,
        ],
        source: { label: "T메디 서울대 의대 면접 안내", url: pageUrl("uidae", "snu") },
        site: "medi",
        field: "uidae",
        unit: "의예과",
        dates: t.dates,
      },
      prompts: t.stations.map((s, i) => ({
        id: s.id,
        formats: [id],
        title: s.title,
        tags: [s.type],
        text: s.passage,
        firstQuestion: s.first,
        memo: {
          issues: s.keyPoints.map((k) => k.text),
          pitfalls: s.pitfalls,
          followDirections: [`먼저 주질문을 순서대로 묻는다: ${s.main.join(" / ")}`, ...s.followups],
        },
        draft: true,
        kind: "passage" as const,
        room: i,
        scoreRubric: "passage" as const,
      })),
    };
  });
}

/** 서버에 내보낼 전체 카탈로그 — 면접일 순 */
export function buildSimCatalog(): { formats: SimCatalogFormat[]; prompts: SimCatalogPrompt[] } {
  const parts = [...simMocks().map(mockToCatalog), ...snuCatalog()].sort((a, b) => a.format.dates[0].localeCompare(b.format.dates[0]));
  return { formats: parts.map((p) => p.format), prompts: parts.flatMap((p) => p.prompts) };
}
