import { PromoChrome } from "./_chrome";

/** /promo/* 하위 페이지 공통 레이아웃.
 *  루트(/)는 app/page.tsx 에서 동일한 PromoChrome 을 직접 사용한다. */
export default function PromoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PromoChrome>{children}</PromoChrome>;
}
