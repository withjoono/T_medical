"use client";

import { useState } from "react";
import { ArrowRight, Check, ClipboardCopy, EyeOff, Flag, Loader2, NotebookPen } from "lucide-react";
import type { RubricItem, RubricStatus } from "@/lib/interview-sim-api";
import {
  compare,
  gaps,
  hasReviewCard,
  movedUp,
  SELF_MARKS,
  selfLabel,
  type ClassTask,
  type RoomReview,
  type SelfMark,
} from "@/lib/sim-review";

/** MMI 실전 모의면접 — 복기 카드 · 질문 없는 방 · 지난 수업 과제의 화면 조각 (_mmi-sim.tsx 가 쓴다).
 *  저장·비교 규칙은 lib/sim-review.ts. 여기서는 점수를 만들지 않고, 학생의 판단과 점검 결과를 나란히 놓기만 한다. */

const INPUT = "w-full border border-hair-strong bg-white px-3 py-2.5 text-[14px] leading-relaxed text-ink-900 focus:border-jade-600 focus:outline-none";

// ===================================================================== 질문 없는 방

/** 면접실 첫 단계 — 면접관 질문을 가려 두고, 쟁점과 예상 질문을 먼저 말하게 한다 */
export function PredictPanel() {
  return (
    <div className="mt-6 border border-brass-400 bg-brass-50 px-5 py-4">
      <p className="flex items-center gap-2 text-[14px] font-semibold text-ink-900">
        <EyeOff className="h-4 w-4 text-brass-600" strokeWidth={1.75} /> 질문 없는 방 — 면접관 질문은 아직 가려 두었습니다
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-700">
        제시문을 읽고 먼저 말해 보세요. <b className="font-semibold text-ink-900">① 이 글에서 무엇과 무엇이 부딪히는지(쟁점)</b>{" "}
        <b className="font-semibold text-ink-900">② 면접관이 물을 것 같은 질문 두 가지.</b> 30~40초면 충분합니다. 시간은 이미 흐르고 있습니다.
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-500">예상한 내용은 채점하지 않습니다. 결과 화면에서 면접관이 실제로 한 질문과 나란히 보여 드립니다.</p>
    </div>
  );
}

/** 형식 카드의 선택 칸 */
export function PredictToggle({ on, questionless, onChange }: { on: boolean; questionless: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mt-4 flex cursor-pointer gap-3 border border-hair px-4 py-3 text-[13px] leading-relaxed text-ink-700 hover:border-jade-600">
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#1f6f5c]" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <b className="font-semibold text-ink-900">질문 없는 방으로 시작</b> — 면접관 질문을 가려 두고, 제시문에서 쟁점과 예상 질문을 먼저 말한 뒤 질문을 받습니다.{" "}
        <span className="text-ink-500">{questionless ? "실전과 연습 모두에 적용됩니다." : "연습에만 적용됩니다. 실전은 대학 형식 그대로 진행합니다."}</span>
      </span>
    </label>
  );
}

// ===================================================================== 복기 카드

export type ReviewDraft = { hardest: string | null; conclusion: string; redo: string; self: Record<string, SelfMark> };
export const emptyDraft = (): ReviewDraft => ({ hardest: null, conclusion: "", redo: "", self: {} });

/** 방을 마친 직후, 점검 결과를 보기 전에 쓰는 카드. 점검(서버)이 도는 동안 띄운다 */
export function ReviewCard({
  roomLabel,
  questions,
  criteria,
  pending,
  real,
  draft,
  onDraft,
  onSave,
  onSkip,
  error,
}: {
  roomLabel: string;
  /** 면접관이 한 질문(첫 질문 + 꼬리질문) */
  questions: string[];
  /** 점검 기준 — 점검이 끝나야 온다 */
  criteria: { key: string; label: string }[] | null;
  pending: boolean;
  real: boolean;
  draft: ReviewDraft;
  onDraft: (d: ReviewDraft) => void;
  onSave: () => void;
  onSkip: () => void;
  error: string | null;
}) {
  const set = (p: Partial<ReviewDraft>) => onDraft({ ...draft, ...p });
  return (
    <div>
      <p className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-brass-600">
        <NotebookPen className="h-4 w-4" strokeWidth={1.75} /> {roomLabel} · 복기 카드
      </p>
      <h3 className="mt-2 text-[1.25rem] font-bold text-ink-900">점검 결과를 보기 전에, 방금 면접을 1분만 돌아보세요</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
        결과를 먼저 보면 내 판단이 흐려집니다. 여기 적은 것은 이 기기에만 저장되고, 선생님 수업에 가져갈 재료가 됩니다.
        {real ? " 점검 결과는 마지막 방까지 마친 뒤에 봅니다." : ""}
      </p>

      <fieldset className="mt-6">
        <legend className="text-[14px] font-semibold text-ink-900">1. 가장 막힌 질문 하나</legend>
        <div className="mt-3 space-y-2">
          {questions.map((q) => (
            <label key={q} className={`flex cursor-pointer gap-3 border px-4 py-3 text-[14px] leading-relaxed ${draft.hardest === q ? "border-jade-600 bg-jade-50 text-ink-900" : "border-hair text-ink-700 hover:border-jade-600"}`}>
              <input type="radio" name="hardest" className="mt-1 h-4 w-4 shrink-0 accent-[#1f6f5c]" checked={draft.hardest === q} onChange={() => set({ hardest: q })} />
              <span>{q}</span>
            </label>
          ))}
          <label className={`flex cursor-pointer gap-3 border px-4 py-3 text-[14px] ${draft.hardest === "" ? "border-jade-600 bg-jade-50 text-ink-900" : "border-hair text-ink-500 hover:border-jade-600"}`}>
            <input type="radio" name="hardest" className="mt-1 h-4 w-4 shrink-0 accent-[#1f6f5c]" checked={draft.hardest === ""} onChange={() => set({ hardest: "" })} />
            <span>막힌 질문은 없었다</span>
          </label>
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="text-[14px] font-semibold text-ink-900">2. 내 답의 결론을 한 줄로</span>
        <input type="text" maxLength={140} value={draft.conclusion} onChange={(e) => set({ conclusion: e.target.value })} placeholder="한 문장으로 적어 보세요" className={`mt-3 ${INPUT}`} />
      </label>

      <label className="mt-6 block">
        <span className="text-[14px] font-semibold text-ink-900">3. 다시 답한다면 바꿀 한 가지</span>
        <input type="text" maxLength={140} value={draft.redo} onChange={(e) => set({ redo: e.target.value })} placeholder="예: 결론을 먼저 말한다" className={`mt-3 ${INPUT}`} />
      </label>

      <div className="mt-6">
        <p className="text-[14px] font-semibold text-ink-900">4. 기준마다 — 해냈다고 생각하나요?</p>
        {criteria ? (
          <ul className="mt-3 divide-y divide-hair border border-hair">
            {criteria.map((c) => (
              <li key={c.key} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <span className="text-[14px] text-ink-900">{c.label}</span>
                <span className="flex gap-px bg-hair" role="radiogroup" aria-label={`${c.label} 내 판단`}>
                  {SELF_MARKS.map((m) => {
                    const on = draft.self[c.key] === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => set({ self: { ...draft.self, [c.key]: m.key } })}
                        className={`px-3 py-2 text-[13px] font-semibold ${on ? "bg-ink-900 text-white" : "bg-white text-ink-600 hover:bg-jade-50"}`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 flex items-center gap-2 border border-hair px-4 py-3 text-[13px] text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin" /> 점검 기준을 불러오고 있어요. 위 세 가지를 먼저 적어 주세요.
          </p>
        )}
      </div>

      <p className="mt-6 flex items-center gap-2 text-[13px] text-ink-500" aria-live="polite">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-jade-700" /> 답변을 기준표로 점검하고 있어요. 10~30초쯤 걸립니다.
          </>
        ) : (
          <>
            <Check className="h-4 w-4 text-jade-700" /> 점검이 끝났습니다.
          </>
        )}
      </p>
      {error && <p className="mt-3 border-l-2 border-[#c65327] bg-[#fbf1e8] px-3 py-2 text-[13px] text-[#b9471b]">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={onSave}
          className="inline-flex items-center gap-2 bg-jade-700 px-5 py-3 text-[15px] font-semibold text-white hover:bg-jade-600 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400"
        >
          저장하고 계속 <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" disabled={pending} onClick={onSkip} className="text-[13px] text-ink-500 underline underline-offset-2 disabled:text-ink-300">
          복기 없이 넘어가기
        </button>
      </div>
    </div>
  );
}

// ===================================================================== 결과 화면 — 복기와 점검을 나란히

/** 기준 줄 옆에 붙는 '내 판단' */
export function SelfTag({ self, status }: { self?: SelfMark; status: RubricStatus }) {
  if (!self) return null;
  const off = status !== "보류" && ((self === "did" && status !== "충족") || (self === "missed" && status === "충족"));
  return (
    <span className={`inline-flex shrink-0 items-center border px-2 py-0.5 text-[12px] ${off ? "border-[#e8b89c] bg-[#fbf1e8] font-semibold text-[#b9471b]" : "border-hair text-ink-500"}`}>
      내 판단 · {selfLabel(self)}
      {off ? " — 점검과 다름" : ""}
    </span>
  );
}

/** 방마다 — 내가 쓴 복기, 내 판단과 점검이 엇갈린 곳, 예상한 질문과 실제 질문 */
export function ReviewBlock({ review, items, questions }: { review: RoomReview | null; items: RubricItem[] | undefined; questions: string[] }) {
  if (!review) return null;
  const g = gaps(review, items);
  const over = g.filter((x) => x.kind === "over");
  const under = g.filter((x) => x.kind === "under");
  return (
    <div className="border-b border-hair bg-white px-5 py-4">
      {hasReviewCard(review) && (
        <>
          <p className="flex items-center gap-2 text-[12px] font-semibold text-brass-600">
            <NotebookPen className="h-3.5 w-3.5" strokeWidth={1.75} /> 내 복기 — 점검 결과를 보기 전에 쓴 것
          </p>
          <dl className="mt-3 grid gap-x-4 gap-y-2 text-[13px] leading-relaxed sm:grid-cols-[108px_1fr]">
            <dt className="font-semibold text-ink-600">가장 막힌 질문</dt>
            <dd className="text-ink-800">{review.hardest ? review.hardest : review.hardest === "" ? "없었다" : "적지 않음"}</dd>
            {review.conclusion && (
              <>
                <dt className="font-semibold text-ink-600">내 답의 결론</dt>
                <dd className="text-ink-800">{review.conclusion}</dd>
              </>
            )}
            {review.redo && (
              <>
                <dt className="font-semibold text-ink-600">다시 답한다면</dt>
                <dd className="text-ink-800">{review.redo}</dd>
              </>
            )}
          </dl>
          {over.length > 0 && (
            <p className="mt-3 border-l-2 border-[#c65327] bg-[#fbf1e8] px-3 py-2 text-[13px] leading-relaxed text-ink-800">
              <b className="font-semibold text-[#b9471b]">해냈다고 봤는데 점검은 달랐던 기준</b> — {over.map((x) => `${x.label}(점검 ‘${x.status}’)`).join(" · ")}. 수업에서 가장 먼저 볼 곳입니다.
            </p>
          )}
          {under.length > 0 && (
            <p className="mt-2 border-l-2 border-jade-600 bg-jade-50 px-3 py-2 text-[13px] leading-relaxed text-ink-800">
              <b className="font-semibold text-jade-700">못 했다고 봤는데 점검은 충족이던 기준</b> — {under.map((x) => x.label).join(" · ")}.
            </p>
          )}
        </>
      )}
      {review.prediction && (
        <div className={hasReviewCard(review) ? "mt-4 border-t border-hair pt-4" : ""}>
          <p className="flex items-center gap-2 text-[12px] font-semibold text-brass-600">
            <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} /> 질문 없는 방 — 예상한 것과 실제 질문
          </p>
          <div className="mt-3 grid gap-4 text-[13px] leading-relaxed sm:grid-cols-2">
            <div>
              <p className="font-semibold text-ink-600">질문을 보기 전에 내가 말한 것</p>
              <p className="mt-1.5 text-ink-800">{review.prediction}</p>
            </div>
            <div>
              <p className="font-semibold text-ink-600">면접관이 실제로 물은 것</p>
              <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-ink-800">
                {questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
          </div>
          <p className="mt-2 text-[12px] text-ink-400">맞혔는지는 채점하지 않습니다. 빗나간 질문이 있다면 제시문의 어느 대목을 지나쳤는지 수업에서 함께 봅니다.</p>
        </div>
      )}
    </div>
  );
}

/** 선생님께 보낼 요약을 클립보드에 복사 */
export function CopySummary({ text }: { text: () => string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  const copy = async () => {
    const t = text();
    try {
      await navigator.clipboard.writeText(t);
      setState("done");
    } catch {
      // 클립보드 권한이 없으면 예전 방식으로 한 번 더
      try {
        const ta = document.createElement("textarea");
        ta.value = t;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        setState(ok ? "done" : "fail");
      } catch {
        setState("fail");
      }
    }
    window.setTimeout(() => setState("idle"), 4000);
  };
  return (
    <div className="mt-8 border border-hair bg-paper-50 px-5 py-4">
      <p className="text-[14px] font-semibold text-ink-900">수업 전에 선생님께 보내 두세요</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
        복기 카드와 질문 예상은 이 기기에만 저장됩니다. 요약을 복사해 선생님께 보내 두면, 선생님이 어디부터 볼지 정하고 수업에 들어옵니다. 답변 원문은 넣지 않습니다.
      </p>
      <button type="button" onClick={copy} className="mt-3 inline-flex items-center gap-2 border border-ink-900 px-4 py-2.5 text-[13px] font-semibold text-ink-900 hover:bg-ink-900 hover:text-white">
        <ClipboardCopy className="h-4 w-4" /> 복기 요약 복사
      </button>
      <span className="ml-3 text-[13px] text-ink-500" aria-live="polite">
        {state === "done" ? "복사했습니다." : state === "fail" ? "복사하지 못했어요. 브라우저의 복사 권한을 확인해 주세요." : ""}
      </span>
    </div>
  );
}

// ===================================================================== 지난 수업 과제

/** 결과 화면 방마다 — 수업에서 선생님이 짚은 문항으로 표시한다 */
export function TaskMarker({ task, onAdd, onRemove }: { task: ClassTask | null; onAdd: (note: string) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  if (task)
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hair bg-jade-50 px-5 py-3 text-[13px] text-ink-800">
        <Flag className="h-4 w-4 shrink-0 text-jade-700" strokeWidth={1.75} />
        <span className="min-w-0 flex-1">
          <b className="font-semibold">지난 수업 과제로 정했습니다.</b> 다음 모의면접은 이 문항을 다시 답하는 것으로 시작합니다.
          {task.note ? ` 선생님 말씀: “${task.note}”` : ""}
        </span>
        <button type="button" onClick={onRemove} className="text-[12px] text-ink-500 underline underline-offset-2">
          취소
        </button>
      </div>
    );
  if (!open)
    return (
      <div className="border-t border-hair px-5 py-3">
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-700 hover:text-jade-700">
          <Flag className="h-4 w-4" strokeWidth={1.75} /> 수업에서 선생님이 짚은 문항이에요
        </button>
      </div>
    );
  return (
    <div className="border-t border-hair bg-paper-50 px-5 py-4">
      <label className="block">
        <span className="text-[13px] font-semibold text-ink-900">선생님이 해 주신 말 한 줄</span>
        <input type="text" maxLength={140} value={note} onChange={(e) => setNote(e.target.value)} placeholder="수업에서 들은 그대로 적어 두세요" className={`mt-2 ${INPUT}`} />
      </label>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-500">저장하면 다음 모의면접이 이 문항을 다시 답하는 것으로 시작하고, 이번 점검 결과와 나란히 보여 드립니다.</p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            onAdd(note.trim());
            setOpen(false);
            setNote("");
          }}
          className="bg-ink-900 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-ink-800"
        >
          과제로 저장
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-[13px] text-ink-500 underline underline-offset-2">
          닫기
        </button>
      </div>
    </div>
  );
}

const weakOf = (t: ClassTask) => t.before.filter((b) => b.status === "약함" || b.status === "없음");

/** 첫 화면 — 끝내지 않은 과제 */
export function TaskCards({
  tasks,
  busy,
  skip,
  onStart,
  onFinish,
  onSkip,
}: {
  tasks: ClassTask[];
  busy: boolean;
  /** 이번에는 과제를 건너뛰고 바로 시작 */
  skip: boolean;
  onStart: (t: ClassTask) => void;
  onFinish: (t: ClassTask) => void;
  onSkip: (v: boolean) => void;
}) {
  if (!tasks.length) return null;
  const fresh = tasks.some((t) => t.attempts.length === 0);
  return (
    <div className="mb-6 border-2 border-jade-700/60">
      <div className="border-b border-hair bg-jade-50 px-5 py-4 sm:px-6">
        <p className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-jade-700">
          <Flag className="h-4 w-4" strokeWidth={1.75} /> 지난 수업 과제
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-700">
          수업에서 선생님이 짚은 문항입니다. 새 모의면접을 시작하기 전에 이 문항부터 다시 답합니다. 달라졌는지는 지난 점검과 나란히 보여 드리고, 고쳐졌는지는 다음 수업에서 선생님이 확인합니다.
        </p>
      </div>
      <ul className="divide-y divide-hair">
        {tasks.map((t) => {
          const weak = weakOf(t);
          const last = t.attempts[t.attempts.length - 1];
          const moved = last ? movedUp(compare(t.before, last.statuses)) : null;
          return (
            <li key={t.id} className="px-5 py-4 sm:px-6">
              <p className="text-[12px] font-semibold text-ink-400">{t.roomLabel}</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900">{t.promptTitle}</p>
              {t.note && <p className="mt-2 border-l-2 border-brass-400 pl-3 text-[13px] leading-relaxed text-ink-700">선생님 말씀 — “{t.note}”</p>}
              {weak.length > 0 && <p className="mt-2 text-[13px] text-ink-600">지난 점검: {weak.map((w) => `${w.label} ${w.status}`).join(" · ")}</p>}
              {moved && (
                <p className="mt-1 text-[13px] text-ink-600">
                  다시 답한 횟수 {t.attempts.length}회
                  {moved.weakBefore > 0 ? ` · 최근에는 약함·없음 ${moved.weakBefore}개 중 ${moved.nowMet}개가 충족` : ""}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" disabled={busy} onClick={() => onStart(t)} className="inline-flex items-center gap-2 bg-jade-700 px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-jade-600 disabled:opacity-60">
                  {t.attempts.length ? "한 번 더 답하기" : "이 문항부터 다시 답하기"} <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onFinish(t)} className="text-[13px] text-ink-500 underline underline-offset-2">
                  과제 끝내기
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {fresh && (
        <label className="flex cursor-pointer items-center gap-2 border-t border-hair px-5 py-3 text-[12px] text-ink-500 sm:px-6">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#1f6f5c]" checked={skip} onChange={(e) => onSkip(e.target.checked)} />
          이번에는 과제를 건너뛰고 바로 시작하기
        </label>
      )}
      <p className="border-t border-hair px-5 py-3 text-[12px] text-ink-400 sm:px-6">과제를 다시 답하는 것도 하루 이용 횟수에 포함됩니다. 과제는 이 기기에만 저장됩니다.</p>
    </div>
  );
}

const STATUS_CLS: Record<string, string> = {
  충족: "text-jade-700",
  약함: "text-brass-600",
  없음: "text-[#b9471b]",
  보류: "text-ink-400",
};

/** 과제 문항을 다시 답한 결과 — 지난번과 이번을 나란히 */
export function TaskCompare({ task, items, onFinish }: { task: ClassTask; items: RubricItem[] | undefined; onFinish: () => void }) {
  const rows = compare(task.before, (items ?? []).map(({ key, label, status }) => ({ key, label, status })));
  const m = movedUp(rows);
  return (
    <div className="mt-6 border-2 border-jade-700/60">
      <div className="border-b border-hair bg-jade-50 px-5 py-4">
        <p className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-jade-700">
          <Flag className="h-4 w-4" strokeWidth={1.75} /> 지난 수업 과제 — 다시 답한 결과
        </p>
        {task.note && <p className="mt-2 text-[14px] leading-relaxed text-ink-800">선생님 말씀 — “{task.note}”</p>}
        {m.weakBefore > 0 && (
          <p className="mt-2 text-[14px] font-semibold text-ink-900">
            지난번 약함·없음이던 기준 {m.weakBefore}개 중 {m.nowMet}개가 이번에 충족으로 바뀌었습니다.
          </p>
        )}
      </div>
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-hair text-ink-500">
            <th className="px-5 py-2.5 font-semibold">기준</th>
            <th className="px-3 py-2.5 font-semibold">지난번</th>
            <th className="px-3 py-2.5 font-semibold">이번</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hair">
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="px-5 py-2.5 text-ink-900">{r.label}</td>
              <td className={`px-3 py-2.5 font-semibold ${STATUS_CLS[r.before ?? ""] ?? "text-ink-300"}`}>{r.before ?? "—"}</td>
              <td className={`px-3 py-2.5 font-semibold ${STATUS_CLS[r.after ?? ""] ?? "text-ink-300"}`}>{r.after ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-3 border-t border-hair px-5 py-3">
        <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-ink-500">점검 결과가 달라졌는지만 보여 드립니다. 고쳐졌는지는 다음 수업에서 선생님이 확인합니다.</p>
        {!task.doneAt && (
          <button type="button" onClick={onFinish} className="border border-hair-strong px-3 py-2 text-[13px] font-semibold text-ink-700 hover:border-ink-900">
            과제 끝내기
          </button>
        )}
      </div>
    </div>
  );
}
