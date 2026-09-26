import Link from "next/link";
import { UNIVS, formatKo } from "@/lib/mmi-schedule";
import { ALL_DAYS, AVG_GAP, BLOCKS, RANGE_LABEL, TOTAL } from "@/lib/chuseok-class";
import { AdmissionsCalendar } from "./admissions-calendar";
import { ArrowUpRight } from "lucide-react";
import {
  Stethoscope,
  Target,
  GraduationCap,
  ClipboardCheck,
  MessagesSquare,
  BookOpenCheck,
  Newspaper,
  Activity,
  FileText,
  ShieldCheck,
  Globe2,
  Compass,
} from "lucide-react";
import {
  PromoSection,
  FeatureGrid,
  CheckList,
  LinkCards,
  FinalCTA,
} from "./components";
import { CONTACT_ANCHOR } from "./chrome";

/** 의약학 계열별 전략 카드 (링크 아님 — 정보성 섹션) */
const TRACKS = [
  {
    icon: Stethoscope,
    title: "의대 (의예과)",
    body: "최상위 내신과 의학적 탐구 역량이 핵심. 생명·화학 세특 심화, MMI 면접, 수능 최저까지 전 전형 대비 전략을 안내합니다.",
  },
  {
    icon: Activity,
    title: "치대 (치의예과)",
    body: "교과·학종 중심 전략과 손기술·공간지각을 어필하는 활동 설계. 면접 빈출 문항과 계열 적합성 포인트를 정리합니다.",
  },
  {
    icon: GraduationCap,
    title: "한의대",
    body: "한의학 관심과 인문·자연 융합 역량 어필이 관건. 논술·면접·수능 최저 조합별 유불리를 계열 특성에 맞춰 제시합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "약대 (통합 6년제)",
    body: "화학·생명 심화 세특과 학업 역량 중심 학종·교과 전략. 지역·전형별 최저 기준과 복수지원 조합을 관리합니다.",
  },
  {
    icon: ShieldCheck,
    title: "수의대",
    body: "동물·생명 탐구 특화 활동과 봉사 경험 설계. 생명과학 심화 세특, 수의학 면접 대비 포인트를 계열별로 안내합니다.",
  },
  {
    icon: Target,
    title: "정시·수능 최저 통합",
    body: "의치한약수 모든 계열의 수능 최저 기준을 한눈에. 과탐 조합 최적화와 정시 배치 전략을 계열별로 비교합니다.",
  },
];

/** 핵심 기능 카드 (정보성 섹션) */
const FEATURES = [
  {
    icon: Target,
    title: "계열별 맞춤 전략",
    body: "의대·치대·한의대·약대·수의대 각 계열의 전형 구조와 요구 역량이 다릅니다. 목표 계열을 고르면 그에 맞춘 로드맵을 제시합니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접·MMI·인적성 대비",
    body: "다중미니면접(MMI), 인·적성 면접, 제시문 면접 등 계열·대학별 면접 유형을 분석하고 실전 질문과 답변 프레임을 훈련합니다.",
  },
  {
    icon: ClipboardCheck,
    title: "수능 최저 관리",
    body: "의약학 수시의 당락을 가르는 수능 최저학력기준. 대학·전형별 최저 기준을 정리하고 충족 가능성을 성적 기반으로 점검합니다.",
  },
  {
    icon: FileText,
    title: "생기부·학종 설계",
    body: "생명·화학 세특 깊이, 의학적 탐구·봉사 경험 등 의약학 입학사정관이 중시하는 요소 중심으로 생기부 방향을 잡습니다.",
  },
  {
    icon: BookOpenCheck,
    title: "수시·정시 통합 전략",
    body: "교과·종합·논술·정시를 계열별로 비교해 지원 조합을 설계합니다. 6장의 수시와 정시 3장을 낭비 없이 배분합니다.",
  },
  {
    icon: GraduationCap,
    title: "논술 전형 대응",
    body: "수리·과학 논술을 요구하는 의약학 논술 전형의 출제 경향을 정리하고, 최저 충족과 병행하는 준비 플랜을 제공합니다.",
  },
];

const STRENGTHS = [
  "의대·치대·한의대·약대·수의대 계열별 전형 구조 완전 분리 분석",
  "대학·전형별 수능 최저학력기준 데이터 정리",
  "다중미니면접(MMI)·인적성·제시문 면접 유형별 대비",
  "생명·화학 세특 등 의약학 특화 생기부 방향 설계",
  "수리·과학 논술 전형 출제 경향 및 최저 병행 플랜",
  "수시 6장 + 정시 3장 지원 조합 시뮬레이션",
];

/** 수능 전 연휴 면접 특강 — 기간 한정 밴드.
 *  숫자는 lib/chuseok-class.ts 에서만 온다. 특강이 끝나면 이 블록을 지운다. */
function ChuseokBand() {
  return (
    <section className="grain relative isolate overflow-hidden border-y border-hair-strong">
      <div className="absolute inset-0 bg-ink" />
      <div className="blueprint absolute inset-0 opacity-60" />
      <div className="brass-rule absolute inset-x-0 top-0 h-px" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow text-brass-300">수능 전 연휴 한정 · {RANGE_LABEL}</p>
          <h2 className="display mt-5 text-[1.625rem] leading-[1.35] text-white sm:text-[2rem]">
            추석 연휴 의대 면접반
          </h2>
          <p className="mt-5 text-[14px] font-light leading-[1.85] text-ink-300">
            1단계 발표에서 면접까지는 평균 {AVG_GAP}일입니다. 추석 · 개천절 · 한글날
            연휴 {ALL_DAYS.length}일 동안 낮 타임까지 하루 5타임을 열어 1:1 로
            진행합니다.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-light text-ink-200">
            {BLOCKS.map((b) => (
              <li key={b.id} className="tnum">
                <span className="text-brass-300">{b.name}</span>{" "}
                {formatKo(b.start)}~{formatKo(b.end)}
              </li>
            ))}
          </ul>
        </div>
        <div className="shrink-0 lg:text-right">
          <p className="tnum display text-[2.75rem] leading-none text-white">
            {TOTAL.open}
            <span className="ml-1 text-[1rem] font-light text-ink-300">회</span>
          </p>
          <p className="mt-2 text-[12px] font-light text-ink-300">남은 자리</p>
          <Link
            href="/interview/chuseok"
            className="mt-6 inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-ink-900"
          >
            연휴 특강 일정 보기
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="editorial-hero admissions-editorial">
        <div className="editorial-copy">
          <p className="editorial-kicker admissions-kicker">의대·치대·한의대·약대·수의대 입시 전문</p>
          <h1 className="admissions-title">의대 진학의 꿈을,<br /><em>합격을 향한 전략으로.</em></h1>
          <p className="editorial-intro">수험생과 학부모를 위한<br />의약학 진학 컨설팅, T Medi.</p>
          <p className="editorial-description">수시·정시 지원 전략부터 학생부·MMI 면접 준비까지.<br />지금의 성적과 목표 대학을 바탕으로<br />나에게 필요한 입시 준비를 함께 설계합니다.</p>
          <div className="editorial-actions"><Link href="#admissions-routes">내게 맞는 입시 전략 찾기<ArrowUpRight size={17} /></Link><Link href={CONTACT_ANCHOR}>진학 상담하기<span>→</span></Link></div>
          <div className="editorial-signature"><span>오늘의 입시 준비, 내일의 의료인을 향해.</span><span>T MEDI</span></div>
        </div>
        <aside className="admissions-directory" aria-label="입시 준비 안내">
          <p className="eyebrow">A CLEAR PATH TO MEDICINE</p>
          <h2>목표는 선명하게.<br />준비는 체계적으로.</h2>
          <p className="directory-intro">지금 가장 필요한 준비부터 살펴보세요.</p>
          {[
            { number: "01", title: "지원 전략", body: "수시·정시, 나에게 맞는 전형 찾기", href: "/susi" },
            { number: "02", title: "입시결과", body: "대학·계열별 공시 자료 살펴보기", href: "/ipkyul" },
            { number: "03", title: "면접 준비", body: "대학별 MMI와 면접 유형 확인하기", href: "/interview" },
          ].map((item) => <Link key={item.number} href={item.href}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><ArrowUpRight size={18} strokeWidth={1.25} /></Link>)}
          <span className="directory-footnote">의대 · 치대 · 한의대 · 약대 · 수의대</span>
        </aside>
      </section>
      <section id="admissions-routes" className="editorial-index" aria-label="진학 프로그램 바로가기">
        {[{href:"/susi",title:"수시 전략",sub:"학생부교과 · 종합 · 논술"},{href:"/jungsi",title:"정시 설계",sub:"성적 분석 · 지원 조합"},{href:"/interview",title:"면접 & MMI",sub:"대학별 1:1 집중 준비"},{href:"/overseas",title:"해외 의대",sub:"또 하나의 진학 경로"}].map((item,i)=><Link href={item.href} key={item.href}><span className="index-number">0{i+1}</span><div><h2>{item.title}</h2><p>{item.sub}</p></div><ArrowUpRight size={17}/></Link>)}
      </section>

      <ChuseokBand />

      {/* 의대 진학 경로 — 이 사이트의 핵심 축 */}
      <AdmissionsCalendar events={UNIVS.flatMap((univ) => univ.tracks.filter((track) => track.interview).map((track) => ({ id: track.id, date: track.interview!, university: univ.short, track: track.name, note: track.interviewNote, href: `/univ/${univ.slug}`, sources: univ.sources }))).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))} pending={UNIVS.flatMap((univ) => univ.tracks.filter((track) => !track.interview).map((track) => `${univ.short} ${track.name}`))} />
      <PromoSection
        eyebrow="ROUTES"
        EyebrowIcon={Compass}
        title="의대로 가는 네 갈래"
        subtitle="지금 내 성적표와 상황에서 실제로 열려 있는 문이 어디인지부터 확인하세요."
      >
        <LinkCards
          items={[
            {
              href: "/susi",
              icon: ClipboardCheck,
              title: "고3 수시 총정리",
              body: "교과·종합·논술 세 전형의 구조와 모집 규모, 지역인재·지역의사제, 수능 최저까지 한눈에.",
            },
            {
              href: "/susi/jonghap",
              icon: FileText,
              title: "학생부종합전형",
              body: "1,227명으로 2027 의대 최대 전형. 생기부의 깊이와 MMI 면접이 당락을 가릅니다.",
            },
            {
              href: "/jungsi",
              icon: Target,
              title: "정시 전략",
              body: "수능 100%가 깨진 2027 정시. 영역별 반영 비율과 군별 3장 조합을 설계합니다.",
            },
            {
              href: "/overseas",
              icon: Globe2,
              title: "해외 의대 · 경유 루트",
              body: "인정 외국 의대 38개국 159개교, 예비시험을 거쳐 국내 면허까지 가는 경로를 숫자로.",
            },
          ]}
        />
      </PromoSection>

      {/* 강점 축 */}
      <PromoSection
        eyebrow="WHY"
        EyebrowIcon={ShieldCheck}
        title="왜 의약학은 별도 전략이 필요할까요?"
        subtitle="의치한약수 입시는 일반 대학 입시와 경쟁 구조·평가 요소가 다릅니다. T Medi는 이 차이를 정면으로 다룹니다."
        tone="muted"
      >
        <CheckList items={STRENGTHS} />
      </PromoSection>

      {/* 기능 소개 축 */}
      <PromoSection
        eyebrow="FEATURES"
        EyebrowIcon={Target}
        title="준비의 모든 순간에, 명확한 방향"
        subtitle="계열 선택부터 면접 대비까지, 의약학 진학의 전 과정을 지원합니다."
      >
        <FeatureGrid items={FEATURES} columns={3} />
      </PromoSection>

      {/* 계열별 전략 */}
      <PromoSection
        eyebrow="TRACKS"
        EyebrowIcon={GraduationCap}
        title="계열별 진학 전략"
        subtitle="의대·치대·한의대·약대·수의대, 그리고 정시 최저까지. 각 계열의 특성에 맞춘 접근을 확인하세요."
        tone="muted"
      >
        <FeatureGrid items={TRACKS} columns={3} />
      </PromoSection>

      {/* 다른 promo 페이지로 연결 */}
      <PromoSection eyebrow="MORE" EyebrowIcon={Newspaper} title="더 알아보기">
        <LinkCards
          items={[
            {
              href: "/susi/gyogwa",
              icon: BookOpenCheck,
              title: "학생부교과전형",
              body: "환산 등급과 수능 최저로 승부하는 정량 트랙. 1단계 배수 축소 흐름까지 정리했습니다.",
            },
            {
              href: "/susi/nonsul",
              icon: Target,
              title: "논술전형",
              body: "121명뿐인 좁은 문. 수리·과학 논술과 높은 최저를 동시에 요구합니다.",
            },
            {
              href: "/guide",
              icon: Compass,
              title: "사용법",
              body: "가입부터 목표 계열 선택, 성적·생기부 준비, 수시·정시 전략, 면접·MMI 대비까지 단계별 시작 가이드.",
            },
            {
              href: "/blog",
              icon: Newspaper,
              title: "블로그",
              body: "의약학 입시 트렌드, MMI 면접 실전, 수능 최저 전략, 계열 선택 인사이트를 담은 콘텐츠.",
            },
          ]}
        />
      </PromoSection>

      <FinalCTA
        title="의약학 진학, 지금 전략부터 시작하세요"
        body="목표 계열과 현재 성적, 생기부 고민을 알려주세요. 지금 필요한 준비부터 함께 정리합니다."
        Icon={Stethoscope}
        primaryHref="#contact"
        primaryLabel="진학 상담 문의하기"
      />
    </>
  );
}
