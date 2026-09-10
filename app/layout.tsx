import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const SITE_URL = "https://tmedi.kr"
const DESCRIPTION =
  "의대 진학 전문 입시 포털. 수시 교과·종합·논술 전형, 정시 전략, 해외 의대 경유 루트까지 2027학년도 기준으로 정리. 치대·한의대·약대·수의대 진학 전략도 함께."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    <html lang="ko" className={`${inter.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
