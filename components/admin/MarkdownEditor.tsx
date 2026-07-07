"use client";

import { useState, type ChangeEvent } from "react";
import Markdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { markdownRemarkPlugins } from "@/lib/markdown";

type MarkdownEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export function MarkdownEditor({ label, value, onChange, rows = 10, placeholder }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        <div className="flex gap-1 rounded-full border border-line bg-ink-3 p-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              tab === "write" ? "bg-brand text-[#05140b]" : "text-muted-foreground hover:text-white"
            )}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "rounded-full px-3 py-1 transition-colors",
              tab === "preview" ? "bg-brand text-[#05140b]" : "text-muted-foreground hover:text-white"
            )}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <Textarea
          value={value}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="rounded-xl border-line bg-ink-3 font-mono text-sm"
        />
      ) : (
        <div className="prose prose-invert min-h-40 max-w-none rounded-xl border border-line bg-ink-3 p-4 text-sm">
          <Markdown remarkPlugins={markdownRemarkPlugins}>{value || "*Nothing to preview yet.*"}</Markdown>
        </div>
      )}
    </div>
  );
}
