"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/use-auth"

const STUDYPLANNER_URL = process.env.NEXT_PUBLIC_STUDYPLANNER_URL || "https://studyplanner.tskool.kr"
const SANGGIBOOK_URL = process.env.NEXT_PUBLIC_SANGGIBOOK_URL || "https://sanggibook.tskool.kr"
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://tskool.kr"

export default function Navigation() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, loginUrl } = useAuth()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-600 to-teal-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-[10px]">MED</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TS 메디컬</span>
        </div>
        <nav className="hidden md:flex items-center space-x-7">
          <a href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-teal-700" : "text-gray-600 hover:text-gray-900"}`}>홈</a>
          <div className="relative group">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
              계열 정보
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <a href="/medicine" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 first:rounded-t-lg">🩺 의대</a>
              <a href="/dentistry" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">🦷 치대</a>
              <a href="/korean-medicine" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">🌿 한의대</a>
              <a href="/pharmacy" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">💊 약대</a>
              <a href="/veterinary" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 last:rounded-b-lg">🐾 수의대</a>
            </div>
          </div>
          <div className="relative group">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
              전형 전략
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <a href="/susi-strategy" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 first:rounded-t-lg">수시 교과 전략</a>
              <a href="/jonghap-strategy" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">수시 종합 전략</a>
              <a href="/jungsi-strategy" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">정시 수능 전략</a>
              <a href="/nontong" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 last:rounded-b-lg">논술 전형 전략</a>
            </div>
          </div>
          <a href="/consulting" className="text-sm font-medium text-gray-600 hover:text-gray-900">컨설팅</a>
          <a href="/success-cases" className="text-sm font-medium text-gray-600 hover:text-gray-900">합격사례</a>

          {/* 플랫폼 */}
          <div className="relative group">
            <button className="text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
              플랫폼
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <a href={SANGGIBOOK_URL} className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 first:rounded-t-lg">🩺 My 생기부 의치한 AI 진단</a>
              <a href={STUDYPLANNER_URL} className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">📅 의치한 맞춤 Study Planner</a>
              <a href={`${HUB_URL}/dashboard`} className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 last:rounded-b-lg">🏠 T Skool 전체 서비스</a>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.userName}님</span>
              <button onClick={() => { logout(); window.location.href = HUB_URL; }} className="text-sm text-gray-500 hover:text-gray-700">로그아웃</button>
            </div>
          ) : (
            <a href={loginUrl} className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 text-sm font-semibold rounded-lg transition-colors">로그인</a>
          )}
        </div>
      </div>
    </header>
  )
}
