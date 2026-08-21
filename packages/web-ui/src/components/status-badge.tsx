import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * The 8 hiring-process statuses. Kept as literals here so the design system
 * stays dependency-free; the domain package owns the canonical list.
 */
export type StatusBadgeStatus =
  | "first-contact"
  | "ongoing"
  | "on-hold"
  | "offer-made"
  | "offer-accepted"
  | "hired"
  | "rejected"
  | "dropped-out";

/* Active statuses render tinted with a border; terminal ones render solid.
   Category must be readable by shape before color. Never an icon inside. */
const statusBadgeVariants = cva(
  "inline-flex w-fit items-center whitespace-nowrap rounded-[5px] border border-transparent px-2 py-0.5 text-xs font-medium leading-[18px]",
  {
    variants: {
      status: {
        "first-contact":
          "bg-status-first-contact-bg text-status-first-contact-text border-status-first-contact-border",
        ongoing: "bg-status-ongoing-bg text-status-ongoing-text border-status-ongoing-border",
        "on-hold": "bg-status-on-hold-bg text-status-on-hold-text border-status-on-hold-border",
        "offer-made":
          "bg-status-offer-made-bg text-status-offer-made-text border-status-offer-made-border",
        "offer-accepted": "bg-status-offer-accepted-bg text-status-offer-accepted-text",
        hired: "bg-status-hired-bg text-status-hired-text",
        rejected: "bg-status-rejected-bg text-status-rejected-text",
        "dropped-out": "bg-status-dropped-out-bg text-status-dropped-out-text",
      },
    },
  },
);

/* Sentence case, per the brand voice */
const statusLabels: Record<StatusBadgeStatus, string> = {
  "first-contact": "First contact",
  ongoing: "Ongoing",
  "on-hold": "On hold",
  "offer-made": "Offer made",
  "offer-accepted": "Offer accepted",
  hired: "Hired",
  rejected: "Rejected",
  "dropped-out": "Dropped out",
};

interface StatusBadgeProps extends React.ComponentProps<"span"> {
  status: StatusBadgeStatus | (string & {});
  /** Overrides the built-in sentence-case label */
  label?: string;
}

function StatusBadge({ status, label, className, ...props }: StatusBadgeProps) {
  const known = status in statusLabels ? (status as StatusBadgeStatus) : undefined;

  if (!known) {
    return (
      <span
        data-slot="status-badge"
        className={cn(
          "inline-flex w-fit items-center whitespace-nowrap rounded-[5px] border border-transparent bg-surface-2 px-2 py-0.5 text-xs font-medium leading-[18px] text-text-secondary",
          className,
        )}
        {...props}
      >
        {label ?? status}
      </span>
    );
  }

  return (
    <span
      data-slot="status-badge"
      data-status={known}
      className={cn(statusBadgeVariants({ status: known }), className)}
      {...props}
    >
      {label ?? statusLabels[known]}
    </span>
  );
}

export { StatusBadge, statusBadgeVariants, statusLabels };
