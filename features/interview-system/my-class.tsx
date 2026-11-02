"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, Check, ClipboardList, KeyRound, PlayCircle, Plus, Trash2, UserCheck, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { KEYS, bookingLabel, interviewApi, type ClassSession } from "./api";
import { ClassBookingPanel } from "./booking";
import { ClassCodeForm, ClassTeachers } from "./class-connect";
import { CONTACT_PHONE, assignmentUrl, dueLabel, kstDateTime, won } from "./config";
import { invalidate, useBookedStudent, useMediAuth, useRemote } from "./hooks";
import type { InterviewCatalog } from "./types";
import { ErrorLine, Panel, Spinner, btnLine } from "./ui";

/**
 * 내 수업 — 「내 면접」(/interview/me) 안의 수업 · 받은 과제 · 보낸 결과 (수시앱 my-class.tsx 를 옮긴 것)
 *
 *  학생이 할 일은 「초대 링크 열기 → 과제 링크로 면접 보기 → 제출」 세 번뿐이다.
 *  과제 면접은 공용 AI 면접 앱(tinterview.kr)에서 하고 결과는 그 앱이 선생님께 보낸다 — 여기서는 목록과 링크만.
 *  학생부 업로드·사전 질문지는 두지 않는다(T메디 수업은 MMI·제시문형이 주, AI 는 학생부로 문제를 만들지 않는다).
 *  예약·연결이 없으면 intro(수업 안내)를 보인다.
 */

export function MyClassSection({ catalog, intro }: { catalog: InterviewCatalog; intro: React.ReactNode }) {
  const { logged } = useMediAuth();
  const me = useBookedStudent();
  const [pickId, setPickId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const teachersQ = useRemote(KEYS.teachers, interviewApi.teachers, logged);
  const assignQ = useRemote(KEYS.assignments, interviewApi.assignments, logged);
  const setsQ = useRemote(KEYS.sets, interviewApi.sets, logged);
  const sessionsQ = useRemote(KEYS.sessions, interviewApi.sessions, logged && me.booked);

  if (me.loading || (logged && (teachersQ.pending || assignQ.pending))) return <Spinner text="내 수업을 불러오는 중…" />;
  if (me.error && teachersQ.error) return <Panel><ErrorLine text={`수업 정보를 불러오지 못했어요. ${me.error.message}`} /></Panel>;

  const teachers = teachersQ.data ?? [];
  const allAssignments = assignQ.data ?? [];
  // 예약 없이 선생님 초대 링크(코드)로만 연결된 학생도 과제를 받으므로 같은 화면을 쓴다
  if (!me.booked && !teachers.length && !allAssignments.length) return <>{intro}</>;

  const b = me.bookings.find((x) => x.id === pickId) ?? me.booking;
  const teacherName = teachers[0]?.name ?? me.instructorName ?? null;
  // 고른 면접 것 + 면접을 정하지 않은 것
  const forThis = (x: { bookingId?: number | null }) => !b || x.bookingId == null || x.bookingId === b.id;
  const assignments = allAssignments.filter(forThis);
  const sets = setsQ.data ?? [];
  const codeOf = (id: string) => sets.find((s) => s.assignmentId === id)?.code ?? null;
  const dueOf = (id: string) => sets.find((s) => s.assignmentId === id)?.dueAt ?? null;
  const sortedAssignments = [...assignments].sort(
    (x, y) => Number(!!x.doneAt) - Number(!!y.doneAt) || (dueOf(x.id) ?? "9999").localeCompare(dueOf(y.id) ?? "9999") || x.createdAt.localeCompare(y.createdAt),
  );
  const sessions: ClassSession[] = (sessionsQ.data ?? []).filter(forThis);
  const linked = teachers.length > 0;

  return (
    <div className="space-y-4">
      {me.bookings.length > 1 && (
        <nav aria-label="내 면접 수업" className="flex flex-wrap gap-2">
          {me.bookings.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setPickId(x.id)}
              className={cn(
                "border px-3 py-1.5 text-[13px] font-semibold",
                x.id === b?.id ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-jade-600",
              )}
            >
              {bookingLabel(x)}
            </button>
          ))}
        </nav>
      )}

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-jade-50 text-jade-700">
              <UserCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-ink-900">
                {teacherName ? `${teacherName} 선생님` : "담당 선생님 배정 중"}
                {b ? ` · ${b.productNm.replace("면접 수업 · ", "")}` : ""}
              </p>
              <p className="truncate text-[13px] text-ink-500">{[b?.university, b?.trackName, b?.department].filter(Boolean).join(" · ") || "면접 수업"}</p>
            </div>
          </div>
          {b && (
            <span className={cn("px-2.5 py-0.5 text-[12px] font-semibold", b.status === "GRANTED" ? "bg-jade-100 text-jade-700" : "bg-brass-200 text-brass-600")}>
              {b.status === "GRANTED" ? "입금 확인됨" : "입금 확인 전"} · {won(b.amount)}
            </span>
          )}
        </div>
        {!linked && (
          <div className="mt-4 border-t border-dashed border-hair pt-4 text-[14px] text-ink-700">
            <p>
              입금을 확인하고 지원 대학에 맞는 선생님을 정하면, 선생님이 카톡으로 <b>초대 링크</b>를 보내 드려요. 링크를 열고 「연결하기」만 누르면 됩니다.
            </p>
            <button type="button" onClick={() => setShowCode(!showCode)} className="mt-2 text-[13px] font-semibold text-ink-500 underline-offset-2 hover:underline">
              <KeyRound className="mr-1 inline h-3.5 w-3.5" /> 링크 대신 코드를 받았어요
            </button>
            {showCode && <ClassCodeForm className="mt-2" />}
          </div>
        )}
      </Panel>

      {/* ① 수업 일정 */}
      <Panel title="수업 일정" icon={<CalendarClock className="h-4 w-4 text-jade-700" />}>
        {sessions.length ? (
          <ol className="divide-y divide-hair text-[14px]">
            {sessions.map((x, i) => (
              <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-ink-800">
                  <b>{i + 1}회차</b> {kstDateTime(x.startsAt)} · {x.minutes}분 <span className="text-[12px] text-ink-500">· {x.teacherName} 선생님</span>
                  {x.note && <span className="block text-[12px] text-ink-500">{x.note}</span>}
                </span>
                {x.doneAt ? (
                  <span className="flex items-center gap-0.5 text-[12px] font-semibold text-jade-700">
                    <Check className="h-3.5 w-3.5" /> 마침
                  </span>
                ) : x.zoomUrl ? (
                  <a href={x.zoomUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[13px] font-semibold text-jade-700 hover:underline">
                    <Video className="h-3.5 w-3.5" /> 줌 입장
                  </a>
                ) : (
                  <span className="text-[12px] text-ink-400">줌 링크 준비 중</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-[14px] text-ink-500">수업 일정·줌 링크는 선생님이 정하면 여기에 보여요.</p>
        )}
      </Panel>

      {/* ② 받은 과제 — 예상문제 세트(과제 링크)와 제시문·문항 지정 과제 */}
      <Panel title="받은 과제" icon={<ClipboardList className="h-4 w-4 text-brass-600" />}>
        {sortedAssignments.length ? (
          <ul className="divide-y divide-hair text-[14px]">
            {sortedAssignments.map((a) => {
              const due = dueLabel(dueOf(a.id));
              return (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="text-ink-800">
                    {a.essay && <span className="mr-1 bg-brass-200 px-1.5 py-0.5 text-[11px] font-semibold text-brass-600">제시문</span>}
                    {a.title || a.essay?.title || `${a.questions.length}문항`}{" "}
                    <span className="text-[12px] text-ink-500">
                      · {a.teacherName} 선생님 · {a.questions.length}문항{due ? ` · 마감 ${due}` : ""}
                    </span>
                  </span>
                  {a.doneAt ? (
                    <span className="text-[12px] font-semibold text-jade-700">제출함</span>
                  ) : (
                    <a href={assignmentUrl(a.id, codeOf(a.id))} className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-900 hover:underline">
                      <PlayCircle className="h-3.5 w-3.5" /> 과제 하러 가기
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[14px] text-ink-500">선생님이 과제를 내면 여기에 떠요. 과제 면접은 T면접(tinterview.kr)에서 같은 계정으로 봅니다.</p>
        )}
      </Panel>

      {/* ③ 보낸 결과 */}
      <SentResults />

      {linked && <ClassTeachers />}

      {me.booked &&
        (adding ? (
          <ClassBookingPanel catalog={catalog} adding />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-1.5 border-2 border-dashed border-jade-200 bg-white py-4 text-[14px] font-semibold text-jade-700 hover:bg-jade-50"
          >
            <Plus className="h-4 w-4" /> 다른 대학 · 다른 면접 추가 예약
          </button>
        ))}

      <p className="text-center text-[12px] text-ink-500">
        <Link href="/interview/class" className="font-semibold underline">
          수업 안내 · 환불 규칙
        </Link>{" "}
        · 문의{" "}
        <a href={`tel:${CONTACT_PHONE.replace(/-/g, "")}`} className="font-semibold underline">
          {CONTACT_PHONE}
        </a>
      </p>
    </div>
  );
}

/** 선생님께 보낸 AI 면접 결과 — 선생님이 처음 열면 7일, 안 열면 30일 뒤 자동 삭제. 학생이 지우면 바로 삭제 */
function SentResults() {
  const { logged } = useMediAuth();
  const q = useRemote(KEYS.results, interviewApi.results, logged);
  const [error, setError] = useState<string | null>(null);
  const list = q.data ?? [];
  return (
    <Panel title="보낸 결과" icon={<ClipboardList className="h-4 w-4 text-jade-700" />}>
      {list.length ? (
        <ul className="divide-y divide-hair text-[14px]">
          {list.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span className="text-ink-800">
                {r.teacherName} 선생님께 · 답변 {r.answerCount}개{r.videoCount ? ` · 영상 ${r.videoCount}개` : ""}
                <span className="block text-[12px] text-ink-500">
                  {new Date(r.createdAt).toLocaleDateString("ko-KR")} 보냄 · {r.viewedAt ? "선생님이 봤어요" : "아직 안 봤어요"} · {new Date(r.expiresAt).toLocaleDateString("ko-KR")} 자동 삭제
                </span>
              </span>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm("보내기를 취소할까요? 선생님 쪽에서도 바로 지워져요.")) return;
                  setError(null);
                  try {
                    await interviewApi.deleteResult(r.id);
                    invalidate(KEYS.results);
                  } catch (err) {
                    setError((err as Error).message);
                  }
                }}
                className={cn(btnLine, "h-8 px-2.5 text-[12px]")}
              >
                <Trash2 className="h-3.5 w-3.5" /> 보내기 취소
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[14px] text-ink-500">과제 면접을 마치면 답변 글과 AI 평가가 선생님께 가고, 여기에 남아요.</p>
      )}
      {error && <ErrorLine text={error} />}
    </Panel>
  );
}
