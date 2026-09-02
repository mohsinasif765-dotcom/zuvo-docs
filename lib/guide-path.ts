/** Client-safe guide URL helper (no filesystem imports). */
export function guidePath(slug: string[]) {
  return `/guides/${slug.join('/')}`
}
