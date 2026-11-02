"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarCheck, Check, Copy, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { KEYS, bookingLabel, interviewApi } from "./api";
import { BANK, CONTACT_PHONE, todayKst, won } from "./config";
import { invalidate, useMediAuth, useRemote } from "./hooks";
import type { CatalogField, InterviewCatalog } from "./types";
import { ErrorLine, LoginButton, btn, input } from "./ui";

/**
 * 면접 수업 — 계좌이체로 예약 (수시앱 class-booking.tsx 를 옮긴 것)
 *
 *  ① 코스(1회 / 3회 선결제) ② 계좌로 송금 ③ 계열·지원 대학·전형·입금자·연락처·입금일 → 「예약하기」
 *  → 그 자리에서 예약 학생(입금 확인은 운영진이 나중에, susi-back scripts/interview-class-deposits.cjs) → 「내 면접」.
 *  수시앱과 같은 장부(POST /bank-deposit, product=iv_medi*)라 선생님 배정·수업 일정·과제가 같은 선생님앱으로 이어진다.
 *  면접은 대학마다 따로 예약·입금한다 — 예약한 학생도 「다른 면접 추가 예약」으로 계속 넣는다.
 *  adding: 「내 면접」 아래에 펼쳐 쓰는 추가 예약(성공해도 그 화면에 머문다)
 *  가격·환불 문장은 페이지가 lib/mmi-schedule.ts TUITION 에서 만들어 넘긴다(catalog.ts).
 */

const CUSTOM = "__custom__";

/** 목록에서 고르거나, 목록에 없으면 「직접 입력」으로 적는 칸 */
function PickOrType({
  label,
  required,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [typing, setTyping] = useState(false);
  const free = typing || options.length === 0 || (!!value && !options.includes(value));
  return (
    <label className="block text-[14px] font-medium text-ink-800">
      {label} {required && <span className="text-red-600">*</span>}
      {free ? (
        <span className="mt-1 flex gap-1.5">
          <input className={cn(input, "mt-0")} value={value} maxLength={100} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
          {options.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setTyping(false);
                onChange("");
              }}
              className="shrink-0 border border-ink-200 px-2 text-[12px] text-ink-600 hover:bg-paper-100"
            >
              목록
            </button>
          )}
        </span>
      ) : (
        <select
          className={input}
          value={value}
          onChange={(e) => {
            if (e.target.value === CUSTOM) {
              setTyping(true);
              onChange("");
            } else onChange(e.target.value);
          }}
        >
          <option value="">선택하세요</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value={CUSTOM}>목록에 없어요 — 직접 입력</option>
        </select>
      )}
    </label>
  );
}

function CopyAccount() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          ?.writeText(BANK.account.replace(/-/g, ""))
          .then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => undefined)
      }
      className="inline-flex h-9 items-center gap-1 border border-jade-600 bg-white px-3 text-[13px] font-semibold text-jade-700 hover:bg-jade-50"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "복사했어요" : "계좌 복사"}
    </button>
  );
}

export function ClassBookingPanel({ catalog, adding = false }: { catalog: InterviewCatalog; adding?: boolean }) {
  const { ready, logged } = useMediAuth();
  const router = useRouter();
  const bookingsQ = useRemote(KEYS.bookings, interviewApi.bookings, logged);
  const bookings = bookingsQ.data ?? [];
  const empty = { field: "uidae" as CatalogField, university: "", trackName: "", department: "의예과", depositorName: "", phone: "", depositDate: todayKst(), memo: "" };
  const [open, setOpen] = useState(adding);
  const [product, setProduct] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [agree, setAgree] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const picked = catalog.options.find((o) => o.product === product) ?? null;

  const univsOfField = useMemo(() => catalog.univs.filter((u) => u.field === form.field), [catalog.univs, form.field]);
  const univ = univsOfField.find((u) => u.school === form.university || u.short === form.university);
  const unitOf = (f: CatalogField) => catalog.fields.find((x) => x.key === f)?.unit ?? "";

  // 이미 예약한 학생 — 예약 목록 + 「다른 면접 추가 예약」
  if (logged && bookings.length && !open) {
    return (
      <section id="booking" className="scroll-mt-28 border-2 border-jade-200 bg-jade-50 px-5 py-5 sm:px-6">
        <p className="text-[13px] font-semibold text-jade-700">예약한 면접</p>
        <ul className="mt-2 space-y-1 text-[14px] text-ink-800">
          {bookings.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-2">
              <Check className="h-4 w-4 text-jade-700" /> {bookingLabel(b)}
              <span className={cn("px-2 py-0.5 text-[11px] font-semibold", b.status === "GRANTED" ? "bg-jade-100 text-jade-700" : "bg-brass-200 text-brass-600")}>
                {b.status === "GRANTED" ? "입금 확인됨" : "입금 확인 전"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/interview/me" className={btn}>
            내 면접으로
          </Link>
          <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 items-center border border-jade-600 px-4 text-[14px] font-semibold text-jade-700 hover:bg-jade-100">
            다른 면접 추가 예약
          </button>
        </div>
      </section>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!picked) return setError("수업 코스를 골라 주세요.");
    if (!form.university.trim()) return setError("지원 대학을 적어 주세요. 담당 선생님을 정할 때 씁니다.");
    if (!form.depositorName.trim()) return setError("입금자명을 적어 주세요.");
    if (!/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(form.phone.trim())) return setError("연락처를 010-0000-0000 형식으로 적어 주세요.");
    if (!form.depositDate) return setError("입금일을 골라 주세요.");
    if (!agree) return setError("환불 규칙을 확인하고 체크해 주세요.");
    setSaving(true);
    try {
      await interviewApi.book({
        product: picked.product,
        depositorName: form.depositorName.trim(),
        phone: form.phone.trim(),
        depositDate: form.depositDate,
        university: (univ?.school ?? form.university).trim(),
        trackName: form.trackName.trim() || undefined,
        department: form.department.trim() || undefined,
        // 운영진이 T메디 예약임을 바로 알아보게 메모 앞에 붙인다(서버는 memo 를 그대로 남긴다)
        memo: ["[T메디]", form.memo.trim()].filter(Boolean).join(" "),
      });
      invalidate(KEYS.bookings, KEYS.quota);
      if (adding) {
        setAdded(`${form.university.trim()} · ${picked.label}`);
        setForm(empty);
        setProduct(null);
        setAgree(false);
      } else {
        router.push("/interview/me");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="booking" className="scroll-mt-28 border border-hair bg-white px-5 py-6 sm:px-8 sm:py-8">
      <p className="flex items-center gap-1.5 text-[12px] font-semibold tracking-widest text-jade-700">
        <CalendarCheck className="h-4 w-4" /> {bookings.length ? "다른 면접 추가 예약 — 면접마다 따로 입금" : "계좌이체로 바로 예약"}
      </p>
      {added && (
        <p className="mt-2 flex items-center gap-1.5 bg-jade-50 px-3 py-2 text-[14px] font-semibold text-jade-700">
          <Check className="h-4 w-4" /> {added} 예약을 넣었어요. 위 면접 목록에서 골라 볼 수 있어요.
        </p>
      )}
      <h2 className="display mt-2 text-[1.35rem] leading-snug text-ink-900">수업 코스를 고르고 입금하면 바로 예약돼요</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">
        입금 신청을 남기는 순간 「내 면접」에 수업이 열립니다. 입금 확인과 담당 선생님 연결은 운영진이 이어서 하고, 선생님이 카톡으로 초대 링크를 보내 드려요.
      </p>

      {!ready ? null : !logged ? (
        <div className="mt-5 bg-paper-100 px-5 py-6 text-center">
          <Lock className="mx-auto h-6 w-6 text-ink-400" />
          <p className="mt-2 text-[14px] text-ink-700">예약은 로그인한 학생 계정(T스쿨)으로 해요. 예약한 계정에서 수업 일정·과제를 이어 갑니다.</p>
          <LoginButton label="로그인하고 예약하기" className="mt-3" />
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-5">
          <fieldset>
            <legend className="text-[14px] font-semibold text-ink-800">수업 코스</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {catalog.options.map((o) => (
                <label
                  key={o.product}
                  className={cn("flex cursor-pointer items-start gap-3 border p-4", product === o.product ? "border-jade-600 bg-jade-50 ring-1 ring-jade-600" : "border-ink-200 hover:border-ink-300")}
                >
                  <input type="radio" name="medi-class" className="mt-1 h-4 w-4 accent-[#0a5649]" checked={product === o.product} onChange={() => setProduct(o.product)} />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-ink-900">
                      {o.label}
                      {o.recommended && <span className="ml-1.5 bg-jade-100 px-1.5 py-0.5 text-[11px] font-semibold text-jade-700">추천</span>}
                    </span>
                    <span className="display tnum block text-[1.2rem] text-ink-900">{won(o.price)}</span>
                    <span className="block text-[12px] text-ink-500">{o.note} · AI 모의면접 무제한 포함</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-4">
            <label className="block text-[14px] font-medium text-ink-800">
              계열 <span className="text-red-600">*</span>
              <select
                className={input}
                value={form.field}
                onChange={(e) => {
                  const f = e.target.value as CatalogField;
                  setForm({ ...form, field: f, university: "", trackName: "", department: unitOf(f) });
                }}
              >
                {catalog.fields.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.short}
                  </option>
                ))}
              </select>
            </label>
            {/* 대학을 바꾸면 전형을 비운다 */}
            <PickOrType
              key={`u:${form.field}`}
              label="지원 대학"
              required
              value={univ?.short ?? form.university}
              options={univsOfField.map((u) => u.short)}
              placeholder="예) 고려대학교"
              onChange={(v) => setForm({ ...form, university: v.slice(0, 60), trackName: "" })}
            />
            <PickOrType
              key={`t:${form.field}|${form.university}`}
              label="전형"
              value={form.trackName}
              options={univ ? [...new Set(univ.tracks.map((t) => t.name))] : []}
              placeholder="예) 계열적합전형"
              onChange={(v) => setForm({ ...form, trackName: v.slice(0, 80) })}
            />
            <label className="block text-[14px] font-medium text-ink-800">
              학과
              <input className={input} value={form.department} maxLength={100} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-2 border-jade-200 bg-jade-50 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-jade-700">입금 계좌</p>
              <p className="tnum text-[16px] font-semibold text-ink-900">
                {BANK.name} {BANK.account}
              </p>
              <p className="text-[12px] text-ink-600">
                예금주 {BANK.holder}
                {picked ? ` · 입금액 ${won(picked.price)}` : " · 위에서 코스를 고르면 입금액이 보여요"}
              </p>
            </div>
            <CopyAccount />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-[14px] font-medium text-ink-800">
              입금자명
              <input className={input} value={form.depositorName} maxLength={50} placeholder="통장에 찍힌 이름" onChange={(e) => setForm({ ...form, depositorName: e.target.value })} />
            </label>
            <label className="block text-[14px] font-medium text-ink-800">
              연락처
              <input className={input} value={form.phone} inputMode="tel" placeholder="010-0000-0000" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="block text-[14px] font-medium text-ink-800">
              입금일
              <input type="date" className={input} value={form.depositDate} max={todayKst()} onChange={(e) => setForm({ ...form, depositDate: e.target.value })} />
            </label>
          </div>
          <label className="block text-[14px] font-medium text-ink-800">
            메모 (선택)
            <input className={input} value={form.memo} maxLength={280} placeholder="예) 학부모 명의로 입금했어요 · 원하는 수업 시간대" onChange={(e) => setForm({ ...form, memo: e.target.value })} />
          </label>

          <label className="flex cursor-pointer items-start gap-2 bg-paper-100 p-4 text-[12.5px] leading-relaxed text-ink-700">
            <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#0a5649]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>
              <b className="block text-[14px] text-ink-900">환불 규칙을 확인했습니다</b>
              {catalog.refund.map((l) => (
                <span key={l} className="block">
                  · {l}
                </span>
              ))}
            </span>
          </label>

          {error && <ErrorLine text={error} />}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className={btn}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {picked ? `${won(picked.price)} 입금했어요 — 예약하기` : "예약하기"}
            </button>
            <span className="text-[12px] text-ink-500">
              입금 전에 궁금한 점은{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/-/g, "")}`} className="font-semibold underline">
                {CONTACT_PHONE}
              </a>
            </span>
          </div>
        </form>
      )}
    </section>
  );
}
