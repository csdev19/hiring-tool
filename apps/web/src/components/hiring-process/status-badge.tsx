import { StatusBadge as TapuyStatusBadge } from "@interviews-tool/web-ui";
import type { HiringProcessStatus } from "@interviews-tool/domain/constants";

interface StatusBadgeProps {
  status: HiringProcessStatus;
  className?: string;
}

/* Thin wrapper over the design-system StatusBadge: active statuses render
   tinted with a border, terminal ones solid; sentence-case labels built in. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <TapuyStatusBadge status={status} className={className} />;
}
