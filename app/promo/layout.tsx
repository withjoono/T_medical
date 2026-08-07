import Link from "next/link";
import {
  ArrowRight,
  Home,
  ClipboardCheck,
  MessagesSquare,
  BookOpenCheck,
  Newspaper,
  Stethoscope,
  Phone,
  Mail,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/promo", label: "홈", icon: Home },
  { href: "/promo/susi", label: "수시컨설팅", icon: ClipboardCheck },
  { href: "/promo/interview", label: "면접 수업", icon: MessagesSquare },
  { href: "/promo/guide", label: "사용법", icon: BookOpenCheck },
  { href: "/promo/blog", label: "블로그", icon: Newspaper },
];

export default function PromoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ===== TOP NAV ===== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/promo" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-sm shadow-teal-500/30">
              <Stethoscope className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              T Medi
              <span className="ml-1.5 text-xs font-medium text-slate-400">
                의약학
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-500/30 transition hover:brightness-110"
          >
            시작하기
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* feature tabs */}
        <nav className="border-t border-slate-100 bg-white/60">
          <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
            <ul className="flex min-w-max items-center gap-1 py-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {children}

      {/* ===== FOOTER ===== */}
      <footer className="relative isolate overflow-hidden bg-slate-950 text-slate-300">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950" />
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-12">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-sm shadow-teal-500/30">
                  <Stethoscope className="h-4.5 w-4.5" />
                </div>
                <span className="text-base font-bold tracking-tight text-white">
                  T Medi
                  <span className="ml-1.5 text-xs font-medium text-slate-400">
                    의약학
                  </span>
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                의대·치대·한의대·약대·수의대(의치한약수) 진학 전문. 내신·모의고사·생기부·면접까지
                한 곳에서 관리하는 메디컬 진학 포털.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
              <Link href="/promo/susi" className="text-slate-300 transition hover:text-teal-300">
                수시컨설팅
              </Link>
              <Link href="/promo/interview" className="text-slate-300 transition hover:text-teal-300">
                면접 수업
              </Link>
              <Link href="/promo/guide" className="text-slate-300 transition hover:text-teal-300">
                사용법
              </Link>
              <Link href="/promo/blog" className="text-slate-300 transition hover:text-teal-300">
                블로그
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-teal-400" /> 010-2518-7139
              <span className="text-slate-500">(06:00~22:00)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-teal-400" /> withjuno@naver.com
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-1 text-xs text-slate-500">
            <span>거북스쿨 · 대표 강준호 · T Medi (의약학 · 의치한약수 진학 전문)</span>
            <span>
              ©{" "}
              <a
                href="https://tmedi.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition hover:text-slate-300"
              >
                tmedi.kr
              </a>{" "}
              All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
