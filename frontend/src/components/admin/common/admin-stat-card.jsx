import { cn } from "@/lib/utils";

export function AdminStatCard({ title, value, description, icon: Icon, className }) {
  return (
    <div className={cn("rounded-lg border border-line bg-white p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">{value}</p>
        </div>
        {Icon ? (
          <div className="grid size-9 place-items-center rounded-md border border-line bg-surface text-primary">
            <Icon aria-hidden="true" className="size-4" />
          </div>
        ) : null}
      </div>
      {description ? <p className="mt-3 text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}
