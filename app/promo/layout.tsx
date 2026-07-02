import Link from "next/link";
import { ArrowRight, Home, BookOpenCheck, Newspaper, Stethoscope } from "lucide-react";

const NAV_ITEMS = [
  { href: "/promo", label: "홈", icon: Home },
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/promo" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
              <Stethoscope className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold text-slate-900">
              T Medi
              <span className="ml-1.5 text-xs font-normal text-slate-500">의약학</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
          >
            시작하기
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* feature tabs */}
        <nav className="border-t border-slate-100 bg-slate-50/60">
          <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
            <ul className="flex min-w-max items-center gap-1 py-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
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

      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-500">
        © 거북스쿨 · T Medi (의약학 · 의치한약수 진학 전문) ·{" "}
        <a
          href="https://tmedi.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-900"
        >
          tmedi.kr
        </a>
      </footer>
    </div>
  );
}
