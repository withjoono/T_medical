import { Footer } from "@/components/footer";
import Link from "next/link";
import { SiteNavigation } from "./navigation";
import { Phone, Mail, Clock, LucideIcon } from "lucide-react";

/** 상단 네비 = 사이트맵. 새 페이지를 추가하면 여기에도 등록한다.
 *  children 을 가진 항목은 상단 네비에 부모만 노출되고, 풋터에는 하위 링크까지 펼쳐진다.
 *
 *  icon 은 풋터/모바일 보조 표기에만 쓰고 상단 네비에서는 렌더하지 않는다.
 *  (아이콘이 늘어선 네비는 대시보드처럼 보인다 — 활자만으로 위계를 만든다) */
type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  children?: { href: string; label: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈" },
  {
    href: "/susi",
    label: "수시 전형",
    children: [
      { href: "/susi/gyogwa", label: "교과전형" },
      { href: "/susi/jonghap", label: "학생부종합" },
      { href: "/susi/nonsul", label: "논술전형" },
    ],
  },
  { href: "/jungsi", label: "정시" },
  { href: "/overseas", label: "해외 의대" },
  { href: "/ipkyul", label: "입시결과" },
  { href: "/uidae-class", label: "의대 진학반" },
  {
    href: "/interview",
    label: "면접 수업",
    children: [{ href: "/mmi", label: "대학별 MMI 특강" }],
  },
  { href: "/tamgu", label: "탐구보고서" },
  { href: "/guide", label: "사용법" },
  { href: "/blog", label: "블로그" },
];

/** 풋터 사이트맵 — 홈 제외, 주제별 3열로 묶는다.
 *  URL 표준(Hub/docs/url-standard.md): 공개 콘텐츠는 전부 최상위 경로다. */
const FOOTER_COLUMNS: { heading: string; links: { href: string; label: string }[] }[] =
  [
    {
      heading: "수시",
      links: [
        { href: "/susi", label: "수시 전형 총정리" },
        { href: "/susi/gyogwa", label: "학생부교과전형" },
        { href: "/susi/jonghap", label: "학생부종합전형" },
        { href: "/susi/nonsul", label: "논술전형" },
      ],
    },
    {
      heading: "입시결과 · 정시",
      links: [
        { href: "/ipkyul", label: "의치한약수 입시결과" },
        { href: "/ipkyul/uiye", label: "의예과 입결" },
        { href: "/ipkyul/yakhak", label: "약학과 입결" },
        { href: "/jungsi", label: "정시 전략" },
        { href: "/overseas", label: "해외 의대 경유 루트" },
      ],
    },
    {
      heading: "수업 · 자료",
      links: [
        { href: "/ipkyul", label: "입시결과" },
  { href: "/uidae-class", label: "의대 진학반" },
        { href: "/interview", label: "면접 수업" },
        { href: "/mmi", label: "2027 대학별 MMI 면접 특강" },
        { href: "/tamgu", label: "탐구보고서" },
        { href: "/guide", label: "사용법" },
        { href: "/blog", label: "블로그" },
      ],
    },
  ];

export const CONTACT_ANCHOR = "#contact";

/** 워드마크 — 세리프 모노그램 + 트래킹된 활자.
 *  그라디언트 알약 아이콘 대신 각진 헤어라인 사각형을 쓴다. */
function Wordmark({ onDark = false }: { onDark?: boolean }) {
  const frame = onDark
    ? "border-white/25 text-white"
    : "border-ink-800 text-ink";
  const name = onDark ? "text-white" : "text-ink";
  const sub = onDark ? "text-ink-400" : "text-ink-400";
  return (
    <span className="flex items-center gap-3">
      <span
        className={`display flex h-9 w-9 items-center justify-center border text-[15px] leading-none ${frame}`}
      >
        T
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`display text-[15px] tracking-[0.14em] ${name}`}
        >
          T MEDI
        </span>
        <span
          className={`mt-1.5 text-[10px] font-medium tracking-[0.2em] ${sub}`}
        >
          의약학 진학
        </span>
      </span>
    </span>
  );
}

/** 사이트 공통 크롬(상단 네비 + 풋터).
 *  app/layout.tsx 가 전 페이지에 한 번만 씌운다 — 개별 페이지에서 다시 감싸지 말 것. */
export function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-shell editorial-site min-h-screen bg-paper text-ink-900">
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      {/* ===== 상단 유틸리티 바 ===== */}
      <div className="hidden bg-ink text-ink-300 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[11px] font-light tracking-wide">
          <span className="tracking-[0.16em] text-ink-400">
            의대 · 치대 · 한의대 · 약대 · 수의대 진학 전문
          </span>
          <span className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-jade-400" strokeWidth={1.5} />
              06:00 – 22:00
            </span>
            <a
              href="tel:010-2518-7139"
              className="link-underline inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3 text-jade-400" strokeWidth={1.5} />
              010-2518-7139
            </a>
          </span>
        </div>
      </div>

      {/* ===== 헤더 ===== */}
      <header className="sticky top-0 z-40 border-b border-hair bg-paper/85 backdrop-blur-md">
        <div className="ecosystem-bar"><nav aria-label="T스쿨 공통 메뉴" className="ecosystem-inner">
          <a href="https://www.tskool.kr">T스쿨</a>
          <details className="ecosystem-apps"><summary>관련 앱 <span aria-hidden="true">⌄</span></summary><ul>
            <li><a href="https://studyplanner.kr">스터디플래너</a></li>
            <li><a href="https://saenggiboo.kr">생기부</a></li>
            <li><a href="https://ipsypick.kr">맞춤입시정보</a></li>
            <li><a href="https://www.tskool.kr">T스쿨(허브)</a></li>
          </ul></details>
          <span className="ecosystem-label">T스쿨 · 의약학 입시 전문</span>
        </nav></div>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="T Medi 홈">
            <span className="satellite-brand"><img src="/logo.png?v=2" width={40} height={40} alt="" /><span>T메디<small>의약학 입시 전문</small></span></span>
          </Link>
          <Link
            href={CONTACT_ANCHOR}
            className="rounded-sm bg-ink px-5 py-2.5 text-[13px] font-semibold tracking-tight text-paper transition-colors duration-300 hover:bg-ink-800"
          >
            상담 신청
          </Link>
        </div>

        {/* 섹션 네비 — 활자만. hover 시 밑줄이 자란다. */}
        <SiteNavigation items={NAV_ITEMS} />
      </header>

      <main id="main-content" tabIndex={-1}>{children}</main>

      {/* ===== 풋터 ===== */}
      <section id="contact" className="scroll-mt-32 border-t bg-white px-6 py-10 text-slate-700">
        <div className="mx-auto max-w-6xl">
          <div className="contact-intro">
            <div>
              <span className="eyebrow text-brass-600">LET’S TALK ABOUT YOUR NEXT CHAPTER</span>
              <h2>당신의 가능성에서<br />상담을 시작합니다.</h2>
              <p>목표 계열과 지금의 고민을 들려주세요.<br />어디서부터 준비할지 함께 정리하겠습니다.</p>
            </div>
            <a href="tel:010-2518-7139" aria-label="010-2518-7139 전화 상담"><Phone size={22} strokeWidth={1.25} />010-2518-7139</a>
          </div>
          <nav aria-label="의약학 안내" className="grid gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => <div key={column.heading}>
              <h2 className="font-semibold">{column.heading}</h2>
              <ul className="mt-3 space-y-2 text-sm">{column.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
            </div>)}
          </nav>
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t pt-6 text-sm">
            <h2 className="font-semibold">상담 문의</h2>
            <a href="tel:010-2518-7139" className="inline-flex items-center gap-2"><Phone className="h-4 w-4" />010-2518-7139</a>
            <a href="mailto:withjuno@naver.com" className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />withjuno@naver.com</a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
