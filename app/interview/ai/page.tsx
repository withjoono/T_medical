import type { Metadata } from "next";
import { Camera, Eye, Mic, ShieldCheck } from "lucide-react";
import { NoteBox, PromoHero, PromoSection } from "../../_site/components";
import { JsonLdAll } from "@/components/json-ld";
import { breadcrumb } from "@/lib/jsonld";
import { AiTabs } from "./_ai-tabs";
import { TwoPaths } from "./_two-paths";
import { setIndex } from "@/lib/interview-sets";

/** =========================================================================
 *  /interview/ai — AI 모의면접.
 *
 *  본체는 Interview 저장소(features/coach)다. 여기는 그 빌드 결과(public/ai-interview)를
 *  같은 출처 iframe 으로 띄우기만 한다. 갱신: Interview 에서 `node tools/sync-coach-to-tmedi.mjs`.
 *
 *  두 번째 탭 'MMI 실전 모의면접'(_mmi-sim.tsx)은 대학 형식 모의면접 + AI 꼬리질문 + 기준표 피드백이다.
 *  서버는 면접 공용 엔진(/interview-sim, Susi 저장소 susi-back)이고 로그인이 필요하다.
 *  ========================================================================= */

export const metadata: Metadata = {
  alternates: { canonical: "/interview/ai" },
  title: "AI 모의면접 | T Medi — 의·치·한·약·수 면접 답변을 카메라 앞에서 연습",
  description:
    "의대·치대·한의대·약대·수의대 면접 질문에 실제처럼 답하면 시선·표정·자세·목소리 크기·말 빠르기를 분석해 고칠 점을 알려 줍니다(영상은 기기 밖으로 나가지 않음). MMI 실전 모의면접에서는 대학 형식 그대로 AI 면접관의 꼬리질문에 답하고 답변 구조 피드백을 받습니다. AI 모의면접만 쓰는 방법과, AI 결과로 선생님이 피드백하는 1:1 수업의 비용·차이도 안내합니다. tmedi.kr",
};

export default function Page() {
  return (
    <>
      <JsonLdAll
        items={[
          breadcrumb([
            { name: "의약학 면접", path: "/interview" },
            { name: "AI 모의면접", path: "/interview/ai" },
          ]),
        ]}
      />
      <PromoHero
        badge="실전 모의 1회 무료"
        title="AI 모의면접"
        highlight="혼자서 실전처럼 연습하기"
        body="말하기·태도 연습은 시선·표정·자세·목소리 크기·말 빠르기를 분석해 고칠 점을 알려 드립니다. MMI 실전 모의면접은 대학 면접 형식 그대로 AI 면접관이 꼬리질문을 던지고, 끝나면 답변 구조를 기준 6가지로 점검해 드립니다."
        primaryHref="#coach"
        primaryLabel="바로 연습하기"
        secondaryHref="#paths"
        secondaryLabel="AI만 / 선생님 수업 비교"
        Icon={Camera}
        stats={[
          { icon: Eye, label: "시선·표정·자세" },
          { icon: Mic, label: "목소리·말 빠르기" },
          { icon: ShieldCheck, label: "영상은 기기 안에서만" },
        ]}
      />
      <PromoSection
        eyebrow="AI 모의면접"
        title="두 가지로 연습하세요"
        subtitle="말하기·태도 연습은 학과·대학·전형을 고르면 그 대학이 공개한 기출로 연습합니다(로그인 없이). MMI 실전 모의면접은 로그인 후 쓸 수 있습니다. 둘 다 마이크 권한이 필요합니다."
      >
        <div id="coach" className="scroll-mt-24">
          <AiTabs entries={setIndex()} />
        </div>
        <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-2">
          <NoteBox
            title="말하기·태도 연습"
            Icon={ShieldCheck}
            items={[
              "영상과 음성은 서버로 보내지 않습니다. 분석은 모두 이 브라우저 안에서 끝납니다.",
              "처음 쓸 때 분석 모델(약 20MB)과, 답변 내용 분석을 켜면 음성 인식 모델(약 225MB)을 한 번 내려받습니다. 와이파이에서 시작하세요.",
              "PC의 크롬·엣지에서 가장 잘 동작합니다. 휴대폰에서는 느릴 수 있습니다.",
              "태도와 말하기 습관을 봅니다. 답변 내용은 MMI 실전 모의면접과 1:1 면접 수업에서 다룹니다.",
            ]}
          />
          <NoteBox
            title="MMI 실전 모의면접"
            Icon={ShieldCheck}
            items={[
              "로그인이 필요합니다. 답변 기록과 피드백은 내 계정에만 저장되고, 학년도가 끝나면(다음 해 2월 말) 자동으로 지워집니다. 언제든 직접 지울 수 있습니다.",
              "음성은 저장하지 않습니다. 브라우저 음성 인식(크롬은 Google, 사파리는 Apple)이 받아쓴 글만 서버로 보냅니다. 마이크가 없으면 글로 답해도 됩니다.",
              "꼬리질문과 피드백은 외부 AI 모델이 만듭니다. 점수나 합격 가능성은 내지 않고, 모범답안도 주지 않습니다.",
              "지금은 고려대 의학과 인·적성 면접(8분 × 2방) 형식을 엽니다. 제시문은 시제품용 초안이며 선생님 검수를 거쳐 늘려 갑니다.",
            ]}
          />
        </div>
      </PromoSection>

      {/* 체험 뒤의 두 갈래 — AI 만 / 선생님 수업(AI 결과로 피드백). 결과 화면이 #paths 로 보낸다 */}
      <div id="paths" className="scroll-mt-24" />
      <PromoSection
        eyebrow="AFTER THE TRIAL"
        title="써 보셨다면, 두 가지로 이어 가실 수 있습니다"
        subtitle="AI 모의면접만 계속 쓰셔도 되고, 선생님 1:1 수업을 받으셔도 됩니다. 선생님 수업은 학생이 본 AI 모의면접 결과를 가지고 선생님이 피드백하는 방식입니다."
        tone="muted"
      >
        <TwoPaths />
      </PromoSection>
    </>
  );
}
