import ReactMarkdown from "react-markdown";
import { markdownRemarkPlugins } from "@/lib/markdown";
import { cn } from "@/lib/utils";

type MarkdownExcerptProps = {
  children: string;
  className?: string;
};

export default function MarkdownExcerpt({ children, className }: MarkdownExcerptProps) {
  return (
    <div className={cn("markdown-excerpt", className)}>
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        components={{
          p: ({ node: _node, ...props }) => <span {...props} />,
          a: ({ node: _node, ...props }) => <a {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
