"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SatelliteHeader, type HeaderGroup } from "@tskool/satellite-header";
import { useAuth } from "@/lib/use-auth";
import { HUB_URL, getLoginUrl } from "@/lib/auth";

const intro = (id: string) => `https://www.tskool.kr/apps/${id}`;
const groups: HeaderGroup[] = [
  { id: "grades", label: "성적관리", title: "의약학 진학의 출발점, 내 성적과 학생부", description: "내신·모의고사 성적과 의약학 탐구 활동을 점검하세요.", guide: { label: "학생부교과전형 안내", href: "/susi/gyogwa" }, tools: [
    { title: "모의고사 성적 관리", description: "회차별 성적과 수능 최저 준비 상황을 확인하세요.", app: "T모고", url: "https://mogomogo.kr" },
    { title: "의약학 학생부 점검", description: "생명·화학 탐구와 학교생활 기록을 정리하는 도구를 알아보세요.", app: "T생기부", url: intro("mysanggibu"), intro: true },
  ] },
  { id: "learning", label: "학습관리", title: "내신·수능·면접 준비를 하나의 계획으로", description: "과목별 공부와 탐구, 면접 준비 시간을 균형 있게 배분하세요.", guide: { label: "의대 진학반 안내", href: "/uidae-class" }, tools: [
    { title: "의약학 진학 준비 플래너", description: "수능 최저와 학생부 준비를 주간 계획에 담으세요.", app: "T플래너", url: "https://studyplanner.kr" },
    { title: "수업·과제 관리", description: "선생님과 진도와 과제를 공유하는 서비스를 알아보세요.", app: "T클래스", url: intro("tutorboard"), intro: true },
    { title: "멘토와 학습 점검", description: "학습 기록을 함께 검토하는 멘토링을 알아보세요.", app: "T멘토링", url: intro("mentoring"), intro: true },
  ] },
  { id: "prediction", label: "입시예측", title: "성적과 전형을 연결하는 의약학 지원 전략", description: "수시와 정시의 평가 요소를 비교하고 지원 후보를 검토하세요.", guide: { label: "의약학 입시결과 보기", href: "/ipkyul" }, note: "연결 앱의 대학·전형별 지원 범위와 기준 연도를 확인하세요. 합격을 보장하는 서비스가 아닙니다.", tools: [
    { title: "내신 기반 수시 전략", description: "교과·종합전형의 지원 후보를 검토하세요.", app: "T수시", url: "https://tsusi.kr" },
    { title: "수능 기반 정시 전략", description: "대학별 반영비율과 환산점수를 살펴보세요.", app: "T정시", url: "https://tjungsi.kr" },
  ] },
  { id: "information", label: "입시정보", title: "의대·치대·한의대·약대·수의대 입시 정보", description: "대학별 전형과 입결, 면접 일정을 함께 살펴보세요.", guide: { label: "대학별 안내", href: "/univ" }, tools: [
    { title: "계열별 입시결과", description: "공시된 대학·전형별 입결 자료를 비교하세요.", app: "T메디 입시결과", url: "/ipkyul" },
    { title: "대학별 MMI 면접", description: "면접 일정과 대학별 준비 포인트를 확인하세요.", app: "T메디 MMI", url: "/mmi" },
    { title: "입시 소식 모아보기", description: "관심 분야의 정보를 모으는 서비스를 알아보세요.", app: "맞춤 입시 정보", url: intro("infocast"), intro: true },
  ] },
  { id: "users", label: "사용자별", title: "수험생을 중심으로 함께 준비하는 의약학 입시", description: "학생·학부모·선생님이 준비 과정과 학습 현황을 함께 살펴보세요.", guide: { label: "T메디 이용 안내", href: "/guide" }, tools: [
    { title: "선생님의 학생 관리", description: "담당 학생의 성적과 학습 계획을 확인하세요.", app: "T선생님", url: "https://teacher-front.web.app" },
    { title: "학부모의 입시 동행", description: "자녀의 학습 상황을 살펴보고 준비를 도와주세요.", app: "T학부모", url: "https://parent-admin-479305.web.app" },
    { title: "학원의 수업·원생 관리", description: "수업과 학생 관리를 한곳에서 정리하세요.", app: "T학원", url: "https://hakwonadmin-front.web.app" },
  ] },
];

type Item = { href: string; label: string; children?: { href: string; label: string }[] };
export function MediHeader({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [loginUrl, setLoginUrl] = useState(`${HUB_URL}/auth/login?redirect=${encodeURIComponent("https://tmedi.kr/")}`);
  useEffect(() => { setLoginUrl(getLoginUrl(pathname)); }, [pathname]);
  // Keep the content row at one level; detail links remain on landing pages and in the footer.
  // The logo links home. Help and articles remain accessible from the footer.
  const nav = items
    .filter((item) => !["/", "/guide", "/blog"].includes(item.href))
    .map((item) => ({
      href: item.href,
      label: item.label,
      match: "prefix" as const,
    }));
  return <SatelliteHeader brand={{ name: "T메디", suffix: "메디", caption: "의대·치대·한의대·약대·수의대 입시", logoSrc: "/logo.png?v=2" }} groups={groups} nav={[...nav, { href: "#contact", label: "상담 문의" }]} pathname={pathname} LinkComponent={Link} account={{ isAuthenticated, isLoading, userName: user?.userName, loginUrl, onLogout: logout }} utilities={{
    productsUrl: `${HUB_URL}/products`, loginUrl, accountLinkageUrl: `${HUB_URL}/account-linkage`,
    shareTitle: "의약학 진학 정보, 함께 보기", shareDescription: "현재 전형 안내를 공유하거나 T스쿨에서 선생님·학부모 계정을 연결하세요.",
    notifications: <div><p>개인 알림은 이 앱에 연결되어 있지 않습니다.</p>{isLoading ? <p>계정 확인 중…</p> : isAuthenticated ? <><p>{user?.userName || "회원"}님으로 로그인되어 있습니다.</p><a className="utility-action" href={`${HUB_URL}/notifications`}>T스쿨 알림 확인 ↗</a><button type="button" className="utility-secondary" onClick={logout}>T메디 로그아웃</button></> : <a className="utility-action" href={loginUrl}>T스쿨 로그인 ↗</a>}</div>,
  }} />;
}
