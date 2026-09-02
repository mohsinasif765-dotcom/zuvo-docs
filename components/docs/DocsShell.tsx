"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ExternalLink } from "lucide-react";
import { DOC_NAV } from "@/lib/guide-registry";
import { guidePath } from "@/lib/content/guides";
import { MARKETING_URL, STUDIO_URL } from "@/lib/site-urls";

function slugPath(slug: string[]) {
  return guidePath(slug);
}

function isActive(pathname: string, slug: string[]) {
  return pathname === slugPath(slug);
}

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-4">
        {DOC_NAV.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const href = slugPath(item.slug);
                const active = isActive(pathname, item.slug);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block rounded-lg px-2 py-1.5 text-sm ${
                        active
                          ? "bg-[var(--brand-soft)] font-medium text-[var(--brand-text)]"
                          : "text-[var(--label)] hover:bg-[var(--sunken)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
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
  );
}

export function DocsNavbar() {
  return (
    <header className="docs-nav sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--panel)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
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
  );
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DocsNavbar />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
        <DocsSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
