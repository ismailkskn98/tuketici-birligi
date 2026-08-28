import { cn } from "@/lib/utils";

export function AdminPage({ eyebrow = "Yönetim", title, description, actions, children, className }) {
  return (
    <main className={cn("grid gap-6", className)}>
      <div className="flex flex-col gap-5 border-b border-line pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">{title}</h1>
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
