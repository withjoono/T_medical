"use client";

import Link from "next/link";
import { ClipboardList, ExternalLink, Phone, PlayCircle, Plus, Sparkles, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_PHONE, TEACHER_APP_URL, assignmentUrl, kstDateTime } from "./config";
import type { InterviewTodo } from "./hooks";
import { NowCard, btn, btnJade, btnLine } from "./ui";

/**
 * 「지금 할 일」 카드 한 장 + 휴대폰 화면 아래 고정 버튼 하나 (수시앱 todo.tsx 를 옮긴 것)
 *   로그인 전 → 지원 대학 담기 / 로그인 · 수업 없음 → AI 면접 · 수업 안내 / 과제 → 과제 하러 가기
 *   수업 학생 → 다음 수업 · 줌 / 선생님 → 선생님앱
 * 과제는 공용 AI 면접 앱(tinterview.kr)에서 한다 — config.ts assignmentUrl.
 */

/** 「내 지원 대학」 대학 찾기 칸으로 */
export function focusUnivSearch() {
  const el = document.getElementById("medi-univ-search") as HTMLInputElement | null;
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus({ preventScroll: true });
}

const assignmentTitle = (a: { essay?: { university: string | null } | null; title: string | null; questions: string[] }) =>
  a.essay?.university ?? a.title ?? `${a.questions.length}문항`;

export function TodoCard({ todo }: { todo: InterviewTodo }) {
  switch (todo.kind) {
    case "loading":
      return <div className="h-[150px] animate-pulse bg-paper-200" aria-hidden />;
    case "anon":
      return (
        <NowCard eyebrow="2027 수시 면접" title="지원 대학 면접, 한곳에서 챙기세요" desc="지원 대학을 담으면 1차 발표일·면접일을 날짜 순으로 보여 드려요. 로그인하면 선생님 과제와 수업 일정도 여기에 모입니다.">
          <button type="button" onClick={focusUnivSearch} className={btn}>
            <Plus className="h-4 w-4" /> 지원 대학 담기
          </button>
        </NowCard>
      );
    case "teacher":
      return (
        <NowCard eyebrow="선생님" title="학생 목록과 제출된 과제는 선생님앱에서" desc="학생 초대 링크, 과제 내기, 학생이 낸 답변과 AI 평가를 선생님앱 「면접」에서 봅니다.">
          <a href={TEACHER_APP_URL} target="_blank" rel="noreferrer" className={btn}>
            <ExternalLink className="h-4 w-4" /> 선생님앱 열기
          </a>
        </NowCard>
      );
    case "assignment": {
      const a = todo.a;
      const meta = [a.essay ? "제시문" : null, assignmentTitle(a), todo.due ? `마감 ${todo.due}` : null].filter(Boolean).join(" · ");
      return (
        <NowCard tone="brass" eyebrow={todo.count > 1 ? `지금 할 일 · 과제 ${todo.count}개` : "지금 할 일"} title={`${a.teacherName} 선생님 과제가 왔어요`} desc={meta}>
          <a href={assignmentUrl(a.id, todo.code)} className={btn}>
            <PlayCircle className="h-4 w-4" /> 과제 하러 가기
          </a>
        </NowCard>
      );
    }
    case "class": {
      const { next } = todo;
      return next ? (
        <NowCard
          eyebrow={`다음 수업 · ${todo.nextNo}회차${todo.total ? `/${todo.total}` : ""}`}
          title={kstDateTime(next.startsAt)}
          desc={`${next.teacherName} 선생님 · ${next.minutes}분${next.zoomUrl ? "" : " · 줌 링크는 선생님이 곧 넣어 줘요"}`}
        >
          {next.zoomUrl && (
            <a href={next.zoomUrl} target="_blank" rel="noreferrer" className={btnJade}>
              <Video className="h-4 w-4" /> 수업 들어가기
            </a>
          )}
          <Link href="/interview/ai" className={next.zoomUrl ? btnLine : btn}>
            <Sparkles className="h-4 w-4" /> AI로 자유 연습
          </Link>
        </NowCard>
      ) : (
        <NowCard
          eyebrow="수업 학생 · AI 면접 무제한"
          title={todo.teacherName ? `${todo.teacherName} 선생님이 과제를 내면 여기에 떠요` : "담당 선생님을 정하고 있어요"}
          desc="수업 일정·줌 링크도 선생님이 정하면 여기에 보여요. 그동안 AI 면접으로 자유롭게 연습하세요."
        >
          <Link href="/interview/ai" className={btn}>
            <Sparkles className="h-4 w-4" /> AI로 자유 연습
          </Link>
        </NowCard>
      );
    }
    case "free":
      return (
        <NowCard eyebrow="AI 면접" title="지원 대학 기출로 AI 면접부터" desc="학과·대학·전형을 고르면 그 대학이 공개한 기출로 연습합니다. 영상은 서버로 보내지 않고 이 기기에서 분석해요.">
          <Link href="/interview/ai" className={btnJade}>
            <Video className="h-4 w-4" /> AI 면접 시작
          </Link>
          <Link href="/interview/class" className={btnLine}>
            면접 수업 알아보기
          </Link>
        </NowCard>
      );
  }
}

/** 휴대폰 화면 아래 고정 버튼 하나 — 상태에 따라 「과제 하러 가기」 / 「AI 면접 시작」 / 「수업 문의」 */
export function TodoBottomBar({ todo }: { todo: InterviewTodo }) {
  if (todo.kind === "loading" || todo.kind === "teacher") return null;
  const cls = "flex h-12 w-full items-center justify-center gap-2 text-[15px] font-semibold text-white shadow-lg";
  const button =
    todo.kind === "assignment" ? (
      <a href={assignmentUrl(todo.a.id, todo.code)} className={cn(cls, "bg-ink-900")}>
        <ClipboardList className="h-5 w-5" /> 과제 하러 가기
      </a>
    ) : todo.kind === "anon" ? (
      <a href={`tel:${CONTACT_PHONE.replace(/-/g, "")}`} className={cn(cls, "bg-ink-900")}>
        <Phone className="h-5 w-5" /> 수업 문의
      </a>
    ) : (
      <Link href="/interview/ai" className={cn(cls, "bg-jade-700")}>
        <Video className="h-5 w-5" /> AI 면접 시작
      </Link>
    );
  return (
    <>
      {/* 고정 버튼에 가려지는 맨 아래 내용만큼 자리를 비운다 */}
      <div className="h-16 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hair bg-paper/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-md">{button}</div>
      </div>
    </>
  );
}
