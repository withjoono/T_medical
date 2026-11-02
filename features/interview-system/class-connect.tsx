"use client";

import { useEffect, useState } from "react";
import { Check, KeyRound, Loader2, Unlink, UserCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { KEYS, interviewApi } from "./api";
import { invalidate, useMediAuth, useRemote } from "./hooks";
import { ErrorLine, LoginButton, Panel } from "./ui";

/**
 * 선생님 연결 — 수시앱 class-connect.tsx 를 옮긴 것 (서버 susi-back /susi/interview-questions/class-*)
 *  - ClassCodeForm  : 면접 수업 코드 입력(초대 링크 대신 코드를 받은 학생)
 *  - ClassInvite    : 선생님 초대 링크(…/interview/me?class=코드)로 들어왔을 때 「○○ 선생님과 연결할까요?」
 *  - ClassTeachers  : 연결된 선생님 목록 · 코드로 연결한 선생님 끊기
 * 연결로 열리는 것은 이름과 면접 기능뿐이다. 결과는 학생이 보내거나 과제로 제출한 것만 넘어간다.
 * 선생님앱의 초대 링크는 수시앱 주소(?tab=mine&class=)로 나간다 — T메디 학생은 이 화면 주소에 같은 ?class= 를 붙여도 된다.
 */

const refreshLinks = () => invalidate(KEYS.teachers, KEYS.quota, KEYS.assignments, KEYS.sets);

export function ClassCodeForm({ className }: { className?: string }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      className={cn("space-y-2", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setBusy(true);
        setMsg(null);
        try {
          const t = await interviewApi.classConnect(code);
          setCode("");
          setMsg({ ok: true, text: `${t.teacherName} 선생님과 ${t.already ? "이미 연결돼 있어요" : "연결됐어요"}` });
          refreshLinks();
        } catch (err) {
          setMsg({ ok: false, text: (err as Error).message });
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="medi-class-code">
          면접 수업 코드
        </label>
        <input
          id="medi-class-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="면접 수업 코드 8자리 (예: K7Q2-MX9A)"
          autoComplete="off"
          maxLength={20}
          className="h-10 min-w-0 flex-1 border border-ink-200 bg-white px-3 font-mono text-[14px] tracking-wider text-ink-900 placeholder:font-sans placeholder:tracking-normal placeholder:text-ink-400"
        />
        <button
          type="submit"
          disabled={!code.trim() || busy}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 bg-jade-700 px-4 text-[14px] font-semibold text-white hover:bg-jade-600 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} 연결
        </button>
      </div>
      {msg && (msg.ok ? <p className="flex items-center gap-1 text-[12px] font-semibold text-jade-700"><Check className="h-3.5 w-3.5" /> {msg.text}</p> : <ErrorLine text={msg.text} />)}
    </form>
  );
}

/** 지금 주소의 ?class= — 닫으면 그 값만 떼고 이 화면에 남는다 */
function useClassParam(): [string | null, () => void] {
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    setCode(new URLSearchParams(window.location.search).get("class"));
  }, []);
  const clear = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("class");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    setCode(null);
  };
  return [code, clear];
}

export function ClassInvite() {
  const { ready, logged } = useMediAuth();
  const [code, close] = useClassParam();
  const preview = useRemote(`class-preview:${code}`, () => interviewApi.classPreview(code ?? ""), !!code && logged);
  const [state, setState] = useState<{ busy?: boolean; done?: boolean; error?: string }>({});

  if (!code || !ready) return null;
  const done = state.done || preview.data?.connected;
  return (
    <div className="border-2 border-brass-300 bg-brass-50 px-5 py-4 text-[14px] text-ink-900">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-1.5 font-semibold">
          <UserCheck className="h-4 w-4 text-brass-600" /> 선생님의 면접 수업 초대
        </p>
        <button type="button" onClick={close} aria-label="닫기" className="p-1 text-ink-500 hover:bg-brass-200/50">
          <X className="h-4 w-4" />
        </button>
      </div>
      {!logged ? (
        <div className="mt-2">
          <p>로그인하면 선생님과 연결할 수 있어요. 로그인한 뒤 이 화면으로 돌아옵니다.</p>
          <LoginButton label="로그인하고 연결하기" className="mt-3" />
        </div>
      ) : preview.pending ? (
        <p className="mt-2 flex items-center gap-1.5 text-ink-600">
          <Loader2 className="h-4 w-4 animate-spin" /> 코드를 확인하는 중…
        </p>
      ) : preview.error ? (
        <p className="mt-1 font-semibold text-red-700">{preview.error.message}</p>
      ) : preview.data?.self ? (
        <p className="mt-1">내 면접 수업 코드예요. 학생에게 이 링크를 보내 주세요.</p>
      ) : done ? (
        <p className="mt-1 flex items-center gap-1.5 font-semibold text-jade-700">
          <Check className="h-4 w-4" /> {preview.data?.teacherName} 선생님과 연결됐어요. 선생님이 과제를 내면 이 화면에 떠요.
        </p>
      ) : (
        <>
          <p className="mt-1">
            <b>{preview.data?.teacherName}</b> 선생님과 면접 수업을 연결할까요? 연결하면 선생님이 낸 과제를 받고, 수업 일정이 여기에 보여요.
          </p>
          <p className="mt-1 text-[12px] text-ink-500">
            연결해도 선생님은 내 이름만 봅니다. 답변은 내가 보내거나 과제로 제출한 것만 전달되고, 연결은 언제든 끊을 수 있어요.
          </p>
          {state.error && <p className="mt-2 text-[12px] font-semibold text-red-700">{state.error}</p>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={state.busy}
              onClick={async () => {
                setState({ busy: true });
                try {
                  await interviewApi.classConnect(code);
                  setState({ done: true });
                  refreshLinks();
                } catch (err) {
                  setState({ error: (err as Error).message });
                }
              }}
              className="inline-flex h-10 items-center gap-1.5 bg-jade-700 px-4 font-semibold text-white hover:bg-jade-600 disabled:opacity-50"
            >
              {state.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} 연결하기
            </button>
            <button type="button" onClick={close} className="h-10 border border-brass-300 px-4 font-semibold text-ink-700 hover:bg-brass-200/50">
              다음에
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** 연결된 선생님 — 코드로 연결한 선생님은 여기서 끊는다(계정공유 연결은 T스쿨 계정연동에서) */
export function ClassTeachers() {
  const { logged } = useMediAuth();
  const q = useRemote(KEYS.teachers, interviewApi.teachers, logged);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!q.data) return null;
  const list = q.data;
  return (
    <Panel
      title="면접 수업 선생님"
      icon={<UserCheck className="h-4 w-4 text-jade-700" />}
      aside={
        <button type="button" onClick={() => setAdding(!adding)} className="text-[12px] font-semibold text-jade-700 hover:underline">
          {adding ? "닫기" : list.length ? "다른 선생님 코드 넣기" : "선생님 코드 넣기"}
        </button>
      }
    >
      {list.length === 0 ? (
        <p className="text-[14px] text-ink-600">연결된 선생님이 없어요. 선생님이 보낸 초대 링크를 열거나, 받은 면접 수업 코드를 넣으면 선생님 과제를 받을 수 있어요.</p>
      ) : (
        <ul className="divide-y divide-hair text-[14px]">
          {list.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span className="font-semibold text-ink-900">
                {t.name} 선생님
                <span className="ml-2 bg-paper-200 px-1.5 py-0.5 text-[11px] font-semibold text-ink-600">{t.via === "code" ? "수업 코드" : "계정공유"}</span>
              </span>
              {t.via === "code" && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm(`${t.name} 선생님과 연결을 끊을까요? 선생님이 내가 보낸 결과를 더는 볼 수 없어요.`)) return;
                    setError(null);
                    try {
                      await interviewApi.classDisconnect(t.id);
                      refreshLinks();
                    } catch (err) {
                      setError((err as Error).message);
                    }
                  }}
                  className="inline-flex items-center gap-1 border border-ink-200 px-2.5 py-1 text-[12px] font-semibold text-ink-700 hover:bg-paper-100"
                >
                  <Unlink className="h-3.5 w-3.5" /> 연결 끊기
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {error && <ErrorLine text={error} />}
      {(adding || list.length === 0) && <ClassCodeForm className="mt-3" />}
    </Panel>
  );
}
