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

export const metadata: Metadata = {
  title: "의치한약수 입시 전문 | TS 메디컬 - 의대·치대·한의대·약대·수의대",
  description: "의대, 치대, 한의대, 약대, 수의대 합격을 위한 전문 입시 컨설팅 + AI 생기부 진단 플랫폼. 수시 교과/종합, 정시 수능 완벽 대비.",
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
