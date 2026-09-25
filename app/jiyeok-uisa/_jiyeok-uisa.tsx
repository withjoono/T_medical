import {
  BadgeCheck,
  CalendarDays,
  CircleHelp,
  Coins,
  GraduationCap,
  MapPin,
  MessagesSquare,
  Scale,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  FinalCTA,
  LinkCards,
  NoteBox,
  PromoHero,
  PromoSection,
  SourceNote,
} from "../_site/components";
import { FactList } from "../univ/_univ";
import {
  AS_OF,
  COMPETITION_BY_REGION,
  COMPETITION_TOP,
  COMPETITION_TOTAL,
  DUTY,
  FAQ,
  GYEONGIN_NOTE,
  QUALIFICATION,
  SCALE,
  SOURCES,
  TUITION_SUPPORT,
  YEAR,
} from "@/lib/jiyeok-uisa";

/** =========================================================================
 *  /jiyeok-uisa — 지역의사 선발전형 정보 페이지.
 *
 *  전부 서버 컴포넌트다. 표의 숫자가 HTML 에 박혀야 색인되고 AI 검색이 읽는다.
 *  이미지 표를 쓰지 않는다 — 기계가 못 읽는다.
 *
 *  FAQ 는 본문에 보이는 그대로가 FAQPage 스키마로 나간다. 둘을 어긋나게 하지 말 것.
 *  ========================================================================= */

function Th({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <th
      className={`px-4 py-4 text-[12px] font-semibold tracking-tight ${
        first ? "" : "border-l border-white/10"
      }`}
    >
      {children}
    </th>
  );
}

/** 지역인재 vs 지역의사 자격 비교 — 이 페이지의 핵심 표 */
function QualificationTable() {
  return (
    <div className="mx-auto max-w-5xl">
      <div
        role="region"
        aria-label="지역인재전형과 지역의사전형 지원자격 비교"
        tabIndex={0}
        className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">
            지역인재전형과 지역의사 선발전형의 지원자격·의무 비교
          </caption>
          <thead>
            <tr className="bg-ink text-paper">
              <Th first>구분</Th>
              <Th>지역인재전형</Th>
              <Th>지역의사 선발전형</Th>
            </tr>
          </thead>
          <tbody>
            {QUALIFICATION.map((r) => (
              <tr key={r.item} className="align-top">
                <td className="w-[8.5rem] border-t border-hair px-4 py-4 font-medium text-ink-900">
                  {r.item}
                </td>
                <td className="border-t border-hair px-4 py-4 text-[13px] font-light leading-relaxed text-ink-700">
                  {r.jiyeokInjae}
                </td>
                <td className="border-t border-l border-hair bg-paper-100 px-4 py-4 text-[13px] font-light leading-relaxed text-ink-900">
                  {r.jiyeokUisa}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-[12px] font-light text-ink-500">
        {GYEONGIN_NOTE}
      </p>
    </div>
  );
}

function CompetitionTable() {
  return (
    <div className="mx-auto max-w-4xl">
      <div
        role="region"
        aria-label="2027 수시 지역의사전형 권역별 경쟁률"
        tabIndex={0}
        className="comparison-scroll overflow-x-auto border border-hair-strong bg-paper-50"
      >
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <caption className="sr-only">
            2027학년도 수시 지역의사 선발전형 권역별 모집인원·지원인원·경쟁률
          </caption>
          <thead>
            <tr className="bg-ink text-paper">
              <Th first>권역</Th>
              <Th>모집</Th>
              <Th>지원</Th>
              <Th>경쟁률</Th>
            </tr>
          </thead>
          <tbody>
            {COMPETITION_BY_REGION.map((r) => (
              <tr key={r.region}>
                <td className="border-t border-hair px-4 py-3.5 font-medium text-ink-900">
                  {r.region}
                </td>
                <td className="tnum border-t border-hair px-4 py-3.5 text-ink-700">
                  {r.recruit}명
                </td>
                <td className="tnum border-t border-hair px-4 py-3.5 text-ink-500">
                  {r.applied.toLocaleString()}명
                </td>
                <td className="tnum border-t border-hair px-4 py-3.5 font-medium text-jade-700">
                  {r.rate}대 1
                </td>
              </tr>
            ))}
            <tr className="bg-paper-100">
              <td className="border-t border-hair-strong px-4 py-3.5 font-semibold text-ink-900">
                전체 {COMPETITION_TOTAL.univs}개교
              </td>
              <td className="tnum border-t border-hair-strong px-4 py-3.5 font-medium text-ink-700">
                {COMPETITION_TOTAL.recruit}명
              </td>
              <td className="tnum border-t border-hair-strong px-4 py-3.5 font-medium text-ink-700">
                {COMPETITION_TOTAL.applied.toLocaleString()}명
              </td>
              <td className="tnum border-t border-hair-strong px-4 py-3.5 font-semibold text-jade-700">
                {COMPETITION_TOTAL.rate}대 1
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-center text-[13px] font-light leading-relaxed text-ink-700">
        대학별 최고 경쟁률 —{" "}
        {COMPETITION_TOP.map((t) => `${t.univ} ${t.rate}대 1`).join(" · ")}
      </p>
    </div>
  );
}

function FaqList() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-hair border-y border-hair-strong">
      {FAQ.map((f) => (
        <div key={f.q} className="py-7">
          <h3 className="flex gap-3 text-[15px] font-semibold leading-relaxed text-ink-900">
            <span className="mt-0.5 shrink-0 text-jade-600">Q.</span>
            {f.q}
          </h3>
          <p className="mt-3 pl-7 text-[14px] font-light leading-[1.9] text-ink-700">
            {f.a}
          </p>
        </div>
      ))}
    </div>
  );
}

export function JiyeokUisaPage() {
  return (
    <>
      <PromoHero
        badge={`${YEAR} 첫 도입 · 지역의사 선발전형`}
        title="지역의사제란"
        highlight="10년 의무복무가 붙은 의대 전형"
        body={`지역의사 선발전형은 의사면허 취득 후 ${DUTY.years}년간 지정된 지역에서 근무하는 조건으로 선발하는 의대 전형입니다. ${YEAR}에 서울을 제외한 ${SCALE.univs}개 의대에서 ${SCALE.total}명을 처음 뽑았습니다. 학비는 국가·지자체가 지원하지만, 반환해도 의무복무는 면제되지 않습니다.`}
        primaryHref="#qualification"
        primaryLabel="지원자격부터 확인하기"
        secondaryHref="/susi"
        secondaryLabel="수시 전형 전체 보기"
        Icon={MapPin}
        stats={[
          { icon: Users, label: `${SCALE.total}명 선발` },
          { icon: GraduationCap, label: `${SCALE.univs}개 의대` },
          { icon: CalendarDays, label: `의무복무 ${DUTY.years}년` },
        ]}
      />

      <PromoSection
        eyebrow="DEFINITION"
        EyebrowIcon={BadgeCheck}
        title="한 문단으로 먼저"
        subtitle={`${YEAR} 기준으로 확정된 사실만 적었습니다.`}
      >
        <FactList
          items={[
            `지역의사 선발전형은 면허 취득 후 ${DUTY.years}년간 선발 지역에서 근무하는 조건부 면허를 전제로 선발하는 전형입니다.`,
            `${YEAR}에 서울을 제외한 ${SCALE.univs}개 의대에서 ${SCALE.total}명을 선발했습니다. 진료권 단위 ${SCALE.jinryo}명, 광역권 단위 ${SCALE.gwangyeok}명입니다.`,
            "진료권은 실제 의료이용 권역에 따라 여러 시·군·구를 묶은 단위이고, 광역권은 이를 시·도 수준으로 넓힌 단위입니다.",
            `차의과학대는 8월에 따로 마감했고, 나머지 ${SCALE.susiUnivs}개 대학이 2026년 9월 7일부터 수시로 모집했습니다.`,
            `2028~2031학년도에는 매년 ${SCALE.planFrom2028}명을 선발할 계획입니다. 연도별 인원은 매년 재심의 대상이라 확정치가 아닙니다.`,
          ]}
        />
      </PromoSection>

      <div id="qualification" />
      <PromoSection
        eyebrow="QUALIFICATION"
        EyebrowIcon={Scale}
        title="지역인재와 지역의사는 자격이 다릅니다"
        subtitle="이름이 비슷해 가장 많이 헷갈리는 지점입니다. 중학교 요건이 결정적으로 다릅니다."
        tone="muted"
      >
        <QualificationTable />
        <div className="mx-auto mt-10 max-w-3xl">
          <NoteBox
            title="자격에서 자주 어긋나는 경우"
            items={[
              "지역인재는 '비수도권 중학교'면 되지만, 지역의사는 '대학이 속한 광역권 중학교'여야 합니다. 비수도권이기만 하면 되는 것이 아닙니다.",
              "이사·전학 시점 때문에 중·고교가 서로 다른 기준 지역에 걸치면 지원할 수 없습니다. 각각의 요건을 따로 충족해야 합니다.",
              "학교 소재지와 거주지가 다른 시·군이어도, 같은 기준 지역에 속하면 인정됩니다.",
              "검정고시 출신은 지원할 수 없습니다.",
            ]}
            tone="warn"
            Icon={TriangleAlert}
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="DUTY"
        EyebrowIcon={CalendarDays}
        title={`의무복무 ${DUTY.years}년은 어떻게 세나`}
        subtitle="입학 전에 반드시 확인해야 하는 부분입니다. 기간이 체감보다 길어질 수 있습니다."
      >
        <FactList
          items={[
            DUTY.countFrom,
            `다음 기간은 ${DUTY.years}년에 들어가지 않습니다 — ${DUTY.excluded.join(", ")}.`,
            DUTY.exception,
            ...DUTY.workplace,
            "전공의 수련은 의무복무 지역 안에서 한 경우에만 전부 또는 일부가 인정됩니다. 지역 밖 수련은 산입되지 않습니다.",
          ]}
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <NoteBox
            title="의무를 이행하지 않으면"
            items={[...DUTY.penalty]}
            tone="warn"
            Icon={TriangleAlert}
          />
        </div>
      </PromoSection>

      <PromoSection
        eyebrow="TUITION"
        EyebrowIcon={Coins}
        title="학비는 지원되지만, 반환해도 의무는 남습니다"
        tone="muted"
      >
        <FactList
          items={[
            `국가와 지방자치단체가 ${TUITION_SUPPORT.covers.join(" · ")}를 지원합니다.`,
            TUITION_SUPPORT.ifNormal,
            TUITION_SUPPORT.ifDropout,
            "학비 반환과 면허 제재는 별개로 작동합니다. 돈을 돌려주는 것으로 복무 의무가 해소되지 않습니다.",
          ]}
        />
      </PromoSection>

      <PromoSection
        eyebrow="COMPETITION"
        EyebrowIcon={Users}
        title={`첫 선발 경쟁률은 ${COMPETITION_TOTAL.rate}대 1이었습니다`}
        subtitle={`${YEAR} 수시 ${COMPETITION_TOTAL.univs}개교 기준. ${COMPETITION_TOTAL.recruit}명 모집에 ${COMPETITION_TOTAL.applied.toLocaleString()}명이 지원했습니다.`}
      >
        <CompetitionTable />
      </PromoSection>

      <PromoSection
        eyebrow="FAQ"
        EyebrowIcon={CircleHelp}
        title="자주 나오는 질문"
        tone="muted"
      >
        <FaqList />
      </PromoSection>

      <PromoSection eyebrow="MORE" EyebrowIcon={GraduationCap} title="함께 보기">
        <LinkCards
          columns={3}
          items={[
            {
              href: "/susi",
              icon: GraduationCap,
              title: "의대 수시 전형 총정리",
              body: "교과 · 학종 · 논술 — 전형별 구조와 지역 선발을 한 번에.",
            },
            {
              href: "/ipkyul/uiye",
              icon: Scale,
              title: "의예과 입시결과",
              body: "대학별 전형별 입결을 실측 자료로만 정리했습니다.",
            },
            {
              href: "/interview",
              icon: MessagesSquare,
              title: "의대 면접 유형",
              body: "지역의사전형도 면접이 있는 대학이 있습니다. 방식부터 확인하세요.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          `이 페이지의 수치는 ${AS_OF} 기준으로 확인한 정부 발표와 보도자료에서 정리했습니다.`,
          `대학별 선발인원은 ${SCALE.univs}개 전체가 확인되지 않아 싣지 않았습니다. 추정치로 채우지 않습니다 — 지원 판단은 해당 대학 최종 모집요강을 근거로 하세요.`,
          `2028~2031학년도 연 ${SCALE.planFrom2028}명은 계획 수치이며 매년 재심의 대상입니다. 확정치가 아닙니다.`,
          ...SOURCES.map((s) => `${s.label} — ${s.url}`),
        ]}
      />

      <FinalCTA
        title="지역의사전형도 면접에서 갈립니다"
        body="자격을 갖췄다면 다음은 면접입니다. 지원 대학의 면접 방식과 일정에 맞춰 1:1로 준비합니다."
        Icon={MessagesSquare}
        primaryHref="/interview"
        primaryLabel="면접 유형 확인하기"
      />
    </>
  );
}
