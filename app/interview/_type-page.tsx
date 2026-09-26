import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  type LucideIcon,
  MessagesSquare,
  MonitorPlay,
  ScrollText,
  Scale,
  Repeat,
  TriangleAlert,
  Gauge,
  Users,
} from "lucide-react";
import {
  CompareTable,
  FeatureGrid,
  FinalCTA,
  LinkCards,
  NoteBox,
  PromoHero,
  PromoSection,
  SourceNote,
} from "../_site/components";
import { ClassCtaBand } from "./_interview";
import { FactList } from "../univ/_univ";
import { AlsoUnivs, TypeUnivTable } from "./_interview";
import {
  alsoUnivsOfType,
  getInterviewType,
  INTERVIEW_TYPES,
  SESSION_HOURS_LABEL,
  univsOfType,
  type InterviewTypeKey,
} from "@/lib/interview-types";
import { JsonLdAll } from "@/components/json-ld";
import { article, breadcrumb } from "@/lib/jsonld";

/** 유형 3개 페이지가 공유하는 본문. 페이지 파일은 metadata 와 이 호출만 갖는다. */

const ICONS: Record<InterviewTypeKey, LucideIcon> = {
  mmi: Users,
  injeokseong: HeartHandshake,
  jesimun: ScrollText,
};

const ALSO_NOTE: Record<InterviewTypeKey, string> = {
  mmi: "아래 대학은 주된 형식이 MMI 는 아니지만, 면접실을 나누거나 2회로 쪼개 진행하는 구간이 있습니다.",
  injeokseong:
    "아래 대학은 MMI·제시문이 주된 형식이지만 스테이션 하나가 생기부 기반 인성·상황 질문입니다.",
  jesimun:
    "아래 대학은 주된 형식이 MMI 또는 서류확인 면접이지만, 제시문을 읽고 답하는 구간이 함께 있습니다.",
};

export function InterviewTypePage({ typeKey }: { typeKey: InterviewTypeKey }) {
  const type = getInterviewType(typeKey);
  if (!type) return null;

  const Icon = ICONS[typeKey];
  const main = univsOfType(typeKey);
  const also = alsoUnivsOfType(typeKey);
  const others = INTERVIEW_TYPES.filter((t) => t.key !== typeKey);

  const hasClassPage = main.some((r) => r.univ.hasClassPage);
  const topTables = (type.tables ?? []).filter((t) => t.slot === "top");
  const univTables = (type.tables ?? []).filter((t) => t.slot !== "top");

  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "면접 수업", path: "/interview" },
            { name: type.name, path: type.href },
          ]),
          article({
            path: type.href,
            headline: type.metaTitle,
            description: type.metaDescription,
          }),
        ]}
      />
      <PromoHero
        badge={`의대 면접 유형 · ${type.short}`}
        title={type.name}
        highlight={type.tagline}
        body={type.lede}
        primaryHref="#contact"
        primaryLabel="면접 수업 문의하기"
        secondaryHref="/interview"
        secondaryLabel="면접 유형 전체 보기"
        Icon={Icon}
        stats={[
          { icon: GraduationCap, label: `${main.length}개 의대` },
          { icon: ClipboardCheck, label: `전형 ${main.reduce((n, r) => n + (r.univ.interview?.tracks.length ?? 0), 0)}개` },
          { icon: MonitorPlay, label: `1:1 줌 ${SESSION_HOURS_LABEL}` },
        ]}
      />

      {topTables.map((t) => (
        <PromoSection
          key={t.title}
          eyebrow={t.eyebrow}
          EyebrowIcon={Scale}
          title={t.title}
          subtitle={t.subtitle}
          tone={t.tone ?? "default"}
        >
          <CompareTable head={t.head} rows={t.rows} caption={t.caption} />
        </PromoSection>
      ))}

      <PromoSection
        eyebrow="FORMAT"
        EyebrowIcon={Icon}
        title="이 방식은 어떻게 진행되나"
        subtitle="각 대학 2027학년도 수시 모집요강에서 확인된 내용만 정리했습니다."
      >
        <FactList items={type.what} />
      </PromoSection>

      <PromoSection
        eyebrow="UNIVERSITIES"
        EyebrowIcon={GraduationCap}
        title={`${type.short} 방식으로 면접을 보는 의대 ${main.length}곳`}
        subtitle="대학 이름을 누르면 그 대학의 전형 구조·모집인원·수능최저와 전형별 면접 일정을 볼 수 있습니다."
        tone="muted"
      >
        <TypeUnivTable rows={main} label={`${type.name} 실시 대학`} />
        <AlsoUnivs rows={also} note={ALSO_NOTE[typeKey]} />
      </PromoSection>

      {univTables.map((t) => (
        <PromoSection
          key={t.title}
          eyebrow={t.eyebrow}
          EyebrowIcon={Scale}
          title={t.title}
          subtitle={t.subtitle}
          tone={t.tone ?? "default"}
        >
          <CompareTable head={t.head} rows={t.rows} caption={t.caption} />
        </PromoSection>
      ))}

      <PromoSection
        eyebrow="PREPARATION"
        EyebrowIcon={Brain}
        title="무엇을 훈련해야 하나"
        subtitle="이 방식에서만 점수가 되는 것들입니다."
      >
        <FeatureGrid
          items={type.drills.map((d) => ({ icon: Icon, title: d.title, body: d.body }))}
          columns={2}
        />
      </PromoSection>

      <PromoSection
        eyebrow="PITFALLS"
        EyebrowIcon={TriangleAlert}
        title="이 방식에서 자주 깎이는 것"
        tone="muted"
      >
        <NoteBox
          title={`${type.short} 면접에서 흔한 실수`}
          items={type.pitfalls}
          tone="warn"
          Icon={TriangleAlert}
        />
      </PromoSection>

      {type.edges && (
        <PromoSection
          eyebrow="WHY 1:1"
          EyebrowIcon={Gauge}
          title={type.edges.title}
          subtitle={type.edges.subtitle}
        >
          <FeatureGrid
            items={type.edges.items.map((e) => ({ icon: Gauge, title: e.title, body: e.body }))}
            columns={2}
          />
        </PromoSection>
      )}

      {type.edges?.weakness && (
        <PromoSection
          eyebrow="TRADE-OFF"
          EyebrowIcon={MessagesSquare}
          title={type.edges.weakness.title}
          subtitle={type.edges.weakness.subtitle}
          tone="muted"
        >
          <CompareTable
            head={type.edges.weakness.head}
            rows={type.edges.weakness.rows}
            caption={type.edges.weakness.caption}
          />
        </PromoSection>
      )}

      {type.waitlist && (
        <PromoSection
          eyebrow="WAITLIST"
          EyebrowIcon={Repeat}
          title={type.waitlist.title}
          subtitle={type.waitlist.subtitle}
        >
          <NoteBox
            title={type.waitlist.boxTitle}
            items={type.waitlist.items}
            tone="warn"
            Icon={Repeat}
          />
        </PromoSection>
      )}

      <ClassCtaBand typeName={type.name} />

      <PromoSection eyebrow="MORE" EyebrowIcon={MessagesSquare} title="다른 유형도 함께 보기">
        <LinkCards
          columns={3}
          items={[
            ...others.map((t) => ({
              href: t.href,
              icon: ICONS[t.key],
              title: t.name,
              body: t.tagline,
            })),
            {
              href: "/univ",
              icon: hasClassPage ? CalendarDays : GraduationCap,
              title: hasClassPage
                ? "대학별 면접 일정 · 남은 자리"
                : "대학별 전형 · 면접 안내",
              body: hasClassPage
                ? "1단계 발표일에서 역산한 수업 일정과 예약 현황을 대학 페이지에서 바로 봅니다."
                : "전국 의대의 전형 구조와 면접 방식을 대학별로 한 페이지에.",
            },
          ]}
        />
      </PromoSection>

      <SourceNote
        lines={[
          "면접 방식·일정은 각 대학 2027학년도 수시 모집요강에서 정리했습니다. 대학별 근거와 출처는 각 대학 페이지 하단에 있습니다.",
          "유형 분류는 요강에 적힌 면접 방식 문장을 기준으로 했습니다. 요강이 'MMI 아님'으로 명시한 대학은 면접실이 둘이어도 MMI 로 분류하지 않았습니다.",
          "요강에서 확인되지 않은 날짜·시간·면접위원 수는 비워 두었습니다. 추정치로 채우지 않습니다.",
          "지원 판단은 반드시 해당 대학 최종 모집요강을 근거로 하세요.",
        ]}
      />

      <FinalCTA
        title={`${type.short} 면접은 연습한 만큼만 나옵니다`}
        body={`지원 대학의 면접 방식에 맞춰 과제와 모의면접을 설계합니다. 1회 ${SESSION_HOURS_LABEL}, 줌 1:1 수업입니다.`}
        Icon={Icon}
        primaryHref="#contact"
        primaryLabel="면접 수업 문의하기"
      />
    </>
  );
}
