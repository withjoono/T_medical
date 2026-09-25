import { Footer } from "@/components/footer";
import Link from "next/link";
import { MediHeader } from "./medi-header";
import { Phone, Mail, LucideIcon } from "lucide-react";

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
    href: "/univ",
    label: "대학별 안내",
    children: [
      { href: "/mmi", label: "대학별 MMI 특강" },
      { href: "/ipkyul/uiye", label: "의예과 입결" },
    ],
  },
  {
    href: "/susi",
    label: "수시",
    children: [
      { href: "/susi/gyogwa", label: "교과전형" },
      { href: "/susi/jonghap", label: "학생부종합" },
      { href: "/susi/nonsul", label: "논술전형" },
      { href: "/jiyeok-uisa", label: "지역의사 선발전형" },
    ],
  },
  { href: "/jungsi", label: "정시" },
  { href: "/overseas", label: "해외 의대" },
  { href: "/ipkyul", label: "입시결과" },
  { href: "/uidae-class", label: "의대 진학반" },
  {
    href: "/interview",
    label: "면접 수업",
    children: [
      { href: "/interview/chuseok", label: "추석 연휴 면접반" },
      { href: "/interview/mmi", label: "MMI 면접" },
      { href: "/interview/injeokseong", label: "인·적성 면접" },
      { href: "/interview/jesimun", label: "제시문 면접" },
      { href: "/mmi", label: "대학별 MMI 특강" },
    ],
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
        { href: "/jiyeok-uisa", label: "지역의사 선발전형" },
      ],
    },
    {
      heading: "대학별 · 입시결과",
      links: [
        { href: "/univ", label: "대학별 전형·면접 안내" },
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
        { href: "/interview/chuseok", label: "추석 연휴 면접 특강" },
        { href: "/interview/mmi", label: "MMI 면접 대비" },
        { href: "/interview/injeokseong", label: "인·적성 면접 대비" },
        { href: "/interview/jesimun", label: "제시문 면접 대비" },
        { href: "/mmi", label: "2027 대학별 MMI 면접 특강" },
        { href: "/tamgu", label: "탐구보고서" },
        { href: "/guide", label: "사용법" },
        { href: "/blog", label: "블로그" },
      ],
    },
  ];

export const CONTACT_ANCHOR = "#contact";


/** 사이트 공통 크롬(상단 네비 + 풋터).
 *  app/layout.tsx 가 전 페이지에 한 번만 씌운다 — 개별 페이지에서 다시 감싸지 말 것. */
export function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <MediHeader items={NAV_ITEMS} />
    <div className="site-shell editorial-site min-h-screen bg-paper text-ink-900">
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>

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
    </>
  );
}
