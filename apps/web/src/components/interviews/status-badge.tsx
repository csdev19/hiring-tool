import { cn } from "@/lib/utils";
import type { InterviewStatus } from "@/hooks/use-interviews";

interface StatusBadgeProps {
  status: InterviewStatus;
  className?: string;
}

const statusConfig: Record<InterviewStatus, { label: string; className: string }> = {
  ongoing: {
    label: "Ongoing",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  "dropped-out": {
    label: "Dropped Out",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
  hired: {
    label: "Hired",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
