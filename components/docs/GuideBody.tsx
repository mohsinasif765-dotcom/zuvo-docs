import { mdxComponents } from '@/components/mdx/mdx-components'
import { compileMDX } from 'next-mdx-remote/rsc'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function GuideBody({ markdown }: { markdown: string }) {
  try {
    const { content } = await compileMDX({
      source: markdown,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    })
    return <article className="docs-prose">{content}</article>
  } catch {
    return (
      <article className="docs-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
    )
  }
}
