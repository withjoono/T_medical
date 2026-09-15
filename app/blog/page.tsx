import type { Metadata } from "next";
import { Newspaper, Clock, ArrowUpRight } from "lucide-react";
import { PromoHero, PromoSection, FinalCTA } from "../_site/components";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "블로그 | T Medi — 의약학 입시 인사이트",
  description:
    "의치한약수 입시 트렌드, MMI 면접 실전, 수능 최저 전략, 계열 선택 인사이트를 담은 T Medi 블로그. 의대·치대·한의대·약대·수의대 진학 콘텐츠.",
};

const CATEGORIES = [
  "전체",
  "의약학 입시",
  "MMI 면접",
  "수능 최저",
  "계열 선택",
  "생기부·학종",
];

const FEATURED = {
  category: "의약학 입시",
  title: "2027 의약학 입시, 무엇이 달라지나 — 계열별 전형 지형 총정리",
  excerpt:
    "의대 정원 확대 이후 치대·한의대·약대·수의대까지 연쇄적으로 움직인 경쟁 구조를 계열별로 짚어봅니다. 교과·학종·논술·정시 비중 변화와 그에 따른 지원 전략의 방향을 정리했습니다.",
  readTime: "8분 읽기",
  date: "2026.06.28",
};

const POSTS = [
  {
    category: "MMI 면접",
    title: "MMI 스테이션, 이렇게 뚫는다 — 윤리·상황 문항 실전 답변 프레임",
    excerpt:
      "다중미니면접에서 자주 나오는 윤리 딜레마와 상황 대처 문항을 유형별로 분해하고, 감점을 피하는 답변 구조를 예시와 함께 제시합니다.",
    readTime: "6분 읽기",
    date: "2026.06.20",
  },
  {
    category: "수능 최저",
    title: "수능 최저부터 역산하는 수시 6장 전략",
    excerpt:
      "의약학 수시의 당락은 최저에서 갈립니다. 최저 기준을 기준선으로 삼아 안정·적정·상향 지원을 배분하는 방법을 다룹니다.",
    readTime: "7분 읽기",
    date: "2026.06.14",
  },
  {
    category: "계열 선택",
    title: "의대 vs 치대 vs 약대 — 나에게 맞는 계열 찾기",
    excerpt:
      "성적대, 적성, 활동 이력에 따라 유리한 계열이 다릅니다. 세 계열의 전형 특성과 요구 역량을 비교해 선택 기준을 정리합니다.",
    readTime: "5분 읽기",
    date: "2026.06.07",
  },
  {
    category: "생기부·학종",
    title: "의약학 학종을 위한 생명·화학 세특 설계법",
    excerpt:
      "입학사정관이 주목하는 탐구 깊이를 만드는 세특 방향. 교과 개념을 의학적 문제의식으로 확장하는 활동 연결 사례를 소개합니다.",
    readTime: "6분 읽기",
    date: "2026.05.30",
  },
  {
    category: "의약학 입시",
    title: "한의대·수의대, 의외의 지원 조합 — 놓치기 쉬운 전형 살펴보기",
    excerpt:
      "상대적으로 정보가 적은 한의대와 수의대의 전형별 특성과 최저 기준을 정리하고, 복수지원 시 유리한 조합을 짚어봅니다.",
    readTime: "5분 읽기",
    date: "2026.05.22",
  },
];

/** 분류 탭 — 알약 칩 대신 활자 + 밑줄. 현재 분류만 잉크 밑줄로 고정한다. */
function CategoryChips() {
  return (
    <div className="mb-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-hair py-4">
      {CATEGORIES.map((c, i) => (
        <span
          key={c}
          className={
            i === 0
              ? "border-b-2 border-jade-600 pb-1 text-[13px] font-semibold tracking-tight text-ink"
              : "link-underline pb-1 text-[13px] font-light tracking-tight text-ink-500 transition-colors hover:text-ink"
          }
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      <PromoHero
        badge="의약학 입시 인사이트"
        title="합격을 앞당기는"
        highlight="의약학 입시 콘텐츠"
        body="의치한약수 입시 트렌드부터 MMI 면접 실전, 수능 최저 전략, 계열 선택까지 — 현장 노하우를 담은 글을 정리했습니다."
        primaryHref="#contact"
        primaryLabel="시작하기"
        secondaryHref="/guide"
        secondaryLabel="사용법 보기"
        Icon={Newspaper}
        stats={[
          { icon: Newspaper, label: "입시 트렌드" },
          { icon: Clock, label: "실전 노하우" },
        ]}
      />

      <PromoSection
        eyebrow="LATEST"
        EyebrowIcon={Newspaper}
        title="최신 글"
        subtitle="의약학 입시의 최신 흐름과 실전 노하우를 주제별로 담았습니다."
      >
        <CategoryChips />

        {/* 머리기사 — 저널 1면 조판. 좌측에 분류·날짜, 우측에 표제와 리드 */}
        <article className="group grid gap-8 border-t-2 border-ink pt-8 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
          <div className="flex flex-row flex-wrap items-center gap-x-5 gap-y-2 lg:flex-col lg:items-start lg:gap-3">
            <span className="eyebrow text-brass-600">{FEATURED.category}</span>
            <span className="tnum text-xs font-light text-ink-400">
              {FEATURED.date}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-light text-ink-400">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {FEATURED.readTime}
            </span>
          </div>
          <div>
            <h2 className="display text-[1.625rem] leading-[1.4] text-ink-900 sm:text-[2rem] sm:leading-[1.35]">
              {FEATURED.title}
            </h2>
            <p className="mt-5 max-w-3xl text-[15px] font-light leading-[1.9] text-ink-500">
              {FEATURED.excerpt}
            </p>
            <span className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-tight text-jade-700">
              <span className="link-underline">자세히 읽기</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </span>
          </div>
        </article>

        {/* 기사 목록 — 헤어라인으로만 나뉜 그리드 */}
        <div className="mt-16 grid border-l border-t border-hair bg-paper-50 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="group relative flex flex-col border-b border-r border-hair p-7 transition-colors duration-300 hover:bg-white"
            >
              <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jade-600 transition-transform duration-500 group-hover:scale-x-100" />
              <div className="flex items-center gap-4">
                <span className="eyebrow text-brass-600">{post.category}</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-light text-ink-400">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {post.readTime}
                </span>
              </div>
              <h3 className="display mt-5 text-[1.0625rem] leading-[1.5] text-ink-900">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] font-light leading-[1.8] text-ink-500">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-hair pt-4">
                <span className="tnum text-[11px] font-light text-ink-400">
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold tracking-tight text-jade-700">
                  읽기
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </span>
              </div>
            </article>
          ))}
        </div>
      </PromoSection>

      <FinalCTA
        title="콘텐츠만 읽지 말고, 직접 전략을 세워보세요"
        body="블로그에서 배운 전략을 나의 성적·목표 계열에 바로 적용할 수 있습니다."
        Icon={Newspaper}
        primaryHref="#contact"
        primaryLabel="시작하기"
      />
    </>
  );
}
