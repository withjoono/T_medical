/** 남은 의치한약수 모의면접(2026-11-24~) 세트를 짧게 쓰기 위한 도구.
 *  세트 하나 = 대학 × 학과 × 전형 묶음. 방 구성(sim)에서 문항 목록과 코치용 rooms 를 함께 만든다. */

import type { MockField, MockItem, Rubric, SimSpec, UnivMock } from "./uidae-after-suneung";

export type LateRoom = {
  label: string;
  answerSec: number;
  prepSec?: number;
  /** 이 방에 나올 수 있는 문항 — 실전에서는 하나를 고른다 */
  items: MockItem[];
};

export type LateMock = {
  key: string;
  univ: string;
  field: MockField;
  track: string;
  dates: string[];
  rubric: Rubric;
  /** 형식 이름(화면에 보임) */
  label: string;
  /** 대학이 밝힌 진행 방식과 T메디가 정한 시간을 가른 설명 */
  timeNote: string;
  scoring: string[];
  notes: string[];
  rooms: LateRoom[];
};

/** 질문 n 개를 이어서 보는 서류 확인 면접 — 전체 시간을 문항 수로 나눈다(10초 단위) */
export function split(totalSec: number, groups: (MockItem | MockItem[])[], labels?: string[]): LateRoom[] {
  const each = Math.round(totalSec / groups.length / 10) * 10;
  return groups.map((g, i) => {
    const items = Array.isArray(g) ? g : [g];
    const kind = items[0].kind.split("·").pop()?.trim() ?? "";
    return { label: labels?.[i] ?? `질문 ${i + 1} · ${kind}`, answerSec: each, prepSec: 0, items };
  });
}

export function lateMock(m: LateMock): UnivMock {
  const items = m.rooms.flatMap((r) => r.items);
  const sim: SimSpec = {
    label: m.label,
    note: m.timeNote,
    rooms: m.rooms.map((r) => ({ label: r.label, answerSec: r.answerSec, prepSec: r.prepSec ?? 0, items: r.items.map((it) => it.id) })),
  };
  return {
    key: m.key,
    univ: m.univ,
    field: m.field,
    track: m.track,
    firstInterview: [...m.dates].sort()[0],
    dates: m.dates,
    rubric: m.rubric,
    rooms: m.rooms.map((r) => ({ label: r.label, prepSec: r.prepSec ?? 0, answerSec: r.answerSec, itemsPerRoom: r.items.length })),
    timeNote: m.timeNote,
    scoring: m.scoring,
    notes: m.notes,
    items,
    sim,
  };
}

/** 세트 안에서 쓰는 서류형 문항의 id 앞부분 — 학과·대학이 겹치지 않게 */
export const prefixOf = (field: MockField, key: string) => `${field === "uidae" ? "u" : field.slice(0, 3)}-${key}`;
