import { test } from 'node:test'
import assert from 'node:assert/strict'
import { initialChunks, prepareHtml, prepareExport, inlineInitialAssets } from './prepare-static-chunks.mjs'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const flight = '<script>self.__next_f.push([1,"static/chunks/shared-abc.js static/chunks/shared-abc.js"])</script>'
const html = `<html><head><title>중앙대</title></head><body><h1>의대 면접</h1>${flight}</body></html>`
test('starts Flight-only chunks once, retaining SSR content and metadata', () => {
  assert.deepEqual(initialChunks(html), ['/_next/static/chunks/shared-abc.js'])
  const result = prepareHtml(html)
  assert.match(result, /<script src="\/_next\/static\/chunks\/shared-abc.js" async="" data-initial-chunk=""><\/script><\/head>/)
  assert.ok(result.includes('<h1>의대 면접</h1>'))
  assert.ok(result.includes('<title>중앙대</title>'))
  assert.equal(prepareHtml(result), result)
})
test('does not duplicate existing scripts or modify non-Next pages', () => {
  const existing = html.replace('</head>', '<script src="/_next/static/chunks/shared-abc.js" async=""></script></head>')
  assert.equal(prepareHtml(existing), existing)
  assert.equal(prepareHtml('<html><head></head><body>Plain</body></html>'), '<html><head></head><body>Plain</body></html>')
})
test('export gate rejects missing chunks, accepts complete export', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tmedi-chunks-test-'))
  try {
    await writeFile(join(root, 'index.html'), html)
    await assert.rejects(prepareExport(root), /ENOENT/)
    await mkdir(join(root, '_next/static/chunks'), { recursive: true })
    await writeFile(join(root, '_next/static/chunks/shared-abc.js'), '/* test */')
    await prepareExport(root)
    const output = await readFile(join(root, 'index.html'), 'utf8')
    assert.ok(output.includes('<script data-static-src="/_next/static/chunks/shared-abc.js">/* test */</script>'))
    assert.ok(!output.includes('<script src="/_next/static/chunks/shared-abc.js"'))
  } finally {
    await rm(root, { recursive: true })
  }
})
test('inlines CSS with rebased URLs and escapes script closing tags', async () => {
  const root = await mkdtemp(join(tmpdir(), 'tmedi-chunks-test-'))
  try {
    await mkdir(join(root, '_next/static/chunks'), { recursive: true })
    await mkdir(join(root, '_next/static/css'), { recursive: true })
    await writeFile(join(root, '_next/static/chunks/a.js'), 'console.log("</script>", "$&", "$$")')
    await writeFile(join(root, '_next/static/css/a.css'), 'body{background:url(../media/a.png)}')
    const input = '<head><link rel="stylesheet" href="/_next/static/css/a.css"/><link rel="preload" as="script" href="/_next/static/chunks/a.js"/><script src="/_next/static/chunks/a.js" async=""></script></head>'
    const output = await inlineInitialAssets(input, root)
    assert.ok(output.includes('url(/_next/static/media/a.png)'))
    assert.ok(output.includes('console.log("<\\/script>", "$&", "$$")'))
    assert.ok(!output.includes('rel="preload"'))
    assert.equal(await inlineInitialAssets(output, root), output)
  } finally {
    await rm(root, { recursive: true })
  }
})
