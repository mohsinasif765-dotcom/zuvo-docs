import { DocsShell } from '@/components/docs/DocsShell'
import { GuideBody } from '@/components/docs/GuideBody'
import { allGuideSlugs, getGuide, guideHref } from '@/lib/guides-fs'
import { MARKETING_URL, STUDIO_URL } from '@/lib/site-urls'
import type { Metadata } from 'next'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ slug?: string[] }>
}

export async function generateStaticParams() {
  return allGuideSlugs().map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params
  const guide = getGuide(slug)
  if (!guide) {
    return { title: 'Guide not found' }
  }
  return {
    title: guide.title,
    description: guide.description,
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug = [] } = await params
  const guide = getGuide(slug)

  if (!guide) {
    return (
      <DocsShell>
        <div className="docs-stub">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Documentation coming soon
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            We don&apos;t have a Zuvo guide at{' '}
            <code className="rounded bg-[var(--sunken)] px-1.5 py-0.5">
              /guides/{slug.join('/')}
            </code>{' '}
            yet. Browse existing guides in the sidebar or open Studio for in-product help.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/guides/getting-started"
              className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
            >
              Getting started
            </Link>
            <a
              href={STUDIO_URL}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              Zuvo Studio
            </a>
            <a
              href={MARKETING_URL}
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              zuvodev.com
            </a>
          </div>
        </div>
      </DocsShell>
    )
  }

  return (
    <DocsShell>
      <div className="mb-8 border-b border-[var(--border)] pb-6">
        <p className="text-sm font-medium text-[var(--brand-text)]">Guide</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {guide.title}
        </h1>
        {guide.subtitle ? (
          <p className="mt-2 max-w-2xl text-lg text-[var(--muted)]">{guide.subtitle}</p>
        ) : guide.description ? (
          <p className="mt-2 max-w-2xl text-[var(--muted)]">{guide.description}</p>
        ) : null}
      </div>
      <GuideBody markdown={guide.body} />
    </DocsShell>
  )
}
