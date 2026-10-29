/** AI 모의면접(/interview/ai) — 계열별 연습 질문.
 *  iframe 에 `?q=` 로 넘긴다. 학생이 화면에서 고르거나 직접 추가할 수 있으므로 계열마다 5개 안팎만 둔다. */
export type CoachTrack = { key: string; label: string; questions: string[] };

export const COACH_TRACKS: CoachTrack[] = [
  {
    key: "uidae",
    label: "의대",
    questions: [
      "의사가 되고 싶은 이유를 1분 안에 말해 보세요.",
      "의사에게 가장 필요한 자질 한 가지와, 본인이 그 자질을 갖췄다고 보여 줄 경험을 말해 보세요.",
      "환자가 치료를 거부할 때 의사로서 어떻게 하겠습니까?",
      "지역 의료 인력 부족 문제에 대해 본인의 생각을 말해 보세요.",
      "팀 활동에서 의견이 갈렸을 때 어떻게 해결했는지 말해 보세요.",
    ],
  },
  {
    key: "chidae",
    label: "치대",
    questions: [
      "의대가 아닌 치대를 지원한 이유를 말해 보세요.",
      "치과의사에게 필요한 손기술 외의 역량은 무엇이라고 생각합니까?",
      "치료 비용 때문에 망설이는 환자에게 어떻게 설명하겠습니까?",
      "학교생활 중 가장 꼼꼼함이 필요했던 경험을 말해 보세요.",
    ],
  },
  {
    key: "hanuidae",
    label: "한의대",
    questions: [
      "한의학을 공부하고 싶은 이유를 말해 보세요.",
      "한의학과 서양의학이 협력할 수 있는 분야는 어디라고 생각합니까?",
      "한의학의 과학적 근거를 묻는 사람에게 어떻게 답하겠습니까?",
      "꾸준히 노력해서 결과를 낸 경험을 말해 보세요.",
    ],
  },
  {
    key: "yakdae",
    label: "약대",
    questions: [
      "약사가 되고 싶은 이유를 말해 보세요.",
      "약사의 역할이 조제 외에 어디까지 넓어져야 한다고 생각합니까?",
      "처방이 잘못된 것 같다고 느낄 때 약사로서 어떻게 하겠습니까?",
      "탐구 활동 중 가장 기억에 남는 실험과 배운 점을 말해 보세요.",
    ],
  },
  {
    key: "suuidae",
    label: "수의대",
    questions: [
      "수의사가 되고 싶은 이유를 말해 보세요.",
      "반려동물 외에 수의사가 일하는 분야를 아는 대로 말해 보세요.",
      "보호자가 치료비 때문에 안락사를 원할 때 어떻게 하겠습니까?",
      "원헬스(One Health) 개념에 대해 설명해 보세요.",
    ],
  },
];

/** 면접 세트로 여는 iframe 주소 — 세트 공개 파일은 scripts/build-interview-sets.ts 가 public/interview-sets 에 만든다(lib/interview-sets.ts) */
export function coachSetSrc(setPath: string): string {
  return `/ai-interview/embed.html#${new URLSearchParams({ set: setPath }).toString()}`;
}

/** 같은 출처 iframe 주소 — 파일은 Interview 저장소 tools/sync-coach-to-tmedi.mjs 가 public/ai-interview 에 넣는다 */
export function coachSrc(questions: string[]): string {
  const qs = new URLSearchParams();
  for (const q of questions) qs.append("q", q);
  // 쿼리가 아니라 해시 — cleanUrls 리다이렉트(embed.html → embed)가 쿼리를 떨어뜨려도 해시는 남는다
  return `/ai-interview/embed.html#${qs.toString()}`;
}
