/** =========================================================================
 *  선생님 프로필 SSOT — 이름 · 학력/경력 · 사진은 **여기 한 곳**에서만 고친다.
 *  2026-10-23 신설. 의·치·한·약·수 모든 면접 페이지의 강사 카드(TeacherCards)가
 *  id 로 이 표를 찾아 사진을 붙인다.
 *
 *  ▸ 선생님 추가: 아래 TEACHER_PROFILES 에 한 줄 추가 → 사진은 public/images/teachers/<id>.jpg
 *    (권장 480×600, 4:5 세로, 배경 밝은 단색). 사진이 없으면 photo 를 비워 두면 아이콘으로 대체된다.
 *  ▸ 어느 대학·유형을 누가 맡는지(role·focus·배정)는 lib/mmi-schedule.ts 의 TEACHERS /
 *    UNIV_TEACHERS 와 lib/interview-types.ts 의 univTeacherKeys 가 정한다. 거기서는
 *    이름·학력을 다시 적지 말고 이 표를 펼쳐 쓴다(...TEACHER_PROFILES.lsi).
 *  ========================================================================= */

export type TeacherProfile = {
  id: string;
  name: string;
  /** 학력 · 경력 한 줄 */
  credential: string;
  /** public/ 기준 경로. 없으면 카드가 아이콘으로 대체한다 */
  photo?: string;
};

export const TEACHER_PROFILES = {
  lsi: {
    id: "lsi",
    name: "이세인",
    credential: "이화여자대학교 의과대학",
    photo: "/images/teachers/lee-sein.jpg",
  },
  pew: {
    id: "pew",
    name: "박은우",
    credential: "서강대학교 공과대학 졸업 · 現 과학고 수학·과학(물리·화학·생명) AP 수업 담당",
  },
} as const satisfies Record<string, TeacherProfile>;

export type TeacherId = keyof typeof TEACHER_PROFILES;

/** 카드에 쓸 사진 — id 로 찾는다. 등록 안 된 id·사진 없음이면 undefined */
export function teacherPhoto(id: string): string | undefined {
  const p = (TEACHER_PROFILES as Record<string, TeacherProfile>)[id];
  return p?.photo;
}
