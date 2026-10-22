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
 * 허브 — 유형별로 나눠 대학으로 뿌린다
 * ---------------------------------------------------------------------- */

export function FieldTypeSections({ field }: { field: FieldPage }) {
  const groups = fieldByStyle(field.univs);
  const withInterview = field.univs.filter((u) => u.style !== "none").length;
  const disclosed = sourceDisclosedCount(field);
  return (
    <div className="mx-auto max-w-5xl space-y-16">
      {groups.map((g) => {
        const meta = styleGroupMeta(field, g.style);
        return (
          <div key={g.style}>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="display text-[1.25rem] leading-snug text-ink-900">
                {meta.label}
              </h3>
              <span
                className={`border px-2 py-0.5 text-[11px] font-semibold tracking-tight ${TONE[g.style]}`}
              >
                {g.univs.length}개 대학
              </span>
            </div>
            <p className="mt-4 max-w-3xl text-[14px] font-light leading-[1.85] text-ink-600">
              {meta.blurb}
            </p>

            <div className="mt-8 grid gap-px bg-hair sm:grid-cols-2">
              {g.univs.map((u) => {
                const d = fieldEarliest(u);
                return (
                  <Link
                    key={u.slug}
                    href={`${field.base}/${u.slug}`}
                    className="group flex flex-col bg-white p-7 transition-colors duration-300 hover:bg-paper-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="display flex items-center gap-2 text-[1.0625rem] leading-snug text-ink-900">
                        <span className="link-underline">
                          {u.short} {field.unitLabel}
                        </span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-brass-600 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={1.75}
                        />
                      </h4>
                      <span className="shrink-0 text-[11px] font-light text-ink-400">
                        {u.zone}
                      </span>
                    </div>

                    <p className="mt-3 text-[13px] font-light leading-[1.8] text-ink-600">
                      {u.headline}
                    </p>

                    <dl className="mt-5 space-y-1.5 border-t border-hair pt-4">
                      {u.source && (
                        <div className="flex gap-2 text-[12px] font-light text-ink-500">
                          <dt className="w-[62px] shrink-0 text-ink-400">질문 출처</dt>
                          <dd className="text-ink-700">{u.source.label}</dd>
                        </div>
                      )}
                      {u.scoring && (
                        <div className="flex gap-2 text-[12px] font-light text-ink-500">
                          <dt className="w-[62px] shrink-0 text-ink-400">평가 배점</dt>
                          <dd className="text-ink-700">{u.scoring.label}</dd>
                        </div>
                      )}
                      <div className="flex gap-2 text-[12px] font-light text-ink-500">
                        <dt className="w-[62px] shrink-0 text-ink-400">면접일</dt>
                        <dd className="tnum text-ink-700">
                          {d ? formatKo(d) : u.style === "none" ? "면접 없음" : "미공지"}
                        </dd>
                      </div>
                    </dl>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <NoteBox
        title="유형 묶음과 '질문 출처' 는 다른 것입니다"
        items={[
          "위 묶음은 요강에 제시문·현장 문항이 적혀 있는 대학과 그렇지 않은 대학을 가른 것입니다. 준비물을 정하기 위한 실무적 구분입니다.",
          "'인적성' 은 평가 배점의 이름이고 '서류 기반' 은 질문 출처의 이름입니다. 서로 다른 축이라 한 대학이 둘 다에 해당할 수 있습니다. 그래서 대학마다 두 줄을 따로 적었습니다.",
          `질문 출처를 요강에 명시한 대학은 면접 실시 ${withInterview}곳 중 ${disclosed}곳입니다. '요강 미기재' 인 대학은 진행 방식을 1단계 합격자 발표 공지에서 확인해야 합니다.`,
        ]}
        Icon={Scale}
      />
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
