/** =========================================================================
 *  계열 면접 페이지 레지스트리 — /interview/{chidae,hanuidae,yakdae,suuidae} 와
 *  그 아래 대학별 페이지가 공유하는 단일 출처다.
 *
 *  새 계열을 붙일 때 고칠 곳은 이 파일과 app/interview/<계열>/[slug]/page.tsx
 *  두 개뿐이다. 페이지 본문은 app/interview/_field-univ.tsx 가 공용으로 그린다.
 *
 *  ⚠️ 라우트를 추가하면 Hub/brand/apps.json 의 medi pages 도 함께 늘려야
 *     사이트맵에 올라간다(사이트맵 SSOT).
 *  ========================================================================= */

import type { FieldStyle, FieldUniv } from "./field-interview";
import { CHIDAE_UNIVS } from "./chidae-interview";
import { HANUIDAE_UNIVS } from "./hanuidae-interview";
import { YAKDAE_UNIVS } from "./yakdae-interview";
import { SUUIDAE_UNIVS } from "./suuidae-interview";

export type FieldPageKey = "chidae" | "hanuidae" | "yakdae" | "suuidae";

/** 유형 묶음의 기본 표기. 계열에 따라 styleGroups 로 덮어쓴다. */
export const DEFAULT_STYLE_GROUPS: Record<
  FieldStyle,
  { label: string; blurb: string }
> = {
  jesimun: {
    label: "제시문 면접",
    blurb:
      "현장에서 처음 보는 제시문을 읽고 답합니다. 질문이 내 학교생활기록부에서 나오지 않으므로, 생기부를 복기하는 준비로는 대비되지 않습니다. 쟁점을 특정하고 입장을 세우는 훈련이 따로 필요합니다.",
  },
  injeokseong: {
    label: "인적성 · 서류 기반 면접",
    blurb:
      "질문의 출처가 내 학교생활기록부입니다. 지원자마다 질문이 다릅니다. 다만 '인적성'은 평가 배점의 이름이고 '서류 기반'은 질문 출처의 이름이라 서로 다른 축입니다. 같은 묶음 안에서도 배점 공개 여부가 대학마다 갈리므로 대학별로 확인해야 합니다.",
  },
  none: {
    label: "면접 미실시",
    blurb:
      "2027학년도 요강 기준으로 면접을 실시하지 않습니다. 제출 시점의 학생부와 수능 최저가 전부입니다.",
  },
};

export type FieldPage = {
  key: FieldPageKey;
  /** 계열 허브 경로. 대학 페이지는 `${base}/${slug}` */
  base: string;
  /** "치대 면접" — 내비게이션·CTA 에 쓰는 이름 */
  label: string;
  /** "치대" — 문장 안에서 짧게 부를 때 */
  short: string;
  /** "치의예과" — 요강상의 모집단위 이름 */
  unitLabel: string;
  /** 입시결과 페이지 경로 */
  ipkyul: string;
  univs: FieldUniv[];
  styleGroups?: Partial<Record<FieldStyle, { label: string; blurb: string }>>;
};

export const FIELD_PAGES: Record<FieldPageKey, FieldPage> = {
  chidae: {
    key: "chidae",
    base: "/interview/chidae",
    label: "치대 면접",
    short: "치대",
    unitLabel: "치의예과",
    ipkyul: "/ipkyul/chiuiye",
    univs: CHIDAE_UNIVS,
  },
  hanuidae: {
    key: "hanuidae",
    base: "/interview/hanuidae",
    label: "한의대 면접",
    short: "한의대",
    unitLabel: "한의예과",
    ipkyul: "/ipkyul/hanuiye",
    univs: HANUIDAE_UNIVS,
    // 한의대의 '제시문'은 연세대식 장문 제시문이 아니라 현장에서 받는 기본소양문항이다.
    styleGroups: {
      jesimun: {
        label: "현장 문항 면접",
        blurb:
          "면접 직전에 문항을 받습니다. 대전대는 기본소양문항을 사전 비공개로 두고 면접 15분 전 준비실에서 공개하며, 우석대는 준비실에서 문항 하나를 고른 뒤 5분간 답변을 준비합니다. 외울 기출이 없는 대신, 처음 보는 문항을 5~15분 안에 답변으로 세우는 절차 훈련이 전부입니다.",
      },
    },
  },
  yakdae: {
    key: "yakdae",
    base: "/interview/yakdae",
    label: "약대 면접",
    short: "약대",
    unitLabel: "약학과",
    ipkyul: "/ipkyul/yakhak",
    univs: YAKDAE_UNIVS,
  },
  suuidae: {
    key: "suuidae",
    base: "/interview/suuidae",
    label: "수의대 면접",
    short: "수의대",
    unitLabel: "수의예과",
    ipkyul: "/ipkyul/suuiye",
    univs: SUUIDAE_UNIVS,
  },
};

export function styleGroupMeta(field: FieldPage, style: FieldStyle) {
  return field.styleGroups?.[style] ?? DEFAULT_STYLE_GROUPS[style];
}

/** 같은 유형의 다른 대학 — 대학 페이지 하단에서 옆으로 건너갈 때 쓴다. */
export function siblingsOfStyle(field: FieldPage, slug: string) {
  const me = field.univs.find((u) => u.slug === slug);
  if (!me) return [];
  return field.univs.filter((u) => u.slug !== slug && u.style === me.style);
}

/** 질문 출처를 요강에 명시한 대학 수 — 허드의 안내 문구에 쓴다. */
export function sourceDisclosedCount(field: FieldPage) {
  return field.univs.filter((u) => u.source && u.source.label !== "요강 미기재").length;
}
