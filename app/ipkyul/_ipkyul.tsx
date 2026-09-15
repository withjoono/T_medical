import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import {
  type Field,
  type Unit,
  type Univ,
  byType,
  fieldTotals,
  measuredUnits,
} from "@/lib/ipkyul";

/** =========================================================================
 *  /ipkyul 전용 블록. 전부 서버 컴포넌트 — 숫자가 HTML 에 박혀야 색인된다.
 *
 *  ⚠️ 이 파일의 어떤 컴포넌트도 입결을 추정으로 채우지 않는다.
 *     cut 이 없으면 '—' 를 찍는다. lib/ipkyul/index.ts 머리말 참조.
 *  ========================================================================= */

const TONE: Record<string, { text: string; bg: string; border: string }> = {
  med:   { text: "text-jade-700",   bg: "bg-jade-50",   border: "border-jade-200" },
  dent:  { text: "text-ink-700",    bg: "bg-ink-100",   border: "border-ink-200" },
  kor:   { text: "text-brass-600",  bg: "bg-brass-50",  border: "border-brass-200" },
  pharm: { text: "text-jade-700",   bg: "bg-jade-50",   border: "border-jade-200" },
  vet:   { text: "text-ink-700",    bg: "bg-ink-100",   border: "border-ink-200" },
};


/** 수능최저는 program(전형) 단위 텍스트라 다른 모집단위 안내가 통째로 섞여 있다.
 *  (예: 계명대 교과전형 → 유아교육·경찰행정·간호학과 기준까지 한 문자열)
 *
 *  키워드를 고정 목록으로 두면 '혁신신약학과'가 '약학'으로 걸리는 식의 오탐이 난다.
 *  → 그 행의 모집단위명에서 직접 키워드를 뽑아 그것만 찾는다.
 *    ① '/' 로 나눈 절 중 키워드가 든 것만  ② 그 절 안에서도 키워드가 든 문장만 */
function pickMinimum(raw?: string, unit?: string): { text: string; trimmed: boolean } | null {
  if (!raw) return null;
  const full = raw.trim();
  if (!full || full === "없음" || full === "미적용") return full ? { text: full, trimmed: false } : null;

  const keys = ["의예", "의학", "치의", "한의", "수의", "약학"].filter((k) => (unit ?? "").includes(k));
  if (!keys.length) return { text: full, trimmed: false };
  const has = (t: string) => keys.some((k) => t.includes(k));

  const clauses = full.split(/\s*\/\s*/).filter(Boolean);
  const picked = clauses.filter(has);
  if (!picked.length) return { text: clauses[0] ?? full, trimmed: clauses.length > 1 };

  const text = picked
    .map((c) => {
      const sents = c.split(/(?<=\.)\s+/).filter(Boolean);
      const keep = sents.filter(has);
      return keep.length && keep.length < sents.length ? keep.join(" ") : c;
    })
    .join(" / ");
  return { text, trimmed: text.length < full.length };
}

function g(n?: number) {
  return n == null ? null : n.toFixed(2);
}

/** 등급 배지 — 숫자가 없으면 '—'. 추정으로 채우지 않는다. */
function Grade({ v, strong = false }: { v?: number; strong?: boolean }) {
  if (v == null) return <span className="text-ink-300">—</span>;
  return (
    <span className={`tnum ${strong ? "display text-[15px] text-ink-900" : "text-[13px] text-ink-700"}`}>
      {g(v)}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * 숫자 줄
 * ---------------------------------------------------------------------- */

export function FieldStats({ field }: { field: Field }) {
  const t = fieldTotals(field);
  const cells = [
    { k: "대학", v: String(t.univs), u: "개" },
    { k: "모집단위·전형", v: String(t.programs), u: "개" },
    { k: "수시 모집인원", v: t.quota.toLocaleString(), u: "명" },
    { k: "공시 입결 보유", v: String(t.measured), u: "개 전형" },
  ];
  return (
    <div className="grid border-l border-t border-hair bg-paper-50 sm:grid-cols-2 lg:grid-cols-4">
      {cells.map((c, i) => (
        <div key={c.k} className="border-b border-r border-hair px-6 py-7">
          <p className="eyebrow text-brass-600">{c.k}</p>
          <p className={`display tnum mt-3 text-[2rem] leading-none ${i === 3 ? "text-jade-700" : "text-ink-900"}`}>
            {c.v}
            <span className="ml-1.5 align-middle text-sm font-light text-ink-400">{c.u}</span>
          </p>
        </div>
      ))}
      <div className="col-span-full border-b border-r border-hair bg-paper-100 px-6 py-4">
        <p className="text-[13px] font-light leading-[1.8] text-ink-500">
          {t.measuredUnivs}개 대학이 공시 입결을 갖고 있습니다. 나머지 전형은 대학이 결과를 공개하지 않은 것이라
          <span className="font-medium text-ink-700"> 빈칸으로 둡니다</span> — 계열 평균으로 추정한 값을 입결처럼 싣지 않습니다.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 계열 페이지 — 대학별 요약표
 * ---------------------------------------------------------------------- */

/** 그 대학에서 가장 낮은(우수한) 50%컷 — 대학 간 비교용 대표값. */
function bestCut(u: Univ): number | undefined {
  const xs = measuredUnits(u).map((x) => x.cut?.g50).filter((v): v is number => v != null);
  return xs.length ? Math.min(...xs) : undefined;
}

export function UnivSummaryTable({ field }: { field: Field }) {
  const rows = [...field.univs].sort((a, b) => {
    const A = bestCut(a), B = bestCut(b);
    if (A == null && B == null) return b.quota - a.quota;
    if (A == null) return 1;
    if (B == null) return -1;
    return A - B;
  });
  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-x-auto border border-hair-strong bg-paper-50">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              {["대학", "지역", "수시 모집", "전형 수", "최우수 50%컷", "공시 입결"].map((h, i) => (
                <th key={h} className={`px-4 py-4 text-[12px] font-semibold tracking-tight ${i > 0 ? "border-l border-white/10" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((u, ri) => {
              const best = bestCut(u);
              const linkable = field.key === "uiye";
              return (
                <tr key={u.slug} className={ri % 2 === 1 ? "bg-paper-100/60" : ""}>
                  <td className="border-t border-hair px-4 py-3.5 align-top">
                    {linkable ? (
                      <Link href={`/ipkyul/${field.key}/${u.slug}`} className="link-underline font-semibold tracking-tight text-ink-900">
                        {u.name}
                      </Link>
                    ) : (
                      <span className="font-semibold tracking-tight text-ink-900">{u.name}</span>
                    )}
                  </td>
                  <td className="border-l border-t border-hair px-4 py-3.5 align-top text-[13px] font-light text-ink-500">
                    {u.region ?? "—"}
                  </td>
                  <td className="tnum border-l border-t border-hair px-4 py-3.5 align-top text-[13px] text-ink-700">
                    {u.quota.toLocaleString()}명
                  </td>
                  <td className="tnum border-l border-t border-hair px-4 py-3.5 align-top text-[13px] text-ink-700">
                    {u.units.length}
                  </td>
                  <td className="border-l border-t border-hair px-4 py-3.5 align-top">
                    <Grade v={best} strong />
                  </td>
                  <td className="tnum border-l border-t border-hair px-4 py-3.5 align-top text-[13px]">
                    {u.measured > 0 ? (
                      <span className="text-jade-700">{u.measured}개 전형</span>
                    ) : (
                      <span className="text-ink-300">없음</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-xs font-light leading-[1.8] text-ink-400">
        최우수 50%컷 = 그 대학 전형 중 가장 낮은 최종등록자 50%컷 등급. 등급은 낮을수록 우수합니다.
        대학마다 반영 교과·산출식이 달라 <span className="font-medium">등급을 그대로 비교하면 안 됩니다</span> — 대학별 페이지에서 산출 조건을 확인하세요.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 대학 페이지 — 전형별 표
 * ---------------------------------------------------------------------- */

function UnitRows({ units }: { units: Unit[] }) {
  return (
    <>
      {units.map((x, i) => (
        <tr key={`${x.program}-${x.unit}-${i}`} className={i % 2 === 1 ? "bg-paper-100/60" : ""}>
          <td className="border-t border-hair px-4 py-3.5 align-top">
            <span className="font-semibold tracking-tight text-ink-900">{x.program ?? "—"}</span>
            {x.unit && x.unit !== x.program && (
              <span className="mt-0.5 block text-[12px] font-light text-ink-400">{x.unit}</span>
            )}
          </td>
          <td className="tnum whitespace-nowrap border-l border-t border-hair px-4 py-3.5 align-top text-[13px] text-ink-700">
            {x.quota ? `${x.quota}명` : "—"}
          </td>
          <td className="whitespace-nowrap border-l border-t border-hair px-4 py-3.5 align-top">
            <Grade v={x.cut?.g50} strong />
          </td>
          <td className="whitespace-nowrap border-l border-t border-hair px-4 py-3.5 align-top">
            <Grade v={x.cut?.g70} />
          </td>
          <td className="whitespace-nowrap border-l border-t border-hair px-4 py-3.5 align-top text-[12px] font-light leading-[1.7] text-ink-600">
            {x.model ?? "—"}
            {x.ratio != null && x.ratio !== 100 && (
              <span className="tnum mt-0.5 block text-[11px] text-ink-400">1단계 {x.ratio}%</span>
            )}
          </td>
          <td className="border-l border-t border-hair px-4 py-3.5 align-top">
            {(() => {
              const m = pickMinimum(x.minimum, x.unit);
              if (!m) return <span className="text-ink-300">—</span>;
              return (
                <span className="block max-w-[320px] text-[12px] font-light leading-[1.7] text-ink-600">
                  {m.text}
                  {m.trimmed && (
                    <span className="mt-0.5 block text-[10px] text-ink-300">해당 모집단위 기준만 표시</span>
                  )}
                </span>
              );
            })()}
          </td>
        </tr>
      ))}
    </>
  );
}

export function ProgramTables({ univ }: { univ: Univ }) {
  const groups = byType(univ.units);
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {groups.map((grp) => (
        <div key={grp.type}>
          <h3 className="display mb-4 text-[1.0625rem] text-ink-900">
            {grp.type}전형
            <span className="ml-2 text-[13px] font-light text-ink-400">
              {grp.units.length}개 · {grp.units.reduce((a, x) => a + (x.quota || 0), 0)}명
            </span>
          </h3>
          <div className="overflow-x-auto border border-hair-strong bg-paper-50">
            <table className="w-full min-w-[880px] table-fixed border-collapse text-left text-sm">
              <colgroup>
                <col className="w-[210px]" />
                <col className="w-[72px]" />
                <col className="w-[78px]" />
                <col className="w-[78px]" />
                <col className="w-[92px]" />
                <col />
              </colgroup>
              <thead>
                <tr className="bg-ink text-paper">
                  {["전형", "모집", "50%컷", "70%컷", "선발모형", "수능최저"].map((h, i) => (
                    <th key={h} className={`whitespace-nowrap px-4 py-3.5 text-[12px] font-semibold tracking-tight ${i > 0 ? "border-l border-white/10" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <UnitRows units={grp.units} />
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 공통 경고 · 계열 카드
 * ---------------------------------------------------------------------- */

export function MeasuredOnlyNote() {
  return (
    <div className="mx-auto flex max-w-4xl bg-brass-50">
      <span className="w-[3px] shrink-0 bg-brass" />
      <div className="px-7 py-6">
        <div className="flex items-center gap-2.5">
          <TriangleAlert className="h-4 w-4 shrink-0 text-brass-600" strokeWidth={1.75} />
          <h3 className="display text-[15px] text-ink-900">이 표를 읽을 때</h3>
        </div>
        <ul className="mt-4 space-y-3">
          {[
            "빈칸(—)은 그 전형의 입결이 아직 공개되지 않았다는 뜻입니다. 낮다는 뜻이 아닙니다.",
            "대학마다 반영 교과·학년 비율·등급 환산식이 달라, 등급 숫자를 대학 간에 그대로 비교하면 안 됩니다.",
            "50%컷은 최종등록자의 중간값입니다. 합격 하한선이 아니라 '절반이 이보다 좋았다'는 지점입니다.",
            "충원(추가합격)으로 실제 합격선은 표의 숫자보다 내려가는 경우가 많습니다.",
          ].map((t) => (
            <li key={t} className="flex gap-3 text-[14px] font-light leading-[1.8] text-ink-700">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass-400" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FieldCards({ fields }: { fields: Field[] }) {
  return (
    <div className="grid overflow-hidden border-l border-t border-hair bg-paper-50 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((f) => {
        const t = fieldTotals(f);
        const tone = TONE[f.tone] ?? TONE.med;
        return (
          <Link
            key={f.key}
            href={`/ipkyul/${f.key}`}
            className="group relative flex flex-col border-b border-r border-hair p-7 transition-colors duration-300 hover:bg-white"
          >
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />
            <h3 className="display flex items-center gap-2 text-[1.125rem] leading-snug text-ink-900">
              <span className="link-underline">{f.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-brass-600 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
            </h3>
            <p className="mt-1.5 text-[12px] font-light text-ink-400">{f.college}</p>
            <dl className="mt-6 grid grid-cols-3 gap-px border-t border-hair bg-hair pt-px text-center">
              {[
                ["대학", `${t.univs}`],
                ["모집", `${t.quota.toLocaleString()}`],
                ["입결", `${t.measured}`],
              ].map(([k, v], i) => (
                <div key={k} className="bg-paper-50 px-1 py-3">
                  <dt className="text-[10px] font-medium tracking-wide text-ink-400">{k}</dt>
                  <dd className={`tnum display mt-1 text-[13px] ${i === 2 ? tone.text : "text-ink-900"}`}>{v}</dd>
                </div>
              ))}
            </dl>
          </Link>
        );
      })}
    </div>
  );
}
