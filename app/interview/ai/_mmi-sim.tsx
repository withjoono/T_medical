"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Clock,
  Keyboard,
  Loader2,
  LogIn,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Trash2,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";
import { getLoginUrl } from "@/lib/auth";
import { useAuth } from "@/lib/use-auth";
import {
  loadConsent,
  saveConsent,
  SimApiError,
  simApi,
  type RubricItem,
  type SimConfig,
  type SimFormat,
  type SimListItem,
  type SimSession,
  type SimTurn,
  type SpeechStats,
} from "@/lib/interview-sim-api";
import { speakKo, stopSpeaking, useSpeechTranscript } from "@/lib/use-speech-transcript";
import {
  addTask,
  finishTask,
  forgetAll,
  forgetSession,
  getReview,
  hasAnyReview,
  interviewerQuestions,
  isQuestionless,
  patchReview,
  pendingTasks,
  predictFor,
  predictPref,
  recordAttempt,
  removeTask,
  sessionOpts,
  setPredictPref,
  setSessionOpts,
  snap,
  summaryText,
  taskById,
  taskFor,
  type ClassTask,
  type ReviewBase,
  type SelfMark,
} from "@/lib/sim-review";
import {
  CopySummary,
  emptyDraft,
  PredictPanel,
  PredictToggle,
  ReviewBlock,
  ReviewCard,
  SelfTag,
  TaskCards,
  TaskCompare,
  TaskMarker,
  type ReviewDraft,
} from "./_mmi-review";

/** MMI 실전 모의면접 — 대학 형식 그대로 방을 돌고, AI 면접관의 꼬리질문에 답한 뒤 기준표 피드백을 받는다.
 *  서버: 면접 공용 엔진(/interview-sim). 답변은 글(받아쓰기)만 보낸다.
 *
 *  한 번의 모의면접은 응시 → 복기 → (수업) → 다시 답하기 한 묶음이다 (2026-11-19, lib/sim-review.ts · _mmi-review.tsx):
 *   · 질문 없는 방 — 면접관 질문을 가려 두고 쟁점·예상 질문을 먼저 말한다(서울대 형식은 기본, 다른 대학은 연습에서 선택)
 *   · 복기 카드 — 방을 마친 직후, 점검 결과를 보기 전에 쓴다. 결과 화면에서 내 판단과 점검을 나란히 놓는다
 *   · 지난 수업 과제 — 수업에서 선생님이 짚은 문항을 표시해 두면 다음 모의면접이 그 문항을 다시 답하는 것으로 시작한다
 *  셋 다 이 브라우저에만 저장한다(서버에 받는 곳이 생기기 전까지). */

type Phase = "loading" | "login" | "error" | "disabled" | "consent" | "home" | "lobby" | "room" | "finishing" | "result";

const mmss = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const ROMAN = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ"];

export function MmiSim() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<SimConfig | null>(null);
  const [consent, setConsent] = useState<string[]>([]);
  const [history, setHistory] = useState<SimListItem[]>([]);
  const [session, setSession] = useState<SimSession | null>(null);
  const [roomIdx, setRoomIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  /** 이 브라우저에 둔 복기·과제(lib/sim-review.ts)를 바꾼 뒤 화면을 다시 그린다 */
  const [, setTick] = useState(0);
  const bump = () => setTick((n) => n + 1);
  /** 과제 때문에 미뤄 둔 회차 — 과제 결과 화면에서 이어서 시작한다 */
  const [afterTask, setAfterTask] = useState<{ formatId: string; mode: "real" | "practice" } | null>(null);
  const [skipTask, setSkipTask] = useState(false);

  const fail = useCallback((e: unknown) => {
    if (e instanceof SimApiError && e.status === 401) {
      setPhase("login");
      return;
    }
    setError(e instanceof Error ? e.message : "잠시 뒤 다시 시도해 주세요.");
  }, []);

  const refreshHistory = useCallback(() => {
    simApi.list().then(setHistory).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setPhase("login");
      return;
    }
    simApi
      .config()
      .then((c) => {
        setConfig(c);
        if (!c.enabled) return setPhase("disabled");
        const saved = loadConsent(c.consentVersion);
        if (saved && c.consentItems.every((i) => saved.includes(i.id))) {
          setConsent(saved);
          setPhase("home");
        } else setPhase("consent");
        refreshHistory();
      })
      .catch((e) => {
        if (e instanceof SimApiError && e.status === 401) return setPhase("login");
        setError(e instanceof Error ? e.message : "서버에 연결하지 못했어요.");
        setPhase("error");
      });
  }, [authLoading, isAuthenticated, refreshHistory]);

  const startSession = async (
    format: SimFormat,
    mode: "real" | "practice",
    opts: { promptId?: string; roomIdx?: number; /** 질문 없는 방 */ predict?: boolean; /** 지난 수업 과제를 다시 답하는 회차 */ taskId?: string } = {},
  ) => {
    if (!config) return;
    setBusy(true);
    setError(null);
    try {
      const { predict, taskId, ...serverOpts } = opts;
      const common = { formatId: format.id, mode, consentVersion: config.consentVersion, consentItems: consent };
      let s: SimSession;
      try {
        s = await simApi.start({ ...common, ...serverOpts });
      } catch (e) {
        // 과제 다시 답하기: 서버가 문항과 방 번호를 함께 받지 않으면 문항만으로 한 번 더 연다
        if (!(e instanceof SimApiError) || e.status !== 400 || serverOpts.roomIdx == null || !serverOpts.promptId) throw e;
        s = await simApi.start({ ...common, promptId: serverOpts.promptId });
      }
      setSessionOpts(s.id, { predict: !!predict, taskId });
      setSession(s);
      setRoomIdx(0);
      setPhase("lobby");
      window.scrollTo({ top: (document.getElementById("coach")?.offsetTop ?? 0) - 80, behavior: "smooth" });
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  /** 과제 문항 다시 답하기 — 연습 회차로 그 문항 하나만 연다(질문을 이미 아는 문항이라 질문 없는 방은 끈다) */
  const startTask = (task: ClassTask) => {
    const format = config?.formats.find((f) => f.id === task.formatId);
    if (!format) {
      setError("이 과제의 면접 형식이 지금은 열려 있지 않아요. 과제를 끝내거나 나중에 다시 시도해 주세요.");
      return;
    }
    return startSession(format, "practice", { promptId: task.promptId, ...(task.fromMode === "real" ? { roomIdx: task.fromRoomIdx } : {}), taskId: task.id });
  };

  /** 형식 카드의 시작 버튼 — 아직 한 번도 다시 답하지 않은 과제가 있으면 그 문항부터 */
  const begin = (format: SimFormat, mode: "real" | "practice") => {
    const task = skipTask ? undefined : pendingTasks().find((t) => t.formatId === format.id && t.attempts.length === 0);
    if (task) {
      setAfterTask({ formatId: format.id, mode });
      return startTask(task);
    }
    setAfterTask(null);
    return startSession(format, mode, { predict: predictFor(format.id, format.univ, mode, format.track) });
  };

  const openSession = async (id: string) => {
    setAfterTask(null);
    setBusy(true);
    setError(null);
    try {
      const s = await simApi.get(id);
      setSession(s);
      const next = s.rooms.findIndex((r) => !r.feedback);
      if (next === -1) setPhase("result");
      else {
        setRoomIdx(next);
        setPhase("lobby");
      }
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const onRoomFinished = async (updated: SimSession) => {
    setSession(updated);
    const next = updated.rooms.findIndex((r) => !r.feedback);
    if (next === -1) {
      setPhase("result");
      refreshHistory();
    } else {
      setRoomIdx(next);
      setPhase("lobby");
    }
  };

  // ------------------------------------------------------------------ 화면

  if (phase === "loading") return <Box><Spinner text="불러오는 중…" /></Box>;

  if (phase === "login")
    return (
      <Box>
        <div className="py-6 text-center">
          <p className="text-[15px] font-semibold text-ink-900">MMI 실전 모의면접은 로그인 후 쓸 수 있어요</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-500">답변 기록과 피드백을 내 계정에만 저장하기 위해서입니다. T스쿨 계정으로 로그인하세요.</p>
          <a
            href={typeof window !== "undefined" ? getLoginUrl("/interview/ai?mode=mmi") : "#"}
            className="mt-5 inline-flex items-center gap-2 bg-ink-900 px-5 py-3 text-[14px] font-semibold text-white hover:bg-ink-800"
          >
            <LogIn className="h-4 w-4" /> 로그인하고 시작하기
          </a>
        </div>
      </Box>
    );

  if (phase === "error") return <Box><ErrorLine text={error ?? "서버에 연결하지 못했어요."} /></Box>;

  if (phase === "disabled")
    return (
      <Box>
        <p className="py-6 text-center text-[14px] text-ink-600">MMI 실전 모의면접을 준비하고 있어요. 곧 열립니다.</p>
      </Box>
    );

  if (phase === "consent" && config)
    return (
      <Box>
        <Consent
          config={config}
          onAgree={(items) => {
            saveConsent(config.consentVersion, items);
            setConsent(items);
            setPhase("home");
          }}
        />
      </Box>
    );

  if (phase === "home" && config)
    return (
      <Box>
        {error && <ErrorLine text={error} />}
        <TaskCards
          tasks={pendingTasks()}
          busy={busy}
          skip={skipTask}
          onStart={(t) => {
            setAfterTask(null);
            startTask(t);
          }}
          onFinish={(t) => {
            finishTask(t.id);
            bump();
          }}
          onSkip={setSkipTask}
        />
        {config.formats.map((f) => (
          <FormatCard
            key={f.id}
            format={f}
            busy={busy}
            taskFirst={!skipTask && pendingTasks().some((t) => t.formatId === f.id && t.attempts.length === 0)}
            predict={predictPref(f.id, f.univ, f.track)}
            onPredict={(v) => {
              setPredictPref(f.id, v);
              bump();
            }}
            onReal={() => begin(f, "real")}
            onPractice={() => begin(f, "practice")}
          />
        ))}
        <History
          items={history}
          busy={busy}
          onOpen={openSession}
          onDelete={async (id) => {
            if (!window.confirm("이 기록을 지울까요? 이 기기에 적어 둔 복기와 과제도 함께 지워져요. 되돌릴 수 없어요.")) return;
            try {
              await simApi.remove(id);
              forgetSession(id);
            } catch (e) {
              fail(e);
            }
            refreshHistory();
          }}
          onDeleteAll={async () => {
            if (!window.confirm("모의면접 기록을 전부 지울까요? 이 기기에 적어 둔 복기와 과제도 함께 지워져요. 되돌릴 수 없어요.")) return;
            try {
              await simApi.removeAll();
              forgetAll();
            } catch (e) {
              fail(e);
            }
            refreshHistory();
          }}
        />
        <p className="mt-6 text-[12px] leading-relaxed text-ink-400">
          하루 {config.limits.sessionsPerDay}회까지 · 기록은 {config.retention.rule} · AI 모델: {config.provider.name}({config.provider.country}) — {config.provider.training}
        </p>
      </Box>
    );

  if (phase === "lobby" && session) {
    const room = session.rooms[roomIdx];
    const opts = sessionOpts(session.id);
    const lobbyTask = taskById(opts.taskId);
    return (
      <Box>
        <p className="text-[12px] font-semibold tracking-wide text-brass-600">
          {session.format?.univ} · {lobbyTask ? "지난 수업 과제 — 다시 답하기" : session.mode === "real" ? `실전 ${roomIdx + 1}/${session.rooms.length}` : "연습"}
        </p>
        <h3 className="mt-2 text-[1.25rem] font-bold text-ink-900">{room.label} 입실 전</h3>
        {lobbyTask && (
          <p className="mt-3 border-l-2 border-brass-400 bg-brass-50 px-3 py-2 text-[13px] leading-relaxed text-ink-800">
            수업에서 선생님이 짚은 문항입니다. {lobbyTask.note ? `선생님 말씀 — “${lobbyTask.note}”` : "수업에서 들은 것을 떠올리고 다시 답해 보세요."}
          </p>
        )}
        <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-ink-600">
          <li>· {room.prepSec ? `준비 ${mmss(room.prepSec)} 뒤` : "준비 시간 없이"} 면접실 안에서 제시문을 읽고 <b className="text-ink-900">{Math.round(room.answerSec / 60)}분</b> 동안 답합니다. 읽는 시간도 포함입니다.</li>
          <li>· 면접관이 첫 질문을 하고, 답이 끝나면 꼬리질문을 최대 {room.followUpsLeft}번 합니다.</li>
          <li>· 시간이 끝나면 자동으로 면접실을 마칩니다. 실전처럼 되돌아갈 수 없습니다.</li>
          {opts.predict && room.turns.length === 0 && (
            <li>
              · <b className="text-ink-900">{isQuestionless(session.format?.univ ?? "", session.format?.track ?? "") ? "질문 없는 방" : "질문 먼저 짐작하기"}</b>입니다. 면접관 질문은 가려 둡니다. 제시문을 읽고 쟁점과 예상 질문을 먼저 말한 뒤 질문을 받습니다.
            </li>
          )}
          <li>· 방을 마치면 점검 결과를 보기 전에 1분짜리 복기 카드를 씁니다.</li>
        </ul>
        {room.prompt?.draft && <DraftNote />}
        <button
          type="button"
          onClick={() => setPhase("room")}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-jade-700 px-5 py-3.5 text-[15px] font-semibold text-white hover:bg-jade-600 sm:w-auto"
        >
          입실하기 <ChevronRight className="h-4 w-4" />
        </button>
      </Box>
    );
  }

  if ((phase === "room" || phase === "finishing") && session)
    return (
      <Box>
        <Room
          key={`${session.id}-${roomIdx}`}
          session={session}
          roomIdx={roomIdx}
          predict={sessionOpts(session.id).predict}
          finishing={phase === "finishing"}
          onFinishing={() => setPhase("finishing")}
          onDone={onRoomFinished}
          onError={(e) => {
            fail(e);
            setPhase("room");
          }}
          error={error}
        />
      </Box>
    );

  if (phase === "result" && session && config) {
    const format = config.formats.find((f) => f.id === session.formatId);
    const task = taskById(sessionOpts(session.id).taskId);
    const next = task && afterTask ? config.formats.find((f) => f.id === afterTask.formatId) : undefined;
    return (
      <Box>
        <Result
          session={session}
          busy={busy}
          task={task}
          onChange={bump}
          onContinue={
            next && afterTask
              ? {
                  label: afterTask.mode === "real" ? "이어서 실전 모의면접 시작" : "이어서 연습 시작",
                  run: () => {
                    const mode = afterTask.mode;
                    setAfterTask(null);
                    startSession(next, mode, { predict: predictFor(next.id, next.univ, mode, next.track) });
                  },
                }
              : undefined
          }
          onRetrySame={
            task
              ? () => startTask(task)
              : session.mode === "practice" && format && session.rooms[0].prompt
                ? () => startSession(format, "practice", { promptId: session.rooms[0].prompt!.id })
                : undefined
          }
          onNew={format ? () => startSession(format, session.mode, { predict: predictFor(format.id, format.univ, session.mode, format.track) }) : undefined}
          onHome={() => {
            setAfterTask(null);
            setSession(null);
            setPhase("home");
            refreshHistory();
          }}
        />
        {error && <ErrorLine text={error} />}
      </Box>
    );
  }

  return <Box><Spinner text="잠시만요…" /></Box>;
}

// ===================================================================== 면접실

function Room({
  session,
  roomIdx,
  predict,
  finishing,
  onFinishing,
  onDone,
  onError,
  error,
}: {
  session: SimSession;
  roomIdx: number;
  /** 질문 없는 방 — 면접관 질문을 가려 두고 쟁점·예상 질문부터 말한다 */
  predict: boolean;
  finishing: boolean;
  onFinishing: () => void;
  onDone: (s: SimSession) => void;
  onError: (e: unknown) => void;
  error: string | null;
}) {
  const room = session.rooms[roomIdx];
  const prompt = room.prompt;
  const startedAt = useRef(Date.now());
  /** 문답이 시작된 때 — 질문 없는 방이면 예상을 마치고 질문을 받은 순간 */
  const qaStartedAt = useRef(startedAt.current);
  /** 이어서 하는 방(이미 답한 방)은 바로 문답으로 들어간다 */
  const [stage, setStage] = useState<"predict" | "qa">(predict && prompt && room.turns.length === 0 ? "predict" : "qa");
  const stageRef = useRef(stage);
  stageRef.current = stage;
  /** 점검이 끝난 회차 — 복기 카드를 닫을 때 부모에게 넘긴다 */
  const [done, setDone] = useState<SimSession | null>(null);
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);
  const base: ReviewBase = {
    sessionId: session.id,
    roomIdx,
    formatId: session.formatId,
    promptId: prompt?.id ?? null,
    promptTitle: prompt?.title ?? room.label,
    roomLabel: room.label,
  };
  const [now, setNow] = useState(Date.now());
  const [turns, setTurns] = useState<SimTurn[]>(() => [{ role: "interviewer", text: prompt?.firstQuestion ?? "", at: 0 }, ...room.turns]);
  const [followUpsLeft, setFollowUpsLeft] = useState(room.followUpsLeft);
  const [sending, setSending] = useState(false);
  const [typed, setTyped] = useState(false);
  const [voice, setVoice] = useState(true);
  const sp = useSpeechTranscript();
  const endedRef = useRef(false);
  const draftRef = useRef("");

  const [typedText, setTypedText] = useState("");
  const finishStarted = useRef(false);
  const typingRef = useRef(false);

  const elapsed = (now - startedAt.current) / 1000;
  const remaining = room.answerSec - elapsed;
  const useTyping = typed || !sp.supported;
  const text = (useTyping ? typedText : sp.finalText).trim();
  draftRef.current = text;
  typingRef.current = useTyping;

  useEffect(() => {
    sp.resetMetrics();
    if (voice && prompt && stageRef.current === "qa") speakKo(prompt.firstQuestion);
    // 방을 마친 뒤(복기 카드)에는 시계를 돌리지 않는다
    const t = setInterval(() => {
      if (!finishStarted.current) setNow(Date.now());
    }, 250);
    return () => {
      clearInterval(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = (): SpeechStats => {
    const m = sp.metrics.current;
    const total = Math.min(room.answerSec, (Date.now() - startedAt.current) / 1000);
    return {
      firstSpeakSec: m.firstHeardAt ? Math.max(0, Math.round((m.firstHeardAt - qaStartedAt.current) / 1000)) : null,
      speakingSec: Math.round(m.speakingMs / 1000),
      totalSec: Math.round(total),
      longSilences: m.longSilences,
      overtime: endedRef.current,
      stt: typingRef.current ? "typed" : "browser",
    };
  };

  /** 질문 없는 방 → 문답. 예상한 내용은 이 기기에만 남긴다 — 서버로 보내면 답변으로 처리되어 꼬리질문이 하나 줄어든다 */
  const reveal = (skipped: boolean) => {
    if (stageRef.current !== "predict") return;
    sp.stop();
    if (!skipped && draftRef.current) patchReview(base, { prediction: draftRef.current });
    if (useTyping) setTypedText("");
    else sp.reset();
    sp.resetMetrics();
    qaStartedAt.current = Date.now();
    setStage("qa");
    if (voice && prompt) speakKo(prompt.firstQuestion);
  };

  const send = async () => {
    if (!text || sending || stage !== "qa") return;
    sp.stop();
    stopSpeaking();
    setSending(true);
    try {
      const at = Math.round((Date.now() - startedAt.current) / 1000);
      const r = await simApi.turn(session.id, roomIdx, text, at);
      setTurns((t) => [...t, { role: "student", text, at }, ...(r.followUp ? [{ role: "interviewer" as const, text: r.followUp, at }] : [])]);
      setFollowUpsLeft(r.followUpsLeft);
      if (useTyping) setTypedText("");
      else sp.reset();
      if (r.followUp && voice) speakKo(r.followUp);
    } catch (e) {
      onError(e);
    } finally {
      setSending(false);
    }
  };

  const finish = useCallback(async () => {
    if (finishStarted.current) return;
    finishStarted.current = true;
    sp.stop();
    stopSpeaking();
    onFinishing();
    try {
      // 보내지 않은 답변이 있으면 마지막 답으로 보낸다
      if (stageRef.current === "predict") {
        // 질문을 받기 전에 끝났다 — 말하던 예상은 답변이 아니므로 서버로 보내지 않는다
        if (draftRef.current) patchReview(base, { prediction: draftRef.current });
      } else if (draftRef.current) {
        await simApi.turn(session.id, roomIdx, draftRef.current, Math.round((Date.now() - startedAt.current) / 1000)).catch(() => undefined);
      }
      await simApi.finish(session.id, roomIdx, stats());
      // 바로 넘어가지 않는다 — 복기 카드를 닫을 때 onDone 을 부른다
      setDone(await simApi.get(session.id));
    } catch (e) {
      // 피드백 생성이 실패하면 다시 시도할 수 있게 한다(이미 보낸 답변은 서버에 남아 있다)
      finishStarted.current = false;
      onError(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id, roomIdx]);

  useEffect(() => {
    if (remaining <= 0 && !endedRef.current) {
      endedRef.current = true;
      finish();
    }
  }, [remaining, finish]);

  // 방을 마치면 점검(10~30초)이 도는 동안 복기 카드를 쓴다. 점검 결과는 카드를 닫은 뒤에 보여 준다
  if (finishing || done) {
    const fb = done?.rooms[roomIdx]?.feedback ?? null;
    const asked = stage === "qa" ? Array.from(new Set(turns.filter((t) => t.role === "interviewer" && t.text).map((t) => t.text))) : [];
    const close = (save: boolean) => {
      if (!done) return;
      const blank = draft.hardest === null && !draft.conclusion.trim() && !draft.redo.trim() && Object.keys(draft.self).length === 0;
      if (save && !blank) {
        patchReview(base, {
          hardest: draft.hardest ?? undefined,
          conclusion: draft.conclusion.trim() || undefined,
          redo: draft.redo.trim() || undefined,
          self: draft.self,
          savedAt: new Date().toISOString(),
        });
      }
      onDone(done);
    };
    return (
      <ReviewCard
        roomLabel={room.label}
        questions={asked}
        criteria={fb ? fb.items.map(({ key, label }) => ({ key, label })) : null}
        pending={!done}
        real={session.mode === "real"}
        draft={draft}
        onDraft={setDraft}
        onSave={() => close(true)}
        onSkip={() => close(false)}
        error={error}
      />
    );
  }

  const low = remaining <= 60;
  return (
    <div>
      <div className="-mx-5 mb-5 flex items-center justify-between gap-3 border-b border-hair px-5 pb-4 sm:-mx-8 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-brass-600">
            {session.format?.univ} · {room.label}
          </p>
          <p className={`tnum text-[1.75rem] font-bold leading-none ${low ? "text-[#b9471b]" : "text-ink-900"}`}>
            <Clock className="mr-1.5 inline h-5 w-5 align-[-2px]" />
            {mmss(remaining)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setVoice((v) => !v);
              stopSpeaking();
            }}
            className="inline-flex h-9 w-9 items-center justify-center border border-hair-strong text-ink-600"
            aria-label={voice ? "면접관 목소리 끄기" : "면접관 목소리 켜기"}
            title={voice ? "면접관 목소리 끄기" : "면접관 목소리 켜기"}
          >
            {voice ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("면접실을 마칠까요? 마치면 다시 답할 수 없어요.")) {
                endedRef.current = true;
                finish();
              }
            }}
            className="border border-ink-900 px-3 py-2 text-[13px] font-semibold text-ink-900 hover:bg-ink-900 hover:text-white"
          >
            면접실 마치기
          </button>
        </div>
      </div>
      <div className="h-1 w-full bg-ink-100">
        <div className={`h-1 ${low ? "bg-[#c65327]" : "bg-jade-600"}`} style={{ width: `${Math.min(100, (elapsed / room.answerSec) * 100)}%` }} />
      </div>

      {/* 스크롤해도 남은 시간이 보이게 — 사이트 머리글이 위를 덮으므로 아래에 띄운다 */}
      <div
        className={`tnum fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-4 py-2 text-[15px] font-bold shadow-lg ${low ? "bg-[#c65327] text-white" : "bg-ink-900 text-white"}`}
        role="timer"
        aria-label={`남은 시간 ${mmss(remaining)}`}
      >
        <Clock className="mr-1.5 inline h-4 w-4 align-[-2px]" />
        {mmss(remaining)}
      </div>

      {prompt && (
        <div className="mt-5 border border-hair bg-paper-50 p-5 sm:p-6">
          <p className="text-[12px] font-semibold text-ink-400">제시문 · {prompt.title}</p>
          <p className="mt-3 select-none text-[15px] leading-[1.9] text-ink-800">{prompt.text}</p>
        </div>
      )}

      {stage === "predict" && <PredictPanel questionless={isQuestionless(session.format?.univ ?? "", session.format?.track ?? "")} />}

      <div className="mt-6 space-y-3" aria-live="polite">
        {stage === "qa" && turns.map((t, i) => <Bubble key={i} turn={t} />)}
        {sending && (
          <p className="flex items-center gap-2 text-[13px] text-ink-400">
            <Loader2 className="h-4 w-4 animate-spin" /> 면접관이 생각 중…
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-hair pt-5">
        {useTyping ? (
          <textarea
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            rows={4}
            placeholder={stage === "predict" ? "쟁점과, 면접관이 물을 것 같은 질문 두 가지를 적어 보세요." : "답변을 입력하세요. 실제 면접처럼 말하듯이 써 보세요."}
            className="w-full resize-y border border-hair-strong bg-white p-3 text-[15px] leading-relaxed text-ink-900 focus:border-jade-600 focus:outline-none"
          />
        ) : (
          <div>
            <div className="min-h-[96px] border border-hair-strong bg-white p-3 text-[15px] leading-relaxed text-ink-900">
              {sp.finalText ? (
                <textarea
                  value={sp.finalText}
                  onChange={(e) => sp.setFinalText(e.target.value)}
                  rows={3}
                  disabled={sp.listening}
                  aria-label="받아쓴 답변(멈춘 뒤 고칠 수 있어요)"
                  className="w-full resize-y bg-transparent focus:outline-none disabled:text-ink-900"
                />
              ) : null}
              {sp.interim && <span className="text-ink-400">{sp.interim}</span>}
              {!sp.finalText && !sp.interim && (
                <span className="text-ink-400">{sp.listening ? "듣고 있어요. 말해 보세요." : "아래 버튼을 누르고 말하면 여기에 받아써집니다."}</span>
              )}
            </div>
            {sp.error && <p className="mt-2 text-[13px] text-[#b9471b]">{sp.error}</p>}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!useTyping && (
            <button
              type="button"
              onClick={() => {
                if (sp.listening) sp.stop();
                else {
                  stopSpeaking();
                  sp.start();
                }
              }}
              className={`inline-flex items-center gap-2 px-4 py-3 text-[14px] font-semibold ${
                sp.listening ? "bg-[#c65327] text-white" : "bg-ink-900 text-white hover:bg-ink-800"
              }`}
            >
              {sp.listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {sp.listening ? "말하기 멈춤" : "말하기 시작"}
            </button>
          )}
          {stage === "predict" ? (
            <>
              <button
                type="button"
                onClick={() => reveal(false)}
                disabled={!text || sp.listening}
                className="inline-flex items-center gap-2 bg-jade-700 px-4 py-3 text-[14px] font-semibold text-white hover:bg-jade-600 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400"
              >
                예상 끝 · 면접관 질문 받기 <ChevronRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => reveal(true)} className="text-[12px] text-ink-500 underline underline-offset-2">
                건너뛰고 질문 받기
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={send}
                disabled={!text || sending || sp.listening}
                className="inline-flex items-center gap-2 bg-jade-700 px-4 py-3 text-[14px] font-semibold text-white hover:bg-jade-600 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400"
              >
                <Send className="h-4 w-4" /> 답변 보내기
              </button>
              <span className="text-[12px] text-ink-400">남은 꼬리질문 {followUpsLeft}개</span>
            </>
          )}
          {sp.supported && (
            <button
              type="button"
              onClick={() => {
                sp.stop();
                setTyped((v) => !v);
              }}
              className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-ink-500 underline underline-offset-2"
            >
              <Keyboard className="h-3.5 w-3.5" /> {useTyping ? "말로 답하기" : "글로 답하기"}
            </button>
          )}
        </div>
        {!sp.supported && (
          <p className="mt-2 text-[12px] text-ink-400">이 브라우저는 음성 인식을 지원하지 않아 글로 답합니다. 말로 연습하려면 크롬·엣지·사파리를 쓰세요.</p>
        )}
        {error && <ErrorLine text={error} />}
      </div>
    </div>
  );
}

function Bubble({ turn }: { turn: SimTurn }) {
  const me = turn.role === "student";
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[88%] px-4 py-3 text-[14px] leading-relaxed ${me ? "bg-jade-50 text-ink-900" : "border border-hair bg-white text-ink-900"}`}>
        <p className={`mb-1 text-[11px] font-semibold ${me ? "text-jade-700" : "text-brass-600"}`}>{me ? "나" : "면접관"}</p>
        {turn.text}
      </div>
    </div>
  );
}

// ===================================================================== 결과

const STATUS_STYLE: Record<string, { cls: string; Icon: typeof CheckCircle2 }> = {
  충족: { cls: "text-jade-700 bg-jade-50 border-jade-200", Icon: CheckCircle2 },
  약함: { cls: "text-brass-600 bg-brass-50 border-brass-400", Icon: AlertTriangle },
  없음: { cls: "text-[#b9471b] bg-[#fbf1e8] border-[#e8b89c]", Icon: XCircle },
  보류: { cls: "text-ink-500 bg-ink-100 border-ink-200", Icon: CircleDashed },
};

function Result({
  session,
  busy,
  task,
  onChange,
  onContinue,
  onRetrySame,
  onNew,
  onHome,
}: {
  session: SimSession;
  busy: boolean;
  /** 이 회차가 지난 수업 과제를 다시 답한 것이면 그 과제 */
  task: ClassTask | null;
  /** 이 브라우저에 둔 복기·과제를 바꿨다 — 다시 그린다 */
  onChange: () => void;
  /** 과제 때문에 미뤄 둔 회차를 이어서 시작 */
  onContinue?: { label: string; run: () => void };
  onRetrySame?: () => void;
  onNew?: () => void;
  onHome: () => void;
}) {
  const taskId = task?.id;
  useEffect(() => {
    if (!taskId) return;
    recordAttempt(taskId, session.id, session.rooms[0]?.feedback?.items);
    onChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, session.id]);

  return (
    <div>
      <p className="text-[12px] font-semibold tracking-wide text-brass-600">
        {session.format?.univ} · {session.mode === "real" ? "실전 모의면접 결과" : "연습 결과"}
      </p>
      <h3 className="mt-2 text-[1.25rem] font-bold text-ink-900">면접실별 점검</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
        점수나 합격 가능성은 내지 않습니다. 기준 6가지를 해냈는지만 보고, 부족한 곳에는 스스로 고칠 질문을 돌려 드립니다. ‘보류’는 받아쓰기에서 근거를 찾지 못해 판단하지 않은 항목입니다. 복기 카드를 썼다면 내 판단을 점검 결과 옆에 함께 보여 드립니다.
      </p>
      {task && (
        <TaskCompare
          task={task}
          items={session.rooms[0]?.feedback?.items}
          onFinish={() => {
            finishTask(task.id);
            onChange();
          }}
        />
      )}
      <div className="mt-6 space-y-8">
        {session.rooms.map((r) => {
          const review = getReview(session.id, r.idx);
          const marked = taskFor(session.id, r.idx);
          return (
          <div key={r.idx} className="border border-hair">
            <div className="border-b border-hair bg-paper-50 px-5 py-4">
              <p className="text-[12px] font-semibold text-ink-400">{r.label}</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900">{r.prompt?.title}</p>
              {r.feedback?.summary && <p className="mt-2 text-[14px] leading-relaxed text-ink-700">{r.feedback.summary}</p>}
            </div>
            <ReviewBlock review={review} items={r.feedback?.items} questions={interviewerQuestions(r.prompt?.firstQuestion, r.turns)} />
            <ul className="divide-y divide-hair">
              {r.feedback?.items.map((it) => <RubricRow key={it.key} item={it} self={review?.self?.[it.key]} />)}
            </ul>
            {r.feedback?.speech && <SpeechLine s={r.feedback.speech} answerSec={r.answerSec} />}
            {/* 과제를 다시 답한 회차에서는 또 과제로 정하지 않는다 */}
            {!task && r.prompt && r.feedback && (
              <TaskMarker
                task={marked}
                onAdd={(note) => {
                  addTask({
                    formatId: session.formatId,
                    promptId: r.prompt!.id,
                    promptTitle: r.prompt!.title,
                    roomLabel: r.label,
                    fromSessionId: session.id,
                    fromRoomIdx: r.idx,
                    fromMode: session.mode,
                    note,
                    before: snap(r.feedback!.items),
                  });
                  onChange();
                }}
                onRemove={() => {
                  if (marked) removeTask(marked.id);
                  onChange();
                }}
              />
            )}
            <details className="border-t border-hair px-5 py-3">
              <summary className="cursor-pointer text-[13px] font-semibold text-ink-600">대화 다시 보기</summary>
              <div className="mt-3 space-y-3">
                {r.prompt && <Bubble turn={{ role: "interviewer", text: r.prompt.firstQuestion, at: 0 }} />}
                {r.turns.map((t, i) => (
                  <Bubble key={i} turn={t} />
                ))}
              </div>
            </details>
          </div>
          );
        })}
      </div>
      {hasAnyReview(session) && <CopySummary text={() => summaryText(session)} />}
      <div className="mt-8 flex flex-wrap gap-2">
        {onContinue && (
          <button type="button" disabled={busy} onClick={onContinue.run} className="inline-flex items-center gap-2 bg-jade-700 px-4 py-3 text-[14px] font-semibold text-white hover:bg-jade-600 disabled:opacity-60">
            {onContinue.label} <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {onRetrySame && (
          <button type="button" disabled={busy} onClick={onRetrySame} className="inline-flex items-center gap-2 bg-jade-700 px-4 py-3 text-[14px] font-semibold text-white hover:bg-jade-600 disabled:opacity-60">
            <RotateCcw className="h-4 w-4" /> {task ? "과제 문항 한 번 더" : "같은 제시문으로 다시"}
          </button>
        )}
        {onNew && (
          <button type="button" disabled={busy} onClick={onNew} className="inline-flex items-center gap-2 bg-ink-900 px-4 py-3 text-[14px] font-semibold text-white hover:bg-ink-800 disabled:opacity-60">
            {session.mode === "real" ? "실전 다시 하기" : "다른 제시문으로 연습"}
          </button>
        )}
        <button type="button" onClick={onHome} className="border border-hair-strong px-4 py-3 text-[14px] font-semibold text-ink-700 hover:border-ink-900">
          처음으로
        </button>
      </div>
      {/* 체험 뒤 갈림길 — page.tsx 의 #paths(_two-paths.tsx) 로 보낸다 */}
      <div className="mt-8 border border-jade-700/40 bg-jade-50 px-5 py-4">
        <p className="text-[14px] font-semibold text-ink-900">이 결과로 무엇을 할까요?</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
          AI 로 계속 반복하셔도 되고, 이 결과를 가지고 선생님 1:1 수업에서 피드백을 받으셔도 됩니다. 두 방법의 비용과 차이를 정리해 두었습니다.
        </p>
        <a href="#paths" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-jade-700 underline underline-offset-4">
          AI 만 / 선생님 수업 비교 보기 →
        </a>
      </div>
    </div>
  );
}

function RubricRow({ item, self }: { item: RubricItem; /** 복기 카드에 적은 내 판단 */ self?: SelfMark }) {
  const st = STATUS_STYLE[item.status] ?? STATUS_STYLE["보류"];
  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className={`inline-flex shrink-0 items-center gap-1 border px-2 py-0.5 text-[12px] font-semibold ${st.cls}`}>
          <st.Icon className="h-3.5 w-3.5" /> {item.status}
        </span>
        <span className="text-[14px] font-semibold text-ink-900">{item.label}</span>
        <SelfTag self={self} status={item.status} />
      </div>
      {item.evidence && <p className="mt-2 border-l-2 border-hair-strong pl-3 text-[13px] leading-relaxed text-ink-500">“{item.evidence}”</p>}
      {item.question && <p className="mt-2 text-[13px] leading-relaxed text-ink-700">→ {item.question}</p>}
    </li>
  );
}

function SpeechLine({ s, answerSec }: { s: SpeechStats; answerSec: number }) {
  const parts = [
    s.firstSpeakSec != null ? `첫 말까지 ${s.firstSpeakSec}초` : null,
    s.stt === "browser" ? `말한 시간 약 ${mmss(s.speakingSec)} / ${mmss(Math.min(s.totalSec, answerSec))}` : `사용 시간 ${mmss(Math.min(s.totalSec, answerSec))}`,
    s.stt === "browser" ? `3초 넘는 침묵 ${s.longSilences}번` : "글로 답함",
    s.overtime ? "시간 종료로 끝남" : null,
  ].filter(Boolean);
  return <p className="border-t border-hair px-5 py-3 text-[12px] text-ink-500">말하기 · {parts.join(" · ")}</p>;
}

// ===================================================================== 홈·동의·기록

function FormatCard({
  format,
  busy,
  taskFirst,
  predict,
  onPredict,
  onReal,
  onPractice,
}: {
  format: SimFormat;
  busy: boolean;
  /** 아직 다시 답하지 않은 지난 수업 과제가 있다 — 시작하면 그 문항부터 */
  taskFirst: boolean;
  /** 질문 없는 방으로 시작 */
  predict: boolean;
  onPredict: (v: boolean) => void;
  onReal: () => void;
  onPractice: () => void;
}) {
  return (
    <div className="border border-hair">
      <div className="px-5 py-5 sm:px-6">
        <p className="text-[12px] font-semibold tracking-wide text-brass-600">{format.univ} · {format.track}</p>
        <h3 className="mt-2 text-[1.125rem] font-bold text-ink-900">{format.label}</h3>
        <p className="mt-2 text-[13px] text-ink-500">
          {format.rooms.map((r, i) => `${ROMAN[i] ?? i + 1} ${Math.round(r.answerSec / 60)}분`).join(" → ")} · {format.rooms[0]?.prepSec ? `준비 ${Math.round(format.rooms[0].prepSec / 60)}분` : "준비 시간 없음"}
        </p>
        <ul className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-ink-600">
          {format.notes.map((n) => (
            <li key={n}>· {n}</li>
          ))}
        </ul>
        <a href={format.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[12px] text-ink-400 underline underline-offset-2">
          근거: {format.source.label}
        </a>
        {format.draft && <DraftNote />}
        <PredictToggle on={predict} questionless={isQuestionless(format.univ, format.track)} onChange={onPredict} />
      </div>
      <div className="grid gap-px border-t border-hair bg-hair sm:grid-cols-2">
        <button type="button" disabled={busy} onClick={onReal} className="bg-white px-5 py-4 text-left hover:bg-jade-50 disabled:opacity-60">
          <span className="block text-[15px] font-semibold text-ink-900">실전 모의면접</span>
          <span className="mt-1 block text-[12px] text-ink-500">
            {taskFirst ? `지난 수업 과제 한 문항 먼저 → 이어서 방 ${format.rooms.length}개` : `방 ${format.rooms.length}개를 이어서 · 피드백은 마지막에`}
          </span>
        </button>
        <button type="button" disabled={busy} onClick={onPractice} className="bg-white px-5 py-4 text-left hover:bg-jade-50 disabled:opacity-60">
          <span className="block text-[15px] font-semibold text-ink-900">연습 · 방 하나</span>
          <span className="mt-1 block text-[12px] text-ink-500">{taskFirst ? "지난 수업 과제 한 문항 먼저 → 이어서 연습" : "한 방만 · 바로 피드백 · 같은 제시문 다시 하기"}</span>
        </button>
      </div>
    </div>
  );
}

function DraftNote() {
  return (
    <p className="mt-4 border-l-2 border-brass-400 bg-brass-50 px-3 py-2 text-[12px] leading-relaxed text-brass-600">
      시제품입니다. 제시문은 선생님 검수 전 초안이고, 실제 기출이 아닙니다.
    </p>
  );
}

function Consent({ config, onAgree }: { config: SimConfig; onAgree: (items: string[]) => void }) {
  const [checked, setChecked] = useState<string[]>([]);
  const all = config.consentItems.every((i) => checked.includes(i.id));
  return (
    <div>
      <h3 className="text-[1.125rem] font-bold text-ink-900">시작하기 전에 확인해 주세요</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-500">항목마다 따로 동의해 주세요. 동의하지 않으면 MMI 실전 모의면접을 쓸 수 없습니다(말하기·태도 연습은 그대로 쓸 수 있어요).</p>
      <ul className="mt-5 space-y-3">
        {config.consentItems.map((i) => (
          <li key={i.id}>
            <label className="flex cursor-pointer gap-3 border border-hair px-4 py-3 text-[14px] leading-relaxed text-ink-800 hover:border-jade-600">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-[#1f6f5c]"
                checked={checked.includes(i.id)}
                onChange={(e) => setChecked((c) => (e.target.checked ? [...c, i.id] : c.filter((x) => x !== i.id)))}
              />
              <span>{i.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <dl className="mt-5 grid gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-ink-500 sm:grid-cols-[110px_1fr]">
        <dt className="font-semibold text-ink-600">AI 모델 제공사</dt>
        <dd>{config.provider.name} · {config.provider.country}</dd>
        <dt className="font-semibold text-ink-600">제공사 보관</dt>
        <dd>{config.provider.retention}</dd>
        <dt className="font-semibold text-ink-600">학습 사용</dt>
        <dd>{config.provider.training}</dd>
        <dt className="font-semibold text-ink-600">T메디 보관</dt>
        <dd>{config.retention.rule}</dd>
      </dl>
      <button
        type="button"
        disabled={!all}
        onClick={() => onAgree(checked)}
        className="mt-6 w-full bg-jade-700 px-5 py-3.5 text-[15px] font-semibold text-white hover:bg-jade-600 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400 sm:w-auto"
      >
        동의하고 계속
      </button>
    </div>
  );
}

function History({
  items,
  busy,
  onOpen,
  onDelete,
  onDeleteAll,
}: {
  items: SimListItem[];
  busy: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h4 className="text-[14px] font-semibold text-ink-900">내 기록</h4>
        <button type="button" onClick={onDeleteAll} className="inline-flex items-center gap-1 text-[12px] text-ink-400 hover:text-[#b9471b]">
          <Trash2 className="h-3.5 w-3.5" /> 전체 삭제
        </button>
      </div>
      <ul className="mt-3 divide-y divide-hair border border-hair">
        {items.map((s) => (
          <li key={s.id} className="flex items-center gap-3 px-4 py-3">
            <button type="button" disabled={busy} onClick={() => onOpen(s.id)} className="min-w-0 flex-1 text-left">
              <span className="block text-[13px] font-semibold text-ink-900">
                {s.mode === "real" ? "실전" : "연습"} · {s.rooms.map((r) => r.promptTitle).join(" / ")}
              </span>
              <span className="mt-0.5 block text-[12px] text-ink-400">
                {new Date(s.createdAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })} ·{" "}
                {s.status === "done" ? `끝남 · 없음 ${s.rooms.reduce((n, r) => n + r.missing, 0)}개` : "진행 중 — 이어서 하기"}
              </span>
            </button>
            <button type="button" onClick={() => onDelete(s.id)} aria-label="이 기록 삭제" className="p-2 text-ink-300 hover:text-[#b9471b]">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ===================================================================== 공용

function Box({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl border border-ink-100 bg-white px-5 py-6 sm:px-8 sm:py-8">{children}</div>;
}

function Spinner({ text }: { text: string }) {
  return (
    <p className="flex items-center justify-center gap-2 py-8 text-[14px] text-ink-500">
      <Loader2 className="h-4 w-4 animate-spin" /> {text}
    </p>
  );
}

function ErrorLine({ text }: { text: string }) {
  return <p className="mt-4 border-l-2 border-[#c65327] bg-[#fbf1e8] px-3 py-2 text-[13px] text-[#b9471b]">{text}</p>;
}
