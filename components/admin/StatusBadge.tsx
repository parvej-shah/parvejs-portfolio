import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";

export function StatusBadge({ status }: { status: Status }) {
  const isPublished = status === "PUBLISHED";

  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
        isPublished ? "bg-brand/20 text-brand" : "border border-line text-muted-foreground"
      )}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
