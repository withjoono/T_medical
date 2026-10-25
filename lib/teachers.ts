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

/* =========================================================================
 *  계열별 담당 선생님 — **선생님이 늘어나면 여기 한 줄만 고친다.**
 *
 *  ▸ 새 선생님 등록 절차 (2단계로 끝난다)
 *    1. 위 TEACHER_PROFILES 에 프로필 한 줄 추가
 *       hong: { id: "hong", name: "홍길동", credential: "○○대학교 치과대학",
 *               photo: "/images/teachers/hong.jpg" }
 *    2. 아래 FIELD_TEACHERS 의 해당 계열 배열에 id 를 넣는다
 *       chidae: ["hong"],
 *    → 치대 면접 페이지 10곳 + 치대 허브 + 전형 페이지까지 전부 자동 반영된다.
 *
 *  ▸ 비어 있는 계열은 DEFAULT_TEACHER 가 맡는다. 그래서 아직 그 계열 출신
 *    선생님이 없어도 화면이 비지 않는다.
 *
 *  ⚠️ 화면 문구는 여기 적힌 credential 을 **그대로** 노출한다. "치대 출신" 같은
 *     말을 코드가 지어내지 않는다 — 등록되지 않은 경력을 사이트가 주장하면
 *     허위 표시가 되고, 상담 한 번에 드러난다.
 * ========================================================================= */

export type FieldTeacherKey = "uidae" | "chidae" | "hanuidae" | "yakdae" | "suuidae";

/** 계열 전담 선생님. 빈 배열이면 DEFAULT_TEACHER 로 떨어진다. */
export const FIELD_TEACHERS: Record<FieldTeacherKey, TeacherId[]> = {
  uidae: ["lsi"],
  chidae: [],
  hanuidae: [],
  yakdae: [],
  suuidae: [],
};

/** 계열 전담이 없을 때 맡는 선생님 */
export const DEFAULT_TEACHER: TeacherId = "lsi";

/** 제시문 면접은 계열과 무관하게 이 선생님이 전담한다 */
export const JESIMUN_TEACHER: TeacherId = "pew";

export function profile(id: TeacherId | string): TeacherProfile | undefined {
  return (TEACHER_PROFILES as Record<string, TeacherProfile>)[id];
}

/** 이 계열·이 면접 유형을 누가 맡는가. 화면은 이 결과만 보고 그린다.
 *  @param style FieldUniv.style — "jesimun" 이면 제시문 전담이 맡는다 */
export function teachersForField(
  field: FieldTeacherKey,
  style?: string,
): TeacherProfile[] {
  if (style === "none") return [];
  if (style === "jesimun") {
    const p = profile(JESIMUN_TEACHER);
    return p ? [p] : [];
  }
  const ids = FIELD_TEACHERS[field]?.length ? FIELD_TEACHERS[field] : [DEFAULT_TEACHER];
  return ids.map(profile).filter((p): p is TeacherProfile => Boolean(p));
}

/** 그 계열에 전담 선생님이 따로 지정돼 있는가 — 문구를 바꿀 때 쓴다 */
export function hasFieldTeacher(field: FieldTeacherKey): boolean {
  return (FIELD_TEACHERS[field]?.length ?? 0) > 0;
}
