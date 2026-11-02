"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, ChevronRight, Lock, Plus, Search, Sparkles, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClassInvite } from "./class-connect";
import { todayKst } from "./config";
import { useBookedStudent, useInterviewTodo, useMediAuth } from "./hooks";
import { MyClassSection } from "./my-class";
import { MY_UNIVS_MAX, addMyUniv, removeMyUniv, useMyUnivs } from "./my-univs";
import { TodoBottomBar, TodoCard } from "./todo";
import type { CatalogTrack, CatalogUniv, InterviewCatalog } from "./types";
import { LoginButton, Panel, btnLine } from "./ui";

/**
 * 내 면접 — /interview/me (수시앱 my-interview.tsx 를 옮긴 것, 메뉴 첫째)
 *
 *   1 할 일 카드(상태별 한 장) → 2 내 지원 대학(최대 6장, 면접일 가까운 순) → 3 내 수업 · 받은 과제 · 보낸 결과
 *   지원 대학은 로그인 없이도 이 기기에 담을 수 있다. 수업 예약한 대학은 예약 정보에서 채운다.
 *   수시앱과 다른 점: 「관심대학에서 가져오기」·남은 횟수 줄은 없다(T메디에는 관심대학이 없고, AI 면접 가격은 T메디가 따로 정한다).
 */
export function MyInterviewPage({ catalog }: { catalog: InterviewCatalog }) {
  const { ready, logged } = useMediAuth();
  const todo = useInterviewTodo();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 px-4 pb-16 pt-6 sm:px-6">
      <ClassInvite />
      <TodoCard todo={todo} />
      <MyUnivsSection catalog={catalog} />
      {ready &&
        (logged ? (
          <MyClassSection catalog={catalog} intro={<ClassIntro />} />
        ) : (
          <Panel>
            <div className="py-4 text-center">
              <Lock className="mx-auto h-7 w-7 text-ink-300" />
              <p className="mt-3 text-[15px] font-semibold text-ink-900">로그인하면 수업 일정 · 선생님 과제를 여기서 챙겨요</p>
              <p className="mt-1 text-[13px] text-ink-500">면접 수업을 예약했거나 선생님 초대 링크를 받았다면 T스쿨 계정으로 로그인하세요.</p>
              <LoginButton className="mt-4" />
            </div>
          </Panel>
        ))}
      <TodoBottomBar todo={todo} />
    </div>
  );
}

function ClassIntro() {
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-ink-900">내 수업</p>
          <p className="mt-0.5 text-[13px] text-ink-500">면접 수업을 예약하거나 선생님 초대 링크로 연결하면 수업 일정·과제·보낸 결과가 여기에 보여요.</p>
        </div>
        <Link href="/interview/class" className={btnLine}>
          <Video className="h-4 w-4 text-jade-700" /> 면접 수업 알아보기
        </Link>
      </div>
    </Panel>
  );
}

/* ───────────────────────── 내 지원 대학 ───────────────────────── */

interface Row {
  u: CatalogUniv;
  t: CatalogTrack;
  /** 수업을 예약한 대학 — 예약 정보에서 왔으니 여기서 지우지 않는다 */
  booked: boolean;
}

const fieldShort = (catalog: InterviewCatalog, u: CatalogUniv) => catalog.fields.find((f) => f.key === u.field)?.short ?? "";

/** 아직 오지 않은 면접일(없으면 9999) — 정렬용 */
const nextDate = (t: CatalogTrack, today: string) => (t.date && t.date >= today ? t.date : "9999");

/** 전형을 고르지 않았으면 면접이 남은 전형 중 가장 가까운 것 */
function pickTrack(u: CatalogUniv, name: string | null | undefined, today: string): CatalogTrack {
  const hit = name ? u.tracks.find((t) => t.name === name) : undefined;
  return hit ?? [...u.tracks].sort((a, b) => nextDate(a, today).localeCompare(nextDate(b, today)))[0];
}

function MyUnivsSection({ catalog }: { catalog: InterviewCatalog }) {
  const mine = useMyUnivs();
  const me = useBookedStudent();
  const [adding, setAdding] = useState(false);
  const today = todayKst();

  const rows = useMemo(() => {
    const out: Row[] = [];
    for (const b of me.bookings) {
      // 예약의 학교 이름 + 학과(계열 기본 학과명)로 찾는다. 학과가 안 맞으면 학교만으로
      const bySchool = catalog.univs.filter((u) => u.school === b.university || u.short === b.university);
      const unit = (u: CatalogUniv) => catalog.fields.find((f) => f.key === u.field)?.unit;
      const u = bySchool.find((x) => unit(x) === b.department) ?? bySchool[0];
      if (u && !out.some((x) => x.u.id === u.id)) out.push({ u, t: pickTrack(u, b.trackName, today), booked: true });
    }
    for (const m of mine) {
      const u = catalog.univs.find((x) => x.id === m.id);
      if (u && !out.some((x) => x.u.id === u.id)) out.push({ u, t: pickTrack(u, m.track, today), booked: false });
    }
    return out.sort((a, b) => nextDate(a.t, today).localeCompare(nextDate(b.t, today))).slice(0, MY_UNIVS_MAX);
  }, [catalog, me.bookings, mine, today]);

  return (
    <Panel
      title="내 지원 대학"
      icon={<CalendarClock className="h-4 w-4 text-jade-700" />}
      aside={
        rows.length > 0 &&
        rows.length < MY_UNIVS_MAX &&
        !adding && (
          <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-[13px] font-semibold text-jade-700 hover:underline">
            <Plus className="h-4 w-4" /> 대학 추가
          </button>
        )
      }
    >
      {rows.length === 0 ? (
        <div>
          <p className="display text-[1.15rem] text-ink-900">지원한 대학을 골라 주세요</p>
          <p className="mt-1 text-[14px] text-ink-600">면접이 있는 대학을 담으면 1차 발표일·면접일을 날짜 순으로 챙겨 드려요(최대 {MY_UNIVS_MAX}개, 이 기기에 저장).</p>
          <UnivAdder catalog={catalog} className="mt-4" />
        </div>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {rows.map((r) => (
              <UnivCard key={r.u.id} row={r} label={fieldShort(catalog, r.u)} today={today} />
            ))}
          </ul>
          {adding && <UnivAdder catalog={catalog} className="mt-4" onDone={() => setAdding(false)} />}
        </>
      )}
    </Panel>
  );
}

function dday(iso: string, today: string): number {
  return Math.round((Date.parse(iso) - Date.parse(today)) / 86_400_000);
}

function Dday({ iso, today }: { iso: string; today: string }) {
  const n = dday(iso, today);
  if (Number.isNaN(n)) return null;
  if (n < 0) return <span className="bg-paper-200 px-1.5 py-0.5 text-[11px] font-semibold text-ink-500">지남</span>;
  return <span className="tnum bg-brass-300 px-1.5 py-0.5 text-[11px] font-semibold text-ink-900">{n === 0 ? "D-DAY" : `D-${n}`}</span>;
}

/** 「2026-11-22」 → 「11.22 (일)」 */
function shortDate(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00+09:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const w = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", weekday: "short" }).format(d);
  return `${d.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric" }).replace(/\.\s?/g, ".").replace(/\.$/, "")} (${w})`;
}

const chipBtn = "inline-flex h-9 flex-1 items-center justify-center gap-1 border text-[13px] font-semibold";

function UnivCard({ row: r, label, today }: { row: Row; label: string; today: string }) {
  const { u, t } = r;
  return (
    <li className="flex flex-col border border-hair bg-paper-50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink-900">
            {u.short} <span className="text-[13px] font-normal text-ink-500">{label}</span>
          </p>
          {u.tracks.length > 1 ? (
            <select
              value={t.name}
              onChange={(e) => addMyUniv(u.id, e.target.value)}
              disabled={r.booked}
              aria-label={`${u.short} 전형`}
              className="mt-0.5 max-w-full truncate border-0 bg-transparent p-0 text-[13px] text-ink-600 focus:ring-0 disabled:opacity-100"
            >
              {u.tracks.map((x) => (
                <option key={x.name} value={x.name}>
                  {x.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="truncate text-[13px] text-ink-600">{t.name}</p>
          )}
        </div>
        {r.booked ? (
          <span className="shrink-0 bg-jade-100 px-2 py-0.5 text-[11px] font-semibold text-jade-700">수업</span>
        ) : (
          <button type="button" onClick={() => removeMyUniv(u.id)} aria-label={`${u.short} 빼기`} className="shrink-0 p-1 text-ink-400 hover:bg-paper-200 hover:text-ink-700">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-dashed border-hair pt-3 text-[12px]">
        <div>
          <dt className="text-ink-500">1차 발표</dt>
          <dd className="tnum mt-0.5 flex flex-wrap items-center gap-1 font-semibold text-ink-900">
            {t.announce ? (
              <>
                {shortDate(t.announce)} <Dday iso={t.announce} today={today} />
              </>
            ) : (
              <span className="font-normal text-ink-500">요강 미기재</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">면접</dt>
          <dd className="tnum mt-0.5 flex flex-wrap items-center gap-1 font-semibold text-ink-900">
            {t.date ? (
              <>
                {shortDate(t.date)} <Dday iso={t.date} today={today} />
              </>
            ) : (
              <span className="font-normal text-ink-500">공지 전</span>
            )}
          </dd>
        </div>
      </dl>
      <div className="mt-3 flex gap-1.5">
        <Link href={u.href} className={cn(chipBtn, "border-ink-200 bg-white text-ink-800 hover:border-jade-600")}>
          면접 정보
        </Link>
        <Link
          href={u.aiSet ? `/interview/ai?set=${encodeURIComponent(u.aiSet)}` : "/interview/ai"}
          className={cn(chipBtn, "border-jade-200 bg-jade-50 text-jade-700 hover:border-jade-600")}
        >
          <Sparkles className="h-3.5 w-3.5" /> AI 연습
        </Link>
        <Link href="/interview/class" className={cn(chipBtn, "border-ink-200 bg-white text-ink-800 hover:border-jade-600")}>
          수업
        </Link>
      </div>
    </li>
  );
}

/* ───────────── 대학 찾기 — 이름 · 초성(「ㄱㄹ」) ───────────── */

const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const chosung = (s: string) =>
  [...s].map((c) => {
    const code = c.charCodeAt(0) - 0xac00;
    return code >= 0 && code < 11172 ? CHO[Math.floor(code / 588)] : c;
  }).join("");
const isChosungOnly = (s: string) => /^[ㄱ-ㅎ]+$/.test(s);

function UnivAdder({ catalog, className, onDone }: { catalog: InterviewCatalog; className?: string; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const [full, setFull] = useState(false);
  const hits = useMemo(() => {
    const s = q.replace(/\s/g, "");
    if (!s) return [];
    const key = (n: string) => (isChosungOnly(s) ? chosung(n) : n).replace(/\s/g, "");
    // 0: 이름이 이렇게 시작 · 1: 중간에 들어 있음 · -1: 없음
    const rank = (u: CatalogUniv) => {
      const names = [u.short, u.school].map(key);
      return names.some((n) => n.startsWith(s)) ? 0 : names.some((n) => n.includes(s)) ? 1 : -1;
    };
    return catalog.univs
      .map((u) => ({ u, r: rank(u) }))
      .filter((x) => x.r >= 0)
      .sort((a, b) => a.r - b.r)
      .slice(0, 10)
      .map((x) => x.u);
  }, [q, catalog.univs]);
  const pick = (id: string) => {
    if (!addMyUniv(id)) {
      setFull(true);
      return;
    }
    setQ("");
    onDone?.();
  };
  return (
    <div className={className}>
      <label className="relative block">
        <span className="sr-only">지원 대학 찾기</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          id="medi-univ-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setFull(false);
          }}
          placeholder="지원한 대학 이름 (초성도 돼요: ㄱㄹ)"
          inputMode="search"
          className="h-11 w-full border border-ink-200 bg-white pl-10 pr-4 text-[16px] text-ink-900 outline-none focus:border-jade-600"
        />
      </label>
      {full && <p className="mt-2 text-[12px] font-semibold text-red-700">지원 대학은 {MY_UNIVS_MAX}개까지 담을 수 있어요. 하나를 빼고 다시 담아 주세요.</p>}
      {q.trim() && (
        <ul className="mt-2 divide-y divide-hair border border-hair bg-white">
          {hits.length ? (
            hits.map((u) => (
              <li key={u.id}>
                <button type="button" onClick={() => pick(u.id)} className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] hover:bg-paper-100">
                  <span className="font-semibold text-ink-900">
                    {u.short} <span className="font-normal text-ink-500">{fieldShort(catalog, u)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-jade-700">
                    담기 <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-[14px] text-ink-500">면접이 있는 의·치·한·약·수 대학 중에 찾지 못했어요.</li>
          )}
        </ul>
      )}
      {onDone && (
        <button type="button" onClick={onDone} className="mt-2 text-[12px] text-ink-500 underline">
          닫기
        </button>
      )}
    </div>
  );
}
