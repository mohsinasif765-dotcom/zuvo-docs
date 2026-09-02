import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const GUIDES_ROOT = join(process.cwd(), 'content', 'guides')

export type GuideMeta = {
  slug: string[]
  title: string
  description: string
  subtitle?: string
  hideToc?: boolean
}

export type GuideDoc = GuideMeta & {
  body: string
}

function walk(dir: string, prefix: string[] = []): string[][] {
  const slugs: string[][] = []
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('_')) continue
    const full = join(dir, ent.name)
    if (ent.isDirectory()) {
      slugs.push(...walk(full, [...prefix, ent.name]))
    } else if (ent.name.endsWith('.mdx')) {
      const name = ent.name.replace(/\.mdx$/, '')
      slugs.push([...prefix, name])
    }
  }
  return slugs
}

export function allGuideSlugs(): string[][] {
  if (!existsSync(GUIDES_ROOT)) return []
  return walk(GUIDES_ROOT)
}

function guideFilePath(slug: string[]) {
  return join(GUIDES_ROOT, ...slug.slice(0, -1), `${slug[slug.length - 1]}.mdx`)
}

export function getGuide(slug: string[]): GuideDoc | null {
  const path = guideFilePath(slug)
  if (!existsSync(path)) return null
  const raw = readFileSync(path, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: String(data.title || slug[slug.length - 1]),
    description: String(data.description || ''),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    hideToc: Boolean(data.hideToc),
    body: content.trim(),
  }
}

export function guideHref(slug: string[]) {
  return `/guides/${slug.join('/')}`
}

export function searchCorpus() {
  return allGuideSlugs()
    .map((slug) => getGuide(slug))
    .filter(Boolean)
    .map((g) => ({
      slug: g!.slug.join('/'),
      title: g!.title,
      description: g!.description,
      href: guideHref(g!.slug),
      content: `${g!.title} ${g!.description} ${g!.body}`.slice(0, 8000),
    }))
}

export const SECTION_ORDER = [
  'getting-started',
  'auth',
  'database',
  'storage',
  'functions',
  'realtime',
  'ai',
  'ai-tools',
  'local-development',
  'deployment',
  'platform',
  'integrations',
  'monitoring-and-debugging',
  'queues',
  'cron',
  'api',
  'resources',
  'security',
  'telemetry',
]

export function sectionLabel(section: string) {
  return section
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function buildNavigation() {
  const slugs = allGuideSlugs()
  const bySection = new Map<string, { slug: string[]; title: string }[]>()

  for (const slug of slugs) {
    const section = slug[0]
    const guide = getGuide(slug)
    if (!guide) continue
    const list = bySection.get(section) || []
    list.push({ slug, title: guide.title })
    bySection.set(section, list)
  }

  for (const [, items] of bySection) {
    items.sort((a, b) => a.title.localeCompare(b.title))
  }

  const ordered = [
    ...SECTION_ORDER.filter((s) => bySection.has(s)),
    ...[...bySection.keys()].filter((s) => !SECTION_ORDER.includes(s)).sort(),
  ]

  return ordered.map((section) => ({
    title: sectionLabel(section),
    section,
    items: bySection.get(section) || [],
  }))
}
