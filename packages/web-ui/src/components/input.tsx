import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

import { cn } from "../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-surface-2 hover:border-border-strong aria-invalid:border-danger h-9 rounded-md border px-3 py-1 text-sm transition-colors file:h-6 file:text-sm file:font-medium file:text-foreground placeholder:text-text-muted w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
