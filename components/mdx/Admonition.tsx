import { AlertTriangle, Info, Lightbulb } from 'lucide-react'
import type { ReactNode } from 'react'

const styles: Record<string, string> = {
  note: 'border-blue-200 bg-blue-50/80 text-blue-950',
  tip: 'border-emerald-200 bg-emerald-50/80 text-emerald-950',
  caution: 'border-amber-200 bg-amber-50/80 text-amber-950',
  danger: 'border-red-200 bg-red-50/80 text-red-950',
  warning: 'border-amber-200 bg-amber-50/80 text-amber-950',
}

export function Admonition({
  type = 'note',
  title,
  label,
  children,
}: {
  type?: string
  title?: string
  label?: string
  children: ReactNode
}) {
  const heading = title || label
  const Icon =
    type === 'danger' || type === 'caution' ? AlertTriangle : type === 'tip' ? Lightbulb : Info
  return (
    <aside
      className={`my-6 rounded-xl border px-4 py-3 ${styles[type] || styles.note}`}
    >
      {heading ? (
        <p className="mb-2 flex items-center gap-2 font-semibold">
          <Icon className="h-4 w-4 shrink-0" />
          {heading}
        </p>
      ) : null}
      <div className="text-sm leading-relaxed [&>p]:my-2">{children}</div>
    </aside>
  )
}
