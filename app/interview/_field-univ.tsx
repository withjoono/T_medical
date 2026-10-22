import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  Scale,
  Target,
} from "lucide-react";
import { formatKo } from "@/lib/mmi-schedule";
import {
  fieldByStyle,
  fieldEarliest,
  fieldTightestGap,
  type FieldStyle,
  type FieldUniv,
} from "@/lib/field-interview";
import {
  sourceDisclosedCount,
  styleGroupMeta,
  type FieldPage,
} from "@/lib/field-registry";
import { NoteBox } from "../_site/components";

/** =========================================================================
 *  계열 허브의 '유형 분리 섹션' 과 대학별 상세 페이지 본문. 전부 서버 컴포넌트다 —
 *  대학·전형·일정이 HTML 에 박혀야 색인된다.
 *
 *  허브는 유형 → 대학으로 보내는 진입점만 담고, 요강 상세는 대학 페이지가 갖는다.
 *  같은 내용을 두 곳에 중복으로 두지 말 것(허브가 길어지고 색인도 갈린다).
 *  ========================================================================= */

const TONE: Record<FieldStyle, string> = {
  jesimun: "border-jade-200 bg-jade-50 text-jade-700",
  injeokseong: "border-brass-200 bg-brass-50 text-brass-600",
  none: "border-hair bg-paper-100 text-ink-400",
};

/* -------------------------------------------------------------------------
 * 허브 — 대학 그리드 하나가 유일한 진입점
 *
 *  ⚠️ 유형(제시문/인적성)으로 묶지 않는다. 치대 9곳 중 질문 출처를 요강에
 *     밝힌 곳은 3곳뿐이라, 나머지는 '제시문이 안 적혀 있다' 는 이유로 묶이는
 *     셈이 된다. 없는 것으로 만든 분류이고, 같은 묶음 안의 준비가 서로 전혀
 *     다르다(경북대 과락 회피 / 강원대 적성 60% / 경희대 출제문항 없음).
 *     방문자가 늘 아는 것은 지원 대학 이름 하나뿐이므로 대학이 진입 단위다.
 *     유형은 카드 위의 라벨로만 남기고, 제시문·미실시는 분류가 아니라 경고로 낸다.
 *
 *  정렬은 면접일 순이다. 지금 시점에 가장 급한 정보는 '내 면접이 몇 주 남았나'
 *  이고, 복수 지원자는 일정이 겹치는지를 여기서 바로 본다.
 * ---------------------------------------------------------------------- */

function sortForHub(univs: FieldUniv[]) {
  return [...univs].sort((a, b) => {
    const da = fieldEarliest(a);
    const db = fieldEarliest(b);
    // 면접일 있는 대학 → 면접 실시이나 일정 미공지 → 면접 미실시
    const rank = (u: FieldUniv, d: string | null) => (d ? 0 : u.style === "none" ? 2 : 1);
    const ra = rank(a, da);
    const rb = rank(b, db);
    if (ra !== rb) return ra - rb;
    if (da && db && da !== db) return da < db ? -1 : 1;
    return a.short.localeCompare(b.short, "ko");
  });
}

function Callout({
  label,
  field,
  univs,
  tone,
}: {
  label: string;
  field: FieldPage;
  univs: FieldUniv[];
  tone: "jesimun" | "none";
}) {
  if (univs.length === 0) return null;
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 border px-5 py-3.5 ${TONE[tone]}`}>
      <span className="text-[12px] font-semibold tracking-tight">{label}</span>
      <span className="flex flex-wrap gap-x-2 gap-y-1">
        {univs.map((u) => (
          <Link
            key={u.slug}
            href={`${field.base}/${u.slug}`}
            className="text-[13px] font-light text-ink-700 underline decoration-ink-300 underline-offset-4 transition-colors hover:text-ink-900 hover:decoration-ink-700"
          >
            {u.short}
          </Link>
        ))}
      </span>
    </div>
  );
}

export function FieldUnivGrid({ field }: { field: FieldPage }) {
  const sorted = sortForHub(field.univs);
  const withInterview = field.univs.filter((u) => u.style !== "none").length;
  const disclosed = sourceDisclosedCount(field);
  const jesimun = field.univs.filter((u) => u.style === "jesimun");
  const none = field.univs.filter((u) => u.style === "none");
  const jesimunLabel = styleGroupMeta(field, "jesimun").label;

  return (
    <div className="mx-auto max-w-5xl">
      {(jesimun.length > 0 || none.length > 0) && (
        <div className="mb-10 space-y-2.5">
          <Callout
            label={`${jesimunLabel} — 생기부 복기로는 대비되지 않습니다`}
            field={field}
            univs={jesimun}
            tone="jesimun"
          />
          <Callout label="면접 미실시 — 요강 기준" field={field} univs={none} tone="none" />
        </div>
      )}

      <div className="grid gap-px bg-hair sm:grid-cols-2">
        {sorted.map((u) => {
          const d = fieldEarliest(u);
          return (
            <Link
              key={u.slug}
              href={`${field.base}/${u.slug}`}
              className="group flex flex-col bg-white p-7 transition-colors duration-300 hover:bg-paper-50"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`tnum text-[13px] font-semibold tracking-tight ${
                    d ? "text-jade-700" : "text-ink-400"
                  }`}
                >
                  {d ? formatKo(d) : u.style === "none" ? "면접 없음" : "면접일 미공지"}
                </span>
                <span className="shrink-0 text-[11px] font-light text-ink-400">{u.zone}</span>
              </div>

              <h3 className="display mt-3 flex items-center gap-2 text-[1.0625rem] leading-snug text-ink-900">
                <span className="link-underline">
                  {u.short} {field.unitLabel}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-brass-600 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.75}
                />
              </h3>

              <span
                className={`mt-3 w-fit border px-2 py-0.5 text-[11px] font-semibold tracking-tight ${TONE[u.style]}`}
              >
                {u.styleLabel}
              </span>

              <p className="mt-4 text-[13px] font-light leading-[1.8] text-ink-600">{u.headline}</p>

              {(u.source || u.scoring) && (
                <dl className="mt-5 space-y-1.5 border-t border-hair pt-4">
                  {u.source && (
                    <div className="flex gap-2 text-[12px] font-light">
                      <dt className="w-[62px] shrink-0 text-ink-400">질문 출처</dt>
                      <dd className="text-ink-700">{u.source.label}</dd>
                    </div>
                  )}
                  {u.scoring && (
                    <div className="flex gap-2 text-[12px] font-light">
                      <dt className="w-[62px] shrink-0 text-ink-400">평가 배점</dt>
                      <dd className="text-ink-700">{u.scoring.label}</dd>
                    </div>
                  )}
                </dl>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <NoteBox
          title="'인적성' 과 '생기부 기반' 은 같은 축의 말이 아닙니다"
          items={[
            "'인적성' 은 평가 배점의 이름이고 '생기부 기반' 은 질문 출처의 이름입니다. 서로 다른 축이라 한 대학이 둘 다에 해당할 수 있습니다. 그래서 유형으로 묶지 않고 대학마다 두 줄을 따로 적었습니다.",
            `질문 출처를 요강에 명시한 대학은 면접 실시 ${withInterview}곳 중 ${disclosed}곳입니다. '요강 미기재' 인 대학은 진행 방식을 1단계 합격자 발표 공지에서 확인해야 합니다 — 없는 값을 추정해 채우지 않았습니다.`,
            "면접일이 같은 날에 몰린 대학이 있는지 먼저 보십시오. 복수 지원에서 가장 먼저 걸리는 것이 일정 충돌입니다.",
          ]}
          Icon={Scale}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 대학 상세 — 두 축 블록
 * ---------------------------------------------------------------------- */

export function FieldAxisPair({ univ }: { univ: FieldUniv }) {
  const axes = [
    { key: "질문 출처", icon: FileText, axis: univ.source, hint: "질문이 어디서 나오는가" },
    { key: "평가 배점", icon: Scale, axis: univ.scoring, hint: "무엇에 점수를 주는가" },
  ].filter((a) => a.axis);
  if (axes.length === 0) return null;

  return (
    <div className="mx-auto grid max-w-4xl gap-px bg-hair sm:grid-cols-2">
      {axes.map((a) => {
        const Icon = a.icon;
        return (
          <div key={a.key} className="bg-white p-8">
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0 text-jade-600" strokeWidth={1.75} />
              <p className="eyebrow text-brass-600">{a.key}</p>
            </div>
            <p className="mt-1 text-[11px] font-light text-ink-400">{a.hint}</p>
            <p className="display mt-5 text-[1.0625rem] leading-snug text-ink-900">
              {a.axis!.label}
            </p>
            <p className="mt-3 text-[13px] font-light leading-[1.8] text-ink-600">
              {a.axis!.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 대학 상세 — 요강 문장 · 훈련 포인트
 * ---------------------------------------------------------------------- */

export function FieldFormatDrills({ univ }: { univ: FieldUniv }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-brass-600">요강에 적힌 면접 방식</p>
        <ul className="mt-5 space-y-3">
          {univ.format.map((f) => (
            <li
              key={f}
              className="flex gap-2.5 text-[14px] font-light leading-[1.8] text-ink-700"
            >
              <Check className="mt-1.5 h-3.5 w-3.5 shrink-0 text-jade-600" strokeWidth={2} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow text-brass-600">이 대학에 맞춘 훈련 포인트</p>
        <ul className="mt-5 space-y-3">
          {univ.drills.map((d) => (
            <li
              key={d}
              className="flex gap-2.5 text-[14px] font-light leading-[1.8] text-ink-700"
            >
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brass-400" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 대학 상세 — 전형 표(면접 실시 / 미실시를 나눠 싣는다)
 * ---------------------------------------------------------------------- */

function TrackTable({
  title,
  tracks,
  withDates,
}: {
  title: string;
  tracks: FieldUniv["tracks"];
  withDates: boolean;
}) {
  if (tracks.length === 0) return null;
  const head = withDates
    ? ["전형", "모집", "반영 비율", "수능 최저", "1단계 발표", "면접일"]
    : ["전형", "모집", "반영 비율", "수능 최저"];
  return (
    <div className="mx-auto max-w-5xl">
      <p className="eyebrow text-brass-600">{title}</p>
      <div
        role="region"
        aria-label={title}
        tabIndex={0}
        className="comparison-scroll mt-5 overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-ink text-paper">
              {head.map((h, i) => (
                <th
                  key={h}
                  className={`px-5 py-4 text-[13px] font-semibold tracking-tight ${
                    i > 0 ? "border-l border-white/10" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tracks.map((t) => (
              <tr key={t.name} className="align-top">
                <td className="border-b border-hair px-5 py-4 font-medium text-ink-900">
                  {t.name}
                  <span className="ml-1.5 text-[11px] font-light text-ink-400">{t.kind}</span>
                </td>
                <td className="tnum border-b border-l border-hair px-5 py-4 text-ink-600">
                  {t.quota === null ? "—" : `${t.quota}명`}
                </td>
                <td className="border-b border-l border-hair px-5 py-4 text-[12px] font-light leading-relaxed text-ink-600">
                  {t.weight}
                </td>
                <td className="border-b border-l border-hair px-5 py-4 text-[12px] font-light leading-relaxed text-ink-600">
                  {t.minimum ?? "요강 미기재"}
                </td>
                {withDates && (
                  <>
                    <td className="tnum border-b border-l border-hair px-5 py-4 text-ink-500">
                      {t.announce ? formatKo(t.announce) : "미공지"}
                    </td>
                    <td className="tnum border-b border-l border-hair px-5 py-4 font-medium text-jade-700">
                      {t.date ? formatKo(t.date) : "미공지"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FieldTrackTables({ univ }: { univ: FieldUniv }) {
  const iv = univ.tracks.filter((t) => t.interview);
  const no = univ.tracks.filter((t) => !t.interview);
  return (
    <div className="space-y-14">
      <TrackTable title="면접을 실시하는 전형" tracks={iv} withDates />
      <TrackTable title="면접이 없는 전형" tracks={no} withDates={false} />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 대학 상세 — 발표에서 면접까지 역산
 * ---------------------------------------------------------------------- */

export function FieldCountdown({ univ }: { univ: FieldUniv }) {
  const tight = fieldTightestGap(univ);
  if (!tight) return null;
  return (
    <div className="mx-auto flex max-w-4xl bg-jade-50">
      <span className="w-[3px] shrink-0 bg-jade-600" />
      <div className="px-7 py-6">
        <div className="flex items-center gap-2.5">
          <CalendarDays className="h-4 w-4 shrink-0 text-jade-700" strokeWidth={1.75} />
          <h3 className="display text-[15px] text-ink-900">
            1단계 발표에서 면접까지 {tight.days}일
          </h3>
        </div>
        <p className="mt-3 text-[14px] font-light leading-[1.8] text-ink-700">
          {tight.track.name} 기준으로 {formatKo(tight.track.announce!)} 발표,{" "}
          {formatKo(tight.track.date!)} 면접입니다.
          {tight.days <= 3
            ? " 발표를 보고 시작하면 유형을 익히다 끝납니다. 발표 전에 기본기를 만들어 두어야 하는 구간입니다."
            : tight.days <= 8
              ? " 이 구간에는 새 유형을 익힐 시간이 없습니다. 모의면접과 피드백 회차만 돌리는 일정으로 잡아야 합니다."
              : " 발표 후에도 회차를 넣을 수 있는 폭입니다. 다만 같은 기간에 다른 대학 면접이 겹치는지 먼저 확인하세요."}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * 대학 상세 — 같은 유형의 다른 대학으로 건너가기
 * ---------------------------------------------------------------------- */

export function FieldSiblings({
  field,
  univs,
  label,
}: {
  field: FieldPage;
  univs: FieldUniv[];
  label: string;
}) {
  if (univs.length === 0) return null;
  return (
    <div className="mx-auto max-w-5xl">
      <p className="eyebrow text-brass-600">{label}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {univs.map((u) => (
          <Link
            key={u.slug}
            href={`${field.base}/${u.slug}`}
            className="group flex items-center gap-2 border border-hair-strong bg-white px-4 py-2.5 text-[13px] font-light text-ink-700 transition-colors duration-300 hover:border-jade-600 hover:text-ink-900"
          >
            <Target className="h-3.5 w-3.5 shrink-0 text-jade-600" strokeWidth={1.75} />
            <span>{u.short}</span>
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 text-brass-600 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
