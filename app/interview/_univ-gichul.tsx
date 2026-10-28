import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileSearch, ListChecks, TrendingUp, Users } from "lucide-react";
import { PromoSection } from "../_site/components";
import {
  GICHUL_FIELD_LABEL,
  gichulFields,
  gichulHref,
  gichulLayout,
  gichulExamplesOn,
  gichulQuestionsOn,
  type GichulField,
  type UnivGichul,
  type UnivGichulQuestion,
} from "@/lib/univ-gichul";

/** =========================================================================
 *  대학별 면접 기출 분석 블록 (2026-10-28) — 데이터는 lib/univ-gichul.ts · lib/gichul-data/*.json.
 *  가천대는 따로 짠 블록(./_gichul.tsx)을 그대로 쓴다.
 *
 *  같은 대학의 여러 계열 페이지는 **서로 다른 몫**을 싣는다(본문 중복 방지 — gichulLayout).
 *   · 주 페이지   — 한마디·근거, 2027 면접 방식, 자기 문항, 2025→2026 비교, 자료의 한계
 *   · 나머지 페이지 — 자기 문항, 인성 질문 표 또는 준비 순서 중 하나
 *  각 페이지 끝에서 같은 대학의 다른 페이지로 보낸다. 전부 서버 컴포넌트다.
 *  ========================================================================= */

const JESIMUN = new Set(["제시문", "MMI 상황"]);

function basisLabel(q: UnivGichulQuestion) {
  if (JESIMUN.has(q.kind)) return "제시문·상황";
  if (q.kind === "공통문항") return "배경";
  return "근거 기록";
}

function QuestionCard({ q, n }: { q: UnivGichulQuestion; n: number }) {
  // 가이드북 예시는 출제 학년도가 아니라 가이드북 학년도다 — '2026학년도'로 쓰면 기출처럼 읽힌다
  const yearText = /가이드북/.test(q.src ?? "") ? `${q.year} 가이드북 예시` : `${q.year}학년도`;
  const meta = [yearText, q.unit, q.kind, q.subject].filter(Boolean).join(" · ");
  return (
    <article className="border border-hair-strong bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="tnum text-[11px] font-semibold tracking-[0.2em] text-brass-600">
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="display text-[1.125rem] leading-snug text-ink-900">{q.topic}</h3>
        <span className="text-[12px] font-light text-ink-400">{meta}</span>
      </div>

      <dl className="mt-5 space-y-3 text-[14px] font-light leading-[1.8] text-ink-700">
        {q.basis && (
          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
            <dt className="eyebrow pt-1 text-brass-600">{basisLabel(q)}</dt>
            <dd>{q.basis}</dd>
          </div>
        )}
        <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
          <dt className="eyebrow pt-1 text-brass-600">질문</dt>
          <dd className="text-ink-900">{q.ask}</dd>
        </div>
        {q.focus && (
          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
            <dt className="eyebrow pt-1 text-brass-600">보는 것</dt>
            <dd>{q.focus}</dd>
          </div>
        )}
        {q.frame.length > 0 && (
          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
            <dt className="eyebrow pt-1 text-brass-600">답변 골격</dt>
            <dd>
              <ol className="list-decimal space-y-1 pl-5">
                {q.frame.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ol>
            </dd>
          </div>
        )}
        {q.followups.length > 0 && (
          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
            <dt className="eyebrow pt-1 text-brass-600">꼬리질문</dt>
            <dd>{q.followups.map((f) => `“${f}”`).join(" / ")}</dd>
          </div>
        )}
        {q.pitfall && (
          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
            <dt className="eyebrow pt-1 text-brass-600">감점</dt>
            <dd>{q.pitfall}</dd>
          </div>
        )}
      </dl>
      {q.src && <p className="mt-4 text-[11px] font-light text-ink-400">출처: {q.src}</p>}
    </article>
  );
}

/** 주격 조사 — '건국대 글로컬이', '서울대가'. 한글이 아닌 끝(WISE)은 모음으로 본다 */
function iga(word: string) {
  const c = word.charCodeAt(word.length - 1);
  if (c < 0xac00 || c > 0xd7a3) return `${word}가`;
  return (c - 0xac00) % 28 ? `${word}이` : `${word}가`;
}

/** 페이지 머리 문장 — 문항 수·공개 범위를 데이터에서 계산한다 */
function intro(u: UnivGichul, field: GichulField, qs: UnivGichulQuestion[]) {
  const years = [...new Set(u.questions.map((q) => q.year))].sort();
  const yearText = years.length ? `${years.join("·")}학년도 ` : "";
  const total = u.questions.length;
  const fields = gichulFields(u);
  // 공개 범위 문장은 이 페이지에 실린 문항만 보고 정한다(다른 계열 페이지 몫의 사정을 끌어오지 않게)
  const scope = [...new Set((qs.length ? qs : u.questions).map((q) => q.unit))];
  const commonOnly = scope.length > 0 && scope.every((s) => /공통/.test(s));
  const scopeText = commonOnly
    ? " 공개된 것은 의약 계열 전용이 아니라 전형·계열 공통 예시입니다."
    : fields.length > 1 && scope.every((s) => /학과 구분 없음/.test(s))
      ? " 보고서가 학과를 나누지 않고 공개해, 배치는 과목 성격에 맞춘 것입니다."
      : "";
  if (total === 0) {
    if (u.examples?.length) {
      return `${iga(u.short)} 공개한 선행학습 영향평가 보고서에는 이 계열 면접의 문항 예시가 없습니다. 대신 대학이 가이드북에 직접 공개한 예시문항을 같은 방식으로 분석했습니다.`;
    }
    return `${iga(u.short)} 공개한 선행학습 영향평가 보고서에는 이 계열 면접의 문항 예시가 없습니다. 보고서가 밝힌 면접 성격과 준비 방향만 정리했습니다.`;
  }
  if (fields.length === 1 || qs.length === total) {
    return `${iga(u.short)} 선행학습 영향평가 보고서로 공개한 ${yearText}면접 문항을 ${total}개 카드로 하나씩 분석했습니다.${scopeText}`;
  }
  return `${iga(u.short)} 공개한 ${yearText}면접 문항을 ${total}개 카드로 분석해 계열 페이지에 나눠 실었고, 이 페이지에는 ${qs.length}개가 있습니다.${scopeText}`;
}

function OtherPages({ u, field }: { u: UnivGichul; field: GichulField }) {
  const lay = gichulLayout(u);
  const others = gichulFields(u).filter((f) => f !== field);
  if (!others.length) return null;
  const extra = (f: GichulField) => {
    const parts: string[] = [];
    if (f === lay.primary) parts.push("한마디 · 연도 비교 · 자료의 한계");
    if (f === lay.inseong && u.inseong?.length) parts.push(`인성 질문 ${u.inseong.length}개`);
    if (f === lay.prep && u.prep?.length) parts.push("준비 순서");
    return parts;
  };
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <p className="text-[13px] font-light text-ink-600">
        나머지 기출 분석은 같은 {u.short} 면접의 다른 계열 페이지에 나눠 실었습니다.
      </p>
      <div className="mt-3 grid gap-px bg-hair sm:grid-cols-2">
        {others.map((f) => {
          const qs = gichulQuestionsOn(u, f);
          const desc = [...qs.map((q) => q.topic), ...extra(f)].join(" · ") || "면접 안내";
          return (
            <Link
              key={f}
              href={gichulHref(f, u.pages[f]!)}
              className="group flex items-center justify-between gap-4 bg-white px-5 py-4 transition-colors hover:bg-paper-50"
            >
              <span>
                <span className="block text-[14px] font-medium text-ink-900">
                  {u.short} {GICHUL_FIELD_LABEL[f].page} 면접
                </span>
                <span className="mt-1 block text-[12px] font-light text-ink-500">{desc}</span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-brass-600 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function driveView(url: string) {
  const m = url.match(/drive\.google\.com\/uc\?export=download&id=([\w-]+)/);
  return m ? `https://drive.google.com/file/d/${m[1]}/view` : url;
}

function Sources({ u }: { u: UnivGichul }) {
  const list = (u.sources ?? []).filter((s) => s.url);
  if (!list.length) return null;
  return (
    <p className="mx-auto mt-6 max-w-4xl text-[12px] font-light leading-relaxed text-ink-400">
      출처:{" "}
      {list.map((s, i) => (
        <span key={`${s.label}-${i}`}>
          {i > 0 ? " · " : ""}
          <a href={driveView(s.url!)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {s.label}
          </a>
        </span>
      ))}
      . 질문은 보고서 문장을 요약했고, 답변 골격·꼬리질문·감점 포인트는 T메디의 분석입니다.
    </p>
  );
}

export function UnivGichulBlock({ u, field }: { u: UnivGichul; field: GichulField }) {
  const lay = gichulLayout(u);
  const qs = gichulQuestionsOn(u, field);
  const isPrimary = field === lay.primary;
  const unit = GICHUL_FIELD_LABEL[field].unit;
  const showInseong = field === lay.inseong && (u.inseong?.length ?? 0) > 0;
  const showPrep = field === lay.prep && (u.prep?.length ?? 0) > 0;
  const showTrend = isPrimary && (u.trend?.length ?? 0) > 0;
  const ex = gichulExamplesOn(u, field);
  const showMain = isPrimary || qs.length > 0 || ex.length > 0;
  const nothingHere = !showMain && !showInseong && !showPrep;
  /** 같은 대학 다른 페이지 링크·출처는 이 페이지에서 마지막으로 그리는 섹션 끝에 한 번 */
  const last = showInseong ? "inseong" : showPrep ? "prep" : showTrend ? "trend" : "main";
  const tail = (
    <>
      <OtherPages u={u} field={field} />
      <Sources u={u} />
    </>
  );

  if (nothingHere) {
    return (
      <PromoSection eyebrow="PAST QUESTIONS" EyebrowIcon={FileSearch} title={`${u.short} 면접 기출 분석`}>
        <OtherPages u={u} field={field} />
      </PromoSection>
    );
  }

  return (
    <>
      {showMain && (
      <PromoSection
        eyebrow="PAST QUESTIONS"
        EyebrowIcon={FileSearch}
        title={`${u.short} ${unit} 면접 기출 분석`}
        subtitle={intro(u, field, qs)}
      >
        {isPrimary && u.oneLine && (
          <div className="mx-auto mb-8 max-w-4xl border border-hair-strong bg-white px-6 py-6">
            <p className="eyebrow text-brass-600">한마디로</p>
            <p className="display mt-3 text-[1.25rem] leading-snug text-ink-900">
              {u.oneLine.replace(/^한마디로[,:\s]*/, "")}
            </p>
            {u.evidence && <p className="mt-3 text-[13px] font-light leading-[1.8] text-ink-600">{u.evidence}</p>}
          </div>
        )}
        {isPrimary && u.format2027 && (
          <div className="mx-auto mb-8 max-w-4xl border-l-2 border-brass-400 bg-brass-50 px-5 py-4 text-[13px] font-light leading-[1.8] text-ink-700">
            <span className="font-medium text-ink-900">2027 면접 — </span>
            {u.format2027}
          </div>
        )}
        {qs.length > 0 && (
          <div className="mx-auto max-w-4xl space-y-5">
            {qs.map((q, i) => (
              <QuestionCard key={q.id} q={q} n={i + 1} />
            ))}
          </div>
        )}
        {ex.length > 0 && (
          <div className="mx-auto mt-10 max-w-4xl">
            <p className="eyebrow text-brass-600">대학 공개 예시문항 — 기출 아님</p>
            <p className="mt-2 text-[13px] font-light leading-[1.8] text-ink-600">
              {iga(u.short)} 가이드북 등에 직접 공개한 예시문항입니다. 실제 면접에서 나온 기출은 아니지만, 대학이 무엇을 묻겠다고 밝힌 자료라 같은 방식으로 분석했습니다.
            </p>
            <div className="mt-5 space-y-5">
              {ex.map((q, i) => (
                <QuestionCard key={q.id} q={q} n={qs.length + i + 1} />
              ))}
            </div>
          </div>
        )}
        {isPrimary && (u.limits?.length ?? 0) > 0 && (
          <div className="mx-auto mt-8 max-w-4xl">
            <p className="eyebrow text-brass-600">자료의 한계</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] font-light leading-[1.8] text-ink-600">
              {u.limits!.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        )}
        {last === "main" && tail}
      </PromoSection>
      )}

      {showTrend && (
        <PromoSection
          eyebrow="TREND"
          EyebrowIcon={TrendingUp}
          title={`2025 → 2026 ${u.short} 출제 비교`}
          subtitle="두 해 보고서에 공개된 문항을 같은 기준으로 나란히 놓았습니다."
          tone="muted"
        >
          <div className="mx-auto max-w-4xl overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-hair-strong text-ink-500">
                  <th className="py-3 pr-4 font-medium">항목</th>
                  <th className="py-3 pr-4 font-medium">2025학년도</th>
                  <th className="py-3 font-medium">2026학년도</th>
                </tr>
              </thead>
              <tbody className="font-light text-ink-700">
                {u.trend!.map((r, i) => (
                  <tr key={i} className="border-b border-hair align-top">
                    <td className="py-3 pr-4 font-medium text-ink-900">{r.item}</td>
                    <td className="py-3 pr-4">{r.y2025}</td>
                    <td className="py-3">{r.y2026}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {last === "trend" && tail}
        </PromoSection>
      )}

      {showPrep && (
        <PromoSection
          eyebrow="PREPARE"
          EyebrowIcon={ListChecks}
          title={`${u.short} 면접, 내 생기부로 준비하는 순서`}
          subtitle="공개 문항의 형식에서 거꾸로 짚은 준비 순서입니다."
          tone="muted"
        >
          <ol className="mx-auto max-w-4xl space-y-4">
            {u.prep!.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span className="tnum mt-0.5 text-[12px] font-semibold text-brass-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-light leading-[1.8] text-ink-700">
                  <span className="font-medium text-ink-900">{p.step}</span> — {p.detail}
                </span>
              </li>
            ))}
          </ol>
          {last === "prep" && tail}
        </PromoSection>
      )}

      {showInseong && (
        <PromoSection
          eyebrow="CHARACTER"
          EyebrowIcon={Users}
          title={`${u.short} 인성 질문 ${u.inseong!.length}개`}
          subtitle="인성 질문은 계열 구분 없이 공개되는 경우가 많아 범위를 함께 적었습니다."
          tone="muted"
        >
          <div className="mx-auto max-w-5xl overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-hair-strong text-ink-500">
                  <th className="py-3 pr-3 font-medium">학년도</th>
                  <th className="py-3 pr-3 font-medium">범위</th>
                  <th className="py-3 pr-3 font-medium">근거 기록</th>
                  <th className="py-3 pr-3 font-medium">묻는 것</th>
                  <th className="py-3 font-medium">답변 포인트</th>
                </tr>
              </thead>
              <tbody className="font-light text-ink-700">
                {[...u.inseong!]
                  .sort((a, b) => b.year - a.year)
                  .map((r, i) => (
                    <tr key={i} className="border-b border-hair align-top">
                      <td className="tnum py-3 pr-3">{r.year}</td>
                      <td className="py-3 pr-3">{r.unit ?? ""}</td>
                      <td className="py-3 pr-3">{r.record}</td>
                      <td className="py-3 pr-3">{r.ask}</td>
                      <td className="py-3">{r.point}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-6 max-w-4xl text-[14px] font-light leading-[1.8] text-ink-700">
            <BookOpenCheck className="mr-1.5 inline h-4 w-4 align-[-3px] text-jade-600" strokeWidth={1.75} />
            답의 순서는 같습니다. 장면 하나(언제·무엇) → 내가 한 행동 → 그때 중요하게 본 기준 → 결과나 바뀐 점입니다.
          </p>
          {last === "inseong" && tail}
        </PromoSection>
      )}
    </>
  );
}
