import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function FeedColumn({ children, description, eyebrow, title, viewAllHref, viewAllLabel }) {
  return (
    <section className="grid content-start gap-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-muted shadow-[0_6px_18px_rgba(22,32,51,0.04)]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary/85" />
            {eyebrow}
          </span>
          <h2 className="mt-3.5 font-heading text-[1.95rem] font-semibold leading-tight tracking-tight text-ink md:text-[2.5rem]">{title}</h2>
          {description ? <p className="mt-3 text-sm leading-7 text-muted md:max-w-xl">{description}</p> : null}
        </div>

        <Link className="focus-ring inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink/72 transition hover:text-secondary-dark" href={viewAllHref}>
          {viewAllLabel}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div>{children}</div>
    </section>
  );
}
