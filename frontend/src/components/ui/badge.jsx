import { cn } from "@/lib/utils";

export function Badge({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] bg-secondary-soft px-2.5 py-1 text-xs font-semibold text-secondary-dark",
        className
      )}
    >
      {children}
    </span>
  );
}

