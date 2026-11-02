/**
 * pnpm build 전에 AI 모의면접(/interview/ai) 파일이 있는지 확인한다.
 * public/ai-interview 는 Interview 저장소에서 빌드해 넣는 결과물이라 git 에 없다(.gitignore).
 * 없으면 /interview/ai 가 빈 iframe 으로 배포되므로 빌드를 멈춘다.
 *
 * 확인이 끝나면 public/ai-interview/manifest.json(파일 목록·크기·sha256)을 쓴다.
 * 이 목록이 함께 배포되므로, CI 는 scripts/fetch-ai-interview.mjs 로
 * 지금 서비스 중인 파일을 그대로 받아 다시 배포할 수 있다.
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const DIR = join(ROOT, 'public/ai-interview')
const MANIFEST = 'manifest.json'

if (!existsSync(join(DIR, 'embed.html'))) {
  console.error(
    '[check-ai-interview] public/ai-interview 가 없습니다. /interview/ai 가 비어서 배포됩니다.\n' +
      '  Interview 저장소에서 먼저 실행하세요: node tools/sync-coach-to-tmedi.mjs\n' +
      '  (CI 에서는 scripts/fetch-ai-interview.mjs 가 서비스 중인 파일을 받아 온다)',
  )
  process.exit(1)
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

const files = walk(DIR)
  .map((p) => relative(DIR, p).split(sep).join('/'))
  .filter((p) => p !== MANIFEST)
  .sort()
  .map((path) => {
    const buf = readFileSync(join(DIR, path))
    return { path, size: buf.length, sha256: createHash('sha256').update(buf).digest('hex') }
  })

writeFileSync(join(DIR, MANIFEST), JSON.stringify({ files }, null, 2) + '\n')
console.log(`[check-ai-interview] public/ai-interview 확인 — ${files.length}개 파일, ${MANIFEST} 작성`)
