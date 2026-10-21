import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { resolve, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// Check both HTML script tags and App Router Flight dependencies. A successful
// build alone does not establish that every referenced chunk will be deployed.
// If Next leaves a Flight dependency out of the initial scripts, include it.
export function initialChunks(html) {
  const chunks = new Set()
  for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (!script[1].includes('self.__next_f.push')) continue
    for (const match of script[1].matchAll(/static\/chunks\/[a-zA-Z0-9_%./-]+\.js/g)) {
      chunks.add(`/_next/${match[0]}`)
    }
  }
  return [...chunks]
}

export function prepareHtml(html) {
  const existing = new Set([...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map(m => m[1]))
  const missing = initialChunks(html).filter(src => !existing.has(src))
  if (!missing.length) return html
  if (!html.includes('</head>')) throw new Error('Exported page has no head')
  return html.replace('</head>', missing.map(src => `<script src="${src}" async="" data-initial-chunk=""></script>`).join('') + '</head>')
}

async function walk(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    else if (entry.name.endsWith('.html')) files.push(path)
  }
  return files
}

export async function prepareExport(root) {
  let updated = 0
  for (const path of await walk(root)) {
    const html = await readFile(path, 'utf8')
    // All script URLs must resolve inside this export before it can be deployed.
    const scripts = new Set([...initialChunks(html), ...[...html.matchAll(/<script\b[^>]*\bsrc="(\/_next\/static\/[^"]+)"/gi)].map(m => m[1])])
    for (const src of scripts) {
      const asset = resolve(root, '.' + decodeURIComponent(src))
      if (relative(root, asset).startsWith('..') || !(await stat(asset)).isFile()) {
        throw new Error(`Missing or unsafe chunk in ${path}: ${src}`)
      }
    }
    const prepared = prepareHtml(html)
    if (prepared !== html) {
      await writeFile(path, prepared)
      updated++
    }
  }
  console.log(`[static-chunks] validated export; added initial scripts to ${updated} pages`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepareExport(resolve('out'))
}
