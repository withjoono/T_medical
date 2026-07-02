import Link from "next/link";
import { ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";

/** ===== 공통 promo 컴포넌트 =====
 *  거북스쿨 위성앱 promo 공통 패턴 (ExamHub/과기원 레퍼런스 기반).
 *  T Medi (의약학 · 의치한약수 진학) promo 페이지 전용.
 *
 *  ⚠️ 스타일링 주의: 이 앱(globals.css)의 semantic 토큰(--primary 등)은
 *  공백 구분 RGB 트리플(예: `255 107 53`)로 정의돼 있고 rgb() 래핑이 없어
 *  `bg-primary` 등 유틸리티가 실제로는 렌더되지 않는다(background-color: 255 107 53 = 무효).
 *  따라서 홈페이지와 동일하게 plain Tailwind 팔레트 클래스(teal/emerald 메디컬 액센트)만 사용.
 */

export function PromoHero({
  badge,
  title,
  highlight,
  body,
  primaryHref = "/",
  primaryLabel = "시작하기",
  secondaryHref,
  secondaryLabel,
  Icon,
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
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:px-12 sm:py-24">
        {badge && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-700 shadow-sm">
            {Icon && <Icon className="h-3.5 w-3.5 text-teal-600" />}
            {badge}
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {title}
          {highlight && <span className="text-teal-600"> {highlight}</span>}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">{body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-teal-500/20 transition-colors hover:bg-teal-700"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              {secondaryLabel || "더 알아보기"}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function PromoSection({
  title,
  subtitle,
  children,
  tone = "default",
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <section
      className={
        tone === "muted"
          ? "bg-slate-50 px-6 py-16 sm:px-12 sm:py-20"
          : "bg-white px-6 py-16 sm:px-12 sm:py-20"
      }
    >
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className="text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">{subtitle}</p>
            )}
          </div>
        )}
        <div className={title || subtitle ? "mt-12" : ""}>{children}</div>
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
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((f) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            </div>
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
    <ol className="space-y-4">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
            {i + 1}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((r) => (
        <li
          key={r}
          className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

export function FinalCTA({
  title,
  body,
  Icon,
  primaryHref = "/",
  primaryLabel = "시작하기",
}: {
  title: string;
  body: string;
  Icon: LucideIcon;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-slate-600">{body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-teal-500/20 transition-colors hover:bg-teal-700"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
