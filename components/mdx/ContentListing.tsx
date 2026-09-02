import listings from '@/lib/content-listings.json'
import Link from 'next/link'

type ListingItem = {
  title: string
  href: string
  description?: string
}

type ListingGroup = {
  id: string
  heading?: string
  description?: string
  items: ListingItem[]
}

export function ContentListing({ id }: { id: string }) {
  const group = (listings as Record<string, ListingGroup>)[id]
  if (!group?.items?.length) return null

  return (
    <div className="my-8">
      {group.heading ? (
        <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
          {group.heading}
        </h3>
      ) : null}
      {group.description ? (
        <p className="mb-4 text-sm text-[var(--muted)]">{group.description}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {group.items.map((item) => {
          const external = item.href.startsWith('http')
          const href = external
            ? item.href
            : item.href.startsWith('/guides')
              ? item.href
              : item.href.startsWith('/')
                ? item.href
                : `/guides${item.href}`
          const inner = (
            <>
              <span className="font-medium text-[var(--foreground)]">{item.title}</span>
              {item.description ? (
                <span className="mt-1 block text-sm text-[var(--muted)]">
                  {item.description}
                </span>
              ) : null}
            </>
          )
          return external ? (
            <a
              key={item.href + item.title}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="docs-card block rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 transition hover:border-[var(--brand-border)]"
            >
              {inner}
            </a>
          ) : (
            <Link
              key={item.href + item.title}
              href={href}
              className="docs-card block rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 transition hover:border-[var(--brand-border)]"
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
