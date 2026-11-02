"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { INTERVIEW_MENU } from "./config";

/**
 * 면접 메뉴 4칸 — 「내 면접 · 대학별 면접 · AI 면접 · 면접 수업」(수시앱 interview-header 와 같은 순서).
 * app/interview/layout.tsx 가 /interview 아래 모든 페이지에 한 번 씌운다. 휴대폰은 한 줄 4칸.
 * 대학별 면접은 /interview(계열 고르기)와 계열·대학·유형 페이지 전부를 덮는다.
 */
function activeKey(path: string): (typeof INTERVIEW_MENU)[number]["key"] {
  if (path.startsWith("/interview/me")) return "me";
  if (path.startsWith("/interview/ai")) return "ai";
  if (path.startsWith("/interview/class")) return "class";
  return "univ";
}

export function InterviewMenu() {
  const path = usePathname() ?? "";
  const on = activeKey(path);
  return (
    <nav aria-label="면접 메뉴" className="border-b border-hair bg-paper">
      <ul className="mx-auto grid max-w-5xl grid-cols-4 sm:flex sm:gap-1 sm:px-6">
        {INTERVIEW_MENU.map((m) => (
          <li key={m.key} className="sm:flex-none">
            <Link
              href={m.href}
              aria-current={m.key === on ? "page" : undefined}
              className={cn(
                "flex h-11 items-center justify-center border-b-2 px-2 text-[13.5px] font-semibold transition-colors sm:px-4 sm:text-[14px]",
                m.key === on ? "border-jade-700 text-jade-700" : "border-transparent text-ink-600 hover:text-ink-900",
              )}
            >
              {m.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
