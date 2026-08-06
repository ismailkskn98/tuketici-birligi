import { cn } from "@/lib/utils";

export function AdminStatCard({ title, value, description, icon: Icon, className }) {
  return (
    <div className={cn("rounded-lg border border-line bg-white p-4 shadow-xs", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-normal text-ink">{value}</p>
        </div>
        {Icon ? (
          <div className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary-dark">
            <Icon aria-hidden="true" className="size-5" />
          </div>
        ) : null}
      </div>
      {description ? <p className="mt-3 text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}
