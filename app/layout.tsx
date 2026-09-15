import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { SiteChrome } from "./_site/chrome"

const SITE_URL = "https://tmedi.kr"
const DESCRIPTION =
  "의대 진학 전문 입시 포털. 수시 교과·종합·논술 전형, 정시 전략, 해외 의대 경유 루트까지 2027학년도 기준으로 정리. 치대·한의대·약대·수의대 진학 전략도 함께."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "T메디 - 의대 입시 (수시·정시·해외 의대)",
  description: DESCRIPTION,
  // 아이콘·OG 카드는 Hub/brand 가 배포하는 공용 T스쿨 자산.
  // 교체하려면 Hub/brand/apps.json 을 고치고 `python brand/sync_brand.py medi` 실행.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png?v=2", type: "image/png" },
    ],
    apple: "/logo.png?v=2",
  },
  // URL 공유 시(카톡·슬랙 등) 뜨는 미리보기
  openGraph: {
    type: "website",
    siteName: "T메디",
    title: "T메디 - 의대 입시 (수시·정시·해외 의대)",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "ko_KR",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "T메디" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "T메디 - 의대 입시 (수시·정시·해외 의대)",
    description: DESCRIPTION,
    images: ["/og-image.png?v=2"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {/*
          한글 웹폰트는 CDN 링크로 싣는다.
          - Pretendard: 본문·UI. dynamic-subset 이라 글자 단위로만 받아 가볍다.
          - Noto Serif KR(본명조): 표제·숫자 전용(.display). 600/700 두 종만.
          next/font/google 을 쓰지 않는 이유 — Pretendard 는 Google Fonts 에 없고,
          두 폰트의 로딩 방식을 하나로 맞추는 편이 FOUT 제어에 유리하다.
        */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;600;700&display=swap"
        />
      </head>
      <body className="antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
