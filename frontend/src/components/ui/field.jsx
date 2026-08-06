import { cn } from "@/lib/utils";

export function Field({ label, error, children, hint }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-muted">{hint}</span> : null}
      {error ? <span className="text-xs font-semibold text-red-700">{error}</span> : null}
    </label>
  );
}

export function inputClassName(className) {
  return cn(
    "focus-ring min-h-11 w-full rounded-[8px] border border-line bg-white px-3 py-2 text-sm text-ink shadow-xs transition placeholder:text-muted/70 focus:border-primary-dark",
    className
  );
}

