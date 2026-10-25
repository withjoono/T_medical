import { Users } from "lucide-react";
import { PromoSection } from "../_site/components";
import { TeacherCards } from "../univ/_booking";
import { ClassCtaBand } from "./_interview";
import { UNIV_TEACHERS } from "@/lib/mmi-schedule";

/** =========================================================================
 *  담당 강사 + 수업 안내(컨셉·수업료) 한 덩어리.
 *
 *  ⚠️ 대학 페이지의 강사·수업료는 **여기 한 곳**에서만 고친다.
 *     의대(/interview/uidae/<slug>)와 치·한·약·수(/interview/<계열>/<slug>)가
 *     같은 컴포넌트를 쓴다. 전에는 의대 페이지에만 직접 박혀 있어서
 *     치·한·약·수 50개 대학에 강사도 수업료도 나오지 않았다.
 *
 *  배정 규칙은 계열과 무관하게 하나다 — 주 형식이 제시문이면 박은우,
 *  그 밖(인성·서류 기반·MMI)이면 이세인. 고려대만 둘 다.
 *  ========================================================================= */

export type TeacherKey = "general" | "jesimun";

/** 면접 유형에서 담당 강사를 정한다. 계열 페이지는 style 만 주면 된다. */
export function teacherKeysForStyle(style: string | undefined): TeacherKey[] {
  if (!style || style === "none") return [];
  return style === "jesimun" ? ["jesimun"] : ["general"];
}

function subtitleFor(short: string, keys: TeacherKey[]) {
  if (keys.length > 1) {
    return `${short} 면접은 제시문 면접은 박은우 선생님, 그 밖의 면접은 이세인 선생님이 나눠 맡습니다.`;
  }
  return keys[0] === "jesimun"
    ? `${short} 면접은 제시문 면접이라 박은우 선생님이 맡습니다.`
    : `${short} 면접은 이세인 선생님이 맡습니다.`;
}

export function TeacherAndClass({
  short,
  typeName,
  teacherKeys,
}: {
  /** 대학 약칭 — 문구에 들어간다 */
  short: string;
  /** CTA 밴드의 eyebrow. 보통 `${short} ${unitLabel} 면접` */
  typeName: string;
  /** 빈 배열이면 강사 섹션을 생략한다(면접 미실시 대학) */
  teacherKeys: TeacherKey[];
}) {
  return (
    <>
      {teacherKeys.length > 0 && (
        <PromoSection
          eyebrow="INSTRUCTOR"
          EyebrowIcon={Users}
          title="담당 강사"
          subtitle={subtitleFor(short, teacherKeys)}
        >
          <TeacherCards teachers={teacherKeys.map((k) => UNIV_TEACHERS[k])} />
        </PromoSection>
      )}
      <ClassCtaBand typeName={typeName} />
    </>
  );
}
