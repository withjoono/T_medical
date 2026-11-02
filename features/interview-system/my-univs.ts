"use client";

import { useSyncExternalStore } from "react";
import { STORAGE_PREFIX } from "./config";

/**
 * 내 지원 대학 — 「내 면접」의 중심 (수시앱 my-univs.ts 와 같은 방식).
 * 서버 표가 아직 없어(운영 DB 마이그레이션 필요) 이 브라우저(localStorage)에만 둔다.
 * 값은 catalog.ts 의 대학 id(`${계열}:${slug}`)와 전형 이름.
 */

export interface MyUniv {
  id: string;
  track?: string;
}

export const MY_UNIVS_MAX = 6;
const KEY = `${STORAGE_PREFIX}my-univs`;
const listeners = new Set<() => void>();
const EMPTY: MyUniv[] = [];

function read(): MyUniv[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => x && typeof x.id === "string").slice(0, MY_UNIVS_MAX) : [];
  } catch {
    return [];
  }
}

let cache: MyUniv[] | null = null;
const snapshot = () => (cache ??= read());

function write(next: MyUniv[]) {
  cache = next.slice(0, MY_UNIVS_MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* 저장 불가(사생활 보호 모드) — 이 화면에서만 유지 */
  }
  listeners.forEach((f) => f());
}

function subscribe(f: () => void) {
  listeners.add(f);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null;
    f();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(f);
    window.removeEventListener("storage", onStorage);
  };
}

export function useMyUnivs(): MyUniv[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

/** 같은 대학은 하나만 — 다시 담으면 전형만 바꾼다. 6개가 넘으면 담지 않고 false */
export function addMyUniv(id: string, track?: string): boolean {
  const list = snapshot();
  const i = list.findIndex((x) => x.id === id);
  if (i >= 0) {
    write(list.map((x, j) => (j === i ? { id, track: track ?? x.track } : x)));
    return true;
  }
  if (list.length >= MY_UNIVS_MAX) return false;
  write([...list, { id, track }]);
  return true;
}

export function removeMyUniv(id: string) {
  write(snapshot().filter((x) => x.id !== id));
}
