import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'

type PanelProps = {
  id: string
  label: string
  children: ReactNode
}

export function TabPanel({ children }: PanelProps) {
  return <>{children}</>
}

export function Tabs({
  defaultActiveId,
  children,
}: {
  defaultActiveId?: string
  queryGroup?: string
  scrollable?: boolean
  size?: string
  type?: string
  children: ReactNode
}) {
  const panels = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => child as ReactElement<PanelProps>)
    .map((child) => ({
      id: child.props.id,
      label: child.props.label,
      content: child.props.children,
    }))
    .filter((p) => p.id && p.label)

  if (!panels.length) return null

  return (
    <div className="docs-tabs my-6 space-y-4">
      {panels.map((panel, index) => (
        <div
          key={panel.id}
          className="rounded-xl border border-[var(--border)] bg-[var(--panel)]"
        >
          <div
            className={`border-b border-[var(--border)] px-4 py-2 text-sm font-medium ${
              panel.id === defaultActiveId || (!defaultActiveId && index === 0)
                ? 'bg-[var(--brand-soft)] text-[var(--brand-text)]'
                : 'text-[var(--muted)]'
            }`}
          >
            {panel.label}
          </div>
          <div className="p-4">{panel.content}</div>
        </div>
      ))}
    </div>
  )
}
