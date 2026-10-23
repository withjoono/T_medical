/** =========================================================================
 *  치·한·약·수 대학별 **전형 소개** 페이지(/univ/<계열>/<대학>)의 데이터 연결부.
 *  2026-10-23 신설. 의대는 /univ/<대학> (lib/univ) 가 따로 있다.
 *
 *  · 전형 데이터 = lib/ipkyul (T스쿨 수시 DB 2027, 실측 입결만) — 페이지 목록도 여기서 나온다.
 *  · 면접 데이터 = lib/field-registry (/interview/<계열>/<대학>)
 *  두 데이터는 슬러그 규칙이 다르다(입결 `gachon`, 약대 면접 `gachon-y`, 한의대 면접 `daejeon`↔입결 `dju`).
 *  → **대학명(short ↔ name)으로 짝을 맞춘다.** 슬러그로 맞추지 말 것.
 *  ========================================================================= */

import { FIELD_BY_KEY, type Field, type FieldKey, type Univ } from "./ipkyul";
import { FIELD_PAGES, type FieldPage, type FieldPageKey } from "./field-registry";
import type { FieldUniv } from "./field-interview";

export const ADMISSION_FIELDS: FieldPageKey[] = ["chidae", "hanuidae", "yakdae", "suuidae"];

/** 면접 페이지 계열 키 → 입결 계열 키 */
export const IPKYUL_KEY: Record<FieldPageKey, FieldKey> = {
  chidae: "chiuiye",
  hanuidae: "hanuiye",
  yakdae: "yakhak",
  suuidae: "suuiye",
};

export function admissionBase(fp: FieldPageKey) {
  return `/univ/${fp}`;
}

export function ipkyulField(fp: FieldPageKey): Field {
  return FIELD_BY_KEY[IPKYUL_KEY[fp]];
}

export function admissionUnivs(fp: FieldPageKey): Univ[] {
  return ipkyulField(fp).univs;
}

export function getAdmissionUniv(fp: FieldPageKey, slug: string): Univ | undefined {
  return admissionUnivs(fp).find((u) => u.slug === slug);
}

const norm = (s: string) => s.replace(/\s|대학교|\(.*?\)/g, "").replace(/대$/, "");

/** 전형 페이지 → 같은 대학의 면접 페이지 데이터 */
export function interviewOf(fp: FieldPageKey, u: Univ): FieldUniv | undefined {
  return FIELD_PAGES[fp].univs.find((x) => norm(x.short) === norm(u.name));
}

/** 면접 페이지 → 같은 대학의 전형 페이지 경로 (없으면 undefined) */
export function admissionHrefOf(field: FieldPage, iv: FieldUniv): string | undefined {
  const u = admissionUnivs(field.key).find((x) => norm(x.name) === norm(iv.short));
  return u ? `${admissionBase(field.key)}/${u.slug}` : undefined;
}
