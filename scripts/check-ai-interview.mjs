/**
 * pnpm build 전에 AI 모의면접(/interview/ai) 파일이 있는지 확인한다.
 * public/ai-interview 는 Interview 저장소에서 빌드해 넣는 결과물이라 git 에 없다(.gitignore).
 * 없으면 /interview/ai 가 빈 iframe 으로 배포되므로 빌드를 멈춘다.
 */
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
if (!existsSync(join(ROOT, 'public/ai-interview/embed.html'))) {
  console.error(
    '[check-ai-interview] public/ai-interview 가 없습니다. /interview/ai 가 비어서 배포됩니다.\n' +
      '  Interview 저장소에서 먼저 실행하세요: node tools/sync-coach-to-tmedi.mjs',
  )
  process.exit(1)
}
console.log('[check-ai-interview] public/ai-interview 확인')
