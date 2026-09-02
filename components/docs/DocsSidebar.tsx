'use client'

import type { NavGroup } from '@/lib/types'
import { MARKETING_URL, STUDIO_URL } from '@/lib/site-urls'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DocsSidebar({ nav }: { nav: NavGroup[] }) {
  const pathname = usePathname()

  return (
    <aside className="docs-sidebar hidden w-72 shrink-0 lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-4">
        {nav.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-2 py-1.5 text-sm leading-snug ${
                        active
                          ? 'bg-[var(--brand-soft)] font-medium text-[var(--brand-text)]'
                          : 'text-[var(--label)] hover:bg-[var(--sunken)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        <div className="mt-8 space-y-2 border-t border-[var(--border)] pt-6">
          <a
            href={STUDIO_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2 text-sm text-[var(--muted)] hover:text-[var(--brand-text)]"
          >
            Zuvo Studio <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={MARKETING_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2 text-sm text-[var(--muted)] hover:text-[var(--brand-text)]"
          >
            zuvodev.com <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </aside>
  )
}
