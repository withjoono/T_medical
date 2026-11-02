/**
 * CI 전용: 지금 tmedi.kr 에서 서비스 중인 AI 모의면접 파일을 public/ai-interview 로 받아 온다.
 *
 * public/ai-interview 는 Interview 저장소 빌드 결과물(약 70MB)이라 git 에 없다.
 * Firebase 배포는 파일 세트를 통째로 바꾸므로, CI 가 이 폴더 없이 배포하면
 * /interview/ai 가 사라진다. 그래서 배포된 manifest.json(scripts/check-ai-interview.mjs 가
 * 빌드 때 씀)을 보고 같은 파일을 받아 sha256 까지 맞춘 뒤 다시 배포한다.
 *
 * AI 모의면접을 새로 바꾸는 건 여전히 PC 에서 한다:
 * Interview 저장소 `node tools/sync-coach-to-tmedi.mjs` → 이 리포에서 빌드·배포.
 * 폴더가 이미 있으면(로컬) 아무것도 하지 않는다.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DIR = join(ROOT, 'public/ai-interview')
const BASE = (process.env.AI_INTERVIEW_SOURCE ?? 'https://tmedi.kr') + '/ai-interview/'

if (existsSync(join(DIR, 'embed.html'))) {
  console.log('[fetch-ai-interview] public/ai-interview 가 이미 있어 건너뜀')
  process.exit(0)
}

async function get(path) {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`${res.status} ${BASE + path}`)
  return Buffer.from(await res.arrayBuffer())
}

try {
  const { files } = JSON.parse((await get('manifest.json')).toString('utf8'))
  let total = 0
  for (const f of files) {
    const buf = await get(f.path)
    const sha = createHash('sha256').update(buf).digest('hex')
    if (buf.length !== f.size || sha !== f.sha256) {
      throw new Error(`내용이 manifest 와 다름: ${f.path}`)
    }
    mkdirSync(dirname(join(DIR, f.path)), { recursive: true })
    writeFileSync(join(DIR, f.path), buf)
    total += buf.length
  }
  console.log(`[fetch-ai-interview] ${files.length}개 파일 ${(total / 1e6).toFixed(1)}MB 받음 ← ${BASE}`)
} catch (e) {
  console.error(
    `[fetch-ai-interview] 서비스 중인 AI 모의면접 파일을 받지 못했습니다: ${e.message}\n` +
      '  PC 에서 public/ai-interview 를 채운 뒤 한 번 수동 배포하면 manifest.json 이 올라가 다음부터 받을 수 있습니다.',
  )
  process.exit(1)
}
