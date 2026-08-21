import * as React from "react";

import { cn } from "../lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "border-border bg-surface-2 hover:border-border-strong aria-invalid:border-danger flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm transition-colors placeholder:text-text-muted min-w-0 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 resize-none",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
