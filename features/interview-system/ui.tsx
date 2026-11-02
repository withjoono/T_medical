"use client";

import type { ReactNode } from "react";
import { Loader2, LogIn } from "lucide-react";
import { getLoginUrl } from "@/lib/auth";
import { cn } from "@/lib/utils";

/** 면접 시스템 화면의 공통 모양 — T메디 편집 스타일(각진 상자 · ink/jade/brass) */

export const btn =
  "inline-flex h-11 items-center justify-center gap-1.5 bg-ink-900 px-5 text-[14px] font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-50";
export const btnJade =
  "inline-flex h-11 items-center justify-center gap-1.5 bg-jade-700 px-5 text-[14px] font-semibold text-white transition-colors hover:bg-jade-600 disabled:opacity-50";
export const btnLine =
  "inline-flex h-11 items-center justify-center gap-1.5 border border-ink-200 bg-white px-4 text-[14px] font-semibold text-ink-800 transition-colors hover:border-jade-600";
export const input =
  "mt-1 w-full border border-ink-200 bg-white px-3 py-2 text-[14px] text-ink-900 outline-none focus:border-jade-600";

export function Panel({ title, icon, aside, children, className }: { title?: ReactNode; icon?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("border border-hair bg-white px-5 py-5 sm:px-6", className)}>
      {(title || aside) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && (
            <h2 className="flex items-center gap-1.5 text-[15px] font-semibold text-ink-900">
              {icon}
              {title}
            </h2>
          )}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

/** 「지금 할 일」 카드 — 상태별 한 장 */
export function NowCard({
  eyebrow,
  title,
  desc,
  tone = "jade",
  children,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  tone?: "jade" | "brass";
  children?: ReactNode;
}) {
  return (
    <section
      aria-label="지금 할 일"
      className={cn("border-2 px-5 py-5 sm:px-6", tone === "brass" ? "border-brass-300 bg-brass-50" : "border-jade-200 bg-jade-50")}
    >
      <p className={cn("text-[12px] font-semibold tracking-wide", tone === "brass" ? "text-brass-600" : "text-jade-700")}>{eyebrow}</p>
      <h2 className="display mt-1 text-[1.3rem] leading-snug text-ink-900 sm:text-[1.45rem]">{title}</h2>
      {desc && <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{desc}</p>}
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </section>
  );
}

export function Spinner({ text }: { text: string }) {
  return (
    <p className="flex items-center justify-center gap-2 py-10 text-[14px] text-ink-500">
      <Loader2 className="h-4 w-4 animate-spin" /> {text}
    </p>
  );
}

export function ErrorLine({ text }: { text: string }) {
  return <p className="text-[13px] font-semibold text-red-700">{text}</p>;
}

/** 로그인 버튼 — 로그인 뒤 지금 주소(쿼리 포함)로 돌아온다 */
export function LoginButton({ label = "로그인", className }: { label?: string; className?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = getLoginUrl(window.location.pathname + window.location.search);
      }}
      className={cn(btn, className)}
    >
      <LogIn className="h-4 w-4" /> {label}
    </a>
  );
}
