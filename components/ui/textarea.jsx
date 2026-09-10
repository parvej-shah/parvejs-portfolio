import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border border-line-strong bg-white px-3 py-2 text-base transition-all outline-none placeholder:text-muted-foreground shadow-xs focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:border-input dark:bg-input/30 dark:shadow-none dark:disabled:bg-input/80 dark:focus-visible:border-ring dark:focus-visible:ring-ring/50",
        className
      )}
      {...props} />
  );
}

export { Textarea }
