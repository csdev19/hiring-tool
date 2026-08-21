import { cn } from "../lib/utils";

/**
 * Tapuy mark: two facing arcs — a question asked from each side of the
 * table — around a mint dot. The dot is always mint (even in light mode);
 * the arcs follow the current text color. No fuchsia/violet versions of
 * the mark. Canonical SVG sources live in apps/web/public and the brand
 * icon set (favicon, app icon, og-image) uses this same glyph.
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
      <path
        d="M9 5.5a5.5 5.5 0 0 0 0 11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M15 7.5a5.5 5.5 0 0 1 0 11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.9" fill="var(--mint)" />
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
