import Link from "next/link";
import { ArrowRight, Check, LucideIcon } from "lucide-react";

/** =========================================================================
 *  T Medi — promo 디자인 시스템
 *  "Medical Institute / Editorial" : 의학 저널과 기관 인쇄물의 문법.
 *
 *  이 파일의 컴포넌트만 고치면 promo 전 페이지의 인상이 함께 바뀐다.
 *  (대부분의 페이지는 마크업 없이 이 컴포넌트에 데이터만 넘긴다)
 *
 *  규칙 — globals.css 의 @theme 토큰으로 만들어진 유틸리티만 쓴다.
 *    ink(권위) / jade(의학) / brass(품격) / paper(바탕) / hair(구획선)
 *    · 모서리는 각지게. rounded-* 는 배지·버튼에만 최소로.
 *    · 그라디언트는 잉크 그라운드와 브라스 헤어라인에만.
 *    · 표제와 숫자는 .display(본명조), 숫자 정렬은 .tnum.
 *  ========================================================================= */

/* -------------------------------------------------------------------------
 * 공통 프리미티브
 * ---------------------------------------------------------------------- */

/** 잉크 그라운드 — 히어로 / 최종 CTA 공용 배경.
 *  블러 블롭 대신 도면 그리드 + 종이 그레인 + 아주 옅은 제이드 광원. */
function InkGround() {
  return (
    <>
      <div className="absolute inset-0 bg-ink" />
      <div className="blueprint absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[38rem] w-[52rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-jade-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,15,21,0.75)_100%)]" />
      <div className="brass-rule absolute inset-x-0 top-0 h-px opacity-70" />
    </>
  );
}

/** 섹션 상단 라벨 — 좌우 헤어라인을 거느린 트래킹 캡션. */
function Eyebrow({
  label,
  Icon,
  onDark = false,
}: {
  label: string;
  Icon?: LucideIcon;
  onDark?: boolean;
}) {
  const tone = onDark ? "text-brass-300" : "text-brass-600";
  const rule = onDark ? "bg-white/20" : "bg-hair-strong";
  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`hidden h-px w-10 sm:block ${rule}`} />
      <span className={`eyebrow inline-flex items-center gap-2 ${tone}`}>
        {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
        {label}
      </span>
      <span className={`hidden h-px w-10 sm:block ${rule}`} />
    </div>
  );
}

/** 잉크 그라운드 위의 주 버튼 — 종이색 솔리드. 그라디언트를 쓰지 않는다. */
function LightButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-sm bg-paper px-8 py-4 text-[15px] font-semibold tracking-tight text-ink transition duration-300 hover:bg-white"
    >
      {label}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={2}
      />
    </Link>
  );
}

/** 밝은 바탕 위의 주 버튼 — 잉크 솔리드. */
export function InkButton({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-sm bg-ink px-8 py-4 text-[15px] font-semibold tracking-tight text-paper transition duration-300 hover:bg-ink-800 ${className}`}
    >
      {label}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={2}
      />
    </Link>
  );
}

/* -------------------------------------------------------------------------
 * 히어로
 * ---------------------------------------------------------------------- */

export function PromoHero({
  badge,
  title,
  highlight,
  body,
  primaryHref = "#contact",
  primaryLabel = "시작하기",
  secondaryHref,
  secondaryLabel,
  Icon,
  stats,
}: {
  badge?: string;
  title: string;
  highlight?: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  Icon?: LucideIcon;
  stats?: { icon?: LucideIcon; label: string }[];
}) {
  return (
    <section className="promo-hero grain relative isolate overflow-hidden">
      <InkGround />

      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center sm:px-12 sm:pb-28 sm:pt-32">
        {badge && (
          <div className="mb-9 flex items-center justify-center gap-3">
            <span className="hidden h-px w-8 bg-white/20 sm:block" />
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-ink-200">
              {Icon && (
                <Icon className="h-3.5 w-3.5 text-jade-400" strokeWidth={1.75} />
              )}
              {badge}
            </span>
            <span className="hidden h-px w-8 bg-white/20 sm:block" />
          </div>
        )}

        {/* 모바일 글자 크기는 32px 로 묶는다 — 한글 표제가 어절 중간에서
            강제로 잘리는 것(예: "생기부," 앞의 · 가 다음 줄로 넘어감)을 막는다.
            highlight 는 폭과 무관하게 항상 다음 줄로 내려 고아 음절을 없앤다. */}
        <h1 className="display text-[2rem] leading-[1.32] text-white sm:text-6xl sm:leading-[1.18]">
          {title}
          {highlight && (
            <span className="mt-1 block text-jade-400 sm:mt-2">{highlight}</span>
          )}
        </h1>

        <div className="mx-auto mt-9 h-px w-16 bg-brass-400/50" />

        <p className="mx-auto mt-8 max-w-2xl text-[17px] font-light leading-[1.85] text-ink-300">
          {body}
        </p>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
          <LightButton href={primaryHref} label={primaryLabel} />
          {secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center rounded-sm border border-white/25 px-8 py-4 text-[15px] font-medium tracking-tight text-white transition duration-300 hover:border-white/60 hover:bg-white/5"
            >
              {secondaryLabel || "더 알아보기"}
            </Link>
          )}
        </div>
      </div>

      {/* 하단 지표 띠 — 알약 배지 대신 세로 헤어라인으로 나눈 인덱스.
          칸 수를 항목 수에 맞춰야 오른쪽이 비어 보이지 않는다.
          (Tailwind JIT 가 스캔하도록 클래스는 정적 리터럴로 둔다) */}
      {stats && stats.length > 0 && (
        <div className="relative border-t border-white/10">
          <div
            className={`hero-stats mx-auto grid max-w-5xl grid-cols-2 ${
              stats.length === 2
                ? "sm:grid-cols-2"
                : stats.length === 3
                  ? "sm:grid-cols-3"
                  : "sm:grid-cols-4"
            }`}
          >
            {stats.map((s, i) => {
              const SIcon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`flex items-center justify-center gap-2 px-4 py-5 text-[13px] font-medium text-ink-200 ${
                    i % 2 === 1 ? "border-l border-white/10" : ""
                  } ${
                    i >= 2 ? "border-t border-white/10 sm:border-t-0" : ""
                  } ${i >= 2 ? "sm:border-l sm:border-white/10" : ""}`}
                >
                  {SIcon && (
                    <SIcon
                      className="h-4 w-4 shrink-0 text-jade-400"
                      strokeWidth={1.5}
                    />
                  )}
                  <span className="text-center">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 섹션 셸
 * ---------------------------------------------------------------------- */

export function PromoSection({
  title,
  subtitle,
  eyebrow,
  EyebrowIcon,
  children,
  tone = "default",
}: {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  EyebrowIcon?: LucideIcon;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  const hasHead = Boolean(title || subtitle || eyebrow);
  return (
    <section
      className={`promo-section border-t border-hair px-6 py-20 sm:px-12 sm:py-28 ${
        tone === "muted" ? "bg-paper-100" : "bg-paper"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        {hasHead && (
          <div className="text-center">
            {eyebrow && <Eyebrow label={eyebrow} Icon={EyebrowIcon} />}
            {title && (
              <h2
                className={`display text-[1.75rem] leading-[1.35] text-ink-900 sm:text-[2.25rem] sm:leading-[1.3] ${
                  eyebrow ? "mt-6" : ""
                }`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto mt-5 max-w-2xl text-[15px] font-light leading-[1.85] text-ink-500">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={hasHead ? "mt-14" : ""}>{children}</div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------
 * 콘텐츠 블록
 * ---------------------------------------------------------------------- */

/** 기능·특징 그리드 — 셀 사이를 헤어라인으로만 나눈 스펙 시트 형태. */
export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: { icon: LucideIcon; title: string; body: string }[];
  columns?: 2 | 3;
}) {
  const cols =
    columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div
      className={`feature-grid grid ${cols}`}
    >
      {items.map((f, i) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="feature-card group relative p-8 transition-colors duration-300"
          >
            {/* hover 시 상단에 그어지는 제이드 인디케이터 */}
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />

            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center border border-hair-strong bg-white text-jade-600 transition-colors duration-300 group-hover:border-jade-200 group-hover:bg-jade-50">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="display tnum text-sm text-brass-400">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="display mt-6 text-[1.0625rem] leading-snug text-ink-900">
              {f.title}
            </h3>
            <p className="mt-3 text-[14px] font-light leading-[1.8] text-ink-500">
              {f.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** 순서가 있는 단계 — 왼쪽 헤어라인 레일 위의 세리프 번호. */
export function StepList({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="mx-auto max-w-3xl border-l border-hair-strong">
      {steps.map((s, i) => (
        <li key={s.title} className="group relative pb-10 pl-8 last:pb-0">
          <span className="absolute -left-px top-0 h-full w-px origin-top scale-y-0 bg-jade-600 transition-transform duration-500 group-hover:scale-y-100" />
          <div className="flex items-baseline gap-3">
            <span className="display tnum text-sm text-brass-600">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display text-[1.125rem] leading-snug text-ink-900">
              {s.title.replace(/^\d+\.\s*/, "")}
            </h3>
          </div>
          <p className="mt-3 text-[14px] font-light leading-[1.85] text-ink-500">
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** 체크 목록 — 카드 대신 밑줄 한 줄로 구분한 명세 목록. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mx-auto grid max-w-4xl border-t border-hair sm:grid-cols-2">
      {items.map((r) => (
        <li
          key={r}
          className="flex items-start gap-3.5 border-b border-hair px-1 py-5 text-[14px] font-light leading-[1.8] text-ink-700 sm:odd:pr-8 sm:even:pl-8"
        >
          <Check
            className="mt-1 h-4 w-4 shrink-0 text-jade-600"
            strokeWidth={2.25}
          />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

/** 비교표 — 저널 표 문법. 잉크 헤더 + 헤어라인 행. */
export function CompareTable({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: string[][];
  caption?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <div role="region" aria-label={caption || "전형 비교표"} tabIndex={0} className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
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
            {rows.map((r, ri) => (
              <tr
                key={r[0] + ri}
                className={`transition-colors hover:bg-jade-50 ${
                  ri % 2 === 1 ? "bg-paper-100/60" : "bg-transparent"
                }`}
              >
                {r.map((c, ci) => (
                  <td
                    key={ci}
                    className={`border-t border-hair px-5 py-4 align-top ${
                      ci > 0 ? "border-l border-hair" : ""
                    } ${
                      ci === 0
                        ? "font-semibold tracking-tight text-ink-900"
                        : "font-light leading-[1.75] text-ink-600"
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="mt-4 text-center text-xs font-light leading-relaxed text-ink-400">
          {caption}
        </p>
      )}
    </div>
  );
}

/** 유의사항 박스 — 좌측 굵은 액센트 바. tone 으로 성격을 바꾼다. */
export function NoteBox({
  title,
  items,
  tone = "info",
  Icon,
}: {
  title: string;
  items: string[];
  tone?: "info" | "warn";
  Icon?: LucideIcon;
}) {
  const warn = tone === "warn";
  const bar = warn ? "bg-brass" : "bg-jade-600";
  const shell = warn ? "bg-brass-50" : "bg-jade-50";
  const accent = warn ? "text-brass-600" : "text-jade-700";
  const dot = warn ? "bg-brass-400" : "bg-jade-400";
  return (
    <div className={`mx-auto flex max-w-4xl ${shell}`}>
      <span className={`w-[3px] shrink-0 ${bar}`} />
      <div className="px-7 py-6">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <Icon className={`h-4 w-4 shrink-0 ${accent}`} strokeWidth={1.75} />
          )}
          <h3 className="display text-[15px] text-ink-900">{title}</h3>
        </div>
        <ul className="mt-4 space-y-3">
          {items.map((t) => (
            <li
              key={t}
              className="flex gap-3 text-[14px] font-light leading-[1.8] text-ink-700"
            >
              <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${dot}`} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** 경로 타임라인 — 단계와 소요 기간이 있는 흐름(해외 의대 루트 등). */
export function RouteTimeline({
  steps,
}: {
  steps: { stage: string; title: string; body: string; meta?: string }[];
}) {
  return (
    <ol className="relative mx-auto max-w-3xl border-l border-hair-strong pl-10">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className={`group relative ${i === steps.length - 1 ? "" : "pb-12"}`}
        >
          <span className="display tnum absolute -left-[3.25rem] flex h-8 w-8 items-center justify-center rounded-full border border-hair-strong bg-paper text-[11px] text-ink-700 transition-colors duration-300 group-hover:border-jade-600 group-hover:bg-jade-600 group-hover:text-white">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow text-brass-600">{s.stage}</span>
            {s.meta && (
              <span className="text-xs font-light text-ink-400">{s.meta}</span>
            )}
          </div>
          <h3 className="display mt-3 text-[1.125rem] leading-snug text-ink-900">
            {s.title}
          </h3>
          <p className="mt-2.5 text-[14px] font-light leading-[1.85] text-ink-500">
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** 다른 페이지로 보내는 링크 블록 — 헤어라인 카드 + 자라나는 밑줄. */
export function LinkCards({
  items,
  columns = 2,
}: {
  items: { href: string; icon: LucideIcon; title: string; body: string }[];
  columns?: 2 | 3;
}) {
  const cols =
    columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div
      className={`link-grid grid ${cols}`}
    >
      {items.map((c) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.href + c.title}
            href={c.href}
            className="link-card group relative flex flex-col p-8 transition-colors duration-300"
          >
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />
            <Icon className="h-5 w-5 text-jade-600" strokeWidth={1.5} />
            <h3 className="display mt-6 flex items-center gap-2 text-[1.0625rem] leading-snug text-ink-900">
              <span className="link-underline">{c.title}</span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-brass-600 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </h3>
            <p className="mt-3 text-[14px] font-light leading-[1.8] text-ink-500">
              {c.body}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

/** 수강료 카드 — 잉크 헤더 + 브라스 룰 + 세리프 금액. */
export function PriceCard({
  courseName,
  price,
  priceSuffix,
  badge,
  BadgeIcon,
  items,
  notes,
  href = "/",
  label = "상담하기",
}: {
  courseName?: string;
  price: string;
  priceSuffix?: string;
  badge?: string;
  BadgeIcon?: LucideIcon;
  items: string[];
  notes?: { icon?: LucideIcon; label: string }[];
  href?: string;
  label?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="border border-hair-strong bg-paper-50">
        {/* 헤더 */}
        <div className="grain relative isolate overflow-hidden px-8 py-12 text-center">
          <div className="absolute inset-0 bg-ink" />
          <div className="blueprint absolute inset-0 opacity-60" />
          <div className="brass-rule absolute inset-x-0 top-0 h-px" />
          <div className="relative">
            {courseName && <p className="eyebrow text-brass-300">{courseName}</p>}
            <p className="display tnum mt-5 text-[3.25rem] leading-none text-white sm:text-[3.75rem]">
              {price}
              {priceSuffix && (
                <span className="ml-2 align-middle text-lg font-light text-ink-300">
                  {priceSuffix}
                </span>
              )}
            </p>
            {badge && (
              <p className="mt-6 inline-flex items-center gap-2 border border-white/20 px-4 py-1.5 text-[13px] font-light text-ink-200">
                {BadgeIcon && (
                  <BadgeIcon
                    className="h-3.5 w-3.5 text-jade-400"
                    strokeWidth={1.75}
                  />
                )}
                {badge}
              </p>
            )}
          </div>
        </div>

        {/* 포함 사항 */}
        <div className="grid border-t border-hair sm:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={item}
              className={`flex items-start gap-3 border-b border-hair px-7 py-4 text-[14px] font-light leading-[1.75] text-ink-700 ${
                i % 2 === 1 ? "sm:border-l sm:border-hair" : ""
              }`}
            >
              <Check
                className="mt-1 h-3.5 w-3.5 shrink-0 text-jade-600"
                strokeWidth={2.5}
              />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* 노트 */}
        {notes && notes.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-b border-hair bg-paper-100 px-7 py-4 text-[13px] font-light text-ink-500">
            {notes.map((n) => {
              const NIcon = n.icon;
              return (
                <span key={n.label} className="inline-flex items-center gap-1.5">
                  {NIcon && (
                    <NIcon
                      className="h-3.5 w-3.5 text-jade-600"
                      strokeWidth={1.75}
                    />
                  )}
                  {n.label}
                </span>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="p-7">
          <InkButton href={href} label={label} className="w-full" />
        </div>
      </div>
    </div>
  );
}

/** 페이지 하단 전환 섹션. */
export function FinalCTA({
  title,
  body,
  Icon,
  primaryHref = "#contact",
  primaryLabel = "시작하기",
}: {
  title: string;
  body: string;
  Icon: LucideIcon;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="final-consultation grain relative isolate overflow-hidden">
      <InkGround />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:px-12 sm:py-28">
        <div className="inline-flex h-14 w-14 items-center justify-center border border-white/20 text-jade-400">
          <Icon className="h-6 w-6" strokeWidth={1.25} />
        </div>
        <h2 className="display mt-8 text-[1.875rem] leading-[1.35] text-white sm:text-[2.25rem]">
          {title}
        </h2>
        <div className="mx-auto mt-7 h-px w-16 bg-brass-400/50" />
        <p className="mx-auto mt-7 max-w-xl text-[15px] font-light leading-[1.85] text-ink-300">
          {body}
        </p>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
          <LightButton href={primaryHref} label={primaryLabel} />
        </div>
      </div>
    </section>
  );
}

/** 기준일·출처 각주 — 입시 데이터 페이지 하단 공통. */
export function SourceNote({ lines }: { lines: string[] }) {
  return (
    <section className="border-t border-hair bg-paper-100 px-6 py-14 sm:px-12">
      <div className="mx-auto max-w-4xl border-l border-hair-strong pl-6">
        <p className="eyebrow text-brass-600">데이터 기준 · 유의사항</p>
        <ul className="mt-4 space-y-2">
          {lines.map((l) => (
            <li key={l} className="text-xs font-light leading-[1.8] text-ink-400">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
