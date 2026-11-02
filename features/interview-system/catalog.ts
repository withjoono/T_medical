import { UNIV_PAGES } from "@/lib/univ";
import { FIELD_PAGES, type FieldPageKey } from "@/lib/field-registry";
import { setIndex } from "@/lib/interview-sets";
import { SESSION_MINUTES, TUITION } from "@/lib/mmi-schedule";
import type { CatalogField, CatalogUniv, ClassOption, InterviewCatalog } from "./types";

/** =========================================================================
 *  면접 시스템이 쓰는 T메디 데이터 묶음 — **서버 컴포넌트(page.tsx)에서만** 부른다.
 *
 *  대학·전형·1차 발표일·면접일과 수업 상품을 얇게 추려 props 로 넘긴다.
 *  클라이언트 묶음에 계열 데이터 원본(수천 줄)이 들어가지 않게 하려는 것이다.
 *  면접 앱으로 떼어 갈 때는 이 파일만 그 앱의 데이터로 바꾸면 된다.
 *  ========================================================================= */

const FIELD_LABEL: Record<CatalogField, { short: string; unit: string }> = {
  uidae: { short: "의대", unit: "의예과" },
  chidae: { short: "치대", unit: FIELD_PAGES.chidae.unitLabel },
  hanuidae: { short: "한의대", unit: FIELD_PAGES.hanuidae.unitLabel },
  yakdae: { short: "약대", unit: FIELD_PAGES.yakdae.unitLabel },
  suuidae: { short: "수의대", unit: FIELD_PAGES.suuidae.unitLabel },
};

/** 「고려대학교 의과대학」 → 「고려대학교」. 학교 이름이 안 보이면 약칭 */
function schoolName(name: string, short: string): string {
  const m = name.match(/^(\S*대학교)/);
  return m ? m[1] : short;
}

export function buildInterviewCatalog(): InterviewCatalog {
  const sets = setIndex();
  const aiSet = (field: CatalogField, short: string) => sets.find((s) => s.field === field && s.univ === short)?.id ?? null;
  const univs: CatalogUniv[] = [];

  for (const u of UNIV_PAGES) {
    if (u.hasInterview === false || !u.interview) continue;
    const tracks = u.interview.tracks.map((t) => ({ name: t.name, announce: t.announce, date: t.interview }));
    if (!tracks.length) continue;
    univs.push({
      id: `uidae:${u.slug}`,
      field: "uidae",
      short: u.short,
      school: schoolName(u.name, u.short),
      href: `/interview/uidae/${u.slug}`,
      tracks,
      aiSet: aiSet("uidae", u.short),
    });
  }
  for (const key of Object.keys(FIELD_PAGES) as FieldPageKey[]) {
    const page = FIELD_PAGES[key];
    for (const u of page.univs) {
      if (u.style === "none") continue;
      const tracks = u.tracks.filter((t) => t.interview).map((t) => ({ name: t.name, announce: t.announce, date: t.date }));
      if (!tracks.length) continue;
      univs.push({
        id: `${key}:${u.slug}`,
        field: key,
        short: u.short,
        school: schoolName(u.name, u.short),
        href: `${page.base}/${u.slug}`,
        tracks,
        aiSet: aiSet(key, u.short),
      });
    }
  }

  const options: ClassOption[] = [
    { product: "iv_medi1", label: "면접 수업 1회", sessions: 1, price: TUITION.perSession, note: `선생님 1:1 줌 ${SESSION_MINUTES}분` },
    {
      product: "iv_medi3",
      label: `면접 수업 ${TUITION.pack.sessions}회 선결제`,
      sessions: TUITION.pack.sessions,
      price: TUITION.pack.price,
      note: `${SESSION_MINUTES}분 × ${TUITION.pack.sessions}회 · 회당 ${TUITION.pack.perSessionLabel}`,
      recommended: true,
    },
  ];
  const refund = [TUITION.refund.rule, TUITION.refund.fairness];
  const fields = (Object.keys(FIELD_LABEL) as CatalogField[]).map((key) => ({ key, ...FIELD_LABEL[key] }));
  return { fields, univs: univs.sort((a, b) => a.short.localeCompare(b.short, "ko") || a.field.localeCompare(b.field)), options, refund };
}
