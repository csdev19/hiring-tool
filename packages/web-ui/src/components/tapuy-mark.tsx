import { cn } from "../lib/utils";

/**
 * Tapuy mark: a question mark reduced to its minimal gesture — an open arc
 * and a dot. The dot is always mint (even in light mode); the arc follows
 * the current text color. No fuchsia/violet versions of the mark.
 */
function TapuyMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M7 9a5 5 0 1 1 5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="20" r="2" fill="var(--mint)" />
    </svg>
  );
}

/** Horizontal lockup: mark + "tapuy" in Geist 500 lowercase, tracking −0.01em. */
function TapuyLockup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-text", className)} {...props}>
      <TapuyMark />
      <span className="text-base font-medium tracking-[-0.01em]">tapuy</span>
    </span>
  );
}

export { TapuyMark, TapuyLockup };
