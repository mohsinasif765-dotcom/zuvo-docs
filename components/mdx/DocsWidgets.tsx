import type { ImgHTMLAttributes, ReactNode } from 'react'

type ImageSrc = string | { light?: string; dark?: string }

function resolveSrc(src: ImageSrc | undefined) {
  if (!src) return ''
  const raw = typeof src === 'string' ? src : src.light || src.dark || ''
  return raw.replace(/^\/docs/, '')
}

export function Image({
  src,
  alt = '',
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { src?: ImageSrc }) {
  const url = resolveSrc(src)
  if (!url) return null
  return (
    <img
      src={url}
      alt={alt}
      className="my-6 w-full rounded-xl border border-[var(--border)]"
      loading="lazy"
      {...props}
    />
  )
}

export function Price({ price }: { price: string }) {
  return <span>${price}</span>
}

function Step({ step, children }: { step?: number; children: ReactNode }) {
  return (
    <div className="my-8 border-l-2 border-[var(--brand)] pl-5">
      {step ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-text)]">
          Step {step}
        </p>
      ) : null}
      {children}
    </div>
  )
}

function StepDetails({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      {title ? <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">{title}</h3> : null}
      <div>{children}</div>
    </div>
  )
}

function StepCode({ children }: { children: ReactNode }) {
  return <div className="mt-3">{children}</div>
}

export function StepHikeCompact({ children }: { children: ReactNode }) {
  return <div className="step-hike my-8 space-y-2">{children}</div>
}

StepHikeCompact.Step = Step
StepHikeCompact.Details = StepDetails
StepHikeCompact.Code = StepCode

export function GlassPanel({
  title,
  children,
  icon,
}: {
  title?: string
  children?: ReactNode
  icon?: string
  hasLightIcon?: boolean
}) {
  return (
    <div className="docs-card h-full rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5">
      {title ? <h3 className="font-semibold text-[var(--foreground)]">{title}</h3> : null}
      {children ? <div className="mt-2 text-sm text-[var(--muted)]">{children}</div> : null}
    </div>
  )
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="my-6 space-y-2">{children}</div>
}

export function AccordionItem({
  title,
  children,
}: {
  title?: string
  header?: string
  children: ReactNode
}) {
  return (
    <details className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3">
      <summary className="cursor-pointer font-medium text-[var(--foreground)]">
        {title}
      </summary>
      <div className="mt-3 text-sm text-[var(--label)]">{children}</div>
    </details>
  )
}

export function InfoTooltip({ children }: { children: ReactNode; label?: string }) {
  return <span title={typeof children === 'string' ? children : undefined}>{children}</span>
}

/** Studio-only interactive widgets — render as notes in static docs. */
export function McpConfigPanel() {
  return (
    <p className="my-4 rounded-xl border border-[var(--border)] bg-[var(--sunken)] px-4 py-3 text-sm text-[var(--muted)]">
      Configure MCP in{' '}
      <a href="https://studio.zuvodev.com" className="text-[var(--brand-text)] underline">
        Zuvo Studio
      </a>{' '}
      or with the Zuvo CLI.
    </p>
  )
}

export function SqlToRest() {
  return (
    <p className="my-4 text-sm text-[var(--muted)]">
      Use SQL to REST conversion tools in Zuvo Studio.
    </p>
  )
}

export function NullWidget() {
  return null
}
