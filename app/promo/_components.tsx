import Link from "next/link";
import { ArrowRight, Check, LucideIcon } from "lucide-react";

/** ===== T Medi 프리미엄 promo 디자인 시스템 =====
 *  과기원(tgwagiwon.kr) 레퍼런스 수준의 고급스러운 랜딩 디자인.
 *  의약학(의치한약수) 메디컬 아이덴티티 — teal / cyan / emerald 팔레트.
 *
 *  ⚠️ 스타일링 주의: globals.css 의 semantic 토큰(--primary 등)은 rgb() 래핑이
 *  없는 공백 구분 RGB 트리플이라 `bg-primary` 등이 렌더되지 않는다.
 *  따라서 semantic 토큰을 절대 쓰지 말고 plain Tailwind 팔레트 클래스만 사용.
 *  (Tailwind v4 — 클래스명은 모두 정적 리터럴로 유지해 JIT 스캔이 되도록 함)
 */

/* 카드 아이콘 타일 — 카드 index 로 순환하는 쿨톤 그라디언트 세트 */
const TILES = [
  "from-teal-500 to-cyan-500",
  "from-cyan-500 to-sky-500",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-indigo-500",
  "from-teal-500 to-emerald-500",
  "from-indigo-500 to-cyan-500",
];

/** 어두운 배경 위 글로우 레이어 (히어로 / 최종 CTA 공용) */
function DarkGlow() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-44 -right-32 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />
    </>
  );
}

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
    <section className="relative isolate overflow-hidden bg-slate-950">
      <DarkGlow />
      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:px-12 sm:py-32">
        {badge && (
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-teal-100 backdrop-blur">
            {Icon && <Icon className="h-3.5 w-3.5 text-teal-300" />}
            {badge}
          </div>
        )}
        <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-6xl">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                {highlight}
              </span>
            </>
          )}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          {body}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:brightness-110"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-medium text-white backdrop-blur transition hover:bg-white/10"
            >
              {secondaryLabel || "더 알아보기"}
            </Link>
          )}
        </div>
        {stats && stats.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {stats.map((s) => {
              const SIcon = s.icon;
              return (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200 backdrop-blur"
                >
                  {SIcon && <SIcon className="h-3.5 w-3.5 text-teal-300" />}
                  {s.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

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
  return (
    <section
      className={
        tone === "muted"
          ? "bg-slate-50 px-6 py-20 sm:px-12 sm:py-28"
          : "bg-white px-6 py-20 sm:px-12 sm:py-28"
      }
    >
      <div className="mx-auto max-w-6xl">
        {(title || subtitle || eyebrow) && (
          <div className="text-center">
            {eyebrow && (
              <div className="mb-4 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5" />}
                  {eyebrow}
                </span>
              </div>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={title || subtitle || eyebrow ? "mt-14" : ""}>
          {children}
        </div>
      </div>
    </section>
  );
}

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
    <div className={`grid gap-5 ${cols}`}>
      {items.map((f, i) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                TILES[i % TILES.length]
              } text-white shadow-md shadow-teal-500/20`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {f.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function StepList({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="mx-auto max-w-3xl space-y-4">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="group flex gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/10"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-base font-bold text-white shadow-md shadow-teal-500/25">
            {i + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {s.title.replace(/^\d+\.\s*/, "")}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {s.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <li
          key={r}
          className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm leading-relaxed text-slate-700 shadow-sm transition hover:border-teal-200 hover:shadow-md"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

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
      <div className="relative overflow-hidden rounded-3xl border border-teal-200/70 bg-white shadow-xl shadow-teal-500/10">
        {/* 그라디언트 헤더 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 px-8 py-10 text-center text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="relative">
            {courseName && (
              <p className="text-sm font-medium text-teal-50/90">{courseName}</p>
            )}
            <p className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
              {price}
              {priceSuffix && (
                <span className="ml-2 align-middle text-lg font-medium text-teal-50/90">
                  {priceSuffix}
                </span>
              )}
            </p>
            {badge && (
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium backdrop-blur">
                {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
                {badge}
              </p>
            )}
          </div>
        </div>
        {/* 포함 사항 */}
        <div className="grid gap-3 px-8 py-8 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        {/* 하단 노트 chips */}
        {notes && notes.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-100 bg-slate-50 px-8 py-5 text-sm text-slate-600">
            {notes.map((n) => {
              const NIcon = n.icon;
              return (
                <span key={n.label} className="inline-flex items-center gap-1.5">
                  {NIcon && <NIcon className="h-4 w-4 text-teal-600" />}
                  {n.label}
                </span>
              );
            })}
          </div>
        )}
        {/* CTA */}
        <div className="px-8 pb-8 pt-2">
          <Link
            href={href}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:brightness-110"
          >
            {label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

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
    <section className="relative isolate overflow-hidden bg-slate-950">
      <DarkGlow />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:px-12 sm:py-28">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">{body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:brightness-110"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
