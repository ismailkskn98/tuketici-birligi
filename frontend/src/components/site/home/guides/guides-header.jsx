import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function GuidesHeader({ description, eyebrow, title, viewAllHref, viewAllLabel }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[11px] font-medium text-muted shadow-[0_6px_18px_rgba(22,32,51,0.04)]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary/85" />
          {eyebrow}
        </span>
        <h2 className="mt-4 text-balance font-heading text-3xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">{title}</h2>
        {description ? <p className="mt-4 max-w-xl text-base leading-7 text-muted">{description}</p> : null}
      </div>

      <Link
        className="focus-ring inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-ink/90"
        href={viewAllHref}
      >
        {viewAllLabel}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
