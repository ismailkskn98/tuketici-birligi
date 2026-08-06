import { cn } from "@/lib/utils";

export function AdminFormField({ label, error, hint, children, className }) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-ink", className)}>
      {label ? <span>{label}</span> : null}
      {children}
      {hint ? <span className="text-xs font-normal leading-5 text-muted">{hint}</span> : null}
      {error ? <span className="text-xs font-semibold leading-5 text-destructive">{error}</span> : null}
    </label>
  );
}
