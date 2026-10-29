// ⚠️ 복사본 — 원본: Interview/interview-front/src/features/coach/set/types.ts
// 직접 고치지 말 것. Interview 에서 고친 뒤 node tools/sync-coach-to-tmedi.mjs (또는 tools/sync-set-spec.mjs) 로 다시 복사한다.
// 면접 세트 규격 v1 — 설계: docs/interview-set-spec.md
//
// 엔진(코치·MMI 실전)은 세트를 받아 돌리기만 하고, 세트(대학·전형·학과 + 방식 + 문항)는 사이트(T메디·T수시)가 만든다.
// 이 파일은 수시앱(sync-coach-to-susi)과 susi-back 에 같은 내용으로 복사된다 — 외부 의존성을 넣지 않는다.

export const SET_SPEC_VERSION = 1

export type SetSite = 'medi' | 'susi'

/** question = 질문 듣고 답하기(코치 일반 면접) · passage = 녹화형 제시문(코치 제시문 면접) · mmi = AI 꼬리질문(susi-back interview-sim) */
export type SetEngine = 'question' | 'passage' | 'mmi'

export interface InterviewSet {
  spec: 1
  /** 전역 고유. 사이트 접두사로 시작 — 권장 꼴 '<사이트>:<대학 키>:<전형>[:<학과>]:<묶음>' */
  id: string
  site: SetSite
  target: SetTarget
  title: string
  engine: SetEngine
  format: SetFormat
  items: SetItem[]
  source: { kind: '기출' | '대학 예시문항' | '자체 제작'; label: string; url?: string }
  /** 선생님 검수 전 초안 */
  draft?: boolean
  /** 제시문 원문 없이 요약만 있는 기출 세트 — 문제지 사진 올리기를 권한다 */
  summaryOnly?: boolean
  /** 진행 방식·유의사항(요강 문장) */
  notes?: string[]
  tips?: string[]
  /** 세트 공통 내용 평가 의도. 문항별 hint.intent 가 있으면 그쪽이 먼저 */
  evalIntent?: string
}

export interface SetTarget {
  /** 학년도 */
  year: number
  univ: string
  /** 대학명 정규화 키 — data/scripts/normalize_univ.py 와 같은 규칙 */
  univKey: string
  track: string
  /** 모집단위. 없으면 전형 전체 */
  unit?: string
  /** 사이트의 학과 축 키(T메디: uidae·chidae·hanuidae·yakdae·suuidae) */
  field?: string
}

export interface SetFormat {
  rooms: SetRoom[]
  /** 문항 고르는 법 — 학생이 고름 / 무작위 / 순서대로 */
  pick: 'student' | 'random' | 'order'
  /** 반영 비율·평가 요소(요강) */
  scoring?: string[]
  /** 시간 근거 한 줄 */
  timeNote?: string
}

export interface SetRoom {
  label: string
  /** 준비 시간(초, 녹화 안 함). 0 이면 바로 */
  prepSec: number
  /** 방 전체 답변 시간(초). 요강 값만 — 모르면 비우고 엔진 기본값을 쓴다 */
  answerSec?: number
  /** 이 시간 전에는 「면접 종료」를 막는다 */
  minAnswerSec?: number
  /** 이 방에서 다루는 문항 수 */
  itemsPerRoom: number
  /** 문항 하나에 권장하는 시간 */
  guideSecPerItem?: number
  /** 문항을 부르는 말 — '과목' · '문제'. 없으면 '문항' */
  itemNoun?: string
  /** AI 꼬리질문 최대 횟수(mmi) */
  followUps?: number
  orderFree?: boolean
  sharedPassage?: boolean
  /** 녹화 중 화면에 띄우는 한 줄 */
  recordingHint?: string
}

export interface SetPassage {
  label?: string
  text: string
}

export interface SetItem {
  /** 세트 안에서 고유 */
  id: string
  /** 학생이 듣는 첫 질문 */
  question: string
  /** 제시문·상황 본문·생기부 근거 요약 */
  passages?: SetPassage[]
  /** ①②③ 하위 질문 */
  subQuestions?: { label: string; text: string; points?: number }[]
  /** 미리 정한 꼬리질문 */
  followups?: string[]
  meta?: {
    year?: number
    kind?: string
    topic?: string
    subject?: string
    curriculum?: string
    /** 대학이 공개한 범위 그대로 — '의예과' · '전 계열 공통' */
    scope?: string
  }
  /** 연습이 끝난 뒤 학생에게 보여도 되는 것 */
  review?: { focus?: string; frame?: string[]; pitfall?: string; keyPoints?: string[] }
  /** 내용 평가 힌트 — AnswerHint 와 같다 */
  hint?: { intent?: string; keywords?: string[] }
  /** 🔒 면접관 메모 — 서버 전용. 공개 파일·브라우저에 절대 싣지 않는다 */
  memo?: SetMemo
}

export interface SetMemo {
  issues: string[]
  pitfalls: string[]
  followDirections: string[]
}

/** 선택기용 목록(index.json) 한 줄 */
export interface SetIndexEntry {
  id: string
  site: SetSite
  target: SetTarget
  title: string
  engine: SetEngine
  sourceKind: InterviewSet['source']['kind']
  draft?: boolean
  items: number
  /** 공개 파일 경로(같은 출처) */
  path: string
}

/** 사이트별 맛보기 범위 — 엔진은 세지 않고 이 범위만 받는다 */
export interface TasteRule {
  rooms: number
  itemsPerRoom: number
  followUps: number
  feedbackItems: number
}
