import { cn } from "@/lib/utils";
import {
  HIRING_PROCESS_STATUS_INFO,
  type HiringProcessStatus,
} from "@interviews-tool/domain/constants";

interface StatusBadgeProps {
  status: HiringProcessStatus;
  className?: string;
}

// Color mapping for each status
const statusColorMap: Record<HiringProcessStatus, string> = {
  "first-contact": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "on-hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "dropped-out": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  hired: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "offer-made": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  "offer-accepted": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
};

// Generate status config dynamically from HIRING_PROCESS_STATUS_INFO
const statusConfig: Record<HiringProcessStatus, { label: string; className: string }> =
  Object.entries(HIRING_PROCESS_STATUS_INFO).reduce(
    (acc, [key, info]) => {
      const status = key as HiringProcessStatus;
      acc[status] = {
        label: info.label,
        className: statusColorMap[status],
      };
      return acc;
    },
    {} as Record<HiringProcessStatus, { label: string; className: string }>,
  );

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    // Fallback for unknown statuses
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          className,
        )}
      >
        {status}
      </span>
    );
  }

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
