import type { Metadata } from "next";
import {
  Stethoscope,
  Snowflake,
  FileText,
  Atom,
  Users,
  Flame,
  Gauge,
  Repeat2,
  ClipboardList,
  LineChart,
  UserCheck,
  Layers,
  Target,
  Scale,
  Ticket,
  FileStack,
  Medal,
  Trophy,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  NoteBox,
  LinkCards,
  InkButton,
  FinalCTA,
} from "../_site/components";
import { JsonLdAll } from "@/components/json-ld";
import { breadcrumb } from "@/lib/jsonld";
import { UIDAE_CONSULTING, UIDAE_CONSULTING_PATH } from "@/lib/consulting";

/** =========================================================================
 *  2028 의대준비반 — 프로모 페이지 (2026-11-13 사용자 요청)
 *
 *  두 축 + 덤 하나로 구성한다. 자세한 내용은 각 페이지로 보낸다 — 여기서 다시 길게 쓰지 않는다.
 *    ① 겨울방학 플래너 · 매일 학습량 경쟁  → /winter-planner
 *    ② 생기부 컨설팅 반                    → /uidae-consulting (가격·회차 SSOT: lib/consulting.ts)
 *    + 더불어, 과기원 합격증 하나           → T과기원 https://tgwagiwon.kr
 *
 *  ⚠️ 과기원은 이 반의 목적이 아니다 (2026-11-14 사용자).
 *    · 의대 가는 김에 하나 걸쳐 두는 것 — '훈장 하나를 달고 간다'는 컨셉으로만 언급한다.
 *      히어로·제목·메타에서 과기원을 주력으로 내세우지 않는다.
 *    · 다만 걸쳐 두는 데도 준비가 필요하다: 입증자료 5건. 내년(2028학년도)부터 이 5건이 평가 대상이 된다(사용자).
 *      T과기원 /admissions/2028/kaist 에 'KAIST 학업탐구역량 입증자료 5건'으로 안내되어 있다.
 *    · 이 준비는 전문 선생님들이 학생 시간을 뺏지 않는 범위에서 맡는다 — 학생이 실제로 한 탐구·활동을 바탕으로.
 *
 *  ⚠️ 이 파일에 없는 것 — 확정되면 넣는다. 추정으로 채우지 말 것.
 *    · 의대준비반 가격·정원·모집 기간·선발 기준·개강일
 *  ⚠️ 문구 원칙 (app/uidae-consulting/page.tsx 와 같다)
 *    · 생기부 컨설팅은 '무엇을 언제 할지 설계·점검'으로만 쓴다. 합격률·합격 보장 문구 금지.
 *    · 과기원 전형 세부(일정·면접 방식 등)는 여기 적지 않고 T과기원으로 보낸다.
 *    · 하지 않은 활동을 만들어 넣는다는 뜻으로 읽힐 표현을 쓰지 않는다.
 *  ========================================================================= */

const PATH = "/uidae-junbi";
const WINTER_PATH = "/winter-planner";
const GWAGIWON_URL = "https://tgwagiwon.kr";
const GWAGIWON_KAIST_URL = "https://tgwagiwon.kr/admissions/2028/kaist";
const { plannerCheck } = UIDAE_CONSULTING;

const DESCRIPTION =
  "2028학년도 의대를 준비하는 전교권 학생들의 반입니다. 겨울방학 플래너로 매일 학습량을 겨루고, 생기부 컨설팅 반에서 남은 학기의 활동을 설계합니다. 더불어 과학기술원 합격증 하나를 달고 갈 수 있도록 입증자료 준비는 전문 선생님들이 맡습니다. 지금 모집 중입니다.";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: "2028 의대준비반 — 전교권 학생들의 겨울방학 플래너 · 생기부 컨설팅 반 | T Medi",
  description: DESCRIPTION,
  openGraph: {
    title: "2028 의대준비반 | T Medi",
    description:
      "전교권 학생들이 매일 학습량으로 겨룹니다. 겨울방학 플래너 · 생기부 컨설팅 반.",
    url: PATH,
    type: "website",
  },
};

/** 두 축 + 덤 하나 — 각 섹션으로 내려가는 앵커 */
const TRACKS = [
  {
    href: "#winter",
    icon: Snowflake,
    title: "① 겨울방학 플래너",
    body: "방학에 쓸 수 있는 칸을 먼저 세고 계획을 짭니다. 그날 끝낸 학습량으로 반 안에서 매일 겨룹니다.",
  },
  {
    href: "#sanggibu",
    icon: FileText,
    title: "② 생기부 컨설팅 반",
    body: "3학년 1학기까지 무엇을 언제 할지 설계하고, 계획대로 가고 있는지 점검합니다.",
  },
  {
    href: "#gwagiwon",
    icon: Medal,
    title: "+ 더불어, 훈장 하나",
    body: "목표는 의대입니다. 가는 김에 과학기술원 합격증 하나를 달고 갑니다. 준비는 선생님들이 맡습니다.",
  },
];

/** ① 겨울방학 플래너 */
const WINTER = [
  {
    icon: Gauge,
    title: "목표보다 칸을 먼저 셉니다",
    body: "방학 기간과 빠지는 날을 넣으면 쓸 수 있는 칸이 나옵니다. 교재별로 한 칸에 얼마나 해야 하는지 보고, 무리한 목표는 시작 전에 고칩니다.",
  },
  {
    icon: Repeat2,
    title: "매일 남은 분량을 다시 나눕니다",
    body: "오늘 분량은 남은 분량을 남은 칸으로 나눠 정합니다. 하루 밀려도 계획 전체가 어긋나지 않습니다.",
  },
  {
    icon: Flame,
    title: "매일 학습량으로 겨룹니다",
    body: "전교권 학생들끼리 한 반입니다. 각자 플래너에 확정하고 끝낸 그날의 학습량이 반 안에서 비교됩니다.",
  },
];

/** ② 생기부 컨설팅 반 */
const SANGGIBU = [
  {
    icon: FileText,
    title: "무엇을 언제 할지 설계합니다",
    body: "학생부종합전형이 보는 학업역량·진로역량·공동체역량을 기준으로, 남은 학기에 이어 갈 탐구 주제와 활동 방향을 함께 정합니다. 활동은 학생이 하고 기록은 학교 선생님이 씁니다.",
  },
  {
    icon: ClipboardList,
    title: `학습 플래너 ${plannerCheck} 검사`,
    body: "탐구 일정과 내신·수행평가 일정을 한 화면에 놓습니다. 설계한 활동이 주간 계획 안에 실제로 들어 있는지 선생님이 확인합니다.",
  },
  {
    icon: LineChart,
    title: "내신 · 모의고사 성적까지 함께",
    body: "생기북 앱으로 내신을, 모고 앱으로 모의고사를 쌓아 봅니다. 목표 의대의 수능 최저학력기준과 지금 성적 사이의 거리를 확인합니다.",
  },
];

/** + 더불어 — 과기원은 목적이 아니라 덤이다 */
const GWAGIWON_POINTS = [
  {
    icon: Ticket,
    title: "의대 원서는 그대로 둡니다",
    body: "KAIST 등 과학기술원은 수시 6회 지원 제한에 포함되지 않습니다. 의대에 쓸 여섯 장을 한 장도 줄이지 않고 따로 지원할 수 있습니다.",
  },
  {
    icon: FileStack,
    title: "다만, 입증자료 5건이 필요합니다",
    body: "걸쳐 두는 데도 준비는 필요합니다. 과학기술원에 지원하려면 학업·탐구 역량을 보여 주는 입증자료 5건을 준비해야 합니다.",
  },
  {
    icon: UserCheck,
    title: "준비는 전문 선생님들이 맡습니다",
    body: "의대준비반 학생에게 가장 아까운 것은 공부 시간입니다. 학생이 해 온 탐구와 활동을 바탕으로, 전문 선생님들이 학생의 시간을 뺏지 않는 범위에서 입증자료 5건을 갖춰 드립니다.",
  },
];

/** 이런 학생에게 */
const FOR_WHOM = [
  {
    icon: Trophy,
    title: "전교권 성적으로 의대를 목표로 하는 학생",
    body: "혼자서도 잘하지만, 같은 수준의 경쟁자가 옆에 있을 때 더 멀리 가는 학생.",
  },
  {
    icon: Layers,
    title: "이번 겨울방학이 중요한 학생",
    body: "3학년이 되기 전 마지막 긴 방학을 계획 없이 보내고 싶지 않은 학생.",
  },
  {
    icon: Target,
    title: "의대 공부에만 시간을 쓰고 싶은 학생",
    body: "과학기술원 서류 같은 곁가지 준비는 선생님에게 맡기고, 자기 시간은 내신과 수능에 쓰려는 학생.",
  },
];

/** 범위를 정직하게 */
const HONEST = [
  "공부와 활동은 학생이 합니다. 대신 써 드리거나 대신 해 드리지 않습니다.",
  "학교생활기록부는 학교 선생님이 관찰해 씁니다. 저희는 어떤 활동을 언제 할지 설계하고 계획대로 가고 있는지 점검합니다.",
  "과학기술원 입증자료는 학생이 실제로 한 탐구와 활동을 바탕으로 준비합니다. 하지 않은 활동을 만들어 넣지 않습니다.",
  "과학기술원 지원 여부는 학생과 학부모가 정합니다. 제출 서류와 평가 방식은 각 대학 모집요강을 함께 확인합니다.",
  "합격을 보장하지 않습니다. 모집 기준과 일정, 비용은 상담에서 안내해 드립니다.",
];

const RELATED = [
  {
    href: WINTER_PATH,
    icon: Snowflake,
    title: "겨울방학 플래너",
    body: "칸부터 세는 방학 계획 — 용량 점검, 주 패턴, 주간 점검까지 자세히 봅니다.",
  },
  {
    href: UIDAE_CONSULTING_PATH,
    icon: UserCheck,
    title: "고1·고2 의대 컨설팅",
    body: "생기부·플래너·내신·모의고사를 담당 선생님 한 명이 함께 관리합니다.",
  },
  {
    href: GWAGIWON_URL,
    icon: Atom,
    title: "T과기원",
    body: "과학기술원 전형과 입증자료 · 자기소개서 · 면접 안내는 T과기원에서.",
  },
];

/** 섹션 아래 '자세히 보기' 줄 — 좌측 제이드 바 콜아웃 + 버튼 */
function MoreBar({
  title,
  body,
  href,
  label,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <div className="mx-auto mt-12 flex max-w-5xl bg-jade-50">
      <span className="w-[3px] shrink-0 bg-jade-600" />
      <div className="flex w-full flex-col items-start gap-6 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="display text-[1.0625rem] leading-snug text-ink-900">{title}</h3>
          <p className="mt-2.5 text-[14px] font-light leading-[1.85] text-ink-600">{body}</p>
        </div>
        <InkButton href={href} label={label} className="shrink-0" />
      </div>
    </div>
  );
}

export default function UidaeJunbiPage() {
  return (
    <>
      <JsonLdAll items={[breadcrumb([{ name: "2028 의대준비반", path: PATH }])]} />

      <PromoHero
        badge="2028 의대준비반 · 모집 중"
        title="전교권 학생들이 모여,"
        highlight="매일 학습량으로 겨룹니다"
        body="2028학년도 의대를 준비하는 반입니다. 이번 겨울방학은 플래너로 매일의 학습량을 겨루고, 생기부 컨설팅 반에서 남은 학기의 활동을 설계합니다. 내신·수능·학생부 어느 하나도 비워 둘 수 없는 의대 입시를, 같은 목표를 가진 전교권 학생들과 함께 준비합니다."
        primaryHref="#contact"
        primaryLabel="의대준비반 상담 신청"
        secondaryHref="#tracks"
        secondaryLabel="구성 보기"
        Icon={Stethoscope}
        stats={[
          { icon: Users, label: "전교권 학생 대상" },
          { icon: Snowflake, label: "겨울방학 플래너" },
          { icon: FileText, label: "생기부 컨설팅 반" },
          { icon: Flame, label: "매일 학습량 경쟁" },
        ]}
      />

      {/* 두 축 + 덤 하나 */}
      <div id="tracks" className="scroll-mt-32">
        <PromoSection
          eyebrow="THREE TRACKS"
          EyebrowIcon={Layers}
          title="두 축으로 움직이고, 훈장 하나를 더합니다"
          subtitle="방학의 학습량과 학기의 생기부가 의대준비반의 두 축입니다. 과학기술원은 가는 김에 하나 걸쳐 둡니다."
          tone="muted"
        >
          <LinkCards items={TRACKS} columns={3} />
        </PromoSection>
      </div>

      {/* ① 겨울방학 플래너 */}
      <div id="winter" className="scroll-mt-32">
        <PromoSection
          eyebrow="TRACK 1 · WINTER"
          EyebrowIcon={Snowflake}
          title="겨울방학 플래너 — 매일 학습량으로 겨룹니다"
          subtitle="3학년이 되기 전 마지막 긴 방학입니다. 지킬 수 있는 계획을 세우고, 같은 목표를 가진 경쟁자와 매일 비교합니다."
        >
          <FeatureGrid items={WINTER} columns={3} />
          <MoreBar
            title="방학 계획을 짜는 방식이 궁금하다면"
            body="용량 점검 예시, 주 패턴, 밀렸을 때 처리하는 방법을 겨울방학 플래너 페이지에 정리했습니다."
            href={WINTER_PATH}
            label="겨울방학 플래너 보기"
          />
        </PromoSection>
      </div>

      {/* ② 생기부 컨설팅 반 */}
      <div id="sanggibu" className="scroll-mt-32">
        <PromoSection
          eyebrow="TRACK 2 · RECORD"
          EyebrowIcon={FileText}
          title="생기부 컨설팅 반 — 남은 학기를 설계합니다"
          subtitle="수시에는 3학년 1학기까지의 학생부가 반영됩니다. 지나간 학기는 다시 채울 수 없습니다."
          tone="muted"
        >
          <FeatureGrid items={SANGGIBU} columns={3} />
          <MoreBar
            title="구성과 비용은 의대 컨설팅 페이지에서"
            body="생기부 컨설팅 회차, 플래너 검사, 내신·모의고사 관리가 어떻게 묶여 있는지 자세히 안내합니다."
            href={UIDAE_CONSULTING_PATH}
            label="의대 컨설팅 보기"
          />
        </PromoSection>
      </div>

      {/* + 더불어 — 과기원은 목적이 아니라 덤. 주력 섹션보다 가볍게 둔다 */}
      <div id="gwagiwon" className="scroll-mt-32">
        <PromoSection
          eyebrow="PLUS · 더불어"
          EyebrowIcon={Medal}
          title="가는 김에, 훈장 하나를 달고 갑니다"
          subtitle="의대준비반의 목표는 의대입니다. 과학기술원은 목표가 아니라, 의대로 가는 길에 하나 걸쳐 두는 합격증입니다."
        >
          <FeatureGrid items={GWAGIWON_POINTS} columns={3} />

          <div className="mx-auto mt-12 max-w-5xl">
            <NoteBox
              tone="warn"
              title="내년부터 입증자료 5건이 평가 대상이 됩니다"
              items={[
                "과학기술원은 내년 입시부터 이 입증자료 5건을 평가에 반영합니다. 내면 좋은 참고 서류가 아니라, 점수가 매겨지는 서류가 됩니다.",
                "그래서 걸쳐만 두려 해도 미리 준비해야 합니다. 3학년 원서철에 급하게 모으면 의대 준비 시간을 깎게 됩니다.",
              ]}
              Icon={FileStack}
            />
          </div>

          <MoreBar
            title="자세한 전형 안내는 T과기원에서"
            body="입증자료 5건이 무엇인지, 전형과 자기소개서 · 면접이 어떻게 진행되는지는 T과기원에 정리되어 있습니다."
            href={GWAGIWON_KAIST_URL}
            label="T과기원에서 보기"
          />
        </PromoSection>
      </div>

      {/* 이런 학생에게 */}
      <PromoSection
        eyebrow="FOR WHOM"
        EyebrowIcon={Target}
        title="이런 학생을 모집합니다"
        tone="muted"
      >
        <FeatureGrid items={FOR_WHOM} columns={3} />
        <div className="mt-12">
          <NoteBox
            title="할 수 있는 범위를 정직하게 말씀드립니다"
            items={HONEST}
            Icon={Scale}
          />
        </div>
      </PromoSection>

      {/* 함께 보면 좋은 안내 */}
      <PromoSection eyebrow="MORE" EyebrowIcon={Layers} title="자세한 안내">
        <LinkCards items={RELATED} columns={3} />
      </PromoSection>

      <FinalCTA
        title="2028 의대준비반, 지금 모집 중입니다"
        body="학년과 최근 내신·모의고사 성적, 목표 대학을 알려 주세요. 모집 기준과 일정을 안내하고 무엇부터 잡을지 함께 정리해 드립니다."
        Icon={Stethoscope}
        primaryHref="#contact"
        primaryLabel="상담 신청하기"
      />
    </>
  );
}
