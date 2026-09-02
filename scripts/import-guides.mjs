/**
 * Import Supabase guide MDX into zuvo-docs/content/guides.
 * Run from repo root after vendor tree exists:
 *   node scripts/import-guides.mjs
 *
 * Vendor path: ../../vendor/supabase-docs-src/apps/docs (monorepo)
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const VENDOR = join(ROOT, '..', 'vendor', 'supabase-docs-src', 'apps', 'docs')
const SRC_GUIDES = join(VENDOR, 'content', 'guides')
const SRC_PARTIALS = join(VENDOR, 'content', '_partials')
const OUT_GUIDES = join(ROOT, 'content', 'guides')
const OUT_PARTIALS = join(ROOT, 'content', '_partials')
const OUT_LISTINGS = join(ROOT, 'lib', 'content-listings.json')

if (!existsSync(SRC_GUIDES)) {
  console.error(`Missing vendor guides at ${SRC_GUIDES}`)
  console.error('Run: ./brand/fetch-supabase-docs-src.sh from monorepo root')
  process.exit(1)
}

function walk(dir, acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) walk(p, acc)
    else if (ent.name.endsWith('.mdx')) acc.push(p)
  }
  return acc
}

function rebrand(text) {
  return text
    .replace(/\/docs\/guides\//g, '/guides/')
    .replace(/\/docs\/reference\//g, '/reference/')
    .replace(/https:\/\/supabase\.com\/docs/g, 'https://docs.zuvodev.com')
    .replace(/https:\/\/supabase\.com\/dashboard/g, 'https://studio.zuvodev.com')
    .replace(/https:\/\/supabase\.com\/pricing/g, 'https://zuvodev.com/pricing')
    .replace(/https:\/\/supabase\.com\/terms/g, 'https://zuvodev.com/terms')
    .replace(/https:\/\/supabase\.com\/privacy/g, 'https://zuvodev.com/privacy')
    .replace(/https:\/\/supabase\.com/g, 'https://zuvodev.com')
    .replace(/Supabase CLI/g, 'Zuvo CLI')
    .replace(/Supabase Studio/g, 'Zuvo Studio')
    .replace(/Supabase Dashboard/g, 'Zuvo Studio')
    .replace(/Supabase Cloud/g, 'Zuvo')
    .replace(/Supabase Auth/g, 'Zuvo Auth')
    .replace(/Supabase Postgres/g, 'Zuvo Postgres')
    .replace(/Supabase SDKs/g, 'Zuvo SDKs')
    .replace(/Supabase client/g, 'Zuvo client')
    .replace(/Supabase project/g, 'Zuvo project')
    .replace(/Supabase ecosystem/g, 'Zuvo platform')
    .replace(/Use Supabase/g, 'Use Zuvo')
    .replace(/with Supabase/g, 'with Zuvo')
    .replace(/Supabase's/g, "Zuvo's")
    .replace(/Supabase/g, 'Zuvo')
    .replace(/ContentListings/g, 'ContentListing')
    .replace(/<TabPanel/g, '<TabPanel')
}

function expandPartials(text) {
  return text.replace(/<\$Partial path="([^"]+)"[\s\S]*?\/>/g, (_, relPath) => {
    const partialPath = join(SRC_PARTIALS, relPath.replace(/^\//, ''))
    if (!existsSync(partialPath)) return ''
    return rebrand(readFileSync(partialPath, 'utf8').replace(/^---[\s\S]*?---\n/, ''))
  })
}

function stripShowBlocks(text) {
  return text.replace(/<\$Show[\s\S]*?<\/\$Show>/g, '')
}

function transformPrice(text) {
  return text.replace(/<Price\s+price="([^"]+)"\s*\/>/g, '$$$1')
}

function transformImage(text) {
  return text.replace(/<Image[\s\S]*?\/>/g, (block) => {
    const alt =
      block.match(/alt="([^"]*)"/)?.[1] ||
      block.match(/alt=\{`([^`]*)`\}/)?.[1] ||
      'Diagram'
    const light =
      block.match(/light:\s*'([^']+)'/)?.[1] ||
      block.match(/light:\s*"([^"]+)"/)?.[1] ||
      block.match(/src="([^"]+)"/)?.[1]
    if (!light) return ''
    const url = light.replace(/^\/docs/, '')
    return `\n\n![${alt}](${url})\n\n`
  })
}

function escapeMathBraces(text) {
  return text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
    const escaped = inner.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
    return `$$${escaped}$$`
  })
}

function replaceInteractiveBlocks(text) {
  return text
    .replace(/<McpCiConfigBlock[\s\S]*?\/>/g, '')
    .replace(/<AgentPluginsPanel\s*\/>/g, '')
    .replace(/<AiPromptsIndex\s*\/>/g, '')
    .replace(/<AiSkillsIndex\s*\/>/g, '')
    .replace(/<CustomContent[\s\S]*?\/>/g, '')
    .replace(/<DatabaseAdvisorsIndex\s*\/>/g, '')
    .replace(/<HCaptcha[\s\S]*?\/>/g, '')
    .replace(/<Turnstile[\s\S]*?\/>/g, '')
    .replace(/<RegionsList[\s\S]*?\/>/g, '')
    .replace(/<SmartRegionsList[\s\S]*?\/>/g, '')
    .replace(/<TerraformProviderSchema[\s\S]*?\/>/g, '')
    .replace(/<ComputeDiskLimitsTable[\s\S]*?\/>/g, '')
    .replace(/<RealtimeLimitsEstimator[\s\S]*?\/>/g, '')
    .replace(/<MetricsStackCards[\s\S]*?\/>/g, '')
    .replace(/<SqlToRest[\s\S]*?\/>/g, '')
}

function protectCodeFences(text) {
  const blocks = []
  const out = text.replace(/```[\s\S]*?```/g, (block) => {
    blocks.push(block)
    return `\n\n__CODE_BLOCK_${blocks.length - 1}__\n\n`
  })
  return { out, blocks }
}

function restoreCodeFences(text, blocks) {
  return text.replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => blocks[Number(i)])
}

const KEEP_JSX = new Set([
  'Admonition',
  'ContentListing',
  'Tabs',
  'TabPanel',
  'Image',
  'Price',
  'GlassPanel',
  'Link',
  'Accordion',
  'AccordionItem',
  'StepHikeCompact',
  'McpConfigPanel',
  'InfoTooltip',
])

function formatTabsMarkup(text) {
  return text
    .replace(/<Tabs([^>]*)><TabPanel/g, '<Tabs$1>\n\n<TabPanel')
    .replace(/<\/TabPanel><TabPanel/g, '</TabPanel>\n\n<TabPanel')
    .replace(/<\/TabPanel><\/Tabs>/g, '</TabPanel>\n\n</Tabs>')
}

function unwrapTabsFromLists(text) {
  return text.replace(
    /^(\d+\.\s+)([^\n]+:)\s*\n+(\s*<Tabs[\s\S]*?<\/Tabs>)/gm,
    '### $2\n\n$3',
  )
}

function stripOrphanJsx(text) {
  return text
    .replace(/^\s*key=\{schema\.reference\}[^\n]*\n/gm, '')
    .replace(/^\s*\{schema\.fields[\s\S]*?\)\)\}\s*\n/gm, '')
    .replace(/^\s*\)\)\}\s*\n/gm, '')
    .replace(/^\s*\)\}\s*\n/gm, '')
}

function stripMdxExports(text) {
  return text
    .replace(/^export const \w+ = `[\s\S]*?`\s*\n/gm, '')
    .replace(/<a href=\{`[\s\S]*?`\}>/g, (match) =>
      match.includes('encodeURIComponent') ? '<a href="/dashboard/project/_/sql/new">' : match,
    )
}

function stripBrokenDynamicBlocks(text) {
  return text.replace(/<div className="grid[\s\S]*?<\/div>/g, (block) => {
    if (
      block.includes('=>') ||
      block.includes('href={') ||
      block.includes('quickstart') ||
      block.includes('data.items')
    ) {
      return ''
    }
    return block
  })
}

function stripJsxProps(text) {
  return text
    .replace(/\sactions=\{[\s\S]*?\}/g, '')
    .replace(/\{\([^)]*\)\s*=>[\s\S]*?\}/g, '')
}

function stripDollarComponents(text) {
  return text
    .replace(/<\$CodeSample[\s\S]*?\/>/g, '\n\n_Code sample: see project quickstart in Zuvo Studio._\n\n')
    .replace(/<\$CodeTabs>[\s\S]*?<\/\$CodeTabs>/g, '')
    .replace(/<\$CodeTabs[\s\S]*?\/>/g, '')
    .replace(/<\$[A-Za-z][^>]*\/>/g, '')
    .replace(/<\$[A-Za-z][^>]*>[\s\S]*?<\/\$[A-Za-z]+>/g, '')
}

function simplifyInlineJsx(text) {
  let body = text
  body = body.replace(
    /<SharedData[\s\S]*?<\/SharedData>/g,
    '\n\n_Log field reference tables are available in Zuvo Studio._\n\n',
  )
  body = body.replace(/<StepHikeCompact\.([A-Za-z]+)([^>]*)>/g, '<StepHikeCompact.$1$2>')
  body = body.replace(/<\/StepHikeCompact\.([A-Za-z]+)>/g, '</StepHikeCompact.$1>')

  for (let i = 0; i < 5; i++) {
    body = body.replace(
      /<([A-Z][A-Za-z0-9]*)([^>]*)>([\s\S]*?)<\/\1>/g,
      (match, name, _attrs, inner) => (KEEP_JSX.has(name) ? match : inner),
    )
  }

  body = body.replace(/<([A-Z][A-Za-z0-9]*)([^>]*)\/>/g, (match, name) =>
    KEEP_JSX.has(name) ? match : '',
  )
  return body
}

function stripTemplateVars(text) {
  return text
    .replace(/\{\{\s*\.(\w+)\s*\}\}/g, '$1')
    .replace(/\{\{\s*([^}]+?)\s*\}\}/g, '$1')
}

function stripJsxComments(text) {
  return text.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
}

function transformMdx(raw) {
  let body = raw
  body = expandPartials(body)
  body = stripShowBlocks(body)
  body = stripJsxComments(body)
  const fenced = protectCodeFences(body)
  body = stripTemplateVars(fenced.out)
  body = stripJsxProps(body)
  body = stripDollarComponents(body)
  body = simplifyInlineJsx(body)
  body = restoreCodeFences(body, fenced.blocks)
  body = rebrand(body)
  body = transformPrice(body)
  body = transformImage(body)
  body = escapeMathBraces(body)
  body = replaceInteractiveBlocks(body)
  body = formatTabsMarkup(body)
  body = unwrapTabsFromLists(body)
  body = stripJsxProps(body)
  body = stripMdxExports(body)
  body = stripOrphanJsx(body)
  body = stripBrokenDynamicBlocks(body)
  return body
}

function copyPartials() {
  if (!existsSync(SRC_PARTIALS)) return
  cpSync(SRC_PARTIALS, OUT_PARTIALS, { recursive: true })
  for (const f of walk(OUT_PARTIALS)) {
    writeFileSync(f, transformMdx(readFileSync(f, 'utf8')))
  }
}

function importListings() {
  const dir = join(VENDOR, 'data', 'content-listings')
  if (!existsSync(dir)) return
  const listings = {}
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.data.ts'))) {
    const src = readFileSync(join(dir, file), 'utf8')
    const matches = src.matchAll(/export const (\w+)[\s\S]*?=\s*(\{[\s\S]*?\n\})/g)
    for (const m of matches) {
      try {
        const obj = Function(`return ${rebrand(m[2])}`)()
        listings[obj.id || m[1]] = obj
      } catch {
        /* skip unparseable blocks */
      }
    }
  }
  writeFileSync(OUT_LISTINGS, JSON.stringify(listings, null, 2))
  console.log(`Wrote ${Object.keys(listings).length} content listings`)
}

mkdirSync(OUT_GUIDES, { recursive: true })
copyPartials()

const files = walk(SRC_GUIDES)
let count = 0
for (const src of files) {
  const rel = relative(SRC_GUIDES, src)
  const dest = join(OUT_GUIDES, rel)
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, transformMdx(readFileSync(src, 'utf8')))
  count++
}

importListings()

console.log(`Imported ${count} guide MDX files → ${OUT_GUIDES}`)
