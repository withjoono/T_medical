/** =========================================================================
 *  서류확인·학생부 기반 면접 질문 틀 — 학과별(의·치·한·약·수) (T메디 제작, 2026-11-24)
 *
 *  uidae-after-suneung.ts 의 DOC_POOL(의대용)을 학과에 맞게 바꿔 쓴다.
 *   · 낱말 바꾸기: 의과대학 → 치과대학·한의과대학·약학대학·수의과대학, 의대 → 치대…, 의사 → 치과의사…
 *     ('의사소통'·'의사표현'·'의사결정'은 바꾸지 않는다)
 *   · 지원 동기(motive)·입학 후 계획(plan)은 학과마다 다시 썼다 — 직업을 가르는 질문이 학과마다 다르다.
 *   · 학과마다 하나씩 '그 직업의 일' 질문(role)과, 공통질문형 대학(경희대 등)의 '가치관' 질문(values)을 더했다.
 *
 *  원칙은 uidae-after-suneung.ts 머리말과 같다 — 전부 T메디 창작, 실제 질문과 같을 수 없다(학생부가 학생마다 다르다).
 *  ========================================================================= */

import { DOC_POOL, type DocKey, type MockField, type MockItem } from "./uidae-after-suneung";

type Job = { job: string; college: string; short: string; alt: string; prep: string };

export const FIELD_JOB: Record<MockField, Job> = {
  uidae: { job: "의사", college: "의과대학", short: "의대", alt: "간호사나 연구자가", prep: "예과 2년" },
  chidae: { job: "치과의사", college: "치과대학", short: "치대", alt: "의사가", prep: "예과 2년" },
  hanuidae: { job: "한의사", college: "한의과대학", short: "한의대", alt: "의사가", prep: "예과 2년" },
  yakdae: { job: "약사", college: "약학대학", short: "약대", alt: "의사나 연구원이", prep: "처음 2년" },
  suuidae: { job: "수의사", college: "수의과대학", short: "수의대", alt: "사람을 진료하는 의사가", prep: "예과 2년" },
};

/** 의대용 문장을 학과 낱말로 바꾼다 */
function swap(text: string, f: MockField): string {
  if (f === "uidae") return text;
  const j = FIELD_JOB[f];
  let t = text
    .replace(/의과대학/g, j.college)
    .replace(/의대/g, j.short)
    .replace(/의사(?!소통|표현|결정)/g, j.job);
  if (f === "suuidae") t = t.replace(/환자 안전/g, "동물 환자의 안전");
  return t;
}

function swapItem(it: Omit<MockItem, "id">, f: MockField): Omit<MockItem, "id"> {
  return {
    ...it,
    kind: swap(it.kind, f),
    title: swap(it.title, f),
    first: swap(it.first, f),
    main: it.main.map((x) => swap(x, f)),
    followups: it.followups.map((x) => swap(x, f)),
    keyPoints: it.keyPoints.map((k) => ({ c: k.c, text: swap(k.text, f) })),
    pitfalls: it.pitfalls.map((x) => swap(x, f)),
    focus: swap(it.focus, f),
  };
}

const MOTIVE_PITFALL: Record<MockField, string> = {
  uidae: "가족의 투병·드라마에서 시작해 '사람을 살리고 싶다'로 끝나는 틀에 박힌 답",
  chidae: "'손재주가 좋아서'나 교정 치료 경험에서 시작해 '사람을 돕고 싶다'로 끝나는 틀에 박힌 답",
  hanuidae: "한의원 치료로 나은 경험 하나로 끝나는 답, 한의학을 신비롭게만 말하거나 현대 의학을 깎아내리는 답",
  yakdae: "'화학을 좋아해서'로 끝나 약사의 일과 이어지지 않는 답",
  suuidae: "'동물을 좋아해서'로 시작해 그대로 끝나는 답",
};

const PLAN_WHERE: Record<MockField, string> = {
  uidae: "졸업 뒤 어느 지역에서 어떤 환자를 보고 싶습니까?",
  chidae: "졸업 뒤 어떤 곳에서 어떤 환자를 보고 싶습니까?",
  hanuidae: "졸업 뒤 어떤 곳에서 어떤 환자를 보고 싶습니까?",
  yakdae: "졸업 뒤 약국·병원·제약회사·연구소 가운데 어디에서 일하고 싶습니까?",
  suuidae: "졸업 뒤 반려동물·농장동물·야생동물·공중보건 가운데 어느 쪽에서 일하고 싶습니까?",
};

function motive(f: MockField): Omit<MockItem, "id"> {
  if (f === "uidae") return DOC_POOL.motive;
  const j = FIELD_JOB[f];
  return {
    kind: "인성 · 지원 동기",
    title: `${j.job}가 되려는 까닭`,
    first: `${j.job}가 되려는 까닭을, 학교생활기록부에 남은 기록 두 가지로 뒷받침해 말해 보세요.`,
    main: [`그 까닭이라면 ${j.alt} 아니라 왜 ${j.job}입니까?`, `${j.job}라는 일에서 본인에게 가장 맞지 않을 것 같은 부분은 무엇입니까?`],
    followups: [
      `그 기록이 없었다면 ${j.short}에 지원하지 않았겠습니까?`,
      "성적이 지금보다 낮았다면 어떤 진로를 택했겠습니까?",
      "십 년 뒤 어디에서 무슨 일을 하고 있겠습니까?",
      "이 대학이어야 하는 까닭이 있습니까?",
    ],
    keyPoints: [
      { c: "career", text: "동기가 구체적인 경험·물음에서 나오고 기록 두 가지가 실제로 그 동기와 이어진다" },
      { c: "career", text: `다른 보건의료 직업과 ${j.job}의 일을 구분해 말한다` },
      { c: "reflect", text: "자기에게 맞지 않을 부분을 솔직히 말하고 어떻게 메울지 덧붙인다" },
      { c: "fact", text: "기록의 내용을 정확히 인용한다" },
      { c: "follow", text: "'성적이 낮았다면' 같은 질문에 꾸미지 않고 답한다" },
    ],
    pitfalls: [MOTIVE_PITFALL[f], `${j.job}의 일을 미화만 하는 답`, "기록과 동기가 따로 노는 답"],
    focus: "누구나 할 수 있는 말을 빼고, 내 기록에서만 나오는 까닭을 말합니다.",
  };
}

function plan(f: MockField): Omit<MockItem, "id"> {
  const base = swapItem(DOC_POOL.plan, f);
  const j = FIELD_JOB[f];
  return {
    ...base,
    followups: [
      `그 분야의 ${j.job}가 실제로 하루를 어떻게 보내는지 알아본 적이 있습니까?`,
      "관심이 그 활동 하나에서만 나온 것이라면 근거가 약하지 않습니까?",
      PLAN_WHERE[f],
      `${j.prep} 동안은 무엇을 하겠습니까?`,
    ],
  };
}

/** 학과마다 '그 직업의 일'을 묻는 질문 — 전공적합성·진로역량 */
const ROLE: Record<Exclude<MockField, "uidae">, Omit<MockItem, "id">> = {
  chidae: {
    kind: "적성 · 치과의사의 일",
    title: "치과의사의 일, 잘 알려지지 않은 것",
    first: "치과의사가 하는 일 가운데 일반인이 잘 모르는 것 하나를 들고, 그것을 어떻게 알게 됐는지 말해 보세요.",
    main: ["그 일에 필요한 역량 가운데 본인에게 이미 있는 것과 아직 없는 것은 무엇입니까?", "치과 진료를 무서워하는 환자를 만나면 무엇부터 하겠습니까?"],
    followups: [
      "예방과 치료 가운데 치과의사가 더 힘써야 할 쪽은 어디라고 봅니까?",
      "손기술이 뛰어난 것과 좋은 치과의사인 것은 같은 말입니까?",
      "진료비 부담 때문에 치료를 미루는 사람에게 치과의사가 할 수 있는 일은 무엇입니까?",
    ],
    keyPoints: [
      { c: "career", text: "치과의사의 일을 진료실 밖까지 구체적인 장면으로 말한다(예: 검진·예방 교육, 다른 진료과와의 협진)" },
      { c: "fact", text: "그 사실을 알게 된 경로를 생기부 활동이나 직접 확인한 경험으로 댄다" },
      { c: "reflect", text: "자기에게 아직 없는 역량을 인정하고 채울 방법을 말한다" },
      { c: "understand", text: "무서워하는 환자에게 설명·동의·속도 조절처럼 실제로 할 수 있는 일을 말한다" },
      { c: "follow", text: "'손기술' 질문에 기술과 소통·판단을 함께 놓고 답한다" },
    ],
    pitfalls: ["치과의사를 '충치 치료하는 사람'으로만 그리는 답", "알게 된 경로가 없는, 어디서 본 말만 옮기는 답", "역량을 자랑만 하고 부족한 점은 없다는 답"],
    focus: "치과의사의 일 하나를 장면으로, 그 일을 알게 된 내 경로와 함께 말합니다.",
  },
  hanuidae: {
    kind: "적성 · 한의학과 근거",
    title: "한의학 치료를 설명한다면",
    first: "한의학 치료의 효과를 다른 사람에게 설명해야 한다면 무엇을 근거로 들겠습니까? 학교생활기록부의 활동과 이어서 말해 보세요.",
    main: ["효과를 확인하려면 어떤 연구가 필요하다고 생각합니까?", "한의사와 의사가 한 환자를 함께 볼 때 한의사가 할 수 있는 일은 무엇입니까?"],
    followups: [
      "'한약은 간에 해롭다'는 말을 들은 환자에게 어떻게 답하겠습니까?",
      "전통이라는 이유만으로 치료법을 지킬 수 있습니까?",
      "본인이 한 탐구에서 근거를 다룬 방식은 이것과 어떻게 이어집니까?",
    ],
    keyPoints: [
      { c: "understand", text: "경험담이 아니라 확인할 수 있는 근거(비교 대상이 있는 연구, 같은 결과가 되풀이되는지)를 말한다" },
      { c: "career", text: "한의사의 역할을 현대 의학과 맞서는 것이 아니라 협력하는 쪽에서 말한다" },
      { c: "reflect", text: "한의학이 아직 증명해야 할 부분을 피하지 않고 인정한다" },
      { c: "fact", text: "생기부의 활동(탐구·독서)과 이어지는 구체적인 근거를 댄다" },
      { c: "follow", text: "환자의 걱정을 무시하지 않고, 확인할 방법과 함께 답한다" },
    ],
    pitfalls: ["'수천 년 써 왔으니 효과가 있다'로 끝나는 답", "현대 의학을 깎아내려 한의학을 높이는 답", "근거를 묻는데 개인 치료 경험만 드는 답"],
    focus: "효과를 '믿는다'가 아니라 '어떻게 확인할 수 있다'로 말합니다.",
  },
  yakdae: {
    kind: "적성 · 약사의 일",
    title: "약사의 일이 넓어지는 곳",
    first: "약사가 조제와 복약 지도 말고 하는 일 하나를 들고, 그 일에 관심을 갖게 된 학교생활기록부 활동을 말해 보세요.",
    main: ["그 일을 하려면 약학대학에서 무엇을 공부해야 한다고 생각합니까?", "약을 여러 개 먹는 노인 환자에게 약사가 할 수 있는 일은 무엇입니까?"],
    followups: [
      "편의점에서 살 수 있는 상비약이 늘면 약사의 역할은 어떻게 바뀌겠습니까?",
      "신약 개발에서 약사가 맡는 일과 화학자가 맡는 일은 어떻게 다릅니까?",
      "환자가 의사에게 들은 말과 약사의 설명이 달라 헷갈려하면 어떻게 하겠습니까?",
    ],
    keyPoints: [
      { c: "career", text: "약사의 일을 약국 밖까지 구체적으로 말한다(병원 약제부, 제약·연구, 공공 보건 등) — 이름만 늘어놓지 않는다" },
      { c: "fact", text: "관심이 시작된 생기부 활동을 구체적으로 댄다" },
      { c: "understand", text: "여러 약을 함께 먹을 때의 문제(상호작용·중복·복용 실수)를 쉬운 말로 설명한다" },
      { c: "reflect", text: "아직 모르는 것을 인정하고 대학에서 채울 공부와 잇는다" },
      { c: "follow", text: "의사·약사 설명이 엇갈리는 상황에서 환자 안전과 협력을 기준으로 답한다" },
    ],
    pitfalls: ["약사를 '약을 내주는 사람'으로만 그리는 답", "제약회사·연구소 이름만 대고 하는 일은 모르는 답", "의사를 탓하거나 약사가 더 정확하다고 맞서는 답"],
    focus: "약사의 일 하나를 장면으로, 그 관심이 시작된 기록과 함께 말합니다.",
  },
  suuidae: {
    kind: "적성 · 수의사의 일",
    title: "수의사가 지키는 세 가지",
    first: "수의사가 동물, 보호자, 사람의 건강 가운데 어디에 기여한다고 생각하는지 학교생활기록부의 활동과 이어서 말해 보세요.",
    main: ["동물에게서 사람에게 옮는 감염병을 막는 데 수의사는 무엇을 합니까?", "말을 못 하는 동물 환자를 진료할 때 가장 어려운 점은 무엇이라고 생각합니까?"],
    followups: [
      "보호자가 치료비 때문에 치료를 포기하겠다고 하면 어떻게 하겠습니까?",
      "농장동물 수의사와 반려동물 수의사의 일은 어떻게 다릅니까?",
      "동물복지와 사람의 이익이 부딪히는 예를 하나 들어 보세요.",
    ],
    keyPoints: [
      { c: "career", text: "수의사의 일을 반려동물 진료에 가두지 않고 공중보건·축산·검역까지 넓혀 말한다" },
      { c: "understand", text: "동물과 사람이 함께 걸리는 감염병을 막는 길(예방접종, 감시, 신고)을 쉬운 말로 설명한다" },
      { c: "fact", text: "생기부의 활동을 구체적으로 대고 그 활동에서 무엇을 알게 됐는지 말한다" },
      { c: "reflect", text: "동물 환자는 말로 아픔을 전하지 못한다는 점, 보호자의 사정까지 살펴야 한다는 점을 함께 말한다" },
      { c: "follow", text: "치료비 질문에 감정이 아니라 선택지(단계별 치료, 상담)로 답한다" },
    ],
    pitfalls: ["'동물을 사랑한다'로 채운 답", "수의사를 반려동물 병원 의사로만 그리는 답", "보호자를 무책임한 사람으로 모는 답"],
    focus: "동물·보호자·사람 세 쪽을 함께 보는 일이라는 것을 내 기록으로 보입니다.",
  },
};

function values(f: MockField): Omit<MockItem, "id"> {
  const j = FIELD_JOB[f];
  return {
    kind: "인성 · 가치관(공통질문)",
    title: `${j.job}에게 가장 중요한 것`,
    first: `${j.job}에게 가장 중요하다고 생각하는 가치 하나를 말하고, 그 가치를 지키기 어려웠던 본인의 경험을 말해 보세요.`,
    main: ["그 가치가 다른 가치와 부딪히면 무엇을 먼저 지키겠습니까?", "그 가치를 지키지 않는 동료를 보면 어떻게 하겠습니까?"],
    followups: [
      "그 가치는 언제부터 중요하다고 생각하게 됐습니까?",
      "그 가치를 지키느라 손해를 본 적이 있습니까?",
      "그 가치가 지켜지는지 다른 사람은 무엇을 보고 알 수 있습니까?",
    ],
    keyPoints: [
      { c: "fact", text: "가치를 낱말 하나로 끝내지 않고, 지키기 어려웠던 실제 장면으로 보인다" },
      { c: "reflect", text: "그때 지키지 못했거나 흔들린 부분을 숨기지 않는다" },
      { c: "career", text: `그 가치가 ${j.job}의 일에서 어떤 장면으로 나타나는지 구체적으로 잇는다` },
      { c: "understand", text: "부딪히는 가치(예: 정직과 배려, 원칙과 효율)를 둘 다 인정하고 기준을 세워 고른다" },
      { c: "follow", text: "동료 질문에 고발이나 묵인 둘 중 하나로만 답하지 않는다" },
    ],
    pitfalls: ["'생명 존중'·'책임감' 같은 낱말만 있고 경험이 없는 답", "가치를 지키는 데 아무 어려움이 없었다는 답", "동료를 바로 문제 있는 사람으로 모는 답"],
    focus: "가치 하나 + 그 가치를 지키기 어려웠던 내 장면 하나를 준비합니다.",
  };
}

export type FieldDocKey = DocKey | "role" | "values";

/** 학과에 맞춘 서류형 문항. prefix 는 세트마다 겹치지 않게(예: 'chi-khu') */
export function fieldDoc(f: MockField, prefix: string, k: FieldDocKey): MockItem {
  let body: Omit<MockItem, "id">;
  if (k === "motive") body = motive(f);
  else if (k === "plan") body = plan(f);
  else if (k === "values") body = values(f);
  else if (k === "role") {
    if (f === "uidae") throw new Error("의대에는 role 질문이 없다 — motive·plan 을 쓴다");
    body = ROLE[f];
  } else body = swapItem(DOC_POOL[k], f);
  return { id: `${prefix}-doc-${k}`, ...body, rubric: "doc" };
}
