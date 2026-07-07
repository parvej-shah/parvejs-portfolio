import { MarkdownAsync } from "react-markdown";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";

export const markdownRemarkPlugins = [remarkGfm];

export function getReadingStats(content: string) {
  return readingTime(content);
}

// Centralized Markdown rendering so views don't re-implement remark/react-markdown wiring.
export function MarkdownContent({ content }: { content: string }) {
  return MarkdownAsync({ children: content, remarkPlugins: markdownRemarkPlugins });
}

