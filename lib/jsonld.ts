/** =========================================================================
 *  JSON-LD 구조화 데이터 빌더
 *
 *  왜 넣나 — AI 검색(ChatGPT·Perplexity·Google AI Mode)이 인용하는 페이지는
 *  구조화 데이터를 가진 비율이 높다. 경쟁 입시 매체·대형 학원 사이트는
 *  아직 대부분 넣지 않고 있어 선점 여지가 있다.
 *
 *  ⚠️ 규칙 하나: **페이지에 눈으로 보이지 않는 것을 마크업하지 않는다.**
 *     FAQPage 의 질문은 본문에 그대로 있어야 하고, Course 의 가격은
 *     PriceCard 에 실제로 찍혀 있어야 한다. 안 보이는 것을 넣으면 스팸이다.
 *  ========================================================================= */

export const SITE_URL = "https://tmedi.kr";
export const SITE_NAME = "T메디";

/** <script type="application/ld+json"> 에 넣을 문자열.
 *  </script> 조기 종료와 XSS 를 막기 위해 < 를 유니코드로 이스케이프한다. */
export function ldJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function abs(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/* ---------------------------------------------------------------- 사이트 */

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "T Medi",
    url: SITE_URL,
    logo: abs("/logo.png"),
    description:
      "의대·치대·한의대·약대·수의대 입시 정보와 1:1 면접 수업을 제공하는 의약학 진학 전문 사이트.",
    areaServed: { "@type": "Country", name: "대한민국" },
    knowsLanguage: "ko-KR",
  };
}

export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "ko-KR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/* ------------------------------------------------------------ 빵부스러기 */

export type Crumb = { name: string; path: string };

export function breadcrumb(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "홈", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/* ---------------------------------------------------------------- 글/안내 */

export function article({
  path,
  headline,
  description,
  modified,
}: {
  path: string;
  headline: string;
  description: string;
  /** ISO 날짜. 데이터 기준일을 쓴다 — 없으면 넣지 않는다. */
  modified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
    headline,
    description,
    inLanguage: "ko-KR",
    ...(modified ? { dateModified: modified } : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/* ------------------------------------------------------------------ 수업 */

export function course({
  path,
  name,
  description,
  price,
  /** 수업 형태 — 전부 온라인(줌) 1:1 */
  startDate,
  endDate,
}: {
  path: string;
  name: string;
  description: string;
  /** 원 단위 정수. PriceCard 에 실제로 보이는 값이어야 한다. */
  price: number;
  startDate?: string;
  endDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${abs(path)}#course`,
    name,
    description,
    inLanguage: "ko-KR",
    url: abs(path),
    provider: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "KRW",
      category: "1회 수업료",
      availability: "https://schema.org/InStock",
      url: abs(path),
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT2H30M",
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    },
  };
}

/* ------------------------------------------------------------------- FAQ */

/** ⚠️ 여기 넣는 질문·답변은 페이지 본문에 그대로 보여야 한다. */
export function faqPage(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
