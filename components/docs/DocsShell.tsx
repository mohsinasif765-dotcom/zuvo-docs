import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { buildDocNav } from '@/lib/guide-registry'
import { STUDIO_URL } from '@/lib/site-urls'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export function DocsNavbar() {
  return (
    <header className="docs-nav sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--panel)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/guides/getting-started" className="flex items-center gap-2.5 font-semibold">
          <BookOpen className="h-5 w-5 text-[var(--brand)]" />
          <span>Zuvo Docs</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/guides/getting-started"
            className="hidden text-[var(--muted)] hover:text-[var(--foreground)] sm:inline"
          >
            Guides
          </Link>
          <a
            href={STUDIO_URL}
            className="rounded-full bg-[var(--brand)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--brand-hover)]"
          >
            Open Studio
          </a>
        </nav>
      </div>
    </header>
  )
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  const nav = buildDocNav()

  return (
    <div className="min-h-screen">
      <DocsNavbar />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
        <DocsSidebar nav={nav} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
