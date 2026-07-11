import readingTime from "reading-time";
import remarkGfm from "remark-gfm";

export const markdownRemarkPlugins = [remarkGfm];

export function getReadingStats(content: string) {
  return readingTime(content);
}

