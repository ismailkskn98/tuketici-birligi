import { cn } from "@/lib/utils";

export function AdminPage({ eyebrow = "Yönetim", title, description, actions, children, className }) {
  return (
    <main className={cn("grid gap-6", className)}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-dark">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-normal text-ink md:text-3xl">{title}</h2>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      {children}
    </main>
  );
}
