import { Admonition } from '@/components/mdx/Admonition'
import { ContentListing } from '@/components/mdx/ContentListing'
import {
  Accordion,
  AccordionItem,
  GlassPanel,
  Image,
  InfoTooltip,
  McpConfigPanel,
  NullWidget,
  Price,
  SqlToRest,
  StepHikeCompact,
} from '@/components/mdx/DocsWidgets'
import { TabPanel, Tabs } from '@/components/mdx/Tabs'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

function MdxLink({
  href,
  children,
  passHref: _passHref,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { passHref?: boolean }) {
  const url = href || ''
  if (url.startsWith('/guides') || (url.startsWith('/') && !url.startsWith('//'))) {
    return (
      <Link href={url} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={url}
      target={url.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  )
}

export const mdxComponents: MDXComponents = {
  Admonition,
  ContentListing,
  Tabs,
  TabPanel,
  Image,
  Price,
  StepHikeCompact,
  GlassPanel,
  Link: MdxLink,
  Accordion,
  AccordionItem,
  InfoTooltip,
  McpConfigPanel,
  SqlToRest,
  AiPromptsIndex: NullWidget,
  AiSkillsIndex: NullWidget,
  CustomContent: NullWidget,
  McpCiConfigBlock: NullWidget,
  AgentPluginsPanel: NullWidget,
  DatabaseAdvisorsIndex: NullWidget,
  RealtimeLimitsEstimator: NullWidget,
  MetricsStackCards: NullWidget,
  RegionsList: NullWidget,
  SmartRegionsList: NullWidget,
  TerraformProviderSchema: NullWidget,
  ComputeDiskLimitsTable: NullWidget,
  HCaptcha: NullWidget,
  Turnstile: NullWidget,
  a: MdxLink,
}
