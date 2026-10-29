// ⚠️ 복사본 — 원본: Interview/interview-front/src/features/coach/set/validate.ts
// 직접 고치지 말 것. Interview 에서 고친 뒤 node tools/sync-coach-to-tmedi.mjs (또는 tools/sync-set-spec.mjs) 로 다시 복사한다.
// 면접 세트 검사기 — 사이트가 공개 파일·서버 파일을 만들 때, 코치가 세트를 받을 때 같은 규칙으로 검사한다.
import type { InterviewSet, SetEngine, SetIndexEntry, SetItem, SetSite } from './types'

const SITES: SetSite[] = ['medi', 'susi']
const ENGINES: SetEngine[] = ['question', 'passage', 'mmi']
const PICKS = ['student', 'random', 'order']
const SOURCE_KINDS = ['기출', '대학 예시문항', '자체 제작']

export type SetCheck = { ok: true; set: InterviewSet } | { ok: false; errors: string[] }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const isSec = (v: unknown) => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 3 * 60 * 60
const isStrList = (v: unknown) => Array.isArray(v) && v.every((s) => typeof s === 'string')

/**
 * 세트 하나를 검사한다.
 * publicFile: 공개 파일(사이트 정적 경로·브라우저)로 쓸 세트 — 면접관 메모(memo)가 있으면 실패
 */
export function validateSet(x: unknown, opts: { publicFile?: boolean } = {}): SetCheck {
  const e: string[] = []
  if (!isObj(x)) return { ok: false, errors: ['세트가 객체가 아니다'] }
  const s = x as Partial<InterviewSet> & Record<string, unknown>

  if (s.spec !== 1) e.push(`spec 은 1 이어야 한다 (받은 값: ${String(s.spec)})`)
  if (!SITES.includes(s.site as SetSite)) e.push(`site 는 ${SITES.join('·')} 중 하나`)
  if (!isText(s.id)) e.push('id 가 비었다')
  else if (s.site && !s.id.startsWith(`${s.site}:`)) e.push(`id 는 '${s.site}:' 로 시작해야 한다`)
  if (!isText(s.title)) e.push('title 이 비었다')
  if (!ENGINES.includes(s.engine as SetEngine)) e.push(`engine 은 ${ENGINES.join('·')} 중 하나`)

  const t = s.target
  if (!isObj(t)) e.push('target 이 없다')
  else {
    if (typeof t.year !== 'number' || !Number.isInteger(t.year)) e.push('target.year 는 정수(학년도)')
    if (!isText(t.univ)) e.push('target.univ 가 비었다')
    if (!isText(t.univKey)) e.push('target.univKey 가 비었다')
    if (!isText(t.track)) e.push('target.track 이 비었다')
  }

  const src = s.source
  if (!isObj(src) || !SOURCE_KINDS.includes(src.kind as string) || !isText(src.label)) {
    e.push(`source 는 { kind: ${SOURCE_KINDS.join('|')}, label } 이어야 한다`)
  }

  const f = s.format
  const rooms = isObj(f) && Array.isArray(f.rooms) ? f.rooms : null
  if (!isObj(f)) e.push('format 이 없다')
  else {
    if (!PICKS.includes(f.pick as string)) e.push(`format.pick 은 ${PICKS.join('·')} 중 하나`)
    if (!rooms?.length) e.push('format.rooms 가 비었다')
    if (f.scoring !== undefined && !isStrList(f.scoring)) e.push('format.scoring 은 글 목록')
  }
  rooms?.forEach((r, i) => {
    const at = `format.rooms[${i}]`
    if (!isObj(r)) return void e.push(`${at} 가 객체가 아니다`)
    if (!isText(r.label)) e.push(`${at}.label 이 비었다`)
    if (!isSec(r.prepSec)) e.push(`${at}.prepSec 는 0 이상의 정수(초)`)
    if (r.answerSec !== undefined && (!isSec(r.answerSec) || r.answerSec === 0)) e.push(`${at}.answerSec 는 1 이상의 정수(초)`)
    if (r.minAnswerSec !== undefined && !isSec(r.minAnswerSec)) e.push(`${at}.minAnswerSec 는 0 이상의 정수(초)`)
    if (typeof r.itemsPerRoom !== 'number' || !Number.isInteger(r.itemsPerRoom) || r.itemsPerRoom < 1) e.push(`${at}.itemsPerRoom 은 1 이상의 정수`)
    if (r.followUps !== undefined && (!Number.isInteger(r.followUps) || (r.followUps as number) < 0)) e.push(`${at}.followUps 는 0 이상의 정수`)
  })

  const items = Array.isArray(s.items) ? s.items : null
  if (!items?.length) e.push('items 가 비었다')
  const ids = new Set<string>()
  items?.forEach((it, i) => {
    const at = `items[${i}]`
    if (!isObj(it)) return void e.push(`${at} 가 객체가 아니다`)
    if (!isText(it.id)) e.push(`${at}.id 가 비었다`)
    else if (ids.has(it.id)) e.push(`${at}.id '${it.id}' 가 겹친다`)
    else ids.add(it.id)
    if (!isText(it.question)) e.push(`${at}.question 이 비었다`)
    if (it.passages !== undefined && !(Array.isArray(it.passages) && it.passages.every((p) => isObj(p) && isText(p.text)))) {
      e.push(`${at}.passages 는 { text } 목록`)
    }
    if (it.followups !== undefined && !isStrList(it.followups)) e.push(`${at}.followups 는 글 목록`)
    if (opts.publicFile && it.memo !== undefined) e.push(`${at}.memo — 공개 파일에 면접관 메모가 있다`)
  })

  // 엔진별 — 코치는 방 하나만 돌린다
  if (rooms?.length && items?.length) {
    if ((s.engine === 'question' || s.engine === 'passage') && rooms.length !== 1) e.push(`engine '${s.engine}' 는 방이 하나여야 한다`)
    if (s.engine === 'passage' && rooms[0] && isObj(rooms[0]) && rooms[0].answerSec === undefined) e.push("engine 'passage' 는 rooms[0].answerSec(녹화 시간)가 있어야 한다")
    if (s.engine === 'mmi') {
      rooms.forEach((r, i) => {
        if (isObj(r) && r.answerSec === undefined) e.push(`engine 'mmi' 는 rooms[${i}].answerSec 가 있어야 한다`)
      })
      if (items.length < rooms.length) e.push("engine 'mmi' 는 문항이 방 수 이상이어야 한다")
    }
  }

  return e.length ? { ok: false, errors: e } : { ok: true, set: x as unknown as InterviewSet }
}

/** 면접관 메모가 들어 있나 */
export const hasPrivate = (set: InterviewSet) => set.items.some((it) => it.memo !== undefined)

/** 공개 파일용 — 면접관 메모를 뺀 사본 */
export function toPublicSet(set: InterviewSet): InterviewSet {
  return { ...set, items: set.items.map(({ memo: _memo, ...rest }): SetItem => rest) }
}

/** 선택기용 목록 한 줄 */
export function indexEntry(set: InterviewSet, path: string): SetIndexEntry {
  return {
    id: set.id,
    site: set.site,
    target: set.target,
    title: set.title,
    engine: set.engine,
    sourceKind: set.source.kind,
    ...(set.draft ? { draft: true } : {}),
    items: set.items.length,
    path,
  }
}

/**
 * 임베드가 `#set=` 으로 받는 경로 — 같은 출처의 상대 경로(.json)만 허락한다.
 * 다른 사이트 주소·프로토콜·상위 폴더(..)·백슬래시는 막는다(CSP 도 connect-src 'self' 지만 한 번 더).
 */
export function isSetPath(p: unknown): p is string {
  if (typeof p !== 'string' || p.length > 300) return false
  if (!p.startsWith('/') || p.startsWith('//')) return false
  if (/[\\:?#]/.test(p)) return false
  if (p.split('/').some((seg) => seg === '..' || seg === '.')) return false
  return /^\/[A-Za-z0-9._~\-/%]+\.json$/.test(p)
}
