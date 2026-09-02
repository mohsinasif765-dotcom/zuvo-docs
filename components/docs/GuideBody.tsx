import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function GuideBody({ markdown }: { markdown: string }) {
  return (
    <article className="docs-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
