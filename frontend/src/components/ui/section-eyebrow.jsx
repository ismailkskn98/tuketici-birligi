import { cn } from "@/lib/utils";

/**
 * Shared section label — pill badge with dot.
 * Text is forced uppercase so translation casing stays consistent in the UI.
 */
export function SectionEyebrow({ children, className, tone = "secondary" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted shadow-[0_6px_18px_rgba(22,32,51,0.04)] sm:px-3 sm:text-[11px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", tone === "primary" ? "bg-primary-dark" : "bg-secondary/85")}
      />
      {children}
    </span>
  );
}
