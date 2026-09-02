import {
  allGuideSlugs,
  buildNavigation,
  guideHref,
  searchCorpus,
} from '@/lib/guides-fs'
import type { NavGroup } from '@/lib/types'

export function buildDocNav(): NavGroup[] {
  return buildNavigation().map((section) => ({
    title: section.title,
    items: section.items.map((item) => ({
      slug: item.slug,
      title: item.title,
      href: guideHref(item.slug),
    })),
  }))
}

/** Flat search index for MCP GraphQL */
export function searchIndex() {
  return searchCorpus()
}

export { allGuideSlugs }
export { guideHref as guidePath } from '@/lib/guides-fs'
