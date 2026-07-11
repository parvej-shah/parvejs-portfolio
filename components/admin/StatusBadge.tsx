import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";

const statusStyles: Record<Status, string> = {
  PUBLISHED: "bg-brand/20 text-brand",
  SCHEDULED: "bg-amber-500/20 text-amber-400",
  DRAFT: "border border-line text-muted-foreground",
};

const statusLabels: Record<Status, string> = {
  PUBLISHED: "Published",
  SCHEDULED: "Scheduled",
  DRAFT: "Draft",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
