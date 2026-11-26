import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Check, ClipboardList, FileText, MessageCircle, PawPrint, Pill, Stethoscope, Users } from "lucide-react";
import { PromoSection } from "../_site/components";
import { CONTACT_ANCHOR } from "../_site/chrome";
import { CONTACT_PHONE, CONTACT_TEL } from "@/lib/contact";
import styles from "./recruitment.module.css";

const TITLE = "의대반·약대반·수의대반 모집 | T메디 메디컬 목표반";
const DESCRIPTION = "학원·인강·교재는 내 방식대로. 선생님이 학습 계획, 상담, 반 관리와 생기부 컨설팅을 맡고, 같은 목표의 학생들은 플래너에서 학습량을 겨룹니다. 의대반·약대반·수의대반 별도 모집.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/uidae-class" },
  openGraph: {
    title: TITLE, description: DESCRIPTION, url: "/uidae-class", type: "website",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "T메디 메디컬 목표반" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png?v=2"] },
};

const CLASSES = [
  { name: "의대반", english: "MEDICINE", icon: Stethoscope, description: "의학을 향한 공부에 방향을 더합니다.", topics: "생명과학 · 건강 · 의료에 대한 관심", detail: "의대를 목표로 하는 학생끼리 학습 흐름을 만들고, 자신의 관심을 교과 학습과 탐구 활동으로 연결합니다." },
  { name: "약대반", english: "PHARMACY", icon: Pill, description: "약학을 향한 관심을 꾸준한 실천으로.", topics: "화학 · 생명과학 · 의약품에 대한 관심", detail: "약대를 목표로 하는 학생끼리 실행을 점검하고, 약학에 대한 질문을 자신의 학습과 탐구로 구체화합니다." },
  { name: "수의대반", english: "VETERINARY MEDICINE", icon: PawPrint, description: "동물과 생명을 향한 목표를 함께 키웁니다.", topics: "동물 건강 · 생명 · 환경에 대한 관심", detail: "수의대를 목표로 하는 학생끼리 공부의 페이스를 맞추고, 진로 관심을 교과와 실제 활동으로 확장합니다." },
];

const CARE = [
  { icon: ClipboardList, title: "학습 계획", body: "학원 시간표, 인강, 학교 일정과 자습 시간을 함께 놓고 지금 해야 할 공부의 우선순위와 분량을 정합니다." },
  { icon: MessageCircle, title: "상담과 조정", body: "계획이 밀리는 이유와 과목별 고민을 듣습니다. 실행 기록을 바탕으로 다음 계획을 학생에게 맞게 조정합니다." },
  { icon: Users, title: "반별 학습방 관리", body: "선생님이 각 반의 학습방을 운영하고 플래너 기록과 참여 흐름을 챙깁니다. 학생들이 함께 공부를 이어갈 수 있도록 관리합니다." },
  { icon: FileText, title: "생기부 컨설팅", body: "학생의 진로 관심과 실제 활동을 바탕으로 무엇을 언제 탐구할지 설계하고 점검합니다. 계획이 학교생활 속 실천으로 이어지도록 돕습니다." },
];

const FAQ = [
  { question: "지금 다니는 학원을 계속 다녀도 되나요?", answer: "네. 학원, 인강, 교재와 학습 장소는 학생이 직접 선택합니다. 선생님은 그 일정을 반영해 학습 계획을 세우고 실행을 관리합니다. 과목별 수업을 일괄 제공하는 반은 아닙니다." },
  { question: "의대·약대·수의대 지원자가 같은 반에서 공부하나요?", answer: "의대반, 약대반, 수의대반을 각각 따로 편성합니다. 같은 목표의 학생끼리 플래너에서 학습량과 실행을 비교하며 공부하고, 선생님은 각 반의 학습방을 관리합니다." },
  { question: "플래너 경쟁은 무엇을 비교하나요?", answer: "매일 기록한 학습량과 계획의 실행을 중심으로 서로의 공부를 확인하는 방식입니다. 오래 앉아 있기보다 자신이 정한 공부를 해내는 데 초점을 둡니다. 구체적인 비교 기준과 운영 방식은 반 편성 시 안내합니다." },
  { question: "생기부 컨설팅에서는 무엇을 하나요?", answer: "진로와 연결되는 교과 학습, 탐구 주제와 활동 시기를 선생님과 함께 설계하고 점검합니다. 학생이 직접 질문하고 탐구하며 실제 경험을 쌓는 과정에 집중합니다." },
  { question: "대상 학년, 개강일과 수강료는 어떻게 되나요?", answer: "희망 반과 현재 학년, 학습 상황을 알려주시면 모집 대상과 반 편성 가능 여부를 상담해 드립니다. 개강 일정, 정원, 수강료와 상담·컨설팅 횟수는 상담 시 확인해 주세요." },
];

export default function UidaeClassPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="class-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>T MEDI · 메디컬 목표반 모집</p>
          <h1 id="class-title">공부는 내 방식대로,<br /><em>관리는 선생님과 함께.</em></h1>
          <p className={styles.lead}>학원도, 인강도, 교재도 내가 선택합니다.<br />계획과 상담, 생기부의 방향은 선생님과 잡고<br className={styles.desktopBreak} /> 매일의 실행은 같은 목표의 친구들과 이어갑니다.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={CONTACT_ANCHOR}>모집 상담 문의</a>
            <a className={styles.secondary} href="#medical-classes">나에게 맞는 반 보기</a>
          </div>
          <p className={styles.heroNote}>의대반 · 약대반 · 수의대반 <span>각각 별도 편성</span></p>
        </div>
        <aside className={styles.heroPanel} aria-label="메디컬 목표반 운영 구조">
          <div className={styles.panelTop}><span>같은 목표, 함께 만드는 루틴</span><BookOpen size={22} aria-hidden="true" /></div>
          <p className={styles.panelTitle}>혼자 하는 공부에<br />함께 가는 힘을.</p>
          <div className={styles.panelClasses}>{CLASSES.map(({ name, icon: Icon }) => <div key={name}><Icon size={26} strokeWidth={1.4} aria-hidden="true" /><span>{name}</span></div>)}</div>
          <div className={styles.panelRow}><span>학생</span><p>나에게 맞는 수업 선택 · 매일 실행</p></div>
          <div className={styles.panelRow}><span>선생님</span><p>계획 · 상담 · 반 관리 · 생기부 컨설팅</p></div>
          <div className={styles.panelRow}><span>같은 반</span><p>플래너 학습량 경쟁 · 꾸준한 동기</p></div>
          <p className={styles.panelFoot}>배우는 방식은 달라도, 목표는 함께.</p>
        </aside>
      </section>

      <nav className={styles.sectionNav} aria-label="모집 안내 바로가기">
        <a href="#medical-classes">모집 반</a><a href="#teacher-care">선생님의 역할</a><a href="#planner-team">플래너 경쟁</a><a href="#class-faq">자주 묻는 질문</a>
      </nav>

      <div id="medical-classes" className={styles.anchor}>
        <PromoSection eyebrow="OUR CLASSES" title="목표가 같아야, 함께 가기 좋으니까." subtitle="의대반·약대반·수의대반을 따로 모집합니다. 각 반에서 같은 진로를 바라보는 친구들과 학습의 기준을 만들어 갑니다.">
          <div className={styles.classes}>{CLASSES.map(({ name, english, icon: Icon, description, topics, detail }) => (
            <article key={name} className={styles.classCard}>
              <div className={styles.classLabel}><span>{english}</span><Icon size={28} strokeWidth={1.4} aria-hidden="true" /></div>
              <h3>{name}</h3><p className={styles.classIntro}>{description}</p><p>{detail}</p>
              <div className={styles.topics}><span>탐구 방향 예시</span><p>{topics}</p></div>
              <a href={CONTACT_ANCHOR}>{name} 모집 상담</a>
            </article>
          ))}</div>
        </PromoSection>
      </div>

      <div id="teacher-care" className={styles.anchor}>
        <PromoSection eyebrow="STUDENT & TEACHER" title="학생의 선택 위에, 선생님의 관리를 더합니다." subtitle="수업을 고르는 일부터 모든 것을 바꿀 필요는 없습니다. 지금의 공부가 목표에 맞게 이어지도록 함께 정리합니다." tone="muted">
          <div className={styles.roles}>
            <div className={styles.studentRole}><span className={styles.eyebrow}>학생이 선택하고 실행합니다</span><h3>내 공부의 주도권은<br />나에게.</h3><ul>{["학원·인강·교재 선택", "나에게 맞는 학습 장소 선택", "매일 공부하고 플래너 기록", "직접 탐구하고 학교 활동 참여"].map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}</ul></div>
            <div className={styles.teacherRole}>{CARE.map(({ icon: Icon, title, body }) => <article key={title}><Icon size={24} strokeWidth={1.5} aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
          </div>
        </PromoSection>
      </div>

      <section id="planner-team" className={`${styles.team} ${styles.anchor}`} aria-labelledby="planner-title">
        <div><p className={styles.eyebrow}>STUDY TOGETHER</p><h2 id="planner-title">계획은 나에게 맞게.<br />실행은 서로 자극받으며.</h2><p>같은 반 친구들이 오늘 해낸 공부를 보면, 나의 다음 공부도 조금 더 분명해집니다. 플래너에서 학습량을 겨루고 선생님이 그 흐름을 함께 살핍니다.</p><p>경쟁에서 끝나지 않도록, 밀린 계획과 어려웠던 과목은 상담에서 다시 조정합니다.</p><Link href="/winter-planner" className={styles.textLink}>겨울방학 플래너 운영 방식 보기</Link></div>
        <div className={styles.planner}>
          <div className={styles.plannerHead}><h3>우리 반의 학습 루틴</h3><span>운영 흐름 예시</span></div>
          <ol>{[
            ["계획하기", "선생님과 학습 목표·분량 정리"],
            ["실행하고 기록하기", "선택한 수업과 자습, 플래너에 기록"],
            ["함께 비교하기", "같은 반 친구들과 학습량·실행 확인"],
            ["피드백하고 다시 시작하기", "선생님 상담으로 다음 계획 조정"],
          ].map(([title, body]) => <li key={title}><Check size={18} aria-hidden="true" /><div><strong>{title}</strong><p>{body}</p></div></li>)}</ol>
          <p className={styles.plannerFoot}>학생의 기록 → 반 안의 자극 → 선생님의 피드백</p>
        </div>
      </section>

      <PromoSection eyebrow="GET STARTED" title="지금의 공부를 듣는 것부터 시작합니다." subtitle="희망 계열과 현재 학년, 학원·인강 일정, 학습 고민을 알려주세요.">
        <ol className={styles.steps}>
          <li><MessageCircle aria-hidden="true" /><h3>모집 상담</h3><p>목표 계열과 현재 공부 방식을 함께 살펴봅니다.</p></li>
          <li><Users aria-hidden="true" /><h3>반 편성 안내</h3><p>의대·약대·수의대 중 희망 반의 일정과 운영 조건을 확인합니다.</p></li>
          <li><ClipboardList aria-hidden="true" /><h3>계획과 관리 시작</h3><p>개인 학습 계획을 잡고, 반별 플래너 활동과 선생님의 관리를 시작합니다.</p></li>
        </ol>
        <p className={styles.conditions}>개강일·정원·수강료·상담 및 컨설팅 횟수는 모집 상담에서 안내합니다.</p>
      </PromoSection>

      <div id="class-faq" className={styles.anchor}>
        <PromoSection eyebrow="QUESTIONS" title="등록 전에 궁금한 것들" tone="muted">
          <div className={styles.faq}>{FAQ.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
        </PromoSection>
      </div>

      <section className={styles.cta} aria-labelledby="join-title"><p className={styles.eyebrow}>의대반 · 약대반 · 수의대반 모집</p><h2 id="join-title">내 방식의 공부,<br />이제 함께 이어가세요.</h2><p>어느 반을 희망하는지, 지금 어떤 도움이 필요한지 들려주세요.</p><div className={styles.actions}><a href={CONTACT_ANCHOR} className={styles.lightButton}>모집 상담 문의</a><a href={CONTACT_TEL} className={styles.phone}>전화 상담 {CONTACT_PHONE}</a></div></section>
    </div>
  );
}
