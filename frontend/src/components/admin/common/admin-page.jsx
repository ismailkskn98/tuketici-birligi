import { cn } from "@/lib/utils";

export function AdminPage({ eyebrow, title, description, actions, children, className }) {
  return (
    <main className={cn("grid gap-6", className)}>
      <div className="flex flex-col gap-5 border-b border-line pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p> : null}
          <h1 className={cn("text-2xl font-semibold tracking-[-0.035em] text-ink md:text-[2rem]", eyebrow && "mt-2")}>{title}</h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted md:text-[0.9375rem]">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>

      {children}
    </main>
  );
}
