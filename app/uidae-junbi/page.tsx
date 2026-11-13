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
  FlaskConical,
  MessagesSquare,
  Trophy,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  CheckList,
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
 *  세 갈래로 구성한다. 자세한 내용은 각 페이지로 보낸다 — 여기서 다시 길게 쓰지 않는다.
 *    ① 겨울방학 플래너 · 매일 학습량 경쟁  → /winter-planner
 *    ② 생기부 컨설팅 반                    → /uidae-consulting (가격·회차 SSOT: lib/consulting.ts)
 *    ③ 내년 과기원도 함께 지원(KAIST 등)   → T과기원 https://tgwagiwon.kr
 *
 *  ⚠️ 이 파일에 없는 것 — 확정되면 넣는다. 추정으로 채우지 말 것.
 *    · 의대준비반 가격·정원·모집 기간·선발 기준·개강일
 *  ⚠️ 문구 원칙 (app/uidae-consulting/page.tsx 와 같다)
 *    · 생기부 컨설팅은 '무엇을 언제 할지 설계·점검'으로만 쓴다. 합격률·합격 보장 문구 금지.
 *    · 과기원 전형 세부(일정·서류·면접 방식)는 여기 적지 않고 T과기원으로 보낸다.
 *  ========================================================================= */

const PATH = "/uidae-junbi";
const WINTER_PATH = "/winter-planner";
const GWAGIWON_URL = "https://tgwagiwon.kr";
const { plannerCheck } = UIDAE_CONSULTING;

const DESCRIPTION =
  "2028학년도 의대를 준비하는 전교권 학생들의 반입니다. 겨울방학 플래너로 매일 학습량을 겨루고, 생기부 컨설팅 반에서 활동을 설계하며, 내년 수시에서는 KAIST 등 과학기술원도 함께 지원합니다. 지금 모집 중입니다.";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: "2028 의대준비반 — 겨울방학 플래너 · 생기부 컨설팅 · 과기원 병행 지원 | T Medi",
  description: DESCRIPTION,
  openGraph: {
    title: "2028 의대준비반 | T Medi",
    description:
      "전교권 학생들이 매일 학습량으로 겨룹니다. 겨울방학 플래너 · 생기부 컨설팅 반 · 과기원 병행 지원.",
    url: PATH,
    type: "website",
  },
};

/** 세 갈래 한눈에 — 각 섹션으로 내려가는 앵커 */
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
    icon: Atom,
    title: "③ 과기원도 함께 지원",
    body: "내년 수시에서 의대 원서와 별도로 KAIST 등 과학기술원에 지원합니다.",
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

/** ③ 과기원 병행 지원 */
const GWAGIWON_WHY = [
  "KAIST · GIST · DGIST · UNIST 같은 과학기술원은 수시 6회 지원 제한에 포함되지 않습니다. 의대에 쓸 여섯 장을 그대로 두고 따로 지원할 수 있습니다.",
  "의대 학생부종합을 준비하며 쌓은 수학·과학 탐구 기록은 과기원 서류에서도 그대로 평가받습니다. 준비가 따로 늘어나는 부분은 자기소개서와 면접입니다.",
  "의대만 바라보면 선택지가 여섯 장에 묶입니다. 과기원을 함께 준비하면 같은 기록으로 지원할 수 있는 곳이 넓어집니다.",
];

const GWAGIWON_PREP = [
  {
    icon: FlaskConical,
    title: "탐구 기록",
    body: "의대 준비 과정에서 하는 탐구를 과기원이 보는 관점으로도 정리해 둡니다. 생기부 컨설팅 반에서 함께 설계합니다.",
  },
  {
    icon: FileText,
    title: "자기소개서",
    body: "KAIST 등 과기원은 지원 서류에 자기소개서가 들어갑니다. 3학년이 되어 급하게 쓰지 않도록 소재를 미리 모읍니다.",
  },
  {
    icon: MessagesSquare,
    title: "면접",
    body: "과기원 면접은 의대 면접과 묻는 것이 다릅니다. 대학별 면접 대비는 T과기원에서 진행합니다.",
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
    title: "의대와 이공계를 함께 열어 두려는 학생",
    body: "의대가 1순위지만 KAIST 등 과학기술원도 선택지로 가져가려는 학생.",
  },
];

/** 범위를 정직하게 */
const HONEST = [
  "공부와 활동은 학생이 합니다. 대신 써 드리거나 대신 해 드리지 않습니다.",
  "학교생활기록부는 학교 선생님이 관찰해 씁니다. 저희는 어떤 활동을 언제 할지 설계하고 계획대로 가고 있는지 점검합니다.",
  "과기원 지원 여부는 학생과 학부모가 정합니다. 전형 일정과 제출 서류는 해마다 달라지므로 각 대학 모집요강을 함께 확인합니다.",
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
    body: "KAIST·GIST·DGIST·UNIST 등 과학기술원 입시 — 자소서·면접·탐구 안내.",
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
        body="2028학년도 의대를 준비하는 반입니다. 이번 겨울방학은 플래너로 매일의 학습량을 겨루고, 생기부 컨설팅 반에서 남은 학기의 활동을 설계합니다. 내년 수시에서는 의대 원서와 별도로 KAIST 등 과학기술원도 함께 지원합니다."
        primaryHref="#contact"
        primaryLabel="의대준비반 상담 신청"
        secondaryHref="#tracks"
        secondaryLabel="구성 보기"
        Icon={Stethoscope}
        stats={[
          { icon: Users, label: "전교권 학생 대상" },
          { icon: Snowflake, label: "겨울방학 플래너" },
          { icon: FileText, label: "생기부 컨설팅 반" },
          { icon: Atom, label: "과기원 병행 지원" },
        ]}
      />

      {/* 세 갈래 한눈에 */}
      <div id="tracks" className="scroll-mt-32">
        <PromoSection
          eyebrow="THREE TRACKS"
          EyebrowIcon={Layers}
          title="의대준비반은 세 갈래로 움직입니다"
          subtitle="방학의 학습량, 학기의 생기부, 그리고 내년 원서. 따로 준비하면 서로의 일정을 모릅니다."
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

      {/* ③ 과기원 병행 지원 */}
      <div id="gwagiwon" className="scroll-mt-32">
        <PromoSection
          eyebrow="TRACK 3 · KAIST & MORE"
          EyebrowIcon={Atom}
          title="내년, 과기원도 함께 지원합니다"
          subtitle="의대 여섯 장에 선택지를 묶어 둘 이유가 없습니다. KAIST 등 과학기술원은 그 여섯 장 밖에 있습니다."
        >
          <CheckList items={GWAGIWON_WHY} />

          <div className="mt-14">
            <p className="eyebrow mb-6 flex items-center justify-center gap-2 text-center text-brass-600">
              <Ticket className="h-4 w-4" strokeWidth={1.5} />
              KAIST 등 대비 — 미리 챙기는 세 가지
            </p>
            <FeatureGrid items={GWAGIWON_PREP} columns={3} />
          </div>

          <MoreBar
            title="과기원 입시는 T과기원에서 자세히"
            body="KAIST · GIST · DGIST · UNIST 등 대학별 전형과 자기소개서 · 면접 대비는 T과기원에 정리되어 있습니다."
            href={GWAGIWON_URL}
            label="T과기원 바로가기"
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
