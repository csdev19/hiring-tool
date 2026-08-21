import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "gap-1 rounded-[5px] border border-transparent px-2 py-0.5 text-xs font-medium [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-text",
        secondary: "bg-surface-2 text-text-secondary",
        destructive: "bg-status-rejected-bg text-status-rejected-text",
        outline: "border-border-strong text-text-secondary",
        ghost: "text-text-secondary",
        link: "text-mint underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
