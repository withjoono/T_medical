import type { Metadata } from "next";
import { Newspaper, Clock, ArrowUpRight } from "lucide-react";
import { PromoHero, PromoSection, FinalCTA } from "../_components";

export const metadata: Metadata = {
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

function CategoryChips() {
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      {CATEGORIES.map((c, i) => (
        <span
          key={c}
          className={
            i === 0
              ? "rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm shadow-teal-500/25"
              : "rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
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
        secondaryHref="/promo/guide"
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

        {/* Featured */}
        <article className="overflow-hidden rounded-3xl border border-teal-200/70 bg-gradient-to-br from-teal-50 to-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-500/10">
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <span className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-3 py-1 text-white">
                {FEATURED.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {FEATURED.readTime}
              </span>
              <span>{FEATURED.date}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {FEATURED.title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
              {FEATURED.excerpt}
            </p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
              자세히 읽기
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </article>

        {/* Post grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-teal-700">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">{post.date}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                  읽기
                  <ArrowUpRight className="h-3.5 w-3.5" />
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
