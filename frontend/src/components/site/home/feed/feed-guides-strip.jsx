import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FeedGuideCard } from "./feed-guide-card";

export function FeedGuidesStrip({
  badgeLabel,
  description,
  guides = [],
  eyebrow,
  readMoreLabel,
  title,
  viewAllHref,
  viewAllLabel,
}) {
  if (!guides.length) return null;

  return (
    <section className="mt-10 grid gap-5 md:mt-12">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-muted shadow-[0_6px_18px_rgba(22,32,51,0.04)]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary/85" />
            {eyebrow}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold leading-[1.08] tracking-tight text-ink">
            {title}
          </h2>
          {description ? <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{description}</p> : null}
        </div>

        <Link
          className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-ink/72 transition hover:text-secondary-dark"
          href={viewAllHref}
        >
          {viewAllLabel}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <FeedGuideCard badgeLabel={badgeLabel} guide={guide} key={guide.slug} readMoreLabel={readMoreLabel} />
        ))}
      </div>
    </section>
  );
}
